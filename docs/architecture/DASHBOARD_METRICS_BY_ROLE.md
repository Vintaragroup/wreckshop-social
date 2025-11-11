# Dashboard Metrics by Role

**Document Version**: 1.0  
**Date**: November 11, 2025  
**Status**: FOUNDATION DEFINITION

---

## Dashboard Overview

Each user role has a customized dashboard showing only the metrics and tools most relevant to their needs and goals.

---

## ARTIST DASHBOARD 👨‍🎤

### Purpose
Give artists a **snapshot of their personal brand performance** and **fan engagement** so they can make quick decisions about content, timing, and strategy.

### Top-Level Metrics (Above the Fold)

#### 1. **Today's Engagement** (Real-time Card)
```
┌─────────────────────────────────┐
│ TODAY'S ENGAGEMENT              │
├─────────────────────────────────┤
│                                 │
│ ▲ Streams:      1,247 (+12%)    │
│ ▲ Followers:    +34 new         │
│ ◀ Playlist Adds:  2              │
│ ✉️  Email Opens:  847 (42%)     │
│                                 │
└─────────────────────────────────┘
```

**Data Source**: Real-time from Spotify, Instagram, YouTube, campaign analytics
**Update Frequency**: Every 5 minutes
**Actions**: Click to see hourly breakdown

---

#### 2. **Fan Engagement by Platform** (Multi-Platform Card)
```
┌───────────────────────────────────┐
│ PLATFORM ENGAGEMENT (7-day avg)   │
├───────────────────────────────────┤
│                                   │
│ Spotify:      12,400 streams      │
│ YouTube:       3,200 views        │
│ Instagram:     4,500 interactions │
│ TikTok:        8,900 interactions │
│ Email:         2,100 opens        │
│ SMS:            420 reads         │
│                                   │
└───────────────────────────────────┘
```

**Data Source**: Platform APIs + email/SMS analytics
**Aggregation**: 7-day rolling average
**Actions**: Click platform to see details

---

#### 3. **Recent Releases & Playlist Placements** (Content Card)
```
┌────────────────────────────────┐
│ RECENT RELEASES & PLAYLISTS    │
├────────────────────────────────┤
│                                │
│ "Summer Heat" (Single)         │
│ Released: 5 days ago           │
│ Status: 🔥 Trending            │
│ Spotify: 2,347 playlists       │
│ Streams: 47K total             │
│                                │
│ [View Analytics] [Promote]     │
│                                │
└────────────────────────────────┘
```

**Data Source**: Content DB + Spotify API
**Update Frequency**: Real-time
**Actions**: View full analytics, create promotion campaign

---

### Mid-Level Metrics (Second Section)

#### 4. **7-Day Performance Chart** (Line Chart)
```
Streams by Day
├─ Streams (orange)
├─ Followers (purple)
├─ Email Opens (green)
└─ Playlist Adds (blue)

[Shows 7 lines trending over time]
```

**Data Source**: Daily aggregates from all platforms
**Metrics**: Streams, followers, engagement, playlist adds
**Actions**: Hover for daily breakdown, download data

---

#### 5. **Fan Demographics** (Map & Segments)
```
┌─────────────────────────────────┐
│ WHERE YOUR FANS ARE             │
├─────────────────────────────────┤
│                                 │
│ US:       45% (↑12%)            │
│ UK:       18% (stable)          │
│ Canada:   12% (↓2%)             │
│ Other:    25%                   │
│                                 │
│ [Map View] [Segment Details]   │
│                                 │
└─────────────────────────────────┘
```

**Data Source**: Geolocation service + platform data
**Use Case**: Target campaigns to high-engagement regions
**Actions**: View detailed demographics, create geo-targeted campaign

---

#### 6. **Ticket Sales (Events)** (If applicable)
```
┌─────────────────────────────────┐
│ UPCOMING EVENTS & TICKETS       │
├─────────────────────────────────┤
│                                 │
│ LA Concert - Dec 15             │
│ Status: On sale                 │
│ Sold: 320/500 (64%)             │
│ Revenue: $24,000                │
│                                 │
│ [Promote] [View Details]        │
│                                 │
└─────────────────────────────────┘
```

**Data Source**: Ticketing integration
**Real-time**: Sales velocity, revenue
**Actions**: Promote event, adjust pricing

---

#### 7. **Active Campaigns** (Campaigns Card)
```
┌──────────────────────────────────┐
│ ACTIVE CAMPAIGNS                 │
├──────────────────────────────────┤
│                                  │
│ Email - "New Album Promo"        │
│ Status: Running (2 days)         │
│ Sent: 15,000 | Opens: 6,200 (41%)│
│ Clicks: 1,840 | CTR: 12.3%       │
│                                  │
│ SMS - "Flash Sale"               │
│ Status: Completed                │
│ Sent: 5,000 | Reads: 2,850       │
│ Conversions: 847 (16.9%)         │
│                                  │
│ [New Campaign]                   │
│                                  │
└──────────────────────────────────┘
```

