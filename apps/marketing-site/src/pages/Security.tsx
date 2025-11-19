import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { Shield, Lock, Eye, Server, CheckCircle2, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";

const securityFeatures = [
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description: "All data is encrypted in transit (TLS 1.3) and at rest (256-bit AES). Your fan data and campaign content are protected with military-grade encryption."
  },
  {
    icon: Server,
    title: "SOC 2 Type II Certified",
    description: "Our infrastructure undergoes annual third-party audits to ensure compliance with industry security standards for data protection and availability."
  },
  {
    icon: Eye,
    title: "Privacy by Design",
    description: "We minimize data collection, anonymize analytics, and give you full control over what information you share with us and your fans."
  },
  {
    icon: Shield,
    title: "Regular Penetration Testing",
    description: "Quarterly security audits by independent firms to identify and remediate vulnerabilities before they can be exploited."
  },
  {
    icon: CheckCircle2,
    title: "Multi-Factor Authentication",
    description: "Protect your account with 2FA using authenticator apps or SMS codes. Required for enterprise accounts."
  },
  {
    icon: AlertTriangle,
    title: "Real-Time Threat Monitoring",
    description: "24/7 automated monitoring for suspicious activity, with instant alerts for anomalies and potential security incidents."
  }
];

const compliance = [
  { name: "GDPR", description: "EU General Data Protection Regulation" },
  { name: "CCPA", description: "California Consumer Privacy Act" },
  { name: "SOC 2 Type II", description: "Security & Availability Controls" },
  { name: "ISO 27001", description: "Information Security Management (in progress)" },
  { name: "PCI DSS", description: "Payment Card Industry Data Security (via Stripe)" }
];

