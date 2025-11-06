# Phase 3: Email Campaigns - Requirements & Planning

**Target Duration:** 6-8 hours  
**Start Date:** November 6, 2025  
**Status:** In Planning

---

## Phase Overview

Phase 3 transforms the email campaign management UI from mock data into a **fully functional email marketing orchestration system**. This phase focuses on:

1. **Email Campaign Builder** - Drag-and-drop template editor with preview
2. **Campaign Scheduling** - Date/time selection with timezone support
3. **Recipient Management** - Segment-based audience targeting (integrates Phase 2)
4. **Send Simulation** - Pre-send analytics and preview
5. **Campaign Analytics** - Real-time tracking and performance metrics

---

## Feature Breakdown

### Feature 1: Email Template Builder

**User Story:**
> As a marketer, I want to create professional email templates with subject line, from name/email, and HTML body so I can maintain brand consistency.

**Requirements:**
- [ ] Template editor with WYSIWYG HTML editing
- [ ] Subject line input with placeholder text
- [ ] From Name/Email fields with validation
- [ ] Save template functionality
- [ ] Template preview panel (desktop + mobile)
- [ ] Reusable template library
- [ ] Template duplication
- [ ] Template deletion with confirmation

**UI Components Needed:**
- `EmailTemplateEditor` - Main editor component
- `EmailPreview` - Live preview panel
- `TemplateLibrary` - List of saved templates

**API Endpoints:**
```
POST   /api/email-templates           # Create template
GET    /api/email-templates           # List templates
GET    /api/email-templates/:id       # Get single template
PATCH  /api/email-templates/:id       # Update template
DELETE /api/email-templates/:id       # Delete template
```

**Data Model:**
```typescript
{
  _id: ObjectId
  userId: string
  name: string
  subject: string
  fromName: string
  fromEmail: string
  bodyHtml: string
  bodyText: string
  preview: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}
```

---

### Feature 2: Campaign Builder & Scheduling

**User Story:**
> As a marketer, I want to compose an email campaign with a template, select target audience from segments, and schedule sending so I can reach the right people at the right time.

**Requirements:**
- [ ] Campaign name and description
- [ ] Template selection dropdown (integrates Feature 1)
- [ ] Segment selection (integrates Phase 2)
- [ ] Recipient preview (show sample of matching users)
- [ ] Schedule selection: Immediate / Scheduled / Recurring
- [ ] Date and time picker with timezone support
- [ ] Campaign status tracking: Draft → Scheduled → Running → Completed
- [ ] Estimated recipient count
- [ ] Send time optimization (AI-powered for Phase 4)

**UI Components Needed:**
- `EmailCampaignBuilder` - Main builder flow (already exists, needs enhancement)
- `ScheduleSelector` - Date/time/timezone picker
- `RecipientPreview` - Sample users from segment
- `CampaignReview` - Pre-send confirmation screen

**API Endpoints:**
```
POST   /api/campaigns                 # Create campaign (already exists)
GET    /api/campaigns                 # List campaigns (already exists)
GET    /api/campaigns/:id             # Get campaign (already exists)
PATCH  /api/campaigns/:id             # Update campaign (already exists)
DELETE /api/campaigns/:id             # Delete campaign
POST   /api/campaigns/:id/validate    # Pre-send validation
```

**Campaign Document Enhancement:**
```typescript
{
  _id: ObjectId
  userId: string
  name: string
  description: string
  type: 'email' | 'sms' | 'journey'
  status: 'draft' | 'scheduled' | 'running' | 'paused' | 'completed'
  channels: {
    email: {
      templateId: ObjectId
      subject: string
      fromName: string
      fromEmail: string
      bodyHtml: string
    }
  }
  audience: {
    segmentId: ObjectId
    recipientCount: number
  }
  schedule: {
    startAt: Date
    endAt?: Date
    timezone: string
    recurring?: {
      frequency: 'daily' | 'weekly' | 'monthly'
      interval: number
    }
  }
  metrics: {
    sent: number
    delivered: number
    opened: number
    clicked: number
    bounced: number
    unsubscribed: number
  }
  createdAt: Date
  updatedAt: Date
  launchedAt?: Date
  completedAt?: Date
}
```

