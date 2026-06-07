"use client";

import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";

const SERVICES = [
  {
    id: "01",
    title: "Product Design",
    description: "End-to-end product design — from research and strategy to polished UI systems and developer-ready handoff.",
    features: ["Research & Strategy", "Wireframes", "Prototypes", "Dev Handoff"],
    tools: ["Figma", "Sketch", "Adobe XD"],
  },
  {
    id: "02",
    title: "Development",
    description: "From scalable APIs to pixel-perfect frontends — we build robust, performant digital products.",
    features: ["Web Apps", "Mobile", "APIs", "DevOps"],
    tools: ["Next.js", "Firebase", "TypeScript"],
  },
  {
    id: "03",
    title: "GTM Strategy",
    description: "We help AI-first companies launch faster — positioning, pricing, growth loops, and channel strategy.",
    features: ["Market Research", "Positioning", "Growth Loops", "Analytics"],
    tools: ["Mixpanel", "HubSpot", "Stripe"],
  },
];

export default function ServicesSection() {
  const isDark = true;
  const [activeCardId, setActiveCardId] = useState<string>("01");
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  useEffect(() => {
    // On mobile: always show services section normally
    if (isMobile) {
      setIsVisible(true);
      return;
    }

    // Check if user already scrolled past hero on page load/refresh
    const heroSection = document.getElementById("home");
    if (heroSection) {
      const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
      if (window.scrollY > heroBottom * 0.7) {
        setIsVisible(true);
      }
    }

    const handleReveal = () => {
      setIsVisible(true);
      if (!sectionRef.current) return;

      // Animate section in
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" }
      );

      // Stagger cards
      const cards = sectionRef.current.querySelectorAll(".services-card");
      gsap.fromTo(
        cards,
        { opacity: 0, y: 40, rotateX: 8 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.85,
          stagger: 0.15,
          ease: "power2.out",
          delay: 0.25,
        }
      );
    };

    const handleHide = () => {
      if (!sectionRef.current) return;
      gsap.to(sectionRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => setIsVisible(false),
      });
    };

    window.addEventListener("avalence:servicesReveal", handleReveal);
    window.addEventListener("avalence:servicesHide", handleHide);

    return () => {
      window.removeEventListener("avalence:servicesReveal", handleReveal);
      window.removeEventListener("avalence:servicesHide", handleHide);
    };
  }, [isMobile]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPct = x / rect.width - 0.5;
    const yPct = y / rect.height - 0.5;

    card.style.transform = `translateY(-6px) perspective(1000px) rotateX(${-yPct * 12}deg) rotateY(${xPct * 12}deg)`;
    
    // Update inner shine
    const shine = card.querySelector('.inner-shine') as HTMLDivElement;
    if (shine) {
      shine.style.background = `radial-gradient(circle at ${(x / rect.width) * 100}% ${(y / rect.height) * 100}%, rgba(255,255,255,0.06) 0%, transparent 60%)`;
      shine.style.opacity = "1";
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform = "translateY(0) perspective(1000px) rotateX(0deg) rotateY(0deg)";
    
    const shine = card.querySelector('.inner-shine') as HTMLDivElement;
    if (shine) {
      shine.style.opacity = "0";
    }
  };

  return (
    <section
      ref={sectionRef}
      id="services"
      style={{
        background: "rgba(0, 0, 0, 0.4)", // Translucent to show ParticleTunnel
        backdropFilter: "blur(8px)",
        opacity: isVisible ? 1 : 0, // hidden on desktop until transition
        position: "relative",
        zIndex: 10,
      }}
      className="section-wrapper"
    >
      <div className="content-container">
        {/* Header row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 64,
            flexWrap: "wrap",
            gap: 24,
          }}
        >
          <h2
            className="services-title"
            style={{
              fontSize: "clamp(36px, 5vw, 56px)",
              fontWeight: 700,
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            Our Services
          </h2>
          <p
            className="services-desc"
            style={{
              maxWidth: 380,
              fontSize: 15,
              color: "var(--text-secondary)",
              lineHeight: 1.7,
              margin: 0,
              textAlign: "right",
            }}
          >
            We offer comprehensive digital solutions that transform your business
            and drive innovation across every touchpoint.
          </p>
        </div>

        {/* Cards grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
            width: "100%",
          }}
        >
          {SERVICES.map((service, index) => {
            const isActive = activeCardId === service.id;

            let cardBackground, cardBorder, cardBoxShadow, backdropFilter;
            if (isActive) {
              cardBackground = "#c9a961";
              cardBorder = "1px solid #c9a961";
              cardBoxShadow = "0 12px 48px rgba(201, 169, 97, 0.3)";
              backdropFilter = "none";
            } else {
              cardBackground = "rgba(190, 162, 86, 0.04)";
              cardBorder = "1px solid rgba(190, 162, 86, 0.1)";
              cardBoxShadow = "0 8px 32px rgba(190, 162, 86, 0.05)";
              backdropFilter = "blur(8px)";
            }

            const numberColor = isActive ? "#0a0a0a" : "var(--text-muted)";
            const arrowColor = isActive ? "#0a0a0a" : "var(--accent)";
            const titleColor = isActive ? "#0a0a0a" : "var(--text-primary)";
            const descriptionColor = isActive ? "rgba(10, 10, 10, 0.7)" : "var(--text-secondary)";
            const featureColor = isActive ? "#0a0a0a" : "var(--text-secondary)";
            const badgeTextColor = isActive ? "#0a0a0a" : "var(--text-muted)";
            const badgeBg = isActive ? "rgba(10, 10, 10, 0.1)" : "var(--bg-card)";
            const badgeBorder = isActive ? "rgba(10, 10, 10, 0.2)" : "var(--border-color)";
            const toolsDividerColor = isActive ? "rgba(10, 10, 10, 0.15)" : "var(--divider)";
            const watermarkColor = isActive ? "rgba(10, 10, 10, 0.05)" : "var(--watermark-color)";
            const checkmarkColor = isActive ? "#0a0a0a" : "var(--accent)";

            return (
              <div
                key={service.id}
                className="services-card"
                onClick={() => setActiveCardId(service.id)}
                style={{
                  padding: "36px 32px",
                  borderRadius: 20,
                  minHeight: 440,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                  overflow: "hidden",
                  background: cardBackground,
                  backdropFilter: backdropFilter,
                  WebkitBackdropFilter: backdropFilter,
                  border: cardBorder,
                  boxShadow: cardBoxShadow,
                  cursor: "pointer",
                  transition: "transform 0.5s ease, box-shadow 0.3s ease",
                  transformStyle: "preserve-3d",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transition = "transform 0.1s ease, box-shadow 0.3s ease";
                  e.currentTarget.style.boxShadow = "0 16px 48px rgba(190,162,86,0.15)";
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transition = "transform 0.5s ease, box-shadow 0.3s ease";
                  e.currentTarget.style.boxShadow = cardBoxShadow;
                  handleMouseLeave(e);
                }}
              >
                {/* Inner Shine Element */}
                <div 
                  className="inner-shine"
                  style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                    zIndex: 1,
                  }}
                />

                <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", height: "100%" }}>
                  <div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
                    {/* Top row: number + arrow */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 16,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          color: numberColor,
                          letterSpacing: "0.1em",
                          fontWeight: 500,
                        }}
                      >
                        {service.id}
                      </span>
                      <span style={{ fontSize: 20, color: arrowColor }}>↗</span>
                    </div>

                    {/* Title */}
                    <h3
                      style={{
                        fontSize: 22,
                        fontWeight: 700,
                        color: titleColor,
                        marginBottom: 16,
                        lineHeight: 1.2,
                      }}
                    >
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p
                      style={{
                        fontSize: 14,
                        color: descriptionColor,
                        lineHeight: 1.7,
                        marginBottom: 24,
                      }}
                    >
                      {service.description}
                    </p>

                    {/* Feature list */}
                    <ul
                      style={{
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                        marginBottom: 32,
                      }}
                    >
                      {service.features.map((item) => (
                        <li
                          key={item}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            fontSize: 14,
                            color: featureColor,
                          }}
                        >
                          <span style={{ color: checkmarkColor, fontSize: 13, minWidth: 16 }}>
                            ✓
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tools row */}
                  <div
                    style={{
                      paddingTop: 20,
                      borderTop: `1px solid ${toolsDividerColor}`,
                      display: "flex",
                      gap: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    {service.tools.map((tool) => (
                      <span
                        key={tool}
                        style={{
                          fontSize: 12,
                          color: badgeTextColor,
                          padding: "4px 10px",
                          background: badgeBg,
                          border: `1px solid ${badgeBorder}`,
                          borderRadius: 6,
                        }}
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Background watermark number */}
                <span
                  style={{
                    position: "absolute",
                    bottom: -20,
                    right: -10,
                    fontSize: 140,
                    fontWeight: 900,
                    color: watermarkColor,
                    lineHeight: 1,
                    pointerEvents: "none",
                    userSelect: "none",
                    zIndex: 0,
                  }}
                >
                  {service.id}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
