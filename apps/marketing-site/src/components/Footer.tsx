import { Twitter, Instagram, Linkedin } from "lucide-react";
import { Logo } from "@marketing-core";

const footerLinks = {
  Product: [
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Integrations", href: "/integrations" },
    { label: "Documentation", href: "/documentation" },
    { label: "Status", href: "/status" }
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Case Studies", href: "/case-studies" },
    { label: "Contact", href: "/contact" }
  ],
  Resources: [
    { label: "Documentation", href: "/documentation" },
    { label: "Case Studies", href: "/case-studies" },
    { label: "Help Center", href: "/contact" },
    { label: "Community", href: "/community" },
    { label: "Academy", href: "/academy" }
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
    { label: "Security", href: "/security" },
    { label: "Cookie Policy", href: "/cookie-policy" },
    { label: "Do Not Sell My Info", href: "/do-not-sell" }
  ]
};

export function Footer() {
  return (
    <footer className="relative border-t border-border/50">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00CFFF] to-transparent" />
      
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
          {/* Brand section */}
          <div className="lg:col-span-2 space-y-6">
            <Logo size="medium" showText={true} animate={true} />
            <p className="text-sm text-muted-foreground leading-relaxed">
              The next-gen marketing automation platform for the music industry. 
              Discover, segment, and engage audiences across channels.
            </p>
          </div>

          {/* Link sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h4 className="uppercase tracking-wide text-sm">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a 
                      href={link.href} 
                      className="text-sm text-muted-foreground hover:text-[#00CFFF] transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>
            © 2025 Wreckshop Social. A <span className="text-[#00CFFF]">Vintara Group</span> company. All rights reserved.
          </p>
          <div className="flex items-center flex-wrap gap-4 justify-center">
            <a href="/privacy-policy" className="hover:text-[#00CFFF] transition-colors">Privacy</a>
            <a href="/terms-of-service" className="hover:text-[#00CFFF] transition-colors">Terms</a>
            <a href="/cookie-policy" className="hover:text-[#00CFFF] transition-colors">Cookies</a>
            <a href="/do-not-sell" className="hover:text-[#00CFFF] transition-colors">Do Not Sell My Info</a>
            <button 
              onClick={() => {
                localStorage.removeItem('cookieConsent');
                window.location.reload();
              }} 
              className="hover:text-[#00CFFF] transition-colors"
            >
              Cookie Preferences
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}