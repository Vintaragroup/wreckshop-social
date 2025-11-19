import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { Mail, MessageSquare, Phone, MapPin } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

const contactMethods = [
  {
    icon: Mail,
    title: "Email Us",
    description: "General inquiries and support",
    contact: "hello@wreckshopsocial.com",
    link: "mailto:hello@wreckshopsocial.com"
  },
  {
    icon: MessageSquare,
    title: "Live Chat",
    description: "Mon-Fri, 9am-6pm EST",
    contact: "Available in dashboard",
    link: "#"
  },
  {
    icon: Phone,
    title: "Enterprise Sales",
    description: "Custom solutions for labels",
    contact: "sales@wreckshopsocial.com",
    link: "mailto:sales@wreckshopsocial.com"
  },
  {
    icon: MapPin,
    title: "Headquarters",
    description: "Vintara Group",
    contact: "Los Angeles, CA",
    link: "#"
  }
];

export function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="py-24">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-[#00CFFF]/30">
              <Mail className="h-4 w-4 text-[#00CFFF]" />
              <span className="text-sm uppercase tracking-wider text-[#00CFFF]">
                Get In Touch
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl uppercase tracking-tight">
              <span className="block">CONTACT</span>
              <span className="block bg-gradient-to-r from-[#00CFFF] to-[#FF00A8] bg-clip-text text-transparent">
                US
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              Have questions? Want a demo? Our team is here to help you unlock your music audience.
            </p>
          </div>

          {/* Contact Methods */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-20">
            {contactMethods.map((method, index) => (
              <a 
                key={index}
                href={method.link}
                className="block"
              >
                <Card className="bg-card/30 backdrop-blur-sm border-border/50 hover:border-[#00CFFF]/50 transition-all duration-300 h-full">
                  <CardContent className="p-6 space-y-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-[#00CFFF]/20 to-[#FF00A8]/20 border border-[#00CFFF]/30 inline-flex">
                      <method.icon className="h-6 w-6 text-[#00CFFF]" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="uppercase tracking-wide">
                        {method.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {method.description}
                      </p>
                      <p className="text-sm text-[#00CFFF]">
                        {method.contact}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>

          {/* Demo Request Form */}
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-[#00CFFF]/30">
              <CardContent className="p-8 md:p-12">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-3xl uppercase tracking-wide">
                      Request A Demo
                    </h2>
                    <p className="text-muted-foreground">
                      See Wreckshop Social in action. Fill out the form below and we'll schedule a personalized demo 
                      tailored to your needs.
                    </p>
                  </div>

                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input 
                          id="firstName" 
                          placeholder="John" 
                          className="bg-input-background border-border/50 focus:border-[#00CFFF]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input 
                          id="lastName" 
                          placeholder="Doe" 
                          className="bg-input-background border-border/50 focus:border-[#00CFFF]"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="john@example.com" 
                        className="bg-input-background border-border/50 focus:border-[#00CFFF]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">Your Role *</Label>
                      <Select>
                        <SelectTrigger className="bg-input-background border-border/50 focus:border-[#00CFFF]">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="artist">Independent Artist</SelectItem>
                          <SelectItem value="manager">Artist Manager</SelectItem>
                          <SelectItem value="label">Record Label</SelectItem>
                          <SelectItem value="promoter">Event Promoter</SelectItem>
                          <SelectItem value="marketing">Marketing Agency</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">Artist/Company Name</Label>
                      <Input 
                        id="company" 
                        placeholder="Your artist name or company" 
                        className="bg-input-background border-border/50 focus:border-[#00CFFF]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="audienceSize">Current Audience Size *</Label>
                      <Select>
                        <SelectTrigger className="bg-input-background border-border/50 focus:border-[#00CFFF]">
                          <SelectValue placeholder="Select range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-1k">0 - 1,000 fans</SelectItem>
                          <SelectItem value="1k-10k">1,000 - 10,000 fans</SelectItem>
                          <SelectItem value="10k-50k">10,000 - 50,000 fans</SelectItem>
                          <SelectItem value="50k-100k">50,000 - 100,000 fans</SelectItem>
                          <SelectItem value="100k-500k">100,000 - 500,000 fans</SelectItem>
                          <SelectItem value="500k+">500,000+ fans</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Tell us about your needs</Label>
                      <Textarea 
                        id="message" 
                        placeholder="What marketing challenges are you trying to solve? Any specific features you're interested in?" 
                        rows={5}
                        className="bg-input-background border-border/50 focus:border-[#00CFFF] resize-none"
                      />
                    </div>

                    <div className="flex items-start gap-3">
                      <input 
                        type="checkbox" 
                        id="consent" 
                        className="mt-1"
                      />
                      <Label htmlFor="consent" className="text-sm text-muted-foreground cursor-pointer">
                        I agree to receive marketing communications from Wreckshop Social. 
                        You can unsubscribe at any time. View our{" "}
                        <a href="/privacy-policy" className="text-[#00CFFF] hover:underline">Privacy Policy</a>.
                      </Label>
                    </div>

                    <Button 
                      type="submit"
                      size="lg"
                      className="w-full md:w-auto bg-gradient-to-r from-[#00CFFF] to-[#FF00A8] hover:opacity-90 text-[#1E1E1E] px-8"
                    >
                      Request Demo
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Support Resources */}
          <div className="max-w-4xl mx-auto mt-20">
            <div className="text-center space-y-4 mb-8">
              <h2 className="text-3xl uppercase tracking-wide">
                Other Resources
              </h2>
              <p className="text-muted-foreground">
                Looking for something else?
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a href="/documentation" className="block group">
                <Card className="bg-card/30 backdrop-blur-sm border-border/50 hover:border-[#00CFFF]/50 transition-all duration-300">
                  <CardContent className="p-6 text-center space-y-3">
                    <div className="text-2xl">📚</div>
                    <h3 className="uppercase tracking-wide group-hover:text-[#00CFFF] transition-colors">
                      Documentation
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Guides and tutorials
                    </p>
                  </CardContent>
                </Card>
              </a>

              <a href="/community" className="block group">
                <Card className="bg-card/30 backdrop-blur-sm border-border/50 hover:border-[#00CFFF]/50 transition-all duration-300">
                  <CardContent className="p-6 text-center space-y-3">
                    <div className="text-2xl">💬</div>
                    <h3 className="uppercase tracking-wide group-hover:text-[#00CFFF] transition-colors">
                      Community
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Join our Discord and Slack
                    </p>
                  </CardContent>
                </Card>
              </a>

              <a href="/academy" className="block group">
                <Card className="bg-card/30 backdrop-blur-sm border-border/50 hover:border-[#00CFFF]/50 transition-all duration-300">
                  <CardContent className="p-6 text-center space-y-3">
                    <div className="text-2xl">🎓</div>
                    <h3 className="uppercase tracking-wide group-hover:text-[#00CFFF] transition-colors">
                      Academy
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Free music marketing courses
                    </p>
                  </CardContent>
                </Card>
              </a>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}