# Geolocation & Geo-Fencing in Segments - Analysis

## Current Status: ⚠️ NOT IMPLEMENTED

### What's Currently Available

The segment system **does not currently support** geolocation or geo-fencing as a filtering criterion.

#### Current Segment Filters (Only)
```typescript
interface CreateSegmentRequest {
  name: string
  filters: {
    genres?: string[]              // ✅ Implemented
    artistTypes?: string[]         // ✅ Implemented
    minScore?: number              // ✅ Implemented
  }
}
```

#### Current Available Filters in Segment Builder
- **Genres**: indie, hip-hop, pop, electronic, rock, r&b, country, jazz, metal, latino
- **Artist Types**: mainstream, underground, indie, emerging
- **Match Score**: 0-100% (user relevance score)

### Location Data That Exists (But Not in Segments)

#### 1. Audience Profile Data
**File**: `src/components/audience-profiles.tsx`
- User profiles have a `location` field (text string)
- Examples: "Houston, TX", "Dallas, TX", "Austin, TX"
- Used for display only, not for segmentation
- Stored as part of profile metadata (not Discovered User model)

#### 2. Dashboard Analytics
**File**: `src/components/audience-dashboard.tsx`
- Top locations displayed: Houston, Dallas, Austin, San Antonio, Atlanta
- City-level metrics showing fan counts
- Purely for visualization/reporting
- Not integrated with segments

#### 3. Event Locations
**File**: `backend/src/models/event.ts`
- Event model has `city` field
- Venue information tracked
- Not connected to discovered user segments

#### 4. Artist Location
**File**: `src/components/create-artist-modal.tsx`
- Artists can have a location field set
- Informational only

### Database Models Review

#### DiscoveredUser Model
**File**: `backend/src/models/discovered-user.ts`

```typescript
// CURRENT FIELDS - No geolocation
discoveredVia: {
  musicGenre: { type: String },          // ✅ Genre filter
  artistType: { type: String },          // ✅ Artist type filter
  timestamp: { type: Date },
}

// Missing geolocation data:
// NO latitude/longitude
// NO country
// NO city/region
// NO location metadata
// NO proximity data
```

#### Segment Model
**File**: `backend/src/models/segment.ts`

```typescript
// CURRENT STRUCTURE
{
  name: String,
  description: String,
  query: {
    type: 'discovered-user',
    filters: {
      genres: string[],
      artistTypes: string[],
      minScore: number
      // NO location/geolocation fields
    }
  }
}
```

### What Would Be Needed for Geo-Fencing

#### 1. Data Collection Phase
```
Need to add to DiscoveredUser model:
- latitude, longitude (decimal)
- country (ISO 3166-1 alpha-2: "US", "CA", etc)
- state/region ("TX", "CA", etc)
- city (string)
- postalCode (string)
- timezone (IANA: "America/Chicago")

Source: Extract from Spotify user location data or third-party geo API
```

#### 2. Segment Filter Enhancement
```typescript
interface CreateSegmentRequest {
  name: string
  filters: {
    genres?: string[]
    artistTypes?: string[]
    minScore?: number
    // NEW FIELDS NEEDED:
    countries?: string[]                // ["US", "CA"]
    states?: string[]                   // ["TX", "CA"]
    cities?: string[]                   // ["Houston", "Austin"]
    geoRadius?: {                       // For geo-fencing
      centerLat: number
      centerLng: number
      radiusKm: number                  // e.g., 50 km
    }
    timezone?: string[]                 // ["America/Chicago"]
  }
}
```

#### 3. MongoDB Query Building
```typescript
// Would need to handle:
if (filters?.countries) {
  query.country = { $in: filters.countries }
}

if (filters?.states) {
  query.state = { $in: filters.states }
}

if (filters?.geoRadius) {
  // Geo-spatial query
  query.location = {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: [filters.geoRadius.centerLng, filters.geoRadius.centerLat]
      },
      $maxDistance: filters.geoRadius.radiusKm * 1000  // Convert km to meters
    }
  }
}
```

#### 4. Frontend UI Components
```typescript
// New controls needed in segment-builder:
- Country multi-select dropdown
- State/Region multi-select
- City multi-select
- Geo-map with radius drawing tool
- Timezone selector
- Distance radius input
```

#### 5. Indexes for Performance
```typescript
// Add to DiscoveredUserSchema:
DiscoveredUserSchema.index({ country: 1, state: 1 })
DiscoveredUserSchema.index({ city: 1 })
DiscoveredUserSchema.index({ location: "2dsphere" })  // For geo-spatial queries
```

