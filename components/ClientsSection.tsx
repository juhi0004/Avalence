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
      const revealObj = { value: 0 };

      if (!reducedMotion) {
        /* ── Arc Reveal Animation ── */
        gsap.fromTo(
          wrapperRef.current,
          { clipPath: "inset(0 50% 0 50%)" },
          {
            clipPath: "inset(0 0% 0 0%)",
            duration: 1.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
            },
          }
        );

        /* ── Value used for logo opacity fade-in ── */
        gsap.to(revealObj, {
          value: 1,
          duration: 1.5,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        });
      } else {
        revealObj.value = 1;
        if (wrapperRef.current) {
          wrapperRef.current.style.clipPath = "inset(0 0% 0 0%)";
        }
      }

      /* ── Continuous Arc Motion Ticker ── */
      const duration = 60; // Total loop time in seconds (very slow)

      const updateMotion = () => {
        const time = gsap.ticker.time;
        const progress = reducedMotion ? 0 : (time % duration) / duration;

        itemsRef.current.forEach((el, i) => {
          if (!el) return;
          
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
          const scale = 0.6 + 0.4 * Math.sin(t * Math.PI);

          // Opacity fades out at edges, multiplied by entrance reveal value
          const baseOpacity = Math.sin(t * Math.PI);
          const opacity = baseOpacity * 0.9 * revealObj.value;

          el.style.left = `${x}%`;
          el.style.top = `${y}px`;
          el.style.transform = `translate(-50%, -50%) scale(${scale})`;
          el.style.opacity = opacity.toString();
        });
      };

      gsap.ticker.add(updateMotion);

      // Force initial render to prevent flash of unstyled text
      updateMotion();

      return () => gsap.ticker.remove(updateMotion);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="clients"
      ref={sectionRef}
      className="relative w-full bg-black py-24 md:py-32 overflow-hidden"
    >
      <div className="max-w-4xl mx-auto text-center px-6 mb-16 md:mb-24">
        <h2 className="text-3xl md:text-[40px] font-bold text-white mb-4 tracking-tight">
          Trusted by Industry Leaders
        </h2>
        <p className="text-base md:text-lg text-text-muted">
          Powering Innovation for Companies Worldwide
        </p>
      </div>

      {/* ── Arc and Logos Container ── */}
      <div className="relative w-full h-[250px] max-w-7xl mx-auto">
        <div ref={wrapperRef} className="absolute inset-0 w-full h-full">
          {/* SVG Arc Line */}
          <svg
            viewBox="0 0 1000 200"
            preserveAspectRatio="none"
            className="absolute top-0 left-0 w-full h-[200px]"
          >
            <defs>
              <linearGradient id="arcLine" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="25%" stopColor="#6C63FF" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#6C63FF" stopOpacity="0.8" />
                <stop offset="75%" stopColor="#6C63FF" stopOpacity="0.3" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <path
              d="M 0,200 Q 500,-120 1000,200"
              fill="none"
              stroke="url(#arcLine)"
              strokeWidth="1.5"
            />
            {/* Soft glow behind the path */}
            <path
              d="M 0,200 Q 500,-120 1000,200"
              fill="none"
              stroke="url(#arcLine)"
              strokeWidth="12"
              style={{ filter: "blur(6px)", opacity: 0.4 }}
            />
          </svg>
        </div>

        {/* ── Rotating Logos ── */}
        {LOGOS.map((logo, index) => (
          <div
            key={logo}
            ref={(el) => {
              if (el) itemsRef.current[index] = el;
            }}
            className="absolute top-0 left-0 text-white font-bold tracking-wide whitespace-nowrap will-change-transform"
            style={{ fontSize: "clamp(24px, 4vw, 42px)", opacity: 0 }}
          >
            {logo}
          </div>
        ))}
      </div>
    </section>
  );
}
