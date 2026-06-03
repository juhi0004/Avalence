"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // ScrollTrigger animations are now handled by ParallaxController

  const scrollToContact = () => {
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} id="cta" className="section-wrapper" style={{ paddingTop: "60px", paddingBottom: "20px" }}>
      <div className="content-container">
        <div
          ref={cardRef}
          className="cta-banner relative w-full rounded-[24px] bg-black overflow-hidden flex items-center min-h-[420px] shadow-2xl m-0"
          style={{
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          {/* ── Animated Fluid Gradient Background ── */}
          <div className="cta-blob absolute inset-0 z-0 pointer-events-none overflow-hidden">
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
          <div className="cta-text relative z-10 w-full px-7 py-10 md:p-[60px] flex flex-col md:flex-row items-center justify-between gap-12">
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
                  group inline-flex items-center gap-3
                  px-10 py-4 rounded-full
                  text-white text-[16px] font-semibold tracking-wide
                  transition-all duration-500 ease-out
                  active:scale-[0.96]
                "
                style={{
                  background: "linear-gradient(135deg, rgba(108, 99, 255, 0.35), rgba(74, 63, 191, 0.35))",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  boxShadow: "0 8px 32px rgba(108, 99, 255, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.25)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 12px 48px rgba(108, 99, 255, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.35)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(108, 99, 255, 0.5), rgba(74, 63, 191, 0.5))";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(108, 99, 255, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.25)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(108, 99, 255, 0.35), rgba(74, 63, 191, 0.35))";
                }}
              >
                <span>Let's work together</span>
                <span className="text-xl leading-none transition-transform duration-300 group-hover:translate-x-1">
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
