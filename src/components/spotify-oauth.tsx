import { useMemo, useState } from "react";
import { Music, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { useAuth } from "../lib/auth/context";
import { apiRequest, API_BASE_URL } from "../lib/api";

interface SpotifyOAuthProps {
  status?: {
    connected?: boolean;
    displayName?: string | null;
    followers?: number | null;
    profileUrl?: string | null;
    lastSyncedAt?: string | null;
    tokenExpiresAt?: string | null;
    requiresReconnect?: boolean;
  } | null;
  onConnectionChange?: (isConnected: boolean) => void;
  onRefreshStatus?: () => Promise<void> | void;
}

export function SpotifyOAuth({ status, onConnectionChange, onRefreshStatus }: SpotifyOAuthProps) {
  const { user, token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isConnected = status?.connected ?? false;
  const connectedUser = status?.displayName ?? null;

  const expiresDisplay = useMemo(() => {
    if (!status?.tokenExpiresAt) return null;
    try {
      return new Date(status.tokenExpiresAt).toLocaleString();
    } catch {
      return null;
    }
  }, [status?.tokenExpiresAt]);

  const startOAuth = async () => {
    if (!user || !token) {
      setError("You must be signed in to connect Spotify.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ artistId: user.id });
      const currentPath = `${window.location.pathname}${window.location.search}`;
      params.set("redirectPath", currentPath || "/app/integrations");
      const base = API_BASE_URL || "";
      const response = await fetch(`${base}/auth/spotify/start?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        const text = await response.text().catch(() => "Failed to start Spotify auth");
        throw new Error(text);
      }

      const data = await response.json();
      if (!data?.authUrl) {
        throw new Error("Malformed Spotify authorization response");
      }

      window.location.href = data.authUrl;
    } catch (err: any) {
      console.error("Spotify start failed", err);
      setError(err?.message || "Could not start Spotify authorization");
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      await apiRequest(`/integrations/spotify/${user.id}`, { method: "DELETE" });
      setSuccessMessage("Spotify disconnected");
      onConnectionChange?.(false);
      await onRefreshStatus?.();
    } catch (err: any) {
      console.error("Disconnect Spotify failed", err);
      setError(err?.message || "Failed to disconnect Spotify");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Music className="h-6 w-6 text-green-500" />
              <div>
                <CardTitle>Spotify Connection</CardTitle>
                <CardDescription>
                  {isConnected ? "Account connected" : "Connect to unlock listener insights"}
                </CardDescription>
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
                ✓ Connected as {connectedUser || "Spotify account"}
              </p>
              {status?.followers !== undefined && (
                <p className="text-xs text-green-800 dark:text-green-300 mt-1">
                  Followers: {status.followers?.toLocaleString?.() ?? status.followers}
                </p>
              )}
              {expiresDisplay && (
                <p className="text-xs text-green-800 dark:text-green-300 mt-1">
                  Token expires: {expiresDisplay}
                </p>
              )}
            </div>
            <Button
              variant="outline"
              onClick={handleDisconnect}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Disconnecting…
                </>
              ) : (
                "Disconnect Spotify"
              )}
            </Button>
          </div>
        ) : (
          <Button
            onClick={startOAuth}
            disabled={isLoading}
            className="w-full gap-2 bg-green-600 hover:bg-green-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Redirecting…
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
interface SpotifyIntegrationCardProps {
  status?: {
    connected?: boolean;
    displayName?: string;
    followers?: number;
    profileImageUrl?: string | null;
    tokenExpiresAt?: string | null;
    requiresReconnect?: boolean;
  } | null;
  onRefresh?: () => Promise<void> | void;
}

export function SpotifyIntegrationCard({ status, onRefresh }: SpotifyIntegrationCardProps) {
  const [showDialog, setShowDialog] = useState(false);
  const isConnected = status?.connected ?? false;

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
                  {isConnected ? status?.displayName || "Connected" : "Not connected"}
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
            status={status}
            onRefreshStatus={onRefresh}
            onConnectionChange={(connected) => {
              if (connected) {
                onRefresh?.();
                setTimeout(() => setShowDialog(false), 1000);
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