**Data Source**: Campaign DB + delivery analytics
**Status**: Live, scheduled, completed
**Actions**: Create new, pause, or view detailed metrics

---

### Bottom-Level Metrics (Detailed Views)

#### 8. **Collaborations & Messages**
```
┌─────────────────────────────────┐
│ MESSAGES & COLLABS              │
├─────────────────────────────────┤
│                                 │
│ 3 new messages from artists:    │
│ • Artist A: "Want to collab?"   │
│ • Producer B: "Interested?"     │
│ • Artist C: Replied to comment  │
│                                 │
│ [View All] [Message Archive]    │
│                                 │
└─────────────────────────────────┘
```

**Data Source**: Messaging system + collaboration requests
**Notifications**: Unread count badge
**Actions**: Reply, accept collab, view archive

---

#### 9. **Leaderboard Ranking** (Gamified, Opt-in)
```
┌─────────────────────────────────┐
│ YOUR RANKING (Hip-Hop)          │
├─────────────────────────────────┤
│                                 │
│ Your Rank: #247 (↑ 5 from last) │
│ Streams This Month: 342,100     │
│                                 │
│ Top Artists:                    │
│ 🥇 Artist X: 2.4M streams       │
│ 🥈 Artist Y: 1.9M streams       │
│ 🥉 Artist Z: 1.7M streams       │
│ ... (244 more below)            │
│                                 │
│ [View Full Leaderboard]         │
│                                 │
└─────────────────────────────────┘
```

**Data Source**: Analytics aggregation (opt-in only)
**Update Frequency**: Daily
**Actions**: View full leaderboard, find similar artists to collab with

---

#### 10. **Alerts & Recommendations**
```
┌──────────────────────────────────┐
│ ALERTS & RECOMMENDATIONS         │
├──────────────────────────────────┤
│                                  │
│ 🎉 NEW - Playlist pitch from:    │
│    Spotify Indie Hip-Hop (50K)   │
│    [Review] [Ignore]             │
│                                  │
│ 💡 SUGGESTION - Based on your    │
│    fans' location, they're in LA  │
│    (30% of followers).           │
│    Consider event there!         │
│    [Plan Event] [Dismiss]        │
│                                  │
│ ⚠️  FYI - Your email list had    │
│    200 bounces (1.2%)            │
│    [Clean List] [Learn More]     │
│                                  │
└──────────────────────────────────┘
```

**Data Source**: System AI, platform notifications, data quality
**Frequency**: Real-time
**Actions**: Act on alerts, dismiss, track history

---

## PRODUCER/MANAGER DASHBOARD 🎙️

### Purpose
Give producers a **consolidated view of their entire artist roster** and **business metrics** so they can manage multiple artists efficiently and identify high-performers.

### Top-Level Metrics (Above the Fold)

#### 1. **Roster Overview** (Artists Grid)
```
┌─────────────────────────────────┐
│ YOUR ROSTER (12 Artists)        │
├─────────────────────────────────┤
│                                 │
│ ┌──────┐  ┌──────┐  ┌──────┐  │
│ │Artist│  │Artist│  │Artist│  │
│ │  A   │  │  B   │  │  C   │  │
│ │ 🟢   │  │ 🟡   │  │ 🔴   │  │
│ │ Trend│  │Stable│  │ Down │  │
│ │+15%  │  │ -2%  │  │ -8%  │  │
│ └──────┘  └──────┘  └──────┘  │
│                                 │
│ [+ Add Artist] [Manage Team]    │
│                                 │
└─────────────────────────────────┘
```

**Data Source**: ManagerArtist relationships + analytics
**Status Indicator**: 🟢 Growing, 🟡 Stable, 🔴 Declining
**Actions**: Click artist to manage, add new artist, invite collaborator

---

#### 2. **Roster Performance Summary** (Aggregate Card)
```
┌─────────────────────────────────┐
│ ROSTER AGGREGATE (All Artists)  │
├─────────────────────────────────┤
│                                 │
│ Total Streams (Month): 4.2M     │
│ Total Followers: 287K           │
│ Avg. Engagement: 8.2%           │
│ Total Revenue: $34,200          │
│                                 │
│ Top Performer: Artist A         │
│ Biggest Growth: Artist E (+42%) │
│                                 │
└─────────────────────────────────┘
```

