import Link from 'next/link';
import { ArrowUpRight, Shield, Clock, Zap, Layout, Activity, TrendingUp, Users, Settings } from 'lucide-react';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Powerful API Monitoring Features
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Comprehensive API monitoring solution designed for developers and teams who demand reliability, performance, and security from their APIs.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Real-time Monitoring */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white ml-4">
                  Real-time Monitoring
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Monitor your APIs 24/7 with instant alerts when issues arise. Get notified immediately via email, SMS, Slack, or webhook when your APIs experience downtime, slow response times, or errors.
              </p>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span>• </span>
                <span>Sub-second detection</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span>• </span>
                <span>Global monitoring locations</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span>• </span>
                <span>Customizable alert thresholds</span>
              </div>
            </div>

            {/* Performance Analytics */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white ml-4">
                  Performance Analytics
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Deep insights into your API performance with detailed metrics, historical trends, and benchmarking capabilities. Identify bottlenecks and optimize your APIs for maximum performance.
              </p>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span>• </span>
                <span>Response time tracking</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span>• </span>
                <span>Throughput and error rates</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span>• </span>
                <span>Performance benchmarking</span>
              </div>
            </div>

            {/* Uptime SLA Tracking */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white ml-4">
                  Uptime SLA Tracking
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Track your API uptime against SLA commitments with automated reporting. Generate compliance reports and demonstrate reliability to stakeholders and customers.
              </p>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span>• </span>
                <span>SLA compliance reporting</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span>• </span>
                <span>Historical uptime data</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span>• </span>
                <span>Custom SLA definitions</span>
              </div>
            </div>

            {/* Error Detection & Diagnosis */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white ml-4">
                  Error Detection & Diagnosis
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Advanced error detection with detailed diagnostics including status codes, response headers, and response bodies. Quickly identify and troubleshoot API issues before they impact your users.
              </p>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span>• </span>
                <span>HTTP status code monitoring</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span>• </span>
                <span>Response body analysis</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span>• </span>
                <span>Header inspection</span>
              </div>
            </div>

            {/* Security Monitoring */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white ml-4">
                  Security Monitoring
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Monitor your APIs for security vulnerabilities and suspicious activities. Detect potential threats including unauthorized access attempts, data breaches, and anomalous behavior patterns.
              </p>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span>• </span>
                <span>SSL certificate monitoring</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span>• </span>
                <span>Unauthorized access detection</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span>• </span>
                <span>Security header validation</span>
              </div>
            </div>

            {/* Customizable Dashboards */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center">
                  <Layout className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white ml-4">
                  Customizable Dashboards
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Create personalized dashboards with drag-and-drop widgets to visualize the metrics that matter most to you and your team. Share insights with stakeholders through public or private links.
              </p>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span>• </span>
                <span>Drag-and-drop interface</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span>• </span>
                <span>Custom widget creation</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span>• </span>
                <span>Shareable dashboard links</span>
              </div>
            </div>

            {/* Team Collaboration */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-teal-500/10 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white ml-4">
                  Team Collaboration
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Collaborate effectively with role-based access controls, incident management, and shared incident timelines. Keep your entire team informed and aligned during API incidents.
              </p>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span>• </span>
                <span>Role-based permissions</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span>• </span>
                <span>Incident management</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span>• </span>
                <span>Shared incident timelines</span>
              </div>
            </div>

            {/* API Documentation Integration */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <Settings className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white ml-4">
                  API Documentation Integration
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Seamlessly integrate with your existing API documentation (OpenAPI/Swagger, Postman collections, etc.) to automatically validate responses against schemas and detect breaking changes.
              </p>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span>• </span>
                <span>OpenAPI/Swagger validation</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span>• </span>
                <span>Postman collection support</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span>• </span>
                <span>Schema drift detection</span>
              </div>
            </div>

            {/* Advanced Alerting */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-rose-500/10 rounded-lg flex items-center justify-center">
                  <ArrowUpRight className="w-6 h-6 text-rose-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white ml-4">
                  Advanced Alerting
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Intelligent alerting system with deduplication, escalation policies, and smart notification routing. Reduce alert fatigue while ensuring critical issues never go unnoticed.
              </p>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span>• </span>
                <span>Alert deduplication</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span>• </span>
                <span>Escalation policies</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span>• </span>
                <span>Smart notification routing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to monitor your APIs with confidence?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Start monitoring your APIs today and gain the insights you need to deliver exceptional user experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/(marketing)/pricing" className="flex-1 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              View Pricing
            </Link>
            <Link href="/(auth)/sign-up" className="flex-1 px-8 py-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium">
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}