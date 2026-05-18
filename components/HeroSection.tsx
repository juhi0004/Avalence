"use client";

import { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ── Dynamic import for R3F (no SSR) ── */
const BrainScene = dynamic(() => import("./three/BrainScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#6C63FF] border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

/* ── Stats data ── */
const STATS = [
  { value: "50+",  label: "Projects Delivered"  },
  { value: "100%", label: "Client Satisfaction"  },
  { value: "24/7", label: "Support Available"    },
] as const;

export default function HeroSection() {
  const sectionRef    = useRef<HTMLElement>(null);
  const watermarkRef  = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const headlineRef   = useRef<HTMLHeadingElement>(null);
  const subRef        = useRef<HTMLParagraphElement>(null);
  const ctaRef        = useRef<HTMLButtonElement>(null);
  const statsRef      = useRef<HTMLDivElement>(null);

  const [burstTrigger, setBurstTrigger] = useState(0);
  const [showGlow,     setShowGlow]     = useState(false);
  const [showHint,     setShowHint]     = useState(true);
  const [hintVisible,  setHintVisible]  = useState(false); // delayed show

  /* ── Brain click handler ── */
  const handleBurst = () => {
    setBurstTrigger((p) => p + 1);
    setShowGlow(true);
    setShowHint(false);
    setHintVisible(false);
    setTimeout(() => setShowGlow(false), 600);
  };

  /* ── GSAP master timeline ── */
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) {
      // Snap everything visible
      if (watermarkRef.current)  watermarkRef.current.style.opacity  = "0.04";
      if (canvasWrapRef.current) canvasWrapRef.current.style.opacity  = "1";
      if (headlineRef.current)   { headlineRef.current.style.opacity  = "1"; headlineRef.current.style.transform = "none"; }
      if (subRef.current)        subRef.current.style.opacity        = "1";
      if (ctaRef.current)        ctaRef.current.style.opacity        = "1";
      if (statsRef.current) {
        Array.from(statsRef.current.children).forEach((c) => {
          (c as HTMLElement).style.opacity = "1";
        });
      }
      setHintVisible(true);
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      /* ────────────────────────────────────────────────
         STEP 1 — "AVALENCE" enters full white (t=0)
         watermarkRef starts at: opacity 0, scale 1
         Animate → opacity 1 over 0.6s
      ──────────────────────────────────────────────── */
      tl.fromTo(
        watermarkRef.current,
        { opacity: 0, scale: 1 },
        { opacity: 1,  scale: 1, duration: 0.6 },
        0
      );

      /* ────────────────────────────────────────────────
         STEP 2 — After 0.8s: "AVALENCE" sinks into bg
         Scale 1 → 1.3, opacity 1 → 0.04, duration 1.2s
      ──────────────────────────────────────────────── */
      tl.to(
        watermarkRef.current,
        {
          scale:    1.3,
          opacity:  0.04,
          duration: 1.2,
          ease:     "power2.inOut",
          onComplete: () => {
            // Lock it here permanently as decorative watermark
            if (watermarkRef.current) {
              watermarkRef.current.style.zIndex = "0";
            }
          },
        },
        0.8
      );

      /* ────────────────────────────────────────────────
         STEP 3 — Brain canvas fades in as watermark sinks
      ──────────────────────────────────────────────── */
      tl.fromTo(
        canvasWrapRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.0 },
        1.2
      );

      /* STEP 3b — Headline */
      tl.fromTo(
        headlineRef.current,
        { y: 30, opacity: 0 },
        { y: 0,  opacity: 1, duration: 0.9 },
        1.5
      );

      /* STEP 3c — Subheadline */
      tl.fromTo(
        subRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0,  duration: 0.8 },
        1.7
      );

      /* STEP 3d — CTA button */
      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0,  duration: 0.7 },
        1.9
      );

      /* STEP 3e — Stats stagger */
      if (statsRef.current) {
        tl.fromTo(
          statsRef.current.children,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.15 },
          2.1
        );
      }

      /* ────────────────────────────────────────────────
         Scroll — watermark continues fading from 0.04 → 0
      ──────────────────────────────────────────────── */
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start:   "top top",
        end:     "30% top",
        scrub:   true,
        animation: gsap.fromTo(
          watermarkRef.current,
          { opacity: 0.04 },
          { opacity: 0    }
        ),
      });
    }, sectionRef);

    // Show "click to awaken" hint after brain has faded in (~2.4s)
    const hintTimer = setTimeout(() => setHintVisible(true), 2600);

    return () => {
      ctx.revert();
      clearTimeout(hintTimer);
    };
  }, []);

  /* ── Smooth scroll to contact ── */
  const scrollToContact = () => {
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative w-full bg-black overflow-x-hidden flex flex-col items-center justify-between"
      style={{ minHeight: "max(100vh, 900px)", paddingTop: "72px" }}
    >
      {/* ── AVALENCE Watermark ── */}
      <div
        ref={watermarkRef}
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        style={{ opacity: 0, zIndex: 20 }}
      >
        <span
          className="font-black text-white whitespace-nowrap"
          style={{
            fontSize:      "clamp(100px, 18vw, 220px)",
            fontWeight:    900,
            letterSpacing: "0.08em",
          }}
        >
          AVALENCE
        </span>
      </div>

      {/* ── 3D Brain Canvas ── */}
      <div
        ref={canvasWrapRef}
        onClick={handleBurst}
        className="relative w-full cursor-pointer z-10 flex-shrink-0"
        style={{ height: "50vh", opacity: 0 }}
      >
        <BrainScene burstTrigger={burstTrigger} />
      </div>

      {/* ── "Click to Awaken" Hint (16px below canvas) ── */}
      <AnimatePresence>
        {showHint && hintVisible && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
            className="z-10 text-center select-none pointer-events-none"
            style={{
              fontSize:      "12px",
              color:         "rgba(255,255,255,0.3)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginTop:     "16px",
              animation:     "hintPulse 2s ease-in-out infinite",
            }}
          >
            click to awaken ↓
          </motion.p>
        )}
      </AnimatePresence>

      {/* ── Glow Flash ── */}
      <AnimatePresence>
        {showGlow && (
          <motion.div
            key="glow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-20 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 50% 40%, rgba(108,99,255,0.5) 0%, transparent 70%)",
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Text Content ── */}
      <div className="relative z-10 text-center px-6 flex flex-col items-center">
        <h1
          ref={headlineRef}
          className="font-bold tracking-tight text-white"
          style={{
            fontSize:   "clamp(36px, 5vw, 64px)",
            lineHeight: 1.15,
            maxWidth:   "800px",
            opacity:    0,
          }}
        >
          Building Intelligent Solutions{" "}
          <span
            style={{
              background:             "linear-gradient(135deg, #6C63FF, #4A3FBF)",
              WebkitBackgroundClip:   "text",
              WebkitTextFillColor:    "transparent",
              backgroundClip:         "text",
            }}
          >
            That Matter
          </span>
        </h1>

        <p
          ref={subRef}
          style={{
            fontSize:   "17px",
            color:      "rgba(255,255,255,0.55)",
            maxWidth:   "560px",
            margin:     "16px auto 0",
            lineHeight: 1.7,
            opacity:    0,
          }}
        >
          We empower organizations with AI that turns complex challenges into
          real-world outcomes.
        </p>

        <button
          ref={ctaRef}
          onClick={scrollToContact}
          className="
            inline-flex items-center gap-2 mt-8
            px-7 py-3 rounded-full
            bg-[#6C63FF] text-white text-sm font-semibold
            transition-all duration-300
            hover:shadow-[0_0_32px_rgba(108,99,255,0.5)]
            hover:bg-[#5a52e0]
            active:scale-[0.97]
          "
          style={{ opacity: 0 }}
        >
          Start Your Project
          <span className="text-base">→</span>
        </button>
      </div>

      {/* ── Stats Row ── */}
      <div
        ref={statsRef}
        className="relative z-10 w-full flex flex-wrap justify-center items-center
          border-t border-white/[0.06]"
        style={{ gap: "0", paddingBottom: "0" }}
      >
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className="flex flex-col items-center justify-center py-6 px-8 sm:px-12"
            style={{
              opacity:     0,
              textAlign:   "center",
              borderRight: i < STATS.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none",
            }}
          >
            <span
              className="text-white"
              style={{ fontSize: "36px", fontWeight: 800, lineHeight: 1 }}
            >
              {stat.value}
            </span>
            <span
              style={{
                fontSize:   "13px",
                color:      "rgba(255,255,255,0.5)",
                marginTop:  "4px",
                whiteSpace: "nowrap",
              }}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* ── CSS for hint pulse ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes hintPulse {
          0%, 100% { opacity: 0.2; }
          50%       { opacity: 0.6; }
        }
      `}} />
    </section>
  );
}
