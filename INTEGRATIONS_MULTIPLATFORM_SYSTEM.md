# Multi-Platform Integrations System

## Overview

The integrations page has been refactored to display **ALL platforms** with real connection status instead of placeholder data. Each platform now shows whether it's connected or disconnected, with actual profile data displayed when connected.

## Current Implementation

### Platforms Supported

**Social Media Platforms (6):**
1. ✅ Instagram - Real OAuth implementation (working)
2. ✅ Spotify - Real OAuth integration (existing)
3. ⬜ YouTube - Placeholder (ready for real implementation)
4. ⬜ Facebook - Placeholder (ready for real implementation)
5. ⬜ TikTok - Placeholder (ready for real implementation)
6. ⬜ Apple Music - Placeholder (ready for real implementation)

**Email Providers (2):**
- ⬜ SendGrid - Placeholder
- ⬜ Postmark - Placeholder

**SMS Providers (2):**
- ⬜ Twilio - Placeholder
- ⬜ TextMagic - Placeholder

## Architecture

### Frontend Component: `src/components/integrations.tsx`

#### State Management

```typescript
const [connectionStatuses, setConnectionStatuses] = useState<Record<string, any>>({});
const [loadingStatuses, setLoadingStatuses] = useState<Set<string>>(new Set());
```

- **connectionStatuses**: Maps platform ID to connection data
- **loadingStatuses**: Tracks which platforms are currently connecting/disconnecting

#### Data Fetching

```typescript
useEffect(() => {
  const fetchConnectionStatuses = async () => {
    const userId = "current-user-id"; // TODO: Get from auth context
    const response = await fetch(`/api/integrations?userId=${userId}`);
    if (response.ok) {
      const integrations = await response.json();
      // Map to connectionStatuses
    }
  };
  fetchConnectionStatuses();
}, []);
```

**Endpoint:** `GET /api/integrations?userId={userId}`
- Returns all active connections for the user
- Used to populate connection status on page load

#### Helper Functions

```typescript
const isConnected = (platformId: string): boolean => {
  return connectionStatuses[platformId]?.connected ?? false;
};

const getConnectionData = (platformId: string) => {
  return connectionStatuses[platformId]?.data;
};

const handleConnect = (integrationId: string) => {
  setSelectedIntegration(integrationId);
  setOauthDialogOpen(true);
};

const handleDisconnect = async (platformId: string) => {
  // DELETE /api/integrations/{platformId}/{userId}
};
```

### Display States

#### Connected State

Shows:
- ✅ "Connected" badge (green)
- Platform profile data:
  - Account name/username
  - Followers count (if available)
  - Connection date
- "Disconnect" button (red, with confirmation)

#### Disconnected State

Shows:
- ⏱ "Disconnected" badge (gray)
- Feature list (bulleted)
- "Connect [Platform]" button

#### Loading State

Shows:
- Loader2 spinner animation
- "Connecting..." or "Disconnecting..." text
- Button disabled

### Platform Cards

All platforms rendered with consistent structure:

```tsx
<Card>
  <CardContent>
    {/* Platform Icon + Name */}
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Icon className="w-5 h-5" />
        <div>
          <div className="font-medium">{platform.name}</div>
          <div className="text-sm text-muted-foreground">
            {platform.description}
          </div>
        </div>
      </div>
      {/* Status Badge */}
      {connected ? "Connected" : "Disconnected"}
    </div>

    {/* Connection-specific Data */}
    {connected ? <ConnectedData /> : <Features />}

    {/* Action Button */}
    <Button>
      {connected ? "Disconnect" : "Connect"}
    </Button>
  </CardContent>
</Card>
```

## API Integration

### Backend Endpoints Used

**GET /api/integrations?userId={userId}**
- Returns all connected integrations for a user
- Response structure:
  ```json
  [
    {
      "platformId": "instagram",
      "userId": "user123",
      "username": "@artistname",
      "followers": 15000,
      "connectedAt": "2024-01-15T10:30:00Z"
    }
  ]
  ```

**DELETE /api/integrations/{platformId}/{userId}**
- Disconnects a platform from user account
- Returns success/error response

### Status Calculation

