import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { useTheme } from "./theme-provider";
import { Moon, Sun } from "lucide-react";

export function ThemeSelector() {
  const [currentTheme, setCurrentTheme] = useState("music-tech-purple");
  const { theme, toggleTheme } = useTheme();

  const themes = {
    "music-tech-purple": {
      name: "Music Tech Purple",
      description: "Current Wreckshop Records theme",
      primary: "#7C3AED",
      accent: "#22C55E",
      colors: {
        "--primary": "#7C3AED",
        "--accent": "#22C55E", 
        "--chart-1": "#7C3AED",
        "--chart-2": "#22C55E",
        "--chart-3": "#F59E0B",
        "--chart-4": "#EF4444",
        "--chart-5": "#8B5CF6",
        "--sidebar-primary": "#7C3AED",
        "--ring": "#7C3AED",
        "--sidebar-ring": "#7C3AED"
      }
    },
    "electric-blue": {
      name: "Electric Blue",
      description: "Modern tech-focused theme",
      primary: "#0EA5E9",
      accent: "#F97316",
      colors: {
        "--primary": "#0EA5E9",
        "--accent": "#F97316",
        "--chart-1": "#0EA5E9", 
        "--chart-2": "#F97316",
        "--chart-3": "#10B981",
        "--chart-4": "#EF4444",
        "--chart-5": "#8B5CF6",
        "--sidebar-primary": "#0EA5E9",
        "--ring": "#0EA5E9",
        "--sidebar-ring": "#0EA5E9"
      }
    },
    "neon-green": {
      name: "Neon Green",
      description: "High-energy gaming aesthetic",
      primary: "#00FF88",
      accent: "#FF0080",
      colors: {
        "--primary": "#00FF88",
        "--accent": "#FF0080",
        "--chart-1": "#00FF88",
        "--chart-2": "#FF0080", 
        "--chart-3": "#FFD700",
        "--chart-4": "#FF4444",
        "--chart-5": "#8B5CF6",
        "--sidebar-primary": "#00FF88",
        "--ring": "#00FF88",
        "--sidebar-ring": "#00FF88"
      }
    },
    "sunset-orange": {
      name: "Sunset Orange", 
      description: "Warm creative industry theme",
      primary: "#F97316",
      accent: "#8B5CF6",
      colors: {
        "--primary": "#F97316",
        "--accent": "#8B5CF6",
        "--chart-1": "#F97316",
        "--chart-2": "#8B5CF6",
        "--chart-3": "#10B981", 
        "--chart-4": "#EF4444",
        "--chart-5": "#0EA5E9",
        "--sidebar-primary": "#F97316",
        "--ring": "#F97316",
        "--sidebar-ring": "#F97316"
      }
    }
  };

  const applyTheme = (themeKey: string) => {
    const theme = themes[themeKey as keyof typeof themes];
    if (!theme) return;

    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
    
    setCurrentTheme(themeKey);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme Selector</CardTitle>
        <CardDescription>
          Instantly change the entire application color scheme
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Light/Dark Mode Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sun className="h-4 w-4" />
            <Label htmlFor="theme-mode">Light Mode</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="theme-mode"
              checked={theme === "dark"}
              onCheckedChange={toggleTheme}
            />
            <Moon className="h-4 w-4" />
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="font-medium mb-3">Color Schemes</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(themes).map(([key, theme]) => (
            <div 
              key={key}
              className={`border rounded-lg p-4 cursor-pointer transition-all hover:border-primary ${
                currentTheme === key ? "border-primary bg-primary/5" : "border-border"
              }`}
              onClick={() => applyTheme(key)}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{theme.name}</h4>
                {currentTheme === key && <Badge variant="default">Active</Badge>}
              </div>
              <p className="text-sm text-muted-foreground mb-3">{theme.description}</p>
              <div className="flex gap-2">
                <div 
                  className="w-6 h-6 rounded-full border border-border"
                  style={{ backgroundColor: theme.primary }}
                  title="Primary Color"
                />
                <div 
                  className="w-6 h-6 rounded-full border border-border"
                  style={{ backgroundColor: theme.accent }}
                  title="Accent Color"
                />
              </div>
            </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="font-medium mb-2">Current Settings</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Mode:</span> 
              <Badge variant="outline" className="ml-2">
                {theme === "dark" ? "Dark" : "Light"}
              </Badge>
            </div>
            <div>
              <span className="text-muted-foreground">Theme:</span>
              <Badge variant="outline" className="ml-2">
                {themes[currentTheme as keyof typeof themes].name}
              </Badge>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm font-mono mt-2">
            <div>Primary: <span style={{ color: themes[currentTheme as keyof typeof themes].primary }}>
              {themes[currentTheme as keyof typeof themes].primary}
            </span></div>
            <div>Accent: <span style={{ color: themes[currentTheme as keyof typeof themes].accent }}>
              {themes[currentTheme as keyof typeof themes].accent}
            </span></div>
          </div>
        </div>

        <Button 
          variant="outline" 
          onClick={() => applyTheme("music-tech-purple")}
          className="w-full"
        >
          Reset to Original Theme
        </Button>
      </CardContent>
    </Card>
  );
}