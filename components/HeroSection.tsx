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
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

/* ── Stats data ── */
const STATS = [
  { value: "50+", label: "Projects Delivered" },
  { value: "100%", label: "Client Satisfaction" },
  { value: "24/7", label: "Support Available" },
] as const;

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const [burstTrigger, setBurstTrigger] = useState(0);
  const [showGlow, setShowGlow] = useState(false);
  const [showHint, setShowHint] = useState(true);

  /* ── Handle brain click → burst + glow ── */
  const handleBurst = () => {
    setBurstTrigger((p) => p + 1);
    setShowGlow(true);
    setShowHint(false);
    setTimeout(() => setShowGlow(false), 600);
  };

  /* ── GSAP entrance animations ── */
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) {
      /* Make everything visible immediately */
      [canvasWrapRef, headlineRef, subRef, ctaRef].forEach((r) => {
        if (r.current) {
          r.current.style.opacity = "1";
          r.current.style.transform = "none";
          r.current.style.clipPath = "none";
        }
      });
      if (statsRef.current) {
        Array.from(statsRef.current.children).forEach((c) => {
          (c as HTMLElement).style.opacity = "1";
        });
      }
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      /* 1 — Brain canvas */
      tl.fromTo(
        canvasWrapRef.current,
        { scale: 0.6, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.4 },
        0
      );

      /* 2 — Headline clip-path reveal */
      tl.fromTo(
        headlineRef.current,
        { clipPath: "inset(100% 0 0 0)", opacity: 1 },
        { clipPath: "inset(0% 0 0 0)", duration: 1 },
        0.4
      );

      /* 3 — Subheadline */
      tl.fromTo(
        subRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        0.7
      );

      /* 4 — CTA */
      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7 },
        0.9
      );

      /* 5 — Stats stagger */
      if (statsRef.current) {
        tl.fromTo(
          statsRef.current.children,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.15 },
          1.1
        );
      }

      /* Watermark scroll fade */
      if (watermarkRef.current) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "30% top",
          scrub: true,
          animation: gsap.fromTo(
            watermarkRef.current,
            { opacity: 0.04 },
            { opacity: 0 }
          ),
        });
      }
    }, sectionRef);

    return () => ctx.revert();
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
      className="relative h-screen w-full overflow-hidden bg-black flex flex-col items-center justify-center"
    >
      {/* ── Watermark ── */}
      <div
        ref={watermarkRef}
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0"
        style={{ opacity: 0.04 }}
      >
        <span
          className="font-black text-white whitespace-nowrap"
          style={{
            fontSize: "clamp(80px, 14vw, 180px)",
            letterSpacing: "0.06em",
          }}
        >
          AVALENCE
        </span>
      </div>

      {/* ── 3D Canvas ── */}
      <div
        ref={canvasWrapRef}
        onClick={handleBurst}
        className="relative w-full cursor-pointer z-10"
        style={{ height: "55vh", opacity: 0 }}
      >
        <BrainScene burstTrigger={burstTrigger} />

        {/* Click hint */}
        <AnimatePresence>
          {showHint && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              transition={{ delay: 2, duration: 0.6 }}
              className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs tracking-widest uppercase"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              <span className="inline-block animate-pulse">
                click to awaken
              </span>
            </motion.p>
          )}
        </AnimatePresence>
      </div>

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
      <div className="relative z-10 text-center px-6 -mt-4 max-w-3xl mx-auto">
        <h1
          ref={headlineRef}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-4"
          style={{ clipPath: "inset(100% 0 0 0)" }}
        >
          Building Intelligent Solutions{" "}
          <span className="text-gradient">That Matter</span>
        </h1>

        <p
          ref={subRef}
          className="text-sm sm:text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed"
          style={{ color: "rgba(255,255,255,0.55)", opacity: 0 }}
        >
          We empower organizations with AI that turns complex challenges into
          real-world outcomes.
        </p>

        <button
          ref={ctaRef}
          onClick={scrollToContact}
          className="
            inline-flex items-center gap-2
            px-7 py-3 rounded-full
            bg-primary text-white text-sm font-semibold
            transition-all duration-300
            hover:shadow-[0_0_32px_rgba(108,99,255,0.5)]
            hover:brightness-110
            active:scale-[0.97]
          "
          style={{ opacity: 0 }}
        >
          Start Your Project
          <span className="text-base">→</span>
        </button>
      </div>

      {/* ── Stats Bar ── */}
      <div
        ref={statsRef}
        className="
          absolute bottom-0 left-0 w-full z-10
          border-t border-white/[0.06]
          grid grid-cols-3
        "
      >
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className={`
              flex flex-col items-center justify-center py-5 md:py-6
              ${i < STATS.length - 1 ? "border-r border-white/[0.06]" : ""}
            `}
            style={{ opacity: 0 }}
          >
            <span className="text-lg sm:text-xl md:text-2xl font-bold text-white">
              {stat.value}
            </span>
            <span
              className="text-[10px] sm:text-xs md:text-sm tracking-wide mt-1"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
