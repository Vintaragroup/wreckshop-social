import { useState, useEffect } from "react"
import { Plus, Sparkles, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Checkbox } from "./ui/checkbox"
import { Alert, AlertDescription } from "./ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { apiUrl } from "../lib/api"

interface SegmentSuggestion {
  name: string
  description: string
  filters: {
    genres?: string[]
    artistTypes?: string[]
    minScore?: number
  }
  note?: string
}

interface CreateSegmentRequest {
  name: string
  filters: {
    genres?: string[]
    artistTypes?: string[]
    minScore?: number
  }
}

export function DiscoveredUserSegmentBuilder() {
  const [suggestions, setSuggestions] = useState<SegmentSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Form state for custom segment
  const [customName, setCustomName] = useState("")
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [selectedArtistTypes, setSelectedArtistTypes] = useState<string[]>([])
  const [minScore, setMinScore] = useState(0)

  const GENRES = [
    "indie",
    "hip-hop",
    "pop",
    "electronic",
    "rock",
    "r&b",
    "country",
    "jazz",
    "metal",
    "latino",
  ]
  const ARTIST_TYPES = ["mainstream", "underground", "indie", "emerging"]

  // Load suggestions on mount
  useEffect(() => {
    fetchSuggestions()
  }, [])

  const fetchSuggestions = async () => {
    try {
      const response = await fetch(apiUrl("/spotify/discover/segment-suggestions"))
      if (!response.ok) {
        const text = await response.text()
        throw new Error(`HTTP ${response.status}: ${text || 'Failed to fetch suggestions'}`)
      }
      const json = (await response.json()) as { ok: boolean; data?: SegmentSuggestion[] }
      if (json.ok && json.data) {
        setSuggestions(json.data)
      }
    } catch (err) {
      console.error("Failed to fetch suggestions:", err)
    }
  }

  const createSegment = async (
    name: string,
    filters: CreateSegmentRequest["filters"]
  ) => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch(apiUrl("/spotify/discover/create-segment"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, filters }),
      })

      const json = (await response.json()) as {
        ok: boolean
        data?: { userCount: number }
        message?: string
        error?: string
      }

      if (json.ok) {
        setSuccess(`Created segment "${name}" with ${json.data?.userCount || 0} users`)
        resetForm()
        setDialogOpen(false)
      } else {
        setError(json.error || "Failed to create segment")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create segment")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setCustomName("")
    setSelectedGenres([])
    setSelectedArtistTypes([])
    setMinScore(0)
  }

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    )
  }

  const toggleArtistType = (type: string) => {
    setSelectedArtistTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }

  const handleCreateCustom = () => {
    if (!customName.trim()) {
      setError("Segment name is required")
      return
    }

    const filters: CreateSegmentRequest["filters"] = {}
    if (selectedGenres.length > 0) filters.genres = selectedGenres
    if (selectedArtistTypes.length > 0) filters.artistTypes = selectedArtistTypes
    if (minScore > 0) filters.minScore = minScore

    createSegment(customName, filters)
  }

  const handleCreateFromSuggestion = (suggestion: SegmentSuggestion) => {
    createSegment(suggestion.name, suggestion.filters)
  }

  return (
    <div className="space-y-6">
      {/* Success Alert */}
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-6 h-6 text-accent" />
          <h2 className="text-2xl font-bold">Create Audience Segments</h2>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Custom Segment
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Custom Segment</DialogTitle>
              <DialogDescription>
                Filter discovered users by genre, artist type, and match score
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Segment Name */}
              <div className="space-y-2">
                <Label htmlFor="segment-name">Segment Name</Label>
                <Input
                  id="segment-name"
                  placeholder="e.g., Emerging Indie Fans"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                />
              </div>

              {/* Genre Selection */}
              <div className="space-y-3">
                <Label>Genres (Optional)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {GENRES.map((genre) => (
                    <div key={genre} className="flex items-center space-x-2">
                      <Checkbox
                        id={`genre-${genre}`}
                        checked={selectedGenres.includes(genre)}
                        onCheckedChange={() => toggleGenre(genre)}
                      />
                      <label
                        htmlFor={`genre-${genre}`}
                        className="text-sm font-medium cursor-pointer"
                      >
                        {genre.charAt(0).toUpperCase() + genre.slice(1)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Artist Type Selection */}
              <div className="space-y-3">
                <Label>Artist Types (Optional)</Label>
                <div className="grid grid-cols-2 gap-3">
                  {ARTIST_TYPES.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${type}`}
                        checked={selectedArtistTypes.includes(type)}
                        onCheckedChange={() => toggleArtistType(type)}
                      />
                      <label
                        htmlFor={`type-${type}`}
                        className="text-sm font-medium cursor-pointer"
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Match Score Filter */}
              <div className="space-y-2">
                <Label htmlFor="min-score">Minimum Match Score: {minScore}%</Label>
                <input
                  id="min-score"
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={minScore}
                  onChange={(e) => setMinScore(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCustom} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Segment
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Suggestions */}
      <div>
        <h3 className="font-semibold mb-4">Suggested Segments</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suggestions.map((suggestion, idx) => (
            <Card key={idx} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 space-y-3">
                <div>
                  <h4 className="font-medium">{suggestion.name}</h4>
                  <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                  {suggestion.note && (
                    <p className="text-xs text-muted-foreground italic mt-1">{suggestion.note}</p>
                  )}
                </div>

                {/* Filters Info */}
                <div className="flex flex-wrap gap-1">
                  {suggestion.filters.genres?.map((g) => (
                    <Badge key={g} variant="secondary" className="text-xs">
                      {g}
                    </Badge>
                  ))}
                  {suggestion.filters.artistTypes?.map((t) => (
                    <Badge key={t} variant="outline" className="text-xs">
                      {t}
                    </Badge>
                  ))}
                  {suggestion.filters.minScore && (
                    <Badge variant="outline" className="text-xs">
                      Score: {suggestion.filters.minScore}%+
                    </Badge>
                  )}
                </div>

                <Button
                  className="w-full"
                  size="sm"
                  onClick={() => handleCreateFromSuggestion(suggestion)}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-3 h-3 mr-1" />
                      Create
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <Card className="bg-accent/5 border-accent/20">
        <CardContent className="p-4">
          <p className="text-sm">
            <strong>💡 Tip:</strong> Segments allow you to organize discovered users for targeted
            campaigns. Create segments by music taste, artist type, or engagement level, then use
            them for email, SMS, or social campaigns.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
