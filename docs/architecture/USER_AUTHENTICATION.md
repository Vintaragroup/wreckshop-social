# User Authentication & Onboarding Strategy

**Document Version**: 1.0  
**Date**: November 11, 2025  
**Status**: FOUNDATION DEFINITION

---

## Authentication Overview

Wreckshop Social uses a **multi-method authentication system** with **mandatory platform integration** during onboarding and **2FA security**.

---

## Authentication Methods

### Primary Methods (Signup)

#### 1. Email + Password (Recommended Default)
- **When**: Primary signup method for artists
- **Flow**: Email verification + password creation + 2FA setup
- **2FA Options**: SMS or Authenticator app
- **Security**: Password hashed (bcrypt), rate-limited login attempts
- **Use Case**: Artists who want traditional login

#### 2. Google OAuth
- **When**: Fast signup alternative
- **Flow**: Redirect to Google → Approve → Auto-populate email
- **2FA**: Inherited from Google account (or setup SMS backup)
- **Use Case**: Artists already using Google ecosystem
- **Benefit**: No password to manage

#### 3. Phone/SMS
- **When**: Mobile-first artists
- **Flow**: Phone number → SMS code → Password setup → 2FA (SMS-based)
- **Verification**: OTP sent via SMS
- **Use Case**: Artists who prefer phone-based auth
- **Limitation**: Requires valid phone number

### Secondary Methods (Linked to Account)

#### Spotify OAuth
- **When**: DURING ONBOARDING (mandatory for artist verification)
- **NOT for login**: Only for integration and artist verification
- **Flow**: Artist authenticates with Spotify → Verifies artist status → Links account
- **Verification**: Checks Spotify account type (artist vs. personal)
- **If Personal Account**: Artist must migrate to artist account or create new one

#### Instagram OAuth
- **When**: DURING ONBOARDING (if available)
- **NOT for login**: Only for integration
- **Flow**: Similar to Spotify

#### Apple ID
- **When**: Future addition if needed
- **Status**: Planned but not initial MVP

---

## Signup Flow: Artist 🎤

### Step 1: Choose Authentication Method
```
User lands on signup page
↓
Choose from:
  1. Email + Password
  2. Google OAuth
  3. Phone/SMS
```

### Step 2: Create Account
**Email + Password Path**:
```
Enter Email → Verify Email (code) → Create Password → Setup 2FA (SMS or Authenticator)
```

**Google OAuth Path**:
```
Redirect to Google → Approve → Return to app → Setup 2FA
```

**Phone/SMS Path**:
```
Enter Phone → Send OTP → Verify OTP → Create Password → Setup 2FA
```

### Step 3: Artist Onboarding
```
1. Basic Info:
   - Full Name
   - Stage Name/Artist Name
   - Email confirmation
   - Phone confirmation

2. Genre & Niche:
   - Primary Genre (required)
   - Secondary Genres (optional)
   - Sub-genres/Niche (required)
   - Similar Artists (required - at least 3)

3. Business Account Setup:
   - Artist Status (independent, label, etc.)
   - Company/Label Name (if applicable)
   - Location (country, state/region)

4. Platform Integrations (MANDATORY):
   ┌─ Spotify
   ├─ Instagram
   ├─ YouTube
   ├─ TikTok
   ├─ Facebook
   └─ Apple Music / Other
   
   For EACH platform:
   - Click "Connect"
   - OAuth redirect
   - If Spotify: Verify artist account status
   - Sync begins immediately
   - Show connection success

5. Confirmation:
   - Review all data
   - Accept terms
   - Agree to data sync
   - Create account → Dashboard
```

### Data Collected at Signup
```
User {
  email: string (verified)
  phone: string (verified)
  password: hashed string
  fullName: string
  stageName: string
  role: "ARTIST" (default)
  
  Profile {
    genre: Genre[] (required)
    niche: string[] (required)
    similarArtists: Artist[] (required, min 3)
    companyName: string (optional)
    location: Country | Region
    bio: string (optional)
  }
  
  Integrations {
    spotify: {
      accountId: string
      displayName: string
      followers: number
      connected: true
      verifiedArtistStatus: boolean
    }
    instagram: { ... }
    youtube: { ... }
    tiktok: { ... }
    ... (others)
  }
  
  Security {
    twoFactorEnabled: true
    twoFactorMethod: "SMS" | "AUTHENTICATOR"
    lastLogin: timestamp
    loginAttempts: number
  }
}
```

---

## Signup Flow: Producer/Manager 🎙️

### Step 1: Email Request
```
Producer lands on platform → Sees "Apply as Producer/Manager"
↓
Fills form:
  - Email
  - Full Name
  - Company/Management Name
  - Artist List (comma-separated, or names of artists they manage)
  - Credentials/Verification (website, portfolio, etc.)
  - Message to admin
↓
Submit request
```

### Step 2: Admin Verification
```
Admin receives request
↓
Verify:
  ✓ Artist claims are legitimate
  ✓ Producer credentials are valid
  ✓ No red flags
↓
If approved:
  → Send approval email with account creation link
  → Manager creates password
  → Manager sets 2FA
  → Account created as PRODUCER role
  
If rejected:
  → Send rejection email with reasoning
  → Suggest reapplication later
```

### Step 3: Manager Onboarding
```
1. Create Account:
   - Email verification
   - Password + 2FA setup

2. Basic Info:
   - Full Name
   - Company/Management Name
   - Phone

3. Verify Artist Roster:
   - List artists to manage
   - For each artist:
     → Generate invitation link
     → Show link to copy/share
     → Track which artists accepted

4. Platform Integrations:
   - Connect integrations for managing artist accounts
   - These are for dashboard/analytics
   - Artists' accounts remain separate

5. Complete Setup:
   - Review all data
   - Accept terms
   - Dashboard access granted
```

