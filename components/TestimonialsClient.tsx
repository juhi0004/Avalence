"use client";

import React, { useRef, useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TESTIMONIALS = [
  {
    id: 1,
    stars: 5,
    quote:
      "AVALENCE completely transformed our generative UI pipelines. We reduced our GTM deployment window from months to under three weeks. Their intent-based intelligence system is truly lightyears ahead of anything we built internally. The team's responsiveness and deep technical expertise made the entire integration seamless from day one.",
    author: {
      name: "Sarah Jenkins",
      title: "Chief Product Officer",
      company: "Clinix Health",
      initials: "SJ",
    },
  },
  {
    id: 2,
    stars: 5,
    quote:
      "The integration of AVALENCE Agentic core into our multi-tenant API gateway has been a game-changer. Scale throughput increased by 40% while keeping memory footprint practically negligible. Phenomenal technology and support. Their engineering discipline and commitment to zero-downtime deployments gave us complete confidence in production.",
    author: {
      name: "David Chen",
      title: "Lead DevOps Architect",
      company: "Injazat Solutions",
      initials: "DC",
    },
  },
  {
    id: 3,
    stars: 5,
    quote:
      "What impressed us most was AVALENCE's product design precision. They don't just build APIs — they curate cohesive, human-centric workflows that make complex cognitive steps feel simple. Incredible partners to grow with. Every milestone was delivered ahead of schedule, and the quality of their documentation is best-in-class.",
    author: {
      name: "Elena Rostova",
      title: "Founder",
      company: "Sentix AI",
      initials: "ER",
    },
  },
  {
    id: 4,
    stars: 5,
    quote:
      "Avalence has redefined how we orchestrate agentic workflows across our logistics platforms. The performance is incredibly reliable, and resource overhead is minimal.",
    author: {
      name: "Marcus Vance",
      title: "Chief Innovation Officer",
      company: "Vance Logistics",
      initials: "MV",
    },
  },
  {
    id: 5,
    stars: 5,
    quote:
      "The degree of customization and visual fidelity provided by Avalence's interfaces is outstanding. They bridge the gap between complex AI logic and intuitive user experiences.",
    author: {
      name: "Yuki Tanaka",
      title: "VP of AI Research",
      company: "Nexus Automation",
      initials: "YT",
    },
  },
  {
    id: 6,
    stars: 5,
    quote:
      "Deploying AVALENCE to production was the smoothest integration we've had this year. Customer engagement and throughput metrics have both seen substantial improvement.",
    author: {
      name: "Amara Okafor",
      title: "Director of Product",
      company: "Fintech Flow",
      initials: "AO",
    },
  },
];

/* ── Framer Motion Variants ── */
const cardVariants = {
  hidden: {
    opacity: 0,
    y: 80,
    rotateX: 10,
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.8,
      delay: i * 0.2,
      ease: "easeOut" as const,
    },
  }),
};

