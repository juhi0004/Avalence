"use client";

import ReactLenis from "lenis/react";
import { ReactNode } from "react";

export default function LenisProvider({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{
      lerp: 0.08,
      duration: 1.8,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
      infinite: false,
    }}>
      {children}
    </ReactLenis>
  );
}