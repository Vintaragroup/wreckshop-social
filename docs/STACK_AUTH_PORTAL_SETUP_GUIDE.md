# Stack Auth Portal Setup Guide - Wreckshop Integration

**Purpose**: Complete walkthrough of Stack Auth dashboard configuration to integrate with Wreckshop's music platform  
**Difficulty**: Easy - 30 minutes  
**Audience**: Ryan (account admin setting up Stack Auth project)

---

## 📋 Quick Overview

Your system needs Stack Auth to handle:
1. **User Registration & Login** (email, Google, phone SMS)
2. **2-Factor Authentication** (required for all users)
3. **OAuth Connections** (Spotify, Instagram, YouTube)
4. **Session Management** (JWT tokens with auto-refresh)
5. **User Data** (name, email, profile picture)
6. **Webhooks** (trigger backend when users sign up, connect integrations, etc.)

Stack Auth handles all of this. Your job: Store artist metadata (genres, manager relationships, permissions) in PostgreSQL.

---

## 🎯 My Recommendations (Based on Your Architecture)

### 1. **Authentication Method**
- ✅ **Email + Password** (primary)
- ✅ **Google OAuth** (for convenience)
- ✅ **Phone SMS** (optional, but recommended for artist verification)
- ❌ **Magic Links** (skip - not needed for music platform)

### 2. **2FA Strategy**
- **Requirement**: Mandatory for all artists (security + credibility)
- **Options**: SMS or Authenticator app (Stack Auth provides both)
- **Time commitment**: ~3 minutes per user at signup

