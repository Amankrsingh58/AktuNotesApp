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
      <svg width="120" height="120" viewBox="0 0 100 100">
        {Array.from({ length: dots }).map((_, index) => {
          const { x, y } = getPosition(index);
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r={dotRadius}
              fill="currentColor"
              className="fill-primary"
              style={{
                animation: `fade 1.5s ease-in-out ${index * 0.25}s infinite`,
              }}
            />
          );
        })}
        <style>{`
          @keyframes fade {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }
        `}</style>
      </svg>
    </div>
  );
}
