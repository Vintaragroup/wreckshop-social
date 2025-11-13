import React from 'react'
import { createBrowserRouter, Outlet, RouterProvider, Navigate } from 'react-router-dom'
import { Dashboard } from './components/dashboard'
import ProfilesPage from './pages/audience/profiles'
import ProfileDetailPage from './pages/audience/profile-detail'
import ProfilesDiscoverPage from './pages/audience/profiles-discover'
import SpotifyCallbackPage from './pages/auth/spotify-callback'
import { InstagramCallbackHandler } from './components/instagram-callback'
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
import { LoginPage } from './pages/auth/login-stack'
import { SignupPage } from './pages/auth/signup-stack'
import OAuthCallbackPage from './pages/auth/oauth-callback'
import { useAuth } from './lib/auth/context'

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
  let currentPage = 'dashboard'
  if (path === '/') currentPage = 'dashboard'
  else if (path.startsWith('/audience/segments')) currentPage = 'audience-segments'
  else if (path.startsWith('/audience/contacts')) currentPage = 'audience-contacts'
  else if (path.startsWith('/audience/profiles')) currentPage = 'audience-profiles'
  else if (path === '/audience') currentPage = 'audience'
  else if (path.startsWith('/campaigns/email')) currentPage = 'campaigns-email'
  else if (path.startsWith('/campaigns/sms')) currentPage = 'campaigns-sms'
  else if (path.startsWith('/campaigns/journeys')) currentPage = 'campaigns-journeys'
  else if (path.startsWith('/campaigns/templates')) currentPage = 'campaigns-templates'
  else if (path === '/campaigns') currentPage = 'campaigns'
  else if (path.startsWith('/content/artists')) currentPage = 'content-artists'
  else if (path.startsWith('/content/releases')) currentPage = 'content-releases'
  else if (path.startsWith('/content/events')) currentPage = 'content-events'
  else if (path.startsWith('/content/assets')) currentPage = 'content-assets'
  else if (path.startsWith('/integrations/instagram')) currentPage = 'integrations'
  else if (path.startsWith('/integrations/spotify')) currentPage = 'integrations'
  else if (path.startsWith('/integrations/youtube')) currentPage = 'integrations'
  else if (path.startsWith('/integrations/tiktok')) currentPage = 'integrations'
  else if (path.startsWith('/integrations/apple-music')) currentPage = 'integrations'
  else if (path.startsWith('/integrations')) currentPage = 'integrations'
  else if (path.startsWith('/analytics/platforms')) currentPage = 'analytics'
  else if (path.startsWith('/analytics')) currentPage = 'analytics'
  else if (path.startsWith('/compliance')) currentPage = 'compliance'
  else if (path.startsWith('/settings')) currentPage = 'settings'
  else if (path.startsWith('/admin/discovery')) currentPage = 'admin-discovery'

  const onPageChange = (page: string) => {
    switch (page) {
      case 'dashboard':
        navigate('/')
        break
      case 'audience':
        navigate('/audience')
        break
      case 'audience-profiles':
        navigate('/audience/profiles')
        break
      case 'audience-segments':
        navigate('/audience/segments')
        break
      case 'audience-contacts':
        navigate('/audience/contacts')
        break
      case 'campaigns':
        navigate('/campaigns')
        break
      case 'campaigns-email':
        navigate('/campaigns/email')
        break
      case 'campaigns-sms':
        navigate('/campaigns/sms')
        break
      case 'campaigns-journeys':
        navigate('/campaigns/journeys')
        break
      case 'campaigns-templates':
        navigate('/campaigns/templates')
        break
      case 'content-artists':
        navigate('/content/artists')
        break
      case 'content-releases':
        navigate('/content/releases')
        break
      case 'content-events':
        navigate('/content/events')
        break
      case 'content-assets':
        navigate('/content/assets')
        break
      case 'integrations':
        navigate('/integrations')
        break
      case 'analytics':
        navigate('/analytics')
        break
      case 'compliance':
        navigate('/compliance')
        break
      case 'settings':
        navigate('/settings')
        break
      case 'admin-discovery':
        navigate('/admin/discovery')
        break
      default:
        navigate('/')
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
    path: '/auth/oauth/callback/:provider',
    element: <OAuthCallbackPage />,
  },
  {
    path: '/auth/instagram/callback',
    element: <InstagramCallbackHandler />,
  },
  
  // Protected Routes (require auth)
  {
    path: '/',
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

  // Fallback - redirect to login
  {
    path: '*',
    element: <Navigate to="/login" replace />,
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
