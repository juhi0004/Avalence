"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

// ── Animated silk-mesh canvas background ──────────────────────────────────────
function SilkMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    // Resize canvas to match parent
    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Gold colour palette
    const GOLDS = [
      "rgba(190, 162, 86,",   // brand gold
      "rgba(212, 185, 106,",  // light gold
      "rgba(107, 79, 26,",    // deep amber
      "rgba(237, 217, 152,",  // champagne
      "rgba(143, 117, 55,",   // mid gold
    ];

    // Waving "silk" lines
    const LINES = 14;
    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      // Dark base
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, W, H);

      for (let l = 0; l < LINES; l++) {
        const phase     = (l / LINES) * Math.PI * 2;
        const amplitude = H * (0.12 + (l % 4) * 0.055);
        const speed     = 0.0008 + l * 0.00015;
        const yBase     = H * (0.25 + (l / LINES) * 0.52);
        const colorIdx  = l % GOLDS.length;
        const alpha     = 0.06 + (l % 5) * 0.028;

        ctx.beginPath();
        ctx.moveTo(0, yBase);

        for (let x = 0; x <= W; x += 4) {
          const y =
            yBase +
            Math.sin(x * 0.004 + t * speed * 900 + phase) * amplitude * 0.55 +
            Math.sin(x * 0.002 + t * speed * 600 + phase * 1.4) * amplitude * 0.35 +
            Math.cos(x * 0.007 + t * speed * 400 + phase * 0.7) * amplitude * 0.1;
          ctx.lineTo(x, y);
        }

        // Gradient along the wave width
        const grad = ctx.createLinearGradient(0, 0, W, 0);
        grad.addColorStop(0,   `${GOLDS[colorIdx]} 0)`);
        grad.addColorStop(0.3, `${GOLDS[colorIdx]} ${alpha})`);
        grad.addColorStop(0.6, `${GOLDS[(colorIdx + 1) % GOLDS.length]} ${alpha * 1.6})`);
        grad.addColorStop(1,   `${GOLDS[colorIdx]} 0)`);

        ctx.strokeStyle = grad;
        ctx.lineWidth   = 1 + (l % 3) * 0.7;
        ctx.stroke();
      }

      // Soft gold bloom on the right side (matching reference)
      const bloom = ctx.createRadialGradient(W * 0.78, H * 0.45, 0, W * 0.78, H * 0.45, W * 0.42);
      bloom.addColorStop(0,   "rgba(190, 162, 86, 0.18)");
      bloom.addColorStop(0.5, "rgba(190, 162, 86, 0.06)");
      bloom.addColorStop(1,   "rgba(190, 162, 86, 0)");
      ctx.fillStyle = bloom;
      ctx.fillRect(0, 0, W, H);

      // Secondary subtle bloom left
      const bloom2 = ctx.createRadialGradient(W * 0.18, H * 0.6, 0, W * 0.18, H * 0.6, W * 0.3);
      bloom2.addColorStop(0,   "rgba(143, 117, 55, 0.12)");
      bloom2.addColorStop(1,   "rgba(143, 117, 55, 0)");
      ctx.fillStyle = bloom2;
      ctx.fillRect(0, 0, W, H);

      t += 1;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
// ─────────────────────────────────────────────────────────────────────────────

export default function CTASection() {
  const scrollToContact = () => {
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="cta" className="section-wrapper" style={{ paddingTop: "60px", paddingBottom: "20px" }}>
      <div className="content-container" style={{ maxWidth: "1400px" }}>
        <div
          className="cta-banner relative w-full rounded-[24px] overflow-hidden flex items-center min-h-[420px] shadow-2xl m-0"
          style={{ border: "1px solid rgba(190, 162, 86, 0.18)", background: "#050505" }}
        >
          {/* ── Silk Mesh Canvas Background ── */}
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

          {/* ── Content ── */}
          <div
            className="cta-text relative w-full px-10 py-10 md:pl-[80px] md:pr-[60px] md:py-[60px] flex flex-col md:flex-row items-center justify-between gap-12"
            style={{ zIndex: 2 }}
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
                  marginTop: 24,
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

            {/* Right spacer so text stays left-aligned like reference */}
            <div className="hidden lg:block w-full max-w-sm" />
          </div>
        </div>
      </div>
    </section>
  );
}
