"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ParallaxController() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      // ==========================================
      // BEAT 1 — Hero section parallax
      // ==========================================
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: "#home",
          start: "top top",
          end: "+=300",
          scrub: 1,
        },
      });

      // Brain canvas
      heroTl.to(".brain-canvas-wrap", { y: -80, scale: 0.8, opacity: 0 }, 0);
      // Headline
      heroTl.to(".hero-headline", { y: -120, opacity: 0 }, 0);
      // Watermark
      heroTl.to(".hero-watermark", { y: -30 }, 0);
      // Stats row
      heroTl.to(".hero-stats", { y: 60, opacity: 0 }, 0);

      // ==========================================
      // 3D Depth Layered Parallax Sections (Element 5)
      // ==========================================
      gsap.fromTo(
        "#services",
        { z: -50, rotateX: 3, opacity: 0.7, transformStyle: "preserve-3d" },
        {
          z: 0,
          rotateX: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: "#services",
            start: "top 85%",
            end: "top 30%",
            scrub: 1.5,
          },
        }
      );

      gsap.fromTo(
        "#clients",
        { z: -80, rotateX: 3, opacity: 0.7, transformStyle: "preserve-3d" },
        {
          z: 0,
          rotateX: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: "#clients",
            start: "top 85%",
            end: "top 30%",
            scrub: 1.5,
          },
        }
      );

      gsap.fromTo(
        "#blog",
        { z: -60, rotateX: 3, opacity: 0.7, transformStyle: "preserve-3d" },
        {
          z: 0,
          rotateX: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: "#blog",
            start: "top 85%",
            end: "top 30%",
            scrub: 1.5,
          },
        }
      );

      // ==========================================
      // BEAT 2 — Services section entrance
      // ==========================================
      const servicesTl = gsap.timeline({
        scrollTrigger: {
          trigger: "#services",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      servicesTl.fromTo(
        ".services-title",
        { x: -60, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        0
      );
      servicesTl.fromTo(
        ".services-desc",
        { x: 60, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        0
      );
      servicesTl.fromTo(
        ".services-card",
        { rotateY: 15, x: 80, opacity: 0 },
        { rotateY: 0, x: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power3.out" },
        0.2
      );

      // ==========================================
      // BEAT 3 — Clients section
      // ==========================================
      // Upward drift (parallax)
      gsap.fromTo(
        "#clients",
        { y: 30 },
        {
          y: -30,
          scrollTrigger: {
            trigger: "#clients",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );

      // Entrance (arc + logos)
      const clientsTl = gsap.timeline({
        scrollTrigger: {
          trigger: "#clients",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      // We handle arc draw via strokeDasharray & strokeDashoffset
      // Using an arbitrary large value 2000 that covers the path length
      gsap.set(".clients-arc-path", { strokeDasharray: 2000, strokeDashoffset: 2000 });
      clientsTl.to(".clients-arc-path", { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut" }, 0);
      
      clientsTl.to(
        ".clients-logo",
        { opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out" },
        0.5 // start as line is drawing
      );

      // ==========================================
      // BEAT 4 — CTA Banner
      // ==========================================
      const ctaEntranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".cta-banner",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
      ctaEntranceTl.fromTo(
        ".cta-banner",
        { scale: 0.92 },
        { scale: 1.0, duration: 0.8, ease: "power3.out" }
      );
      ctaEntranceTl.fromTo(
        ".cta-text",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        0.2
      );

      // CTA Parallax Blob
      gsap.fromTo(
        ".cta-blob",
        { y: -30 },
        {
          y: 30,
          scrollTrigger: {
            trigger: ".cta-banner",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );

      // ==========================================
      // BEAT 5 — Blog section
      // ==========================================
      // NOTE: BlogGrid internally uses framer-motion's whileInView, 
      // but to strictly follow the prompt, we override with GSAP.
      // (Framer motion might fight GSAP if we don't disable one, but we apply it to .blog-card which GSAP can control)
      if (document.querySelector(".blog-card")) {
        gsap.fromTo(
          ".blog-card",
          { y: 60, opacity: 0, rotateX: 8 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".blog-card", // First card triggers the stagger
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // ==========================================
      // BEAT 6 — Contact section
      // ==========================================
      const contactTl = gsap.timeline({
        scrollTrigger: {
          trigger: "#contact",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
      contactTl.fromTo(
        ".contact-form",
        { x: 80, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        0
      );
      contactTl.fromTo(
        ".contact-left",
        { x: -80, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        0
      );

    });

    return () => ctx.revert();
  }, []);

  return null; // Renders no visible UI
}
