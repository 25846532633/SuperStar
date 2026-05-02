import { useState, useEffect, useRef } from "react";

export default function CursorGlow() {
  const [pos, setPos] = useState({ x: -500, y: -500 });
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };

    let rafId: number;

    const animate = () => {
      // Lerp easing: 每次 frame 向目标靠近 15%，约 0.1s 延迟
      const dx = target.current.x - current.current.x;
      const dy = target.current.y - current.current.y;
      current.current.x += dx * 0.15;
      current.current.y += dy * 0.15;
      setPos({ x: current.current.x, y: current.current.y });
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9998,
        background: `radial-gradient(300px circle at ${pos.x}px ${pos.y}px, rgba(0, 240, 255, 0.05), transparent 60%)`,
      }}
    />
  );
}
