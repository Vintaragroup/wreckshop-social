/**
 * Geolocation Service
 * Provides utilities for geographic calculations, radius searches, and location queries
 */

interface GeoCoordinates {
  latitude: number
  longitude: number
}

interface GeoRadius {
  centerLat: number
  centerLng: number
  radiusKm: number
}

interface LocationData {
  latitude?: number
  longitude?: number
  country?: string
  countryName?: string
  state?: string
  stateName?: string
  city?: string
  postalCode?: string
  timezone?: string
}

export class GeolocationService {
  /**
   * Calculate distance between two points using Haversine formula
   * Returns distance in kilometers
   */
  static calculateDistance(point1: GeoCoordinates, point2: GeoCoordinates): number {
    const R = 6371 // Earth's radius in km
    const dLat = this.toRad(point2.latitude - point1.latitude)
    const dLng = this.toRad(point2.longitude - point1.longitude)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(point1.latitude)) *
        Math.cos(this.toRad(point2.latitude)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  /**
   * Convert degrees to radians
   */
  private static toRad(degrees: number): number {
    return (degrees * Math.PI) / 180
  }

  /**
   * Check if a point is within a radius
   */
  static isWithinRadius(point: GeoCoordinates, radius: GeoRadius): boolean {
    const distance = this.calculateDistance(
      { latitude: radius.centerLat, longitude: radius.centerLng },
      point
    )
    return distance <= radius.radiusKm
  }

  /**
   * Build MongoDB query for geographic filters
   */
  static buildGeoQuery(filters: {
    countries?: string[]
    states?: string[]
    cities?: string[]
    timezone?: string[]
    geoRadius?: GeoRadius
  }): any {
    const query: any = {}

    if (filters.countries && filters.countries.length > 0) {
      query['location.country'] = { $in: filters.countries }
    }

    if (filters.states && filters.states.length > 0) {
      query['location.state'] = { $in: filters.states }
    }

    if (filters.cities && filters.cities.length > 0) {
      query['location.city'] = { $in: filters.cities }
    }

    if (filters.timezone && filters.timezone.length > 0) {
      query['location.timezone'] = { $in: filters.timezone }
    }

    if (filters.geoRadius) {
      // MongoDB geospatial query for points within a radius
      // Uses 2dsphere index
      query['location.coordinates'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [filters.geoRadius.centerLng, filters.geoRadius.centerLat],
          },
          $maxDistance: filters.geoRadius.radiusKm * 1000, // Convert km to meters
        },
      }
    }