/* ── Single Testimonial Card ── */
function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: (typeof TESTIMONIALS)[number];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isTouchDevice || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * 8;
      const rotateY = ((centerX - x) / centerX) * 8;

      gsap.to(cardRef.current, {
        rotateX,
        rotateY,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });

      // Move shine
      if (shineRef.current) {
        shineRef.current.style.opacity = "1";
        shineRef.current.style.background = `radial-gradient(circle 160px at ${x}px ${y}px, rgba(255,255,255,0.07), transparent 70%)`;
      }
    },
    [isTouchDevice]
  );

  const handleMouseLeave = useCallback(() => {
    if (isTouchDevice || !cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.3)",
    });
    if (shineRef.current) {
      shineRef.current.style.opacity = "0";
    }
  }, [isTouchDevice]);

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      custom={index}
      style={{ perspective: "1200px" }}
    >
      <div
        ref={cardRef}
        className="tc-card"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Corner accent orb */}
        <div className="tc-orb" />

        {/* Hover shine overlay */}
        <div
          ref={shineRef}
          className="tc-shine"
          style={{ opacity: 0, transition: "opacity 0.3s" }}
        />

        {/* Stars and Featured Badge */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div style={{
            display: "flex",
            gap: 6,
            fontSize: 16,
            color: "#BEA256", // Gold stars
            textShadow: "0 0 4px rgba(190, 162, 86, 0.4)", // Glow effect
          }}>
            {[...Array(testimonial.stars)].map((_, i) => (
              <span key={i}>★</span>
            ))}
          </div>
          
          {index === 0 && (
            <span style={{
              background: "#BEA256",
              color: "#0a0a0a",
              padding: "4px 12px",
              borderRadius: 6,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}>
              Featured
            </span>
          )}
        </div>

        {/* Quote accent line */}
        <div className="tc-quote-line" />

        {/* Quote */}
        <p className="tc-quote">&ldquo;{testimonial.quote}&rdquo;</p>

        {/* Author */}
        <div className="tc-author">
          <div style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #BEA256, #c9a961)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            fontWeight: 700,
            color: "#0a0a0a",
            border: "2px solid #BEA256",
            boxShadow: "0 0 16px rgba(190, 162, 86, 0.4)",
            flexShrink: 0
          }}>
            {testimonial.author.initials}
          </div>
          <div className="tc-author-info">
            <span className="tc-name">{testimonial.author.name}</span>
            <span className="tc-title">
              {testimonial.author.title} ·{" "}
              <span className="tc-company">{testimonial.author.company}</span>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main Exported Component ── */
