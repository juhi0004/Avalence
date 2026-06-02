"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

const NAV_LINKS = [
  { label: "Home",     href: "#home"     },
  { label: "Services", href: "#services" },
  { label: "Blog",     href: "#blog"     },
  { label: "Contact",  href: "#contact"  },
] as const;

export default function Navbar() {
  const [scrolled,       setScrolled]       = useState(false);
  const [mobileOpen,     setMobileOpen]     = useState(false);
  const [activeSection,  setActiveSection]  = useState("home");

  const navContainerRef = useRef<HTMLDivElement>(null);
  const hoverUnderlineRef = useRef<HTMLDivElement>(null);

  const updateUnderline = (target: HTMLElement, animate = true) => {
    if (!hoverUnderlineRef.current) return;
    gsap.to(hoverUnderlineRef.current, {
      left: target.offsetLeft,
      width: target.offsetWidth,
      opacity: 1,
      duration: animate ? 0.35 : 0,
      ease: "power2.out",
    });
  };

  const handleMouseLeaveContainer = () => {
    if (!navContainerRef.current) return;
    const activeBtn = navContainerRef.current.querySelector(`.nav-btn-active`) as HTMLElement;
    if (activeBtn) {
      updateUnderline(activeBtn, true);
    } else {
      gsap.to(hoverUnderlineRef.current, { opacity: 0, duration: 0.25 });
    }
  };

  // Sync underline position with activeSection changes
  useEffect(() => {
    if (!navContainerRef.current) return;
    const activeBtn = navContainerRef.current.querySelector(`.nav-btn-active`) as HTMLElement;
    if (activeBtn) {
      // Small timeout to ensure offsets are loaded
      setTimeout(() => {
        if (activeBtn) updateUnderline(activeBtn, true);
      }, 50);
    } else {
      gsap.to(hoverUnderlineRef.current, { opacity: 0, duration: 0.25 });
    }
  }, [activeSection]);

  /* ── Scroll detection ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Active section tracker ── */
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1));
    const observers: IntersectionObserver[] = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  /* ── Smooth scroll ── */
  const scrollTo = useCallback((href: string) => {
    setMobileOpen(false);
    const id  = href.replace("#", "");
    const el  = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 72;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, []);

  const mobileMenuVariants = {
    closed: { opacity: 0, y: -16, transition: { duration: 0.2, ease: "easeInOut" as const } },
    open:   { opacity: 1, y: 0,   transition: { duration: 0.25, ease: "easeOut" as const  } },
  };

  return (
    <>
      {/* ── Top Bar ── */}
      <motion.nav
        initial={{ y: -72, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ height: "72px" }}
        className={`
          fixed top-0 left-0 w-full z-50
          transition-all duration-300
          ${scrolled
            ? "bg-white/[0.03] backdrop-blur-xl border-b border-white/[0.1] shadow-[0_1px_30px_rgba(108,99,255,0.05)]"
            : "bg-transparent border-b border-transparent"
          }
        `}
      >
        <div 
          className="w-full flex items-center justify-between h-full px-6 md:px-10 lg:px-20"
          style={{
            maxWidth: 1280,
            margin: "0 auto",
          }}
        >
          {/* Logo — far left */}
          <button
            onClick={() => scrollTo("#home")}
            className="flex flex-col items-start select-none group shrink-0"
            aria-label="Scroll to top"
          >
            <span
              className="text-white transition-colors duration-300 group-hover:text-white/90"
              style={{ fontSize: "18px", fontWeight: 800, letterSpacing: "0.15em", lineHeight: 1 }}
            >
              AVALENCE
            </span>
            <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.5)", marginTop: "4px", letterSpacing: "0.05em", fontStyle: "italic" }}>
              simple, scalable, seamlessly yours
            </span>
          </button>

          {/* Spacer — pushes links to center */}
          <div className="flex-1" />

          {/* Desktop Nav Links — centered */}
          <div 
            ref={navContainerRef}
            onMouseLeave={handleMouseLeaveContainer}
            className="hidden md:flex items-center gap-10 relative py-2"
          >
            {/* Sliding Underline Indicator */}
            <div
              ref={hoverUnderlineRef}
              className="absolute bottom-0 h-[2px] bg-[#6C63FF] rounded-full opacity-0 pointer-events-none"
              style={{ transition: "opacity 0.2s" }}
            />

            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.slice(1);
              return (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  onMouseEnter={(e) => updateUnderline(e.currentTarget)}
                  className={`
                    nav-btn nav-btn-${link.href.slice(1)}
                    relative text-[14px] font-medium py-1
                    transition-colors duration-200
                    ${isActive ? "nav-btn-active text-white" : "text-white/65 hover:text-white"}
                  `}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Spacer — keeps CTA right */}
          <div className="flex-1" />

          {/* CTA — far right */}
            <button
              onClick={() => scrollTo("#contact")}
              className="hidden md:block shrink-0 text-white text-[14px] font-[500]
                backdrop-blur-md transition-all duration-200 active:scale-[0.97]
                hover:shadow-[0_0_20px_rgba(108,99,255,0.4)]"
              style={{
                background: "rgba(108, 99, 255, 0.25)",
                border: "1px solid rgba(108, 99, 255, 0.4)",
                padding: "10px 22px",
                borderRadius: "999px",
              }}
            >
              Get Started →
            </button>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen((p) => !p)}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px] ml-auto"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileOpen}
          >
            <span className={`block w-5 h-[1.5px] bg-white rounded-full transition-all duration-300 origin-center
              ${mobileOpen ? "rotate-45 translate-y-[3.25px]" : ""}`} />
            <span className={`block w-5 h-[1.5px] bg-white rounded-full transition-all duration-300
              ${mobileOpen ? "opacity-0 scale-x-0" : ""}`} />
            <span className={`block w-5 h-[1.5px] bg-white rounded-full transition-all duration-300 origin-center
              ${mobileOpen ? "-rotate-45 -translate-y-[3.25px]" : ""}`} />
          </button>
        </div>
      </motion.nav>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            className="
              fixed inset-x-0 top-[72px] z-40
              md:hidden
              bg-black/90 backdrop-blur-2xl
              border-b border-white/[0.06]
              px-6 py-6 flex flex-col gap-2
            "
          >
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.slice(1);
              return (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className={`
                    w-full text-left px-4 py-3 rounded-xl text-base font-medium
                    transition-colors duration-200
                    ${isActive
                      ? "text-white bg-white/[0.06]"
                      : "text-white/65 hover:text-white hover:bg-white/[0.03]"
                    }
                  `}
                >
                  {link.label}
                </button>
              );
            })}
            <button
              onClick={() => scrollTo("#contact")}
              className="mt-2 w-full text-center text-base font-semibold text-white
                backdrop-blur-md transition-all duration-200 active:scale-[0.98]
                hover:shadow-[0_0_20px_rgba(108,99,255,0.4)]"
              style={{
                background: "rgba(108, 99, 255, 0.25)",
                border: "1px solid rgba(108, 99, 255, 0.4)",
                padding: "12px 22px",
                borderRadius: "999px"
              }}
            >
              Get Started →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
