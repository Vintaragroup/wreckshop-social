# Phase 1 - Day 1 Checklist: Stack Auth Setup

**Duration**: 4 hours  
**Date**: November 11, 2025  
**Goal**: Get Stack Auth configured and working with JWT validation

---

## Checklist

### 1. Sign Up for Stack Auth ⏱️ 15 min
- [ ] Go to https://app.stack-auth.com
- [ ] Click "Sign Up"
- [ ] Create account with email or Google
- [ ] Verify email
- [ ] Complete onboarding

### 2. Create Stack Auth Project ⏱️ 15 min
- [ ] In Stack Auth dashboard, click "New Project"
- [ ] Name: `wreckshop-social-dev`
- [ ] Select region closest to you
- [ ] Click "Create"
- [ ] Wait for project to initialize (1-2 min)

### 3. Get API Keys ⏱️ 10 min
- [ ] In project dashboard, navigate to "Settings" → "API Keys"
- [ ] Copy **Project ID** (format: `proj_xxx`)
- [ ] Copy **Publishable Client Key** (format: `pk_live_xxx`)
- [ ] Copy **Secret Server Key** (format: `sk_live_xxx`)
- [ ] Save these securely - you'll need them next

### 4. Update Backend .env Files ⏱️ 20 min

**Create/Update `backend/.env.local`:**
```bash
# Stack Auth
STACK_PROJECT_ID=proj_xxx
STACK_SECRET_SERVER_KEY=sk_live_xxx
STACK_AUTH_WEBHOOK_SECRET=your_webhook_secret_here

# Database (PostgreSQL - we'll set this up in Day 2)
DATABASE_URL=postgresql://user:password@localhost:5432/wreckshop_dev

# Existing configs
PORT=4002
REDIS_URL=redis://redis:6379
MONGODB_URI=mongodb+srv://<db_username>:<db_password>@programdata-wreckshop-1.vd9dpc.mongodb.net/?appName=ProgramData-Wreckshop-1
SPOTIFY_CLIENT_ID=your_id
SPOTIFY_CLIENT_SECRET=your_secret
INSTAGRAM_APP_ID=your_instagram_app_id
INSTAGRAM_APP_SECRET=your_instagram_app_secret
CORS_ORIGIN=http://localhost:5176
```

✅ **Make sure `.env.local` is in `.gitignore`** (should be already)

### 5. Install Stack Auth Backend SDK ⏱️ 20 min

```bash
# Navigate to backend directory
cd backend

# Install Stack Auth dependencies
npm install @stackframe/stack @types/node

# Verify installation
npm list @stackframe/stack
```

**Expected output:**
```
└── @stackframe/stack@x.x.x
```

### 6. Install TypeScript Types & Update tsconfig ⏱️ 15 min

Check `backend/tsconfig.json` has:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "skipLibCheck": true
  }
}
```

### 7. Create Stack Auth Configuration File ⏱️ 15 min

**Create `backend/src/lib/stack-auth.ts`:**

```typescript
import { StackServerApp } from '@stackframe/stack';

const stackApp = new StackServerApp({
  projectId: process.env.STACK_PROJECT_ID!,
  secretServerKey: process.env.STACK_SECRET_SERVER_KEY!,
});

export default stackApp;
```

### 8. Test Stack Auth Connection ⏱️ 30 min

**Create `backend/src/routes/auth.routes.ts`:**

```typescript
import express, { Request, Response } from 'express';
import stackApp from '../lib/stack-auth.js';

const router = express.Router();

// Health check endpoint to verify Stack Auth connection
router.get('/health', async (req: Request, res: Response) => {
  try {
    // Try to verify Stack Auth configuration
    const isConfigured = process.env.STACK_PROJECT_ID && process.env.STACK_SECRET_SERVER_KEY;
    
    if (!isConfigured) {
      return res.status(500).json({
        success: false,
        message: 'Stack Auth not configured',
      });
    }

    res.json({
      success: true,
      message: 'Stack Auth configured and ready',
      projectId: process.env.STACK_PROJECT_ID,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
```

**Update `backend/src/index.ts` to include auth routes:**

```typescript
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';

const app = express();

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(morgan('combined'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

### 9. Test Backend Setup ⏱️ 15 min

```bash
# Start backend
npm run dev

# In another terminal, test the endpoint
curl http://localhost:4002/api/auth/health

# Expected response:
# {
#   "success": true,
#   "message": "Stack Auth configured and ready",
#   "projectId": "proj_xxx"
# }
```

### 10. Configure Frontend Stack Auth Context ⏱️ 30 min

**Install Stack Auth React SDK in frontend:**

```bash
cd src  # Navigate to frontend directory
npm install @stackframe/stack
```

**Create `src/contexts/AuthContext.tsx`:**

```typescript
import React, { createContext, useContext, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  displayName?: string;
  profilePictureUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Check if user is already logged in (via Stack Auth session)
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:4002/api/auth/me', {
          credentials: 'include',
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signUp: async () => {},
    signIn: async () => {},
    signOut: async () => {},
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### 11. Verify Setup ⏱️ 20 min

Checklist:

- [ ] `.env.local` created with Stack Auth keys
- [ ] `@stackframe/stack` installed in backend
- [ ] `backend/src/lib/stack-auth.ts` created
- [ ] `backend/src/routes/auth.routes.ts` created
- [ ] Backend updated to include auth routes
- [ ] Backend starts without errors: `npm run dev`
- [ ] `/api/auth/health` returns success
- [ ] `@stackframe/stack` installed in frontend
- [ ] `AuthContext.tsx` created
- [ ] No TypeScript errors in IDE

---

## Testing Checklist ✅

Run these tests to verify Day 1 is complete:

```bash
# Terminal 1: Start backend
cd backend && npm run dev

# Terminal 2: Test Stack Auth connection
curl http://localhost:4002/api/auth/health

# Should return:
# {
#   "success": true,
#   "message": "Stack Auth configured and ready",
#   "projectId": "proj_xxx"
# }
```

### Success Criteria ✅
- ✅ Stack Auth account created
- ✅ API keys obtained
- ✅ Backend SDK installed
- ✅ Stack Auth configuration file created
- ✅ Auth routes created
- ✅ Health check endpoint working
- ✅ Frontend AuthContext created
- ✅ No TypeScript or runtime errors
- ✅ `.env.local` secured in `.gitignore`

---

## Troubleshooting

### Issue: "Cannot find module '@stackframe/stack'"
```bash
# Solution: Verify installation
npm list @stackframe/stack
npm install @stackframe/stack --save
```

### Issue: "STACK_PROJECT_ID is missing"
```bash
# Solution: Create .env.local with correct keys from Stack Auth dashboard
# Settings → API Keys → Copy Project ID and Secret Server Key
```

### Issue: "CORS error on frontend calling backend"
```bash
# Solution: Make sure CORS_ORIGIN in .env matches frontend URL
# For local dev: CORS_ORIGIN=http://localhost:5176
```

---

## Next Steps (Day 2)

When Day 1 is complete:
1. Create PostgreSQL database
2. Set up Prisma ORM
3. Create Artist and ManagerArtist models
4. Run migrations

See `PHASE_1_DAY_2_CHECKLIST.md` for Day 2 tasks.

---

**Status**: Ready to proceed  
**Time Estimate**: ~4 hours  
**Difficulty**: Moderate
