import axios, { AxiosError, AxiosResponse, Method } from 'axios';
import http from 'node:http';
import https from 'node:https';
import {
  createGuardedLookup,
  isRejectedTarget,
  MAX_REDIRECTS,
  REDIRECT_STATUSES,
  SsrfBlockedError,
  validateMonitorTarget,
} from '../security/ssrf-policy';
import { logger } from '../utils/logger';

export interface CheckResult {
  status: 'up' | 'down' | 'degraded';
  statusCode?: number;
  responseTime: number;
  error?: string;
}

/**
 * Perform one HTTP request that cannot be redirected by the HTTP client.
 *
 * `maxRedirects: 0` makes axios use Node's native `http`/`https` transport instead of
 * `follow-redirects`, so the only destination this can reach is the one in `target`.
 * The agents carry a guarded `lookup` so the address dialled is the address that was
 * classified, which is what prevents a name from being re-resolved to something else
 * between the check and the connection.
 *
 * A fresh agent pair is built per request. Agents pool sockets, and a pooled socket
 * would be reused for a destination whose policy decision was made earlier in the
 * cycle; `keepAlive: false` keeps each attempt's decision bound to that attempt.
 */
function requestOnce(
  target: string,
  method: Method,
  headers: Record<string, string>,
  body: string | undefined,
  timeout: number,
  signal: AbortSignal,
  onBlocked: (detail: string) => void
): Promise<AxiosResponse> {
  const guardedLookup = createGuardedLookup(onBlocked);
  return axios({
    method,
    url: target,
    headers: {
      'User-Agent': 'API-Monitor/1.0',
      ...headers,
    },
    data: body,
    timeout,
    maxRedirects: 0,
    validateStatus: () => true,
    signal,
    // Never honour proxy environment variables. A configured HTTP_PROXY would send
    // the request to a proxy whose address is not the destination this policy
    // approved, and the proxy's own DNS would be doing the resolving.
    proxy: false,
    httpAgent: new http.Agent({ keepAlive: false, lookup: guardedLookup }),
    httpsAgent: new https.Agent({ keepAlive: false, lookup: guardedLookup }),
  });
}

/**
 * Resolve a `Location` header against the URL that produced it.
 *
 * Returns null when the result is not an absolute http(s) URL, which covers both a
 * malformed header and a downgrade attempt through a scheme we do not support.
 */
function resolveRedirect(current: string, location: string | undefined): string | null {
  if (!location) return null;
  let next: URL;
  try {
    next = new URL(location, current);
  } catch {
    return null;
  }
  return next.toString();
}

/**
 * Decide which caller-supplied headers may travel to the next hop.
 *
 * Headers are bound to the origin they were configured for. `follow-redirects`, which
 * the executor used before it walked redirects itself, dropped `Authorization`,
 * `Proxy-Authorization` and `Cookie` at an origin boundary; a hand-rolled loop that
 * dropped nothing would be a regression against that.
 *
 * This is deliberately stricter than the client it replaces. `follow-redirects` had to
 * enumerate known credential headers, and any caller header can be a credential
 * (`X-Api-Key`, `X-Auth-Token`, and every vendor's variant), so an enumeration that
 * misses one leaks silently. The monitor's own `Authorization` header is the common
 * case and is exactly what this exists to stop.
 */
interface HopHeaders {
  headers: Record<string, string>;
  dropped: boolean;
}

function headersForHop(
  headers: Record<string, string>,
  fromUrl: string,
  toUrl: string,
  alreadyDropped: boolean
): HopHeaders {
  const from = new URL(fromUrl);
  const to = new URL(toUrl);
  if (from.origin === to.origin && !alreadyDropped) {
    return { headers, dropped: false };
  }
  // The drop is sticky. Recomputing from the original headers on every hop would let a
  // chain of A -> B -> B/page restore the credentials on the third request, because that
  // hop is same-origin with B. Once a chain has left the origin the user configured, the
  // credentials are gone for the rest of it.
  if (!alreadyDropped) {
    logger.warn('Dropping caller headers on cross-origin redirect', {
      from: from.origin,
      to: to.origin,
    });
  }
  return { headers: {}, dropped: true };
}

