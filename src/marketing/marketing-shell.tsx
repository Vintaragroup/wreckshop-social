import { useRef, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { ThemeProvider, CookieConsent } from '@marketing-core'
import { useMarketingNavigation } from './use-marketing-navigation'

export function MarketingShell() {
  const containerRef = useRef<HTMLDivElement>(null)
  useMarketingNavigation(containerRef)
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      requestAnimationFrame(() => {
        const element = document.querySelector(location.hash)
        element?.scrollIntoView({ behavior: 'smooth' })
      })
    } else {
      window.scrollTo({ top: 0 })
    }
  }, [location.pathname, location.hash])

  return (
    <ThemeProvider defaultTheme="dark" storageKey="wreckshop-marketing-theme">
      <div ref={containerRef} className="min-h-screen bg-background text-foreground">
        <Outlet />
        <CookieConsent />
      </div>
    </ThemeProvider>
  )
}
