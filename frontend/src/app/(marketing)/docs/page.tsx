export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          API Monitor Documentation
        </h1>
        
        <div className="space-y-8">
          {/* Getting Started */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Getting Started
            </h2>
            <div className="prose prose-gray max-w-none">
              <p>Welcome to API Monitor - a comprehensive SaaS platform for monitoring your APIs&apos; health, performance, and reliability. This documentation will help you get started quickly and make the most of our platform.</p>
              
              <h3 className="text-lg font-medium text-gray-900 mt-6 mb-2">
                What is API Monitor?
              </h3>
              <p>API Monitor is a monitoring solution for developers and DevOps teams who need to ensure their APIs are performing optimally. Our platform provides insights into API availability, uptime, and response times.</p>
              
              <h3 className="text-lg font-medium text-gray-900 mt-6 mb-2">
                Key Features
              </h3>
              <ul className="list-disc list-inside mt-2">
                <li><strong>HTTP Monitoring:</strong> Periodic health checks on your API endpoints</li>
                <li><strong>Email Alerting:</strong> Get notified via email when a monitor changes status</li>
                <li><strong>Performance Analytics:</strong> Uptime and response-time metrics with historical trends</li>
                <li><strong>Uptime Tracking:</strong> Review uptime over time for every monitor</li>
                <li><strong>Public Status Pages:</strong> Share a public status page per monitor with your users</li>
              </ul>
            </div>
          </section>
          
          {/* Setup Guide */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Setup Guide
            </h2>
            <div className="prose prose-gray max-w-none">
              <h3 className="text-lg font-medium text-gray-900 mt-6 mb-2">
                1. Creating Your First Monitor
              </h3>
              <ol className="list-decimal list-inside mt-2">
                <li>Navigate to the <strong>Monitors</strong> section in your dashboard</li>
                <li>Click the <strong>+ New Monitor</strong> button</li>
                <li>Enter your API endpoint URL</li>
                <li>Select the HTTP method (GET, POST, PUT, DELETE, etc.)</li>
                <li>Configure monitoring frequency</li>
                <li>Set alert conditions (expected status code, keyword validation, alert on down, degraded, or recovery)</li>
                <li>Choose whether to receive email alerts</li>
                <li>Save your monitor</li>
              </ol>
              
              <h3 className="text-lg font-medium text-gray-900 mt-6 mb-2">
                2. Understanding Monitor Types
              </h3>
              <div className="mt-4">
                <h4 className="text-base font-medium text-gray-900 mb-1">HTTP/HTTPS Monitors</h4>
                <p>Monitors run HTTP checks against your API endpoint using a configured method (GET, POST, PUT, DELETE, etc.) and can validate the expected status code and an optional response keyword.</p>
              </div>
            </div>
          </section>
          
          {/* Advanced Features */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Advanced Features
            </h2>
            <div className="prose prose-gray max-w-none">
              <h3 className="text-lg font-medium text-gray-900 mt-6 mb-2">
                Alert Conditions
              </h3>
              <p>Each monitor lets you define when it should alert:</p>
              <ul className="list-disc list-inside mt-2">
                <li>Expected status code (alert when the response does not match)</li>
                <li>Response keyword validation (check that a specific string appears in the response)</li>
                <li>Alert on down, degraded, and recovery</li>
              </ul>
              <p className="mt-2">When a condition is met or cleared, an email alert is sent and recorded in the Alerts section of the dashboard.</p>
              
              <h3 className="text-lg font-medium text-gray-900 mt-6 mb-2">
                Notifications
              </h3>
              <p>Alerts are delivered by email (via Resend). SMS, Slack, and other notification channels are planned but not yet available.</p>
            </div>
          </section>
          
          {/* Troubleshooting */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Troubleshooting
            </h2>
            <div className="prose prose-gray max-w-none">
              <h3 className="text-lg font-medium text-gray-900 mt-6 mb-2">
                Common Issues
              </h3>
              <div className="mt-4">
                <h4 className="text-base font-medium text-gray-900 mb-1">Monitor Shows as Down But API Works</h4>
                <p className="mb-2">This can happen due to:</p>
                <ul className="list-disc list-inside">
                  <li>The response returned an unexpected status code</li>
                  <li>The expected keyword was not found in the response body</li>
                  <li>A network or DNS issue prevented the check from completing</li>
                  <li>A request timeout occurred</li>
                </ul>
                <p className="mt-2">Solution: Review the alert details and adjust the monitor&apos;s expected status code, keyword, or timeout settings.</p>
                
                <h4 className="text-base font-medium text-gray-900 mb-1 mt-4">Receiving Too Many Alerts</h4>
                <p className="mb-2">To reduce alert noise:</p>
                <ul className="list-disc list-inside">
                  <li>Align the expected status code with what your API actually returns</li>
                  <li>Only enable the alert conditions you need</li>
                  <li>Pause the monitor if you expect a temporary outage</li>
                </ul>
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 mt-6 mb-2">
                Getting Help
              </h3>
              <p>If you need additional assistance, contact us at <a href="mailto:support@api-monitor.com" className="text-blue-600 hover:underline">support@api-monitor.com</a>.</p>
            </div>
          </section>
          
          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <div className="prose prose-gray max-w-none">
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    How often can I monitor my APIs?
                  </h3>
                  <p className="text-gray-700">
                    Checks are run in the background by a worker on a schedule you configure per monitor.
                  </p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Where are checks run from?
                  </h3>
                  <p className="text-gray-700">
                    Checks are made from our hosted background worker, so your endpoint must be reachable over the public internet.
                  </p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Is my data secure and private?
                  </h3>
                  <p className="text-gray-700">
                    Data is stored in a Supabase-managed PostgreSQL database, and accounts are secured with Supabase authentication.
                  </p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Can I monitor internal/private APIs?
                  </h3>
                  <p className="text-gray-700">
                    Because checks run from our hosted worker, the endpoint must be reachable over the public internet. For internal services, expose a health check endpoint publicly or route traffic through a tunnel.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}