**Data Source**: Aggregated analytics across all managed artists
**Period**: Customizable (week, month, quarter)
**Actions**: Compare artists, drill into details

---

#### 3. **Campaign ROI Dashboard** (Chart)
```
┌─────────────────────────────────┐
│ CAMPAIGN PERFORMANCE (Month)    │
├─────────────────────────────────┤
│                                 │
│ Email Campaigns:                │
│   Sent: 45,000                  │
│   Opens: 18,900 (42%)           │
│   Conversions: 3,245            │
│   ROI: 6.4x                     │
│                                 │
│ SMS Campaigns:                  │
│   Sent: 12,000                  │
│   Reads: 7,200 (60%)            │
│   Conversions: 1,428            │
│   ROI: 5.2x                     │
│                                 │
│ [Create Campaign] [View Details]│
│                                 │
└─────────────────────────────────┘
```

**Data Source**: Campaign DB + conversion tracking
**Calculation**: Revenue / Cost
**Actions**: Create new campaign, optimize existing

---

#### 4. **Platform Health Status**
```
┌──────────────────────────────────┐
│ PLATFORM CONNECTION STATUS       │
├──────────────────────────────────┤
│                                  │
│ Spotify:      ✅ Connected       │
│ Instagram:    ✅ Connected       │
│ YouTube:      ✅ Connected       │
│ TikTok:       ⚠️  Throttled      │
│ Facebook:     ❌ Disconnected    │
│ Apple Music:  ✅ Connected       │
│                                  │
│ Last Sync: 2 min ago             │
│ [Sync Now] [Manage Integrations] │
│                                  │
└──────────────────────────────────┘
```

**Data Source**: Integration status monitoring
**Real-time**: Connection health, last sync time
**Actions**: Reconnect, sync manually, view logs

---

### Mid-Level Metrics (Second Section)

#### 5. **Artist-Specific Cards** (Tabs/Accordion)
```
Select Artist: [Artist A ▼]

┌─────────────────────────────────┐
│ Artist A Performance             │
├─────────────────────────────────┤
│                                 │
│ Streams (7d):    124,300        │
│ Followers:       +450 new       │
│ Top Release:     "Song X"       │
│ Avg. Engagement: 7.8%           │
│                                 │
│ Your Permissions:               │
│ ✓ View Analytics                │
│ ✓ Create Campaigns              │
│ ✓ Post to Social                │
│ ✓ Edit Campaigns                │
│                                 │
│ [View Full Dashboard] [Edit]    │
│                                 │
└─────────────────────────────────┘
```

**Switching**: Quick dropdown to switch between managed artists
**Permissions**: Shows what this manager can do for this artist
**Actions**: View artist dashboard, edit permissions

---

#### 6. **Revenue Tracking** (Financial Card)
```
┌──────────────────────────────────┐
│ REVENUE SUMMARY (Month)          │
├──────────────────────────────────┤
│                                  │
│ Streaming Royalties: $12,340     │
│ Ticket Sales:       $8,950       │
│ Merch Sales:        $4,200       │
│ Campaign Revenue:   $8,710       │
│ ─────────────────────────        │
│ TOTAL:              $34,200      │
│                                  │
│ Your Commission: $6,840 (20%)    │
│ Artist Payout: $27,360 (80%)     │
│                                  │
│ [View Details] [Payout History]  │
│                                  │
└──────────────────────────────────┘
```

**Data Source**: Revenue aggregation system
**Period**: Monthly, quarterly, yearly views
**Actions**: View payout history, tax documents, forecasting

---

#### 7. **Upcoming Actions Needed** (Alert Card)
```
┌──────────────────────────────────┐
│ PENDING ACTIONS                  │
├──────────────────────────────────┤
│                                  │
│ ⏰ TODAY:                         │
│   - Approve "Artist A" campaign  │
│   - Review new release for B     │
│                                  │
│ 📅 THIS WEEK:                    │
│   - Planning meeting with Artist │
│     C (Wed 3pm)                  │
│                                  │
│ 🎵 NEW:                          │
│   - 3 artists waiting to sync    │
│   - 2 campaigns pending review   │
│   - 1 integration needs refresh  │
│                                  │
│ [View All] [Calendar]            │
│                                  │
└──────────────────────────────────┘
```

**Data Source**: Tasks, campaigns, integrations DB
**Priority**: Today, this week, upcoming
**Actions**: Click to take action, mark complete

---

### Bottom-Level Metrics (Detailed Views)