Status is determined by checking if platform ID exists in `connectionStatuses`:

```typescript
if (connectionStatuses[platformId]) {
  // Display: Connected state
} else {
  // Display: Disconnected state
}
```

## Feature Implementation Plan

### Phase 1: Multi-Platform Display ✅ COMPLETE
- [x] Refactored integrations.tsx to show all platforms
- [x] Real connection status from API
- [x] Connected/Disconnected UI states
- [x] Loading states for connect/disconnect actions
- [x] Profile data display for connected accounts

### Phase 2: Real OAuth Integrations (Next)

**YouTube OAuth**
- Requires: Google OAuth credentials
- Scope: youtube.readonly, youtube.analytics.readonly
- Data fields: channel name, subscribers, video count

**TikTok OAuth**
- Requires: TikTok API credentials
- Scope: user.info.basic, video.list
- Data fields: username, followers, video count

**Facebook OAuth**
- Requires: Facebook App credentials
- Scope: pages_read_engagement, pages_show_list
- Data fields: page name, followers, page type

**Apple Music**
- Requires: Apple Music API token
- Data fields: artist name, streams, sales

### Phase 3: Email Provider Integration
- SendGrid API integration
- Postmark API integration
- Domain verification status

### Phase 4: SMS Provider Integration
- Twilio API integration
- TextMagic API integration
- Phone number verification

## Usage Flow

### For Connected Platforms

1. Platform shows as "Connected"
2. User sees their profile data (followers, connection date, etc.)
3. User can click "Disconnect" to remove connection
4. On disconnect:
   - Shows confirmation dialog
   - Calls DELETE endpoint
   - Removes from connectionStatuses
   - UI updates to show disconnected state

### For Disconnected Platforms

1. Platform shows as "Disconnected"
2. User sees available features list
3. User clicks "Connect [Platform]"
4. OAuth dialog opens (if OAuth platform)
5. User redirected to OAuth provider
6. After auth, callback handler saves connection
7. Connection appears in connectionStatuses
8. UI updates to show connected state

## Code Quality

**Type Safety:**
- All state variables properly typed
- Platform configuration arrays typed
- API responses validated

**Error Handling:**
- Try-catch blocks for API calls
- Error states logged to console
- Graceful fallbacks for missing data

**Performance:**
- useEffect cleanup patterns
- Minimal re-renders
- Efficient state updates
- Loading states to prevent duplicate requests

**User Experience:**
- Clear visual feedback (loading spinners)
- Disabled buttons during loading
- Confirmation for destructive actions
- Feature lists for disconnected platforms

## Testing Checklist

- [ ] Page loads and fetches connection statuses
- [ ] Instagram card shows real connection status
- [ ] Spotify card shows real connection status
- [ ] Other platforms show "Disconnected" state
- [ ] Connect button opens OAuth dialog
- [ ] Disconnect button shows confirmation
- [ ] Loading states animate correctly
- [ ] Feature lists display for disconnected platforms
- [ ] Connected account data displays correctly
- [ ] Error states handle gracefully

## Environment Setup

### TODO: Auth Context Integration

Currently using hardcoded `userId`:
```typescript
const userId = "current-user-id"; // TODO: Get from auth context
```

Should be replaced with:
```typescript
import { useAuth } from "@/contexts/auth-context";
const { user } = useAuth();
const userId = user?.id;
```

### TODO: OAuth Endpoint Configuration

For each platform OAuth implementation, configure:
1. Backend OAuth route
2. Frontend callback handler
3. API endpoints for connection management
4. Database model for storing credentials

## File References

- **Frontend Component:** `src/components/integrations.tsx` (618 lines)
- **Instagram Connection:** `src/components/instagram-connection.tsx` (real example)
- **API Routes:** `backend/src/routes/integrations.routes.ts`
- **Database Model:** `backend/src/models/instagram-connection.ts`

## Next Steps

1. **Immediate:** Replace hardcoded userId with auth context integration
2. **Week 1:** Implement YouTube OAuth following Instagram pattern
3. **Week 1-2:** Implement TikTok and Facebook OAuth
4. **Week 2-3:** Add email and SMS provider integrations
5. **Week 3:** Set up automatic token refresh for all platforms
