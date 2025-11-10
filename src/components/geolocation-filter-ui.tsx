import { useState, useEffect } from "react"
import { Plus, Minus, MapPin, Search, Loader2 } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Checkbox } from "./ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { apiUrl } from "../lib/api"
import { GeofenceMap } from "./geofence-map"

interface GeolocationFilters {
  countries?: string[]
  states?: string[]
  cities?: string[]
  timezone?: string[]
  geoRadius?: {
    centerLat: number
    centerLng: number
    radiusKm: number
  }
  geofences?: Array<{
    id: string
    lat: number
    lng: number
    radius: number
    label?: string
  }>
}

interface GeolocationUIProps {
  filters: GeolocationFilters
  onChange: (filters: GeolocationFilters) => void
}

interface CountryData {
  code: string
  name: string
}

interface StateData {
  code: string
  name: string
}

interface CityData {
  name: string
  count: number
}

interface TimezoneData {
  id: string
  label: string
  offset: string
}

export function GeolocationFilterUI({ filters, onChange }: GeolocationUIProps) {
  const [countries, setCountries] = useState<CountryData[]>([])
  const [states, setStates] = useState<StateData[]>([])
  const [cities, setCities] = useState<CityData[]>([])
  const [timezones, setTimezones] = useState<TimezoneData[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<string>("")
  const [selectedState, setSelectedState] = useState<string>("")
  const [radiusInput, setRadiusInput] = useState<string>("")
  const [centerLat, setCenterLat] = useState<string>("")
  const [centerLng, setCenterLng] = useState<string>("")

  // Load initial data
  useEffect(() => {
    loadCountries()
    loadTimezones()
  }, [])

  // Load states when country changes
  useEffect(() => {
    if (selectedCountry) {
      loadStates(selectedCountry)
    } else {
      setStates([])
    }
  }, [selectedCountry])

  // Load cities when state changes
  useEffect(() => {
    if (selectedCountry && selectedState) {
      loadCities(selectedCountry, selectedState)
    } else {
      setCities([])
    }
  }, [selectedCountry, selectedState])

  const loadCountries = async () => {
    try {
      const response = await fetch(apiUrl("/spotify/discover/geo/countries"))
      if (response.ok) {
        const json = (await response.json()) as { ok: boolean; data?: CountryData[] }
        if (json.ok && json.data) {
          setCountries(json.data)
        }
      }
    } catch (err) {
      console.error("Failed to load countries:", err)
    }
  }

  const loadStates = async (countryCode: string) => {
    try {
      const response = await fetch(apiUrl(`/spotify/discover/geo/states?country=${countryCode}`))
      if (response.ok) {
        const json = (await response.json()) as { ok: boolean; data?: StateData[] }
        if (json.ok && json.data) {
          setStates(json.data)
        }
      }
    } catch (err) {
      console.error("Failed to load states:", err)
    }
  }

  const loadCities = async (countryCode: string, stateCode: string) => {
    try {
      const response = await fetch(
        apiUrl(`/spotify/discover/geo/cities?country=${countryCode}&state=${stateCode}`)
      )
      if (response.ok) {
        const json = (await response.json()) as { ok: boolean; data?: CityData[] }
        if (json.ok && json.data) {
          setCities(json.data)
        }
      }
    } catch (err) {
      console.error("Failed to load cities:", err)
    }
  }

  const loadTimezones = async () => {
    try {
      const response = await fetch(apiUrl("/spotify/discover/geo/timezones"))
      if (response.ok) {
        const json = (await response.json()) as { ok: boolean; data?: TimezoneData[] }
        if (json.ok && json.data) {
          setTimezones(json.data)
        }
      }
    } catch (err) {
      console.error("Failed to load timezones:", err)
    }
  }

  const toggleCountry = (code: string) => {
    const current = filters.countries || []
    const updated = current.includes(code) ? current.filter(c => c !== code) : [...current, code]
    onChange({ ...filters, countries: updated })
  }

  const toggleState = (code: string) => {
    const current = filters.states || []
    const updated = current.includes(code) ? current.filter(c => c !== code) : [...current, code]
    onChange({ ...filters, states: updated })
  }

  const toggleCity = (name: string) => {
    const current = filters.cities || []
    const updated = current.includes(name) ? current.filter(c => c !== name) : [...current, name]
    onChange({ ...filters, cities: updated })
  }

  const toggleTimezone = (id: string) => {
    const current = filters.timezone || []
    const updated = current.includes(id) ? current.filter(t => t !== id) : [...current, id]
    onChange({ ...filters, timezone: updated })
  }

  const setGeoRadius = () => {
    if (centerLat && centerLng && radiusInput) {
      onChange({
        ...filters,
        geoRadius: {
          centerLat: parseFloat(centerLat),
          centerLng: parseFloat(centerLng),
          radiusKm: parseFloat(radiusInput),
        },
      })
    }
  }

  const clearGeoRadius = () => {
    onChange({ ...filters, geoRadius: undefined })
    setCenterLat("")
    setCenterLng("")
    setRadiusInput("")
  }

  const handleGeofencesChange = (geofences: any[]) => {
    // Convert geofence circles to our format
    const formattedGeofences = geofences.map((g) => ({
      id: g.id,
      lat: g.lat,
      lng: g.lng,
      radius: g.radius,
      label: g.label,
    }))
    onChange({ ...filters, geofences: formattedGeofences })
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="map" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="map" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Map View
          </TabsTrigger>
          <TabsTrigger value="filters">Advanced Filters</TabsTrigger>
        </TabsList>

        {/* Map Tab */}
        <TabsContent value="map" className="space-y-4">
          <GeofenceMap
            onCirclesChange={handleGeofencesChange}
            initialCircles={filters.geofences || []}
            height="600px"
          />
          {filters.geofences && filters.geofences.length > 0 && (
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-3">
                <p className="text-sm font-medium">Active Geofences: {filters.geofences.length}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {filters.geofences.map((g) => (
                    <Badge key={g.id} variant="secondary" className="text-xs">
                      {g.label || `${(g.radius / 1609.34).toFixed(1)}mi`}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Advanced Filters Tab */}
        <TabsContent value="filters" className="space-y-6">
      {/* Countries */}
      <div className="space-y-3">
        <Label>Countries</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {countries.map(country => (
            <div key={country.code} className="flex items-center space-x-2">
              <Checkbox
                id={`country-${country.code}`}
                checked={filters.countries?.includes(country.code) || false}
                onCheckedChange={() => toggleCountry(country.code)}
              />
              <label htmlFor={`country-${country.code}`} className="text-sm cursor-pointer">
                {country.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* States (show only if countries selected) */}
      {countries.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label>Filter by Country First</Label>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select country..." />
              </SelectTrigger>
              <SelectContent>
                {countries.map(country => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {states.length > 0 && (
            <div className="space-y-2">
              <Label>States/Regions</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {states.map(state => (
                  <div key={state.code} className="flex items-center space-x-2">
                    <Checkbox
                      id={`state-${state.code}`}
                      checked={filters.states?.includes(state.code) || false}
                      onCheckedChange={() => toggleState(state.code)}
                    />
                    <label htmlFor={`state-${state.code}`} className="text-sm cursor-pointer">
                      {state.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {cities.length > 0 && (
            <div className="space-y-2">
              <Label>Cities</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {cities.map(city => (
                  <div key={city.name} className="flex items-center space-x-2">
                    <Checkbox
                      id={`city-${city.name}`}
                      checked={filters.cities?.includes(city.name) || false}
                      onCheckedChange={() => toggleCity(city.name)}
                    />
                    <label htmlFor={`city-${city.name}`} className="text-sm cursor-pointer">
                      {city.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Timezone */}
      <div className="space-y-3">
        <Label>Timezones (for optimal send times)</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {timezones.map(tz => (
            <div key={tz.id} className="flex items-center space-x-2">
              <Checkbox
                id={`tz-${tz.id}`}
                checked={filters.timezone?.includes(tz.id) || false}
                onCheckedChange={() => toggleTimezone(tz.id)}
              />
              <label htmlFor={`tz-${tz.id}`} className="text-sm cursor-pointer">
                {tz.label} <span className="text-xs text-muted-foreground">({tz.offset})</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Geo-Radius */}
      <Card className="border-accent/30">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Geographic Radius (Geo-Fencing)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {filters.geoRadius ? (
            <div className="bg-accent/10 p-3 rounded space-y-2">
              <p className="text-sm font-medium">
                Current Radius: {filters.geoRadius.radiusKm}km from (
                {filters.geoRadius.centerLat.toFixed(4)}, {filters.geoRadius.centerLng.toFixed(4)})
              </p>
              <Button size="sm" variant="outline" onClick={clearGeoRadius}>
                <Minus className="w-3 h-3 mr-1" />
                Clear Radius
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Enter center coordinates and radius to target fans within a specific area
              </p>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="lat" className="text-xs">
                    Latitude
                  </Label>
                  <Input
                    id="lat"
                    placeholder="e.g., 29.7589"
                    value={centerLat}
                    onChange={e => setCenterLat(e.target.value)}
                    type="number"
                    step="0.0001"
                  />
                </div>
                <div>
                  <Label htmlFor="lng" className="text-xs">
                    Longitude
                  </Label>
                  <Input
                    id="lng"
                    placeholder="e.g., -95.3677"
                    value={centerLng}
                    onChange={e => setCenterLng(e.target.value)}
                    type="number"
                    step="0.0001"
                  />
                </div>
                <div>
                  <Label htmlFor="radius" className="text-xs">
                    Radius (km)
                  </Label>
                  <Input
                    id="radius"
                    placeholder="e.g., 50"
                    value={radiusInput}
                    onChange={e => setRadiusInput(e.target.value)}
                    type="number"
                    min="1"
                  />
                </div>
              </div>

              <Button
                onClick={setGeoRadius}
                className="w-full"
                disabled={!centerLat || !centerLng || !radiusInput}
              >
                <Plus className="w-3 h-3 mr-2" />
                Set Radius
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                💡 Tip: Use a maps app to find coordinates. Search for venue and copy lat/lng.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      {(filters.countries?.length ||
        filters.states?.length ||
        filters.cities?.length ||
        filters.timezone?.length ||
        filters.geoRadius) && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-3">
            <p className="text-sm font-medium">Selected Filters:</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {filters.countries?.map(c => (
                <Badge key={c} variant="secondary" className="text-xs">
                  {c}
                </Badge>
              ))}
              {filters.states?.map(s => (
                <Badge key={s} variant="outline" className="text-xs">
                  {s}
                </Badge>
              ))}
              {filters.cities?.map(c => (
                <Badge key={c} variant="outline" className="text-xs">
                  {c}
                </Badge>
              ))}
              {filters.timezone?.map(t => (
                <Badge key={t} variant="secondary" className="text-xs">
                  {t.split("/")[1]}
                </Badge>
              ))}
              {filters.geoRadius && (
                <Badge variant="secondary" className="text-xs">
                  {filters.geoRadius.radiusKm}km radius
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
