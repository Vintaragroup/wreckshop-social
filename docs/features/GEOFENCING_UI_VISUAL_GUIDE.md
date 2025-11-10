# Geofencing Interface - Quick Visual Guide

## Main Map View

```
┌─────────────────────────────────────────────────────────────────┐
│  SEARCH LOCATION & RADIUS                                       │
│  ┌──────────────────────────────────┬─────────────┐             │
│  │ Search Address, Zip, or Venue    │  Search ⚡  │             │
│  └──────────────────────────────────┴─────────────┘             │
│  Radius (miles)                                                 │
│  ┌──────────┐                                                   │
│  │ 5.0 mi   │  5.0 miles                                        │
│  └──────────┘                                                   │
│                                                                 │
│  SEARCH RESULTS (if applicable)                                │
│  • Toyota Center, Houston, TX                                  │
│  • Discovery Green, Houston, TX                                │
│  • NRG Stadium, Houston, TX                                    │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                    🗺️  INTERACTIVE MAP                         │
│                                                                 │
│              • Houston centered                                │
│              • Red dashed circles = geofences                 │
│              • Zoom in/out to explore                         │
│              • Click circles for details                      │
│                                                                 │
│                 🔴 (5.0 mi radius circle)                      │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  ACTIVE GEOFENCES (3)                              Clear All ↻   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ 🔴 Toyota Center                                   [5.0mi] │ │
│  │    29.7604° N, 95.3698° W • 5.0 miles         Radius: [▼] │ │
│  │                                                   [🗑️ Delete] │
│  ├────────────────────────────────────────────────────────────┤ │
│  │ 🔴 Discovery Green                              [10.0mi]   │ │
│  │    29.7583° N, 95.3616° W • 10.0 miles      Radius: [▼]  │ │
│  │                                                   [🗑️ Delete] │
│  ├────────────────────────────────────────────────────────────┤ │
│  │ 🔴 NRG Stadium                                 [7.5mi]    │ │
│  │    29.6853° N, 95.4108° W • 7.5 miles       Radius: [▼]  │ │
│  │                                                   [🗑️ Delete] │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Advanced Filters Tab

```
┌─────────────────────────────────────────────────────────────────┐
│  ADVANCED GEOGRAPHIC FILTERS                                    │
│                                                                 │
│  COUNTRIES                                                      │
│  ☑️ United States  ☐ Canada  ☐ Mexico                          │
│                                                                 │
│  STATES/REGIONS (Filter by Country First)                       │
│  ┌────────────────────────────────────┐                         │
│  │ Select country...                  │ ▼                       │
│  └────────────────────────────────────┘                         │
│                                                                 │
│  TIMEZONES (for optimal send times)                             │
│  ☑️ Eastern (UTC-5)      ☑️ Central (UTC-6)                    │
│  ☐ Mountain (UTC-7)     ☐ Pacific (UTC-8)                     │
│                                                                 │
│  GEOGRAPHIC RADIUS (Geo-Fencing)                                │
│  Current Radius: 5.0 km from (29.7604, -95.3698)              │
│  [Clear Radius]                                                 │
│                                                                 │
│  SELECTED FILTERS:                                              │
│  🏷️ US  🏷️ TX  🏷️ 5.0mi radius  🏷️ CST                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Search Flow

```
User Types "77002"
         ↓
API Query to Nominatim
         ↓
Results Return:
  • Houston, TX (city center)
  • 77002 Zip Code Area
  • Downtown Houston
         ↓
User Selects One
         ↓
Circle Drawn at Coordinates
Radius: 5.0 miles (default)
         ↓
Geofence Added to List
         ↓
Map Auto-Centers & Zooms
         ↓
Ready to Add More or Adjust
```

## Radius Adjustment Options

```
Active Geofence Card:
┌────────────────────────────────────────────┐
│ 🔴 Toyota Center                           │
│    29.7604° N, 95.3698° W                 │
│    Current: 5.0 miles                     │
│                                            │
│    Radius Adjuster: [5.0]  [Update] [🗑️] │
│                                            │
│    Type new value or use:                 │
│    • +/- buttons (1 mi increments)        │
│    • Slider for visual adjustment         │
│    • Manual input (0.1 - 100 miles)       │
└────────────────────────────────────────────┘

Change Reflects:
  ✓ Immediately on map (circle grows/shrinks)
  ✓ In active list (shows new radius)
  ✓ In segment/campaign data (stored)
```

## Integration with Campaigns

```
CREATE EMAIL CAMPAIGN
  ↓
Step 1: Select Template
  ↓
Step 2: Email Content
  ↓
Step 3: Select Audience Segment
  ↓
Step 4: GEOGRAPHIC TARGETING ← Map Interface
        ┌──────────────────────────────┐
        │ 📍 Enable Geographic Targeting│
        │                              │
        │ [Map View Tab]               │
        │ • Search locations           │
        │ • Adjust radius             │
        │ • View on map               │
        │                              │
        │ ACTIVE: 3 geofences          │
        │ 🔴 Houston (5 mi)            │
        │ 🔴 Dallas (8 mi)             │
        │ 🔴 Austin (10 mi)            │
        └──────────────────────────────┘
  ↓
Step 5: Schedule & Send
  ↓
Campaign targets fans in those 3 geographic zones
```

## Keyboard Shortcuts (Planned)

```
Feature              Shortcut     Description
─────────────────────────────────────────────
Zoom In              +            Zoom map in
Zoom Out             -            Zoom map out
Reset View           Home         Center on USA
Delete Geofence      Del/Backsp   Delete selected
Add Geofence         +            New search
Search Focus         /            Focus search box
```

## Color Scheme

```
Primary Colors:
  🔴 Red (#FF6B6B)     - Active geofences, hover states
  ⚪ White (#FFFFFF)   - Cards, backgrounds
  ⚫ Gray (#6B7280)    - Text, borders
  
Map Background:
  🟤 OSM Standard Map - Muted earth tones
  
Interactive Elements:
  🔵 Blue (#3B82F6)   - Buttons, active selections
  🟡 Amber (#F59E0B)  - Warnings, adjustments
```

## Responsive Behavior

```
Desktop (>1024px):
  • Full map on right (60%)
  • Controls on left (40%)
  • Search + Results visible
  • Full geofence list

Tablet (768-1023px):
  • Map above controls
  • Collapsed search results
  • Simplified list view

Mobile (<768px):
  • Full-screen map
  • Bottom sheet for controls
  • Search overlay
  • One geofence at a time
```

## Error States

```
Search Error:
  ⚠️ "No locations found. Try another search."
  • Suggest spelling check
  • Show example formats
  
Map Error:
  ⚠️ "Failed to load map. Check your connection."
  • Retry button
  • Fallback to text entry
  
API Error:
  ⚠️ "Search service temporarily unavailable"
  • Auto-retry with backoff
  • Use cached results if available
```

## Success Confirmations

```
✅ Geofence Added
   "Toyota Center geofence created (5.0 mi)"

✅ Radius Updated
   "Radius updated to 7.5 miles"

✅ Geofence Removed
   "Geofence deleted successfully"

✅ Campaign Saved
   "Campaign saved with 3 geofences targeting Houston"
```

---

**This visual guide helps users understand the geofencing interface flow and capabilities at a glance.**

For detailed documentation, see: `GEOFENCING_UI_DOCUMENTATION.md`
