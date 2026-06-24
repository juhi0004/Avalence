"use client";

import { motion } from "framer-motion";
import SilkMesh from "@/components/three/SilkMesh";

export default function CTASection() {
  const scrollToContact = () => {
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="cta"
      className="section-wrapper"
      style={{
        paddingTop: "60px",
        paddingBottom: "20px",
        // Override the .section-wrapper + .section-wrapper border-top that globals.css adds
        borderTop: "none",
      }}
    >
      <div className="content-container" style={{ maxWidth: "1400px" }}>
        <div
          className="cta-banner relative w-full rounded-[24px] overflow-hidden flex items-center min-h-[420px] shadow-2xl m-0"
          style={{ border: "1px solid rgba(190, 162, 86, 0.18)", background: "#050505" }}
        >
          {/* ── Three.js Shader Silk Mesh Background ── */}
          <SilkMesh />

          {/* ── Dark edge vignette ── */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)",
              zIndex: 1,
            }}
          />

          {/* ── Content — padded well away from all container edges ── */}
          <div
            className="cta-text relative w-full flex flex-col md:flex-row items-center justify-between gap-12"
            style={{
              zIndex: 2,
              padding: "64px 80px 64px 120px", // generous left push + top/bottom breathing room
            }}
          >
            <div className="max-w-3xl w-full">
              <h2 className="text-[32px] sm:text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] tracking-tight mb-10">
                <span className="font-normal block mb-2 sm:mb-3 text-[var(--text-secondary)]">
                  We turn bold ideas
                </span>
                <span className="font-extrabold block">
                  into powerful digital realities.
                </span>
              </h2>

              <motion.button
                onClick={scrollToContact}
                style={{
                  background: "rgba(190, 162, 86, 0.15)",
                  color: "#BEA256",
                  border: "1.5px solid rgba(190, 162, 86, 0.45)",
                  borderRadius: 12,
                  padding: "14px 36px",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 8,
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  boxShadow: "0 4px 24px rgba(190, 162, 86, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
                  transition: "all 0.3s ease",
                  letterSpacing: "0.3px",
                }}
                whileHover={{
                  background: "rgba(190, 162, 86, 0.28)",
                  boxShadow: "0 8px 32px rgba(190, 162, 86, 0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
                  borderColor: "rgba(190, 162, 86, 0.7)",
                }}
                whileTap={{ scale: 0.96 }}
              >
                Let&apos;s work together →
              </motion.button>
            </div>

            {/* Right spacer */}
            <div className="hidden lg:block w-full max-w-sm" />
          </div>
        </div>
      </div>

      {/* Remove the bottom divider line that globals.css adds via .section-wrapper + .section-wrapper */}
      <style>{`
        #cta.section-wrapper {
          border-top: none !important;
        }
        #cta.section-wrapper + .section-wrapper {
          border-top: none !important;
        }
        @media (max-width: 768px) {
          .cta-text {
            padding: 40px 28px 40px 28px !important;
          }
        }
        @media (max-width: 480px) {
          .cta-text {
            padding: 32px 20px 32px 20px !important;
          }
        }
      `}</style>
    </section>
  );
}
