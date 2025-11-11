# Frontend Stack Auth Setup Guide

## Installation

```bash
# Navigate to frontend directory
cd src

# Install Stack Auth React SDK
npm install @stackframe/stack
```

## Create Auth Context

This context manages authentication state across the application.

### Create: `src/contexts/AuthContext.tsx`

```typescript
import React, { createContext, useContext, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  displayName?: string;
  profilePictureUrl?: string;
  role?: 'ARTIST' | 'PRODUCER' | 'ADMIN';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // Check authentication status on mount
  React.useEffect(() => {
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
        // Not authenticated or network error
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const refreshUser = React.useCallback(async () => {
    try {
      const response = await fetch('http://localhost:4002/api/auth/me', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('User refresh failed:', error);
    }
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signUp: async (email: string, password: string) => {
      // TODO: Implement with Stack Auth
      console.log('Sign up not yet implemented:', email, password);
    },
    signIn: async (email: string, password: string) => {
      // TODO: Implement with Stack Auth
      console.log('Sign in not yet implemented:', email, password);
    },
    signOut: async () => {
      // TODO: Implement with Stack Auth
      setUser(null);
    },
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to use authentication context
 * 
 * Usage:
 * const { user, isAuthenticated } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

## Wrap App with AuthProvider

Update your main app entry point to wrap with AuthProvider.

### Update: `src/main.tsx`

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)
```

## Create Protected Route Component

This wrapper prevents unauthenticated users from accessing protected pages.

### Create: `src/components/ProtectedRoute.tsx`

```typescript
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'ARTIST' | 'PRODUCER' | 'ADMIN';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
```

## Update Router with Protected Routes

### Update your routing configuration:

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ArtistDashboard from './pages/dashboards/ArtistDashboard';
import ProducerDashboard from './pages/dashboards/ProducerDashboard';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard/artist" element={
          <ProtectedRoute requiredRole="ARTIST">
            <ArtistDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard/producer" element={
          <ProtectedRoute requiredRole="PRODUCER">
            <ProducerDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}
```

## Frontend Configuration File

### Create: `src/config/stack-auth.config.ts`

```typescript
/**
 * Stack Auth Frontend Configuration
 * 
 * Backend must be running for these to work.
 * Stack Auth handles OAuth redirects automatically.
 */

export const STACK_AUTH_CONFIG = {
  // Backend API base URL
  API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:4002',
  
  // Auth endpoints
  AUTH_ENDPOINTS: {
    HEALTH: '/api/auth/health',
    ME: '/api/auth/me',
    VERIFY_JWT: '/api/auth/verify-jwt',
    LOGOUT: '/api/auth/logout',
  },
  
  // Pages
  PAGES: {
    LOGIN: '/login',
    SIGNUP: '/signup',
    DASHBOARD: '/',
    SETTINGS: '/settings',
  },
  
  // Timeouts
  TIMEOUTS: {
    SESSION_CHECK: 5 * 60 * 1000, // 5 minutes
    JWT_REFRESH: 30 * 60 * 1000, // 30 minutes
  },
};
```

## Checklist ✅

- [ ] Stack Auth React SDK installed: `npm install @stackframe/stack`
- [ ] `AuthContext.tsx` created in `src/contexts/`
- [ ] `main.tsx` wrapped with `<AuthProvider>`
- [ ] `ProtectedRoute.tsx` created in `src/components/`
- [ ] Router updated with protected routes
- [ ] `stack-auth.config.ts` created
- [ ] No TypeScript errors in IDE
- [ ] App starts: `npm run dev`

## Next Steps

When Day 1 is complete:
1. Backend API health check: `curl http://localhost:4002/api/auth/health`
2. Verify auth context loads without errors
3. Proceed to Day 2: Database & Prisma setup

---

**Frontend Setup Status**: ✅ Ready for Day 2
