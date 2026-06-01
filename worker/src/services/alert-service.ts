import { Resend } from 'resend';
import { logger } from '../utils/logger';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const fromEmail = process.env.FROM_EMAIL || 'alerts@api-monitor.local';

export async function sendEmailAlert(
  to: string,
  monitorName: string,
  monitorUrl: string,
  status: 'down' | 'up',
  error?: string,
  responseTime?: number,
  statusCode?: number
): Promise<boolean> {
  if (!resend) {
    logger.warn('Resend not configured, skipping email', { to, monitorName });
    return false;
  }

  try {
    const subject = status === 'down'
      ? `🔴 ALERT: ${monitorName} is DOWN`
      : `🟢 RESOLVED: ${monitorName} is back UP`;

    const html = status === 'down'
      ? `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="color:#ef4444;">🔴 Service Alert</h2>
          <p><strong>${monitorName}</strong> is currently <strong style="color:#ef4444;">DOWN</strong>.</p>
          <table style="width:100%;border-collapse:collapse;margin:20px 0;">
            <tr><td style="padding:8px;border:1px solid #e5e7eb;"><strong>URL</strong></td><td style="padding:8px;border:1px solid #e5e7eb;">${monitorUrl}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb;"><strong>Status</strong></td><td style="padding:8px;border:1px solid #e5e7eb;">${statusCode || 'N/A'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb;"><strong>Response Time</strong></td><td style="padding:8px;border:1px solid #e5e7eb;">${responseTime || 'N/A'}ms</td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb;"><strong>Error</strong></td><td style="padding:8px;border:1px solid #e5e7eb;">${error || 'Unknown'}</td></tr>
          </table>
          <p style="color:#6b7280;font-size:12px;">Sent by API Monitor SaaS</p>
        </div>`
      : `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="color:#22c55e;">🟢 Service Recovered</h2>
          <p><strong>${monitorName}</strong> is back <strong style="color:#22c55e;">UP</strong>.</p>
          <table style="width:100%;border-collapse:collapse;margin:20px 0;">
            <tr><td style="padding:8px;border:1px solid #e5e7eb;"><strong>URL</strong></td><td style="padding:8px;border:1px solid #e5e7eb;">${monitorUrl}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb;"><strong>Status</strong></td><td style="padding:8px;border:1px solid #e5e7eb;">${statusCode || 'N/A'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb;"><strong>Response Time</strong></td><td style="padding:8px;border:1px solid #e5e7eb;">${responseTime || 'N/A'}ms</td></tr>
          </table>
          <p style="color:#6b7280;font-size:12px;">Sent by API Monitor SaaS</p>
        </div>`;

    await resend.emails.send({ from: fromEmail, to, subject, html });
    logger.info(`Email alert sent to ${to}`, { monitorName, status });
    return true;

  } catch (error) {
    logger.error('Failed to send email alert', { error, to, monitorName });
    return false;
  }
}
