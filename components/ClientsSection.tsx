"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LOGOS = ["injazat", "Lowe's", "Cognizant", "Trimble", "e2open", "Toyota"];

export default function ClientsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      // ── Entrance Reveal value using GSAP ScrollTrigger ──
      const revealObj = { value: 0 };
      gsap.to(revealObj, {
        value: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      // ── Continuous Arc Motion Ticker ──
      const duration = 60; // Total loop time in seconds

      const updateMotion = () => {
        const time = gsap.ticker.time;
        const progress = reducedMotion ? 0 : (time % duration) / duration;

        itemsRef.current.forEach((el, i) => {
          if (!el) return;
          
          const logoName = LOGOS[i];
          const isCenterPeak = logoName === "e2open" || logoName === "Toyota";
          const isEdgeItem = logoName === "Cognizant" || logoName === "Lowe's";

          // Spread logos evenly along the 0-1 path
          const t = (progress + i / LOGOS.length) % 1;
          const x = t * 100; // Percentage of width
          
          // Quadratic Bezier mapping: M 0,200 Q 500,-120 1000,200
          // Y(t) = (1-t)^2 * P0y + 2(1-t)t * P1y + t^2 * P2y
          const y =
            Math.pow(1 - t, 2) * 200 +
            2 * (1 - t) * t * -120 +
            Math.pow(t, 2) * 200;

          // Scale peaks at t=0.5 (center of arc)
          // Dynamically adjust scale & opacity based on active position on the arc
          const peakFactor = Math.sin(t * Math.PI); // 0 at edges, 1 at peak
          const scale = (isCenterPeak ? 0.95 : 0.75) + 0.2 * peakFactor;

          // Compute dynamic opacity relative to peak factor
          let baseOpacity = 0.6 + 0.3 * peakFactor;
          if (isEdgeItem) {
            baseOpacity = 0.6 * baseOpacity; // Edge items are more faded
          }

          const opacity = baseOpacity * revealObj.value;

          el.style.left = `${x}%`;
          el.style.top = `${y}px`;
          el.style.transform = `translate(-50%, -50%) scale(${scale})`;
          el.style.opacity = opacity.toString();
        });
      };

      gsap.ticker.add(updateMotion);
      updateMotion();

      return () => gsap.ticker.remove(updateMotion);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="clients"
      ref={sectionRef}
      className="section-wrapper"
    >
      <div className="content-container">
        {/* Header Block */}
        <div className="text-center w-full" style={{ marginBottom: "80px" }}>
          <h2 
            className="font-bold text-white tracking-tight"
            style={{
              fontSize: "clamp(28px, 3.5vw, 42px)",
              marginBottom: "12px",
              letterSpacing: "-0.01em",
              lineHeight: 1.2
            }}
          >
            Trusted by Industry Leaders
          </h2>
          <p 
            style={{
              fontSize: "15px",
              color: "rgba(255,255,255,0.4)",
              fontWeight: 400,
              letterSpacing: "0.02em",
              marginTop: "12px"
            }}
          >
            Powering Innovation for Companies Worldwide
          </p>
        </div>

        {/* Arc/Logos Area */}
        <div 
          className="relative w-full overflow-hidden"
          style={{
            marginTop: "60px",
            minHeight: "280px"
          }}
        >
          <div ref={wrapperRef} className="absolute inset-0 w-full h-full">
            {/* SVG Arc Line */}
            <svg
              viewBox="0 0 1000 200"
              preserveAspectRatio="none"
              className="absolute top-0 left-0 w-full h-[200px]"
            >
              <defs>
                {/* Linear Gradient for Stroke */}
                <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="25%" stopColor="#6C63FF" />
                  <stop offset="50%" stopColor="#8B7FFF" />
                  <stop offset="75%" stopColor="#6C63FF" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
                
                {/* SVG Gaussian Blur Glow Filter */}
                <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              
              {/* SVG Arc Path with Stroke Glow */}
              <path
                className="clients-arc-path"
                d="M 0,200 Q 500,-120 1000,200"
                fill="none"
                stroke="url(#arcGradient)"
                strokeWidth="1"
                style={{
                  opacity: 0.5,
                  filter: "url(#glowFilter)"
                }}
              />
            </svg>
          </div>

          {/* Rotating Logos */}
          {LOGOS.map((logo, index) => {
            const isCenterPeak = logo === "e2open" || logo === "Toyota";
            const isEdgeItem = logo === "Cognizant" || logo === "Lowe's";

            return (
              <div
                key={logo}
                ref={(el) => {
                  if (el) itemsRef.current[index] = el;
                }}
                className="clients-logo absolute top-0 left-0 text-white font-bold tracking-wide whitespace-nowrap will-change-transform cursor-default"
                style={{
                  fontSize: isCenterPeak
                    ? "calc(clamp(16px, 2vw, 22px) + 4px)"
                    : isEdgeItem
                    ? "clamp(14px, 1.8vw, 18px)"
                    : "clamp(16px, 2vw, 22px)",
                  fontWeight: 700,
                  color: "rgba(255, 255, 255, 0.85)",
                  transition: "color 200ms ease, opacity 200ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255, 255, 255, 0.85)";
                }}
              >
                {logo}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
