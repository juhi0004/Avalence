"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ScrollProgress() {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const glowDotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (!progressBarRef.current) return;

      gsap.fromTo(
        progressBarRef.current,
        { width: "0%" },
        {
          width: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={progressBarRef}
      className="fixed top-0 left-0 h-[2px] z-[100] flex items-center justify-end"
      style={{
        background: "linear-gradient(90deg, #6C63FF, #C4C0FF, #6C63FF)",
        width: "0%",
      }}
    >
      {/* Glowing Dot at the right end */}
      <div
        ref={glowDotRef}
        className="w-[8px] h-[8px] rounded-full bg-[#6C63FF] translate-x-[4px]"
        style={{
          boxShadow: "0 0 8px #6C63FF, 0 0 16px #6C63FF",
        }}
      />
    </div>
  );
}