---

### Feature 3: Pre-Send Simulation & Analytics

**User Story:**
> As a marketer, I want to preview how my campaign looks and see estimated engagement before sending so I can optimize messaging.

**Requirements:**
- [ ] Email preview (HTML rendering)
- [ ] Personalization preview (e.g., {{firstName}} replacement)
- [ ] Estimated open/click rates based on audience
- [ ] Spam score calculation
- [ ] Compliance check (CAN-SPAM, GDPR)
- [ ] Send time optimization suggestion
- [ ] Cost estimation
- [ ] Final confirmation with one-click send

**UI Components Needed:**
- `CampaignPreview` - Full email preview
- `CampaignMetrics` - Estimated performance
- `ComplianceCheck` - Regulatory compliance status
- `SendConfirmation` - Final review before send

**API Endpoints:**
```
POST   /api/campaigns/:id/preview      # Generate preview
POST   /api/campaigns/:id/simulate     # Run simulation
POST   /api/campaigns/:id/compliance   # Check compliance
POST   /api/campaigns/:id/send         # Send campaign
POST   /api/campaigns/:id/pause        # Pause campaign
POST   /api/campaigns/:id/resume       # Resume campaign
```

---

### Feature 4: Campaign Analytics & Tracking

**User Story:**
> As a marketer, I want to see real-time and historical performance metrics for each campaign so I can measure ROI and optimize future campaigns.

**Requirements:**
- [ ] Real-time analytics dashboard
- [ ] Metrics: Sent, Delivered, Open Rate, Click Rate, Bounce Rate
- [ ] Time-series charts (opens/clicks over time)
- [ ] Link click tracking (which links clicked most)
- [ ] Recipient engagement timeline
- [ ] A/B test comparison (Phase 4 feature, placeholder ready)
- [ ] Export analytics as CSV/PDF
- [ ] Performance comparison to past campaigns

**UI Components Needed:**
- `CampaignAnalytics` - Main analytics view
- `MetricsCard` - Individual metric display
- `EngagementChart` - Time-series visualization
- `LinkPerformance` - Click-through analysis
- `RecipientTimeline` - Individual recipient journey

**API Endpoints:**
```
GET    /api/campaigns/:id/analytics    # Get campaign metrics
GET    /api/campaigns/:id/events       # Get engagement events
GET    /api/campaigns/:id/links        # Get link performance
GET    /api/campaigns/:id/recipients   # Get recipient details
```

---

### Feature 5: Campaign List Management

**User Story:**
> As a marketer, I want to see all my campaigns in one view with filtering and sorting so I can organize and manage campaigns efficiently.

**Requirements:**
- [ ] List view with all campaigns (already partially exists)
- [ ] Status filtering: All / Draft / Scheduled / Running / Completed
- [ ] Date range filtering
- [ ] Search by campaign name
- [ ] Sort by: Name, Created Date, Send Date, Performance
- [ ] Bulk actions: Archive, Delete, Export
- [ ] Quick actions: Edit, Clone, View Analytics, Pause/Resume
- [ ] Performance badges (top performers, underperformers)

**Enhancements to Existing Components:**
- `CampaignsEmail` component enhancement
- `campaigns.tsx` hub integration
- Add filter controls
- Add sort selector
- Add bulk action menu

---

## Integration Points

### With Phase 2 (Segments)
```
Segment Selection
    ↓
GET /api/segments/:id/users  (Phase 2)
    ↓
Recipient List
    ↓
Estimated Count
    ↓
Pre-send Preview
```

### With Phase 1 (Journeys)
- Journeys can include email campaign steps
- Campaign analytics feed into journey metrics
- Segment targeting reuses journey audience logic

### New Architecture
```
Email Template (Feature 1)
    ↓
Email Campaign Builder (Feature 2)
    ↓
Segment Selection (Phase 2 integration)
    ↓
Pre-send Simulation (Feature 3)
    ↓
Send Campaign → Analytics (Feature 4)
    ↓
Campaign List Management (Feature 5)
```

