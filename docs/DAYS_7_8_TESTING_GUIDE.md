# Days 7-8 Frontend Integration - Testing Guide

## Backend Connectivity Checklist

### Prerequisites
- Backend running on port 4002
- PostgreSQL running
- All manager API endpoints working
- All dashboard API endpoints working

### API Client Tests

#### 1. Test API Client Library
```bash
# Verify API client types are correct
grep -r "import.*api.*from.*lib/api" src/

# Test API response interceptors work
# Navigate to any page that calls api.*
```

#### 2. Test Manager Endpoints
```bash
# Test create artist
curl -X POST http://localhost:4002/api/manager/artists \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "stageName": "Test Artist",
    "email": "test@example.com",
    "genres": ["Hip-Hop"],
    "region": "US-CA"
  }'

# Test list artists
curl -X GET http://localhost:4002/api/manager/artists \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test get artist
curl -X GET http://localhost:4002/api/manager/artists/{artistId} \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### 3. Test Dashboard Endpoints
```bash
# Test leaderboard (public)
curl http://localhost:4002/api/dashboard/leaderboard?limit=10

# Test trending (public)
curl http://localhost:4002/api/dashboard/trending?limit=10

# Test discovery (public)
curl http://localhost:4002/api/dashboard/discover?genre=Hip-Hop&limit=10

# Test artist search (public)
curl http://localhost:4002/api/dashboard/artists/search?q=test&limit=10

# Test manager dashboard (authenticated)
curl -X GET http://localhost:4002/api/dashboard/manager \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Frontend Testing

### Authentication Flow

#### 1. Test Login Page
- [ ] Navigate to `/login`
- [ ] Enter valid credentials
- [ ] Verify token is stored in localStorage
- [ ] Verify user is redirected to dashboard
- [ ] Verify `useAuth()` hook returns authenticated user

#### 2. Test Signup Page
- [ ] Navigate to `/signup`
- [ ] Fill in registration form
- [ ] Verify account is created
- [ ] Verify auto-login after signup
- [ ] Verify redirect to dashboard

#### 3. Test Protected Routes
- [ ] Navigate to `/manager` without auth
- [ ] Verify redirect to login
- [ ] Login and return to `/manager`
- [ ] Verify dashboard loads

#### 4. Test Logout
- [ ] Click logout button on manager dashboard
- [ ] Verify token is cleared from localStorage
- [ ] Verify user is redirected to login
- [ ] Verify `useAuth()` returns null user

### Manager Dashboard

#### 1. Test Overview Cards
```
- [ ] Total Artists card displays count
- [ ] Total Followers displays aggregated followers
- [ ] Avg Engagement shows correct percentage
- [ ] Top Artist displays highest leaderboard score
```

#### 2. Test Status Distribution
```
- [ ] Active, Pending, Inactive, Rejected counts match
- [ ] Colors correspond to status
- [ ] All statuses sum to total artists
```

#### 3. Test Artist List Tab
```
- [ ] Artists load from API
- [ ] Artist name and email display
- [ ] Status badge shows correct color
- [ ] "Add Artist" button is clickable
- [ ] Pagination works (if implemented)
```

#### 4. Test Navigation
```
- [ ] Campaigns tab shows content
- [ ] Integrations tab shows platform options
- [ ] Content tab shows release/event management
- [ ] Settings button navigates to settings
- [ ] Logout button works
```

### Discovery Page

#### 1. Test Leaderboard Tab
```
- [ ] Leaderboard data loads
- [ ] Rank displays 1, 2, 3...
- [ ] Artist names display
- [ ] Genres show as badges
- [ ] Metric selector (Score/Followers/Engagement) works
- [ ] Clicking artist navigates to profile
```

#### 2. Test Trending Tab
```
- [ ] Trending data loads
- [ ] Trend percentage shows with badge
- [ ] Genres display
- [ ] Region displays
- [ ] Clicking artist navigates to profile
```

#### 3. Test Genre Tab
- [ ] Genre selector displays all genres
- [ ] Genre selection filters artists
- [ ] Artists in genre display
- [ ] Genres of artist display correctly

#### 4. Test Search
```
- [ ] Type in search box
- [ ] Search results display
- [ ] Results show relevant artists
- [ ] Clear button works
- [ ] Clicking result navigates to profile
```

### Artist Profile Page

#### 1. Test Profile Load
```
- [ ] Profile data loads correctly
- [ ] Artist name displays
- [ ] Verified badge shows (if applicable)
- [ ] Bio displays
- [ ] Genres display as badges
- [ ] Region displays
```

#### 2. Test Statistics
```
- [ ] Total Followers displays
- [ ] Engagement % displays
- [ ] Leaderboard score displays
- [ ] Numbers are formatted correctly
```

#### 3. Test Integrations
```
- [ ] Connected platforms display
- [ ] Spotify shows followers if connected
- [ ] Instagram shows handle and followers
- [ ] YouTube shows subscriber count
- [ ] Visit/Follow buttons display
```

#### 4. Test Sidebar
```
- [ ] Status badge displays
- [ ] Email displays
- [ ] Send Message button available
- [ ] Member Since date displays
```

#### 5. Test Manager Actions (if logged in)
```
- [ ] "Add to Roster" button visible
- [ ] "Create Campaign" button visible
- [ ] Buttons are functional
```

