# UI Navigation Map & Visual Reference

## 🗺️ Complete Navigation Structure

```
WRECKSHOP SOCIAL PLATFORM
│
├── DASHBOARD (/)
│   └── Main user hub
│
├── AUDIENCE (/audience)
│   ├── Contacts
│   ├── Profiles
│   ├── Segments
│   └── Profile Discovery
│
├── CAMPAIGNS (/campaigns)
│   ├── Email
│   ├── SMS
│   ├── Journeys
│   └── Templates
│
├── CONTENT (/content)
│   ├── Artists
│   ├── Releases
│   ├── Events
│   └── Assets & Links
│
├── INTEGRATIONS (/integrations) ← CONNECTION HUB
│   ├── Connect Instagram
│   ├── Connect Spotify
│   ├── Connect YouTube
│   ├── Connect TikTok
│   ├── Connect Apple Music
│   └── Connect Facebook
│
├── ANALYTICS (/analytics) ← NEW: INSIGHTS HUB
│   │
│   ├── /analytics/platforms ✨ NEW SNAPSHOT PAGE
│   │   │
│   │   ├── Instagram → /integrations/instagram ✨
│   │   ├── Spotify → /integrations/spotify ✨
│   │   ├── YouTube → /integrations/youtube ✨
│   │   ├── TikTok → /integrations/tiktok ✨
│   │   ├── Apple Music → /integrations/apple-music ✨
│   │   └── Facebook → /integrations/facebook
│   │
│   └── [Other analytics features]
│
├── COMPLIANCE (/compliance)
│   └── GDPR, CCPA, compliance tools
│
├── SETTINGS (/settings)
│   └── User preferences
│
└── ADMIN (/admin) [ADMINS ONLY]
    └── Discovery tools
```

---

## 📊 Platform Analytics Snapshot View

### Current State:
```
┌────────────────────────────────────────────────────────────┐
│ 📊 Platform Analytics                                       │
│ View performance metrics across all connected platforms     │
└────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Last full sync: 45 minutes ago          [🔄 Sync All Now]  │
│ Data updates automatically from connected platforms          │
└─────────────────────────────────────────────────────────────┘

RESPONSIVE GRID (1→2→3 COLUMNS):
┌───────────────────┐ ┌───────────────────┐ ┌───────────────────┐
│ ═══════════════  │ │ ═══════════════  │ │ ═══════════════  │
│ 📸 INSTAGRAM      │ │ 🎵 SPOTIFY       │ │ 📺 YOUTUBE        │
│ ✓ Connected       │ │ ✓ Connected      │ │ ✗ Not Connected   │
│                   │ │                  │ │                   │
│ 45.2K Followers   │ │ 123K Listeners   │ │ [Lock Icon]       │
│ 8.3% Engagement   │ │ 2.1M Streams     │ │ Connect Account   │
│ 234 Posts         │ │ 5.2K Followers   │ │ to see analytics  │
│ 125.3K Reach/Wk   │ │ 2,345 Playlists  │ │                   │
│                   │ │                  │ │ [CONNECT BTN]     │
│ Last sync: 2h ago │ │ Last sync: 1h ago│ │                   │
│ [VIEW DETAILS]    │ │ [VIEW DETAILS]   │ │ [VIEW DETAILS]    │
└───────────────────┘ └───────────────────┘ └───────────────────┘

┌───────────────────┐ ┌───────────────────┐ ┌───────────────────┐
│ ═══════════════  │ │ ═══════════════  │ │ ═══════════════  │
│ 🎬 TIKTOK         │ │ 🎶 APPLE MUSIC   │ │ f FACEBOOK        │
│ ✓ Connected       │ │ ✓ Connected      │ │ ✓ Connected       │
│                   │ │                  │ │                   │
│ 128K Followers    │ │ 456K Listeners   │ │ 32.1K Followers   │
│ 12.5% Engagement  │ │ 456K Plays       │ │ 2.1% Engagement   │
│ 89 Videos         │ │ 1,234 Sales      │ │ 156 Posts         │
│ 1.2M Total Likes  │ │ $2.3K Revenue    │ │ 89.2K Reach/Wk    │
│                   │ │                  │ │                   │
│ Last sync: 3h ago │ │ Last sync: 4h ago│ │ Last sync: 5h ago │
│ [VIEW DETAILS]    │ │ [VIEW DETAILS]   │ │ [VIEW DETAILS]    │
└───────────────────┘ └───────────────────┘ └───────────────────┘
```

