import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { Card, CardContent } from "../components/ui/card";
import { Briefcase, MapPin, Clock, DollarSign, Heart, Zap, Users, Globe } from "lucide-react";
import { Button } from "../components/ui/button";

const benefits = [
  {
    icon: DollarSign,
    title: "Competitive Salary",
    description: "Market-rate compensation with equity options for early employees"
  },
  {
    icon: Heart,
    title: "Health & Wellness",
    description: "Comprehensive health, dental, vision, and mental health coverage"
  },
  {
    icon: Globe,
    title: "Remote-First",
    description: "Work from anywhere with flexible hours and async collaboration"
  },
  {
    icon: Zap,
    title: "Growth & Learning",
    description: "$2K annual budget for courses, conferences, and skill development"
  },
  {
    icon: Clock,
    title: "Unlimited PTO",
    description: "Take the time you need — we trust you to manage your schedule"
  },
  {
    icon: Users,
    title: "Team Retreats",
    description: "Quarterly in-person meetups in music cities (LA, Nashville, Austin)"
  }
];

const openings = [
  {
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    location: "Remote (US)",
    type: "Full-Time",
    salary: "$140K - $180K",
    description: "Build scalable marketing automation features using React, Node.js, and PostgreSQL. Experience with real-time data pipelines a plus.",
    requirements: ["5+ years full-stack development", "React/TypeScript expertise", "API design & database optimization", "Music industry passion"]
  },
  {
    title: "Product Marketing Manager",
    department: "Marketing",
    location: "Remote (US/EU)",
    type: "Full-Time",
    salary: "$110K - $140K",
    description: "Own go-to-market strategy for new features, create compelling content, and grow our brand in the music industry.",
    requirements: ["4+ years product marketing", "Music or SaaS background", "Excellent writing skills", "Data-driven mindset"]
  },
  {
    title: "Customer Success Lead",
    department: "Customer Success",
    location: "Remote (US)",
    type: "Full-Time",
    salary: "$90K - $120K",
    description: "Be the voice of our customers. Help artists and labels succeed with onboarding, training, and strategic campaign guidance.",
    requirements: ["3+ years customer success/support", "Music industry experience preferred", "Empathy & problem-solving skills", "Spreadsheets wizard"]
  },
  {
    title: "Data Scientist (Music Analytics)",
    department: "Data",
    location: "Remote (Global)",
    type: "Full-Time",
    salary: "$130K - $170K",
    description: "Build predictive models for audience segmentation, campaign optimization, and music trend forecasting.",
    requirements: ["PhD or 5+ years in data science", "Python/R & SQL mastery", "Machine learning in production", "Music streaming data experience"]
  },
  {
    title: "Content Creator (Music Marketing)",
    department: "Marketing",
    location: "Remote (US)",
    type: "Contract",
    salary: "$60/hr",
    description: "Create blog posts, case studies, video tutorials, and social content that educates music professionals.",
    requirements: ["Portfolio of music/tech writing", "Video production skills", "Deep music industry knowledge", "SEO understanding"]
  }
];

const values = [
  {
    title: "Music First",
    description: "We're music lovers building for music lovers. Your work directly impacts artists' careers."
  },
  {
    title: "Transparency",
    description: "Open salaries, open roadmap, open feedback. No hidden agendas or office politics."
  },
  {
    title: "Ownership",
    description: "You own your projects from idea to launch. We hire smart people and get out of their way."
  },
  {
    title: "Diversity",
    description: "Music is universal. Our team should reflect that — all backgrounds, identities, and perspectives welcome."
  }
];

