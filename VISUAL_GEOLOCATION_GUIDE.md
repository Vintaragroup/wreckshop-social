# 🗺️ VISUAL GUIDE - FINDING GEOLOCATION TOOLS

**Your Dev Server is Running**: http://localhost:3000/

---

## 📍 VISUAL LOCATION MAP

```
WRECKSHOP APP INTERFACE
│
├─ Navbar/Menu
│  ├─ Dashboard
│  ├─ Segments
│  ├─ Campaigns  
│  ├─ Audience
│  └─ ...
│
├─ SEGMENTS PAGE (if you go there)
│  ├─ Top: Quick suggestions section
│  │  └─ Cards: "Emerging Indie Fans", "Regional Hip-Hop", etc.
│  │
│  ├─ Right: [Custom Segment] Button ← CLICK THIS!
│  │  │
│  │  └─ Dialog Opens:
│  │     │
│  │     ├─ "Create Custom Segment" (Title)
│  │     ├─ "Combine music preferences with geographic targeting" (Description)
│  │     │
│  │     ├─ Segment Name: [________] (Input field)
│  │     │
│  │     ├─ TWO TABS: ← THIS IS WHERE GEOLOCATION TOOLS ARE!
│  │     │  ├─ Tab 1: [Music Preferences] (with 📝 icon)
│  │     │  │  Shows: Genres, Artist Types, Match Score
│  │     │  │
│  │     │  └─ Tab 2: [🗺️ Geographic Targeting] ← CLICK THIS TAB!
│  │     │     Shows:
│  │     │     ├─ Country Selector
│  │     │     ├─ State Selector (after country selected)
│  │     │     ├─ City Selector (after state selected)
│  │     │     ├─ Timezone Multi-Select
│  │     │     └─ Radius Search Input
│  │     │
│  │     └─ [Cancel] [Create Segment] (Buttons)
│  │
│  └─ Below dialog: Saved Segments, Quick Suggestions
│
└─ CAMPAIGNS PAGE (if you go there)
   └─ [Create Campaign] Button ← CLICK THIS!
      │
      └─ Multi-step Form (5 steps):
         │
         ├─ Step 1: [Template Selection]
         │  └─ Choose: Email, SMS, or Journey
         │
         ├─ Step 2: [Content] 
         │  └─ Subject, preview, message body
         │
         ├─ Step 3: [Audience]
         │  └─ Select audience segments
         │
         ├─ Step 4: [🗺️ Geographic Targeting] ← GEOLOCATION TOOLS HERE!
         │  │
         │  ├─ Toggle: [✓] Enable Geographic Targeting
         │  │
         │  └─ If enabled, shows:
         │     ├─ Country Selector
         │     ├─ State Selector
         │     ├─ City Selector
         │     ├─ Timezone Multi-Select
         │     ├─ Radius Search Input
         │     └─ Geographic Reach Summary
         │
         └─ Step 5: [Schedule]
            └─ Send now or schedule for later
```

---

## 🎯 STEP-BY-STEP TO SEE GEOLOCATION TOOLS

### Path 1: Through Segment Builder (EASIEST)

```
1. Open http://localhost:3000/
   ↓
2. Find and click "Segment Builder" or "Audience Dashboard"
   (May be in sidebar, navbar, or main menu)
   ↓
3. Look for blue [Custom Segment] button on the right
   ↓
4. Click [Custom Segment] button
   ↓
5. Dialog appears with:
   ├─ Title: "Create Custom Segment"
   ├─ Name field
   ├─ TWO TABS at top:
   │  ├─ [Music Preferences]
   │  └─ [🗺️ Geographic Targeting] ← CLICK THIS!
   └─ Buttons: Cancel, Create Segment
   ↓
6. Click the [🗺️ Geographic Targeting] tab
   ↓
7. YOU'LL SEE GEOLOCATION TOOLS:
   ├─ Country selector [Select Country ▼]
   ├─ State checkboxes (appear after country selected)
   ├─ City checkboxes (appear after state selected)
   ├─ Timezone multi-select
   └─ Radius input (Latitude, Longitude, Kilometers)
```

### Path 2: Through Campaign Builder

```
1. Open http://localhost:3000/
   ↓
2. Find and click "Campaigns" section
   ↓
3. Look for [Create Campaign] or [New Campaign] button
   ↓
4. Click it
   ↓
5. Multi-step form opens with progress indicator
   ↓
6. Progress shows: 1 of 5 steps
   ├─ [1. Template]
   ├─ [2. Content]
   ├─ [3. Audience]
   ├─ [4. Geographic Targeting] ← GEOLOCATION TOOLS HERE!
   └─ [5. Schedule]
   ↓
7. Click "Next" to go through steps 1-3
   ↓
8. When you reach Step 4 "Geographic Targeting":
   ├─ You'll see a toggle: [✓] Enable Geographic Targeting
   ├─ Check the toggle
   └─ Same geolocation tools appear below:
      ├─ Country selector
      ├─ State checkboxes
      ├─ City checkboxes
      ├─ Timezone multi-select
      ├─ Radius input
      └─ Geographic Reach Summary badges
```

---

## 🔍 DETAILED VIEW - WHAT EACH TOOL LOOKS LIKE

### Country Selector
```
┌──────────────────────────────────┐
│ Country                          │
│ [Select Country ▼]               │ ← Dropdown
└──────────────────────────────────┘

When clicked, shows:
┌──────────────────────────────────┐
│ United States ▼                  │
│ ☐ United States                  │
│ ☐ Canada                         │
│ ☐ Australia                      │
│ ☐ United Kingdom                 │
│ ... (more countries)             │
└──────────────────────────────────┘
```

