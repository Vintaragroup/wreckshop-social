import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import ProfilesPage from '../pages/audience/profiles'
import { AuthProvider } from '../lib/auth/context'

function renderWithProviders(ui: React.ReactElement) {
  const client = new QueryClient()
  return render(
    <MemoryRouter>
      <AuthProvider>
        <QueryClientProvider client={client}>{ui}</QueryClientProvider>
      </AuthProvider>
    </MemoryRouter>
  )
}

const getTrigger = () => screen.getAllByRole('combobox')[0]

describe('ProfilesPage provider feature flags', () => {
  const originalEnv = { ...(import.meta as any).env }

  beforeEach(() => {
    // Radix Select uses scrollIntoView, which isn't implemented in JSDOM
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    ;(Element.prototype as any).scrollIntoView = () => {}
  })

  afterEach(() => {
    ;(import.meta as any).env = { ...originalEnv }
  })

  it('does not show Last.fm, SoundCloud, Deezer, YouTube, or Audius when flags disabled', async () => {
    ;(import.meta as any).env = {
      ...originalEnv,
      VITE_ENABLE_LASTFM: 'false',
      VITE_ENABLE_SOUNDCLOUD: 'false',
      VITE_ENABLE_DEEZER: 'false',
      VITE_ENABLE_YOUTUBE: 'false',
      VITE_ENABLE_AUDIUS: 'false',
    }

    renderWithProviders(<ProfilesPage />)

    fireEvent.click(getTrigger())

    await waitFor(() => {
      // Assert hidden only in the provider Select options, not globally in the page
      expect(screen.queryByRole('option', { name: 'Last.fm' })).not.toBeInTheDocument()
      expect(screen.queryByRole('option', { name: 'SoundCloud' })).not.toBeInTheDocument()
      expect(screen.queryByRole('option', { name: 'Deezer' })).not.toBeInTheDocument()
      expect(screen.queryByRole('option', { name: 'YouTube' })).not.toBeInTheDocument()
      expect(screen.queryByRole('option', { name: 'Audius' })).not.toBeInTheDocument()
    })
  })
})
