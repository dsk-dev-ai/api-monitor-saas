export const metadata = {
  title: 'API Monitor Blog',
  description:
    'Product updates and articles on API monitoring from the API Monitor team.',
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
            Product updates and articles on API monitoring from the API Monitor team.
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="rounded-xl bg-white p-16 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              No posts yet
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Articles are coming soon. In the meantime, check the documentation
              to learn how to set up monitors, configure email alerts, and read
              your uptime and response-time analytics.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}