---

## Implementation Roadmap

### Step 1: Email Template System (1.5 hours)
- [ ] Create `email-template.model.ts`
- [ ] Create `templates.routes.ts` with CRUD endpoints
- [ ] Create `EmailTemplateEditor.tsx` component
- [ ] Create `EmailPreview.tsx` component
- [ ] Create `TemplateLibrary.tsx` list component
- [ ] Connect to backend, verify CRUD operations
- [ ] Test template save/load/delete

### Step 2: Campaign Builder Enhancement (2 hours)
- [ ] Enhance campaign schema in backend
- [ ] Update `CreateEmailCampaignModal.tsx`
- [ ] Add template selection
- [ ] Add segment selection
- [ ] Add schedule selector
- [ ] Create recipient preview
- [ ] Integrate pre-send validation

### Step 3: Pre-Send Simulation (1.5 hours)
- [ ] Create preview rendering logic
- [ ] Implement compliance checker
- [ ] Add estimated metrics calculation
- [ ] Create send confirmation modal
- [ ] Implement send endpoint logic

### Step 4: Campaign Analytics (2 hours)
- [ ] Create analytics routes
- [ ] Create analytics dashboard
- [ ] Add metrics cards
- [ ] Add engagement charts
- [ ] Add link tracking
- [ ] Create export functionality

### Step 5: List Management & Polish (1 hour)
- [ ] Enhance campaigns list UI
- [ ] Add filtering/sorting
- [ ] Add bulk actions
- [ ] Final testing and bug fixes

---

## API Contract Examples

### Create Email Template
```typescript
POST /api/email-templates
Content-Type: application/json

{
  name: "Album Release Announcement",
  subject: "🎵 {{artistName}} - New Album Out Now",
  fromName: "My Music Label",
  fromEmail: "noreply@mymusiclabel.com",
  bodyHtml: "<html>...</html>",
  tags: ["album", "release"]
}

Response (201):
{
  data: {
    _id: "507f1f77bcf86cd799439011",
    userId: "user123",
    name: "Album Release Announcement",
    subject: "🎵 {{artistName}} - New Album Out Now",
    fromName: "My Music Label",
    fromEmail: "noreply@mymusiclabel.com",
    bodyHtml: "<html>...</html>",
    tags: ["album", "release"],
    createdAt: "2025-11-06T10:30:00Z"
  }
}
```

### Create Email Campaign
```typescript
POST /api/campaigns
Content-Type: application/json

{
  name: "Holiday Single Promo",
  description: "Special promotion for holiday single release",
  type: "email",
  channels: {
    email: {
      templateId: "507f1f77bcf86cd799439011",
      subject: "🎵 Travis Scott - Holiday Special",
      fromName: "Travis Scott",
      fromEmail: "hello@traviscott.com"
    }
  },
  audience: {
    segmentId: "507f1f77bcf86cd799439012",
    recipientCount: 45230
  },
  schedule: {
    startAt: "2025-12-10T09:00:00Z",
    timezone: "America/Chicago"
  }
}

Response (201):
{
  data: {
    _id: "507f1f77bcf86cd799439013",
    name: "Holiday Single Promo",
    status: "draft",
    // ... full campaign object
  }
}
```

### Get Campaign Analytics
```typescript
GET /api/campaigns/507f1f77bcf86cd799439013/analytics

Response (200):
{
  data: {
    campaignId: "507f1f77bcf86cd799439013",
    metrics: {
      sent: 45230,
      delivered: 44891,
      opened: 18356,
      clicked: 3671,
      bounced: 339,
      unsubscribed: 45
    },
    rates: {
      deliveryRate: 0.993,
      openRate: 0.408,
      clickRate: 0.0817,
      bounceRate: 0.0075,
      unsubscribeRate: 0.001
    },
    revenue: 12450,
    timeline: [
      { timestamp: "2025-12-10T09:00:00Z", opens: 156, clicks: 32 },
      // ... 30+ data points
    ]
  }
}
```

---

