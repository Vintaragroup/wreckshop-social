import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { Shield, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";

export function DoNotSell() {
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
                CCPA Rights
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl uppercase tracking-tight">
              <span className="block">Do Not Sell</span>
              <span className="block bg-gradient-to-r from-[#00CFFF] to-[#FF00A8] bg-clip-text text-transparent">
                My Information
              </span>
            </h1>
            
            <p className="text-muted-foreground">
              California Consumer Privacy Act (CCPA) Request Form
            </p>
          </div>

          {/* Important Notice */}
          <Card className="mb-12 bg-gradient-to-br from-[#00CFFF]/10 to-[#FF00A8]/10 border-[#00CFFF]/30">
            <CardContent className="p-8 space-y-4">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="h-6 w-6 text-[#00CFFF] flex-shrink-0 mt-1" />
                <div className="space-y-2">
                  <h2 className="text-xl uppercase tracking-wide">
                    We Do Not Sell Your Personal Information
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Important:</strong> Wreckshop Social does not sell, rent, or trade your personal information 
                    to third parties for monetary or other valuable consideration. We never have and never will sell your audience data, 
                    campaign information, or account details.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    However, under California law (CCPA), certain data sharing activities may be considered a "sale." 
                    This form allows you to opt out of any such activities, even though we do not engage in traditional selling of data.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What We Share */}
          <div className="mb-12 space-y-6">
            <h2 className="text-2xl uppercase tracking-wide">
              What Data Sharing Occurs?
            </h2>
            
            <Card className="bg-card/30 backdrop-blur-sm border-border/50">
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl text-foreground">Service Providers (NOT Considered a "Sale")</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We share data with service providers who help us operate our platform:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li><strong className="text-foreground">Email/SMS Providers:</strong> SendGrid, Twilio (to deliver your campaigns)</li>
                    <li><strong className="text-foreground">Analytics Tools:</strong> Google Analytics, Hotjar (aggregated, anonymized data)</li>
                    <li><strong className="text-foreground">Cloud Infrastructure:</strong> AWS (data storage and processing)</li>
                    <li><strong className="text-foreground">Payment Processing:</strong> Stripe (billing information only)</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed">
                    These providers are contractually obligated to protect your data and cannot use it for their own purposes.
                  </p>
                </div>

                <div className="space-y-4 pt-6 border-t border-border/30">
                  <h3 className="text-xl text-foreground">Advertising Partners (Potential "Sale" Under CCPA)</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We may share limited data with advertising platforms for marketing purposes:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li><strong className="text-foreground">Google Ads:</strong> Browser cookies for retargeting (opted-in users only)</li>
                    <li><strong className="text-foreground">Facebook Pixel:</strong> Hashed email addresses for lookalike audiences</li>
                    <li><strong className="text-foreground">LinkedIn:</strong> Company information for B2B marketing</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">You can opt out of this sharing using the form below.</strong>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Opt-Out Form */}
          <div className="mb-12">
            <h2 className="text-2xl uppercase tracking-wide mb-6">
              Submit an Opt-Out Request
            </h2>
            
            <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-[#00CFFF]/30">
              <CardContent className="p-8 md:p-12">
                <form className="space-y-6">
                  <p className="text-muted-foreground leading-relaxed">
                    Fill out this form to opt out of any data sharing that may be considered a "sale" under CCPA. 
                    We'll process your request within <strong className="text-foreground">15 business days</strong>.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input 
                        id="firstName" 
                        required
                        className="bg-input-background border-border/50 focus:border-[#00CFFF]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input 
                        id="lastName" 
                        required
                        className="bg-input-background border-border/50 focus:border-[#00CFFF]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      required
                      placeholder="email@example.com"
                      className="bg-input-background border-border/50 focus:border-[#00CFFF]"
                    />
                    <p className="text-xs text-muted-foreground">
                      Must match the email on your Wreckshop Social account
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input 
                      id="state" 
                      required
                      placeholder="California"
                      className="bg-input-background border-border/50 focus:border-[#00CFFF]"
                    />
                    <p className="text-xs text-muted-foreground">
                      CCPA applies to California residents only
                    </p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-border/30">
                    <Label>What would you like to opt out of?</Label>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Checkbox id="opt-ads" defaultChecked className="mt-1" />
                        <Label htmlFor="opt-ads" className="cursor-pointer leading-relaxed">
                          Sharing data with advertising platforms (Google Ads, Facebook, LinkedIn)
                        </Label>
                      </div>

                      <div className="flex items-start gap-3">
                        <Checkbox id="opt-analytics" className="mt-1" />
                        <Label htmlFor="opt-analytics" className="cursor-pointer leading-relaxed">
                          Anonymous analytics tracking (may limit platform functionality)
                        </Label>
                      </div>

                      <div className="flex items-start gap-3">
                        <Checkbox id="opt-all" defaultChecked className="mt-1" />
                        <Label htmlFor="opt-all" className="cursor-pointer leading-relaxed">
                          All optional data sharing (select this for maximum privacy)
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-4">
                    <Checkbox id="verify" required className="mt-1" />
                    <Label htmlFor="verify" className="text-sm text-muted-foreground cursor-pointer leading-relaxed">
                      I certify that I am a California resident and the information provided is accurate. 
                      I understand that providing false information may be subject to penalties under California law.
                    </Label>
                  </div>

                  <Button 
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-[#00CFFF] to-[#FF00A8] hover:opacity-90 text-[#1E1E1E]"
                  >
                    Submit Opt-Out Request
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    You will receive a confirmation email within 2 business days. Processing takes up to 15 business days.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Additional Rights */}
          <div className="space-y-6">
            <h2 className="text-2xl uppercase tracking-wide">
              Other CCPA Rights
            </h2>
            
            <Card className="bg-card/20 backdrop-blur-sm border-border/30">
              <CardContent className="p-8 space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  As a California resident, you also have the right to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>
                    <strong className="text-foreground">Access:</strong> Request a copy of all personal information we've collected about you
                  </li>
                  <li>
                    <strong className="text-foreground">Deletion:</strong> Request deletion of your personal information (with certain exceptions)
                  </li>
                  <li>
                    <strong className="text-foreground">Non-Discrimination:</strong> We will not discriminate against you for exercising your CCPA rights
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed pt-4">
                  To exercise these rights, see our{" "}
                  <a href="/privacy-policy" className="text-[#00CFFF] hover:underline">Privacy Policy</a>{" "}
                  or email{" "}
                  <a href="mailto:privacy@wreckshopsocial.com" className="text-[#00CFFF] hover:underline">
                    privacy@wreckshopsocial.com
                  </a>.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="mt-12 text-center space-y-4">
            <h3 className="text-xl uppercase tracking-wide">
              Questions About Your Privacy?
            </h3>
            <p className="text-muted-foreground">
              Contact our Privacy Team:{" "}
              <a href="mailto:privacy@wreckshopsocial.com" className="text-[#00CFFF] hover:underline">
                privacy@wreckshopsocial.com
              </a>
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
