"use client";

import React, { useRef, useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

/* ── Testimonial Data ── */
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

        {/* Stars with glow background */}
        <div className="tc-stars-wrap">
          <div className="tc-stars" aria-label="5 stars">
            {[...Array(testimonial.stars)].map((_, i) => (
              <span key={i}>★</span>
            ))}
          </div>
        </div>

        {/* Quote accent line */}
        <div className="tc-quote-line" />

        {/* Quote */}
        <p className="tc-quote">&ldquo;{testimonial.quote}&rdquo;</p>

        {/* Author */}
        <div className="tc-author">
          <div className="tc-avatar">{testimonial.author.initials}</div>
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
  return (
    <div className="tc-section">
      {/* Header */}
      <div className="tc-header">
        <h3 className="tc-heading">What Our Customers Say</h3>
        <p className="tc-subheading">
          Enterprise-grade feedback from industry leaders collaborating with
          AVALENCE
        </p>
      </div>

      {/* Cards Grid */}
      <div className="tc-grid">
        {TESTIMONIALS.map((t, i) => (
          <TestimonialCard key={t.id} testimonial={t} index={i} />
        ))}
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
  padding: 140px 0 20px;
}

/* ── Header ── */
.tc-header {
  text-align: center;
  margin-bottom: 100px;
}

.tc-heading {
  font-size: clamp(32px, 4.5vw, 48px);
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
  line-height: 1.15;
}

.tc-subheading {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.55);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* ── Grid ── */
.tc-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  perspective: 1200px;
}

@media (max-width: 1024px) {
  .tc-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
  .tc-grid { grid-template-columns: 1fr; gap: 24px; }
  .tc-section { padding: 80px 0 60px; }
  .tc-header { margin-bottom: 60px; }
}

/* ── Card ── */
.tc-card {
  position: relative;
  padding: 40px 36px;
  border-radius: 24px;
  background: var(--av-card-surface, rgba(255, 255, 255, 0.04));
  border: 1px solid var(--av-card-border, rgba(255, 255, 255, 0.08));
  min-height: 380px;
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
  border-color: rgba(108, 99, 255, 0.3);
}

@media (max-width: 768px) {
  .tc-card {
    padding: 32px 24px;
    min-height: 320px;
  }
}
@media (max-width: 480px) {
  .tc-card { padding: 24px 16px; }
}

/* ── Corner Orb ── */
.tc-orb {
  position: absolute;
  top: -40px;
  right: -40px;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(108, 99, 255, 0.35), transparent 70%);
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
  color: #FFB800;
  line-height: 1;
}

/* ── Quote Accent Line ── */
.tc-quote-line {
  width: 3px;
  height: 40px;
  background: linear-gradient(180deg, var(--av-primary, #6C63FF), transparent);
  border-radius: 2px;
  margin-bottom: 16px;
}

/* ── Quote ── */
.tc-quote {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.7);
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
  background: linear-gradient(135deg, var(--av-primary, #6C63FF), #9D97FF);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  flex-shrink: 0;
  box-shadow: 0 0 20px rgba(108, 99, 255, 0.4);
  border: 2px solid rgba(108, 99, 255, 0.4);
  transition: border-color 0.3s;
}

.tc-card:hover .tc-avatar {
  border-color: var(--av-primary, #6C63FF);
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
  color: #ffffff;
  letter-spacing: 0.02em;
}

.tc-title {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.45);
  margin-top: 2px;
}

.tc-company {
  color: rgba(108, 99, 255, 0.7);
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
  background: var(--av-card-border, rgba(255, 255, 255, 0.08));
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
