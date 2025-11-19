interface LogoProps {
  size?: "tiny" | "small" | "medium" | "large";
  showText?: boolean;
  animate?: boolean;
  enableHover?: boolean;
  className?: string;
}

export function Logo({ size = "medium", showText = true, animate = false, enableHover = false, className = "" }: LogoProps) {
  const sizes = {
    tiny: { icon: 24, text: "text-xs" },
    small: { icon: 32, text: "text-sm" },
    medium: { icon: 48, text: "text-base" },
    large: { icon: 64, text: "text-xl" },
  } as const;

  const iconSize = sizes[size].icon;
  const textSize = sizes[size].text;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`relative ${enableHover ? "logo-hover-container" : ""}`}
        style={{ width: iconSize, height: iconSize }}
      >
        <style>
          {`
            @keyframes logo-pulse {
              0%, 100% { opacity: 0.95; }
              50% { opacity: 1; }
            }
            @keyframes logo-glow-pulse {
              0%, 100% { filter: drop-shadow(0 0 8px rgba(0, 207, 255, 0.4)) drop-shadow(0 0 16px rgba(255, 0, 168, 0.3)); }
              50% { filter: drop-shadow(0 0 12px rgba(0, 207, 255, 0.6)) drop-shadow(0 0 24px rgba(255, 0, 168, 0.5)); }
            }
            @keyframes logo-glow-pulse-hover {
              0%, 100% { filter: drop-shadow(0 0 12px rgba(0, 207, 255, 0.7)) drop-shadow(0 0 24px rgba(255, 0, 168, 0.6)); }
              50% { filter: drop-shadow(0 0 16px rgba(0, 207, 255, 0.9)) drop-shadow(0 0 32px rgba(255, 0, 168, 0.8)); }
            }
            @keyframes wave-bar-1 {
              0%, 100% { transform: scaleY(1); transform-origin: center; }
              25% { transform: scaleY(0.7); transform-origin: center; }
              50% { transform: scaleY(1); transform-origin: center; }
              75% { transform: scaleY(0.85); transform-origin: center; }
            }
            @keyframes wave-bar-1-fast {
              0%, 100% { transform: scaleY(1); transform-origin: center; }
              25% { transform: scaleY(0.6); transform-origin: center; }
              50% { transform: scaleY(1.1); transform-origin: center; }
              75% { transform: scaleY(0.8); transform-origin: center; }
            }
            @keyframes wave-bar-2 {
              0%, 100% { transform: scaleY(1); transform-origin: center; }
              20% { transform: scaleY(0.6); transform-origin: center; }
              40% { transform: scaleY(1); transform-origin: center; }
              80% { transform: scaleY(0.75); transform-origin: center; }
            }
            @keyframes wave-bar-2-fast {
              0%, 100% { transform: scaleY(1); transform-origin: center; }
              20% { transform: scaleY(0.5); transform-origin: center; }
              40% { transform: scaleY(1.15); transform-origin: center; }
              80% { transform: scaleY(0.7); transform-origin: center; }
            }
            @keyframes wave-bar-3 {
              0%, 100% { transform: scaleY(1); transform-origin: center; }
              30% { transform: scaleY(0.5); transform-origin: center; }
              60% { transform: scaleY(1); transform-origin: center; }
              90% { transform: scaleY(0.7); transform-origin: center; }
            }
            @keyframes wave-bar-3-fast {
              0%, 100% { transform: scaleY(1); transform-origin: center; }
              30% { transform: scaleY(0.4); transform-origin: center; }
              60% { transform: scaleY(1.2); transform-origin: center; }
              90% { transform: scaleY(0.65); transform-origin: center; }
            }
            @keyframes wave-bar-center {
              0%, 100% { transform: scaleY(1); transform-origin: center; }
              33% { transform: scaleY(0.85); transform-origin: center; }
              66% { transform: scaleY(1.1); transform-origin: center; }
            }
            @keyframes wave-bar-center-fast {
              0%, 100% { transform: scaleY(1); transform-origin: center; }
              33% { transform: scaleY(0.75); transform-origin: center; }
              66% { transform: scaleY(1.2); transform-origin: center; }
            }
            @keyframes logo-breathe {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.03); }
            }
            @keyframes gradient-rotate {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes particle-orbit-1 {
              0% { transform: rotate(0deg) translateX(32px) rotate(0deg); opacity: 0.6; }
              50% { opacity: 1; }
              100% { transform: rotate(360deg) translateX(32px) rotate(-360deg); opacity: 0.6; }
            }
            @keyframes particle-orbit-2 {
              0% { transform: rotate(120deg) translateX(32px) rotate(-120deg); opacity: 0.6; }
              50% { opacity: 1; }
              100% { transform: rotate(480deg) translateX(32px) rotate(-480deg); opacity: 0.6; }
            }
            @keyframes particle-orbit-3 {
              0% { transform: rotate(240deg) translateX(32px) rotate(-240deg); opacity: 0.6; }
              50% { opacity: 1; }
              100% { transform: rotate(600deg) translateX(32px) rotate(-600deg); opacity: 0.6; }
            }
            .logo-animated .logo-circle {
              animation: logo-pulse 3s ease-in-out infinite;
            }
            .logo-animated .logo-glow {
              animation: logo-glow-pulse 3s ease-in-out infinite;
            }
            .logo-animated .logo-breathe {
              animation: logo-breathe 4s ease-in-out infinite;
            }
            .logo-animated .gradient-rotate-container {
              animation: gradient-rotate 20s linear infinite;
            }
            .logo-animated .wave-center {
              animation: wave-bar-center 1.2s ease-in-out infinite;
            }
            .logo-animated .wave-left-1 {
              animation: wave-bar-1 1.5s ease-in-out infinite;
            }
            .logo-animated .wave-left-2 {
              animation: wave-bar-2 1.8s ease-in-out infinite;
            }
            .logo-animated .wave-right-1 {
              animation: wave-bar-1 1.5s ease-in-out infinite 0.3s;
            }
            .logo-animated .wave-right-2 {
              animation: wave-bar-3 1.8s ease-in-out infinite 0.2s;
            }
            .logo-hover-container:hover .logo-circle {
              animation: logo-pulse 1.5s ease-in-out infinite;
            }
            .logo-hover-container:hover .logo-glow {
              animation: logo-glow-pulse-hover 1.5s ease-in-out infinite;
            }
            .logo-hover-container:hover .logo-breathe {
              animation: logo-breathe 2s ease-in-out infinite;
            }
            .logo-hover-container:hover .gradient-rotate-container {
              animation: gradient-rotate 8s linear infinite;
            }
            .logo-hover-container:hover .wave-center {
              animation: wave-bar-center-fast 0.6s ease-in-out infinite;
            }
            .logo-hover-container:hover .wave-left-1 {
              animation: wave-bar-1-fast 0.75s ease-in-out infinite;
            }
            .logo-hover-container:hover .wave-left-2 {
              animation: wave-bar-2-fast 0.9s ease-in-out infinite;
            }
            .logo-hover-container:hover .wave-right-1 {
              animation: wave-bar-1-fast 0.75s ease-in-out infinite 0.15s;
            }
            .logo-hover-container:hover .wave-right-2 {
              animation: wave-bar-3-fast 0.9s ease-in-out infinite 0.1s;
            }
            @media (prefers-reduced-motion: reduce) {
              .logo-animated .logo-circle,
              .logo-animated .logo-glow,
              .logo-animated .logo-breathe,
              .logo-animated .gradient-rotate-container,
              .logo-animated .wave-center,
              .logo-animated .wave-left-1,
              .logo-animated .wave-left-2,
              .logo-animated .wave-right-1,
              .logo-animated .wave-right-2,
              .logo-hover-container:hover .logo-circle,
              .logo-hover-container:hover .logo-glow,
              .logo-hover-container:hover .logo-breathe,
              .logo-hover-container:hover .gradient-rotate-container,
              .logo-hover-container:hover .wave-center,
              .logo-hover-container:hover .wave-left-1,
              .logo-hover-container:hover .wave-left-2,
              .logo-hover-container:hover .wave-right-1,
              .logo-hover-container:hover .wave-right-2 {
                animation: none !important;
              }
            }
          `}
        </style>
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={animate || enableHover ? "logo-animated" : ""}
        >
          <defs>
            <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00CFFF" />
              <stop offset="100%" stopColor="#FF00A8" />
            </linearGradient>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00CFFF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FF00A8" stopOpacity="0.9" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="innerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00CFFF" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#FF00A8" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#FF00A8" stopOpacity="0" />
            </radialGradient>
          </defs>
          <g className="logo-breathe">
            <g className="gradient-rotate-container" transform-origin="32 32">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="url(#circleGradient)"
                strokeWidth="3"
                fill="transparent"
                className="logo-circle logo-glow"
              />
              <circle cx="32" cy="32" r="24" fill="url(#innerGlow)" opacity="0.4" />
            </g>
            <rect
              x="29"
              y="18"
              width="6"
              height="28"
              rx="3"
              stroke="url(#waveGradient)"
              strokeWidth="2"
              fill="none"
              opacity="0.95"
              className="wave-center"
            />
            <rect
              x="20"
              y="24"
              width="5"
              height="16"
              rx="2.5"
              stroke="url(#waveGradient)"
              strokeWidth="2"
              fill="none"
              opacity="0.8"
              className="wave-left-1"
            />
            <rect
              x="11"
              y="28"
              width="5"
              height="8"
              rx="2.5"
              stroke="url(#waveGradient)"
              strokeWidth="2"
              fill="none"
              opacity="0.6"
              className="wave-left-2"
            />
            <rect
              x="39"
              y="24"
              width="5"
              height="16"
              rx="2.5"
              stroke="url(#waveGradient)"
              strokeWidth="2"
              fill="none"
              opacity="0.8"
              className="wave-right-1"
            />
            <rect
              x="48"
              y="28"
              width="5"
              height="8"
              rx="2.5"
              stroke="url(#waveGradient)"
              strokeWidth="2"
              fill="none"
              opacity="0.6"
              className="wave-right-2"
            />
            <circle cx="32" cy="28" r="18" fill="url(#circleGradient)" opacity="0.05" />
          </g>
        </svg>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`uppercase tracking-tight leading-none ${textSize}`}>
            Wreckshop Social
          </span>
          {size !== "tiny" && size !== "small" && (
            <span className="text-xs text-muted-foreground leading-none mt-1">
              Music Marketing Platform
            </span>
          )}
        </div>
      )}
    </div>
  );
}
