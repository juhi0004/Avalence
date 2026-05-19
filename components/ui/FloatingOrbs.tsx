"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function FloatingOrbs() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const orbs = containerRef.current?.querySelectorAll(".floating-orb");
      if (!orbs) return;

      const animations = [
        { xRange: 30, yRange: 40, duration: 12, delay: 0 },
        { xRange: -25, yRange: 35, duration: 10, delay: 1.5 },
        { xRange: 35, yRange: -45, duration: 14, delay: 0.5 },
        { xRange: -30, yRange: -30, duration: 8, delay: 2 },
        { xRange: 20, yRange: 40, duration: 11, delay: 1 },
      ];

      orbs.forEach((orb, index) => {
        const anim = animations[index % animations.length];
        gsap.to(orb, {
          x: `+=${anim.xRange}`,
          y: `+=${anim.yRange}`,
          duration: anim.duration,
          delay: anim.delay,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    >
      {/* Orb 1 */}
      <div
        className="floating-orb absolute rounded-full bg-gradient-to-br from-[#6C63FF] to-transparent"
        style={{
          width: "600px",
          height: "600px",
          opacity: 0.07,
          top: "10%",
          left: "-10%",
          filter: "blur(120px)",
        }}
      />
      {/* Orb 2 */}
      <div
        className="floating-orb absolute rounded-full bg-gradient-to-br from-[#4A3FBF] to-transparent"
        style={{
          width: "400px",
          height: "400px",
          opacity: 0.08,
          top: "40%",
          right: "-5%",
          filter: "blur(100px)",
        }}
      />
      {/* Orb 3 */}
      <div
        className="floating-orb absolute rounded-full bg-gradient-to-br from-[#8B7FFF] to-transparent"
        style={{
          width: "500px",
          height: "500px",
          opacity: 0.05,
          top: "70%",
          left: "20%",
          filter: "blur(140px)",
        }}
      />
      {/* Orb 4 */}
      <div
        className="floating-orb absolute rounded-full bg-gradient-to-br from-[#6C63FF] to-transparent"
        style={{
          width: "300px",
          height: "300px",
          opacity: 0.06,
          top: "20%",
          right: "30%",
          filter: "blur(80px)",
        }}
      />
      {/* Orb 5 */}
      <div
        className="floating-orb absolute rounded-full bg-gradient-to-br from-[#4A3FBF] to-transparent"
        style={{
          width: "450px",
          height: "450px",
          opacity: 0.04,
          top: "85%",
          right: "10%",
          filter: "blur(120px)",
        }}
      />
    </div>
  );
}
