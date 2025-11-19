import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { Music2, Target, Users, Zap } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";

const values = [
  {
    icon: Music2,
    title: "Music First",
    description: "We're built by music lovers, for music professionals. Every feature is designed with the unique needs of artists and labels in mind."
  },
  {
    icon: Target,
    title: "Data-Driven",
    description: "We believe in the power of insights. Real-time analytics and audience intelligence help you make smarter marketing decisions."
  },
  {
    icon: Users,
    title: "Fan-Centric",
    description: "Respect for your audience is paramount. We prioritize privacy, consent, and meaningful engagement over vanity metrics."
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "The music industry moves fast. We're constantly evolving our platform to stay ahead of trends and technology."
  }
];

const team = [
  {
    name: "Alex Rivera",
    role: "CEO & Co-Founder",
    bio: "Former artist manager with 10+ years in music tech. Built marketing campaigns for Grammy-winning artists."
  },
  {
    name: "Jordan Chen",
    role: "CTO & Co-Founder",
    bio: "Ex-Spotify engineer. Passionate about using data science to solve music industry challenges."
  },
  {
    name: "Taylor Brooks",
    role: "Head of Product",
    bio: "Label veteran who understands the pain points of marketing teams. Designs tools that actually get used."
  }
];

export function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="py-24">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-[#00CFFF]/30">
              <Music2 className="h-4 w-4 text-[#00CFFF]" />
              <span className="text-sm uppercase tracking-wider text-[#00CFFF]">
                Our Story
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl uppercase tracking-tight">
              <span className="block">ABOUT</span>
              <span className="block bg-gradient-to-r from-[#00CFFF] to-[#FF00A8] bg-clip-text text-transparent">
                WRECKSHOP SOCIAL
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              We're on a mission to democratize music marketing. Every artist deserves the tools that major labels use — 
              without the enterprise price tag or complexity.
            </p>
          </div>

          {/* Origin Story */}
          <div className="max-w-4xl mx-auto mb-24 space-y-8">
            <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-[#00CFFF]/30">
              <CardContent className="p-8 md:p-12 space-y-6">
                <h2 className="text-3xl uppercase tracking-wide">
                  Why We Built This
                </h2>
                
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    In 2023, our founders were managing an independent hip-hop artist trying to promote a new album. 
                    They had the music, the talent, and a dedicated fanbase — but the marketing tools available were either 
                    too expensive (enterprise platforms charging $10k/month) or too generic (one-size-fits-all solutions 
                    built for e-commerce, not music).
                  </p>
                  
                  <p>
                    The turning point came when they tried to launch a geofenced SMS campaign for a hometown show. 
                    They had to cobble together Spotify API data, Google Sheets, Mailchimp, and Twilio — spending 
                    hours on manual work that should have been automated. The show sold out, but the process was painful.
                  </p>
                  
                  <p>
                    That's when we realized: <strong className="text-foreground">the music industry needs a platform that speaks its language</strong>. 
                    Not generic CRM software adapted for music, but a purpose-built tool designed around how artists, 
                    labels, and promoters actually work.
                  </p>

                  <p>
                    Wreckshop Social was born from that frustration. We partnered with Vintara Group to build the platform 
                    we wish we'd had — combining audience discovery, multi-channel campaigns, and real-time analytics 
                    in one affordable, easy-to-use package.
                  </p>

                  <p className="text-foreground">
                    Today, we're proud to serve over 10,000 artists, labels, and promoters worldwide. But we're just getting started.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Values */}
          <div className="max-w-6xl mx-auto mb-24">
            <h2 className="text-3xl uppercase tracking-wide mb-12 text-center">
              Our Values
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <Card 
                  key={index}
                  className="bg-card/30 backdrop-blur-sm border-border/50 hover:border-[#00CFFF]/50 transition-all duration-300"
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-[#00CFFF]/20 to-[#FF00A8]/20 border border-[#00CFFF]/30">
                        <value.icon className="h-6 w-6 text-[#00CFFF]" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <h3 className="text-xl uppercase tracking-wide">
                          {value.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Team */}
          <div className="max-w-6xl mx-auto mb-24">
            <h2 className="text-3xl uppercase tracking-wide mb-12 text-center">
              Meet The Team
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <Card 
                  key={index}
                  className="bg-card/30 backdrop-blur-sm border-border/50 hover:border-[#00CFFF]/50 transition-all duration-300 group"
                >
                  <CardContent className="p-6 space-y-4">
                    {/* Avatar placeholder */}
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#00CFFF] to-[#FF00A8] mx-auto group-hover:scale-105 transition-transform" />
                    
                    <div className="text-center space-y-2">
                      <h3 className="text-xl uppercase tracking-wide">
                        {member.name}
                      </h3>
                      <p className="text-sm text-[#00CFFF]">
                        {member.role}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {member.bio}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Vintara Group */}
          <div className="max-w-4xl mx-auto mb-24">
            <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-border/50">
              <CardContent className="p-8 md:p-12 space-y-6">
                <h2 className="text-3xl uppercase tracking-wide">
                  A Vintara Group Company
                </h2>
                
                <p className="text-muted-foreground leading-relaxed">
                  Wreckshop Social is proudly developed and operated by{" "}
                  <span className="text-[#00CFFF]">Vintara Group</span>, a technology holding company 
                  focused on building next-generation tools for creative industries. Vintara's portfolio includes 
                  platforms for music, film, and digital media — united by a commitment to empowering creators 
                  with data-driven tools.
                </p>
                
                <p className="text-muted-foreground leading-relaxed">
                  With Vintara's backing, we have the resources to innovate rapidly while maintaining the 
                  agility and focus of a dedicated product team. We're not a side project — music marketing 
                  is our core mission.
                </p>

                <div className="pt-4">
                  <a 
                    href="https://vintaragroup.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#00CFFF] hover:underline"
                  >
                    Learn more about Vintara Group →
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mission Statement */}
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl uppercase tracking-wide">
                Our Mission
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                "To give every artist, label, and promoter the power to discover, understand, and engage their 
                audience — without needing a marketing degree or a six-figure budget."
              </p>
            </div>

            <div className="pt-8 space-y-4">
              <p className="text-muted-foreground">
                Want to be part of the journey?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/careers"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-r from-[#00CFFF] to-[#FF00A8] hover:opacity-90 text-[#1E1E1E] transition-opacity uppercase tracking-wide"
                >
                  Join Our Team
                </a>
                <a 
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-card/50 border border-[#00CFFF]/50 hover:bg-[#00CFFF]/10 transition-colors uppercase tracking-wide"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}