# Phase 4: A/B Testing Framework - Requirements & Design

## Overview
Phase 4 implements a comprehensive A/B testing system for email campaigns, allowing users to test different variations of emails (subject lines, send times, content) and track which performs better.

---

## Phase 4.1: A/B Testing Framework (Primary)

### Core Concept
Users can create multiple variations of a campaign and automatically split the audience to test different versions, then analyze which variant performs better.

### Test Types Supported

#### 1. Subject Line Testing
- Test 2-4 different subject lines
- Same body, sender, send time
- Random split audience
- Measure: open rate, click rate

#### 2. Send Time Testing
- Send same campaign at different times
- Same content across all variants
- Test optimal send times
- Measure: delivery time, open latency

#### 3. Content Testing
- Different email bodies with same subject
- Different calls-to-action
- Different layouts
- Measure: click rate, conversion rate

#### 4. Comprehensive Testing
- Combine subject + send time + content variations
- Full factorial testing
- Most complex but most informative

### Data Model

```typescript
ABTest {
  _id: ObjectId
  campaignId: ObjectId (ref: Campaign)
  name: string
  testType: 'subject' | 'time' | 'content' | 'comprehensive'
  status: 'draft' | 'running' | 'completed' | 'paused'
  
  variants: [{
    _id: ObjectId
    name: string (e.g., "Variant A", "Variant B")
    subject?: string
    bodyHtml?: string
    sendTime?: Date
    audience: number (how many to send to)
    sent: number
    delivered: number
    opened: number
    clicked: number
    bounced: number
    unsubscribed: number
  }]
  
  settings: {
    splitType: 'even' | 'custom' | 'adaptive'
    confidenceLevel: number (90, 95, 99)
    minimumSampleSize: number
    testDuration: 'hours' | 'days' | 'weeks'
    autoOptimize: boolean
  }
  
  winner?: {
    variantId: ObjectId
    metric: string (openRate, clickRate, etc)
    confidence: number (0-100)
    improvement: number (percentage)
  }
  
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
}
```

### Backend Endpoints (Phase 4.1)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/ab-tests` | POST | Create new A/B test |
| `/ab-tests` | GET | List all tests (paginated) |
| `/ab-tests/:id` | GET | Get test details |
| `/ab-tests/:id` | PATCH | Update test settings |
| `/ab-tests/:id/start` | POST | Start running test |
| `/ab-tests/:id/pause` | POST | Pause running test |
| `/ab-tests/:id/results` | GET | Get detailed results |
| `/ab-tests/:id/winner` | POST | Declare winner and apply |
| `/ab-tests/:id` | DELETE | Delete draft test |

### Frontend Components (Phase 4.1)

#### 1. AB Test Builder Modal (5-step)
- **Step 1: Test Type Selection**
  - Subject line testing
  - Send time testing
  - Content testing
  - Comprehensive testing
  
- **Step 2: Variant Configuration**
  - Create variants (2-4)
  - Edit subject/body/time per variant
  - Set audience split percentages
  
- **Step 3: Settings**
  - Confidence level (90%, 95%, 99%)
  - Minimum sample size
  - Test duration
  - Auto-optimize toggle
  
- **Step 4: Audience Selection**
  - Select segment
  - Review recipient count
  - Set total test size
  
- **Step 5: Review & Start**
  - Preview all variants
  - Review settings
  - Start test

#### 2. AB Test Results Dashboard
- Test status and timeline
- Variant performance cards
  - Metrics: sent, delivered, opened, clicked
  - Rates: open rate, click rate
  - Progress bars
  
- Comparison chart
  - Bar chart comparing key metrics
  - Statistical significance indicator
  
- Winner announcement
  - Declared winner
  - Confidence level
  - Performance improvement
  - Apply winner button

#### 3. AB Tests List
- List of all tests
- Status indicators (running, completed, paused, draft)
- Quick metrics (variants, winner)
- Actions menu (view, edit, delete, pause/resume)

#### 4. Campaign Integration
- "Create A/B Test" option in campaign creation
- "Run A/B Test" action in campaign list
- A/B test results in campaign analytics

### User Workflows

#### Creating an A/B Test
1. Campaign created and selected for testing
2. Choose test type
3. Create 2-4 variants with variations
4. Configure test settings
5. Select audience and split size
6. Review and start test

