export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">

      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold">API Monitor</h1>
        <div className="space-x-6">
          <a href="/login" className="text-gray-300 hover:text-white">Login</a>
          <a href="/signup" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
            Get Started
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-24 px-6">
        <h2 className="text-4xl font-bold mb-6">
          Monitor Your APIs in Real Time
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto mb-8">
          Track uptime, response time, and get instant alerts when your API fails.
        </p>

        <a
          href="/signup"
          className="bg-blue-600 px-6 py-3 rounded-lg text-lg hover:bg-blue-700"
        >
          Start Monitoring
        </a>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-8 px-12 py-16">
        <div className="bg-gray-900 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">Uptime Monitoring</h3>
          <p className="text-gray-400">
            Monitor your APIs every minute and detect downtime instantly.
          </p>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">Performance Tracking</h3>
          <p className="text-gray-400">
            Track response times and performance history.
          </p>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">Instant Alerts</h3>
          <p className="text-gray-400">
            Get notified immediately when your API goes down.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 border-t border-gray-800 text-gray-500">
        © 2026 API Monitor SaaS
      </footer>

    </main>
  )
}