### 3. **OAuth Integrations to Connect**
- ✅ **Spotify** (priority #1 - core to music taste profiling)
- ✅ **Instagram** (priority #2 - artist promotion)
- ⚠️ **YouTube** (custom connector - Stack Auth doesn't provide)
- ⚠️ **TikTok** (custom connector - Stack Auth doesn't provide)

### 4. **Custom User Data (in Stack Auth)**
Don't store artist metadata in Stack Auth. Instead:
- Use Stack Auth for **authentication only** (user/email/2fa/oauth)
- Store music metadata in **PostgreSQL** (via your Artist model with `stackAuthUserId` foreign key)
- This gives you flexibility to query/segment artists by genre, manager, etc.

### 5. **Roles & Permissions**
- **Don't use Stack Auth roles** - they're generic and restrictive
- Instead: Use **PostgreSQL ManagerArtist relationship** for:
  - Who manages whom
  - What permissions (VIEW_ANALYTICS, CREATE_CAMPAIGN, etc.)
  - Status (PENDING, ACTIVE, INACTIVE)
- Your backend checks permissions via custom middleware

### 6. **User Roles**
Create these in your database, not Stack Auth:
```typescript
// Database roles (not Stack Auth)
enum UserRole {
  ARTIST = "ARTIST",
  ARTIST_AND_MANAGER = "ARTIST_AND_MANAGER",
  ADMIN = "ADMIN",
}
```

---

## 🚀 Stack Auth Portal: Step-by-Step Setup

### Step 1: Create Stack Auth Project

1. Go to https://app.stack-auth.com/projects
2. Click **"Create Project"**
3. Enter Project Name: `Wreckshop Social`
4. Select **React** as framework (matches your Vite + React setup)
5. Click **Create**

**What you'll get:**
- Project ID (UUID)
- Publishable Client Key (starts with `pck_`)
- Secret Server Key (starts with `ssk_`)

### Step 2: Save API Keys to Environment

Store these in **two places**:

**Frontend (.env.local or .env):**
```env
# src/.env.local (frontend)
VITE_STACK_PROJECT_ID=<your-project-id>
VITE_STACK_CLIENT_KEY=pck_<your-publishable-key>
VITE_STACK_API_URL=https://api.stack-auth.com
```

**Backend (.env.local):**
```env
# backend/.env.local
STACK_PROJECT_ID=<your-project-id>
STACK_SERVER_KEY=ssk_<your-secret-key>
STACK_API_URL=https://api.stack-auth.com

# For webhook validation
STACK_WEBHOOK_SECRET=<generated-in-dashboard>
```

### Step 3: Configure Authentication Methods

In Stack Auth Dashboard → **Auth Methods**:

#### Email & Password
- ✅ Enable: **Yes**
- **Email Verification**: Required (users must verify email)
- **Password Requirements**: Enforce strong passwords (built-in)

#### Social Sign-In
- ✅ **Google OAuth**: Enable
  - Provide your Google OAuth app credentials
  - Callback URL: `https://your-domain.com/auth/callback`
  - For dev: `http://localhost:5176/auth/callback`

#### Phone / SMS
- ✅ **SMS via Twilio** (optional but recommended)
  - Adds phone verification
  - Useful for artist identity verification

### Step 4: Configure 2-Factor Authentication (2FA)

In Stack Auth Dashboard → **Security → 2FA**:

- ✅ **SMS-based 2FA**: Enable
  - Uses Twilio (configure in Stack Auth)
  - Backup codes provided
  
- ✅ **TOTP (Authenticator App)**: Enable
  - Google Authenticator, Authy support
  - Backup codes provided

**Recommendation**: Make 2FA **mandatory** at signup for artists:
```javascript
// Frontend signup component
<SignUp
  requireTwoFactor={true}
  twoFactorChannels={['sms', 'totp']}
/>
```

### Step 5: Set Up OAuth Providers (Spotify + Instagram)

#### Spotify Integration

**In Spotify Dashboard** (https://developer.spotify.com/dashboard):

1. Create OAuth app for Wreckshop
2. Get **Client ID** and **Client Secret**
3. Set Redirect URI: `https://api.stack-auth.com/api/v1/auth/oauth/callback/spotify`

**In Stack Auth Dashboard → OAuth Providers → Spotify**:

1. Click **Configure**
2. Paste Spotify Client ID
3. Paste Spotify Client Secret
4. Enable: ✅ Yes
5. Set scopes:
   ```
   user-read-email
   user-read-private
   user-top-read
   playlist-read-private
   user-library-read
   ```

#### Instagram Integration

**In Meta for Developers** (https://developers.facebook.com):

1. Create app for Wreckshop
2. Set up Instagram Basic Display product
3. Get **App ID** and **App Secret**
4. Set Redirect URI: `https://api.stack-auth.com/api/v1/auth/oauth/callback/instagram`

**In Stack Auth Dashboard → OAuth Providers → Instagram**:

1. Click **Configure**
2. Paste Meta App ID
3. Paste Meta App Secret
4. Enable: ✅ Yes

### Step 6: Configure Webhooks

Webhooks trigger your backend when:
- User signs up
- User connects Spotify/Instagram
- User profile updated
- User deleted

**In Stack Auth Dashboard → Webhooks**:

1. Click **Add Webhook**
2. Set endpoint: `https://your-backend.com/webhooks/stack-auth`
   - Dev: `http://localhost:4002/webhooks/stack-auth`
3. Select events:
   ```
   ✅ user.created
   ✅ user.updated
   ✅ user.deleted
   ✅ oauth_connection.created
   ✅ oauth_connection.deleted
   ```
4. Copy **Webhook Secret** → paste into `backend/.env.local`

**Your backend webhook handler** (example):
```typescript
// backend/src/routes/webhooks/stack-auth.ts

router.post('/stack-auth', verifyWebhookSignature, async (req, res) => {
  const event = req.body;
  
  if (event.type === 'user.created') {
    // Create artist profile in PostgreSQL
    await prisma.artist.create({
      data: {
        stackAuthUserId: event.data.user_id,
        email: event.data.email,
        stageName: event.data.displayName || event.data.email.split('@')[0],
        fullName: event.data.displayName,
        profilePictureUrl: event.data.profileImageUrl,
        createdAt: new Date(),
      },
    });
  }
  
  if (event.type === 'oauth_connection.created') {
    // Update artist integrations
    const { provider, accountId, displayName } = event.data;
    // Store Spotify/Instagram metadata...
  }
  
  res.json({ success: true });
});
```

### Step 7: Production Domain Configuration

**In Stack Auth Dashboard → Settings → Domains**:

1. Add your production domain: `https://wreckshop.com`
2. Disable: `Allow all localhost callbacks for development` (once in production)
3. Save

This ensures OAuth callbacks only work from your domain (security measure).

### Step 8: Email Configuration (Optional)

**In Stack Auth Dashboard → Emails**:

By default, Stack Auth uses shared email server (emails say "Stack Auth").

For production, configure custom SMTP:
1. Set up your own SMTP (SendGrid, Mailgun, etc.)
2. Stack Auth Dashboard → Emails → Email Server
3. Switch: **Shared** → **Custom SMTP server**
4. Enter SMTP credentials

This makes emails appear from `support@wreckshop.com` instead of Stack.

---

## 🔌 Backend Integration Checklist

After portal setup, implement these in backend:

### 1. Validate Stack Auth JWTs
```typescript
// backend/src/middleware/validateToken.ts

import axios from 'axios';

export async function validateStackAuthToken(token: string) {
  try {
    const response = await axios.get(
      `${process.env.STACK_API_URL}/api/v1/auth/sessions`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Stack-Project-Id': process.env.STACK_PROJECT_ID,
          'X-Stack-Publishable-Client-Key': process.env.STACK_CLIENT_KEY,
        },
      }
    );
    return response.data.user;
  } catch (error) {
    throw new Error('Invalid token');
  }
}
```

### 2. Webhook Verification Middleware
```typescript
// backend/src/middleware/verifyWebhookSignature.ts

import crypto from 'crypto';

export function verifyWebhookSignature(req: Request, res: Response, next: NextFunction) {
  const signature = req.headers['x-stack-webhook-signature'];
  const secret = process.env.STACK_WEBHOOK_SECRET;
  
  const hash = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(req.body))
    .digest('hex');
  
  if (hash !== signature) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  next();
}
```

### 3. Create Artist on User Signup (via webhook)
```typescript
// When user.created webhook fires:
await prisma.artist.create({
  data: {
    stackAuthUserId: event.data.user_id,
    email: event.data.email,
    stageName: event.data.displayName || '',
    accountType: 'ARTIST',
  },
});
```

### 4. Store OAuth Connections (via webhook)
```typescript
// When oauth_connection.created fires for Spotify:
const { provider, accountId, displayName } = event.data;

if (provider === 'spotify') {
  await prisma.spotifyIntegration.upsert({
    where: { artistId: artistId },
    update: {
      spotifyAccountId: accountId,
      displayName: displayName,
    },
    create: {
      artistId: artistId,
      spotifyAccountId: accountId,
      displayName: displayName,
    },
  });
}
```

---

## 🎨 Frontend Integration Checklist

After portal setup, implement these in frontend:

### 1. Wrap App with Stack Auth Provider
```typescript
// src/main.tsx

import { StackProvider, StackTheme } from '@stackframe/stack';
import { stackClientApp } from './stack/client';

function App() {
  return (
    <StackProvider app={stackClientApp}>
      <StackTheme>
        <YourApp />
      </StackTheme>
    </StackProvider>
  );
}
```

### 2. Create Stack Client Config
```typescript
// src/stack/client.ts

import { StackClientApp } from '@stackframe/stack';

export const stackClientApp = new StackClientApp({
  projectId: import.meta.env.VITE_STACK_PROJECT_ID,
  publishableClientKey: import.meta.env.VITE_STACK_CLIENT_KEY,
  baseUrl: 'http://localhost:5176', // dev
  // baseUrl: 'https://wreckshop.com', // production
});
```

### 3. Replace Login/Signup Components
```typescript
// src/pages/auth/signup.tsx

import { SignUp } from '@stackframe/stack';
import { stackClientApp } from '../../stack/client';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignUp
        app={stackClientApp}
        requireTwoFactor={true}
        twoFactorChannels={['sms', 'totp']}
      />
    </div>
  );
}
```

### 4. Replace Login Component
```typescript
// src/pages/auth/login.tsx

import { SignIn } from '@stackframe/stack';
import { stackClientApp } from '../../stack/client';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignIn app={stackClientApp} />
    </div>
  );
}
```

### 5. Get Current User
```typescript
// Hook to get authenticated user
import { useUser } from '@stackframe/stack';

export function useCurrentUser() {
  const user = useUser();
  
  if (!user) return null;
  
  return {
    id: user.id,
    email: user.primaryEmail,
    name: user.displayName,
    picture: user.profileImageUrl,
  };
}
```

### 6. Add Account Settings Page
```typescript
// src/pages/settings/account.tsx

import { AccountSettings } from '@stackframe/stack';
import { stackClientApp } from '../../stack/client';

export default function SettingsPage() {
  return <AccountSettings app={stackClientApp} />;
}
```

---

## 📊 PostgreSQL Schema (Your Custom Layer)

After Stack Auth users sign up, your database stores:

```prisma
// backend/prisma/schema.prisma

model Artist {
  id String @id @default(cuid())
  
  // Links to Stack Auth user
  stackAuthUserId String @unique  // From Stack Auth user.id
  email String @unique             // From Stack Auth user.primaryEmail
  
  // Artist metadata (not in Stack Auth)
  stageName String
  fullName String?
  bio String?
  genres String[]
  niches String[]
  countryCode String?
  region String?
  
  // Account
  accountType String @default("ARTIST")
  isVerified Boolean @default(false)
  
  // Integrations (metadata only - tokens stored in Stack Auth)
  spotifyIntegration SpotifyIntegration?
  instagramIntegration InstagramIntegration?
  youtubeIntegration YoutubeIntegration?
  
  // Manager relationships
  managedArtists ManagerArtist[] @relation("ManagerArtists")
  managers ManagerArtist[] @relation("ManagedByManagers")
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model ManagerArtist {
  id String @id @default(cuid())
  
  managerId String
  manager Artist @relation("ManagerArtists", fields: [managerId], references: [id])
  
  artistId String
  artist Artist @relation("ManagedByManagers", fields: [artistId], references: [id])
  
  // Permissions
  viewAnalytics Boolean @default(false)
  createCampaign Boolean @default(false)
  editCampaign Boolean @default(false)
  deleteCampaign Boolean @default(false)
  postSocial Boolean @default(false)
  editProfile Boolean @default(false)
  configureIntegrations Boolean @default(false)
  
  status String @default("PENDING")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@unique([managerId, artistId])
}

model SpotifyIntegration {
  id String @id @default(cuid())
  
  artistId String @unique
  artist Artist @relation(fields: [artistId], references: [id], onDelete: Cascade)
  
  spotifyAccountId String @unique
  displayName String?
  followers Int @default(0)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model InstagramIntegration {
  id String @id @default(cuid())
  
  artistId String @unique
  artist Artist @relation(fields: [artistId], references: [id], onDelete: Cascade)
  
  instagramAccountId String @unique
  username String @unique
  followers Int @default(0)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// ... similar for YouTube, TikTok
```

---

## 🔄 Complete Data Flow

### User Signs Up
```
1. Frontend: User clicks "Sign Up"
2. Stack Auth UI: Collects email, password, 2FA preference
3. Stack Auth: Verifies email, stores user (encrypted password)
4. Stack Auth Webhook: Sends user.created event to your backend
5. Your Backend: Creates Artist record in PostgreSQL
   - stackAuthUserId: <from webhook>
   - email: <from webhook>
   - stageName: <from webhook or auto-generated>
6. Stack Auth: Returns JWT token to frontend
7. Frontend: Stores token, redirects to /dashboard
```

### User Connects Spotify
```
1. Frontend: User clicks "Connect Spotify"
2. Stack Auth: Redirects to Spotify OAuth
3. Spotify: User approves
4. Stack Auth: Stores token (encrypted, auto-refreshes)
5. Stack Auth Webhook: Sends oauth_connection.created
6. Your Backend: Stores Spotify metadata in PostgreSQL
7. Your Backend: Optionally fetches Spotify enrichment data
8. Frontend: Shows "Spotify connected ✅"
```

### Manager Invites Artist
```
1. Frontend: Manager enters artist email
2. Your Backend: Finds artist via email
3. Your Backend: Creates ManagerArtist record (status: PENDING)
4. Your Backend: Sends email to artist (via SendGrid/Mailgun)
5. Artist: Clicks "Approve" link in email
6. Your Backend: Updates ManagerArtist (status: ACTIVE)
7. Manager Dashboard: Now shows artist in roster
```

---

## ✅ Testing Checklist

Before going to production:

- [ ] Sign up with email + password → artist created in database
- [ ] Verify email → can login
- [ ] Enable 2FA (SMS) → receives SMS code
- [ ] Enable 2FA (TOTP) → works with Authenticator app
- [ ] Sign in with Google OAuth → works
- [ ] Connect Spotify → spotify integration created in database
- [ ] Connect Instagram → instagram integration created in database
- [ ] Manager signup → manager account created
- [ ] Manager invites artist → artist receives email
- [ ] Artist approves → permission status changes
- [ ] Dashboard loads → shows correct role/permissions
- [ ] Logout → redirects to login
- [ ] Change password → works
- [ ] Reset password → works
- [ ] Delete account → artist record cleaned up
- [ ] Webhook signature verification → rejects invalid signatures

---

## 🚨 Important Notes

### Token Storage
- ❌ Don't store Stack Auth JWT in localStorage (too long)
- ✅ Stack Auth handles this automatically in httpOnly cookies
- ✅ `useUser()` hook retrieves current user

### OAuth Token Refresh
- ✅ Stack Auth automatically refreshes expired OAuth tokens
- ✅ You get fresh tokens via Stack Auth API whenever needed
- ❌ Don't try to refresh tokens yourself

### Permission Checking
- ✅ Use Stack Auth JWT to identify user
- ✅ Check custom permissions in your PostgreSQL (ManagerArtist table)
- ❌ Don't use Stack Auth roles for artist-manager permissions

### Rate Limiting
- Stack Auth has built-in rate limiting
- Public endpoints: 1000 requests/hour
- Authenticated endpoints: 10,000 requests/hour

---

## 📞 Next Steps

1. **Today**: Create Stack Auth project, save API keys
2. **Tomorrow**: Configure OAuth (Spotify, Instagram)
3. **Day 3**: Deploy webhook handler
4. **Day 4**: Replace frontend auth with Stack Auth components
5. **Day 5**: Test complete flow end-to-end

---

## 🆘 Troubleshooting

### "Can't connect Spotify"
- Verify Spotify callback URL in Stack Auth matches Spotify app settings
- Check Spotify Client ID and Secret are correct
- Ensure Spotify scopes include `user-read-email`

### "Webhook not firing"
- Verify webhook endpoint is public (not localhost)
- Check webhook signature verification isn't rejecting
- Confirm webhook event types are selected in dashboard

### "2FA not working"
- Ensure Twilio is configured for SMS
- Check backup codes option is enabled
- Verify user has SMS delivery capability

### "User data not in database"
- Check webhook handler is processing events correctly
- Verify Prisma migration ran successfully
- Confirm Artist table exists with `stackAuthUserId` field

---

**Status**: ✅ Ready to implement  
**Effort**: 30 minutes setup + 2 hours backend integration  
**Value**: Complete auth + 2FA + OAuth management
