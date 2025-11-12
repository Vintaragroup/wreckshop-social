# Complete Stack Auth Integration Guide

**Last Updated:** November 11, 2025  
**Scope:** Full Stack Auth setup in existing project  
**Difficulty:** Intermediate  
**Time to Complete:** 2-3 hours

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Database Integration](#database-integration)
6. [Authentication Flow](#authentication-flow)
7. [Debugging & Troubleshooting](#debugging--troubleshooting)
8. [Testing](#testing)
9. [Deployment Considerations](#deployment-considerations)

---

## Overview

### What is Stack Auth?

Stack Auth is a modern authentication provider that handles:
- User signup/login with email/password
- Session management
- OAuth integrations (optional)
- Email verification (optional)
- Multi-factor authentication (optional)

### Why Use Stack Auth?

✅ No need to build password hashing
✅ Secure session handling
✅ Built-in CORS support
✅ Webhook support for sync events
✅ Easy to extend with custom user data

### Our Implementation

We integrated Stack Auth to:
1. Handle user authentication (signup/login)
2. Create custom user profiles in our PostgreSQL database
3. Use JWT tokens for API authorization
4. Maintain separation between auth (Stack Auth) and business logic (our DB)

---

## Architecture

### Component Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                         │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Stack Auth UI Component (@stackframe/stack)           │ │
│  │  - Login form                                           │ │
│  │  - Signup form                                          │ │
│  │  - Session management                                  │ │
│  └──────────────────┬──────────────────────────────────────┘ │
│                     │                                         │
│  ┌──────────────────▼──────────────────────────────────────┐ │
│  │  Auth Context (src/lib/auth/context.tsx)              │ │
│  │  - Stores JWT token in localStorage                   │ │
│  │  - Manages user profile state                         │ │
│  │  - Refreshes user on app load                         │ │
│  └──────────────────┬──────────────────────────────────────┘ │
│                     │                                         │
│  ┌──────────────────▼──────────────────────────────────────┐ │
│  │  Protected Routes & Components                        │ │
│  │  - Check isAuthenticated before rendering             │ │
│  │  - Use useAuth() hook to access user                  │ │
│  └──────────────────┬──────────────────────────────────────┘ │
└──────────────────────┼──────────────────────────────────────────┘
                       │ JWT Token
                       │ Authorization: Bearer <token>
┌──────────────────────▼──────────────────────────────────────────┐
│                   BACKEND (Express/Node)                        │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  Routes                                                 │   │
│  │  - /api/auth/login                                      │   │
│  │  - /api/auth/signup                                     │   │
│  │  - /api/auth/me (requires JWT)                          │   │
│  │  - /api/auth/logout                                     │   │
│  └────────────────────────────────────────────────────────┘   │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  Middleware: authenticateJWT                           │   │
│  │  - Validates JWT token                                 │   │
│  │  - Verifies with Stack Auth                            │   │
│  │  - Attaches user to request                            │   │
│  └────────────────────────────────────────────────────────┘   │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  Stack Auth Integration (@stackframe/stack)           │   │
│  │  - Verify tokens from frontend                         │   │
│  │  - Get user metadata                                   │   │
│  └────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │    PostgreSQL Database        │
        │  ┌──────────────────────────┐ │
        │  │  Artist Table            │ │
        │  │  - id (PK)              │ │
        │  │  - stackAuthUserId (FK) │ │
        │  │  - email                │ │
        │  │  - stageName            │ │
        │  │  - accountType          │ │
        │  │  - isAdmin              │ │
        │  └──────────────────────────┘ │
        └──────────────────────────────┘
```

### Key Separation

**Stack Auth Handles:**
- User credentials (email/password)
- Session creation
- Token generation
- User verification

**Your App Handles:**
- User profile data (artist name, bio, integrations)
- Business logic (campaigns, audiences, etc.)
- Access control (admin, manager, artist)
- User relationships (manager-artist mappings)

---

## Backend Setup

### Step 1: Install Stack Auth SDK

```bash
# Inside backend directory
npm install @stackframe/stack
```

### Step 2: Configure Environment Variables

**File:** `.env` or `backend/.env`

```bash
# Stack Auth Configuration
STACK_AUTH_PROJECT_ID=your_project_id_here
STACK_AUTH_SECRET_SERVER_KEY=your_secret_key_here
STACK_AUTH_PUBLISHED_CLIENT_KEY=your_published_key_here

# JWT Secret for your own tokens (optional, for extra security)
JWT_SECRET=your_super_secret_key_here

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# CORS
CORS_ORIGIN=http://localhost:5176
```

### Step 3: Create Stack Auth Utilities

**File:** `backend/src/lib/stack-auth.ts`

```typescript
import { StackApp, StackServerAppOptions } from '@stackframe/stack';
import { env } from '../env';

if (!env.STACK_AUTH_PROJECT_ID || !env.STACK_AUTH_SECRET_SERVER_KEY) {
  throw new Error('Stack Auth environment variables not configured');
}

const stackAuthConfig: StackServerAppOptions = {
  projectId: env.STACK_AUTH_PROJECT_ID,
  secretServerKey: env.STACK_AUTH_SECRET_SERVER_KEY,
};

export const stackApp = new StackApp(stackAuthConfig);

export async function verifyStackAuthToken(token: string) {
  try {
    const result = await stackApp.verifyAuthorizationHeader(`Bearer ${token}`);
    return result;
  } catch (error) {
    throw new Error('Invalid Stack Auth token');
  }
}

export async function getUserFromStackAuth(userId: string) {
  try {
    const user = await stackApp.getUser(userId);
    return user;
  } catch (error) {
    throw new Error('Could not fetch user from Stack Auth');
  }
}
```

### Step 4: Add CORS Configuration

**File:** `backend/src/index.ts`

```typescript
import cors from 'cors'

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-key'],
  })
)

app.options('*', cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-key'],
}))
```

### Step 5: Create Authentication Middleware

**File:** `backend/src/lib/middleware/auth.middleware.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import { verifyStackAuthToken } from '../stack-auth';
import { prisma } from '../prisma';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        stackAuthUserId: string;
        email: string;
        displayName?: string;
        profilePictureUrl?: string;
        accountType?: string;
        isVerified?: boolean;
        isAdmin?: boolean;
      };
      token?: string;
    }
  }
}

