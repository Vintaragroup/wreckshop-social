import React from 'react'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import { Dashboard } from './components/dashboard'
import { AudienceProfiles } from './components/audience-profiles'
import { ThemeProvider } from './components/theme-provider'
import { AppShell } from './components/app-shell'
import { useLocation, useNavigate } from 'react-router-dom'

function usePageMapping() {
  const location = useLocation()
  const navigate = useNavigate()

  const path = location.pathname
  let currentPage = 'dashboard'
  if (path.startsWith('/audience/profiles')) currentPage = 'audience-profiles'

  const onPageChange = (page: string) => {
    switch (page) {
      case 'dashboard':
        navigate('/')
        break
      case 'audience-profiles':
        navigate('/audience/profiles')
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
      { path: 'audience/profiles', element: <AudienceProfiles onPageChange={() => {}} /> },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
