import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { Cookie } from "lucide-react";

export function CookiePolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-12 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-[#00CFFF]/30">
              <Cookie className="h-4 w-4 text-[#00CFFF]" />
              <span className="text-sm uppercase tracking-wider text-[#00CFFF]">
                Cookie Information
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl uppercase tracking-tight">
              <span className="block">Cookie</span>
              <span className="block bg-gradient-to-r from-[#00CFFF] to-[#FF00A8] bg-clip-text text-transparent">
                Policy
              </span>
            </h1>
            
            <p className="text-muted-foreground">
              Last updated: November 17, 2025
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none space-y-8">
            <section className="space-y-4">
              <h2 className="text-2xl uppercase tracking-wide text-foreground">What Are Cookies?</h2>
              <p className="text-muted-foreground leading-relaxed">
                Cookies are small text files placed on your device when you visit a website. They help websites remember your preferences, 
                improve site functionality, and analyze how you use the site. Wreckshop Social uses cookies and similar technologies 
                (like local storage and pixels) to enhance your experience.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl uppercase tracking-wide text-foreground">Types of Cookies We Use</h2>

              <h3 className="text-xl text-foreground">1. Necessary Cookies (Always Active)</h3>
              <p className="text-muted-foreground leading-relaxed">
                These cookies are essential for the website to function properly. You cannot disable them.
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong className="text-foreground">Session Management:</strong> Keeps you logged in as you navigate the platform</li>
                <li><strong className="text-foreground">Security:</strong> Protects against cross-site request forgery (CSRF) attacks</li>
                <li><strong className="text-foreground">Cookie Consent:</strong> Remembers your cookie preferences</li>
                <li><strong className="text-foreground">Load Balancing:</strong> Distributes traffic across servers for reliability</li>
              </ul>

              <h3 className="text-xl text-foreground mt-6">2. Analytics Cookies (Optional)</h3>
              <p className="text-muted-foreground leading-relaxed">
                Help us understand how you use our site so we can improve it. Data is aggregated and anonymized.
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong className="text-foreground">Google Analytics:</strong> Tracks page views, session duration, bounce rate (GA4, anonymized IP)</li>
                <li><strong className="text-foreground">Hotjar:</strong> Heatmaps and session recordings (anonymized, no PII captured)</li>
                <li><strong className="text-foreground">Internal Analytics:</strong> Feature usage tracking to prioritize product improvements</li>
              </ul>

              <h3 className="text-xl text-foreground mt-6">3. Marketing Cookies (Optional)</h3>
              <p className="text-muted-foreground leading-relaxed">
                Used to deliver personalized ads and measure the effectiveness of our marketing campaigns.
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong className="text-foreground">Google Ads:</strong> Retargeting pixels for ad campaigns</li>
                <li><strong className="text-foreground">Facebook Pixel:</strong> Tracks conversions and creates lookalike audiences</li>
                <li><strong className="text-foreground">LinkedIn Insight Tag:</strong> B2B marketing and conversion tracking</li>
                <li><strong className="text-foreground">Twitter Pixel:</strong> Ad performance measurement</li>
              </ul>

              <h3 className="text-xl text-foreground mt-6">4. Functional Cookies (Optional)</h3>
              <p className="text-muted-foreground leading-relaxed">
                Enable enhanced features and personalization.
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong className="text-foreground">Video Players:</strong> YouTube/Vimeo embeds (remembers volume, playback speed)</li>
                <li><strong className="text-foreground">Live Chat:</strong> Intercom/Drift chat widget (preserves conversation history)</li>
                <li><strong className="text-foreground">Preferences:</strong> UI theme, language, notification settings</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl uppercase tracking-wide text-foreground">Specific Cookies Used</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-muted-foreground border border-border/50">
                  <thead className="bg-card/50">
                    <tr>
                      <th className="text-left p-3 border-b border-border/50 text-foreground">Cookie Name</th>
                      <th className="text-left p-3 border-b border-border/50 text-foreground">Type</th>
                      <th className="text-left p-3 border-b border-border/50 text-foreground">Duration</th>
                      <th className="text-left p-3 border-b border-border/50 text-foreground">Purpose</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/30">
                      <td className="p-3">_ws_session</td>
                      <td className="p-3">Necessary</td>
                      <td className="p-3">Session</td>
                      <td className="p-3">Maintains login state</td>
                    </tr>
                    <tr className="border-b border-border/30">
                      <td className="p-3">_ws_csrf</td>
                      <td className="p-3">Necessary</td>
                      <td className="p-3">Session</td>
                      <td className="p-3">Security protection</td>
                    </tr>
                    <tr className="border-b border-border/30">
                      <td className="p-3">cookieConsent</td>
                      <td className="p-3">Necessary</td>
                      <td className="p-3">1 year</td>
                      <td className="p-3">Stores your cookie preferences</td>
                    </tr>
                    <tr className="border-b border-border/30">
                      <td className="p-3">_ga</td>
                      <td className="p-3">Analytics</td>
                      <td className="p-3">2 years</td>
                      <td className="p-3">Google Analytics user ID</td>
                    </tr>
                    <tr className="border-b border-border/30">
                      <td className="p-3">_hjid</td>
                      <td className="p-3">Analytics</td>
                      <td className="p-3">1 year</td>
                      <td className="p-3">Hotjar user identifier</td>
                    </tr>
                    <tr className="border-b border-border/30">
                      <td className="p-3">_fbp</td>
                      <td className="p-3">Marketing</td>
                      <td className="p-3">3 months</td>
                      <td className="p-3">Facebook Pixel tracking</td>
                    </tr>
                    <tr>
                      <td className="p-3">intercom-session</td>
                      <td className="p-3">Functional</td>
                      <td className="p-3">1 week</td>
                      <td className="p-3">Live chat functionality</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl uppercase tracking-wide text-foreground">Third-Party Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                Some cookies are set by third-party services we use:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong className="text-foreground">Google Analytics:</strong> See{" "}
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#00CFFF] hover:underline">
                    Google's Privacy Policy
                  </a>
                </li>
                <li><strong className="text-foreground">Facebook:</strong> See{" "}
                  <a href="https://www.facebook.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#00CFFF] hover:underline">
                    Facebook's Data Policy
                  </a>
                </li>
                <li><strong className="text-foreground">Stripe (Payment Processing):</strong> See{" "}
                  <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#00CFFF] hover:underline">
                    Stripe's Privacy Policy
                  </a>
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                We do not control these third-party cookies. Please review their privacy policies for details.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl uppercase tracking-wide text-foreground">How to Manage Cookies</h2>

              <h3 className="text-xl text-foreground">On Our Website</h3>
              <p className="text-muted-foreground leading-relaxed">
                You can change your cookie preferences at any time by clicking the "Cookie Preferences" link in our footer. 
                This will reopen the cookie consent banner where you can customize your settings.
              </p>

              <h3 className="text-xl text-foreground mt-6">In Your Browser</h3>
              <p className="text-muted-foreground leading-relaxed">
                Most browsers allow you to block or delete cookies. However, disabling necessary cookies may prevent the site from working properly.
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong className="text-foreground">Chrome:</strong> Settings → Privacy and Security → Cookies and other site data</li>
                <li><strong className="text-foreground">Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
                <li><strong className="text-foreground">Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                <li><strong className="text-foreground">Edge:</strong> Settings → Cookies and site permissions</li>
              </ul>

              <h3 className="text-xl text-foreground mt-6">Opt-Out Tools</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>
                  <strong className="text-foreground">Google Analytics Opt-Out:</strong>{" "}
                  <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-[#00CFFF] hover:underline">
                    Browser Add-On
                  </a>
                </li>
                <li>
                  <strong className="text-foreground">Ad Network Opt-Outs:</strong>{" "}
                  <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-[#00CFFF] hover:underline">
                    NAI Opt-Out Tool
                  </a>
                </li>
                <li>
                  <strong className="text-foreground">Do Not Track:</strong> Some browsers support "Do Not Track" signals (we honor these for analytics)
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl uppercase tracking-wide text-foreground">Mobile App Tracking</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you use our mobile app (iOS/Android), we may collect device identifiers (IDFA, GAID) for analytics and advertising. You can:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong className="text-foreground">iOS:</strong> Settings → Privacy → Tracking → Disable "Allow Apps to Request to Track"</li>
                <li><strong className="text-foreground">Android:</strong> Settings → Google → Ads → Opt out of Ads Personalization</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl uppercase tracking-wide text-foreground">Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Cookie Policy from time to time to reflect changes in technology or legal requirements. 
                The "Last updated" date at the top indicates when changes were made. Continued use of the site constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl uppercase tracking-wide text-foreground">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                Questions about our use of cookies?
              </p>
              <div className="text-muted-foreground space-y-1 ml-4">
                <p><strong className="text-foreground">Email:</strong>{" "}
                  <a href="mailto:privacy@wreckshopsocial.com" className="text-[#00CFFF] hover:underline">
                    privacy@wreckshopsocial.com
                  </a>
                </p>
                <p><strong className="text-foreground">Privacy Policy:</strong>{" "}
                  <a href="/privacy-policy" className="text-[#00CFFF] hover:underline">
                    View Full Privacy Policy
                  </a>
                </p>
              </div>
            </section>

            <div className="pt-8 border-t border-border/50">
              <p className="text-sm text-muted-foreground">
                By using Wreckshop Social, you consent to our use of cookies in accordance with this policy.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