export default function TestimonialsClient() {
  const headingStr = "What Our Customers Say";
  const headerRef = useRef<HTMLDivElement>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerCenter = container.scrollLeft + container.offsetWidth / 2;
    let closestIndex = 0;
    let minDistance = Infinity;

    cardRefs.current.forEach((card, index) => {
      if (!card) return;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const diff = cardCenter - containerCenter;
      const distance = Math.abs(diff);

      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }

      // Compute uplift (translateY and scale) based on distance
      const maxDistance = card.offsetWidth + 32;
      const ratio = distance / maxDistance;
      const clampedRatio = Math.max(0, Math.min(1, ratio));

      const scale = 1.05 - clampedRatio * 0.10; // active card is 1.05, side cards are 0.95
      const translateY = -16 + clampedRatio * 16; // active card is uplifted by -16px
      const opacity = 1 - clampedRatio * 0.45; // side cards have lower opacity
      const zIndex = Math.round(100 - clampedRatio * 10);

      card.style.transform = `scale(${scale}) translateY(${translateY}px)`;
      card.style.opacity = opacity.toString();
      card.style.zIndex = zIndex.toString();
    });

    setCurrentIndex(closestIndex);
  }, []);

  const scrollToIndex = useCallback((index: number) => {
    const container = containerRef.current;
    const card = cardRefs.current[index];
    if (container && card) {
      const targetScrollLeft = card.offsetLeft - (container.offsetWidth - card.offsetWidth) / 2;
      container.scrollTo({ left: targetScrollLeft, behavior: "smooth" });
    }
  }, []);

  // Trigger initial scroll calculation to apply 3D transforms
  useEffect(() => {
    const timer = setTimeout(() => {
      handleScroll();
    }, 100);
    window.addEventListener("resize", handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    if (!headerRef.current) return;

    const chars = headerRef.current.querySelectorAll(".tc-char");
    const sub = headerRef.current.querySelector(".tc-subheading");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: headerRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      }
    });

    // 3D Cinematic Text Reveal
    tl.to(chars, {
      rotateX: 0,
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      duration: 1.2,
      ease: "power3.out",
      stagger: 0.04,
    })
    // Subheading soft fade
    .to(sub, {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      duration: 1,
      ease: "power2.out",
    }, "-=0.9"); // Start 0.3s after heading starts (1.2 - 0.9 = 0.3)

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="tc-section">
      {/* Header */}
      <div className="tc-header" ref={headerRef}>
        <h3 className="tc-heading" style={{ perspective: "1000px" }}>
          {headingStr.split("").map((char, i) => (
            <span
              key={i}
              className="tc-char"
              style={{
                display: "inline-block",
                whiteSpace: char === " " ? "pre" : "normal",
                opacity: 0,
                transformOrigin: "bottom center",
                transform: "rotateX(90deg) translateY(20px)",
                filter: "blur(10px)",
                willChange: "transform, opacity, filter"
              }}
            >
              {char}
            </span>
          ))}
        </h3>
        <p className="tc-subheading" style={{ opacity: 0, transform: "translateY(20px)", filter: "blur(8px)", willChange: "transform, opacity, filter" }}>
          Enterprise-grade feedback from industry leaders collaborating with
          AVALENCE
        </p>
      </div>

      {/* 3D Carousel Wrapper */}
      <div className="tc-carousel-wrapper">
        <div 
          ref={containerRef} 
          className="tc-carousel-container"
          onScroll={handleScroll}
        >
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="tc-carousel-item"
            >
              <TestimonialCard testimonial={t} index={i} />
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <div className="tc-controls">
          <button 
            onClick={() => scrollToIndex(currentIndex - 1)}
            disabled={currentIndex === 0}
            className="tc-arrow tc-arrow-left"
            aria-label="Previous testimonial"
          >
            ←
          </button>
          
          <div className="tc-counter">
            <span className="tc-counter-active">
              {String(currentIndex + 1).padStart(2, '0')}
            </span>
            <span className="tc-counter-divider">/</span>
            <span className="tc-counter-total">
              {String(TESTIMONIALS.length).padStart(2, '0')}
            </span>
          </div>

          <button 
            onClick={() => scrollToIndex(currentIndex + 1)}
            disabled={currentIndex === TESTIMONIALS.length - 1}
            className="tc-arrow tc-arrow-right"
            aria-label="Next testimonial"
          >
            →
          </button>
        </div>
      </div>

      {/* Footer accent */}
      <div className="tc-footer">
        <div className="tc-footer-line" />
        <p className="tc-footer-text">
          Join 50+ companies transforming with AVALENCE
        </p>
      </div>

      {/* ── Scoped Styles ── */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
/* ── Section ── */
.tc-section {
  position: relative;
  padding: 50px 0 10px;
}

/* ── Header ── */
.tc-header {
  text-align: center;
  margin-bottom: 25px;
}

.tc-heading {
  font-size: clamp(44px, 6vw, 72px);
  font-weight: 900;
  font-family: 'Satoshi', sans-serif;
  color: var(--text-primary);
  margin-bottom: 16px;
  letter-spacing: -0.03em;
  line-height: 1.1;
}

.tc-subheading {
  font-size: 15px;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* ── Carousel ── */
.tc-carousel-wrapper {
  position: relative;
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
  padding: 10px 0 70px; /* Space for integrated controls */
}

.tc-carousel-container {
  display: flex;
  gap: 32px;
  overflow-x: auto;
  overflow-y: visible;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  -ms-overflow-style: none;
  --card-width: calc((100% - 64px) / 3);
  padding: 60px calc(50% - var(--card-width) / 2) 80px;
  perspective: 1500px;
  transform-style: preserve-3d;
  scroll-behavior: smooth;
  will-change: scroll-position;
}

.tc-carousel-container::-webkit-scrollbar {
  display: none;
}

.tc-carousel-item {
  width: var(--card-width);
  max-width: 400px;
  min-width: 300px;
  flex-shrink: 0;
  scroll-snap-align: center;
  transition: transform 0.15s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.15s ease;
  transform-style: preserve-3d;
  perspective: 1500px;
}

@media (max-width: 1024px) {
  .tc-carousel-container {
    --card-width: calc((100% - 32px) / 2);
    padding: 40px calc(50% - var(--card-width) / 2) 80px;
  }
  .tc-carousel-item {
    width: var(--card-width);
    min-width: 280px;
  }
}

@media (max-width: 768px) {
  .tc-carousel-container {
    gap: 24px;
    --card-width: calc(100% - 40px);
    padding: 30px 20px 80px;
  }
  .tc-carousel-item {
    width: var(--card-width);
    min-width: auto;
    max-width: none;
  }
  .tc-section { padding: 50px 0 10px; }
  .tc-header { margin-bottom: 25px; }
}

/* ── Controls ── */
.tc-controls {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
}

.tc-arrow {
  background: rgba(190, 162, 86, 0.06);
  border: 1px solid rgba(190, 162, 86, 0.2);
  color: var(--accent);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.tc-arrow:hover:not(:disabled) {
  background: var(--accent);
  color: #0a0a0a;
  border-color: var(--accent);
  box-shadow: 0 0 16px rgba(190, 162, 86, 0.4);
}

.tc-arrow:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.tc-counter {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'Satoshi', sans-serif;
  font-weight: 700;
  font-size: 16px;
  letter-spacing: 0.05em;
}

.tc-counter-active {
  color: var(--accent);
}

.tc-counter-divider {
  color: rgba(255, 255, 255, 0.2);
}

.tc-counter-total {
  color: var(--text-muted);
}

/* ── Card ── */
.tc-card {
  position: relative;
  padding: 36px 32px;
  border-radius: 24px;
  background: rgba(190, 162, 86, 0.04);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(190, 162, 86, 0.1);
  height: 480px; /* Exact same length/height for all cards, spacious enough to prevent text clipping */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.35s cubic-bezier(0.4, 0, 0.2, 1),
              border-color 0.35s ease;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  will-change: transform;
}

.tc-card:hover {
  transform: translateY(-12px) translateZ(0);
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.6);
  border-color: var(--accent);
}

@media (max-width: 768px) {
  .tc-card {
    padding: 28px 20px;
    height: 440px;
  }
}
@media (max-width: 480px) {
  .tc-card { 
    padding: 24px 16px; 
    height: 420px;
  }
}

/* ── Corner Orb ── */
.tc-orb {
  position: absolute;
  top: -40px;
  right: -40px;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--accent), transparent 70%);
  opacity: 0.06;
  pointer-events: none;
}

