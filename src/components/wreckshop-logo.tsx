/**
 * Wreckshop Logo Placeholder Component
 * Uses brand colors (purple/green) with music-themed icon
 * Professional and fun design for auth pages
 */

interface WreckshopLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  animated?: boolean;
}

export function WreckshopLogo({ 
  size = 'md', 
  showText = true,
  animated = true 
}: WreckshopLogoProps) {
  const sizeMap = {
    sm: { icon: 32, text: 14 },
    md: { icon: 48, text: 20 },
    lg: { icon: 64, text: 28 },
  };

  const { icon: iconSize, text: textSize } = sizeMap[size];

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Logo Icon - Waveform + Music Note Mashup */}
      <div 
        className={`relative flex items-center justify-center ${
          animated ? 'animate-pulse' : ''
        }`}
        style={{ width: iconSize, height: iconSize }}
      >
        {/* Background circle with gradient */}
        <div 
          className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 opacity-20 blur-lg"
          style={{
            animation: animated ? 'pulse-subtle 3s ease-in-out infinite' : 'none',
          }}
        />

        {/* Main Logo SVG */}
        <svg
          viewBox="0 0 100 100"
          width={iconSize}
          height={iconSize}
          className="relative z-10 drop-shadow-lg"
          style={{
            animation: animated ? 'float 3s ease-in-out infinite' : 'none',
          }}
        >
          {/* Waveform background */}
          <g className="fill-primary opacity-30">
            <rect x="10" y="45" width="6" height="10" rx="1" />
            <rect x="22" y="35" width="6" height="30" rx="1" />
            <rect x="34" y="40" width="6" height="20" rx="1" />
            <rect x="46" y="30" width="6" height="40" rx="1" />
            <rect x="58" y="35" width="6" height="30" rx="1" />
            <rect x="70" y="42" width="6" height="16" rx="1" />
            <rect x="82" y="45" width="6" height="10" rx="1" />
          </g>

          {/* Main music note symbol (double eighth notes) */}
          <g className="fill-primary">
            {/* Left note head */}
            <ellipse cx="30" cy="70" rx="5" ry="6" transform="rotate(-20 30 70)" />
            {/* Left stem */}
            <rect x="33" y="25" width="2" height="45" className="fill-primary" />

            {/* Right note head */}
            <ellipse cx="55" cy="75" rx="5" ry="6" transform="rotate(-20 55 75)" />
            {/* Right stem */}
            <rect x="58" y="20" width="2" height="55" className="fill-primary" />

            {/* Connecting beam */}
            <path
              d="M 35 25 Q 50 15 60 20 L 60 23 Q 50 18 35 28 Z"
              className="fill-primary"
            />
          </g>

          {/* Accent spark (accent color) */}
          <g className="fill-accent opacity-80">
            <circle cx="75" cy="20" r="3" />
            <path d="M 75 15 L 75 25 M 70 20 L 80 20" className="stroke-accent stroke-1" fill="none" />
          </g>
        </svg>
      </div>

      {/* Text */}
      {showText && (
        <div className="text-center">
          <h1
            className="font-black text-primary leading-tight tracking-tight"
            style={{ fontSize: `${textSize}px` }}
          >
            Wreckshop
          </h1>
          <p className="text-xs text-muted-foreground font-medium tracking-wide">
            ARTIST PLATFORM
          </p>
        </div>
      )}

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes pulse-subtle {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.35;
          }
        }
      `}</style>
    </div>
  );
}
