"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";

interface MagneticButtonProps {
  children: React.ReactElement;
  className?: string;
}

export default function MagneticButton({ children, className = "" }: MagneticButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      
      // Calculate mouse position relative to container center
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const dx = mouseX - width / 2;
      const dy = mouseY - height / 2;

      // Animate container (magnetic pull)
      gsap.to(container, {
        x: dx * 0.35,
        y: dy * 0.35,
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out",
        boxShadow: "0 12px 48px rgba(190, 162, 86, 0.4)", // Gold glow on pull
        overwrite: "auto",
      });

      // Animate inner content (parallax within parallax)
      gsap.to(inner, {
        x: dx * 0.15,
        y: dy * 0.15,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      // Spring back to center
      gsap.to(container, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: "elastic.out(1, 0.4)",
        boxShadow: "0 0 0 rgba(190, 162, 86, 0)", // Reset glow
      });

      gsap.to(inner, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.4)",
      });
    };

    const handleMouseDown = () => {
      gsap.to(container, {
        scale: 0.96,
        duration: 0.1,
      });
    };

    const handleMouseUp = () => {
      gsap.to(container, {
        scale: 1.05,
        duration: 0.1,
      });
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mouseup", handleMouseUp);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // Clone child but wrap with refs for translation
  return (
    <div
      ref={containerRef}
      className={`inline-block select-none ${className}`}
      style={{ willChange: "transform" }}
      data-magnetic
    >
      <div ref={innerRef} className="w-full h-full" style={{ willChange: "transform" }}>
        {children}
      </div>
    </div>
  );
}

