import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { Card, CardContent } from "../components/ui/card";
import { TrendingUp, Users, Target, DollarSign, Music, Building2 } from "lucide-react";
import { Button } from "../components/ui/button";

const caseStudies = [
  {
    company: "Luna Rose",
    type: "Independent Artist",
    genre: "Indie Pop",
    challenge: "Growing from 5K to 50K monthly listeners on Spotify while maintaining engagement",
    solution: "Multi-channel campaign using audience segmentation, geofenced SMS for local shows, and Instagram DM automation",
    metrics: [
      { label: "Monthly Listeners", before: "5,234", after: "52,891", change: "+911%" },
      { label: "Email List Growth", before: "1,200", after: "18,500", change: "+1,442%" },
      { label: "Show Attendance", before: "120 avg", after: "850 avg", change: "+608%" },
      { label: "Merch Revenue", before: "$2.1K/mo", after: "$19.8K/mo", change: "+843%" }
    ],
    quote: "Wreckshop Social helped me understand WHO my fans are, not just how many I have. The geofencing feature alone paid for itself 10x over.",
    author: "Luna Rose, Artist",
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&q=80",
    color: "from-[#00CFFF] to-[#FF00A8]"
  },
  {
    company: "Vibe Collective Records",
    type: "Independent Label",
    genre: "Hip-Hop / R&B",
    challenge: "Managing campaigns for 12 artists with limited budget and staff",
    solution: "Automated campaign templates, unified audience dashboard, and cross-promotion strategies across roster",
    metrics: [
      { label: "Campaign Efficiency", before: "4 hrs/artist", after: "45 min/artist", change: "-81%" },
      { label: "Collective Reach", before: "85K", after: "620K", change: "+629%" },
      { label: "Conversion Rate", before: "2.3%", after: "8.7%", change: "+278%" },
      { label: "ROI on Ad Spend", before: "1.8x", after: "6.2x", change: "+244%" }
    ],
    quote: "We went from spending entire days on email blasts to launching sophisticated multi-channel campaigns in under an hour. Game changer.",
    author: "Marcus Johnson, Label Manager",
    image: "https://images.unsplash.com/photo-1571974599782-87624638275f?w=600&q=80",
    color: "from-[#FF00A8] to-[#00CFFF]"
  },
  {
    company: "Bass City Festivals",
    type: "Event Promoter",
    genre: "EDM / Festival",
    challenge: "Selling out 5,000-capacity venue for quarterly music festival",
    solution: "Lookalike audience targeting from past attendees, countdown SMS campaigns, and VIP early access tiers",
    metrics: [
      { label: "Ticket Sales Timeline", before: "8 weeks to sell", after: "72 hours to sell", change: "+97% faster" },
      { label: "Revenue per Event", before: "$185K", after: "$312K", change: "+69%" },
      { label: "Repeat Attendees", before: "23%", after: "61%", change: "+165%" },
      { label: "Marketing Cost/Ticket", before: "$8.40", after: "$2.90", change: "-65%" }
    ],
    quote: "The geofencing feature is insane. We target fans who attended similar events in our city and convert them at 4x the rate of broad social ads.",
    author: "Priya Patel, Festival Director",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80",
    color: "from-[#00CFFF] to-[#00CFFF]/50"
  }
];

const industryStats = [
  { icon: Users, label: "Active Artists & Labels", value: "10,000+" },
  { icon: Target, label: "Campaigns Launched", value: "250K+" },
  { icon: TrendingUp, label: "Avg. ROI Increase", value: "380%" },
  { icon: DollarSign, label: "Revenue Generated", value: "$42M+" }
];