### State Selector (Appears After Country)
```
┌──────────────────────────────────┐
│ State/Region                     │
│ ☑ California  ☑ Texas           │
│ ☑ New York    ☐ Florida         │
│ ☐ Washington  ☐ Oregon          │
│ ... (more states)                │
└──────────────────────────────────┘

Note: Changes based on country selected
```

### City Selector (Appears After State)
```
┌──────────────────────────────────┐
│ City                             │
│ ☑ Los Angeles      ☐ San Diego  │
│ ☑ San Francisco    ☐ Oakland    │
│ ☐ Sacramento       ☐ Fresno     │
│ ... (cities in selected state)   │
└──────────────────────────────────┘
```

### Timezone Selector
```
┌──────────────────────────────────┐
│ Timezone                         │
│ ☑ America/Los_Angeles (UTC-8)   │
│ ☑ America/Chicago (UTC-6)       │
│ ☐ America/New_York (UTC-5)      │
│ ☑ Europe/London (UTC+0)         │
│ ... (more timezones)             │
└──────────────────────────────────┘

Note: Multi-select with UTC offsets shown
```

### Radius Search
```
┌──────────────────────────────────┐
│ Radius Search                    │
│                                  │
│ Latitude:  [34.0522    ]         │
│ Longitude: [-118.2437  ]         │
│ Kilometers: [50        ]         │
│                                  │
│ (Creates search around point)    │
└──────────────────────────────────┘
```

### Geographic Reach Summary (Campaign Only)
```
┌──────────────────────────────────┐
│ Geographic Reach Summary         │
│                                  │
│ Countries:  [US] [CA]           │
│ States:     [CA] [TX] [NY]      │
│ Timezones:  [America/...] [...]  │
│ Radius:     50km from venue      │
│                                  │
│ Est. Reach: ~15% additional      │
└──────────────────────────────────┘
```

---

## ✅ CONFIRMATION CHECKLIST

When you open http://localhost:3000/, check these things:

### In Segment Builder:
```
[ ] App loads without errors
[ ] Can navigate to Segment Builder
[ ] See "Custom Segment" button
[ ] Click button opens dialog
[ ] Dialog shows "Create Custom Segment" title
[ ] See TWO tabs:
    [ ] "Music Preferences" (first tab)
    [ ] "🗺️ Geographic Targeting" (second tab with map icon)
[ ] Click "Geographic Targeting" tab
[ ] Tab shows these selectors:
    [ ] Country dropdown
    [ ] State/Region area (checkboxes or list)
    [ ] City area (checkboxes or list)
    [ ] Timezone area (multi-select)
    [ ] Latitude/Longitude/KM inputs
```

### In Campaign Builder:
```
[ ] Can navigate to Campaigns
[ ] See "Create Campaign" button
[ ] Click opens 5-step form
[ ] Progress bar shows 5 steps
[ ] Step 4 is labeled "Geographic Targeting"
[ ] In Step 4:
    [ ] See toggle for "Enable Geographic Targeting"
    [ ] Toggle works (can enable/disable)
    [ ] When enabled, same tools appear:
        [ ] Country selector
        [ ] State checkboxes
        [ ] City checkboxes
        [ ] Timezone selector
        [ ] Radius input
    [ ] See "Geographic Reach Summary" section
    [ ] Summary shows badge placeholders
```

---

## 🚨 TROUBLESHOOTING

### "I don't see a second tab"
```
→ Make sure you clicked "Custom Segment" button
→ Check if dialog opened
→ Look at top of dialog for tabs
→ Should see 2 tabs
```

### "I see Music Preferences tab but no Geographic tab"
```
→ Hard refresh browser: Cmd+Shift+R (Mac) or Ctrl+F5 (Windows)
→ Close and reopen the dialog
→ Check browser console (F12) for errors
```

### "Campaign builder doesn't have Step 4"
```
→ Check if step indicator shows 5 steps (not 4)
→ Go through steps 1-3 with Next buttons
→ Step 4 should appear after Step 3
→ If not, refresh and try again
```

### "Geolocation tools appear but don't load data"
```
→ Backend might not be running
→ Check: curl http://localhost:4002/health
→ If fails, need to start backend: docker-compose up -d backend
```

---

## 🎯 WHAT TO TRY

Once you see the geolocation tools:

1. **Select a country** → See if states load
2. **Select a state** → See if cities load
3. **Select multiple cities** → Try multi-select
4. **Select timezones** → Try filtering
5. **Enter radius** → Try lat/lng/km values
6. **Create a segment** → With geographic filters
7. **Create a campaign** → With geographic targeting

---

## 📞 REPORT BACK

Tell me what you see:

✅ **If working:**
- "I can see the Geographic Targeting tab/step"
- "I can select countries/states/cities"
- "I can create segments with geographic filters"

❌ **If NOT working:**
- "I see [this]"
- "I don't see [that]"
- "I get this error: [error message]"
- "Browser console shows: [error]"

---

## 🚀 YOU'RE READY!

**Dev server is running at http://localhost:3000/**

Go look for the 🗺️ Geographic Targeting tools now!

They're in:
1. **Segment Builder** → Custom Segment → Geographic Targeting Tab
2. **Campaign Builder** → Create Campaign → Step 4: Geographic Targeting

**Open your browser now!** 🚀