    return query
  }

  /**
   * Combine music and geographic filters
   */
  static buildCombinedQuery(musicFilters: any, geoFilters: any): any {
    const query: any = {}

    // Music filters
    if (musicFilters?.genres && musicFilters.genres.length > 0) {
      query['discoveredVia.musicGenre'] = { $in: musicFilters.genres }
    }

    if (musicFilters?.artistTypes && musicFilters.artistTypes.length > 0) {
      query['discoveredVia.artistType'] = { $in: musicFilters.artistTypes }
    }

    if (musicFilters?.minScore && musicFilters.minScore > 0) {
      query.matchScore = { $gte: musicFilters.minScore }
    }

    // Geographic filters
    const geoQuery = this.buildGeoQuery(geoFilters)
    Object.assign(query, geoQuery)

    return query
  }

  /**
   * Parse timezone string to validate
   */
  static isValidTimezone(tz: string): boolean {
    try {
      Intl.DateTimeFormat(undefined, { timeZone: tz })
      return true
    } catch (ex) {
      return false
    }
  }

  /**
   * Get current time in specified timezone
   */
  static getTimeInTimezone(timezone: string): Date {
    try {
      const date = new Date()
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
      return new Date(formatter.format(date))
    } catch (ex) {
      return new Date()
    }
  }

  /**
   * Standard list of countries
   */
  static getCountries(): Array<{ code: string; name: string }> {
    return [
      { code: 'US', name: 'United States' },
      { code: 'CA', name: 'Canada' },
      { code: 'MX', name: 'Mexico' },
      { code: 'GB', name: 'United Kingdom' },
      { code: 'DE', name: 'Germany' },
      { code: 'FR', name: 'France' },
      { code: 'IT', name: 'Italy' },
      { code: 'ES', name: 'Spain' },
      { code: 'AU', name: 'Australia' },
      { code: 'JP', name: 'Japan' },
      { code: 'BR', name: 'Brazil' },
      { code: 'IN', name: 'India' },
      { code: 'NZ', name: 'New Zealand' },
      { code: 'SG', name: 'Singapore' },
      { code: 'KR', name: 'South Korea' },
      { code: 'NL', name: 'Netherlands' },
      { code: 'SE', name: 'Sweden' },
      { code: 'CH', name: 'Switzerland' },
      { code: 'ZA', name: 'South Africa' },
      { code: 'AE', name: 'United Arab Emirates' },
    ]
  }

  /**
   * US States
   */
  static getUSStates(): Array<{ code: string; name: string }> {
    return [
      { code: 'AL', name: 'Alabama' },
      { code: 'AK', name: 'Alaska' },
      { code: 'AZ', name: 'Arizona' },
      { code: 'AR', name: 'Arkansas' },
      { code: 'CA', name: 'California' },
      { code: 'CO', name: 'Colorado' },
      { code: 'CT', name: 'Connecticut' },
      { code: 'DE', name: 'Delaware' },
      { code: 'FL', name: 'Florida' },
      { code: 'GA', name: 'Georgia' },
      { code: 'HI', name: 'Hawaii' },
      { code: 'ID', name: 'Idaho' },
      { code: 'IL', name: 'Illinois' },
      { code: 'IN', name: 'Indiana' },
      { code: 'IA', name: 'Iowa' },
      { code: 'KS', name: 'Kansas' },
      { code: 'KY', name: 'Kentucky' },
      { code: 'LA', name: 'Louisiana' },
      { code: 'ME', name: 'Maine' },
      { code: 'MD', name: 'Maryland' },
      { code: 'MA', name: 'Massachusetts' },
      { code: 'MI', name: 'Michigan' },
      { code: 'MN', name: 'Minnesota' },
      { code: 'MS', name: 'Mississippi' },
      { code: 'MO', name: 'Missouri' },
      { code: 'MT', name: 'Montana' },
      { code: 'NE', name: 'Nebraska' },
      { code: 'NV', name: 'Nevada' },
      { code: 'NH', name: 'New Hampshire' },
      { code: 'NJ', name: 'New Jersey' },
      { code: 'NM', name: 'New Mexico' },
      { code: 'NY', name: 'New York' },
      { code: 'NC', name: 'North Carolina' },
      { code: 'ND', name: 'North Dakota' },
      { code: 'OH', name: 'Ohio' },
      { code: 'OK', name: 'Oklahoma' },
      { code: 'OR', name: 'Oregon' },
      { code: 'PA', name: 'Pennsylvania' },
      { code: 'RI', name: 'Rhode Island' },
      { code: 'SC', name: 'South Carolina' },
      { code: 'SD', name: 'South Dakota' },
      { code: 'TN', name: 'Tennessee' },
      { code: 'TX', name: 'Texas' },
      { code: 'UT', name: 'Utah' },
      { code: 'VT', name: 'Vermont' },
      { code: 'VA', name: 'Virginia' },
      { code: 'WA', name: 'Washington' },
      { code: 'WV', name: 'West Virginia' },
      { code: 'WI', name: 'Wisconsin' },
      { code: 'WY', name: 'Wyoming' },
    ]
  }

  /**
   * Common IANA timezones for major markets
   */
  static getCommonTimezones(): Array<{ id: string; label: string; offset: string }> {
    return [
      { id: 'America/Los_Angeles', label: 'Pacific Time (PT)', offset: 'UTC-8/-7' },
      { id: 'America/Denver', label: 'Mountain Time (MT)', offset: 'UTC-7/-6' },
      { id: 'America/Chicago', label: 'Central Time (CT)', offset: 'UTC-6/-5' },
      { id: 'America/New_York', label: 'Eastern Time (ET)', offset: 'UTC-5/-4' },
      { id: 'America/Toronto', label: 'Eastern Time (Toronto)', offset: 'UTC-5/-4' },
      { id: 'America/Mexico_City', label: 'Central Time (Mexico)', offset: 'UTC-6/-5' },
      { id: 'Europe/London', label: 'Greenwich Mean Time (GMT)', offset: 'UTC+0/+1' },
      { id: 'Europe/Paris', label: 'Central European Time (CET)', offset: 'UTC+1/+2' },
      { id: 'Europe/Berlin', label: 'Central European Time (CET)', offset: 'UTC+1/+2' },
      { id: 'Asia/Tokyo', label: 'Japan Standard Time (JST)', offset: 'UTC+9' },
      { id: 'Australia/Sydney', label: 'Australian Eastern Time (AET)', offset: 'UTC+10/+11' },
      { id: 'Asia/Singapore', label: 'Singapore Standard Time (SGT)', offset: 'UTC+8' },
      { id: 'Asia/Dubai', label: 'Gulf Standard Time (GST)', offset: 'UTC+4' },
      { id: 'Asia/Kolkata', label: 'Indian Standard Time (IST)', offset: 'UTC+5:30' },
      { id: 'America/Sao_Paulo', label: 'Brasília Time (BRT)', offset: 'UTC-3/-2' },
    ]
  }

  /**
   * Calculate geographic center of multiple points
   */
  static calculateCenter(points: GeoCoordinates[]): GeoCoordinates {
    if (points.length === 0) {
      return { latitude: 0, longitude: 0 }
    }

    const avgLat = points.reduce((sum, p) => sum + p.latitude, 0) / points.length
    const avgLng = points.reduce((sum, p) => sum + p.longitude, 0) / points.length

    return { latitude: avgLat, longitude: avgLng }
  }

  /**
   * Generate geohash for efficient spatial indexing
   * Simplified version - returns a basic hash string
   */
  static generateGeohash(latitude: number, longitude: number, precision: number = 6): string {
    const lat = latitude
    const lng = longitude
    let geohash = ''

    let latMin = -90,
      latMax = 90
    let lngMin = -180,
      lngMax = 180

    let isLng = true
    for (let i = 0; i < precision * 5; i++) {
      const mid = isLng ? (lngMin + lngMax) / 2 : (latMin + latMax) / 2
      if (isLng) {
        if (lng > mid) {
          geohash += '1'
          lngMin = mid
        } else {
          geohash += '0'
          lngMax = mid
        }
      } else {
        if (lat > mid) {
          geohash += '1'
          latMin = mid
        } else {
          geohash += '0'
          latMax = mid
        }
      }
      isLng = !isLng
    }

    // Convert binary to base32
    return this.binaryToBase32(geohash)
  }

  /**
   * Convert binary string to base32
   */
  private static binaryToBase32(binary: string): string {
    const base32chars = '0123456789bcdefghjkmnpqrstuvwxyz'
    let geohash = ''

    for (let i = 0; i < binary.length; i += 5) {
      const chunk = binary.substr(i, 5)
      const index = parseInt(chunk, 2)
      geohash += base32chars[index]
    }

    return geohash
  }
}
