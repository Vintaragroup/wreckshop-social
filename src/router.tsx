import React from 'react'
import { createBrowserRouter, Outlet, RouterProvider, Navigate } from 'react-router-dom'
import { Dashboard } from './components/dashboard'
import ProfilesPage from './pages/audience/profiles'
import ProfileDetailPage from './pages/audience/profile-detail'
import ProfilesDiscoverPage from './pages/audience/profiles-discover'
import SpotifyCallbackPage from './pages/auth/spotify-callback'
import { InstagramCallbackHandler } from './components/instagram-callback'
import { TikTokCallbackHandler } from './components/tiktok-callback'
import { ThemeProvider } from './components/theme-provider'
import { AppShell } from './components/app-shell'
import { useLocation, useNavigate } from 'react-router-dom'
import { AudienceDashboard } from './components/audience-dashboard'
import { CampaignsEmail } from './components/campaigns-email'
import { CampaignsSMS } from './components/campaigns-sms'
import { CampaignsJourneys } from './components/campaigns-journeys'
import { ContentArtists } from './components/content-artists'
import { ContentReleases } from './components/content-releases'
import { ContentEvents } from './components/content-events'
import { ContentAssets } from './components/content-assets'
import { Integrations } from './components/integrations'
import { Analytics } from './components/analytics'
import { Compliance } from './components/compliance'
import { Settings } from './components/settings'
import { SegmentBuilder } from './components/segment-builder'
import { EmailTemplates } from './components/email-templates'
import AdminDiscoveryPage from './pages/admin/discovery'
import LoginPage from './pages/auth/login-stack'
import SignupPage from './pages/auth/signup-stack'
import OAuthCallbackPage from './pages/auth/oauth-callback'
import { useAuth } from './lib/auth/context'
import { marketingRoutes } from './marketing/routes'
import { APP_BASE_PATH, appPath, stripAppPath } from './lib/routes'

const AudienceContactsPage = React.lazy(() => import('./pages/audience/contacts'))
const CapturePage = React.lazy(() => import('./pages/capture'))
const PlatformAnalyticsPage = React.lazy(() => import('./pages/analytics/platforms'))
const InstagramPage = React.lazy(() => import('./pages/integrations/instagram'))
const SpotifyPage = React.lazy(() => import('./pages/integrations/spotify'))
const YouTubePage = React.lazy(() => import('./pages/integrations/youtube'))
const TikTokPage = React.lazy(() => import('./pages/integrations/tiktok'))
const AppleMusicPage = React.lazy(() => import('./pages/integrations/apple-music'))

/**
 * Protected Layout - only shown when authenticated
 */
function usePageMapping() {
  const location = useLocation()
  const navigate = useNavigate()

  const path = location.pathname
  const normalizedPath = stripAppPath(path)
  let currentPage = 'dashboard'
  if (normalizedPath === '/' || normalizedPath === '') currentPage = 'dashboard'
  else if (normalizedPath.startsWith('/audience/segments')) currentPage = 'audience-segments'
  else if (normalizedPath.startsWith('/audience/contacts')) currentPage = 'audience-contacts'
  else if (normalizedPath.startsWith('/audience/profiles')) currentPage = 'audience-profiles'
  else if (normalizedPath === '/audience') currentPage = 'audience'
  else if (normalizedPath.startsWith('/campaigns/email')) currentPage = 'campaigns-email'
  else if (normalizedPath.startsWith('/campaigns/sms')) currentPage = 'campaigns-sms'
  else if (normalizedPath.startsWith('/campaigns/journeys')) currentPage = 'campaigns-journeys'
  else if (normalizedPath.startsWith('/campaigns/templates')) currentPage = 'campaigns-templates'
  else if (normalizedPath === '/campaigns') currentPage = 'campaigns'
  else if (normalizedPath.startsWith('/content/artists')) currentPage = 'content-artists'
  else if (normalizedPath.startsWith('/content/releases')) currentPage = 'content-releases'
  else if (normalizedPath.startsWith('/content/events')) currentPage = 'content-events'
  else if (normalizedPath.startsWith('/content/assets')) currentPage = 'content-assets'
  else if (normalizedPath.startsWith('/integrations/instagram')) currentPage = 'integrations'
  else if (normalizedPath.startsWith('/integrations/spotify')) currentPage = 'integrations'
  else if (normalizedPath.startsWith('/integrations/youtube')) currentPage = 'integrations'
  else if (normalizedPath.startsWith('/integrations/tiktok')) currentPage = 'integrations'
  else if (normalizedPath.startsWith('/integrations/apple-music')) currentPage = 'integrations'
  else if (normalizedPath.startsWith('/integrations')) currentPage = 'integrations'
  else if (normalizedPath.startsWith('/analytics/platforms')) currentPage = 'analytics'
  else if (normalizedPath.startsWith('/analytics')) currentPage = 'analytics'
  else if (normalizedPath.startsWith('/compliance')) currentPage = 'compliance'
  else if (normalizedPath.startsWith('/settings')) currentPage = 'settings'
  else if (normalizedPath.startsWith('/admin/discovery')) currentPage = 'admin-discovery'

  const onPageChange = (page: string) => {
    const go = (target: string) => {
      navigate(appPath(target))
    }

    switch (page) {
      case 'dashboard':
        go('/')
        break
      case 'audience':
        go('/audience')
        break
      case 'audience-profiles':
        go('/audience/profiles')
        break
      case 'audience-segments':
        go('/audience/segments')
        break
      case 'audience-contacts':
        go('/audience/contacts')
        break
      case 'campaigns':
        go('/campaigns')
        break
      case 'campaigns-email':
        go('/campaigns/email')
        break
      case 'campaigns-sms':
        go('/campaigns/sms')
        break
      case 'campaigns-journeys':
        go('/campaigns/journeys')
        break
      case 'campaigns-templates':
        go('/campaigns/templates')
        break
      case 'content-artists':
        go('/content/artists')
        break
      case 'content-releases':
        go('/content/releases')
        break
      case 'content-events':
        go('/content/events')
        break
      case 'content-assets':
        go('/content/assets')
        break
      case 'integrations':
        go('/integrations')
        break
      case 'analytics':
        go('/analytics')
        break
      case 'compliance':
        go('/compliance')
        break
      case 'settings':
        go('/settings')
        break
      case 'admin-discovery':
        go('/admin/discovery')
        break
      default:
        go('/')
        break
    }
  }

  return { currentPage, onPageChange }
}

