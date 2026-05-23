"use client";

export default function CircleDotsPreloader() {
  const dots = 6;
  const radius = 40;
  const dotRadius = 6;

  const getPosition = (index: number) => {
    const angle = (index / dots) * Math.PI * 2 - Math.PI / 2;
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    return { x, y };
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/95 backdrop-blur-sm z-50">
      <svg
        width="120"
        height="120"
        viewBox="0 0 100 100"
        className="drop-shadow-lg"
      >
        {/* Animated connecting lines */}
        <defs>
          <style>{`
            @keyframes drawLine {
              0% {
                stroke-dashoffset: 200;
              }
              100% {
                stroke-dashoffset: 0;
              }
            }

            @keyframes rotateLine {
              0% {
                transform: rotate(0deg);
                transform-origin: 50px 50px;
              }
              100% {
                transform: rotate(360deg);
                transform-origin: 50px 50px;
              }
            }

            @keyframes pulse {
              0%, 100% {
                r: 6;
                opacity: 1;
              }
              50% {
                r: 3;
                opacity: 0.4;
              }
            }

            .rotating-line {
              animation: rotateLine 3s linear infinite;
            }

            .pulse-dot {
              animation: pulse 1.5s ease-in-out infinite;
            }
          `}</style>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="currentColor" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Center circle */}
        <circle cx="50" cy="50" r="4" className="fill-primary" />

        {/* Lines from center to dots */}
        <g className="stroke-primary rotating-line" strokeWidth="1.5" opacity="0.6">
          {Array.from({ length: dots }).map((_, i) => {
            const pos = getPosition(i);
            return (
              <line
                key={`line-${i}`}
                x1="50"
                y1="50"
                x2={pos.x}
                y2={pos.y}
              />
            );
          })}
        </g>

        {/* Connecting outer circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.2"
        />

        {/* Animated dots */}
        {Array.from({ length: dots }).map((_, i) => {
          const pos = getPosition(i);
          const delay = i * 0.15;

          return (
            <g key={`dot-${i}`}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={dotRadius}
                className="fill-primary pulse-dot"
                style={{
                  animationDelay: `${delay}s`,
                }}
              />
              <circle
                cx={pos.x}
                cy={pos.y}
                r={dotRadius}
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.2"
                style={{
                  animation: `pulse ${1.5}s ease-in-out infinite`,
                  animationDelay: `${delay}s`,
                }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
