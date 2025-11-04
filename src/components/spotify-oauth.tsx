import { useState } from "react";
import { Music, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";

interface SpotifyOAuthProps {
  onTokenReceived?: (token: string) => void;
  onConnectionChange?: (isConnected: boolean) => void;
}

const SPOTIFY_CLIENT_ID = "359d80a99deb496c989d77d8e20af741";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4002";

// The OAuth scopes we request from Spotify
const SPOTIFY_SCOPES = [
  "user-read-private",           // Read private profile info
  "user-read-email",              // Read email address
  "user-top-read",                // Read top artists/tracks
  "playlist-read-private",        // Read private playlists
  "user-follow-read",             // Read followed artists
].join("%20");

export function SpotifyOAuth({ onTokenReceived, onConnectionChange }: SpotifyOAuthProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [connectedUser, setConnectedUser] = useState<string | null>(null);

  // Check if we're handling a callback
  const handleOAuthCallback = async () => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const error = params.get("error");

    if (error) {
      setError(`Spotify auth failed: ${error}`);
      return;
    }

    if (!code) return;

    try {
      setIsLoading(true);
      setError(null);

      // Exchange code for token via backend
      const response = await fetch(`${BACKEND_URL}/auth/spotify/callback?code=${code}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Token exchange failed");
      }

      const data = await response.json();
      const accessToken = data.tokens?.access_token;

      if (!accessToken) {
        throw new Error("No access token received");
      }

      // Store token in session/localStorage
      sessionStorage.setItem("spotify_access_token", accessToken);
      if (data.tokens?.refresh_token) {
        sessionStorage.setItem("spotify_refresh_token", data.tokens.refresh_token);
      }

      // Fetch user info to confirm connection
      const userRes = await fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!userRes.ok) {
        throw new Error("Failed to fetch user info");
      }

      const userData = await userRes.json();
      setConnectedUser(userData.display_name || userData.email || "Connected");
      
      // Send token to backend for profile enrichment
      try {
        const enrichResponse = await fetch(`${BACKEND_URL}/auth/spotify/connect`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken }),
        });

        if (enrichResponse.ok) {
          const enrichData = await enrichResponse.json();
          console.log("Profile enriched with data:", enrichData.data);
          // Token will be used to fetch profile, top artists, tracks, etc
        } else {
          console.warn("Profile enrichment request failed (non-critical)");
          // Continue anyway - enrichment is optional
        }
      } catch (enrichErr) {
        console.warn("Profile enrichment error (non-critical):", enrichErr);
        // Continue anyway - enrichment is optional
      }

      setIsConnected(true);
      setSuccessMessage(`Connected as ${userData.display_name || userData.email}`);

      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);

      onTokenReceived?.(accessToken);
      onConnectionChange?.(true);
    } catch (err: any) {
      setError(err.message || "Connection failed");
      onConnectionChange?.(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Initiate OAuth flow
  const handleConnect = () => {
    const redirectUri = `${window.location.origin}/auth/spotify/callback`;
    const authUrl = new URL("https://accounts.spotify.com/authorize");

    authUrl.searchParams.set("client_id", SPOTIFY_CLIENT_ID);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("scope", SPOTIFY_SCOPES);
    authUrl.searchParams.set("show_dialog", "true");

    window.location.href = authUrl.toString();
  };

  // Handle disconnect
  const handleDisconnect = () => {
    sessionStorage.removeItem("spotify_access_token");
    sessionStorage.removeItem("spotify_refresh_token");
    setIsConnected(false);
    setConnectedUser(null);
    setSuccessMessage(null);
    onConnectionChange?.(false);
  };

  // Check for callback on mount
  if (window.location.search.includes("code")) {
    handleOAuthCallback();
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Music className="h-6 w-6 text-green-500" />
            <div>
              <CardTitle>Spotify Connection</CardTitle>
              <CardDescription>Connect your Spotify account to access your profile data</CardDescription>
            </div>
          </div>
          {isConnected && <CheckCircle className="h-5 w-5 text-green-500" />}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <div className="flex gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-200">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="flex gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-800 dark:bg-green-900/30 dark:text-green-200">
            <CheckCircle className="h-4 w-4 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {isConnected ? (
          <div className="space-y-3">
            <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
              <p className="text-sm font-medium text-green-900 dark:text-green-200">
                ✓ Connected as {connectedUser}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleDisconnect}
              className="w-full"
            >
              Disconnect Spotify
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleConnect}
            disabled={isLoading}
            className="w-full gap-2 bg-green-600 hover:bg-green-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Music className="h-4 w-4" />
                Connect with Spotify
              </>
            )}
          </Button>
        )}

        <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-600 dark:bg-gray-900/20 dark:text-gray-400">
          <p className="font-medium mb-1">We'll access:</p>
          <ul className="space-y-1 ml-2">
            <li>• Your profile information</li>
            <li>• Top artists and tracks</li>
            <li>• Your playlists</li>
            <li>• Followed artists</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper component for displaying in integrations page
export function SpotifyIntegrationCard() {
  const [isConnected, setIsConnected] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                <Music className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-base">Spotify</CardTitle>
                <CardDescription className="text-xs">
                  {isConnected ? "Connected" : "Not connected"}
                </CardDescription>
              </div>
            </div>
            {isConnected && <CheckCircle className="h-5 w-5 text-green-500" />}
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Connect your Spotify account to access profile data and enrich audience insights.
          </p>

          <Button
            onClick={() => setShowDialog(true)}
            variant={isConnected ? "outline" : "default"}
            className="w-full"
            size="sm"
          >
            {isConnected ? "Manage Connection" : "Connect Spotify"}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Spotify Integration</DialogTitle>
            <DialogDescription>
              Connect your Spotify account to enrich your audience profiles with real-time data.
            </DialogDescription>
          </DialogHeader>

          <SpotifyOAuth
            onConnectionChange={(connected) => {
              setIsConnected(connected);
              if (connected) {
                setTimeout(() => setShowDialog(false), 1000);
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