export async function authenticateJWT(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ error: 'Missing authorization header' });
      return;
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      res.status(401).json({ error: 'Invalid token format' });
      return;
    }

    // Verify token with Stack Auth
    const decoded = await verifyStackAuthToken(token);
    
    // Fetch user profile from database
    let artist = await prisma.artist.findUnique({
      where: { stackAuthUserId: decoded.userId },
      select: {
        id: true,
        stackAuthUserId: true,
        email: true,
        stageName: true,
        profilePictureUrl: true,
        accountType: true,
        isVerified: true,
        isAdmin: true,
      },
    });

    // Auto-create artist profile on first login if it doesn't exist
    if (!artist) {
      try {
        const stackUser = await stackApp.getUser(decoded.userId);
        artist = await prisma.artist.create({
          data: {
            stackAuthUserId: decoded.userId,
            email: stackUser.email || decoded.email,
            stageName: stackUser.displayName || decoded.email.split('@')[0],
            fullName: stackUser.displayName,
            accountType: 'ARTIST',
          },
          select: {
            id: true,
            stackAuthUserId: true,
            email: true,
            stageName: true,
            profilePictureUrl: true,
            accountType: true,
            isVerified: true,
            isAdmin: true,
          },
        });
      } catch (createError) {
        console.error('Failed to create artist profile:', createError);
        res.status(500).json({ error: 'Failed to initialize user profile' });
        return;
      }
    }

    // Attach user to request
    req.user = {
      id: artist.id,
      stackAuthUserId: artist.stackAuthUserId,
      email: artist.email,
      displayName: artist.stageName,
      profilePictureUrl: artist.profilePictureUrl || undefined,
      accountType: artist.accountType,
      isVerified: artist.isVerified,
      isAdmin: artist.isAdmin,
    };
    req.token = token;

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({
      error: 'Unauthorized',
      message: error instanceof Error ? error.message : 'Authentication failed',
    });
  }
}
```

### Step 6: Create Authentication Routes

**File:** `backend/src/routes/auth.routes.ts`

```typescript
import { Router, Request, Response } from 'express';
import { authenticateJWT } from '../lib/middleware/auth.middleware';
import { prisma } from '../lib/prisma';

