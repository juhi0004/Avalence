"use client";

import { useRef, useState } from "react";
import MagneticButton from "@/components/ui/MagneticButton";

/* ── Service Cards Data ── */
const SERVICES = [
  {
    id: "01",
    title: "Product Design",
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
    description:
      "From scalable APIs to pixel-perfect frontends — we build robust, performant digital products.",
    features: ["Web Apps", "Mobile", "APIs", "DevOps"],
    tools: ["Next.js", "Firebase", "TypeScript"],
  },
  {
    id: "03",
    title: "GTM Strategy",
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

interface ServiceCardProps {
  service: typeof SERVICES[0];
  isActive: boolean;
  onClick: () => void;
}

function ServiceCard({ service, isActive, onClick }: ServiceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const isDarkCard = service.id === "02" || service.id === "03";

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Mouse coordinates relative to card
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Offsets from center (-0.5 to 0.5)
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    // Subtle 3D tilt: rotateX: ±8deg, rotateY: ±8deg based on mouse offset
    const rotateX = -yPct * 16;
    const rotateY = xPct * 16;

    setTilt({ x: rotateX, y: rotateY });

    // Inner shine element: background gradient reflecting mouse position
    if (shineRef.current) {
      const shineX = (mouseX / width) * 100;
      const shineY = (mouseY / height) * 100;
      shineRef.current.style.background = `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,255,255,0.15) 0%, transparent 60%)`;
    }

    // Holographic Card Shimmer & Specular Highlight Dot
    if (isDarkCard) {
      const dx = mouseX - width / 2;
      const dy = mouseY - height / 2;

      if (shimmerRef.current) {
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        shimmerRef.current.style.background = `conic-gradient(from ${angle}deg at 50% 50%, 
          rgba(108,99,255,0) 0deg,
          rgba(157,151,255,0.08) 60deg,
          rgba(196,192,255,0.12) 120deg,
          rgba(108,99,255,0) 180deg,
          rgba(74,63,191,0.08) 240deg,
          rgba(108,99,255,0) 360deg)`;
        shimmerRef.current.style.opacity = "1";
      }

      if (dotRef.current) {
        dotRef.current.style.left = `${mouseX}px`;
        dotRef.current.style.top = `${mouseY}px`;
        dotRef.current.style.opacity = "1";
      }
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    if (shineRef.current) {
      shineRef.current.style.background = "transparent";
    }

    if (isDarkCard) {
      if (shimmerRef.current) {
        shimmerRef.current.style.opacity = "0";
      }
      if (dotRef.current) {
        dotRef.current.style.opacity = "0";
      }
    }
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`
        services-card relative rounded-[20px] select-none cursor-pointer
        flex flex-col justify-between overflow-hidden
        transition-all duration-300 ease-out
        ${
          isActive
            ? "shadow-[0_20px_40px_-15px_rgba(139,127,255,0.4)]"
            : "hover:border-[#8B7FFF]/50 hover:shadow-[inset_0_0_40px_rgba(139,127,255,0.15)]"
        }
      `}
      style={{
        padding: "36px 32px",
        minHeight: "420px",
        background: isActive ? "#8B7FFF" : "transparent",
        border: "1px solid rgba(255,255,255,0.08)",
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transformStyle: "preserve-3d",
        transition: isHovered
          ? "transform 0.1s ease, border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease"
          : "transform 0.5s ease, border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease",
      }}
    >
      {/* Holographic Card Shimmer (Element 2) */}
      {isDarkCard && (
        <div
          ref={shimmerRef}
          className="absolute inset-0 pointer-events-none rounded-[inherit] transition-opacity duration-300 z-10"
          style={{
            mixBlendMode: "screen",
            opacity: 0,
          }}
        />
      )}

      {/* Specular Highlight Dot (Element 2) */}
      {isDarkCard && (
        <div
          ref={dotRef}
          className="absolute pointer-events-none rounded-full transition-opacity duration-300 z-20"
          style={{
            width: "80px",
            height: "80px",
            background: "radial-gradient(circle, rgba(255,255,255,0.06), transparent 70%)",
            transform: "translate(-50%, -50%)",
            opacity: 0,
          }}
        />
      )}

      {/* Dynamic Inner Shine */}
      <div
        ref={shineRef}
        className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300"
        style={{
          mixBlendMode: "overlay",
          transform: "translateZ(1px)",
        }}
      />

      {/* Background Watermark */}
      <span
        className="absolute font-black pointer-events-none z-0 select-none transition-opacity duration-300"
        style={{
          bottom: "-20px",
          right: "-10px",
          fontSize: "140px",
          fontWeight: 900,
          color: isActive ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.04)",
          lineHeight: 1,
          opacity: isHovered ? 0.07 : 0.04,
          transform: "translateZ(10px)",
        }}
      >
        {service.id}
      </span>

      {/* Card Content Wrapper */}
      <div className="relative z-10 w-full" style={{ transform: "translateZ(30px)" }}>
        {/* Card Top Row */}
        <div className="flex justify-between items-center mb-2">
          {/* Number */}
          <span
            className="font-medium tracking-[0.08em]"
            style={{
              fontSize: "13px",
              color: isActive ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.4)",
            }}
          >
            {service.id}
          </span>
          {/* Arrow */}
          <MagneticButton>
            <span
              style={{
                fontSize: "18px",
                color: isActive ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.6)",
                display: "inline-block",
              }}
            >
              →
            </span>
          </MagneticButton>
        </div>

        {/* Card Title */}
        <h3
          className="font-bold text-white mb-4"
          style={{
            fontSize: "22px",
            lineHeight: 1.2,
          }}
        >
          {service.title}
        </h3>

        {/* Card Description */}
        <p
          className="mb-6"
          style={{
            fontSize: "14px",
            lineHeight: 1.7,
            color: isActive
              ? "rgba(255,255,255,0.85)"
              : "rgba(255,255,255,0.55)",
          }}
        >
          {service.description}
        </p>

        {/* Feature List */}
        <ul className="flex flex-col gap-[10px] mb-8 p-0 m-0">
          {service.features.map((feature, i) => (
            <li
              key={i}
              className="flex items-center gap-[10px]"
              style={{
                fontSize: "14px",
                color: isActive ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.75)",
              }}
            >
              {/* Checkmark */}
              <span
                className="font-semibold"
                style={{
                  color: isActive ? "#ffffff" : "#9D97FF",
                  fontSize: "13px",
                  minWidth: "16px",
                }}
              >
                ✓
              </span>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Tools Row at Bottom */}
      <div
        className="relative z-10 flex gap-2 flex-wrap pt-5"
        style={{
          borderTop: isActive ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(255,255,255,0.1)",
          transform: "translateZ(40px)",
        }}
      >
        {service.tools.map((tool, i) => (
          <span
            key={i}
            className="font-medium"
            style={{
              fontSize: "12px",
              color: isActive ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.5)",
              padding: "4px 10px",
              background: isActive ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)",
              borderRadius: "6px",
              border: isActive ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {tool}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ServicesSection() {
  const [activeCardId, setActiveCardId] = useState<string>("01");

  return (
    <section
      id="services"
      className="section-wrapper"
    >
      <div className="content-container">
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 w-full" style={{ marginBottom: "64px" }}>
          {/* Left Title */}
          <h2
            className="services-title font-bold text-white m-0"
            style={{
              fontSize: "clamp(36px, 5vw, 56px)",
            }}
          >
            Our Services
          </h2>
          {/* Right Description */}
          <p
            className="services-desc font-normal text-left md:text-right m-0"
            style={{
              maxWidth: "380px",
              fontSize: "15px",
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.7,
            }}
          >
            We offer comprehensive digital solutions that transform your
            business and drive innovation across every touchpoint.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {SERVICES.map((service) => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              isActive={activeCardId === service.id}
              onClick={() => setActiveCardId(service.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
