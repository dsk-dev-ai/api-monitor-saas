import axios, { AxiosError } from 'axios';
import { logger } from '../utils/logger';

export interface CheckResult {
  status: 'up' | 'down' | 'degraded';
  statusCode?: number;
  responseTime: number;
  error?: string;
}

export async function executeCheck(
  url: string,
  method: string = 'GET',
  headers: Record<string, string> = {},
  body?: string,
  timeout: number = 30000,
  expectedStatus?: number,
  expectedKeyword?: string
): Promise<CheckResult> {
  const startTime = Date.now();

  try {
    const response = await axios({
      method: method as any,
      url,
      headers: {
        'User-Agent': 'API-Monitor/1.0',
        ...headers,
      },
      data: body,
      timeout,
      maxRedirects: 5,
      validateStatus: () => true,
    });

    const responseTime = Date.now() - startTime;
    const statusCode = response.status;

    if (expectedStatus && statusCode !== expectedStatus) {
      return {
        status: 'down',
        statusCode,
        responseTime,
        error: `Expected status ${expectedStatus}, got ${statusCode}`,
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

    if (error instanceof AxiosError) {
      if (error.code === 'ECONNABORTED') {
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
  }
}
