"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function CursorGlow() {
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const layer3Ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined" || window.innerWidth < 768) return;

    const l1 = layer1Ref.current;
    const l2 = layer2Ref.current;
    const l3 = layer3Ref.current;
    if (!l1 || !l2 || !l3) return;

    // Set initial positions offscreen
    gsap.set(l1, { xPercent: -50, yPercent: -50, x: -500, y: -500 });
    gsap.set(l2, { xPercent: -50, yPercent: -50, x: -500, y: -500 });
    gsap.set(l3, { xPercent: -50, yPercent: -50, x: -500, y: -500 });

    // GSAP quickTo animations for smooth following
    const xTo1 = gsap.quickTo(l1, "x", { duration: 0.8, ease: "power3" });
    const yTo1 = gsap.quickTo(l1, "y", { duration: 0.8, ease: "power3" });

    const xTo2 = gsap.quickTo(l2, "x", { duration: 0.3, ease: "power2" });
    const yTo2 = gsap.quickTo(l2, "y", { duration: 0.3, ease: "power2" });

    const xTo3 = gsap.quickTo(l3, "x", { duration: 0.05, ease: "power1" });
    const yTo3 = gsap.quickTo(l3, "y", { duration: 0.05, ease: "power1" });

    const handleMouseMove = (e: MouseEvent) => {
      xTo1(e.clientX);
      yTo1(e.clientY);
      xTo2(e.clientX);
      yTo2(e.clientY);
      xTo3(e.clientX);
      yTo3(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isHoverable =
        target.closest("[data-magnetic]") ||
        target.closest("button") ||
        target.closest("a") ||
        target.closest(".services-card") ||
        target.closest(".blog-card") ||
        target.closest("input") ||
        target.closest("textarea") ||
        target.closest("select");

      if (isHoverable) {
        // Expand Layer 1 ambient glow
        gsap.to(l1, {
          width: 400,
          height: 400,
          opacity: 0.12,
          duration: 0.3,
        });

        // Expand Layer 2 ring and change border color to purple
        gsap.to(l2, {
          width: 60,
          height: 60,
          borderColor: "#6C63FF",
          scale: 1.5,
          duration: 0.2,
          ease: "power2.out",
        });
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isHoverable =
        target.closest("[data-magnetic]") ||
        target.closest("button") ||
        target.closest("a") ||
        target.closest(".services-card") ||
        target.closest(".blog-card") ||
        target.closest("input") ||
        target.closest("textarea") ||
        target.closest("select");

      if (isHoverable) {
        // Reset Layer 1
        gsap.to(l1, {
          width: 300,
          height: 300,
          opacity: 0.08,
          duration: 0.3,
        });

        // Reset Layer 2
        gsap.to(l2, {
          width: 40,
          height: 40,
          borderColor: "rgba(108, 99, 255, 0.4)",
          scale: 1,
          duration: 0.2,
          ease: "power2.out",
        });
      }
    };

    const handleClick = () => {
      // Create a temporary burst ring element at the click coordinates
      const clickRing = document.createElement("div");
      clickRing.className = "fixed pointer-events-none z-[99999] rounded-full border border-[#6C63FF]";
      
      const rect = l3.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      clickRing.style.width = "10px";
      clickRing.style.height = "10px";
      clickRing.style.left = `${x}px`;
      clickRing.style.top = `${y}px`;
      clickRing.style.transform = "translate(-50%, -50%)";

      document.body.appendChild(clickRing);

      gsap.to(clickRing, {
        scale: 6,
        opacity: 0,
        duration: 0.4,
        ease: "power2.out",
        onComplete: () => {
          clickRing.remove();
        },
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  if (!mounted) return null;
  if (typeof window !== "undefined" && window.innerWidth < 768) return null;

  return (
    <>
      {/* Layer 1: Ambient Glow */}
      <div
        ref={layer1Ref}
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] will-change-transform"
        style={{
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(108,99,255,0.8) 0%, transparent 70%)",
          opacity: 0.08,
          filter: "blur(40px)",
          mixBlendMode: "screen",
        }}
      />

      {/* Layer 2: Medium Ring */}
      <div
        ref={layer2Ref}
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] will-change-transform transition-[width,height] duration-200"
        style={{
          width: "40px",
          height: "40px",
          border: "1px solid rgba(108, 99, 255, 0.4)",
          background: "transparent",
        }}
      />

      {/* Layer 3: Small Dot */}
      <div
        ref={layer3Ref}
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] will-change-transform"
        style={{
          width: "6px",
          height: "6px",
          background: "#6C63FF",
        }}
      />
    </>
  );
}
