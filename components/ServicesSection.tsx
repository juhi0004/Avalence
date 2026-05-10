"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ── Service Cards Data ── */
const SERVICES = [
  {
    id: "01",
    title: "Product Design",
    isActive: true,
    description:
      "End-to-end product design — from research and strategy to polished UI systems and developer-ready handoff.",
    features: [
      "Research & Strategy",
      "Wireframes",
      "Prototypes",
      "Dev Handoff",
    ],
    tools: ["Figma", "Sketch", "Adobe XD"],
  },
  {
    id: "02",
    title: "Development",
    isActive: false,
    description:
      "From scalable APIs to pixel-perfect frontends — we build robust, performant digital products.",
    features: ["Web Apps", "Mobile", "APIs", "DevOps"],
    tools: ["Next.js", "Firebase", "TypeScript"],
  },
  {
    id: "03",
    title: "GTM Strategy",
    isActive: false,
    description:
      "We help AI-first companies launch faster — positioning, pricing, growth loops, and channel strategy.",
    features: [
      "Market Research",
      "Positioning",
      "Growth Loops",
      "Analytics",
    ],
    tools: ["Mixpanel", "HubSpot", "Stripe"],
  },
];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion || !cardsRef.current) return;

    const ctx = gsap.context(() => {
      /* ── Cards Stagger Entrance ── */
      gsap.fromTo(
        cardsRef.current!.children,
        { x: 60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.18,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%", // 30% in viewport
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative min-h-screen bg-black py-[120px] px-6 md:px-10 lg:px-16 overflow-hidden flex flex-col justify-center"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* ── Header Row ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 md:mb-20">
          <h2 className="text-4xl md:text-[48px] font-bold tracking-tight text-white leading-tight">
            Our Services
          </h2>
          <p className="text-base md:text-lg text-text-muted max-w-md leading-relaxed">
            We offer comprehensive digital solutions that transform your
            business and drive innovation across every touchpoint.
          </p>
        </div>

        {/* ── Cards Container ── */}
        <div
          ref={cardsRef}
          className="flex overflow-x-auto md:grid md:grid-cols-3 gap-6 pb-8 md:pb-0 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {SERVICES.map((service) => (
            <div
              key={service.id}
              className={`
                group relative flex-shrink-0 w-[85vw] sm:w-[320px] md:w-auto rounded-[20px] p-8 snap-start
                transition-all duration-300 ease-out flex flex-col justify-between overflow-hidden
                ${
                  service.isActive
                    ? "bg-gradient-to-br from-[#4A3FBF] to-[#6C63FF] hover:-translate-y-[6px] hover:shadow-[0_20px_40px_-15px_rgba(108,99,255,0.6)]"
                    : "bg-white/[0.04] border border-white/[0.08] hover:border-primary/50 hover:shadow-[inset_0_0_40px_rgba(108,99,255,0.15)]"
                }
              `}
              style={{ minHeight: "420px" }}
            >
              {/* Active Card Shimmer Effect */}
              {service.isActive && (
                <div
                  className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.2) 25%, transparent 30%)",
                    backgroundSize: "200% 200%",
                    animation: "shimmer 3s infinite linear",
                  }}
                />
              )}

              {/* Number Watermark */}
              <span
                className="absolute top-6 left-6 text-6xl font-black leading-none pointer-events-none z-0"
                style={{
                  color: service.isActive
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(255,255,255,0.06)",
                }}
              >
                {service.id}
              </span>

              {/* Top Content */}
              <div className="relative z-10 pt-10">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-white">
                    {service.title}
                  </h3>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 ${
                      service.isActive ? "text-white" : "text-white/50"
                    }`}
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </div>
                <p
                  className={`text-sm md:text-base leading-relaxed mb-8 ${
                    service.isActive ? "text-white/90" : "text-text-muted"
                  }`}
                >
                  {service.description}
                </p>

                {/* Features List */}
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-center text-sm text-white/80"
                    >
                      <svg
                        className={`w-4 h-4 mr-3 flex-shrink-0 ${
                          service.isActive ? "text-white" : "text-primary"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Tools Badges */}
              <div className="relative z-10 flex flex-wrap gap-2 mt-auto">
                {service.tools.map((tool, i) => (
                  <span
                    key={i}
                    className={`text-[11px] font-medium px-3 py-1.5 rounded-full backdrop-blur-sm ${
                      service.isActive
                        ? "bg-white/20 text-white"
                        : "bg-white/5 text-white/60 group-hover:bg-white/10 group-hover:text-white/80"
                    } transition-colors duration-300`}
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Internal CSS for shimmer animation and scrollbar hiding fallback */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        /* Hide scrollbar for Chrome, Safari and Opera */
        .snap-x::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </section>
  );
}