#### 8. **Team & Collaboration**
```
┌──────────────────────────────────┐
│ YOUR TEAM                        │
├──────────────────────────────────┤
│                                  │
│ Manager A (You) - Owner          │
│ Manager B - Collaborator         │
│   (Can view analytics)           │
│                                  │
│ Artists Pending Approval:        │
│ • Artist X - Invited 2 days ago  │
│ • Artist Y - Invited 5 days ago  │
│                                  │
│ [+ Invite Manager] [+ Add Artist]│
│ [Manage Permissions]             │
│                                  │
└──────────────────────────────────┘
```

**Data Source**: ManagerArtist, user relationships
**Visibility**: Your team only
**Actions**: Add collaborators, manage permissions, remove team members

---

#### 9. **Compliance & Verification**
```
┌──────────────────────────────────┐
│ COMPLIANCE STATUS                │
├──────────────────────────────────┤
│                                  │
│ 10DLC Registration: ✅ Verified  │
│ SMS Compliance:     ✅ Current   │
│ Artist Agreements:  ✅ Current   │
│ Data Retention:     ✅ Compliant │
│ GDPR Compliance:    ✅ Complete  │
│                                  │
│ Last Audit: Nov 1, 2025          │
│ [View Details] [Download Reports]│
│                                  │
└──────────────────────────────────┘
```

**Data Source**: Compliance DB
**Real-time**: Status tracking
**Actions**: View documentation, generate reports

---

#### 10. **Competitive Insights** (Optional)
```
┌──────────────────────────────────┐
│ COMPETITIVE ANALYSIS             │
├──────────────────────────────────┤
│                                  │
│ Your Avg. Engagement: 8.2%       │
│ Genre Average:       7.1%        │
│ Top Performers:      12-15%      │
│                                  │
│ Your Artists vs Competitors:     │
│ Artist A: Above average (+15%)   │
│ Artist B: At average (7.2%)      │
│ Artist C: Below average (-2.1%)  │
│                                  │
│ [View Full Benchmarking]         │
│                                  │
└──────────────────────────────────┘
```

**Data Source**: Aggregate analytics with opt-in artists
**Use Case**: Identify underperformers, set goals
**Actions**: View detailed comparison, plan strategy

---

## ADMIN DASHBOARD 🔒

### Purpose
Give admins a **complete platform overview** including user management, system health, and business metrics.

### Key Metrics
```
┌──────────────────────────────────┐
│ PLATFORM OVERVIEW                │
├──────────────────────────────────┤
│                                  │
│ Total Users: 5,342               │
│ • Artists: 4,128 (77%)           │
│ • Producers: 897 (17%)           │
│ • Admins: 12 (0.2%)              │
│                                  │
│ Pending Verifications: 23        │
│ Active Campaigns: 847            │
│ Total Revenue: $1.2M (Month)     │
│ System Uptime: 99.94%            │
│                                  │
└──────────────────────────────────┘
```

**See ADMIN_DASHBOARD_SPECIFICATION.md** for full details (future document)

---

## Dashboard Data Sources & Refresh Rates

| Metric | Source | Refresh | Real-time |
|--------|--------|---------|-----------|
| Streams | Spotify API | 5 min | ✅ |
| Followers | Platform APIs | 5 min | ✅ |
| Email Opens | Email provider | Real-time | ✅ |
| SMS Reads | SMS provider | Real-time | ✅ |
| Playlist Adds | Spotify API | 1 hour | ⚠️ |
| Revenue | Aggregation | Daily | ⚠️ |
| Leaderboard | Nightly batch | 1x daily | ⚠️ |
| Demographics | Aggregation | 1x daily | ⚠️ |

---

## Dashboard Configuration

### Artist Dashboard Config
```json
{
  "role": "ARTIST",
  "sections": [
    {
      "title": "Today's Engagement",
      "cards": ["streams_today", "followers_today", "playlist_adds"],
      "order": 1,
      "collapsible": false
    },
    {
      "title": "Platform Engagement",
      "cards": ["platform_breakdown"],
      "order": 2,
      "collapsible": false
    },
    {
      "title": "Recent Releases",
      "cards": ["recent_releases"],
      "order": 3,
      "collapsible": false
    }
    // ... more sections
  ]
}
```

### Producer Dashboard Config
```json
{
  "role": "PRODUCER",
  "sections": [
    {
      "title": "Your Roster",
      "cards": ["roster_grid"],
      "order": 1,
      "collapsible": false
    },
    {
      "title": "Performance Summary",
      "cards": ["roster_aggregate"],
      "order": 2,
      "collapsible": false
    }
    // ... more sections
  ]
}
```

---

## Related Documentation
- See `USER_ROLES_AND_PERMISSIONS.md` for role definitions
- See `DATA_OWNERSHIP_AND_ISOLATION.md` for data access rules
- See `ROLE_BASED_API_ACCESS.md` for API endpoints

---

**Next Step**: Begin implementing dashboard API and React components
