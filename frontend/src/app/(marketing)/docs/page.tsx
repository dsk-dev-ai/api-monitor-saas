import Link from 'next/link';

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
              <p>API Monitor is a powerful monitoring solution designed for developers and DevOps teams who need to ensure their APIs are performing optimally. Our platform provides real-time insights into API availability, response times, error rates, and more.</p>
              
              <h3 className="text-lg font-medium text-gray-900 mt-6 mb-2">
                Key Features
              </h3>
              <ul className="list-disc list-inside mt-2">
                <li><strong>Real-time Monitoring:</strong> Track API performance with sub-second updates</li>
                <li><strong>Multi-protocol Support:</strong> Monitor REST, GraphQL, SOAP, and WebSocket APIs</li>
                <li><strong>Alerting System:</strong> Get notified via email, SMS, Slack, or webhook when issues arise</li>
                <li><strong>Performance Analytics:</strong> Deep dive into response times, throughput, and error patterns</li>
                <li><strong>SLA Tracking:</strong> Monitor compliance with your service level agreements</li>
                <li><strong>Team Collaboration:</strong> Share dashboards and collaborate with team members</li>
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
                <li>Configure monitoring frequency (from every 10 seconds to once daily)</li>
                <li>Set up alert conditions (response time thresholds, error rates, etc.)</li>
                <li>Choose notification channels for alerts</li>
                <li>Save your monitor</li>
              </ol>
              
              <h3 className="text-lg font-medium text-gray-900 mt-6 mb-2">
                2. Understanding Monitor Types
              </h3>
              <div className="mt-4">
                <h4 className="text-base font-medium text-gray-900 mb-1">HTTP/HTTPS Monitors</h4>
                <p>Standard web API monitoring for REST, GraphQL, and other HTTP-based services.</p>
                
                <h4 className="text-base font-medium text-gray-900 mb-1 mt-4">SSL Certificate Monitors</h4>
                <p>Monitor SSL certificate expiration and validity for your domains.</p>
                
                <h4 className="text-base font-medium text-gray-900 mb-1 mt-4">TCP/Port Monitors</h4>
                <p>Monitor availability of specific ports and TCP services.</p>
                
                <h4 className="text-base font-medium text-gray-900 mb-1 mt-4">DNS Monitors</h4>
                <p>Monitor DNS resolution and response times for your domains.</p>
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
                Custom Alert Rules
              </h3>
              <p>Create sophisticated alert conditions using our rule builder:</p>
              <ul className="list-disc list-inside mt-2">
                <li>Response time thresholds (average, percentile, max)</li>
                <li>Error rate monitoring (HTTP 4xx, 5xx, connection errors)</li>
                <li>Content validation (check for specific strings or JSON values)</li>
                <li>Status code monitoring (alert on specific HTTP status codes)</li>
                <li>Header validation (verify response headers contain expected values)</li>
              </ul>
              
              <h3 className="text-lg font-medium text-gray-900 mt-6 mb-2">
                Integrations
              </h3>
              <p>API Monitor integrates with popular tools and services:</p>
              <ul className="list-disc list-inside mt-2">
                <li><strong>Communication:</strong> Slack, Microsoft Teams, Discord, Email, SMS</li>
                <li><strong>Incident Management:</strong> PagerDuty, Opsgenie, VictorOps</li>
                <li><strong>Logging &amp; Analytics:</strong> Datadog, New Relic, Splunk, ELK Stack</li>
                <li><strong>CI/CD:</strong> GitHub Actions, GitLab CI, Jenkins, CircleCI</li>
                <li><strong>Infrastructure:</strong> AWS CloudWatch, Azure Monitor, Google Cloud Monitoring</li>
              </ul>
              
              <h3 className="text-lg font-medium text-gray-900 mt-6 mb-2">
                API Access
              </h3>
              <p>Programmatically manage your monitors and retrieve monitoring data:</p>
              <div className="bg-white rounded-lg border border-gray-200 p-4 mt-4">
                <pre className="text-sm font-mono text-gray-800"><code className="language-bash">{`# Get all monitors
curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://api.api-monitor.com/v1/monitors

# Create a new monitor
curl -X POST -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "My API",
    "url": "https://api.example.com/health",
    "method": "GET",
    "interval": 30
  }' \\
  https://api.api-monitor.com/v1/monitors

# Get monitoring results
curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://api.api-monitor.com/v1/monitors/123/results`}</code></pre>
              </div>
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
                  <li>Firewall blocking our monitoring IPs</li>
                  <li>Rate limiting on your API</li>
                  <li>DNS resolution issues from our monitoring locations</li>
                  <li>SSL certificate trust issues</li>
                </ul>
                <p className="mt-2">Solution: Whitelist our monitoring IPs or adjust your rate limits.</p>
                
                <h4 className="text-base font-medium text-gray-900 mb-1 mt-4">Receiving Too Many Alerts</h4>
                <p className="mb-2">To reduce alert noise:</p>
                <ul className="list-disc list-inside">
                  <li>Increase alert thresholds slightly</li>
                  <li>Enable alert suppression for flapping monitors</li>
                  <li>Use alert grouping to combine related notifications</li>
                  <li>Set up maintenance windows for expected downtime</li>
                </ul>
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 mt-6 mb-2">
                Getting Help
              </h3>
              <p>If you need additional assistance:</p>
              <ul className="list-disc list-inside mt-2">
                <li>Check our <a href="/status" className="text-blue-600 hover:underline">status page</a> for any ongoing incidents</li>
                <li>Visit our <a href="/docs/faq" className="text-blue-600 hover:underline">FAQ</a> for common questions</li>
                <li>Contact support at <a href="mailto:support@api-monitor.com" className="text-blue-600 hover:underline">support@api-monitor.com</a></li>
                <li>Join our community forum at <a href="https://community.api-monitor.com" className="text-blue-600 hover:underline">community.api-monitor.com</a></li>
              </ul>
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
                    Monitoring frequency depends on your plan:
                    <br />
                    • Free tier: Every 5 minutes
                    <br />
                    • Pro tier: Every 30 seconds
                    <br />
                    • Business tier: Every 10 seconds
                    <br />
                    • Enterprise tier: Every 1 second (with global distribution)
                  </p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    What monitoring locations are available?
                  </h3>
                  <p className="text-gray-700">
                    We monitor from 20+ global locations including:
                    <br />
                    • North America: New York, San Francisco, Toronto
                    <br />
                    • Europe: London, Frankfurt, Amsterdam
                    <br />
                    • Asia-Pacific: Singapore, Tokyo, Sydney
                    <br />
                    • South America: São Paulo
                    <br />
                    • Africa: Johannesburg
                  </p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Is my data secure and private?
                  </h3>
                  <p className="text-gray-700">
                    Yes, we take data security seriously:
                    <br />
                    • All data is encrypted in transit (TLS 1.3) and at rest (AES-256)
                    <br />
                    • Regular security audits and penetration testing
                    <br />
                    • GDPR, SOC 2 Type II, and ISO 27001 compliant
                    <br />
                    • You own your data and can export or delete it anytime
                  </p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Can I monitor internal/private APIs?
                  </h3>
                  <p className="text-gray-700">
                    Yes! You have two options:
                    <br />
                    1. <strong>Public endpoints:</strong> Expose health check endpoints publicly
                    <br />
                    2. <strong>Private agents:</strong> Deploy our lightweight agent in your VPC or on-premise to monitor internal services
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