export function Security() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="py-24">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-[#00CFFF]/30">
              <Shield className="h-4 w-4 text-[#00CFFF]" />
              <span className="text-sm uppercase tracking-wider text-[#00CFFF]">
                Enterprise-Grade Protection
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl uppercase tracking-tight">
              <span className="block">SECURITY &</span>
              <span className="block bg-gradient-to-r from-[#00CFFF] to-[#FF00A8] bg-clip-text text-transparent">
                COMPLIANCE
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              Your music, your fans, your data — protected with industry-leading security infrastructure. 
              We take security seriously so you can focus on what matters: your art.
            </p>
          </div>

          {/* Security Features */}
          <div className="max-w-6xl mx-auto mb-24">
            <h2 className="text-3xl uppercase tracking-wide mb-12 text-center">
              How We Protect Your Data
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {securityFeatures.map((feature, index) => (
                <Card 
                  key={index}
                  className="bg-card/30 backdrop-blur-sm border-border/50 hover:border-[#00CFFF]/50 transition-all duration-300"
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-[#00CFFF]/20 to-[#FF00A8]/20 border border-[#00CFFF]/30 inline-flex">
                      <feature.icon className="h-6 w-6 text-[#00CFFF]" />
                    </div>
                    <h3 className="uppercase tracking-wide">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Infrastructure */}
          <div className="max-w-4xl mx-auto mb-24">
            <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-[#00CFFF]/30">
              <CardContent className="p-8 md:p-12 space-y-6">
                <h2 className="text-3xl uppercase tracking-wide">
                  Infrastructure & Architecture
                </h2>
                
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <h3 className="text-xl text-foreground mb-2">Cloud Hosting</h3>
                    <p className="leading-relaxed">
                      Wreckshop Social runs on AWS (Amazon Web Services) with multi-region redundancy. Your data is replicated across 
                      geographically distributed data centers to ensure 99.9% uptime and disaster recovery.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl text-foreground mb-2">Database Security</h3>
                    <p className="leading-relaxed">
                      PostgreSQL databases with row-level security policies, encrypted backups, and automated daily snapshots. 
                      All connections use SSL/TLS with certificate pinning.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl text-foreground mb-2">Access Controls</h3>
                    <p className="leading-relaxed">
                      Role-based access control (RBAC) ensures team members only see data they need. Audit logs track every action, 
                      from campaign launches to data exports. Enterprise plans include SSO/SAML integration.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl text-foreground mb-2">API Security</h3>
                    <p className="leading-relaxed">
                      OAuth 2.0 for third-party integrations, rate limiting to prevent abuse, and API key rotation every 90 days. 
                      All API requests are logged and monitored for anomalies.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Compliance Certifications */}
          <div className="max-w-6xl mx-auto mb-24">
            <h2 className="text-3xl uppercase tracking-wide mb-12 text-center">
              Compliance Certifications
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {compliance.map((cert, index) => (
                <div 
                  key={index}
                  className="p-6 rounded-lg bg-card/30 backdrop-blur-sm border border-border/50 hover:border-[#00CFFF]/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="h-6 w-6 text-[#00CFFF] flex-shrink-0 mt-1" />
                    <div className="space-y-1">
                      <h3 className="uppercase tracking-wide">
                        {cert.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {cert.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Incident Response */}
          <div className="max-w-4xl mx-auto mb-24">
            <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-[#00CFFF]/30">
              <CardContent className="p-8 md:p-12 space-y-6">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="h-8 w-8 text-[#FF00A8] flex-shrink-0" />
                  <div className="space-y-4">
                    <h2 className="text-3xl uppercase tracking-wide">
                      Incident Response Plan
                    </h2>
                    
                    <p className="text-muted-foreground leading-relaxed">
                      In the unlikely event of a security incident, we follow a documented response protocol:
                    </p>

                    <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-4">
                      <li><strong className="text-foreground">Detection:</strong> Automated alerts trigger within minutes of anomalous activity</li>
                      <li><strong className="text-foreground">Containment:</strong> Affected systems are isolated to prevent further compromise</li>
                      <li><strong className="text-foreground">Investigation:</strong> Security team determines scope and root cause</li>
                      <li><strong className="text-foreground">Remediation:</strong> Vulnerabilities are patched and systems restored</li>
                      <li><strong className="text-foreground">Notification:</strong> Affected users notified within 72 hours (GDPR requirement)</li>
                      <li><strong className="text-foreground">Post-Mortem:</strong> Incident report published with lessons learned</li>
                    </ol>

                    <p className="text-muted-foreground leading-relaxed">
                      Report security vulnerabilities to:{" "}
                      <a href="mailto:security@wreckshopsocial.com" className="text-[#00CFFF] hover:underline">
                        security@wreckshopsocial.com
                      </a>
                      {" "}— Responsible disclosure is rewarded through our bug bounty program.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Data Privacy Section */}
          <div className="max-w-4xl mx-auto mb-24">
            <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-border/50">
              <CardContent className="p-8 md:p-12 space-y-6">
                <h2 className="text-3xl uppercase tracking-wide">
                  Your Data Rights
                </h2>
                
                <p className="text-muted-foreground leading-relaxed">
                  We believe you own your data. That's why we provide:
                </p>

                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[#00CFFF] flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">Data Portability:</strong> Export all your campaign data, audience segments, and analytics in JSON/CSV format</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[#00CFFF] flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">Right to Deletion:</strong> Delete your account and all associated data within 30 days</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[#00CFFF] flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">Transparency Reports:</strong> Annual reports on law enforcement requests and data breaches (if any)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[#00CFFF] flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">No Third-Party Sales:</strong> We never sell your audience data to advertisers or data brokers</span>
                  </li>
                </ul>

                <p className="text-sm text-muted-foreground pt-4">
                  Learn more in our{" "}
                  <a href="/privacy-policy" className="text-[#00CFFF] hover:underline">Privacy Policy</a>
                  {" "}and{" "}
                  <a href="/privacy-policy" className="text-[#00CFFF] hover:underline">Data Processing Agreement</a>.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact CTA */}
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl uppercase tracking-wide">
              Questions About Security?
            </h2>
            <p className="text-muted-foreground">
              Our security team is here to help. Enterprise customers can request a full security audit report.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:security@wreckshopsocial.com"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-r from-[#00CFFF] to-[#FF00A8] hover:opacity-90 text-[#1E1E1E] transition-opacity uppercase tracking-wide"
              >
                Contact Security Team
              </a>
              <a 
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-card/50 border border-[#00CFFF]/50 hover:bg-[#00CFFF]/10 transition-colors uppercase tracking-wide"
              >
                Request Audit Report
              </a>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}