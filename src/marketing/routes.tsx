import React from 'react'
import { type RouteObject } from 'react-router-dom'
import { MarketingShell } from './marketing-shell'
import { MarketingHomePage } from './marketing-home-page'

// Lazy-load marketing pages; import with React.lazy wrapper for code splitting
const PrivacyPolicyPage = React.lazy(() => import('./pages/index').then(m => ({ default: m.PrivacyPolicy })))
const TermsPage = React.lazy(() => import('./pages/index').then(m => ({ default: m.TermsOfService })))
const SecurityPage = React.lazy(() => import('./pages/index').then(m => ({ default: m.Security })))
const AboutPage = React.lazy(() => import('./pages/index').then(m => ({ default: m.About })))
const ContactPage = React.lazy(() => import('./pages/index').then(m => ({ default: m.Contact })))
const IntegrationsPage = React.lazy(() => import('./pages/index').then(m => ({ default: m.Integrations })))
const CookiePolicyPage = React.lazy(() => import('./pages/index').then(m => ({ default: m.CookiePolicy })))
const BlogPage = React.lazy(() => import('./pages/index').then(m => ({ default: m.Blog })))
const CaseStudiesPage = React.lazy(() => import('./pages/index').then(m => ({ default: m.CaseStudies })))
const CareersPage = React.lazy(() => import('./pages/index').then(m => ({ default: m.Careers })))
const StatusPage = React.lazy(() => import('./pages/index').then(m => ({ default: m.Status })))
const DocumentationPage = React.lazy(() => import('./pages/index').then(m => ({ default: m.Documentation })))
const DoNotSellPage = React.lazy(() => import('./pages/index').then(m => ({ default: m.DoNotSell })))
const SignInPage = React.lazy(() => import('./pages/index').then(m => ({ default: m.SignIn })))
const SignUpPage = React.lazy(() => import('./pages/index').then(m => ({ default: m.SignUp })))
const ArtistsPage = React.lazy(() => import('./pages/index').then(m => ({ default: m.Artists })))
const LabelsPage = React.lazy(() => import('./pages/index').then(m => ({ default: m.Labels })))
const PromotersPage = React.lazy(() => import('./pages/index').then(m => ({ default: m.Promoters })))
const CommunityPage = React.lazy(() => import('./pages/index').then(m => ({ default: m.Community })))
const AcademyPage = React.lazy(() => import('./pages/index').then(m => ({ default: m.Academy })))
const DiscoveryEnginePage = React.lazy(() => import('./pages/index').then(m => ({ default: m.DiscoveryEngine })))
const AnalyticsDashboardPage = React.lazy(() => import('./pages/index').then(m => ({ default: m.AnalyticsDashboard })))
const GeofencingSegmentationPage = React.lazy(() => import('./pages/index').then(m => ({ default: m.GeofencingSegmentation })))
const CampaignOrchestrationPage = React.lazy(() => import('./pages/index').then(m => ({ default: m.CampaignOrchestration })))

const SuspenseFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
    <p className="text-muted-foreground">Loading page…</p>
  </div>
)

const withSuspense = (Component: React.LazyExoticComponent<React.ComponentType>) => (
  <React.Suspense fallback={<SuspenseFallback />}>
    <Component />
  </React.Suspense>
)

export const marketingRoutes: RouteObject[] = [
  {
    element: <MarketingShell />,
    children: [
      { path: '/', element: <MarketingHomePage /> },
      { path: '/privacy-policy', element: withSuspense(PrivacyPolicyPage) },
      { path: '/terms-of-service', element: withSuspense(TermsPage) },
      { path: '/security', element: withSuspense(SecurityPage) },
      { path: '/about', element: withSuspense(AboutPage) },
      { path: '/contact', element: withSuspense(ContactPage) },
      { path: '/integrations', element: withSuspense(IntegrationsPage) },
      { path: '/cookie-policy', element: withSuspense(CookiePolicyPage) },
      { path: '/blog', element: withSuspense(BlogPage) },
      { path: '/case-studies', element: withSuspense(CaseStudiesPage) },
      { path: '/careers', element: withSuspense(CareersPage) },
      { path: '/status', element: withSuspense(StatusPage) },
      { path: '/documentation', element: withSuspense(DocumentationPage) },
      { path: '/do-not-sell', element: withSuspense(DoNotSellPage) },
      { path: '/sign-in', element: withSuspense(SignInPage) },
      { path: '/sign-up', element: withSuspense(SignUpPage) },
      { path: '/artists', element: withSuspense(ArtistsPage) },
      { path: '/labels', element: withSuspense(LabelsPage) },
      { path: '/promoters', element: withSuspense(PromotersPage) },
      { path: '/community', element: withSuspense(CommunityPage) },
      { path: '/academy', element: withSuspense(AcademyPage) },
      { path: '/features/discovery-engine', element: withSuspense(DiscoveryEnginePage) },
      { path: '/features/analytics-dashboard', element: withSuspense(AnalyticsDashboardPage) },
      { path: '/features/geofencing-segmentation', element: withSuspense(GeofencingSegmentationPage) },
      { path: '/features/campaign-orchestration', element: withSuspense(CampaignOrchestrationPage) },
    ],
  },
]
