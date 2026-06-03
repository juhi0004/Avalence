"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";

export default function Footer() {
  const [time, setTime] = useState("");

  // Update clock every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };

    updateTime(); // Initial set
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Flicker animation every 10 seconds (old terminal style)
  useEffect(() => {
    const interval = setInterval(() => {
      const el = document.querySelector(".live-clock");
      if (el) {
        gsap.timeline()
          .to(el, { opacity: 0.7, duration: 0.05 })
          .to(el, { opacity: 1, duration: 0.05 });
      }
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const footerLinks = [
    {
      title: "Services",
      links: [
        { name: "Product Design", href: "#" },
        { name: "Development", href: "#" },
        { name: "GTM Strategy", href: "#" },
        { name: "AI Development", href: "#" },
        { name: "IoT Development", href: "#" },
      ],
    },
    {
      title: "Platform",
      links: [
        { name: "AVALENCE Core", href: "#" },
        { name: "AVALENCE Agentic", href: "#" },
        { name: "AVALENCE IntentIQ", href: "#" },
      ],
    },
    {
      title: "Demos",
      links: [
        { name: "Voice Agents", href: "#" },
        { name: "Generative UI", href: "#" },
        { name: "Sentiment AI", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Open AVALENCE", href: "#" },
        { name: "Clinix AI Platform", href: "#" },
        { name: "Contact", href: "#contact" },
      ],
    },
  ];

  return (
    <footer className="relative w-full bg-black border-t border-white/[0.05] overflow-hidden px-6 md:px-20 pt-20 pb-10">
      {/* ── Background Glow ── */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[80%] h-[500px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at bottom, rgba(74, 63, 191, 0.25) 0%, transparent 60%)"
        }}
      />

      <div className="relative z-10 w-full" style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="flex flex-col lg:flex-row justify-between gap-16 mb-24">
          
          {/* ── Left Column ── */}
          <div className="flex flex-col justify-between max-w-md w-full">
            <div>
              <a 
                href="mailto:atom@avalence.ai" 
                className="text-2xl md:text-3xl font-medium text-white hover:text-[#6C63FF] transition-colors inline-flex items-center gap-2 mb-6"
              >
                atom@avalence.ai
              </a>
              <div className="flex flex-col gap-3 text-text-muted">
                <a href="#" className="hover:text-white transition-colors inline-flex items-center gap-1 w-fit">
                  LinkedIn 
                  <svg className="w-4 h-4 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <p>Based globally · Serving clients worldwide</p>
              </div>
            </div>

            {/* Live Clock */}
            <div className="mt-20 lg:mt-32">
              <span className="live-clock font-mono text-[48px] md:text-[56px] font-[800] text-white tracking-tighter tabular-nums">
                {time || "00:00:00"}
              </span>
              <p className="text-text-muted text-xs tracking-widest mt-2 uppercase">Local Time</p>
            </div>
          </div>

          {/* ── Right Columns ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 w-full lg:w-auto flex-grow justify-end">
            {footerLinks.map((group) => (
              <div key={group.title} className="flex flex-col gap-6 lg:ml-auto">
                <h4 className="text-white font-semibold text-sm tracking-wide">{group.title}</h4>
                <ul className="flex flex-col gap-4">
                  {group.links.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href}
                        className="text-text-muted text-sm hover:text-white hover:underline underline-offset-4 decoration-white/30 transition-all"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="flex flex-col justify-start pt-8 border-t border-white/[0.05] text-sm text-white/40">
          <p>AVALENCE AI, © 2026. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
