import { useEffect, useState } from "react";
import { Cookie, X } from "lucide-react";

const STORAGE_KEY = "cookieConsent";

type Preferences = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
};

const defaultPreferences: Preferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  functional: false,
};

function loadPreferences(): Preferences | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as Preferences;
  } catch (error) {
    console.error("Failed to parse cookie preferences", error);
    return null;
  }
}

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);

  useEffect(() => {
    const saved = loadPreferences();
    if (saved) {
      setPreferences(saved);
    } else {
      const timer = window.setTimeout(() => setShowBanner(true), 1000);
      return () => window.clearTimeout(timer);
    }
  }, []);

  const persist = (prefs: Preferences) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    setPreferences(prefs);
  };

  const acceptAll = () => {
    const all = { ...preferences, analytics: true, marketing: true, functional: true } as Preferences;
    persist(all);
    setShowBanner(false);
    setShowPreferences(false);
    initializeScripts(all);
  };

  const acceptNecessary = () => {
    const necessaryOnly: Preferences = { ...defaultPreferences };
    persist(necessaryOnly);
    setShowBanner(false);
    setShowPreferences(false);
  };

  const savePreferences = () => {
    persist(preferences);
    setShowBanner(false);
    setShowPreferences(false);
    initializeScripts(preferences);
  };

  const initializeScripts = (prefs: Preferences) => {
    if (prefs.analytics) {
      console.log("Analytics cookies enabled");
    }
    if (prefs.marketing) {
      console.log("Marketing cookies enabled");
    }
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="mx-auto max-w-4xl rounded-3xl border border-primary/30 bg-card/95 p-6 shadow-2xl backdrop-blur-lg md:p-8">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/20 to-secondary/20 p-3">
            <Cookie className="h-6 w-6 text-primary" />
          </div>

          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <h3 className="text-base font-semibold uppercase tracking-wide">We value your privacy</h3>
              <p className="text-sm text-muted-foreground">
                We use cookies to enhance your experience, analyze site traffic, and personalize content. You can accept
                all cookies, keep only the necessary ones, or customize your preferences.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={acceptAll}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-3 text-sm font-semibold text-slate-900 transition hover:opacity-90"
              >
                Accept all cookies
              </button>
              <button
                type="button"
                onClick={acceptNecessary}
                className="inline-flex flex-1 items-center justify-center rounded-full border border-border/50 px-5 py-3 text-sm font-semibold transition hover:bg-card/60"
              >
                Necessary only
              </button>
              <button
                type="button"
                onClick={() => setShowPreferences((prev) => !prev)}
                className="inline-flex flex-1 items-center justify-center rounded-full px-5 py-3 text-sm font-semibold text-primary transition hover:text-primary/80"
              >
                Customize
              </button>
              <a
                href="/cookie-policy"
                className="self-center text-sm font-semibold text-primary transition hover:underline"
              >
                Cookie policy
              </a>
            </div>

            {showPreferences && (
              <div className="space-y-4 border-t border-border/50 pt-4">
                <h4 className="text-sm font-semibold uppercase tracking-wide">Cookie preferences</h4>

                <div className="space-y-3">
                  <label className="flex items-center justify-between gap-4 rounded-2xl border border-border/40 bg-card/60 p-3">
                    <div>
                      <p className="text-sm font-medium">Necessary cookies</p>
                      <p className="text-xs text-muted-foreground">Required for basic site functionality.</p>
                    </div>
                    <input type="checkbox" checked disabled className="cursor-not-allowed" />
                  </label>

                  <label className="flex items-center justify-between gap-4 rounded-2xl border border-border/40 bg-card/60 p-3 hover:border-primary/40">
                    <div>
                      <p className="text-sm font-medium">Analytics cookies</p>
                      <p className="text-xs text-muted-foreground">
                        Help us understand how you use the site so we can improve it.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(event) => setPreferences({ ...preferences, analytics: event.target.checked })}
                    />
                  </label>

                  <label className="flex items-center justify-between gap-4 rounded-2xl border border-border/40 bg-card/60 p-3 hover:border-primary/40">
                    <div>
                      <p className="text-sm font-medium">Marketing cookies</p>
                      <p className="text-xs text-muted-foreground">Used to personalize ads and measure campaigns.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(event) => setPreferences({ ...preferences, marketing: event.target.checked })}
                    />
                  </label>

                  <label className="flex items-center justify-between gap-4 rounded-2xl border border-border/40 bg-card/60 p-3 hover:border-primary/40">
                    <div>
                      <p className="text-sm font-medium">Functional cookies</p>
                      <p className="text-xs text-muted-foreground">Enable chat, video, and other enhanced features.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.functional}
                      onChange={(event) => setPreferences({ ...preferences, functional: event.target.checked })}
                    />
                  </label>
                </div>

                <button
                  type="button"
                  onClick={savePreferences}
                  className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-3 text-sm font-semibold text-slate-900 transition hover:opacity-90"
                >
                  Save preferences
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowBanner(false)}
            className="flex-shrink-0 rounded-full p-2 text-muted-foreground transition hover:bg-card/60"
            aria-label="Dismiss cookie banner"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