export function Careers() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="py-24">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-[#00CFFF]/30">
              <Briefcase className="h-4 w-4 text-[#00CFFF]" />
              <span className="text-sm uppercase tracking-wider text-[#00CFFF]">
                Join The Team
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl uppercase tracking-tight">
              <span className="block">BUILD THE FUTURE</span>
              <span className="block bg-gradient-to-r from-[#00CFFF] to-[#FF00A8] bg-clip-text text-transparent">
                OF MUSIC MARKETING
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              We're a small, scrappy team on a mission to democratize music marketing. 
              If you're passionate about music, data, and empowering creators — we want to hear from you.
            </p>
          </div>

          {/* Values */}
          <div className="max-w-6xl mx-auto mb-24">
            <h2 className="text-3xl uppercase tracking-wide mb-12 text-center">
              What We Believe
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <Card 
                  key={index}
                  className="bg-card/30 backdrop-blur-sm border-border/50 hover:border-[#00CFFF]/50 transition-all duration-300"
                >
                  <CardContent className="p-6 text-center space-y-3">
                    <h3 className="text-xl uppercase tracking-wide">
                      {value.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="max-w-6xl mx-auto mb-24">
            <h2 className="text-3xl uppercase tracking-wide mb-12 text-center">
              Perks & Benefits
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <Card 
                  key={index}
                  className="bg-card/30 backdrop-blur-sm border-border/50"
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-[#00CFFF]/20 to-[#FF00A8]/20 border border-[#00CFFF]/30">
                        <benefit.icon className="h-6 w-6 text-[#00CFFF]" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <h3 className="uppercase tracking-wide">
                          {benefit.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Open Positions */}
          <div className="max-w-6xl mx-auto mb-24">
            <h2 className="text-3xl uppercase tracking-wide mb-12 text-center">
              Open Positions ({openings.length})
            </h2>
            <div className="space-y-6">
              {openings.map((job, index) => (
                <Card 
                  key={index}
                  className="bg-card/30 backdrop-blur-sm border-border/50 hover:border-[#00CFFF]/50 transition-all duration-300"
                >
                  <CardContent className="p-8">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-2xl uppercase tracking-wide">
                              {job.title}
                            </h3>
                            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#00CFFF]/20 to-[#FF00A8]/20 border border-[#00CFFF]/30 text-xs uppercase tracking-wider text-[#00CFFF]">
                              {job.department}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>{job.type}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4" />
                              <span>{job.salary}</span>
                            </div>
                          </div>
                        </div>

                        <p className="text-muted-foreground leading-relaxed">
                          {job.description}
                        </p>

                        <div className="space-y-2">
                          <h4 className="text-sm uppercase tracking-wide text-foreground/80">
                            Key Requirements:
                          </h4>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {job.requirements.map((req, reqIndex) => (
                              <li key={reqIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <span className="text-[#00CFFF] mt-1">•</span>
                                <span>{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        <Button className="w-full lg:w-auto bg-gradient-to-r from-[#00CFFF] to-[#FF00A8] hover:opacity-90 text-[#1E1E1E]">
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Don't See a Fit */}
          <div className="max-w-3xl mx-auto">
            <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-[#00CFFF]/30">
              <CardContent className="p-8 md:p-12 text-center space-y-6">
                <h2 className="text-3xl uppercase tracking-wide">
                  Don't See a Fit?
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We're always looking for exceptional talent. If you're passionate about music tech and think you'd be a great addition 
                  to the team, send us your resume and a note about what excites you.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    variant="outline"
                    className="border-[#00CFFF]/50 hover:bg-[#00CFFF]/10"
                  >
                    Email: careers@wreckshopsocial.com
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-[#00CFFF]/50 hover:bg-[#00CFFF]/10"
                  >
                    Follow Us on LinkedIn
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Equal Opportunity */}
          <div className="max-w-4xl mx-auto mt-20 text-center space-y-4">
            <h3 className="text-xl uppercase tracking-wide">
              Equal Opportunity Employer
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Wreckshop Social (Vintara Group) is committed to creating a diverse and inclusive workplace. We do not discriminate 
              on the basis of race, color, religion, gender, gender identity, sexual orientation, national origin, disability, age, 
              or veteran status. We actively encourage applications from underrepresented groups in tech and music.
            </p>
            <p className="text-sm text-muted-foreground">
              Need accommodations during the interview process? Email{" "}
              <a href="mailto:careers@wreckshopsocial.com" className="text-[#00CFFF] hover:underline">
                careers@wreckshopsocial.com
              </a>
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
