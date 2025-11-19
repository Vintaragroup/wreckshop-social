import { Navigation, Hero, Features, HowItWorks, UseCases, Testimonials, DataPrivacy, Pricing, Footer } from './components'

export function MarketingHomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        <Hero />

        <div id="features">
          <Features />
        </div>

        <div id="how-it-works">
          <HowItWorks />
        </div>

        <UseCases />

        <Testimonials />

        <DataPrivacy />

        <div id="pricing">
          <Pricing />
        </div>
      </main>

      <Footer />
    </div>
  )
}
