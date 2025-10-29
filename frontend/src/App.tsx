import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { Button } from './components/ui/button'

const EnvSchema = z.object({
  VITE_API_BASE_URL: z.string().url(),
})

const env = EnvSchema.safeParse({
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
})

export default function App() {
  const { data } = useQuery({
    queryKey: ['ping'],
    queryFn: async () => {
      if (!env.success) return { ok: true, source: 'mock' }
      const res = await fetch(`${env.data.VITE_API_BASE_URL}/api/ping`)
      return res.json()
    },
  })

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center p-8">
      <div className="max-w-md w-full space-y-6">
        <h1 className="text-2xl font-bold">Wreckshop Frontend</h1>
        <p className="text-sm text-gray-600">TanStack Query + Zod + Tailwind + shadcn/ui baseline</p>
        <div className="space-x-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
        </div>
        <pre className="bg-white border rounded p-3 text-sm overflow-auto">{JSON.stringify(data ?? { ok: true }, null, 2)}</pre>
      </div>
    </div>
  )
}