export function CaseStudies() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="py-24">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-[#00CFFF]/30">
              <TrendingUp className="h-4 w-4 text-[#00CFFF]" />
              <span className="text-sm uppercase tracking-wider text-[#00CFFF]">
                Success Stories
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl uppercase tracking-tight">
              <span className="block">PROVEN</span>
              <span className="block bg-gradient-to-r from-[#00CFFF] to-[#FF00A8] bg-clip-text text-transparent">
                RESULTS
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              Real artists, real labels, real growth. See how music professionals are using Wreckshop Social 
              to transform their marketing and explode their audiences.
            </p>
          </div>

          {/* Industry Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-24">
            {industryStats.map((stat, index) => (
              <Card key={index} className="bg-card/30 backdrop-blur-sm border-border/50">
                <CardContent className="p-6 text-center space-y-3">
                  <div className="inline-flex p-3 rounded-lg bg-gradient-to-br from-[#00CFFF]/20 to-[#FF00A8]/20 border border-[#00CFFF]/30">
                    <stat.icon className="h-6 w-6 text-[#00CFFF]" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl bg-gradient-to-r from-[#00CFFF] to-[#FF00A8] bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Case Studies */}
          <div className="max-w-7xl mx-auto space-y-24">
            {caseStudies.map((study, index) => (
              <div key={index} className="space-y-8">
                <Card className="overflow-hidden bg-card/30 backdrop-blur-sm border-border/50">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                    {/* Image */}
                    <div 
                      className="h-64 lg:h-auto bg-cover bg-center relative"
                      style={{ backgroundImage: `url(${study.image})` }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${study.color} opacity-20`} />
                    </div>

                    {/* Content */}
                    <CardContent className="p-8 lg:p-12 flex flex-col justify-center space-y-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className={`px-3 py-1 rounded-full bg-gradient-to-r ${study.color} text-xs uppercase tracking-wider text-[#1E1E1E]`}>
                            {study.type}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {study.genre}
                          </span>
                        </div>
                        
                        <h2 className="text-4xl uppercase tracking-wide">
                          {study.company}
                        </h2>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm uppercase tracking-wide text-[#00CFFF] mb-2">
                            Challenge
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {study.challenge}
                          </p>
                        </div>

                        <div>
                          <h3 className="text-sm uppercase tracking-wide text-[#00CFFF] mb-2">
                            Solution
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {study.solution}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {study.metrics.map((metric, metricIndex) => (
                    <Card 
                      key={metricIndex}
                      className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-[#00CFFF]/30"
                    >
                      <CardContent className="p-6 space-y-3">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                          {metric.label}
                        </p>
                        <div className="space-y-1">
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm text-muted-foreground line-through">
                              {metric.before}
                            </span>
                            <span className="text-2xl">
                              →
                            </span>
                            <span className="text-2xl text-foreground">
                              {metric.after}
                            </span>
                          </div>
                          <div className={`text-sm uppercase tracking-wide bg-gradient-to-r ${study.color} bg-clip-text text-transparent`}>
                            {metric.change}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Quote */}
                <Card className="bg-card/20 backdrop-blur-sm border-border/30">
                  <CardContent className="p-8 md:p-12">
                    <blockquote className="space-y-4">
                      <p className="text-xl md:text-2xl text-foreground leading-relaxed italic">
                        "{study.quote}"
                      </p>
                      <footer className="flex items-center gap-3 text-muted-foreground">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                        <span className="text-sm">{study.author}</span>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                      </footer>
                    </blockquote>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="max-w-3xl mx-auto text-center mt-24 space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl uppercase tracking-wide">
                Ready to Write Your Success Story?
              </h2>
              <p className="text-lg text-muted-foreground">
                Join 10,000+ artists and labels growing their audiences with data-driven marketing.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-[#00CFFF] to-[#FF00A8] hover:opacity-90 text-[#1E1E1E]"
              >
                Start Free Trial
              </Button>
              <Button 
                size="lg"
                variant="outline" 
                className="border-[#00CFFF]/50 hover:bg-[#00CFFF]/10"
              >
                Schedule Demo
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              14-day free trial • No credit card required • Setup in 5 minutes
            </p>
          </div>

          {/* Download Case Study */}
          <div className="max-w-4xl mx-auto mt-20">
            <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-[#00CFFF]/30">
              <CardContent className="p-8 text-center space-y-4">
                <div className="inline-flex p-4 rounded-lg bg-gradient-to-br from-[#00CFFF]/20 to-[#FF00A8]/20 border border-[#00CFFF]/30">
                  <Building2 className="h-8 w-8 text-[#00CFFF]" />
                </div>
                <h3 className="text-2xl uppercase tracking-wide">
                  Enterprise Case Studies
                </h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Looking for detailed PDFs with full campaign breakdowns? Download our enterprise case study package 
                  with ROI calculations, technical implementation details, and strategic insights.
                </p>
                <Button 
                  variant="outline"
                  className="border-[#00CFFF]/50 hover:bg-[#00CFFF]/10"
                >
                  Download Full Case Studies (PDF)
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
