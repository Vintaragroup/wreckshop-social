import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-draw/dist/leaflet.draw.css"
import "../styles/geofence-map.css"
import { Search, MapPin, Trash2, Plus, RotateCcw } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Alert, AlertDescription } from "./ui/alert"

interface GeofenceCircle {
  id: string
  lat: number
  lng: number
  radius: number // in meters
  label?: string
}

interface GeofenceMapProps {
  onCirclesChange?: (circles: GeofenceCircle[]) => void
  initialCircles?: GeofenceCircle[]
  height?: string
}

export function GeofenceMap({ onCirclesChange, initialCircles = [], height = "500px" }: GeofenceMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const [circles, setCircles] = useState<GeofenceCircle[]>(initialCircles)
  const [searchQuery, setSearchQuery] = useState("")
  const [searching, setSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [selectedRadius, setSelectedRadius] = useState(5) // miles default
  const [error, setError] = useState<string | null>(null)
  const drawnCirclesRef = useRef<Map<string, L.Circle>>(new Map())

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return

    // Create map centered on USA (Houston by default for music industry)
    map.current = L.map(mapContainer.current).setView([29.7604, -95.3698], 13)

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map.current)

    // Custom marker icon fix (Leaflet issue with default icons)
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    })

    // Draw initial circles
    initialCircles.forEach((circle) => {
      drawCircle(circle)
    })

    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [])

  // Draw a circle on the map
  const drawCircle = (circleData: GeofenceCircle) => {
    if (!map.current) return

    // Remove existing circle if updating
    if (drawnCirclesRef.current.has(circleData.id)) {
      drawnCirclesRef.current.get(circleData.id)?.remove()
    }

    // Create circle marker
    const circle = L.circle([circleData.lat, circleData.lng], {
      radius: circleData.radius,
      color: "#FF6B6B",
      fill: true,
      fillColor: "#FF6B6B",
      fillOpacity: 0.15,
      weight: 2,
      dashArray: "5, 5",
    }).addTo(map.current)

    // Add label popup
    const radiusMiles = (circleData.radius / 1609.34).toFixed(1)
    const popup = L.popup()
      .setLatLng([circleData.lat, circleData.lng])
      .setContent(`
        <div class="p-2 font-sm">
          <strong>${circleData.label || "Geofence"}</strong><br/>
          ${radiusMiles} miles
        </div>
      `)

    circle.bindPopup(popup)
    circle.on("click", () => circle.openPopup())

    drawnCirclesRef.current.set(circleData.id, circle)
  }

  // Search for location using Nominatim (OpenStreetMap)
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setSearching(true)
    setError(null)

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`,
        { headers: { "Accept-Language": "en" } }
      )

      if (!response.ok) throw new Error("Search failed")
      const results = await response.json()

      if (results.length === 0) {
        setError("No locations found. Try another search.")
        setSearchResults([])
      } else {
        setSearchResults(results)
      }
    } catch (err) {
      setError("Failed to search locations. Please try again.")
      console.error(err)
    } finally {
      setSearching(false)
    }
  }

  // Select a search result and add geofence
  const handleSelectLocation = (result: any) => {
    const lat = parseFloat(result.lat)
    const lng = parseFloat(result.lon)
    const radiusMeters = selectedRadius * 1609.34 // Convert miles to meters

    const newCircle: GeofenceCircle = {
      id: `circle-${Date.now()}`,
      lat,
      lng,
      radius: radiusMeters,
      label: result.display_name.split(",")[0],
    }

    const updatedCircles = [...circles, newCircle]
    setCircles(updatedCircles)
    onCirclesChange?.(updatedCircles)

    // Center map on new circle
    if (map.current) {
      map.current.setView([lat, lng], 13)
    }

    drawCircle(newCircle)
    setSearchQuery("")
    setSearchResults([])
  }

  // Remove a geofence
  const handleRemoveCircle = (id: string) => {
    drawnCirclesRef.current.get(id)?.remove()
    drawnCirclesRef.current.delete(id)

    const updatedCircles = circles.filter((c) => c.id !== id)
    setCircles(updatedCircles)
    onCirclesChange?.(updatedCircles)
  }

  // Update circle radius
  const handleUpdateRadius = (id: string, newRadiusMiles: number) => {
    const updatedCircles = circles.map((c) =>
      c.id === id ? { ...c, radius: newRadiusMiles * 1609.34 } : c
    )
    setCircles(updatedCircles)
    onCirclesChange?.(updatedCircles)

    // Redraw circle
    const circle = updatedCircles.find((c) => c.id === id)
    if (circle) {
      drawCircle(circle)
    }
  }

  // Clear all geofences
  const handleClearAll = () => {
    drawnCirclesRef.current.forEach((circle) => circle.remove())
    drawnCirclesRef.current.clear()
    setCircles([])
    onCirclesChange?.([])
  }

  return (
    <div className="space-y-4">
      {/* Search Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Search Location
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSearch} className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Search Address, Zip, or Venue</label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., 77002 (Houston), or 123 Main St..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={searching}
                />
                <Button type="submit" size="sm" disabled={searching || !searchQuery.trim()}>
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Radius selector */}
            <div>
              <label className="text-xs font-medium text-muted-foreground">Radius (miles)</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0.1"
                  max="100"
                  step="0.5"
                  value={selectedRadius}
                  onChange={(e) => setSelectedRadius(parseFloat(e.target.value))}
                  className="w-20"
                />
                <span className="text-xs text-muted-foreground">{selectedRadius.toFixed(1)} miles</span>
              </div>
            </div>
          </form>

          {/* Search results */}
          {searchResults.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Results</label>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {searchResults.map((result, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectLocation(result)}
                    className="w-full text-left p-2 rounded hover:bg-muted text-sm transition-colors"
                  >
                    <div className="font-medium">{result.display_name.split(",")[0]}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">{result.display_name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Map Container */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Geofence Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div ref={mapContainer} style={{ height, borderRadius: "8px", overflow: "hidden" }} />
        </CardContent>
      </Card>

      {/* Active Geofences */}
      {circles.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Active Geofences ({circles.length})</CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={handleClearAll}
                className="h-7 text-xs gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {circles.map((circle) => {
              const radiusMiles = circle.radius / 1609.34
              return (
                <div
                  key={circle.id}
                  className="flex items-center justify-between p-2 bg-muted rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium text-sm">{circle.label || "Unnamed"}</div>
                    <div className="text-xs text-muted-foreground">
                      {circle.lat.toFixed(4)}, {circle.lng.toFixed(4)} • {radiusMiles.toFixed(1)} miles
                    </div>
                  </div>

                  {/* Radius adjuster */}
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="0.1"
                      max="100"
                      step="0.5"
                      value={radiusMiles.toFixed(1)}
                      onChange={(e) => handleUpdateRadius(circle.id, parseFloat(e.target.value))}
                      className="w-16 h-8 text-xs"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveCircle(circle.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      {circles.length === 0 && (
        <Alert>
          <AlertDescription>
            Search for a location to create your first geofence. You can add multiple geofences by repeating the search.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
