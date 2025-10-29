import { useState } from "react";
import { ThemeProvider } from "./components/theme-provider";
import { AppShell } from "./components/app-shell";
import { Dashboard } from "./components/dashboard";
import { AudienceDashboard } from "./components/audience-dashboard";
import { AudienceProfiles } from "./components/audience-profiles";
import { SegmentBuilder } from "./components/segment-builder";
import { Campaigns } from "./components/campaigns";
import { CampaignsEmail } from "./components/campaigns-email";
import { CampaignsSMS } from "./components/campaigns-sms";
import { CampaignsJourneys } from "./components/campaigns-journeys";
import { ContentArtists } from "./components/content-artists";
import { ContentReleases } from "./components/content-releases";
import { ContentEvents } from "./components/content-events";
import { ContentAssets } from "./components/content-assets";
import { Integrations } from "./components/integrations";
import { Analytics } from "./components/analytics";
import { Compliance } from "./components/compliance";
import { Settings } from "./components/settings";
import { GlassNeuroShowcase } from "./components/glass-neuro-showcase";

export default function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "audience":
        return <AudienceDashboard onPageChange={setCurrentPage} />;
      case "audience-profiles":
        return <AudienceProfiles onPageChange={setCurrentPage} />;
      case "audience-segments":
        return <SegmentBuilder onPageChange={setCurrentPage} />;
      case "campaigns":
        return <Campaigns />;
      case "campaigns-email":
      case "email":
        return <CampaignsEmail onPageChange={setCurrentPage} />;
      case "campaigns-sms":
      case "sms":
        return <CampaignsSMS onPageChange={setCurrentPage} />;
      case "campaigns-journeys":
      case "journeys":
        return <CampaignsJourneys onPageChange={setCurrentPage} />;
      case "content":
      case "content-artists":
        return <ContentArtists onPageChange={setCurrentPage} />;
      case "content-releases":
        return <ContentReleases onPageChange={setCurrentPage} />;
      case "content-events":
        return <ContentEvents onPageChange={setCurrentPage} />;
      case "content-assets":
        return <ContentAssets onPageChange={setCurrentPage} />;
      case "integrations":
        return <Integrations />;
      case "analytics":
        return <Analytics />;
      case "compliance":
        return <Compliance />;
      case "settings":
        return <Settings />;
      case "showcase":
        return <GlassNeuroShowcase />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider defaultTheme="dark">
      <AppShell currentPage={currentPage} onPageChange={setCurrentPage}>
        {renderCurrentPage()}
      </AppShell>
    </ThemeProvider>
  );
}