---

## 📊 Individual Platform Page Template

### Example: Instagram Detail Page (/integrations/instagram)

```
[← BACK]  Instagram Analytics  [@artistname]        [🔄 SYNC NOW]

┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  [Profile Image]  @artistname                              │
│                   Bio: Independent artist. Music is life.  │
│                   Website: https://artistname.com          │
│                   🎵 📸                                    │
│                   45.2K Followers | 234 Posts |            │
│                   Business Account                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘

METRICS GRID:
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ Followers This   │ │ Engagement Rate  │ │ Avg Likes Per    │ │ Weekly Reach     │
│ Month            │ │                  │ │ Post             │ │                  │
│ ═════════════════ │ │ ═════════════════ │ │ ═════════════════ │ │ ═════════════════ │
│                  │ │                  │ │                  │ │                  │
│ 📊 1.2K          │ │ ❤️ 8.3%         │ │ 👍 2,341         │ │ 📈 34.2K         │
│ ↑ +3.8%          │ │ ↑ +0.5%          │ │ ↑ +8.5%          │ │ ↑ +12.3%         │
└──────────────────┘ └──────────────────┘ └──────────────────┘ └──────────────────┘

CHARTS:
┌──────────────────────────────────────────────────────────────┐
│ 📈 Follower Growth (Last 30 Days)                           │
│ ┌────────────────────────────────────────────────────────┐  │
│ │                                                        │  │
│ │                    /\          /\                      │  │
│ │        /\        /  \        /  \                    │  │
│ │      /    \    /      \    /      \                  │  │
│ │    /        \            \/          \               │  │
│ │  /                                    \              │  │
│ │                                                        │  │
│ │ ↑ Total Growth: 1,234 followers                       │  │
│ │                                                        │  │
│ └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ 📊 Engagement Trends                                         │
│ ┌────────────────────────────────────────────────────────┐  │
│ │                                                        │  │
│ │  ████  ████  ████  ████  ████  ████  ████            │  │
│ │  ████  ████  ████  ████  ████  ████  ████            │  │
│ │  ════  ════  ════  ════  ════  ════  ════ (Likes)    │  │
│ │  ░░░░  ░░░░  ░░░░  ░░░░  ░░░░  ░░░░  ░░░░ (Comments)│  │
│ │                                                        │  │
│ │ Day 1    Day 5   Day 10  Day 15  Day 20  Day 25  Day 30 │  │
│ │                                                        │  │
│ └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘

FOOTER:
Last synced: 2 hours ago
```

---

## 🎯 User Flows

### Flow 1: View Platform Snapshot
```
User clicks "Analytics" in sidebar
    ↓
Navigate to /analytics/platforms
    ↓
See all 6 platforms at a glance
    ↓
Quick status check (connected/not connected)
    ↓
See key metrics
    ↓
[DECISION POINT]
    ├─→ Click "View Details" → Platform detail page
    ├─→ Click "Connect Account" → Integrations page
    └─→ Click "Sync All Now" → Refresh all data
```

### Flow 2: Deep-Dive into Platform
```
User on Snapshot Page
    ↓
Click "View Details" on Spotify card
    ↓
Navigate to /integrations/spotify
    ↓
See Spotify profile overview
    ↓
See key metrics with trends
    ↓
View detailed charts/data
    ↓
Click "Sync Now" to refresh
    ↓
[DECISION POINT]
    ├─→ Click back to see all platforms
    └─→ Click "Sync Now" to get fresh data
```

