"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Navigation links ── */
const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
] as const;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  /* ── Track scroll position for visual treatment ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Intersection Observer: highlight active nav link ── */
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1));
    const observers: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-40% 0px -55% 0px" }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  /* ── Smooth scroll handler ── */
  const scrollTo = useCallback(
    (href: string) => {
      setMobileOpen(false);
      const id = href.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        const yOffset = -64; // navbar height
        const y =
          el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    },
    []
  );

  /* ── Framer variants ── */
  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      y: -16,
      transition: { duration: 0.2, ease: "easeInOut" as const },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.25, ease: "easeOut" as const },
    },
  };

  return (
    <>
      {/* ── Desktop & Mobile Top Bar ── */}
      <motion.nav
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`
          fixed top-0 left-0 w-full z-50
          h-[var(--av-navbar-h)]
          flex items-center justify-between
          px-6 md:px-10 lg:px-16
          transition-all duration-300
          ${
            scrolled
              ? "bg-black/70 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_1px_30px_rgba(108,99,255,0.06)]"
              : "bg-transparent border-b border-transparent"
          }
        `}
      >
        {/* ── Logo ── */}
        <button
          onClick={() => scrollTo("#home")}
          className="flex items-center gap-0 select-none group"
          aria-label="Scroll to top"
        >
          <span className="text-lg font-bold tracking-[0.22em] text-white transition-colors duration-300 group-hover:text-white/90">
            AVALENC
          </span>
          <span className="text-lg font-bold tracking-[0.22em] text-white transition-colors duration-300 group-hover:text-white/90">
            E
          </span>
          <span className="inline-block w-[6px] h-[6px] rounded-full bg-primary ml-[2px] mb-[1px] self-end transition-shadow duration-300 group-hover:shadow-[0_0_10px_rgba(108,99,255,0.7)]" />
        </button>

        {/* ── Desktop Links ── */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href.slice(1);
            return (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className={`
                  relative px-4 py-2 text-sm font-medium rounded-lg
                  transition-colors duration-200
                  ${
                    isActive
                      ? "text-white"
                      : "text-white/55 hover:text-white/80"
                  }
                `}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-lg bg-white/[0.06]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    style={{ zIndex: -1 }}
                  />
                )}
              </button>
            );
          })}

          {/* ── CTA Button ── */}
          <button
            onClick={() => scrollTo("#contact")}
            className="
              ml-4 px-5 py-2 text-sm font-semibold rounded-lg
              bg-primary text-white
              transition-all duration-300
              hover:shadow-[0_0_24px_rgba(108,99,255,0.45)]
              hover:brightness-110
              active:scale-[0.97]
            "
          >
            Get Started →
          </button>
        </div>

        {/* ── Mobile Hamburger ── */}
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px] group"
          aria-label="Toggle mobile menu"
          aria-expanded={mobileOpen}
        >
          <span
            className={`block w-5 h-[1.5px] bg-white rounded-full transition-all duration-300 origin-center ${
              mobileOpen ? "rotate-45 translate-y-[3.25px]" : ""
            }`}
          />
          <span
            className={`block w-5 h-[1.5px] bg-white rounded-full transition-all duration-300 ${
              mobileOpen ? "opacity-0 scale-x-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-[1.5px] bg-white rounded-full transition-all duration-300 origin-center ${
              mobileOpen ? "-rotate-45 -translate-y-[3.25px]" : ""
            }`}
          />
        </button>
      </motion.nav>

      {/* ── Mobile Menu Overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            className="
              fixed inset-x-0 top-[var(--av-navbar-h)] z-40
              md:hidden
              bg-black/90 backdrop-blur-2xl
              border-b border-white/[0.06]
              px-6 py-6
              flex flex-col gap-2
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
                    ${
                      isActive
                        ? "text-white bg-white/[0.06]"
                        : "text-white/55 hover:text-white/80 hover:bg-white/[0.03]"
                    }
                  `}
                >
                  {link.label}
                </button>
              );
            })}

            <button
              onClick={() => scrollTo("#contact")}
              className="
                mt-2 w-full px-5 py-3 text-base font-semibold rounded-xl
                bg-primary text-white text-center
                transition-all duration-300
                hover:shadow-[0_0_24px_rgba(108,99,255,0.45)]
                active:scale-[0.98]
              "
            >
              Get Started →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