/* ── Shine overlay ── */
.tc-shine {
  position: absolute;
  inset: 0;
  border-radius: 24px;
  pointer-events: none;
  z-index: 5;
}

/* ── Stars ── */
.tc-stars-wrap {
  margin-bottom: 24px;
}

.tc-stars {
  display: inline-flex;
  gap: 4px;
  background: linear-gradient(90deg, rgba(255, 184, 0, 0.15), transparent 80%);
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
  letter-spacing: 2px;
  color: var(--accent);
  line-height: 1;
}

/* ── Quote Accent Line ── */
.tc-quote-line {
  width: 3px;
  height: 40px;
  background: linear-gradient(180deg, var(--accent), transparent);
  border-radius: 2px;
  margin-bottom: 16px;
}

/* ── Quote ── */
.tc-quote {
  font-size: 15px;
  color: var(--text-primary);
  line-height: 1.8;
  font-style: italic;
  font-weight: 400;
  letter-spacing: 0.3px;
  margin-bottom: 32px;
  flex-grow: 1;
}

@media (max-width: 768px) {
  .tc-quote { line-height: 1.9; }
}

/* ── Author ── */
.tc-author {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  margin-top: auto;
}

.tc-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), var(--accent-hover));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  flex-shrink: 0;
  box-shadow: 0 0 20px rgba(190, 162, 86, 0.2);
  border: 2px solid rgba(190, 162, 86, 0.4);
  transition: border-color 0.3s;
}

.tc-card:hover .tc-avatar {
  border-color: var(--accent);
}

@media (max-width: 768px) {
  .tc-avatar {
    width: 40px;
    height: 40px;
    font-size: 14px;
  }
}

.tc-author-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tc-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 0.02em;
}

.tc-title {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 2px;
}

.tc-company {
  color: var(--accent);
}

/* ── Footer ── */
.tc-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 60px;
}

.tc-footer-line {
  width: 60px;
  height: 1px;
  background: var(--border-color);
  margin-bottom: 40px;
}

.tc-footer-text {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 0.04em;
}

/* ── Reduced Motion ── */
@media (prefers-reduced-motion: reduce) {
  .tc-card {
    transition: none !important;
  }
}
          `,
        }}
      />
    </div>
  );
}

