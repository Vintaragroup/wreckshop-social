# Design Effects Guide

This document explains the glassmorphism and neumorphism design effects available in the Wreckshop Records Entertainment Data System.

## Table of Contents
- [Glassmorphism](#glassmorphism)
- [Neumorphism](#neumorphism)
- [Combined Effects](#combined-effects)
- [Best Practices](#best-practices)
- [Examples](#examples)

---

## Glassmorphism

Glassmorphism creates a frosted glass effect with transparency, backdrop blur, and subtle borders. Perfect for modern, layered interfaces.

### Available Classes

#### Basic Glass Effects

**`.glass`** - Standard glass effect
```tsx
<Card className="glass rounded-xl">
  {/* content */}
</Card>
```
- Background: 10% transparency
- Backdrop blur: 10px
- Subtle white border

**`.glass-strong`** - Enhanced glass effect
```tsx
<Card className="glass-strong rounded-xl">
  {/* content */}
</Card>
```
- Background: 15% transparency
- Backdrop blur: 16px
- More prominent border

**`.glass-subtle`** - Minimal glass effect
```tsx
<Card className="glass-subtle rounded-xl">
  {/* content */}
</Card>
```
- Background: 5% transparency
- Backdrop blur: 8px
- Very subtle border

#### Colored Glass Effects

**`.glass-card`** - Card-optimized glass
```tsx
<div className="glass-card rounded-xl p-4">
  {/* Perfect for dashboard cards */}
</div>
```
- Optimized for card backgrounds
- Primary color border accent
- Depth shadow

**`.glass-primary`** - Primary color tint
```tsx
<div className="glass-primary rounded-xl p-4">
  {/* Purple-tinted glass */}
</div>
```
- Primary color (purple) tint
- Perfect for highlighting key information

**`.glass-accent`** - Accent color tint
```tsx
<div className="glass-accent rounded-xl p-4">
  {/* Green-tinted glass */}
</div>
```
- Accent color (green) tint
- Great for success states

#### Advanced Glass Effects

**`.glass-glow`** - Glass with hover glow
```tsx
<Card className="glass-glow rounded-xl">
  {/* Glows on hover */}
</Card>
```
- Glowing primary color shadow on hover
- Interactive feel
- Inset light effect

**`.glass-gradient`** - Glass with gradient border
```tsx
<Card className="glass-gradient rounded-xl">
  {/* Gradient border effect */}
</Card>
```
- Animated gradient border
- Uses pseudo-element technique
- High-end premium feel

**`.glass-elevated`** - Elevated glass with depth
```tsx
<div className="glass-elevated rounded-2xl p-8">
  {/* Maximum depth and presence */}
</div>
```
- Enhanced backdrop blur (20px)
- Deep shadow for elevation
- Inset border glow

### Light Mode Adjustments

All glass effects automatically adjust for light mode:
- Lighter backgrounds
- Adjusted border colors
- Softer shadows

---

## Neumorphism

Neumorphism creates soft, extruded plastic-looking elements with subtle shadows and highlights, giving a sense of physical depth.

### Available Classes

#### Basic Neumorphic Effects

**`.neuro`** - Raised surface
```tsx
<div className="neuro rounded-xl p-6">
  {/* Appears raised from the background */}
</div>
```
- Dual shadow system (light and dark)
- Raised appearance
- Works in light and dark modes

**`.neuro-inset`** - Pressed/inset effect
```tsx
<div className="neuro-inset rounded-xl p-4">
  {/* Appears pressed into the background */}
</div>
```
- Inverted shadows
- Pressed button appearance
- Great for active states

**`.neuro-flat`** - Subtle elevation
```tsx
<button className="neuro-flat rounded-xl">
  {/* Subtle raised effect */}
</button>
```
- Gentler shadow
- Perfect for buttons
- Hover and active states

#### Colored Neumorphism

**`.neuro-primary`** - Primary color style
```tsx
<div className="neuro-primary rounded-xl p-6 text-primary-foreground">
  {/* Purple gradient with neumorphic effect */}
</div>
```
- Primary color gradient
- Matching shadows
- High-impact elements

### Dark Mode Support

Neumorphic effects automatically adapt for dark mode:
- Adjusted shadow colors
- Darker base colors
- Maintained depth perception

---

## Combined Effects

Mix glassmorphism and neumorphism for unique designs:

### Glass Container with Neuro Elements

```tsx
<div className="glass-elevated rounded-2xl p-8">
  <h3>Premium Dashboard</h3>
  
  {/* Neumorphic stat cards inside glass container */}
  <div className="grid grid-cols-3 gap-4">
    <div className="neuro-flat rounded-xl p-4 text-center">
      <div className="text-2xl font-bold">3.2M</div>
      <div className="text-sm">Streams</div>
    </div>
    {/* More cards... */}
  </div>
</div>
```

### Interactive Neumorphic Buttons

```tsx
<button className="neuro-flat rounded-full w-16 h-16 
                   transition-all hover:neuro active:neuro-inset">
  <Icon className="w-6 h-6" />
</button>
```
- Normal: `neuro-flat` (subtle)
- Hover: `neuro` (more raised)
- Active: `neuro-inset` (pressed)

---

## Best Practices

### Glassmorphism

✅ **DO:**
- Use for overlays, modals, and floating elements
- Ensure content behind has sufficient variation for blur effect
- Combine with rounded corners (`rounded-xl`, `rounded-2xl`)
- Use sparingly for emphasis
- Test contrast for accessibility

❌ **DON'T:**
- Overuse on the same page
- Use on plain single-color backgrounds (blur won't show)
- Forget about text contrast
- Mix too many glass variants together

### Neumorphism

✅ **DO:**
- Use on consistent background colors
- Maintain subtle shadows
- Use for buttons, cards, and controls
- Combine with smooth transitions
- Ensure sufficient spacing between elements

❌ **DON'T:**
- Use on complex backgrounds
- Make shadows too harsh
- Overuse on small elements
- Forget hover/active states
- Sacrifice accessibility for style

### General Guidelines

1. **Consistency**: Pick a primary effect style for your section
2. **Hierarchy**: Use stronger effects for more important elements
3. **Accessibility**: Always maintain WCAG contrast ratios
4. **Performance**: Glass effects use backdrop-filter, be mindful of performance on older devices
5. **Spacing**: Both effects need breathing room

---

## Examples

### Dashboard Stats with Glass

```tsx
<div className="grid grid-cols-4 gap-4">
  <div className="glass-card rounded-xl p-4">
    <div className="flex items-center justify-between">
      <div>
        <div className="text-2xl font-bold text-primary">2.4K</div>
        <div className="text-sm text-muted-foreground">Total Fans</div>
      </div>
      <Users className="w-8 h-8 text-primary/50" />
    </div>
  </div>
  {/* More cards... */}
</div>
```

### Modal Preview Card

```tsx
<Card className="glass-primary rounded-xl">
  <CardContent className="p-4">
    <div className="flex items-start gap-2">
      <Music className="w-5 h-5 text-primary" />
      <div>
        <h4 className="text-sm font-medium mb-1">Release Preview</h4>
        <p className="text-xs text-muted-foreground">
          Your release details will appear here
        </p>
      </div>
    </div>
  </CardContent>
</Card>
```

### Neumorphic Control Panel

```tsx
<div className="neuro rounded-xl p-6">
  <h3 className="font-semibold mb-4">Neumorphic Controls</h3>
  <div className="grid grid-cols-4 gap-4">
    <button className="neuro-flat rounded-full w-16 h-16 
                       flex items-center justify-center 
                       transition-all hover:neuro active:neuro-inset">
      <Users className="w-6 h-6" />
    </button>
    {/* More buttons... */}
  </div>
</div>
```

### Premium Feature Card

```tsx
<div className="glass-elevated rounded-2xl p-8">
  <div className="flex items-start justify-between mb-6">
    <div>
      <h3 className="text-xl font-semibold mb-2">Premium Dashboard</h3>
      <p className="text-sm text-muted-foreground">
        Combining glass effect with elevated shadow for depth
      </p>
    </div>
    <Badge className="glass-primary">Featured</Badge>
  </div>
  
  <div className="grid grid-cols-3 gap-4">
    <div className="neuro-flat rounded-xl p-4 text-center">
      <div className="text-2xl font-bold text-primary">3.2M</div>
      <div className="text-sm text-muted-foreground">Total Streams</div>
    </div>
    {/* More stats... */}
  </div>
</div>
```

---

## Showcase Component

To see all effects in action, navigate to the showcase page in your application or import the `GlassNeuroShowcase` component:

```tsx
import { GlassNeuroShowcase } from "./components/glass-neuro-showcase";

// In your app
<GlassNeuroShowcase />
```

This displays all available effects with live examples and interactive demonstrations.

---

## Technical Details

### CSS Implementation

All effects are implemented as utility classes in `/styles/globals.css`:

- Uses CSS custom properties for theming
- Automatically adapts to light/dark modes
- Utilizes `backdrop-filter` for glass effects
- Employs multiple `box-shadow` layers for neumorphism
- Supports pseudo-elements for gradient borders

### Browser Support

**Glassmorphism:**
- Modern browsers with backdrop-filter support
- Fallback: solid colors without blur

**Neumorphism:**
- All modern browsers
- Uses standard box-shadow (widely supported)

### Performance Considerations

- `backdrop-filter` can impact performance on complex layouts
- Use glass effects on fewer elements for better performance
- Neumorphic shadows are more performant than backdrop blur
- Test on target devices, especially mobile

---

## Color Scheme Integration

All effects integrate seamlessly with the Music Tech Purple color scheme:

- **Primary**: `#7C3AED` (Deep Violet)
- **Accent**: `#22C55E` (Green)
- **Warning**: `#F59E0B` (Amber)
- **Destructive**: `#EF4444` (Red)

Effects automatically use these colors and adapt to your theme settings.
