import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
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

describe('ProfilesPage', () => {
  it('renders mock profile from MSW', async () => {
    renderWithProviders(<ProfilesPage />)
    await waitFor(() => expect(screen.getByText('Mock Listener')).toBeInTheDocument())
  })
})
