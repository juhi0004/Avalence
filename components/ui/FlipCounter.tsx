"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface FlipCounterProps {
  value: string;
  label: string;
}

interface DigitCardProps {
  targetDigit: string;
  triggerFlip: boolean;
  delay: number;
}

function DigitCard({ targetDigit, triggerFlip, delay }: DigitCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (triggerFlip) {
      const timer = setTimeout(() => {
        setIsFlipped(true);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      setIsFlipped(false);
    }
  }, [triggerFlip, delay]);

  return (
    <div 
      className="relative select-none" 
      style={{ 
        perspective: "400px",
        width: "clamp(24px, 3.5vw, 44px)",
        height: "clamp(48px, 6vw, 76px)",
      }}
    >
      <div
        className="w-full h-full transition-transform duration-700"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateX(-180deg)" : "rotateX(0deg)",
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Front Face (Initial Digit: 0) */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/10 border border-white/20 text-white shadow-lg"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <span 
            style={{ 
              fontSize: "clamp(28px, 4vw, 48px)", 
              fontWeight: 800, 
              fontFamily: "monospace",
              fontVariantNumeric: "tabular-nums", 
              fontFeatureSettings: '"tnum"' 
            }}
          >
            0
          </span>
        </div>

        {/* Back Face (Target Digit) */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/10 border border-white/20 text-white shadow-lg"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateX(-180deg)",
          }}
        >
          <span 
            style={{ 
              fontSize: "clamp(28px, 4vw, 48px)", 
              fontWeight: 800, 
              fontFamily: "monospace",
              fontVariantNumeric: "tabular-nums", 
              fontFeatureSettings: '"tnum"' 
            }}
          >
            {targetDigit}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function FlipCounter({ value, label }: FlipCounterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.5 });
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    if (isInView) {
      setTrigger(true);
    }
  }, [isInView]);

  // Split value into array of characters
  const chars = value.split("");

  return (
    <div 
      ref={containerRef} 
      className="flex flex-col items-center justify-center text-center py-6 px-4"
    >
      <div className="flex items-center justify-center gap-1.5 mb-3">
        {chars.map((char, index) => {
          const isDigit = /[0-9]/.test(char);

          if (isDigit) {
            return (
              <DigitCard
                key={index}
                targetDigit={char}
                triggerFlip={trigger}
                delay={index * 120}
              />
            );
          } else {
            // Suffix or prefix (+, %, $, etc.)
            return (
              <motion.span
                key={index}
                initial={{ scale: 0, y: 20, opacity: 0 }}
                animate={trigger ? { scale: [0, 1.2, 1], y: 0, opacity: 1 } : {}}
                transition={{
                  duration: 0.5,
                  delay: index * 120 / 1000 + 0.3,
                  ease: "easeOut",
                }}
                className="text-[#8B7FFF] inline-block font-extrabold select-none"
                style={{
                  fontSize: "clamp(28px, 4vw, 48px)",
                  lineHeight: 1,
                }}
              >
                {char}
              </motion.span>
            );
          }
        })}
      </div>

      <span
        style={{
          fontSize: "14px",
          color: "rgba(255,255,255,0.9)",
          fontWeight: 600,
          display: "block",
          marginTop: "8px",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    </div>
  );
}
