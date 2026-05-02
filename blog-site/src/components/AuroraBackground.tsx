import { useEffect, useRef } from "react";

export default function AuroraBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const orbs = containerRef.current?.querySelectorAll(".aurora-orb");
      if (!orbs) return;

      orbs.forEach((orb, i) => {
        const speed = 0.03 + i * 0.02;
        const yOffset = scrollY * speed;
        (orb as HTMLElement).style.transform =
          i === 2
            ? `translate(calc(-50% + ${yOffset * 0.3}px), calc(-50% + ${yOffset * 0.2}px)) scale(${1 + Math.sin(scrollY * 0.001) * 0.05})`
            : `translate(${yOffset * (i % 2 === 0 ? 1 : -1) * 0.5}px, ${yOffset * 0.3}px) scale(${1 + Math.sin(scrollY * 0.0008 + i) * 0.03})`;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="aurora-container">
      <div className="aurora-orb orb-1" />
      <div className="aurora-orb orb-2" />
      <div className="aurora-orb orb-3" />
      <div className="aurora-orb orb-4" />
      <div className="aurora-orb orb-5" />
      <div className="aurora-noise" />
      <div className="aurora-grid" />
      <div className="scanline-overlay" />
    </div>
  );
}