## Implementation Roadmap (If Needed)

### Phase 1: Data Collection
- [ ] Add geolocation fields to DiscoveredUser model
- [ ] Integrate geolocation API (e.g., MaxMind, IP2Location)
- [ ] Extract location from Spotify user profiles (if available)
- [ ] Backfill existing discovered users with location data

### Phase 2: Backend Infrastructure
- [ ] Update discovery service to collect/store location data
- [ ] Add geospatial indexes to MongoDB
- [ ] Enhance segment query builder to support location filters
- [ ] Add new API endpoints for location data

### Phase 3: Segment System Enhancement
- [ ] Update CreateSegmentRequest interface
- [ ] Modify segment creation endpoint
- [ ] Update segment retrieval logic
- [ ] Add location-based segment suggestions

### Phase 4: Frontend UI
- [ ] Add location inputs to segment builder
- [ ] Create interactive map component for radius selection
- [ ] Add location multi-select dropdowns
- [ ] Display location-based segment previews

### Phase 5: Campaign Integration
- [ ] Update campaign builder to show location-based audiences
- [ ] Add location targeting to campaign workflows
- [ ] Display geographic reach metrics

## Use Cases for Geo-Fencing

#### 1. Venue-Based Campaigns
```
Example: Target fans within 50km of concert venue
- Create segment: "Houston Concert Zone"
- Filter: 50km radius around NRG Stadium
- Send pre-sale notifications to local fans
```

#### 2. Regional Tours
```
Example: Target multiple cities on tour route
- Create segment: "Texas Tour Fans"
- Filter: Cities = ["Houston", "Dallas", "Austin"]
- Coordinate multi-city promotions
```

#### 3. Local Market Testing
```
Example: Test new single in specific market
- Create segment: "Austin Metropolitan Area"
- Filter: 30km radius + "Austin, TX"
- Measure local traction before national push
```

#### 4. International Targeting
```
Example: Promote album in specific countries
- Create segment: "European Tour Prep"
- Filter: countries = ["DE", "FR", "UK", "IT"]
- Run localized campaigns
```

#### 5. Time Zone Optimization
```
Example: Send emails at optimal local times
- Create segment: "Pacific Timezone Fans"
- Filter: timezone = "America/Los_Angeles"
- Schedule sends for 6 PM local time
```

## Comparison: Current vs. Geo-Enabled

| Feature | Current | With Geo-Fencing |
|---------|---------|------------------|
| Filter by genre | ✅ Yes | ✅ Yes |
| Filter by artist type | ✅ Yes | ✅ Yes |
| Filter by match score | ✅ Yes | ✅ Yes |
| Filter by country | ❌ No | ✅ Yes |
| Filter by city | ❌ No | ✅ Yes |
| Filter by radius/proximity | ❌ No | ✅ Yes |
| Filter by timezone | ❌ No | ✅ Yes |
| Geographic reach reporting | ⚠️ Partial | ✅ Full |
| Local time optimization | ❌ No | ✅ Yes |

## Recommendation

**For MVP**: Current segment system is sufficient for genre/type-based targeting

**For Later Phases**: Add geolocation when:
- Campaign targeting becomes location-specific (venue, tours)
- International expansion requires region-based marketing
- Time-zone-optimized sending becomes important
- Analytics need geographic breakdown

## Related Data Points

### Location Data Currently Stored

1. **Audience Profiles** (mock data):
   - Location: "City, State" format
   - Used for display and basic filtering
   - Not tied to discovered users

2. **Event Model** (backend):
   - City field exists
   - Capacity tracking
   - No connection to user segments

3. **Dashboard Analytics** (frontend):
   - Top locations display
   - Percentage-based metrics
   - Hardcoded data, not dynamic

## Files That Would Need Modification

```
backend/
├── src/models/
│   ├── discovered-user.ts      (Add geo fields)
│   └── segment.ts              (No changes needed)
├── src/routes/spotify/
│   └── discovery.routes.ts     (Add geo query logic)
└── src/services/spotify/
    └── discovered-user.service.ts (Add geo processing)

src/components/
├── discovered-user-segment-builder.tsx  (Add geo UI)
└── create-campaign-modal.tsx             (Show geo reach)
```

## Summary

**Current State**: Segments use only music-based filters (genre, artist type, match score)

**Geolocation Status**: Not integrated with segment system, though location data exists in other parts of the app

**Recommendation**: Add geolocation support when geographic targeting becomes a business requirement
