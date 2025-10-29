import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  Sparkles, 
  Layers, 
  Blend, 
  Eye,
  TrendingUp,
  Users,
  Music,
  Calendar
} from "lucide-react";

export function GlassNeuroShowcase() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Design Effects Showcase</h1>
        <p className="text-muted-foreground">
          Glassmorphism and Neumorphism design patterns
        </p>
      </div>

      {/* Glassmorphism Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-semibold">Glassmorphism</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Basic Glass Card */}
          <Card className="glass rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="w-5 h-5" />
                Basic Glass
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Standard glass effect with subtle backdrop blur
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Transparency</span>
                  <span className="font-medium">10%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Blur</span>
                  <span className="font-medium">10px</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Strong Glass Card */}
          <Card className="glass-strong rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Blend className="w-5 h-5" />
                Strong Glass
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Enhanced blur for more prominent glass effect
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Transparency</span>
                  <span className="font-medium">15%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Blur</span>
                  <span className="font-medium">16px</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Glass Card with Glow */}
          <Card className="glass-glow rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Glass + Glow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Glass effect with primary color glow on hover
              </p>
              <div className="mt-4">
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  Hover me!
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Glass Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-primary">2.4K</div>
                <div className="text-sm text-muted-foreground">Total Fans</div>
              </div>
              <Users className="w-8 h-8 text-primary/50" />
            </div>
          </div>

          <div className="glass-primary rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">12</div>
                <div className="text-sm text-muted-foreground">Releases</div>
              </div>
              <Music className="w-8 h-8 text-primary/50" />
            </div>
          </div>

          <div className="glass-accent rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">89%</div>
                <div className="text-sm text-muted-foreground">Engagement</div>
              </div>
              <TrendingUp className="w-8 h-8 text-accent/50" />
            </div>
          </div>

          <div className="glass-subtle rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">6</div>
                <div className="text-sm text-muted-foreground">Events</div>
              </div>
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Glass Gradient Card */}
        <Card className="glass-gradient rounded-xl">
          <CardHeader>
            <CardTitle>Glass with Gradient Border</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Frosted glass effect with animated gradient border using pseudo-element
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="glass-subtle">
                Learn More
              </Button>
              <Button size="sm" className="bg-primary/80 hover:bg-primary">
                Get Started
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Neumorphism Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-semibold">Neumorphism</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Basic Neuro Card */}
          <div className="neuro rounded-xl p-6">
            <h3 className="font-semibold mb-2">Raised Surface</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Soft shadow creates the illusion of elevated elements
            </p>
            <Button className="neuro-flat rounded-xl" variant="ghost">
              Click Me
            </Button>
          </div>

          {/* Inset Neuro Card */}
          <div className="neuro rounded-xl p-6">
            <h3 className="font-semibold mb-2">Inset Element</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Inverted shadows for pressed appearance
            </p>
            <div className="neuro-inset rounded-xl p-4 text-center">
              <span className="text-sm">Pressed State</span>
            </div>
          </div>

          {/* Primary Neuro Card */}
          <div className="neuro-primary rounded-xl p-6 text-primary-foreground">
            <h3 className="font-semibold mb-2">Primary Style</h3>
            <p className="text-sm opacity-90 mb-4">
              Neumorphic effect with primary color gradient
            </p>
            <Badge className="bg-white/20 text-white border-white/30">
              Premium
            </Badge>
          </div>
        </div>

        {/* Neuro Controls */}
        <div className="neuro rounded-xl p-6">
          <h3 className="font-semibold mb-4">Neumorphic Controls</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="neuro-flat rounded-full w-16 h-16 flex items-center justify-center transition-all hover:neuro active:neuro-inset">
              <Users className="w-6 h-6" />
            </button>
            <button className="neuro-flat rounded-full w-16 h-16 flex items-center justify-center transition-all hover:neuro active:neuro-inset">
              <Music className="w-6 h-6" />
            </button>
            <button className="neuro-flat rounded-full w-16 h-16 flex items-center justify-center transition-all hover:neuro active:neuro-inset">
              <Calendar className="w-6 h-6" />
            </button>
            <button className="neuro-flat rounded-full w-16 h-16 flex items-center justify-center transition-all hover:neuro active:neuro-inset">
              <TrendingUp className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Combined Effects */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Combined Effects</h2>
        
        <div className="glass-elevated rounded-2xl p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Premium Dashboard</h3>
              <p className="text-sm text-muted-foreground">
                Combining glass effect with elevated shadow for depth
              </p>
            </div>
            <Badge className="glass-primary">
              Featured
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="neuro-flat rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">3.2M</div>
              <div className="text-sm text-muted-foreground">Total Streams</div>
            </div>
            <div className="neuro-flat rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-accent mb-1">89%</div>
              <div className="text-sm text-muted-foreground">Engagement</div>
            </div>
            <div className="neuro-flat rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-warning mb-1">$45K</div>
              <div className="text-sm text-muted-foreground">Revenue</div>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Guide */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Glassmorphism Classes:</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">glass</code> - Basic glass effect</li>
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">glass-strong</code> - Enhanced blur</li>
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">glass-subtle</code> - Minimal effect</li>
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">glass-card</code> - Card-specific glass</li>
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">glass-primary</code> - Primary color tint</li>
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">glass-glow</code> - Glass with hover glow</li>
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">glass-gradient</code> - Gradient border</li>
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">glass-elevated</code> - With shadow depth</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Neumorphism Classes:</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">neuro</code> - Raised surface</li>
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">neuro-inset</code> - Pressed/inset effect</li>
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">neuro-flat</code> - Subtle elevation</li>
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">neuro-primary</code> - Primary color style</li>
              </ul>
            </div>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Best Practices
              </h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Use glassmorphism for overlays and floating elements</li>
                <li>Neumorphism works best with consistent background colors</li>
                <li>Combine effects sparingly to avoid visual clutter</li>
                <li>Ensure sufficient contrast for accessibility</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}