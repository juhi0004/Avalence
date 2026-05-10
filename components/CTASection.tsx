"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion || !cardRef.current) return;

    const ctx = gsap.context(() => {
      /* ── Card Entrance Animation ── */
      gsap.fromTo(
        cardRef.current,
        { scale: 0.94, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 85%", // Triggers when the card is slightly in view
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToContact = () => {
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} className="w-full py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div
          ref={cardRef}
          className="relative w-full rounded-[24px] bg-black overflow-hidden flex items-center min-h-[420px] shadow-2xl"
          style={{
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          {/* ── Animated Fluid Gradient Background ── */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            {/* Primary Violet Blob */}
            <div
              className="absolute top-[-30%] right-[-10%] w-[70%] h-[120%] rounded-full opacity-50 mix-blend-screen"
              style={{
                background: "var(--av-primary)", // #6C63FF
                filter: "blur(100px)",
                animation: "blob1 15s infinite alternate ease-in-out",
              }}
            />
            {/* Secondary Darker Blob */}
            <div
              className="absolute bottom-[-30%] right-[10%] w-[60%] h-[110%] rounded-full opacity-60 mix-blend-screen"
              style={{
                background: "var(--av-secondary)", // #4A3FBF
                filter: "blur(120px)",
                animation: "blob2 18s infinite alternate ease-in-out",
                animationDelay: "-5s",
              }}
            />
          </div>

          {/* ── Dark Legibility Overlay ── */}
          <div className="absolute inset-0 z-0 bg-black/40 pointer-events-none" />

          {/* ── Content ── */}
          <div className="relative z-10 w-full px-8 py-16 md:px-16 md:py-20 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-3xl w-full">
              <h2 className="text-[32px] sm:text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] tracking-tight mb-10">
                <span className="font-normal block mb-2 sm:mb-3 text-white/90">
                  We turn bold ideas
                </span>
                <span className="font-extrabold block">
                  into powerful digital realities.
                </span>
              </h2>

              <button
                onClick={scrollToContact}
                className="
                  inline-flex items-center gap-2
                  px-8 py-3.5 rounded-full
                  bg-primary text-white text-sm font-semibold
                  transition-all duration-300
                  hover:shadow-[0_0_32px_rgba(108,99,255,0.5)]
                  hover:brightness-110
                  active:scale-[0.97]
                "
              >
                Let's work together
                <span className="text-lg leading-none transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </button>
            </div>
            
            {/* Optional right side column (currently empty for the gradient visual effect to show clearly) */}
            <div className="hidden lg:block w-full max-w-sm" />
          </div>
        </div>
      </div>

      {/* ── Internal Keyframes for CSS Blobs ── */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes blob1 {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(40px, -60px) scale(1.1); }
          66% { transform: translate(-30px, 30px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes blob2 {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(-40px, 50px) scale(0.9); }
          66% { transform: translate(30px, -30px) scale(1.15); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
      `}} />
    </section>
  );
}
