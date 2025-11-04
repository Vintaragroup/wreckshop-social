import React from 'react'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import { Dashboard } from './components/dashboard'
import ProfilesPage from './pages/audience/profiles'
import ProfileDetailPage from './pages/audience/profile-detail'
import ProfilesDiscoverPage from './pages/audience/profiles-discover'
import SpotifyCallbackPage from './pages/auth/spotify-callback'
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

function usePageMapping() {
  const location = useLocation()
  const navigate = useNavigate()

  const path = location.pathname
  let currentPage = 'dashboard'
  if (path === '/') currentPage = 'dashboard'
  else if (path.startsWith('/audience/segments')) currentPage = 'audience-segments'
  else if (path.startsWith('/audience/profiles')) currentPage = 'audience-profiles'
  else if (path === '/audience') currentPage = 'audience'
  else if (path.startsWith('/campaigns/email')) currentPage = 'campaigns-email'
  else if (path.startsWith('/campaigns/sms')) currentPage = 'campaigns-sms'
  else if (path.startsWith('/campaigns/journeys')) currentPage = 'campaigns-journeys'
  else if (path === '/campaigns') currentPage = 'campaigns'
  else if (path.startsWith('/content/artists')) currentPage = 'content-artists'
  else if (path.startsWith('/content/releases')) currentPage = 'content-releases'
  else if (path.startsWith('/content/events')) currentPage = 'content-events'
  else if (path.startsWith('/content/assets')) currentPage = 'content-assets'
  else if (path.startsWith('/integrations')) currentPage = 'integrations'
  else if (path.startsWith('/analytics')) currentPage = 'analytics'
  else if (path.startsWith('/compliance')) currentPage = 'compliance'
  else if (path.startsWith('/settings')) currentPage = 'settings'

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
      default:
        navigate('/')
        break
    }
  }

  return { currentPage, onPageChange }
}

function Layout() {
  const { currentPage, onPageChange } = usePageMapping()
  return (
    <ThemeProvider defaultTheme="dark">
      <AppShell currentPage={currentPage} onPageChange={onPageChange}>
        <Outlet />
      </AppShell>
    </ThemeProvider>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
  { index: true, element: <Dashboard /> },
  { path: 'audience', element: <AudienceDashboard /> },
  { path: 'audience/segments', element: <SegmentBuilder /> },
  { path: 'audience/profiles', element: <ProfilesPage /> },
  { path: 'audience/profiles/discover', element: <ProfilesDiscoverPage /> },
  { path: 'audience/profiles/:id', element: <ProfileDetailPage /> },
  { path: 'campaigns', element: <div style={{padding:16}}>Select a campaign channel from the sidebar.</div> },
  { path: 'campaigns/email', element: <CampaignsEmail /> },
  { path: 'campaigns/sms', element: <CampaignsSMS /> },
  { path: 'campaigns/journeys', element: <CampaignsJourneys /> },
  { path: 'content/artists', element: <ContentArtists /> },
  { path: 'content/releases', element: <ContentReleases /> },
  { path: 'content/events', element: <ContentEvents /> },
  { path: 'content/assets', element: <ContentAssets /> },
  { path: 'integrations', element: <Integrations /> },
  { path: 'analytics', element: <Analytics /> },
  { path: 'compliance', element: <Compliance /> },
  { path: 'settings', element: <Settings /> },
    ],
  },
  {
    path: '/auth/spotify/callback',
    element: <SpotifyCallbackPage />,
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
