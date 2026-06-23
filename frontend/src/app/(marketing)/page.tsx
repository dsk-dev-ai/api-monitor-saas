import Link from 'next/link';
import { MotionProps, motion, Variants } from 'framer-motion';
import { ArrowUpRight, ShieldCheck, Zap, Clock, Database, Layers2 } from 'lucide-react';

export const metadata = {
  title: 'API Monitor - Real-time API Monitoring & Alerting',
  description: 'Monitor your APIs in real-time with instant alerts, performance analytics, and uptime tracking. Never miss an API issue again.',
};

const fadeIn: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  exit: { opacity: 0, y: -20 },
};

const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function MarketingHomePage() {
  return (
    <main className="min-h-screen bg-white text-gray-900 antialiased">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center">
            <h1 className="mb-6 text-4xl font-bold text-gray-900 sm:text-5xl">
              Monitor Your APIs in Real-Time
            </h1>
            <p className="mb-8 max-w-2xl mx-auto text-lg text-gray-600">
              Get instant alerts when your APIs go down, slow down, or return errors. 
              Track performance, uptime, and reliability with powerful analytics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 sm:px-8"
              >
                Get Started Free
              </Link>
              <Link
                href="/features"
                className="flex-1 border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-medium py-3 px-6 rounded-lg transition-colors duration-200 sm:px-8"
              >
                See Features
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Powerful Features for API Excellence
            </h2>
            <p className="max-w-2xl mx-auto text-gray-600">
              Everything you need to monitor, analyze, and optimize your APIs
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <motion.div
              variants={fadeIn}
              className="p-6 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-300"
              custom={1}
            >
              <div className="mb-4">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Real-time Monitoring
              </h3>
              <p className="text-gray-600">
                Monitor API endpoints every minute with instant notifications when issues are detected.
              </p>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="p-6 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-300"
              custom={2}
            >
              <div className="mb-4">
                <ShieldCheck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Intelligent Alerting
              </h3>
              <p className="text-gray-600">
                Smart alerting with deduplication, escalation policies, and multiple notification channels.
              </p>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="p-6 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-300"
              custom={3}
            >
              <div className="mb-4">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Performance Analytics
              </h3>
              <p className="text-gray-600">
                Deep insights into response times, throughput, and error rates with historical trends.
              </p>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="p-6 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-300"
              custom={4}
            >
              <div className="mb-4">
                <Database className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Uptime SLA Tracking
              </h3>
              <p className="text-gray-600">
                Track service level agreements with detailed uptime reports and compliance reporting.
              </p>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="p-6 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-300"
              custom={5}
            >
              <div className="mb-4">
                <Layers2 className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Multi-region Monitoring
              </h3>
              <p className="text-gray-600">
                Monitor from multiple geographic locations to ensure global availability and performance.
              </p>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="p-6 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-300"
              custom={6}
            >
              <div className="mb-4">
                <ArrowUpRight className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Public Status Pages
              </h3>
              <p className="text-gray-600">
                Beautiful, customizable status pages to keep your users informed during incidents.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              How API Monitor Works
            </h2>
            <p className="max-w-2xl mx-auto text-gray-600">
              Simple setup, powerful monitoring. Get started in minutes.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
            <motion.div
              variants={fadeIn}
              className="text-center p-8 bg-white rounded-xl border border-gray-100"
              custom={1}
            >
              <div className="mb-6">
                <div className="inline-flex h-12 w-12 items-center justify-center bg-blue-50 rounded-lg">
                  <div className="h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center">
                    1
                  </div>
                </div>
              </div>
              <h3 className="mb-4 text-xl font-semibold text-gray-900">
                Add Your Endpoints
              </h3>
              <p className="text-gray-600">
                Simply add your API endpoints with URL, method, headers, and expected responses.
              </p>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="text-center p-8 bg-white rounded-xl border border-gray-100"
              custom={2}
            >
              <div className="mb-6">
                <div className="inline-flex h-12 w-12 items-center justify-center bg-blue-50 rounded-lg">
                  <div className="h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center">
                    2
                  </div>
                </div>
              </div>
              <h3 className="mb-4 text-xl font-semibold text-gray-900">
                Set Monitoring Rules
              </h3>
              <p className="text-gray-600">
                Configure alert thresholds, notification channels, and monitoring frequency.
              </p>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="text-center p-8 bg-white rounded-xl border border-gray-100"
              custom={3}
            >
              <div className="mb-6">
                <div className="inline-flex h-12 w-12 items-center justify-center bg-blue-50 rounded-lg">
                  <div className="h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center">
                    3
                  </div>
                </div>
              </div>
              <h3 className="mb-4 text-xl font-semibold text-gray-900">
                Get Alerts & Insights
              </h3>
              <p className="text-gray-600">
                Receive instant alerts and access detailed analytics when issues are detected.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <h2 className="mb-6 text-3xl font-bold text-white">
            Ready to Monitor Your APIs?
          </h2>
          <p className="mb-8 max-w-2xl mx-auto text-blue-50">
            Start your free trial today and never miss an API issue again.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-white text-blue-600 hover:bg-blue-50 font-medium py-3 px-8 rounded-lg transition-colors duration-200"
          >
            Start Free Trial
          </Link>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start sm:gap-12">
            <div className="text-center sm:text-left">
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                API Monitor
              </h3>
              <p className="text-gray-600">
                Real-time API monitoring and alerting platform built for developers and DevOps teams.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-8 sm:justify-start">
              <div className="space-y-2">
                <h4 className="mb-2 text-sm font-medium text-gray-900">
                  Product
                </h4>
                <nav className="space-y-1">
                  <Link href="/features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    Features
                  </Link>
                  <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    Pricing
                  </Link>
                  <Link href="/docs" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    Documentation
                  </Link>
                </nav>
              </div>
              
              <div className="space-y-2">
                <h4 className="mb-2 text-sm font-medium text-gray-900">
                  Company
                </h4>
                <nav className="space-y-1">
                  <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    About Us
                  </Link>
                  <Link href="/blog" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    Blog
                  </Link>
                  <Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    Contact
                  </Link>
                </nav>
              </div>
              
              <div className="space-y-2">
                <h4 className="mb-2 text-sm font-medium text-gray-900">
                  Legal
                </h4>
                <nav className="space-y-1">
                  <Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    Terms of Service
                  </Link>
                  <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    Privacy Policy
                  </Link>
                </nav>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} API Monitor. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}