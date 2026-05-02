import { useState, useCallback, type MouseEvent, type ReactNode } from "react";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
}

export default function SpotlightCard({
  children,
  className = "",
  style,
  onClick,
}: SpotlightCardProps) {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  return (
    <div
      className={`glass-card ${className}`}
      style={{ position: "relative", ...style }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {/* Spotlight overlay — 聚光灯层 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1,
          background: `radial-gradient(600px circle at ${pos.x}% ${pos.y}%, rgba(255, 255, 255, 0.1), transparent 40%)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s ease",
          borderRadius: "inherit",
        }}
      />
      {/* Content wrapper — 确保文字在聚光灯之上 */}
      <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
    </div>
  );
}
