import { RefObject, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function scrollToHash(hash: string) {
  if (!hash) return
  const element = document.querySelector(hash)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

export function useMarketingNavigation(containerRef: RefObject<HTMLElement>) {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const anchor = target?.closest('a') as HTMLAnchorElement | null
      if (!anchor) return

      const href = anchor.getAttribute('href')
      if (!href) return
      if (href.startsWith('mailto:') || href.startsWith('tel:')) return
      if (anchor.target === '_blank' || anchor.hasAttribute('download')) return

      let url: URL
      try {
        url = href.startsWith('http') ? new URL(href) : new URL(href, window.location.origin)
      } catch (error) {
        return
      }

      if (url.origin !== window.location.origin) return

      const hash = url.hash
      const normalizedPath = url.pathname || '/'
      const samePath = normalizedPath === location.pathname

      event.preventDefault()

      if (samePath) {
        if (hash) {
          requestAnimationFrame(() => scrollToHash(hash))
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
        return
      }

      navigate(`${normalizedPath}${url.search}${hash}`)

      if (hash) {
        requestAnimationFrame(() => scrollToHash(hash))
      } else {
        window.scrollTo({ top: 0 })
      }
    }

    container.addEventListener('click', handleClick)
    return () => {
      container.removeEventListener('click', handleClick)
    }
  }, [containerRef, location.pathname, navigate])
}