/**
 * Protected Layout - wraps authenticated pages with AppShell
 */
function Layout() {
  const { currentPage, onPageChange } = usePageMapping()
  const { user, loading } = useAuth()

  if (loading) {
    // Loading
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
          <p className="text-white mt-4">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <ThemeProvider defaultTheme="dark">
      <AppShell currentPage={currentPage} onPageChange={onPageChange}>
        <Outlet />
      </AppShell>
    </ThemeProvider>
  )
}

export const router = createBrowserRouter([
  ...marketingRoutes,
  // Auth Routes (public)
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
  // (Optional) Stack Auth hosted pages can be wired here when package is available
  
  // Capture page (public)
  {
    path: '/c/:slug',
    element: <React.Suspense fallback={<div style={{padding:16}}>Loading…</div>}><CapturePage /></React.Suspense>,
  },
  
  // OAuth Callbacks (public)
  {
    path: '/auth/spotify/callback',
    element: <SpotifyCallbackPage />,
  },
  {
    path: `${APP_BASE_PATH}/auth/spotify/callback`,
    element: <SpotifyCallbackPage />,
  },
  {
    path: '/auth/oauth/callback/:provider',
    element: <OAuthCallbackPage />,
  },
  {
    path: `${APP_BASE_PATH}/auth/oauth/callback/:provider`,
    element: <OAuthCallbackPage />,
  },
  {
    path: '/auth/instagram/callback',
    element: <InstagramCallbackHandler />,
  },
  {
    path: `${APP_BASE_PATH}/auth/instagram/callback`,
    element: <InstagramCallbackHandler />,
  },
  {
    path: '/auth/tiktok/callback',
    element: <TikTokCallbackHandler />,
  },
  {
    path: `${APP_BASE_PATH}/auth/tiktok/callback`,
    element: <TikTokCallbackHandler />,
  },
  
  // Protected Routes (require auth)
  {
    path: APP_BASE_PATH,
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'audience', element: <AudienceDashboard /> },
      { path: 'audience/contacts', element: <React.Suspense fallback={<div style={{padding:16}}>Loading…</div>}><AudienceContactsPage /></React.Suspense> },
      { path: 'audience/segments', element: <SegmentBuilder /> },
      { path: 'audience/profiles', element: <ProfilesPage /> },
      { path: 'audience/profiles/discover', element: <ProfilesDiscoverPage /> },
      { path: 'audience/profiles/:id', element: <ProfileDetailPage /> },
      { path: 'campaigns', element: <div style={{padding:16}}>Select a campaign channel from the sidebar.</div> },
      { path: 'campaigns/email', element: <CampaignsEmail /> },
      { path: 'campaigns/sms', element: <CampaignsSMS /> },
      { path: 'campaigns/journeys', element: <CampaignsJourneys /> },
      { path: 'campaigns/templates', element: <EmailTemplates /> },
      { path: 'content/artists', element: <ContentArtists /> },
      { path: 'content/releases', element: <ContentReleases /> },
      { path: 'content/events', element: <ContentEvents /> },
      { path: 'content/assets', element: <ContentAssets /> },
      { path: 'integrations', element: <Integrations /> },
      { path: 'integrations/instagram', element: <React.Suspense fallback={<div style={{padding:16}}>Loading…</div>}><InstagramPage /></React.Suspense> },
      { path: 'integrations/spotify', element: <React.Suspense fallback={<div style={{padding:16}}>Loading…</div>}><SpotifyPage /></React.Suspense> },
      { path: 'integrations/youtube', element: <React.Suspense fallback={<div style={{padding:16}}>Loading…</div>}><YouTubePage /></React.Suspense> },
      { path: 'integrations/tiktok', element: <React.Suspense fallback={<div style={{padding:16}}>Loading…</div>}><TikTokPage /></React.Suspense> },
      { path: 'integrations/apple-music', element: <React.Suspense fallback={<div style={{padding:16}}>Loading…</div>}><AppleMusicPage /></React.Suspense> },
      { path: 'analytics', element: <Analytics /> },
      { path: 'analytics/platforms', element: <React.Suspense fallback={<div style={{padding:16}}>Loading…</div>}><PlatformAnalyticsPage /></React.Suspense> },
      { path: 'compliance', element: <Compliance /> },
      { path: 'settings', element: <Settings /> },
      { path: 'admin/discovery', element: <AdminDiscoveryPage /> },
    ],
  },

  // Fallback - redirect to marketing homepage
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])

export function AppRouter() {
  return (
    <RouterProvider
      router={router}
      future={{
        v7_startTransition: true,
      }}
    />
  )
}