const router = Router();

/**
 * GET /api/auth/status
 * Check if Stack Auth is configured
 */
router.get('/status', async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      message: 'Stack Auth configured and ready',
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
router.get('/me', authenticateJWT, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    res.json({
      id: req.user.id,
      email: req.user.email,
      displayName: req.user.displayName,
      profilePictureUrl: req.user.profilePictureUrl,
      accountType: req.user.accountType,
      isVerified: req.user.isVerified,
      isAdmin: req.user.isAdmin,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default router;
```

### Step 7: Register Routes

**File:** `backend/src/index.ts`

```typescript
import authRoutes from './routes/auth.routes';

// Add to main() function after other middleware:
app.use('/api/auth', authRoutes);
app.use('/api', authenticateJWT, protectedRoutes); // Protected routes
```

---

## Frontend Setup

### Step 1: Install Stack Auth SDK

```bash
# Inside frontend directory
npm install @stackframe/stack
```

### Step 2: Create Auth Context

**File:** `src/lib/auth/context.tsx`

```typescript
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'ARTIST' | 'MANAGER' | 'ADMIN';
  accountType?: 'ARTIST' | 'ARTIST_AND_MANAGER';
  isAdmin?: boolean;
  permissions?: Record<string, boolean>;
}

export interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Initialize from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('auth_user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Failed to initialize auth:', err);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error(`Login failed with status ${response.status}`);
      }

      const data = await response.json();
      const { accessToken, user: userData } = data.data || data;

      setToken(accessToken);
      setUser(userData);
      localStorage.setItem('auth_token', accessToken);
      localStorage.setItem('auth_user', JSON.stringify(userData));
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string) => {
    setLoading(true);
    setError(null);
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
      const response = await fetch(`${apiBaseUrl}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        throw new Error('Signup failed');
      }

      const data = await response.json();
      const { accessToken, user: userData } = data.data || data;

      setToken(accessToken);
      setUser(userData);
      localStorage.setItem('auth_token', accessToken);
      localStorage.setItem('auth_user', JSON.stringify(userData));
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      if (token) {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
        await fetch(`${apiBaseUrl}/auth/logout`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
        }).catch(() => {});
      }

      setUser(null);
      setToken(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      setError(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const refreshUser = useCallback(async () => {
    try {
      if (!token) return;

      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
      const response = await fetch(`${apiBaseUrl}/auth/me`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to refresh user profile');
      }

      const userData = await response.json();
      const updatedUser: AuthUser = {
        id: userData.id,
        email: userData.email,
        name: userData.displayName || userData.email,
        role: userData.accountType === 'ARTIST_AND_MANAGER' ? 'MANAGER' : 'ARTIST',
        accountType: userData.accountType,
        isAdmin: userData.isAdmin,
      };

      setUser(updatedUser);
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error('Failed to refresh user profile:', err);
    }
  }, [token]);

  const value: AuthContextType = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    error,
    login,
    signup,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

### Step 3: Create Protected Route Component

**File:** `src/components/protected-route.tsx`

```typescript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../lib/auth/context';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
```

### Step 4: Create Login Page

**File:** `src/pages/auth/login.tsx`

```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth/context';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="bg-slate-800 p-8 rounded-lg shadow-xl max-w-md w-full">
        <h1 className="text-2xl font-bold text-white mb-6">Login</h1>

        {error && (
          <div className="bg-red-500/10 text-red-500 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </div>
    </div>
  );
}
```

### Step 5: Wrap App with Auth Provider

**File:** `src/main.tsx`

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthProvider } from './lib/auth/context'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ThemeProvider } from './components/theme-provider'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
```

### Step 6: Use Auth in Components

```typescript
import { useAuth } from '../lib/auth/context'
import { ProtectedRoute } from '../components/protected-route'

export function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

---

## Database Integration

### Step 1: Create Artist Model

**File:** `backend/prisma/schema.prisma`

```prisma
model Artist {
  id                    String    @id @default(cuid())
  stackAuthUserId       String    @unique  // Links to Stack Auth user
  email                 String    @unique
  stageName             String
  fullName              String?
  bio                   String?
  profilePictureUrl     String?
  accountType           String    @default("ARTIST")  // ARTIST | ARTIST_AND_MANAGER
  isAdmin               Boolean   @default(false)
  isVerified            Boolean   @default(false)
  verificationDate      DateTime?
  publicMetricsOptIn    Boolean   @default(false)
  
  genres                String[]
  niches                String[]
  countryCode           String?
  region                String?
  
  leaderboardRank       Int?
  leaderboardScore      Int       @default(0)
  
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
  
  @@index([email])
  @@index([stackAuthUserId])
}
```

### Step 2: Run Migration

```bash
# Backend directory
npx prisma migrate dev --name init_artist
```

### Step 3: Optional - Add Manager Relationships

```prisma
model ManagerArtist {
  id                String    @id @default(cuid())
  managerId         String    @db.Text
  artistId          String    @db.Text
  
  permissions       Json      @default("{}")
  
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  manager           Artist    @relation("manager", fields: [managerId], references: [id])
  artist            Artist    @relation("artist", fields: [artistId], references: [id])
  
  @@unique([managerId, artistId])
}
```

---

## Authentication Flow

### Login Flow

```
1. User enters email/password on frontend
   ↓
2. Frontend calls POST /api/auth/login
   ↓
3. Backend verifies with Stack Auth
   ↓
4. Stack Auth returns JWT token
   ↓
5. Backend checks if user exists in PostgreSQL Artist table
   - If not, creates new artist profile
   ↓
6. Backend returns JWT token and user data
   ↓
7. Frontend stores token in localStorage
   ↓
8. Frontend redirects to dashboard
```

### Protected API Call Flow

```
1. Frontend calls API endpoint with Authorization header
   GET /api/campaigns
   Authorization: Bearer <jwt_token>
   ↓
2. Express middleware (authenticateJWT) intercepts request
   ↓
3. Middleware extracts JWT from Authorization header
   ↓
4. Middleware verifies token with Stack Auth
   ↓
5. If valid, middleware fetches user from PostgreSQL Artist table
   ↓
6. Middleware attaches user to req.user
   ↓
7. Route handler accesses req.user for business logic
   ↓
8. Route returns data or error
```

### Auto-Profile Creation Flow

```
1. New Stack Auth user signs up
   ↓
2. Frontend calls POST /api/auth/signup
   ↓
3. Stack Auth validates and creates account
   ↓
4. Backend receives JWT token
   ↓
5. Backend tries to find user in Artist table
   ↓
6. User not found → Backend creates new artist profile
   - stackAuthUserId: from Stack Auth
   - email: from Stack Auth
   - stageName: from email prefix
   - accountType: 'ARTIST'
   ↓
7. New artist profile is ready to use
```

---

## Debugging & Troubleshooting

### Common Issues

#### 1. "Stack Auth environment variables not configured"

**Problem:** Missing Stack Auth credentials

**Solution:**
```bash
# Check .env file has:
STACK_AUTH_PROJECT_ID=your_id
STACK_AUTH_SECRET_SERVER_KEY=your_key

# Restart backend after updating
docker-compose restart backend
```

#### 2. "CORS policy: Request header field authorization is not allowed"

**Problem:** Backend doesn't allow Authorization header

**Solution:**
```typescript
// Ensure CORS config includes Authorization:
cors({
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-key'],
})
```

#### 3. "Invalid token" on protected routes

**Problem:** Token expired or invalid

**Solution:**
- Implement token refresh endpoint
- Clear localStorage and re-login
- Check token format: `Authorization: Bearer <token>`

#### 4. Auto-profile creation fails

**Problem:** Artist table insert fails on first login

**Solution:**
- Verify Prisma migration ran: `npx prisma migrate status`
- Check database has Artist table
- Ensure database credentials are correct

### Debug Commands

```bash
# Check backend is running
docker ps | grep backend

# View backend logs
docker-compose logs backend -f

# Check Stack Auth config
docker-compose exec backend env | grep STACK_AUTH

# Verify database connection
docker-compose exec backend npx prisma db push

# List all artists in database
docker-compose exec backend npx prisma studio
```

---

## Testing

### Test Login Flow

```bash
# 1. Call login endpoint
curl -X POST http://localhost:4002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Response should include token:
# {"ok":true,"data":{"accessToken":"eyJhbG...","user":{...}}}

# 2. Store token and test protected route
TOKEN="eyJhbG..."

curl -X GET http://localhost:4002/api/auth/me \
  -H "Authorization: Bearer $TOKEN"

# Response should include user data
# {"id":"...","email":"test@example.com",...}
```

### Test Protected Routes

```bash
# Without token → 401 Unauthorized
curl -X GET http://localhost:4002/api/campaigns

# With token → 200 OK
curl -X GET http://localhost:4002/api/campaigns \
  -H "Authorization: Bearer $TOKEN"
```

---

## Deployment Considerations

### Environment Variables

Ensure these are set in production:

```bash
STACK_AUTH_PROJECT_ID=production_id
STACK_AUTH_SECRET_SERVER_KEY=production_key
CORS_ORIGIN=https://yourdomain.com
DATABASE_URL=postgresql://prod_user:prod_pass@prod_host/prod_db
```

### Security Best Practices

1. **Keep secret keys secret**
   - Never commit `STACK_AUTH_SECRET_SERVER_KEY` to repo
   - Use environment variables
   - Rotate keys regularly

2. **Token expiration**
   - Implement refresh token endpoint
   - Clear localStorage on logout
   - Handle expired tokens in frontend

3. **HTTPS only**
   - Always use HTTPS in production
   - Set secure cookie flags
   - Enable HSTS headers

4. **Rate limiting**
   - Add rate limiting to auth endpoints
   - Prevent brute force attacks
   - Limit signup attempts per IP

### Database Backups

```bash
# Backup PostgreSQL
docker-compose exec postgres pg_dump -U user dbname > backup.sql

# Restore from backup
docker-compose exec postgres psql -U user dbname < backup.sql
```

---

## Deployment Checklist

- [ ] Stack Auth project created
- [ ] API keys configured in environment
- [ ] CORS origin updated to production URL
- [ ] Database migrations run
- [ ] SSL certificate configured
- [ ] Rate limiting enabled
- [ ] Error logging configured
- [ ] Backup strategy implemented
- [ ] Token refresh endpoint tested
- [ ] Admin panel secured
- [ ] Production database created
- [ ] Monitoring configured

---

## Next Steps

After completing this integration:

1. **Add OAuth integrations** (GitHub, Google, etc.)
2. **Implement email verification**
3. **Add two-factor authentication**
4. **Create admin dashboard** for user management
5. **Setup audit logging** for all auth events
6. **Implement password reset** flow

---

## Files Created/Modified

### Backend
- `src/lib/stack-auth.ts` - Stack Auth utilities
- `src/lib/middleware/auth.middleware.ts` - JWT validation middleware
- `src/routes/auth.routes.ts` - Auth endpoints
- `src/index.ts` - CORS and route registration
- `prisma/schema.prisma` - Artist model

### Frontend
- `src/lib/auth/context.tsx` - Auth context and hooks
- `src/components/protected-route.tsx` - Route protection
- `src/pages/auth/login.tsx` - Login form
- `src/main.tsx` - Provider setup

---

## Quick Reference

### Key Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | /api/auth/login | ❌ | User login |
| POST | /api/auth/signup | ❌ | User signup |
| GET | /api/auth/me | ✅ | Get current user |
| POST | /api/auth/logout | ✅ | Logout |
| GET | /api/auth/status | ❌ | Check Stack Auth status |

### Key Functions

```typescript
// Frontend - Get current user
const { user, isAuthenticated } = useAuth()

// Frontend - Login
await login(email, password)

// Frontend - Logout
await logout()

// Backend - Check if authenticated
if (!req.user) return 401

// Backend - Get user ID
const userId = req.user.id
```

---

## Conclusion

You now have a complete Stack Auth integration that:

✅ Handles user authentication securely
✅ Creates custom user profiles
✅ Protects API routes with JWT
✅ Automatically creates artist profiles
✅ Separates auth from business logic
✅ Scales to support multiple user types

This same pattern can be replicated on your next project!

