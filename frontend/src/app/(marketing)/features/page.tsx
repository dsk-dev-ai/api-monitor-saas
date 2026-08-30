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
              Comprehensive API monitoring solution designed for developers and teams who demand reliability and performance from their APIs.
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
                  HTTP Monitoring
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Monitor your HTTP API endpoints around the clock with checks run from a background worker. Get email alerts when a check fails or a monitor changes status.
              </p>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span>• </span>
                <span>Configurable check intervals</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span>• </span>
                <span>Expected status &amp; keyword validation</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span>• </span>
                <span>Pause or resume monitors anytime</span>
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
                Track uptime and response-time metrics for your APIs with historical trends on the analytics dashboard.
              </p>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span>• </span>
                <span>Response-time tracking</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span>• </span>
                <span>Uptime percentage per monitor</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span>• </span>
                <span>Historical trends</span>
              </div>
            </div>

            {/* Uptime Tracking */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white ml-4">
                  Uptime Tracking
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                See uptime for each monitor over time and review historical uptime data on the analytics dashboard.
              </p>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span>• </span>
                <span>Per-monitor uptime percentage</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span>• </span>
                <span>Historical uptime data</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span>• </span>
                <span>Alert history</span>
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
                Detect failures with expected status codes and optional response keyword validation, and review triggered alerts in the dashboard.
              </p>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span>• </span>
                <span>HTTP status code checks</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span>• </span>
                <span>Response keyword validation</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span>• </span>
                <span>Alert on down, degraded, or recovery</span>
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
                SSL certificate checks and security monitoring are on our roadmap.
              </p>
              <div className="inline-flex items-center rounded-full bg-purple-100 dark:bg-purple-900/40 px-3 py-1 text-xs font-medium text-purple-700 dark:text-purple-300">
                Planned
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
                Drag-and-drop customizable dashboards are on our roadmap. Today, the analytics dashboard shows uptime and response-time metrics.
              </p>
              <div className="inline-flex items-center rounded-full bg-indigo-100 dark:bg-indigo-900/40 px-3 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300">
                Planned
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
                Full team collaboration features are on our roadmap.
              </p>
              <div className="inline-flex items-center rounded-full bg-teal-100 dark:bg-teal-900/40 px-3 py-1 text-xs font-medium text-teal-700 dark:text-teal-300">
                Planned
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
                Response validation against OpenAPI schemas and API documentation integration are on our roadmap.
              </p>
              <div className="inline-flex items-center rounded-full bg-orange-100 dark:bg-orange-900/40 px-3 py-1 text-xs font-medium text-orange-700 dark:text-orange-300">
                Planned
              </div>
            </div>

            {/* Advanced Alerting */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-rose-500/10 rounded-lg flex items-center justify-center">
                  <ArrowUpRight className="w-6 h-6 text-rose-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white ml-4">
                  Email Alerting
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Receive email alerts when a monitor goes down, is degraded, or recovers, and review the full alert history in the dashboard.
              </p>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span>• </span>
                <span>Alerts on down, degraded, and recovery</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span>• </span>
                <span>Triggered &amp; resolved states</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span>• </span>
                <span>Acknowledge alerts from the dashboard</span>
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
            <Link href="/pricing" className="flex-1 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              View Pricing
            </Link>
            <Link href="/signup" className="flex-1 px-8 py-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium">
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}