#### Running a Test
1. Campaign variants sent to audience splits
2. Metrics tracked for each variant
3. Real-time results dashboard updates
4. Statistical significance calculated
5. Winner determination at completion

#### Applying Winner
1. View test results
2. Declare winner or pause test
3. Apply winner settings to main campaign
4. Send to remaining audience (optional)

---

## Implementation Plan

### Step 1: Backend Setup (2-3 hours)
- [ ] Create ABTest Mongoose model
- [ ] Create API routes for CRUD operations
- [ ] Implement statistical significance calculation
- [ ] Add variant performance tracking
- [ ] Create test result aggregation logic
- [ ] Build winner determination algorithm

### Step 2: Frontend - Builder (2-3 hours)
- [ ] Create AB test builder modal (5 steps)
- [ ] Variant editor component
- [ ] Settings configuration component
- [ ] Audience selection integration
- [ ] Preview and start workflow

### Step 3: Frontend - Dashboard (2 hours)
- [ ] Results display component
- [ ] Comparison charts
- [ ] Variant performance cards
- [ ] Winner announcement
- [ ] Apply winner functionality

### Step 4: Frontend - Integration (1-2 hours)
- [ ] Add to campaign creation workflow
- [ ] Add to campaigns list dropdown
- [ ] Integrate with campaign analytics
- [ ] Show A/B test badge on campaigns

### Step 5: Testing & Documentation (1 hour)
- [ ] Manual testing of workflows
- [ ] API endpoint verification
- [ ] Documentation and cleanup
- [ ] Build verification

**Total Estimated Time:** 8-11 hours

---

## Metrics & Calculations

### Statistical Significance
```
Confidence Level 95%: need 95% certainty winner is better
- Sample size calculation based on:
  - Baseline conversion rate
  - Minimum detectable effect (MDE)
  - Confidence level (90%, 95%, 99%)
  
Formula: Z-test two-proportion test
- null hypothesis: variant A = variant B
- alternative: variant A ≠ variant B
```

### Performance Metrics
```
For each variant:
- Open Rate = (Opened / Delivered) × 100
- Click Rate = (Clicked / Opened) × 100
- Bounce Rate = (Bounced / Sent) × 100
- Unsubscribe Rate = (Unsubscribed / Delivered) × 100

Improvement = ((Variant_B - Variant_A) / Variant_A) × 100
```

### Winner Selection
```
Criteria (in order):
1. Statistical significance achieved?
2. Highest open rate (primary metric)
3. Highest click rate (secondary metric)
4. Highest engagement (combined score)

If tied, use earliest variant to converge
```

---

## Data Flow

```
Campaign Created
    ↓
Select "Create A/B Test"
    ↓
Choose Test Type → Create Variants → Configure Settings → Select Audience
    ↓
Start Test
    ↓
Send Variants to Audience Splits
    ↓
Track Metrics for Each Variant
    ↓
Calculate Statistics & Significance
    ↓
Results Dashboard Updates (Real-time)
    ↓
Test Completes or User Declares Winner
    ↓
Winner Announced & Applied
    ↓
Optional: Send Winner to Remaining Audience
```

---

## Success Criteria

✅ A/B test creation and variant configuration
✅ Statistical significance calculation working
✅ Real-time metrics tracking
✅ Results dashboard displaying correctly
✅ Winner determination accurate
✅ Campaign integration seamless
✅ UI/UX intuitive and polished
✅ Zero TypeScript errors
✅ Build passing
✅ Comprehensive documentation

---

## Future Enhancements (Phase 4.2+)

- **Adaptive Testing:** Dynamic sample reallocation based on early results
- **Multi-armed Bandits:** Advanced algorithm for optimal variant selection
- **Scheduled Tests:** Queue tests for future execution
- **Test Templates:** Pre-built test configurations
- **Performance Predictions:** ML-based prediction of test outcomes
- **Integration:** Connect with email service providers (SendGrid, Mailgun)
- **Advanced Analysis:** Cohort analysis, user behavior tracking
- **Segmented Results:** Results broken down by audience segment

---

**Phase 4.1 Status:** Starting implementation
**Estimated Completion:** 8-11 hours
**Target Date:** November 6-7, 2025
