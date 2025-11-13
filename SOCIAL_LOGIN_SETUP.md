# Social Login Setup Guide

This guide explains how to set up Google and Facebook OAuth authentication with Stack Auth for the Wreckshop platform.

## Overview

The Wreckshop platform uses **Stack Auth** for authentication. Stack Auth provides built-in OAuth providers for Google, Facebook, and Spotify. Users can sign in using their existing social accounts.

> Local development reminders
>
> - We run a single Docker Compose stack for all development. Do not use ngrok for callbacks.
> - Leave VITE_API_BASE_URL unset in local dev so the frontend uses the relative "/api" proxy.
> - Default ports: frontend 5176, backend 4002. OAuth redirects return to the app at http://localhost:5176.

## Callback URLs (quick copy)

Use these Stack Auth hosted callback URLs when configuring each provider in its respective console:

- Google: https://api.stack-auth.com/api/v1/auth/oauth/callback/google
- Facebook: https://api.stack-auth.com/api/v1/auth/oauth/callback/facebook

## Prerequisites

- Stack Auth account and project created
- Google Cloud Console access
- Facebook Developers Portal access

---

## 1. Google OAuth Setup

### Step 1: Create a Google OAuth2 App

1. Navigate to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Select **Web application**
6. Enter app name (e.g., "Wreckshop-Social")
7. Add authorized redirect URI:
   ```
   https://api.stack-auth.com/api/v1/auth/oauth/callback/google
   ```
8. Click **Create**
9. Save the **Client ID** and **Client Secret**

### Step 2: Add Google to Stack Auth

