import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { FileText } from "lucide-react";

export function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-12 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-[#00CFFF]/30">
              <FileText className="h-4 w-4 text-[#00CFFF]" />
              <span className="text-sm uppercase tracking-wider text-[#00CFFF]">
                Legal Agreement
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl uppercase tracking-tight">
              <span className="block">Terms of</span>
              <span className="block bg-gradient-to-r from-[#00CFFF] to-[#FF00A8] bg-clip-text text-transparent">
                Service
              </span>
            </h1>
            
            <p className="text-muted-foreground">
              Last updated: November 17, 2025
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none space-y-8">
            <section className="space-y-4">
              <h2 className="text-2xl uppercase tracking-wide text-foreground">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms of Service ("Terms") constitute a legally binding agreement between you (the "User," "Artist," "Label," or "Promoter") 
                and Wreckshop Social, operated by Vintara Group ("we," "us," or "our"). By accessing or using the Wreckshop Social platform 
                (the "Service"), you agree to be bound by these Terms and our Privacy Policy.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">If you do not agree to these Terms, do not use the Service.</strong>
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl uppercase tracking-wide text-foreground">2. Service Description</h2>
              <p className="text-muted-foreground leading-relaxed">
                Wreckshop Social is a music marketing automation platform that enables artists, labels, and promoters to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Discover and segment music audiences via social platform integrations</li>
                <li>Orchestrate multi-channel marketing campaigns (email, SMS, push notifications)</li>
                <li>Analyze fan engagement and campaign performance</li>
                <li>Utilize geofencing and real-time audience segmentation</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time with reasonable notice.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl uppercase tracking-wide text-foreground">3. Account Registration & Eligibility</h2>
              
              <h3 className="text-xl text-foreground">3.1 Eligibility</h3>
              <p className="text-muted-foreground leading-relaxed">
                You must be at least 18 years old (or 16 with parental consent where permitted by law) to create an account. 
                By registering, you represent that you have the legal authority to bind any entity you represent (e.g., record label, artist LLC).
              </p>

              <h3 className="text-xl text-foreground mt-6">3.2 Account Security</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>You are responsible for maintaining the confidentiality of your password and account credentials</li>
                <li>You must notify us immediately of any unauthorized use: <a href="mailto:security@wreckshopsocial.com" className="text-[#00CFFF] hover:underline">security@wreckshopsocial.com</a></li>
                <li>We recommend enabling two-factor authentication (2FA)</li>
                <li>You are liable for all activities conducted through your account</li>
              </ul>

              <h3 className="text-xl text-foreground mt-6">3.3 Account Suspension</h3>
              <p className="text-muted-foreground leading-relaxed">
                We may suspend or terminate your account if you violate these Terms, engage in fraudulent activity, or misuse the platform 
                (e.g., sending spam, harvesting user data without consent).
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl uppercase tracking-wide text-foreground">4. Acceptable Use Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree NOT to use the Service to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong className="text-foreground">Send Spam:</strong> Unsolicited bulk messages, phishing emails, or deceptive content</li>
                <li><strong className="text-foreground">Violate Laws:</strong> CAN-SPAM Act, GDPR, CCPA, TCPA (SMS consent laws), copyright/trademark laws</li>
                <li><strong className="text-foreground">Harvest Data:</strong> Scrape, crawl, or collect user data without explicit opt-in consent</li>
                <li><strong className="text-foreground">Impersonate:</strong> Falsely represent yourself as another artist, label, or entity</li>
                <li><strong className="text-foreground">Harm Minors:</strong> Target individuals under 13 (or 16 in EU) or collect their data</li>
                <li><strong className="text-foreground">Distribute Malware:</strong> Upload viruses, malicious code, or harmful files</li>
                <li><strong className="text-foreground">Abuse Systems:</strong> Overload servers, reverse-engineer our platform, or circumvent rate limits</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                <strong className="text-foreground">Violations may result in immediate account termination and legal action.</strong>
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl uppercase tracking-wide text-foreground">5. User Content & Intellectual Property</h2>
              
              <h3 className="text-xl text-foreground">5.1 Your Content</h3>
              <p className="text-muted-foreground leading-relaxed">
                You retain ownership of all content you upload (campaign messages, images, music links, etc.). By using the Service, you grant us 
                a limited, worldwide, royalty-free license to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Store, process, and transmit your content to deliver the Service</li>
                <li>Display your content in analytics dashboards and reports</li>
                <li>Use anonymized, aggregated data for platform improvements and industry research</li>
              </ul>

              <h3 className="text-xl text-foreground mt-6">5.2 Prohibited Content</h3>
              <p className="text-muted-foreground leading-relaxed">
                You may not upload content that is illegal, defamatory, obscene, harassing, infringing on third-party rights, or promotes hate speech/violence.
              </p>

              <h3 className="text-xl text-foreground mt-6">5.3 Our Intellectual Property</h3>
              <p className="text-muted-foreground leading-relaxed">
                Wreckshop Social's platform, branding, code, and documentation are owned by Vintara Group and protected by copyright, trademark, 
                and trade secret laws. You may not copy, modify, or redistribute our technology without written permission.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl uppercase tracking-wide text-foreground">6. Payment & Billing</h2>
              
              <h3 className="text-xl text-foreground">6.1 Subscription Plans</h3>
              <p className="text-muted-foreground leading-relaxed">
                Pricing is based on your selected plan (Artist, Label, Enterprise). All fees are in USD and billed monthly or annually.
              </p>

              <h3 className="text-xl text-foreground mt-6">6.2 Automatic Renewal</h3>
              <p className="text-muted-foreground leading-relaxed">
                Subscriptions auto-renew unless you cancel at least 24 hours before the next billing cycle. You can cancel anytime via your account dashboard.
              </p>

              <h3 className="text-xl text-foreground mt-6">6.3 Refund Policy</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong className="text-foreground">14-Day Free Trial:</strong> No charges during trial period; cancel anytime</li>
                <li><strong className="text-foreground">Monthly Plans:</strong> No refunds for partial months; access continues until end of billing period</li>
                <li><strong className="text-foreground">Annual Plans:</strong> Pro-rated refunds available within 30 days of initial purchase</li>
                <li><strong className="text-foreground">Usage Overages:</strong> SMS/email overages are non-refundable</li>
              </ul>

              <h3 className="text-xl text-foreground mt-6">6.4 Taxes</h3>
              <p className="text-muted-foreground leading-relaxed">
                Prices exclude applicable sales tax, VAT, or GST. You are responsible for any taxes owed in your jurisdiction.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl uppercase tracking-wide text-foreground">7. Third-Party Integrations</h2>
              <p className="text-muted-foreground leading-relaxed">
                Wreckshop Social integrates with third-party platforms (Spotify, Instagram, Twilio, SendGrid, etc.). Your use of these integrations 
                is subject to their respective terms of service. We are not responsible for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>API changes or downtime from third-party services</li>
                <li>Data breaches or security issues on third-party platforms</li>
                <li>Billing disputes with SMS/email providers (charges are pass-through)</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl uppercase tracking-wide text-foreground">8. Disclaimer of Warranties</h2>
              <p className="text-muted-foreground leading-relaxed">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Implied warranties of merchantability, fitness for a particular purpose, or non-infringement</li>
                <li>Guarantees of uninterrupted, error-free, or secure service</li>
                <li>Accuracy of analytics data or campaign performance metrics</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                We do not warrant that the Service will meet your specific requirements or that defects will be corrected.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl uppercase tracking-wide text-foreground">9. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, WRECKSHOP SOCIAL AND VINTARA GROUP SHALL NOT BE LIABLE FOR:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Indirect, incidental, consequential, or punitive damages</li>
                <li>Loss of profits, revenue, data, or goodwill</li>
                <li>Campaign failures due to third-party platform issues</li>
                <li>Damages exceeding the fees you paid in the 12 months prior to the claim</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Some jurisdictions do not allow these limitations, so they may not apply to you.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl uppercase tracking-wide text-foreground">10. Indemnification</h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree to indemnify and hold harmless Wreckshop Social, Vintara Group, and our affiliates from any claims, damages, or expenses 
                (including legal fees) arising from:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Your violation of these Terms or applicable laws</li>
                <li>Your content or campaigns (e.g., copyright infringement, defamation)</li>
                <li>Your misuse of fan data or failure to obtain proper consents</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl uppercase tracking-wide text-foreground">11. Dispute Resolution & Governing Law</h2>
              
              <h3 className="text-xl text-foreground">11.1 Governing Law</h3>
              <p className="text-muted-foreground leading-relaxed">
                These Terms are governed by the laws of the State of [State TBD], USA, without regard to conflict of law principles.
              </p>

              <h3 className="text-xl text-foreground mt-6">11.2 Arbitration</h3>
              <p className="text-muted-foreground leading-relaxed">
                Any disputes will be resolved through binding arbitration in accordance with the American Arbitration Association (AAA) rules, 
                rather than in court. You waive the right to participate in class-action lawsuits.
              </p>

              <h3 className="text-xl text-foreground mt-6">11.3 Exceptions</h3>
              <p className="text-muted-foreground leading-relaxed">
                Either party may seek injunctive relief in court to protect intellectual property rights.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl uppercase tracking-wide text-foreground">12. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update these Terms at any time. Material changes will be communicated via email or in-app notification at least 30 days 
                before taking effect. Continued use of the Service after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl uppercase tracking-wide text-foreground">13. Termination</h2>
              
              <h3 className="text-xl text-foreground">13.1 By You</h3>
              <p className="text-muted-foreground leading-relaxed">
                You may cancel your account at any time through your dashboard settings. Data will be deleted per our Privacy Policy.
              </p>

              <h3 className="text-xl text-foreground mt-6">13.2 By Us</h3>
              <p className="text-muted-foreground leading-relaxed">
                We may terminate your account for violations of these Terms, non-payment, or suspected fraudulent activity. Upon termination, 
                your access to campaigns and data will cease immediately.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl uppercase tracking-wide text-foreground">14. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about these Terms:
              </p>
              <div className="text-muted-foreground space-y-1 ml-4">
                <p><strong className="text-foreground">Email:</strong> <a href="mailto:legal@wreckshopsocial.com" className="text-[#00CFFF] hover:underline">legal@wreckshopsocial.com</a></p>
                <p><strong className="text-foreground">Support:</strong> <a href="mailto:support@wreckshopsocial.com" className="text-[#00CFFF] hover:underline">support@wreckshopsocial.com</a></p>
                <p><strong className="text-foreground">Mail:</strong> Wreckshop Social (Vintara Group), Legal Department, [Address TBD]</p>
              </div>
            </section>

            <div className="pt-8 border-t border-border/50">
              <p className="text-sm text-muted-foreground">
                By clicking "I Agree" or using the Service, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
