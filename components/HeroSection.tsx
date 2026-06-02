"use client";

import { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";

// Forced recompile to clear Turbopack cache

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



export default function HeroSection() {
  const sectionRef    = useRef<HTMLElement>(null);
  const watermarkRef  = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const headlineRef   = useRef<HTMLHeadingElement>(null);
  const subRef        = useRef<HTMLParagraphElement>(null);
  const ctaRef        = useRef<HTMLButtonElement>(null);

  const [showGlow,     setShowGlow]     = useState(false);
  const [showHint,     setShowHint]     = useState(true);
  const [hintVisible,  setHintVisible]  = useState(false); // delayed show
  const [transitionComplete, setTransitionComplete] = useState(false);
  const isDark = true;
  const lenis = useLenis();

  /* ── Brain click & Auto-scroll handler ── */
  const handleBurst = () => {
    if (transitionComplete) return;
    setShowGlow(true);
    setShowHint(false);
    setHintVisible(false);
    setTimeout(() => setShowGlow(false), 600);

    if (lenis) {
      lenis.scrollTo("#contact", { duration: 1.5, lock: false });
    } else {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Single scroll auto-play
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0 && window.scrollY < 50 && !transitionComplete) {
        handleBurst();
      }
    };
    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [lenis, transitionComplete]);

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
    if (lenis) {
      lenis.scrollTo("#contact", { duration: 1.5, lock: false });
    } else {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative w-full overflow-x-hidden flex flex-col items-center justify-center px-6 md:px-20"
      style={{
        height: "100vh", // Force exactly 1 viewport height
        paddingTop: "72px", // Account for navbar
        boxSizing: "border-box",
        pointerEvents: transitionComplete ? "none" : undefined,
      }}
    >
      {/* ── Dot Grid Background ── */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent 100%)"
        }}
      />
      {/* ── AVALENCE Watermark ── */}
      <div
        ref={watermarkRef}
        aria-hidden="true"
        className="hero-watermark absolute flex items-center justify-center pointer-events-none select-none"
        style={{ opacity: 0, zIndex: 20, left: "50%", transform: "translateX(-50%)" }}
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
        className="brain-canvas-wrap relative w-full cursor-pointer z-10"
        style={{ height: "45vh", opacity: 0, maxWidth: "600px", margin: "2vh auto 4vh", flexShrink: 1 }}
      >
        <BrainScene
          isDark={isDark}
          onBurst={handleBurst}
          onTransitionComplete={() => setTransitionComplete(true)}
          onTransitionReverse={() => setTransitionComplete(false)}
        />
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
                "radial-gradient(circle at 50% 40%, rgba(108,99,255,0.8) 0%, transparent 70%)",
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Inner content wrapper ── */}
      <div className="w-full flex flex-col items-center flex-grow" style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* ── Text Content ── */}
        <div className="relative z-10 text-center w-full flex flex-col items-center px-4">
          <h1
            ref={headlineRef}
            className="hero-headline font-bold tracking-tight text-white"
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
              group inline-flex items-center gap-3 mt-8
              px-10 py-4 rounded-full
              text-white text-[17px] font-semibold tracking-wide
              transition-all duration-500 ease-out
              active:scale-[0.96]
            "
            style={{ 
              opacity: 0,
              background: "linear-gradient(135deg, rgba(108, 99, 255, 0.9), rgba(74, 63, 191, 0.9))",
              boxShadow: "0 8px 32px rgba(108, 99, 255, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.2)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 12px 48px rgba(108, 99, 255, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.3)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(108, 99, 255, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.2)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <span>Start Your Project</span>
            <span className="text-xl transition-transform duration-300 group-hover:translate-x-1">→</span>
          </button>
        </div>
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
