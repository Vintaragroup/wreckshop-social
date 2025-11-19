import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { Card, CardContent } from "../components/ui/card";
import { BookOpen, Calendar, Clock, User, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const featuredPost = {
  title: "How Independent Artists Are Using AI to 10x Their Marketing ROI",
  excerpt: "Discover how emerging artists are leveraging automation and data analytics to compete with major label marketing budgets.",
  author: "Taylor Brooks",
  date: "November 15, 2025",
  readTime: "8 min read",
  category: "Case Study",
  image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80"
};

const blogPosts = [
  {
    title: "The Ultimate Guide to Spotify Audience Segmentation",
    excerpt: "Learn how to identify your super fans and create targeted campaigns that convert listeners into ticket buyers.",
    author: "Alex Rivera",
    date: "November 12, 2025",
    readTime: "6 min read",
    category: "Tutorial",
    image: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=600&q=80"
  },
  {
    title: "5 SMS Campaign Strategies for Sold-Out Shows",
    excerpt: "Geofencing, exclusivity, and urgency tactics that drive ticket sales in the final 48 hours before a show.",
    author: "Jordan Chen",
    date: "November 8, 2025",
    readTime: "5 min read",
    category: "Strategy",
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=600&q=80"
  },
  {
    title: "GDPR Compliance for Music Marketers: What You Need to Know",
    excerpt: "A practical guide to collecting fan data legally and building trust with your European audience.",
    author: "Taylor Brooks",
    date: "November 5, 2025",
    readTime: "7 min read",
    category: "Legal",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80"
  },
  {
    title: "From 500 to 50K Followers: A Label's Growth Story",
    excerpt: "How a small indie label used data-driven marketing to grow their collective fanbase by 10,000% in 18 months.",
    author: "Alex Rivera",
    date: "November 1, 2025",
    readTime: "10 min read",
    category: "Case Study",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80"
  },
  {
    title: "Understanding Email Open Rates in the Music Industry",
    excerpt: "Benchmark data from 10,000+ music marketing campaigns and tactics to improve your email performance.",
    author: "Jordan Chen",
    date: "October 28, 2025",
    readTime: "5 min read",
    category: "Analytics",
    image: "https://images.unsplash.com/photo-1557838923-2985c318be48?w=600&q=80"
  },
  {
    title: "Building a Multi-Channel Release Campaign: Step by Step",
    excerpt: "Pre-save, email drip, SMS blasts, and social ads — orchestrate your album launch like a pro.",
    author: "Taylor Brooks",
    date: "October 24, 2025",
    readTime: "12 min read",
    category: "Tutorial",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&q=80"
  }
];

const categories = ["All", "Case Study", "Tutorial", "Strategy", "Legal", "Analytics"];

export function Blog() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="py-24">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-[#00CFFF]/30">
              <BookOpen className="h-4 w-4 text-[#00CFFF]" />
              <span className="text-sm uppercase tracking-wider text-[#00CFFF]">
                Insights & Resources
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl uppercase tracking-tight">
              <span className="block">WRECKSHOP</span>
              <span className="block bg-gradient-to-r from-[#00CFFF] to-[#FF00A8] bg-clip-text text-transparent">
                BLOG
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              Marketing strategies, industry insights, and success stories to help you grow your music audience.
            </p>
          </div>

          {/* Newsletter Signup */}
          <div className="max-w-2xl mx-auto mb-20">
            <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-[#00CFFF]/30">
              <CardContent className="p-6 md:p-8">
                <div className="space-y-4">
                  <h3 className="text-xl uppercase tracking-wide text-center">
                    Get Marketing Tips in Your Inbox
                  </h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Weekly articles on music marketing, platform updates, and industry trends.
                  </p>
                  <form className="flex flex-col sm:flex-row gap-3">
                    <Input 
                      type="email" 
                      placeholder="your@email.com" 
                      className="flex-1 bg-input-background border-border/50 focus:border-[#00CFFF]"
                    />
                    <Button className="bg-gradient-to-r from-[#00CFFF] to-[#FF00A8] hover:opacity-90 text-[#1E1E1E]">
                      Subscribe
                    </Button>
                  </form>
                  <p className="text-xs text-muted-foreground text-center">
                    No spam. Unsubscribe anytime.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full border transition-colors ${
                  category === "All" 
                    ? "bg-[#00CFFF]/20 border-[#00CFFF] text-[#00CFFF]" 
                    : "border-border/50 hover:border-[#00CFFF]/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Featured Post */}
          <div className="max-w-6xl mx-auto mb-20">
            <Card className="overflow-hidden bg-card/30 backdrop-blur-sm border-border/50 hover:border-[#00CFFF]/50 transition-all duration-300 group">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div 
                  className="h-64 md:h-auto bg-cover bg-center"
                  style={{ backgroundImage: `url(${featuredPost.image})` }}
                />
                <CardContent className="p-8 md:p-12 flex flex-col justify-center space-y-6">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-[#00CFFF]/20 to-[#FF00A8]/20 border border-[#00CFFF]/30 text-xs uppercase tracking-wider text-[#00CFFF] mb-4">
                      Featured
                    </span>
                    <h2 className="text-3xl uppercase tracking-wide mb-4 group-hover:text-[#00CFFF] transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {featuredPost.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{featuredPost.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{featuredPost.readTime}</span>
                    </div>
                  </div>

                  <Button className="w-full md:w-auto bg-gradient-to-r from-[#00CFFF] to-[#FF00A8] hover:opacity-90 text-[#1E1E1E]">
                    Read Article
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </div>
            </Card>
          </div>

          {/* Blog Grid */}
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl uppercase tracking-wide mb-8">Latest Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post, index) => (
                <Card 
                  key={index}
                  className="overflow-hidden bg-card/30 backdrop-blur-sm border-border/50 hover:border-[#00CFFF]/50 transition-all duration-300 group cursor-pointer"
                >
                  <div 
                    className="h-48 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                    style={{ backgroundImage: `url(${post.image})` }}
                  />
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <span className="inline-block px-2 py-1 rounded-full bg-card/50 border border-border/30 text-xs uppercase tracking-wider text-muted-foreground mb-3">
                        {post.category}
                      </span>
                      <h3 className="text-lg uppercase tracking-wide mb-2 group-hover:text-[#00CFFF] transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 text-xs text-muted-foreground pt-4 border-t border-border/30">
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          <span>{post.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button 
                variant="outline" 
                size="lg"
                className="border-[#00CFFF]/50 hover:bg-[#00CFFF]/10"
              >
                Load More Articles
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
