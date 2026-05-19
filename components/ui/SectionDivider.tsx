"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SectionDivider() {
  const lineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (!lineRef.current) return;

      gsap.fromTo(
        lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 95%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full flex items-center justify-center overflow-visible pointer-events-none select-none h-[80px] md:h-[120px] lg:h-[160px]"
    >
      {/* ── Cinematic Ambient Glow ── */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-[800px] h-[150px] rounded-[100%] opacity-40 mix-blend-screen"
        style={{
          background: "radial-gradient(ellipse at center, rgba(108,99,255,0.3) 0%, rgba(74,63,191,0.1) 40%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* ── Floating Blurred Orb ── */}
      <div 
        className="absolute top-1/2 left-[40%] -translate-y-1/2 w-[100px] h-[100px] rounded-full opacity-30 animate-[float-slow_6s_infinite_alternate_ease-in-out]"
        style={{
          background: "radial-gradient(circle, #8B7FFF, transparent)",
          filter: "blur(24px)",
        }}
      />

      {/* ── Expanding Horizontal Beam ── */}
      <div
        ref={lineRef}
        className="relative z-10 w-full max-w-[80%] h-[1px] origin-center"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(108,99,255,0.8) 50%, transparent 100%)",
          boxShadow: "0 0 20px rgba(108,99,255,0.5)",
        }}
      />

      {/* ── Center Diamond ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-8 h-8">
        <span
          className="text-[#8B7FFF] text-[12px]"
          style={{
            textShadow: "0 0 12px rgba(108,99,255,1)",
          }}
        >
          ◆
        </span>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float-slow {
          0% { transform: translateY(-50%) translateX(0) scale(1); }
          50% { transform: translateY(calc(-50% - 20px)) translateX(20px) scale(1.1); }
          100% { transform: translateY(-50%) translateX(0) scale(1); }
        }
      `}} />
    </div>
  );
}
