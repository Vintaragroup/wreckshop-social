import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { Card, CardContent } from "../components/ui/card";
import { Book, Code, Rocket, Zap, Search, ChevronRight } from "lucide-react";
import { Input } from "../components/ui/input";
import { useState } from "react";

const docCategories = [
  {
    title: "Getting Started",
    icon: Rocket,
    description: "Quick start guides and onboarding tutorials",
    articles: [
      { title: "Platform Overview", time: "5 min" },
      { title: "Creating Your First Campaign", time: "10 min" },
      { title: "Connecting Social Platforms", time: "8 min" },
      { title: "Understanding Your Dashboard", time: "7 min" }
    ]
  },
  {
    title: "Features & Guides",
    icon: Book,
    description: "In-depth feature documentation and best practices",
    articles: [
      { title: "Audience Segmentation Strategies", time: "15 min" },
      { title: "Campaign Orchestration Workflows", time: "12 min" },
      { title: "Geofencing Setup & Optimization", time: "10 min" },
      { title: "Analytics & Reporting Deep Dive", time: "18 min" },
      { title: "Email Campaign Best Practices", time: "12 min" },
      { title: "SMS Marketing Compliance Guide", time: "20 min" }
    ]
  },
  {
    title: "Integrations",
    icon: Zap,
    description: "Connect third-party platforms and tools",
    articles: [
      { title: "Spotify for Artists Integration", time: "7 min" },
      { title: "Instagram Business Account Setup", time: "9 min" },
      { title: "TikTok for Business Connection", time: "8 min" },
      { title: "Mailchimp Sync Configuration", time: "10 min" },
      { title: "Twilio SMS Setup", time: "12 min" },
      { title: "Custom Webhooks", time: "15 min" }
    ]
  }
];

const popularArticles = [
  {
    title: "How to Create a Multi-Channel Album Release Campaign",
    category: "Tutorial",
    views: "12.4K",
    helpful: "98%"
  },
  {
    title: "Understanding Campaign Analytics: CTR, Open Rates, and Conversions",
    category: "Analytics",
    views: "9.8K",
    helpful: "96%"
  },
  {
    title: "GDPR Compliance Checklist for Music Marketers",
    category: "Legal",
    views: "7.2K",
    helpful: "99%"
  },
  {
    title: "Troubleshooting Spotify API Connection Issues",
    category: "Technical",
    views: "6.1K",
    helpful: "94%"
  }
];

