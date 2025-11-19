import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { Shield } from "lucide-react";

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-12 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-[#00CFFF]/30">
              <Shield className="h-4 w-4 text-[#00CFFF]" />
              <span className="text-sm uppercase tracking-wider text-[#00CFFF]">
                Legal
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl uppercase tracking-tight">
              <span className="block">Privacy</span>
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
              <h2 className="text-2xl uppercase tracking-wide text-foreground">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                Wreckshop Social ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, 
                use, disclose, and safeguard your information when you use our music marketing automation platform. This policy applies to 
                artists, labels, promoters, and their fans ("users" or "you").
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Important:</strong> Wreckshop Social is designed for professional music marketing, not for collecting 
                personally identifiable information (PII) of minors or for use in sensitive contexts. By using our platform, you agree to this policy.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl uppercase tracking-wide text-foreground">2. Information We Collect</h2>
              
              <h3 className="text-xl text-foreground">2.1 Information You Provide</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong className="text-foreground">Account Information:</strong> Name, email address, password, payment details, company/artist name</li>
                <li><strong className="text-foreground">Profile Data:</strong> Bio, artist links, social media handles you choose to share</li>
                <li><strong className="text-foreground">Campaign Content:</strong> Messages, images, and materials you create for marketing campaigns</li>
                <li><strong className="text-foreground">Support Communications:</strong> Messages you send to our support team</li>
              </ul>

              <h3 className="text-xl text-foreground mt-6">2.2 Social Platform Data (OAuth Connections)</h3>
              <p className="text-muted-foreground leading-relaxed">
                When you connect third-party platforms (Spotify, Instagram, Twitter, TikTok, etc.), we access data via OAuth with your explicit permission:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Follower/listener demographics (age range, location, gender)</li>
                <li>Engagement metrics (likes, shares, streams, comments)</li>
                <li>Music taste profiles and playlist data (Spotify)</li>
                <li>Public profile information of your audience</li>
                <li>Historical campaign performance data</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                <strong className="text-foreground">We do NOT collect:</strong> Private messages, credit card information from fans, precise GPS location, 
                health data, or any information from users under 13 years old.
              </p>

              <h3 className="text-xl text-foreground mt-6">2.3 Automatically Collected Data</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong className="text-foreground">Usage Data:</strong> Pages viewed, features used, time spent on platform</li>
                <li><strong className="text-foreground">Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
                <li><strong className="text-foreground">Cookies:</strong> Session cookies, analytics cookies, preference cookies (see Cookie Policy)</li>
                <li><strong className="text-foreground">Campaign Analytics:</strong> Email open rates, click-through rates, SMS delivery status, geofence entries</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl uppercase tracking-wide text-foreground">3. How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong className="text-foreground">Provide Services:</strong> Deliver marketing automation, audience segmentation, campaign management</li>
                <li><strong className="text-foreground">Analytics & Insights:</strong> Generate reports on fan engagement, campaign performance, audience trends</li>
                <li><strong className="text-foreground">Platform Improvements:</strong> Develop new features, fix bugs, improve user experience</li>
                <li><strong className="text-foreground">Communication:</strong> Send service updates, billing notifications, security alerts</li>
                <li><strong className="text-foreground">Compliance:</strong> Meet legal obligations, prevent fraud, enforce our Terms of Service</li>
                <li><strong className="text-foreground">Aggregated Research:</strong> Create anonymized industry reports (no individual data shared)</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                <strong className="text-foreground">We will NEVER:</strong> Sell your audience data to third parties, use fan data for our own marketing, 
                or share individual fan information without consent.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl uppercase tracking-wide text-foreground">4. Data Sharing & Disclosure</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may share information with:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong className="text-foreground">Service Providers:</strong> Email/SMS providers (SendGrid, Twilio), analytics tools (for platform operations only)</li>
                <li><strong className="text-foreground">Social Platforms:</strong> Data flows back to connected platforms per their APIs (e.g., posting on your behalf)</li>
                <li><strong className="text-foreground">Legal Requirements:</strong> Law enforcement, court orders, or to protect our legal rights</li>
                <li><strong className="text-foreground">Business Transfers:</strong> In case of merger, acquisition, or sale (users will be notified)</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                All third-party providers are contractually obligated to protect your data and use it only for authorized purposes.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl uppercase tracking-wide text-foreground">5. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement industry-standard security measures:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>256-bit AES encryption for data at rest</li>
                <li>TLS 1.3 encryption for data in transit</li>
                <li>SOC 2 Type II certified infrastructure</li>
                <li>Regular security audits and penetration testing</li>
                <li>Role-based access controls and multi-factor authentication</li>
                <li>Automated backup systems with 99.9% uptime SLA</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl uppercase tracking-wide text-foreground">6. Data Retention</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong className="text-foreground">Active Accounts:</strong> Data retained while account is active and for 24 months after last campaign</li>
                <li><strong className="text-foreground">Deleted Accounts:</strong> Personal data deleted within 30 days; aggregated analytics may be retained longer</li>
                <li><strong className="text-foreground">Legal Holds:</strong> Data may be retained longer if required by law or pending legal matters</li>
                <li><strong className="text-foreground">Backups:</strong> Backup systems purged on a 90-day rolling schedule</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl uppercase tracking-wide text-foreground">7. Your Rights (GDPR & CCPA)</h2>
              <p className="text-muted-foreground leading-relaxed">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong className="text-foreground">Access:</strong> Request a copy of your personal data</li>
                <li><strong className="text-foreground">Rectification:</strong> Correct inaccurate or incomplete data</li>
                <li><strong className="text-foreground">Erasure:</strong> Request deletion of your data ("right to be forgotten")</li>
                <li><strong className="text-foreground">Portability:</strong> Receive your data in a machine-readable format</li>
                <li><strong className="text-foreground">Objection:</strong> Object to processing based on legitimate interests</li>
                <li><strong className="text-foreground">Restriction:</strong> Limit how we use your data</li>
                <li><strong className="text-foreground">Opt-Out:</strong> Unsubscribe from marketing emails or withdraw consent</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                To exercise these rights, email <a href="mailto:privacy@wreckshopsocial.com" className="text-[#00CFFF] hover:underline">privacy@wreckshopsocial.com</a> or 
                use the settings in your account dashboard. We will respond within 30 days.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl uppercase tracking-wide text-foreground">8. International Data Transfers</h2>
              <p className="text-muted-foreground leading-relaxed">
                Wreckshop Social is operated by Vintara Group in the United States. If you are located in the EU/EEA, UK, or other regions 
                with different data protection laws, your data may be transferred to and processed in the U.S. We use Standard Contractual 
                Clauses (SCCs) approved by the European Commission to protect your data during international transfers.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl uppercase tracking-wide text-foreground">9. Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Wreckshop Social is not intended for use by individuals under 13 years old (or 16 in the EU). We do not knowingly collect 
                data from children. If you believe we have collected data from a child, please contact us immediately at{" "}
                <a href="mailto:privacy@wreckshopsocial.com" className="text-[#00CFFF] hover:underline">privacy@wreckshopsocial.com</a>.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl uppercase tracking-wide text-foreground">10. Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last updated" date. 
                Material changes will be communicated via email or in-app notification. Continued use of the platform after changes constitutes acceptance.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl uppercase tracking-wide text-foreground">11. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                For privacy questions or to exercise your rights:
              </p>
              <div className="text-muted-foreground space-y-1 ml-4">
                <p><strong className="text-foreground">Email:</strong> <a href="mailto:privacy@wreckshopsocial.com" className="text-[#00CFFF] hover:underline">privacy@wreckshopsocial.com</a></p>
                <p><strong className="text-foreground">Mail:</strong> Wreckshop Social (Vintara Group), Privacy Department, [Address TBD]</p>
                <p><strong className="text-foreground">DPO:</strong> <a href="mailto:dpo@vintaragroup.com" className="text-[#00CFFF] hover:underline">dpo@vintaragroup.com</a> (EU inquiries)</p>
              </div>
            </section>

            <div className="pt-8 border-t border-border/50">
              <p className="text-sm text-muted-foreground">
                By using Wreckshop Social, you acknowledge that you have read and understood this Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