## Database Schema Changes

### New Collections

#### email_templates
```javascript
db.createCollection("email_templates", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "name", "subject", "bodyHtml"],
      properties: {
        _id: { bsonType: "objectId" },
        userId: { bsonType: "string" },
        name: { bsonType: "string" },
        subject: { bsonType: "string" },
        fromName: { bsonType: "string" },
        fromEmail: { bsonType: "string", pattern: "^[^@]+@[^@]+$" },
        bodyHtml: { bsonType: "string" },
        bodyText: { bsonType: "string" },
        tags: { bsonType: "array", items: { bsonType: "string" } },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
})

// Indexes
db.email_templates.createIndex({ userId: 1, createdAt: -1 })
db.email_templates.createIndex({ name: "text", subject: "text" })
```

#### campaign_events
```javascript
db.createCollection("campaign_events", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["campaignId", "recipientId", "eventType"],
      properties: {
        _id: { bsonType: "objectId" },
        campaignId: { bsonType: "objectId" },
        recipientId: { bsonType: "objectId" },
        eventType: { enum: ["sent", "delivered", "opened", "clicked", "bounced", "unsubscribed"] },
        linkId: { bsonType: "string" },
        timestamp: { bsonType: "date" },
        metadata: { bsonType: "object" }
      }
    }
  }
})

// Indexes for real-time querying
db.campaign_events.createIndex({ campaignId: 1, eventType: 1, timestamp: -1 })
db.campaign_events.createIndex({ recipientId: 1, campaignId: 1 })
```

### Modified Collections

#### campaigns (Enhancement)
- Add `channels.email` with template integration
- Add `audience.segmentId` reference
- Add `schedule.timezone`, `recurring` fields
- Add `metrics` sub-document
- Add `launchedAt`, `completedAt` fields

---

## Testing Strategy

### Unit Tests
- Email template validation
- Schedule date/time validation
- Compliance check logic
- Analytics calculation

### Integration Tests
- Template CRUD operations
- Campaign creation with segment integration
- Pre-send simulation
- Analytics data aggregation
- Recipient list generation

### E2E Tests
- Create template → Create campaign → Send → View analytics
- Segment selection in campaign
- Real-time metrics update

---

## Known Considerations

### Email Delivery
- Currently using mock data for emails (no actual SMTP)
- Phase 4 will integrate real email service (SendGrid/AWS SES)
- Compliance features (GDPR, CAN-SPAM) are UI/DB-only in Phase 3

### Performance
- Campaign analytics queries may need pagination for large campaigns
- Real-time updates require WebSocket or polling (Phase 4)
- CSV export needs streaming for very large datasets

### Security
- Email templates sanitize HTML to prevent XSS
- Campaign data requires user authorization
- API rate limiting recommended for send endpoints

---

## Success Criteria

✅ Phase 3 is complete when:
1. All 5 features fully implemented
2. 0 TypeScript errors
3. Build passes in <5s
4. All CRUD operations working with real backend
5. Segment integration working end-to-end
6. Pre-send preview rendering correctly
7. Analytics dashboard showing mock data
8. All components follow Phase 1/2 patterns
9. Unit test coverage >80%
10. No console errors in browser DevTools

---

## Next Steps (Phase 4 - Future)

- Real SMTP integration (SendGrid/AWS SES)
- Real-time WebSocket updates for analytics
- A/B testing framework
- AI-powered send time optimization
- Advanced segmentation with ML
- Multi-language template support
- GDPR/compliance automation
- Revenue attribution system

---

## Team Notes

**Development Approach:**
- Follow established patterns from Phase 1 & 2
- Use centralized apiUrl() helper for all API calls
- Implement proper error handling with toast notifications
- Maintain TypeScript strict mode compliance
- Keep components focused and single-responsibility

**Code Review Focus Areas:**
- Backend route validation with Zod
- Frontend form validation and error handling
- API contract consistency
- Component composition and reusability
- Performance of analytics queries

---

**Status:** Ready to begin implementation  
**Estimated Completion:** November 8, 2025 (assuming 6-8 hour sprint)
