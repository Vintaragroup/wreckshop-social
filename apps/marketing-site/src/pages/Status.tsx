import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { Card, CardContent } from "../components/ui/card";
import { CheckCircle2, AlertCircle, XCircle, Activity, Clock, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

const services = [
  { name: "API Gateway", status: "operational", uptime: "99.98%" },
  { name: "Web Application", status: "operational", uptime: "99.99%" },
  { name: "Email Delivery (SendGrid)", status: "operational", uptime: "99.95%" },
  { name: "SMS Delivery (Twilio)", status: "operational", uptime: "99.92%" },
  { name: "Spotify Integration", status: "operational", uptime: "99.87%" },
  { name: "Instagram Integration", status: "operational", uptime: "99.91%" },
  { name: "Analytics Dashboard", status: "operational", uptime: "99.97%" },
  { name: "Campaign Scheduler", status: "operational", uptime: "99.94%" },
  { name: "Database (PostgreSQL)", status: "operational", uptime: "99.99%" },
  { name: "File Storage (S3)", status: "operational", uptime: "100%" }
];

const incidents = [
  {
    date: "November 15, 2025",
    title: "Scheduled Maintenance: Database Upgrade",
    status: "resolved",
    severity: "maintenance",
    description: "Upgraded PostgreSQL from v14 to v15 for improved performance. No customer impact.",
    duration: "2 hours",
    resolution: "Completed successfully at 3:00 AM EST"
  },
  {
    date: "November 3, 2025",
    title: "Partial Outage: Spotify API Integration",
    status: "resolved",
    severity: "major",
    description: "Spotify's API experienced rate limiting issues affecting audience sync for ~45 minutes.",
    duration: "45 minutes",
    resolution: "Spotify resolved upstream issue. All data synced retroactively."
  },
  {
    date: "October 28, 2025",
    title: "Minor Delay: Email Campaign Delivery",
    status: "resolved",
    severity: "minor",
    description: "SendGrid experienced a brief delay in email delivery. Campaigns queued and delivered within 30 minutes.",
    duration: "30 minutes",
    resolution: "SendGrid restored normal operations. All emails delivered."
  }
];

const metrics = [
  { label: "Overall Uptime (30 days)", value: "99.96%", icon: TrendingUp, color: "text-[#00CFFF]" },
  { label: "Avg Response Time", value: "124ms", icon: Activity, color: "text-[#00CFFF]" },
  { label: "Active Incidents", value: "0", icon: AlertCircle, color: "text-[#00CFFF]" },
  { label: "Last Outage", value: "45 days ago", icon: Clock, color: "text-muted-foreground" }
];

export function Status() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "degraded":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "outage":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    const colors = {
      maintenance: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      minor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      major: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      critical: "bg-red-500/20 text-red-400 border-red-500/30"
    };
    
    return (
      <span className={`px-2 py-1 rounded-full border text-xs uppercase tracking-wider ${colors[severity as keyof typeof colors]}`}>
        {severity}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-16 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-green-500/30">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm uppercase tracking-wider text-green-400">
                All Systems Operational
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl uppercase tracking-tight">
              <span className="block">SYSTEM</span>
              <span className="block bg-gradient-to-r from-[#00CFFF] to-[#FF00A8] bg-clip-text text-transparent">
                STATUS
              </span>
            </h1>
            
            <p className="text-muted-foreground">
              Real-time status and uptime monitoring for Wreckshop Social platform
            </p>
            
            <p className="text-sm text-muted-foreground">
              Last updated: {currentTime.toLocaleString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZoneName: 'short'
              })}
            </p>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {metrics.map((metric, index) => (
              <Card key={index} className="bg-card/30 backdrop-blur-sm border-border/50">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <metric.icon className={`h-5 w-5 ${metric.color}`} />
                  </div>
                  <div className="space-y-1">
                    <div className={`text-3xl ${metric.color}`}>
                      {metric.value}
                    </div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {metric.label}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Service Status */}
          <div className="mb-16">
            <h2 className="text-2xl uppercase tracking-wide mb-6">
              Service Status
            </h2>
            
            <Card className="bg-card/30 backdrop-blur-sm border-border/50">
              <CardContent className="p-0">
                <div className="divide-y divide-border/30">
                  {services.map((service, index) => (
                    <div 
                      key={index}
                      className="p-6 flex items-center justify-between hover:bg-card/20 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        {getStatusIcon(service.status)}
                        <div>
                          <h3 className="uppercase tracking-wide">
                            {service.name}
                          </h3>
                          <p className="text-sm text-muted-foreground capitalize">
                            {service.status}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          30-day uptime
                        </p>
                        <p className="text-[#00CFFF]">
                          {service.uptime}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Incident History */}
          <div className="mb-16">
            <h2 className="text-2xl uppercase tracking-wide mb-6">
              Incident History
            </h2>
            
            <div className="space-y-6">
              {incidents.map((incident, index) => (
                <Card 
                  key={index}
                  className="bg-card/30 backdrop-blur-sm border-border/50"
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start gap-3 flex-wrap">
                          {getSeverityBadge(incident.severity)}
                          <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 text-xs uppercase tracking-wider">
                            Resolved
                          </span>
                        </div>
                        
                        <div>
                          <h3 className="text-xl uppercase tracking-wide mb-1">
                            {incident.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {incident.date} • Duration: {incident.duration}
                          </p>
                        </div>
                        
                        <p className="text-muted-foreground leading-relaxed">
                          {incident.description}
                        </p>
                        
                        <div className="pt-2 border-t border-border/30">
                          <p className="text-sm">
                            <span className="text-[#00CFFF]">Resolution:</span>{" "}
                            <span className="text-muted-foreground">{incident.resolution}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Subscribe to Updates */}
          <div className="mb-16">
            <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-[#00CFFF]/30">
              <CardContent className="p-8 text-center space-y-4">
                <h3 className="text-2xl uppercase tracking-wide">
                  Get Status Updates
                </h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Subscribe to receive email or SMS alerts when incidents occur. We'll notify you immediately 
                  of any service disruptions and keep you updated on resolution progress.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <input 
                    type="email"
                    placeholder="your@email.com"
                    className="px-4 py-2 rounded-lg bg-input-background border border-border/50 focus:border-[#00CFFF] outline-none"
                  />
                  <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#00CFFF] to-[#FF00A8] hover:opacity-90 text-[#1E1E1E] uppercase tracking-wide transition-opacity">
                    Subscribe
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card/20 backdrop-blur-sm border-border/30">
              <CardContent className="p-6 space-y-3">
                <h4 className="uppercase tracking-wide">
                  Service Level Agreement (SLA)
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We guarantee 99.9% uptime for our core platform. Enterprise customers receive SLA credits 
                  if we fall below this threshold. See our{" "}
                  <a href="/terms" className="text-[#00CFFF] hover:underline">Terms of Service</a>{" "}
                  for details.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/20 backdrop-blur-sm border-border/30">
              <CardContent className="p-6 space-y-3">
                <h4 className="uppercase tracking-wide">
                  Report an Issue
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Experiencing problems? Contact our support team at{" "}
                  <a href="mailto:support@wreckshopsocial.com" className="text-[#00CFFF] hover:underline">
                    support@wreckshopsocial.com
                  </a>{" "}
                  or use the live chat in your dashboard.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