1. Go to [Stack Auth Dashboard](https://app.stack-auth.com)
2. Select your project
3. Navigate to **Auth Methods** in the left sidebar
4. Click **Add SSO Providers** → Select **Google**
5. Enter the **Client ID** and **Client Secret** from Google Cloud Console
6. Save changes

### Step 3: Get Stack Project ID

From the Stack Auth dashboard, find your **Project ID** (format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

---

## 2. Facebook OAuth Setup

### Step 1: Create a Facebook OAuth App

1. Navigate to [Facebook Developers Portal](https://developers.facebook.com/)
2. Go to **My Apps** → **Create App**
3. Select **Consumer** as app type
4. Fill in app details and click **Next**
5. Select **Authenticate and request data from users with Facebook Login** → **Next**
6. Complete the setup wizard
7. In **Use Cases**, find **Authenticate and request data from users with Facebook Login** → **Customize**
8. Go to **Permissions** tab, add **email** permission
9. In the left sidebar, go **Facebook Login** → **Settings**
10. In **Valid OAuth Redirect URIs**, add:
    ```
    https://api.stack-auth.com/api/v1/auth/oauth/callback/facebook
    ```
11. Click **Save changes**
12. Go to **App settings** → **Basic**
13. Save your **App ID** and **App Secret**

### Step 2: Add Facebook to Stack Auth

1. Go to [Stack Auth Dashboard](https://app.stack-auth.com)
2. Select your project
3. Navigate to **Auth Methods** in the left sidebar
4. Click **Add SSO Providers** → Select **Facebook**
5. Enter the **App ID** and **App Secret** from Facebook Developers Portal
6. Save changes

---

## 3. Frontend Configuration

### Update Environment Variables

The frontend uses the Stack Auth Project ID to initiate OAuth via the hosted sign‑in page. Update `src/pages/auth/login-stack.tsx` and `src/pages/auth/signup-stack.tsx` to read from env:

Create or update a `.env` file (consumed by Vite):

```env
VITE_STACK_PROJECT_ID=63928c12-12fd-4780-82c4-b21c2706650f

# Leave VITE_API_BASE_URL unset for local Docker dev.
# The frontend defaults to relative '/api' and the Docker stack proxies requests to the backend.
# If you run the frontend outside Docker, you can point directly to the backend:
# VITE_API_BASE_URL=http://localhost:4002/api

# Optional: enable Spotify SSO button
VITE_ENABLE_SPOTIFY_SSO=true
```

In code, we reference:

```ts
const stackProjectId = import.meta.env.VITE_STACK_PROJECT_ID
```

### OAuth Callback Handler

The hosted Stack Auth flow redirects back to the app at:

```
/auth/oauth/callback/:provider
```

The handler exists at `src/pages/auth/oauth-callback.tsx` and will:
1. Use a returned token directly when present (token | access_token | id_token)
2. Otherwise POST the authorization code to our backend `/api/auth/sso/exchange` to get a token (demo now; replace with real Stack Auth exchange later)
3. Store the token and user via AuthContext (localStorage)
4. Redirect to the home page ("/")

Note: The frontend normalizes post-login redirects to "/". Make sure any app links or tests expect the root path after OAuth completes.

---

## 4. Testing Social Login

### Test Google Login

1. Visit the sign-in page: `http://localhost:5176/login`
2. Click the **Google** button
3. You'll be redirected to Google's OAuth consent screen
4. After authentication, you'll be redirected back to the app
5. You should be logged in to your Wreckshop account

### Test Facebook Login

1. Visit the sign-in page: `http://localhost:5176/login`
2. Click the **Facebook** button
3. You'll be redirected to Facebook's OAuth consent screen
4. After authentication, you'll be redirected back to the app
5. You should be logged in to your Wreckshop account

---

## 5. Environment Variables Summary

### Backend (.env)

```env
# Stack Auth Configuration
STACK_PROJECT_ID=<your_stack_project_id>
STACK_CLIENT_KEY=<your_stack_client_key>
STACK_SERVER_KEY=<your_stack_server_key>
STACK_WEBHOOK_SECRET=<your_stack_webhook_secret>

# Google OAuth (configure in Stack Auth)
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>

# Facebook OAuth (configure in Stack Auth)
FACEBOOK_APP_ID=<your_facebook_app_id>
FACEBOOK_APP_SECRET=<your_facebook_app_secret>
```

### Frontend (.env)

```env
# Stack Auth Project ID (for hosted sign-in flow)
VITE_STACK_PROJECT_ID=<your_stack_project_id>

# Backend API endpoint
# Leave unset for Docker dev (defaults to '/api'). If running FE outside Docker, use:
# VITE_API_BASE_URL=http://localhost:4002/api

# Optional: enable Spotify SSO button
VITE_ENABLE_SPOTIFY_SSO=true
```

---

## 6. Troubleshooting

### Issue: "Invalid redirect URI"

**Solution**:
1. In Google/Facebook developer consoles, set the provider app’s redirect URI to the Stack Auth callback:

```
https://api.stack-auth.com/api/v1/auth/oauth/callback/[provider]
```

For convenience, here are the exact values to add:

- Google: https://api.stack-auth.com/api/v1/auth/oauth/callback/google
- Facebook: https://api.stack-auth.com/api/v1/auth/oauth/callback/facebook

2. In the frontend, we initiate the hosted flow with our app’s redirect_uri, e.g. (local dev):

```
https://app.stack-auth.com/<PROJECT_ID>/sign-in?provider=google&redirect_uri=http%3A%2F%2Flocalhost%3A5176%2Fauth%2Foauth%2Fcallback%2Fgoogle

For production, replace `http://localhost:5176` with your public domain.
```

### Issue: OAuth provider not appearing in Stack Auth

**Solution**: 
1. Ensure the provider credentials are correctly entered
2. Click **Save changes** after entering credentials
3. Refresh the page and check **Auth Methods** again

### Issue: User not being created after social login

**Solution**:
1. Check that Stack Auth webhooks are configured
2. Verify `src/pages/auth/oauth-callback.tsx` is properly handling the token
3. Check browser console for errors

### Issue: "Stack Project ID not found"
### Issue: Browser console shows "A listener indicated an asynchronous response..."

Cause:
- This message usually comes from installed browser extensions (password managers, ad blockers, etc.), not from the app.

Impact:
- It does not affect the Stack Auth flow or our application logic. You can safely ignore it during testing.

Tip:
- Try an incognito window with extensions disabled to confirm the message disappears.

### Issue: Local callback or API requests fail in Docker dev

Checklist:
- Ensure you did not set VITE_API_BASE_URL for local dev; the app should use relative "/api".
- Do not use ngrok for OAuth callbacks in local dev; rely on the hosted Stack Auth callback and return to http://localhost:5176.
- Verify the Docker stack is running and the frontend is reachable at http://localhost:5176 and backend at http://localhost:4002.

**Solution**:
1. Go to Stack Auth dashboard
2. Copy your Project ID from project settings
3. Update the `stackProjectId` variable in login/signup pages

---

## 7. Additional Resources

- [Stack Auth Documentation](https://docs.stack-auth.com)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login/)
- [Stack Auth Google Provider Docs](/docs/concepts/auth-providers/google)
- [Stack Auth Facebook Provider Docs](/docs/concepts/auth-providers/facebook)
- [Stack Auth Spotify Provider Docs](/docs/concepts/auth-providers/spotify)
