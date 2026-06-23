import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'API Monitor Blog - Stay Updated on API Monitoring Best Practices',
  description: 'Read our latest articles on API monitoring, performance optimization, and DevOps best practices from the API Monitor team.',
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-6">
            API Monitor Blog
          </h1>
          <p className="text-xl opacity-90 max-w-2xl">
            Stay ahead with expert insights on API monitoring, performance optimization, and DevOps best practices. Learn how to build more reliable, scalable applications.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link 
              href="/blog/api-monitoring-best-practices" 
              className="bg-white/20 hover:bg-white/25 px-6 py-3 rounded-lg backdrop-blur-sm transition-all"
            >
              Latest Posts
            </Link>
            <Link 
              href="/blog/category/devops" 
              className="border border-white/20 hover:border-white/30 px-6 py-3 rounded-lg backdrop-blur-sm transition-all"
            >
              DevOps Insights
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Latest Articles
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Expert insights and practical guides to help you master API monitoring and improve your application reliability.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Post 1 */}
            <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-500">
                <div className="flex h-full items-center justify-center text-white text-2xl font-bold">
                  📊
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                    API Monitoring
                  </span>
                  <span className="text-xs text-gray-500">• Jun 5, 2026</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  10 Essential API Monitoring Best Practices for 2026
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  Learn the critical API monitoring strategies that top engineering teams use to ensure 99.9% uptime and optimal performance.
                </p>
                <Link 
                  href="/blog/api-monitoring-best-practices" 
                  className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
                >
                  Read More →
                </Link>
              </div>
            </article>

            {/* Post 2 */}
            <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-green-500 to-emerald-500">
                <div className="flex h-full items-center justify-center text-white text-2xl font-bold">
                  ⚡
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                    Performance
                  </span>
                  <span className="text-xs text-gray-500">• Jun 3, 2026</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  How to Reduce API Latency by 50% with Smart Caching Strategies
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  Discover proven caching techniques that dramatically improve response times while reducing server load and costs.
                </p>
                <Link 
                  href="/blog/reduce-api-latency-caching" 
                  className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
                >
                  Read More →
                </Link>
              </div>
            </article>

            {/* Post 3 */}
            <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-purple-500 to-indigo-500">
                <div className="flex h-full items-center justify-center text-white text-2xl font-bold">
                  🔒
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-purple-100 text-purple-800 text-xs font-medium px-3 py-1 rounded-full">
                    Security
                  </span>
                  <span className="text-xs text-gray-500">• May 31, 2026</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  Securing Your APIs: Authentication, Rate Limiting, and Threat Detection
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  Comprehensive guide to implementing robust API security measures that protect against common vulnerabilities and attacks.
                </p>
                <Link 
                  href="/blog/api-security-guide" 
                  className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
                >
                  Read More →
                </Link>
              </div>
            </article>

            {/* Post 4 */}
            <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-orange-500 to-amber-500">
                <div className="flex h-full items-center justify-center text-white text-2xl font-bold">
                  📈
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-orange-100 text-orange-800 text-xs font-medium px-3 py-1 rounded-full">
                    Analytics
                  </span>
                  <span className="text-xs text-gray-500">• May 28, 2026</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  Using API Metrics to Drive Business Decisions and Improve User Experience
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  Learn how to translate technical API data into actionable business insights that improve customer satisfaction and retention.
                </p>
                <Link 
                  href="/blog/api-metrics-business-decisions" 
                  className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
                >
                  Read More →
                </Link>
              </div>
            </article>

            {/* Post 5 */}
            <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-red-500 to-rose-500">
                <div className="flex h-full items-center justify-center text-white text-2xl font-bold">
                  🛠️
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-3 py-1 rounded-full">
                    Tutorial
                  </span>
                  <span className="text-xs text-gray-500">• May 25, 2026</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  Step-by-Step: Setting Up API Monitoring for Microservices Architecture
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  Practical guide to implementing comprehensive API monitoring in distributed systems with multiple services and dependencies.
                </p>
                <Link 
                  href="/blog/api-monitoring-microservices" 
                  className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
                >
                  Read More →
                </Link>
              </div>
            </article>

            {/* Post 6 */}
            <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-teal-500 to-cyan-500">
                <div className="flex h-full items-center justify-center text-white text-2xl font-bold">
                  💡
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-teal-100 text-teal-800 text-xs font-medium px-3 py-1 rounded-full">
                    Case Study
                  </span>
                  <span className="text-xs text-gray-500">• May 20, 2026</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  How a Fintech Company Reduced Downtime by 75% with API Monitor
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  Real-world example of how proactive API monitoring helped a financial services company prevent costly outages and improve customer trust.
                </p>
                <Link 
                  href="/blog/fintech-case-study" 
                  className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
                >
                  Read More →
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Get Expert API Insights Delivered Weekly
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of developers and DevOps engineers who receive our weekly newsletter with API monitoring tips, performance optimization strategies, and industry trends.
          </p>
          <div className="max-w-xl mx-auto flex flex-col sm:flex-row sm:gap-4">
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full px-6 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:w-auto"
            />
            <button
              className="w-full px-6 py-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors sm:w-auto"
            >
              Subscribe Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