#### 6. Test Navigation
```
- [ ] Back button works
- [ ] Share button works
- [ ] Message button works
- [ ] More menu works
```

## Performance Testing

### API Response Times
```
Target: <500ms for API calls

Measure:
- [ ] Leaderboard load: ____ ms
- [ ] Trending load: ____ ms
- [ ] Discovery load: ____ ms
- [ ] Search load: ____ ms
- [ ] Profile load: ____ ms
- [ ] Manager dashboard: ____ ms
```

### Caching Validation
```
- [ ] First leaderboard call takes ~10ms
- [ ] Second leaderboard call takes <1ms (cached)
- [ ] Cache hit rate > 90%
```

## Error Handling

### Test Error Scenarios
```
- [ ] Invalid token shows "Unauthorized" error
- [ ] Non-existent artist shows "Not found" error
- [ ] Network error shows error message
- [ ] Invalid query params handled gracefully
- [ ] Empty results show "No results" message
```

## Integration Testing Scenarios

### Scenario 1: Complete User Journey
1. [ ] Start at login page
2. [ ] Sign up with new account
3. [ ] Get redirected to dashboard
4. [ ] View overview cards
5. [ ] View artist list
6. [ ] Navigate to discovery
7. [ ] View trending artists
8. [ ] Search for artist
9. [ ] Click on artist
10. [ ] View profile
11. [ ] Go back to discovery
12. [ ] Logout

### Scenario 2: Manager Operations
1. [ ] Login as manager
2. [ ] View dashboard overview
3. [ ] Check artist count
4. [ ] View artist list
5. [ ] Click on artist in list
6. [ ] View artist profile
7. [ ] Use back button to return
8. [ ] Check status distribution

### Scenario 3: Public Discovery
1. [ ] No login required
2. [ ] View leaderboard
3. [ ] Filter by metric
4. [ ] View trending
5. [ ] Filter by genre
6. [ ] Search for artist
7. [ ] View artist profiles
8. [ ] No manager-specific UI visible

## Accessibility Testing

```
- [ ] Keyboard navigation works
- [ ] Tab order is logical
- [ ] All buttons have accessible labels
- [ ] Color contrast meets WCAG AA
- [ ] Images have alt text
- [ ] Forms have labels
```

## Browser Compatibility

```
- [ ] Chrome/Chromium (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)
```

## Responsive Design

```
- [ ] Desktop (1920px): All content visible
- [ ] Tablet (768px): Layout adapts correctly
- [ ] Mobile (375px): Touch targets are adequate
- [ ] Images scale properly
- [ ] Text is readable
```

## Test Results Template

```
Test Date: _______________
Tester: _______________
Backend Status: _______________

AUTHENTICATION
- Login: [ ] Pass [ ] Fail
- Signup: [ ] Pass [ ] Fail
- Logout: [ ] Pass [ ] Fail
- Protected Routes: [ ] Pass [ ] Fail

MANAGER DASHBOARD
- Overview Cards: [ ] Pass [ ] Fail
- Artist List: [ ] Pass [ ] Fail
- Navigation: [ ] Pass [ ] Fail

DISCOVERY
- Leaderboard: [ ] Pass [ ] Fail
- Trending: [ ] Pass [ ] Fail
- Genre Discovery: [ ] Pass [ ] Fail
- Search: [ ] Pass [ ] Fail

PROFILES
- Profile Load: [ ] Pass [ ] Fail
- Integrations: [ ] Pass [ ] Fail
- Statistics: [ ] Pass [ ] Fail
- Navigation: [ ] Pass [ ] Fail

PERFORMANCE
- API Response: [ ] Pass [ ] Fail (avg: ___ ms)
- Caching: [ ] Pass [ ] Fail

ERROR HANDLING
- Error Display: [ ] Pass [ ] Fail
- Edge Cases: [ ] Pass [ ] Fail

OVERALL: [ ] PASS [ ] FAIL

Notes:
_________________________________
_________________________________
```

## Quick Manual Test Steps

### 5-Minute Quick Test
1. Start backend: `docker restart wreckshop-backend`
2. Start frontend: `npm run frontend:dev`
3. Navigate to http://localhost:5176
4. Click "Discover" → view leaderboard
5. Search for an artist
6. Click on artist to view profile
7. Go back to discover
8. Click "Login" → enter credentials
9. View manager dashboard
10. Logout

### Full Test Suite (30 minutes)
- [ ] Run through all authentication tests
- [ ] Test all dashboard tabs
- [ ] Test discovery filters and search
- [ ] Test profile loading
- [ ] Verify error handling
- [ ] Check performance metrics
- [ ] Test on mobile viewport

## Known Issues & Workarounds

### Issue 1: CORS Errors
**Symptom**: API calls fail with CORS error
**Solution**: Verify backend CORS_ORIGIN in .env

### Issue 2: Token Expiration
**Symptom**: User gets logged out unexpectedly
**Solution**: Implement token refresh in auth context

### Issue 3: Slow API Response
**Symptom**: API calls take >1000ms
**Solution**: Check backend database performance, verify indexes

## Deployment Checklist

- [ ] Frontend builds without errors
- [ ] Backend runs without errors
- [ ] All environment variables set
- [ ] Database seeded with test data
- [ ] Docker containers running
- [ ] CORS properly configured
- [ ] Authentication working
- [ ] API endpoints responding
- [ ] Caching working
- [ ] No console errors
