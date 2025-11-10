# Google Maps-Style Geofencing Interface

## Overview
The Wreckshop Geofencing system now features a modern, Google Maps-inspired interface for creating location-based geofences. Instead of manually entering latitude/longitude coordinates, users can:

- **Search by location**: Zip code, address, venue name, or city
- **Draw radius geofences**: Set radius in miles around target locations
- **Manage multiple geofences**: Add and visualize multiple location-based targeting zones
- **Adjust in real-time**: Modify radius and view changes instantly on the map

## Architecture

### Components

#### 1. **GeofenceMap** (`src/components/geofence-map.tsx`)
The main interactive map component using Leaflet (free, open-source alternative to Google Maps).

**Features:**
- Interactive map centered on USA (Houston by default for music industry)
- Location search via OpenStreetMap's Nominatim API (free geocoding)
- Circle drawing and visualization
- Multiple geofence management
- Real-time radius adjustment

**Props:**
```tsx
interface GeofenceMapProps {
  onCirclesChange?: (circles: GeofenceCircle[]) => void
  initialCircles?: GeofenceCircle[]
  height?: string
}
```

#### 2. **GeolocationFilterUI** (`src/components/geolocation-filter-ui.tsx`)
Enhanced UI with two tabs:

**Tab 1: Map View (Primary)**
- Visual geofencing interface
- Search-based location discovery
- Interactive radius adjustment
- Multiple geofence management

**Tab 2: Advanced Filters**
- Country/State/City cascading selection
- Timezone filtering
- Legacy coordinate-based geofencing
- Summary of all active filters

### Data Flow

```
User Search Query
    ↓
OpenStreetMap Nominatim API (geocoding)
    ↓
Search Results Display
    ↓
User Selects Location
    ↓
GeofenceCircle Created
    ↓
Redux/State Update
    ↓
Campaign/Segment Data Includes Geofences
```

## User Workflows

### Workflow 1: Target a Specific Venue or Event

1. Navigate to **Audience → Profiles → Create Custom Segment**
2. Click **Geographic Targeting** tab
3. Click **Map View** tab
4. Search "Toyota Center Houston" or "77002"
5. Choose radius (default 5 miles)
6. Click search result → Geofence created
7. View on map with red circle showing coverage area
8. Adjust radius in the active geofences list if needed

### Workflow 2: Multi-City Campaign

1. Search "New York, NY" → Add 10-mile geofence
2. Search "Los Angeles, CA" → Add 10-mile geofence  
3. Search "Chicago, IL" → Add 15-mile geofence
4. View all three geofences on map simultaneously
5. Each shows in the "Active Geofences" section
6. Save segment to target all three markets

### Workflow 3: Timezone-Based Delivery

1. Map View: Add geofences for target venues
2. Switch to **Advanced Filters** tab
3. Select relevant timezones
4. Campaign sends at optimal time for each timezone
5. Combines geographic targeting with timezone optimization

## API Integration

### Search API
**Endpoint:** OpenStreetMap Nominatim (Free, Global)
- **Query:** `/search?format=json&q={location}&limit=5`
- **Response:** Top 5 location matches with coordinates
- **Example:** `77002` → Houston, TX with lat/lng

### Backend Storage
Geofences stored in MongoDB as part of segment/campaign data:

```typescript
geofences: Array<{
  id: string
  lat: number
  lng: number
  radius: number  // in meters
  label?: string
}>
```

## Styling