### Flow 3: Connect New Platform
```
User on Snapshot Page
    ↓
See unconnected platform (YouTube)
    ↓
Click "Connect Account"
    ↓
Navigate to Integrations page
    ↓
Find YouTube integration
    ↓
Start OAuth flow
    ↓
Return to platform page
    ↓
See "Connected" status
    ↓
Data syncs automatically
    ↓
View analytics after sync completes
```

---

## 🎨 Color Coding by Platform

```
Instagram:     🔴 Pink/Purple (#E4405F)
Spotify:       🟢 Spotify Green (#1DB954)
YouTube:       🔴 Red (#FF0000)
TikTok:        ⚫ Black (#000000)
Apple Music:   ⚫ Black/Gray (#252527)
Facebook:      🔵 Blue (#1877F2)
```

Each platform card has a 1px colored border at top for quick visual identification.

---

## 📱 Mobile Experience

### Snapshot Page on Mobile:
```
┌─────────────────────────┐
│ 📊 Platform Analytics   │
│ Performance metrics...  │
│ [Tap to scroll]         │
└─────────────────────────┘

┌─────────────────────────┐
│ Last sync: 45m ago      │
│ [Sync All Now]          │
└─────────────────────────┘

[Full Width Card 1]
┌─────────────────────────┐
│ 📸 INSTAGRAM            │
│ ✓ Connected             │
│ 45.2K Followers         │
│ 8.3% Engagement         │
│ [VIEW DETAILS]          │
└─────────────────────────┘

[Full Width Card 2]
┌─────────────────────────┐
│ 🎵 SPOTIFY              │
│ ✓ Connected             │
│ 123K Listeners          │
│ 2.1M Streams            │
│ [VIEW DETAILS]          │
└─────────────────────────┘

[Full Width Card 3 - continues scrolling]
```

### Detail Page on Mobile:
```
┌─────────────────────────┐
│ [← BACK] Instagram      │
│ Analytics [SYNC]        │
└─────────────────────────┘

[Full Width Profile Card]
┌─────────────────────────┐
│ [Pic] @artistname       │
│ Bio...                  │
│ 45.2K Followers         │
└─────────────────────────┘

[Full Width Metrics - Stack Vertically]
┌─────────────────────────┐
│ Followers This Month    │
│ 📊 1.2K (+3.8%)         │
└─────────────────────────┘

┌─────────────────────────┐
│ Engagement Rate         │
│ ❤️ 8.3% (+0.5%)        │
└─────────────────────────┘

[Charts take full width]
[Table scrolls horizontally if needed]
```

---

## 🔄 Data Sync Indicator

### States:
```
Not Connected:
┌─────────────────┐
│ ⛔ Not Connected│
│ Connect Account │
└─────────────────┘

Connected, Has Data:
┌──────────────────────────┐
│ ✓ Connected              │
│ Last sync: 2 hours ago   │
│ [Sync Now Button]        │
└──────────────────────────┘

Syncing:
┌──────────────────────────┐
│ 🔄 Syncing...            │
│ [Disabled Sync Button]   │
│ Fetching latest data...  │
└──────────────────────────┘

Error:
┌──────────────────────────┐
│ ⚠️ Sync Failed            │
│ Last successful: 2h ago  │
│ [Retry Button]           │
└──────────────────────────┘
```

---

## 📊 Chart Types by Platform

### Instagram:
- Line chart: Follower growth over time
- Bar chart: Daily engagement (likes, comments, shares)
- Table: Top posts with engagement metrics

### Spotify:
- Line chart: Streaming trends
- Area chart: Monthly listeners
- Table: Top tracks with stream counts

### YouTube:
- Line chart: View counts over time
- Area chart: Subscriber growth
- Bar chart: Traffic sources breakdown

### TikTok:
- Line chart: Follower growth
- Bar chart: Video views/likes/shares
- Table: Top trending sounds

### Apple Music:
- Dual axis: Plays (line) + Sales (bar)
- Bar chart: Chart positions over time
- Table: Top tracks with revenue

---

## 🚀 Next Screen to Build

After current session:
1. Chart components using Recharts
2. Add to all detail pages
3. Connect to real API data

Priority: **Spotify → Instagram → YouTube → TikTok → Apple Music**

