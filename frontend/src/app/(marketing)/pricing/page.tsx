import { PricingPlans } from '@/components/pricing-plans';

export default function PricingPage() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Flexible pricing for teams of all sizes. Start free and scale as you grow.
          </p>
        </header>
        
        <PricingPlans />
      </div>
    </section>
  );
}