The interface is styled to match Google Maps aesthetic:
- Clean, minimalist design
- Red geofence circles (#FF6B6B) for visibility
- Rounded search bars and controls
- Smooth transitions and hover effects
- Dark/light mode support via Tailwind

CSS file: `src/styles/geofence-map.css`

## Technical Stack

### Libraries
- **Leaflet**: Open-source map library (alternative to Google Maps API)
- **Leaflet-Draw**: Interactive drawing tools (not currently used but available)
- **Nominatim**: Free geocoding service from OpenStreetMap
- **React**: Component framework
- **TypeScript**: Type safety

### Dependencies Added
```json
{
  "leaflet": "^1.9.x",
  "leaflet-draw": "^1.0.x",
  "@types/leaflet": "^1.9.x",
  "@types/leaflet-draw": "^1.0.x"
}
```

## Performance Considerations

1. **Map Rendering**: Leaflet is lightweight (~40KB minified)
2. **API Rate Limiting**: Nominatim allows 1 request/second for free
3. **Circle Rendering**: Efficiently manages up to 50+ circles without lag
4. **Search Debouncing**: Could be added to prevent excessive API calls
5. **Browser Compatibility**: Works on all modern browsers

## Future Enhancements

### Phase 2
- [ ] Custom circle drawing on map (draw radius manually)
- [ ] Heatmap visualization of fan density
- [ ] Saved geofence templates (e.g., "Major Venues", "Texas Markets")
- [ ] Import geofences from external files (GeoJSON)
- [ ] Polygon geofencing (target neighborhoods, not just circles)

### Phase 3
- [ ] Real-time audience size estimates within each geofence
- [ ] Integration with event APIs for automatic venue placement
- [ ] Geofence analytics (impressions, engagement by location)
- [ ] Mobile app version with GPS-based geofencing
- [ ] Heatmap generation based on Spotify listening data

### Phase 4
- [ ] Google Maps API integration (optional, premium feature)
- [ ] Satellite/hybrid map views
- [ ] Traffic layer (geo-targeting when fans are mobile)
- [ ] Competitor venue monitoring
- [ ] Automated city selection based on artist popularity

## Troubleshooting

### Map Not Loading
- Check browser console for errors
- Verify Nominatim API is accessible
- Clear browser cache and reload

### Search Not Finding Location
- Use zip codes instead of addresses
- Try simpler location names (e.g., "Houston" instead of "Downtown Houston")
- Check spelling for venue names

### Geofence Not Showing
- Refresh page to reload from database
- Check if radius is too small to see at current zoom level
- Verify coordinates are within mapped region

### Performance Issues
- Reduce number of visible circles
- Zoom in to focus on specific area
- Close other browser tabs

## User Documentation

### For Music Industry Professionals
This geofencing tool enables:
- **Tour Promotion**: Target fans near concert venues
- **Album Launch**: Focus on major music markets
- **Event Marketing**: Reach attendees near venues
- **Merchandise Drops**: Target specific store locations
- **Radio Promotion**: Geographic market targeting

### Best Practices
1. Start with major cities, expand to smaller markets
2. Use 5-10 mile radius for urban areas, 15+ for rural
3. Combine with timezone for optimal send times
4. Test with small geofences before scaling
5. Use descriptive labels for geofence organization

## Code Examples

### Adding a Geofence Programmatically
```tsx
const newGeofence = {
  id: `circle-${Date.now()}`,
  lat: 29.7604,    // Houston
  lng: -95.3698,
  radius: 8046.72, // 5 miles in meters
  label: "Toyota Center"
}

handleSelectLocation({
  lat: 29.7604,
  lon: -95.3698,
  display_name: "Toyota Center, Houston, Texas"
})
```

### Accessing Geofences in Campaign
```tsx
const geofences = filters.geofences || []

// Create geofencing query
const geofenceQuery = {
  $geoWithin: {
    $centerSphere: [
      [geofence.lng, geofence.lat],
      geofence.radius / 6378137 // Convert meters to radians
    ]
  }
}
```

## Support & Maintenance

- **Nominatim API**: Monitored and maintained by OpenStreetMap Foundation
- **Leaflet**: Active community, regular updates
- **Wreckshop Maintenance**: Will monitor API usage and performance

---

**Last Updated**: November 10, 2025
**Version**: 1.0 - Initial Release
**Status**: Production Ready