export async function executeCheck(
  url: string,
  method: Method = 'GET',
  headers: Record<string, string> = {},
  body?: string,
  timeout: number = 30000,
  expectedStatus?: number,
  expectedKeyword?: string
): Promise<CheckResult> {
  const startTime = Date.now();

  // One deadline for the whole attempt, redirects included, so a chain of hops
  // cannot multiply the time a single monitor occupies.
  const controller = new AbortController();
  const deadline = setTimeout(() => controller.abort(), timeout);
  // 303, and 301/302 in practice, turn the follow-up into a GET. Preserving the
  // original method against a new origin would re-send the caller's body somewhere
  // they did not intend.
  let currentMethod = method;
  let currentBody = body;
  let currentUrl: string;
  let currentHeaders = headers;
  let headersDropped = false;
  /**
   * Set when the connect-time guard refuses a destination. Tracked here rather than
   * read off the thrown error, because the HTTP client replaces socket errors with
   * its own and would otherwise both mask the refusal and surface the detail text.
   */
  let blockedDetail: string | null = null;

  try {
    let validation = await validateMonitorTarget(url);
    if (isRejectedTarget(validation)) {
      // The reason is useful to whoever operates this; it names an internal address,
      // so it goes to the log and never to the user.
      logger.warn(`Monitor target refused: ${validation.detail}`, {
        code: validation.code,
      });
      return {
        status: 'down',
        responseTime: Date.now() - startTime,
        error: validation.publicMessage,
      };
    }
    currentUrl = validation.url.toString();

    let response: AxiosResponse;
    for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
      response = await requestOnce(
        currentUrl,
        currentMethod,
        currentHeaders,
        currentBody,
        timeout,
        controller.signal,
        (detail) => {
          blockedDetail = detail;
        }
      );

      const status = response.status;
      if (!REDIRECT_STATUSES.has(status)) break;

      const location = (response.headers?.location ?? undefined) as string | undefined;
      const next = resolveRedirect(currentUrl, location);

      if (!next) {
        return {
          status: 'down',
          statusCode: status,
          responseTime: Date.now() - startTime,
          error: 'Redirect could not be followed safely.',
        };
      }

      if (hop === MAX_REDIRECTS) {
        return {
          status: 'down',
          statusCode: status,
          responseTime: Date.now() - startTime,
          error: `Too many redirects (limit ${MAX_REDIRECTS}).`,
        };
      }

      // Re-run the full policy on the new destination. This is the step that stops a
      // public host from bouncing the worker onto the private network, and it is
      // why the client is never allowed to follow redirects itself.
      validation = await validateMonitorTarget(next);
      if (isRejectedTarget(validation)) {
        logger.warn(`Redirect target refused: ${validation.detail}`, {
          code: validation.code,
          from: currentUrl,
        });
        return {
          status: 'down',
          statusCode: status,
          responseTime: Date.now() - startTime,
          error: validation.publicMessage,
        };
      }

      // A 307/308 preserves the method *and* the body by definition, so a cross-origin
      // one would re-send the monitor's request body to a host the user never named.
      // Dropping the body would instead make the check report on a request the user did
      // not configure, which is a wrong result rather than a failed one. Refuse.
      if (
        (status === 307 || status === 308) &&
        currentBody !== undefined &&
        new URL(currentUrl).origin !== new URL(next).origin
      ) {
        logger.warn('Refusing cross-origin 307/308 with a request body', {
          from: new URL(currentUrl).origin,
          to: new URL(next).origin,
        });
        return {
          status: 'down',
          statusCode: status,
          responseTime: Date.now() - startTime,
          error: 'Refusing to re-send a request body to a different origin on a 307/308 redirect.',
        };
      }

      // Resolved against the hop we just left, so the comparison has to happen before
      // `currentUrl` is advanced.
      const hopHeaders = headersForHop(headers, currentUrl, next, headersDropped);
      currentHeaders = hopHeaders.headers;
      headersDropped = hopHeaders.dropped;
      currentUrl = validation.url.toString();
      if (status === 303 || ((status === 301 || status === 302) && currentMethod !== 'HEAD')) {
        currentMethod = 'GET';
        currentBody = undefined;
      }
    }

    const responseTime = Date.now() - startTime;
    const statusCode = response.status;

    // Determine whether the response status is acceptable.
    // - If an explicit expectedStatus is given, require an exact match.
    // - Otherwise (blank), default to "any 2xx" as documented in the UI.
    const statusOk = expectedStatus
      ? statusCode === expectedStatus
      : statusCode >= 200 && statusCode < 300;

    if (!statusOk) {
      const expectedLabel = expectedStatus
        ? `Expected status ${expectedStatus}, got ${statusCode}`
        : `Expected 2xx status, got ${statusCode}`;
      return {
        status: 'down',
        statusCode,
        responseTime,
        error: expectedLabel,
      };
    }

    if (expectedKeyword) {
      const bodyText = typeof response.data === 'string'
        ? response.data
        : JSON.stringify(response.data);

      if (!bodyText.includes(expectedKeyword)) {
        return {
          status: 'down',
          statusCode,
          responseTime,
          error: `Expected keyword "${expectedKeyword}" not found`,
        };
      }
    }

    if (responseTime > timeout * 0.8) {
      return { status: 'degraded', statusCode, responseTime };
    }

    return { status: 'up', statusCode, responseTime };

  } catch (error) {
    const responseTime = Date.now() - startTime;

    // A refusal at connect time. This is the DNS-rebinding path: the name passed the
    // pre-flight check and resolved to a restricted address when the socket was
    // dialled. `blockedDetail` carries the operator-facing reason for the log; the
    // user gets the same generic message as any other restricted destination, so the
    // internal address never reaches them.
    if (blockedDetail !== null || error instanceof SsrfBlockedError) {
      logger.warn(`Monitor target refused at connect time: ${blockedDetail ?? 'blocked'}`);
      return {
        status: 'down',
        responseTime,
        error: 'Monitor target resolves to a restricted network destination.',
      };
    }

    if (error instanceof AxiosError) {
      if (error.code === 'ECONNABORTED' || error.code === 'ERR_CANCELED') {
        return { status: 'down', responseTime, error: `Request timed out after ${timeout}ms` };
      }
      if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        return { status: 'down', responseTime, error: `Connection failed: ${error.message}` };
      }
      if (error.code === 'CERT_HAS_EXPIRED') {
        return { status: 'down', responseTime, error: 'SSL certificate expired' };
      }
      return { status: 'down', statusCode: error.response?.status, responseTime, error: error.message };
    }

    return { status: 'down', responseTime, error: error instanceof Error ? error.message : 'Unknown error' };
  } finally {
    clearTimeout(deadline);
  }
}
