"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
          flex items-center
          px-12
          transition-all duration-300
          ${scrolled
            ? "bg-black/70 backdrop-blur-md border-b border-white/[0.06] shadow-[0_1px_30px_rgba(108,99,255,0.05)]"
            : "bg-transparent border-b border-transparent"
          }
        `}
      >
        {/* Logo — far left */}
        <button
          onClick={() => scrollTo("#home")}
          className="flex items-center select-none group shrink-0"
          aria-label="Scroll to top"
        >
          <span
            className="text-white transition-colors duration-300 group-hover:text-white/90"
            style={{ fontSize: "18px", fontWeight: 800, letterSpacing: "0.15em" }}
          >
            AVALENCE
          </span>
          <span className="inline-block w-[6px] h-[6px] rounded-full bg-[#6C63FF] ml-[3px] mb-[1px] self-end
            transition-shadow duration-300 group-hover:shadow-[0_0_10px_rgba(108,99,255,0.7)]" />
        </button>

        {/* Spacer — pushes links to center */}
        <div className="flex-1" />

        {/* Desktop Nav Links — centered */}
        <div className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href.slice(1);
            return (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className={`
                  relative text-[14px] font-medium
                  transition-colors duration-200
                  ${isActive ? "text-white" : "text-white/65 hover:text-white"}
                `}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-[#6C63FF] rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
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
            bg-[#6C63FF] hover:bg-[#5a52e0]
            transition-colors duration-200
            active:scale-[0.97]"
          style={{
            padding:      "10px 22px",
            borderRadius: "999px",
          }}
        >
          Get Started →
        </button>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen((p) => !p)}
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px]"
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
                bg-[#6C63FF] hover:bg-[#5a52e0]
                transition-colors duration-200 active:scale-[0.98]"
              style={{ padding: "12px 22px", borderRadius: "999px" }}
            >
              Get Started →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