### Data Collected at Manager Signup
```
User {
  email: string (verified)
  phone: string (verified)
  password: hashed string
  fullName: string
  role: "PRODUCER" (after approval)
  
  Management {
    companyName: string
    website: string (optional)
    bio: string
    
    ManagedArtists {
      artist1: { 
        role: "MANAGED",
        permissions: [ ... ],
        joinedDate: timestamp,
        status: "ACTIVE"
      },
      artist2: { ... }
    }
  }
  
  Security {
    twoFactorEnabled: true
    twoFactorMethod: "SMS" | "AUTHENTICATOR"
    verificationStatus: "APPROVED" (from admin)
    verificationDate: timestamp
  }
}
```

---

## Artist Approval of Manager

### Step 1: Artist Receives Invitation
```
Artist gets email with subject: "Manager Request from [Manager Name]"
↓
Email contains:
  - Manager name
  - Company (if applicable)
  - Message from manager
  - "Approve" link
  - "Decline" link
```

### Step 2: Artist Reviews Request
```
Artist clicks "Approve" link
↓
Taken to dashboard
↓
Shown:
  - Manager info
  - Proposed permission levels
  - "This manager will have access to: [list]"
  - "Approve" or "Choose Custom Permissions" buttons
```

### Step 3: Set Permissions
```
Artist can choose:
  1. Approve all proposed permissions (default)
  2. Customize permissions:
     ☐ View Analytics
     ☐ Create Campaigns
     ☐ Edit Campaigns
     ☐ Approve Content Before Publishing
     ☐ Post to Social Media
     ☐ Edit Artist Profile
     ☐ Configure Integrations
     ☐ Full Control
  3. Decline entirely
```

### Step 4: Manager Gains Access
```
Once approved:
  → Manager appears in artist's "Team" section
  → Manager's dashboard now shows this artist
  → Manager can take permitted actions
  → Artist can revoke access anytime (Settings → Team)
```

---

## 2FA Security

### SMS-Based 2FA
```
Login flow:
  1. Enter email + password
  2. System sends 6-digit code via SMS
  3. User enters code
  4. If correct → Login
  5. If incorrect 3x → Account locked for 15 minutes
```

### Authenticator App 2FA (Optional)
```
Setup:
  1. User chooses "Authenticator app"
  2. System generates QR code
  3. User scans with Google Authenticator / Authy
  4. System gives 10 backup codes
  5. User saves codes in safe place

Login flow:
  1. Enter email + password
  2. Enter 6-digit code from app
  3. If correct → Login
  4. If incorrect 3x → Account locked for 15 minutes
```

---

## Login Flow

### Artist/Producer Login
```
User visits login page
↓
Choose:
  1. Email + Password
  2. Google OAuth
  3. Phone/SMS (if registered)
↓
For Email + Password:
  - Enter email
  - Enter password
  - Enter 2FA code (SMS or app)
  - If correct → Dashboard
  
For Google OAuth:
  - Redirect to Google
  - Google handles auth
  - Return to app
  - Enter 2FA code (SMS or app)
  - If correct → Dashboard
```

### Session Management
```
- JWT token issued on successful login
- Token valid for 24 hours
- Refresh token valid for 30 days
- "Remember me" option extends session to 7 days
- Logout clears tokens
```

---

## Critical Security Rules

### Password Requirements
- Minimum 12 characters
- At least 1 uppercase letter
- At least 1 number
- At least 1 special character
- Cannot contain username or email

### Rate Limiting
- Max 5 failed login attempts per 15 minutes → 15-minute lockout
- Max 10 failed 2FA attempts per hour → 1-hour lockout
- API rate limiting: 1000 requests per hour per user

### Data Protection
- All passwords hashed with bcrypt (salt rounds: 12)
- All API communications over HTTPS
- Tokens never sent via URL, only in secure HTTP-only cookies
- Integrations use OAuth tokens (encrypted in database)

### Breach Response
- If account compromised: User can force re-verify all integrations
- If token compromised: Can be revoked from security settings
- If integration compromised: Can be disconnected immediately

---

## Account Recovery

### Forgot Password
```
User clicks "Forgot Password"
↓
Enters email
↓
System sends password reset link (valid for 1 hour)
↓
User clicks link
↓
Creates new password
↓
Login with new password
```

### Forgot 2FA Device
```
User lost phone or access to authenticator
↓
Can use backup codes (provided at 2FA setup)
↓
Or can:
  - Verify email
  - Verify identity question
  - System sends new 2FA setup link
  - User chooses new 2FA method
```

---

## Role Transitions During Login

### Artist Login
```
Checks roles in user record
↓
If role === "ARTIST" only:
  - Dashboard: Artist view
  
If role === "ARTIST_AND_MANAGER":
  - Show role selector: "View as Artist" or "View as Manager"
  - Store selection in session
  - Load appropriate dashboard
```

### Producer/Manager Login
```
User logs in
↓
If role === "PRODUCER":
  - Dashboard: Producer view
  - Shows managed artists list
  - Can switch between artist views
```

---

## Related Documentation
- See `USER_ROLES_AND_PERMISSIONS.md` for role details
- See `DATA_OWNERSHIP_AND_ISOLATION.md` for data access after login
- See `ONBOARDING_USER_JOURNEY.md` for detailed flow diagrams

---

**Next Step**: Create DATA_OWNERSHIP_AND_ISOLATION.md for data access rules
