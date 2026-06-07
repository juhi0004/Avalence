"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

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
      <div className="content-container" style={{ maxWidth: "1400px" }}>
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
                background: "var(--accent)", // #BEA256
                filter: "blur(100px)",
                animation: "blob1 15s infinite alternate ease-in-out",
              }}
            />
            {/* Secondary Darker Blob */}
            <div
              className="absolute bottom-[-30%] right-[10%] w-[60%] h-[110%] rounded-full opacity-60 mix-blend-screen"
              style={{
                background: "var(--accent-dark)", // #8b7355
                filter: "blur(120px)",
                animation: "blob2 18s infinite alternate ease-in-out",
                animationDelay: "-5s",
              }}
            />
          </div>

          {/* ── Dark Legibility Overlay ── */}
          <div className="absolute inset-0 z-0 bg-black/40 pointer-events-none" />

          {/* ── Content ── */}
          <div className="cta-text relative z-10 w-full px-10 py-10 md:pl-[80px] md:pr-[60px] md:py-[60px] flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-3xl w-full">
              <h2 className="text-[32px] sm:text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] tracking-tight mb-10">
                <span className="font-normal block mb-2 sm:mb-3 text-[var(--text-secondary)]">
                  We turn bold ideas
                </span>
                <span className="font-extrabold block">
                  into powerful digital realities.
                </span>
              </h2>

              <motion.button
                onClick={scrollToContact}
                style={{
                  background: "rgba(190, 162, 86, 0.15)",
                  color: "#BEA256",
                  border: "1.5px solid rgba(190, 162, 86, 0.45)",
                  borderRadius: 12,
                  padding: "14px 36px",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 24,
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  boxShadow: "0 4px 24px rgba(190, 162, 86, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
                  transition: "all 0.3s ease",
                  letterSpacing: "0.3px",
                }}
                whileHover={{
                  background: "rgba(190, 162, 86, 0.28)",
                  boxShadow: "0 8px 32px rgba(190, 162, 86, 0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
                  borderColor: "rgba(190, 162, 86, 0.7)",
                }}
                whileTap={{ scale: 0.96 }}
              >
                Let's work together →
              </motion.button>
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