export function Documentation() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="py-24">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-[#00CFFF]/30">
              <Book className="h-4 w-4 text-[#00CFFF]" />
              <span className="text-sm uppercase tracking-wider text-[#00CFFF]">
                Knowledge Base
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl uppercase tracking-tight">
              <span className="block">HELP &</span>
              <span className="block bg-gradient-to-r from-[#00CFFF] to-[#FF00A8] bg-clip-text text-transparent">
                DOCUMENTATION
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              Everything you need to master Wreckshop Social and grow your music audience.
            </p>

            {/* Search */}
            <div className="relative max-w-2xl mx-auto pt-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                type="search"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 bg-card/50 border-border/50 focus:border-[#00CFFF] text-lg"
              />
            </div>
          </div>

          {/* Quick Links */}
          <div className="max-w-4xl mx-auto mb-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Getting Started", href: "#getting-started" },
                { label: "API Docs", href: "#api" },
                { label: "Video Tutorials", href: "#videos" },
                { label: "Contact Support", href: "/contact" }
              ].map((link, index) => (
                <a 
                  key={index}
                  href={link.href}
                  className="p-4 rounded-lg bg-card/30 backdrop-blur-sm border border-border/50 hover:border-[#00CFFF]/50 transition-all text-center group"
                >
                  <span className="uppercase tracking-wide text-sm group-hover:text-[#00CFFF] transition-colors">
                    {link.label}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Documentation Categories */}
          <div className="max-w-7xl mx-auto mb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {docCategories.map((category, index) => (
                <Card 
                  key={index}
                  className="bg-card/30 backdrop-blur-sm border-border/50 hover:border-[#00CFFF]/50 transition-all duration-300"
                >
                  <CardContent className="p-8 space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-[#00CFFF]/20 to-[#FF00A8]/20 border border-[#00CFFF]/30">
                        <category.icon className="h-6 w-6 text-[#00CFFF]" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <h3 className="text-2xl uppercase tracking-wide">
                          {category.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {category.description}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {category.articles.map((article, articleIndex) => (
                        <a 
                          key={articleIndex}
                          href="/contact"
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-card/30 transition-colors group"
                        >
                          <span className="text-sm">{article}</span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-[#00CFFF] group-hover:translate-x-1 transition-all" />
                        </a>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-border/30">
                      <a 
                        href="/contact"
                        className="text-sm text-[#00CFFF] hover:underline flex items-center gap-2"
                      >
                        View all {category.title.toLowerCase()}
                        <ChevronRight className="h-4 w-4" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Popular Articles */}
          <div className="max-w-6xl mx-auto mb-20">
            <h2 className="text-3xl uppercase tracking-wide mb-8">
              Popular Articles
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {popularArticles.map((article, index) => (
                <Card 
                  key={index}
                  className="bg-card/30 backdrop-blur-sm border-border/50 hover:border-[#00CFFF]/50 transition-all duration-300 group cursor-pointer"
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <span className="inline-block px-2 py-1 rounded-full bg-card/50 border border-border/30 text-xs uppercase tracking-wider text-muted-foreground">
                        {article.category}
                      </span>
                      <h3 className="uppercase tracking-wide group-hover:text-[#00CFFF] transition-colors">
                        {article.title}
                      </h3>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span>{article.views} views</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{article.helpful} found helpful</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* API Quick Start */}
          <div className="max-w-5xl mx-auto mb-20">
            <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-[#00CFFF]/30">
              <CardContent className="p-8 md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <div className="inline-flex p-3 rounded-lg bg-gradient-to-br from-[#00CFFF]/20 to-[#FF00A8]/20 border border-[#00CFFF]/30">
                      <Code className="h-8 w-8 text-[#00CFFF]" />
                    </div>
                    <h2 className="text-3xl uppercase tracking-wide">
                      Start Building with Our API
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Integrate Wreckshop Social into your workflow with our RESTful API. 
                      Comprehensive documentation, code examples, and SDKs for popular languages.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#00CFFF] to-[#FF00A8] hover:opacity-90 text-[#1E1E1E] uppercase tracking-wide transition-opacity">
                        View API Docs
                      </button>
                      <button className="px-6 py-3 rounded-lg bg-card/50 border border-[#00CFFF]/50 hover:bg-[#00CFFF]/10 uppercase tracking-wide transition-colors">
                        Get API Key
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#1E1E1E] rounded-lg p-6 border border-[#00CFFF]/30 overflow-x-auto">
                    <pre className="text-sm text-green-400 font-mono">
{`# Example: Create Campaign
curl -X POST \\
  https://api.wreckshop.social/v1/campaigns \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Album Release",
    "channels": ["email", "sms"],
    "audience_segment": "super_fans",
    "schedule": "2025-12-01T18:00:00Z"
  }'`}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Video Tutorials */}
          <div className="max-w-6xl mx-auto mb-20">
            <h2 className="text-3xl uppercase tracking-wide mb-8">
              Video Tutorials
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Platform Walkthrough", duration: "12:34", thumbnail: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&q=80" },
                { title: "Creating Your First Campaign", duration: "8:45", thumbnail: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&q=80" },
                { title: "Advanced Segmentation", duration: "15:20", thumbnail: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80" }
              ].map((video, index) => (
                <Card 
                  key={index}
                  className="overflow-hidden bg-card/30 backdrop-blur-sm border-border/50 hover:border-[#00CFFF]/50 transition-all duration-300 group cursor-pointer"
                >
                  <div 
                    className="h-48 bg-cover bg-center relative group-hover:scale-105 transition-transform"
                    style={{ backgroundImage: `url(${video.thumbnail})` }}
                  >
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-[#00CFFF]/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <div className="w-0 h-0 border-l-[16px] border-l-[#1E1E1E] border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent ml-1" />
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 px-2 py-1 rounded bg-black/80 text-xs">
                      {video.duration}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="uppercase tracking-wide group-hover:text-[#00CFFF] transition-colors">
                      {video.title}
                    </h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Still Need Help */}
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl uppercase tracking-wide">
              Still Need Help?
            </h2>
            <p className="text-muted-foreground">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-r from-[#00CFFF] to-[#FF00A8] hover:opacity-90 text-[#1E1E1E] uppercase tracking-wide transition-opacity"
              >
                Contact Support
              </a>
              <a 
                href="/community"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-card/50 border border-[#00CFFF]/50 hover:bg-[#00CFFF]/10 uppercase tracking-wide transition-colors"
              >
                Join Community
              </a>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}