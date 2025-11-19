import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { HowItWorks } from "./components/HowItWorks";
import { UseCases } from "./components/UseCases";
import { Testimonials } from "./components/Testimonials";
import { DataPrivacy } from "./components/DataPrivacy";
import { Pricing } from "./components/Pricing";
import { Footer } from "./components/Footer";
import { CookieConsent, ThemeProvider } from "@marketing-core";
import { useState, useEffect } from "react";

// Pages
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { TermsOfService } from "./pages/TermsOfService";
import { Security } from "./pages/Security";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { Integrations } from "./pages/Integrations";
import { CookiePolicy } from "./pages/CookiePolicy";
import { Blog } from "./pages/Blog";
import { CaseStudies } from "./pages/CaseStudies";
import { Careers } from "./pages/Careers";
import { Status } from "./pages/Status";
import { Documentation } from "./pages/Documentation";
import { DoNotSell } from "./pages/DoNotSell";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { Artists } from "./pages/Artists";
import { Labels } from "./pages/Labels";
import { Promoters } from "./pages/Promoters";
import { Community } from "./pages/Community";
import { Academy } from "./pages/Academy";
import { DiscoveryEngine } from "./pages/DiscoveryEngine";
import { AnalyticsDashboard } from "./pages/AnalyticsDashboard";
import { GeofencingSegmentation } from "./pages/GeofencingSegmentation";
import { CampaignOrchestration } from "./pages/CampaignOrchestration";

console.log('[App] Module loaded');

export default function App() {
  console.log('[App] Component rendering, path:', window.location.pathname);
  
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    console.log('[App] Component mounted');
    // Handle browser back/forward buttons
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    // Intercept all link clicks
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.href) {
        const url = new URL(link.href);
        
        // Only handle internal links
        if (url.origin === window.location.origin) {
          // Don't handle hash links (for homepage sections)
          if (link.hash && url.pathname === window.location.pathname) {
            return;
          }
          
          e.preventDefault();
          
          // Update URL and state
          window.history.pushState({}, '', url.pathname + url.hash);
          setCurrentPath(url.pathname);
          
          // Scroll to top for new pages, or to hash target
          if (url.hash) {
            setTimeout(() => {
              const element = document.querySelector(url.hash);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }, 0);
          } else {
            window.scrollTo(0, 0);
          }
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Route to different pages based on path
  const renderPage = () => {
    console.log('[App] Rendering page for path:', currentPath);
    switch (currentPath) {
      case '/privacy-policy':
        console.log('[App] Rendering PrivacyPolicy');
        return <PrivacyPolicy />;
      case '/terms-of-service':
        console.log('[App] Rendering TermsOfService');
        return <TermsOfService />;
      case '/security':
        console.log('[App] Rendering Security');
        return <Security />;
      case '/about':
        console.log('[App] Rendering About');
        return <About />;
      case '/contact':
        console.log('[App] Rendering Contact');
        return <Contact />;
      case '/integrations':
        console.log('[App] Rendering Integrations');
        return <Integrations />;
      case '/cookie-policy':
        console.log('[App] Rendering CookiePolicy');
        return <CookiePolicy />;
      case '/blog':
        console.log('[App] Rendering Blog');
        return <Blog />;
      case '/case-studies':
        console.log('[App] Rendering CaseStudies');
        return <CaseStudies />;
      case '/careers':
        console.log('[App] Rendering Careers');
        return <Careers />;
      case '/status':
        console.log('[App] Rendering Status');
        return <Status />;
      case '/documentation':
        console.log('[App] Rendering Documentation');
        return <Documentation />;
      case '/do-not-sell':
        console.log('[App] Rendering DoNotSell');
        return <DoNotSell />;
      case '/sign-in':
        console.log('[App] Rendering SignIn');
        return <SignIn />;
      case '/sign-up':
        console.log('[App] Rendering SignUp');
        return <SignUp />;
      case '/artists':
        console.log('[App] Rendering Artists');
        return <Artists />;
      case '/labels':
        console.log('[App] Rendering Labels');
        return <Labels />;
      case '/promoters':
        console.log('[App] Rendering Promoters');
        return <Promoters />;
      case '/community':
        console.log('[App] Rendering Community');
        return <Community />;
      case '/academy':
        console.log('[App] Rendering Academy');
        return <Academy />;
      case '/features/discovery-engine':
        console.log('[App] Rendering DiscoveryEngine');
        return <DiscoveryEngine />;
      case '/features/analytics-dashboard':
        console.log('[App] Rendering AnalyticsDashboard');
        return <AnalyticsDashboard />;
      case '/features/geofencing-segmentation':
        console.log('[App] Rendering GeofencingSegmentation');
        return <GeofencingSegmentation />;
      case '/features/campaign-orchestration':
        console.log('[App] Rendering CampaignOrchestration');
        return <CampaignOrchestration />;
      default:
        // Homepage
        console.log('[App] Rendering Homepage');
        return (
          <div className="min-h-screen bg-background">
            <Navigation />
            
            <main>
              <Hero />
              
              <div id="features">
                <Features />
              </div>
              
              <div id="how-it-works">
                <HowItWorks />
              </div>
              
              <UseCases />
              
              <Testimonials />
              
              <DataPrivacy />
              
              <div id="pricing">
                <Pricing />
              </div>
            </main>
            
            <Footer />
          </div>
        );
    }
  };

  console.log('[App] About to render ThemeProvider');
  return (
    <>
      <ThemeProvider>
        {renderPage()}
        <CookieConsent />
      </ThemeProvider>
    </>
  );
}