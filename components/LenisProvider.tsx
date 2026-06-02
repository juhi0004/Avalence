"use client";
import ReactLenis, { useLenis } from "lenis/react";
import { ReactNode, useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { useLenis };

export default function LenisProvider({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 1.8,
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.5,
        infinite: false,
      }}
      onScroll={() => {
        // Keep GSAP ScrollTrigger in sync with Lenis
        ScrollTrigger.update();
      }}
    >
      <LenisScrollTriggerSync />
      {children}
    </ReactLenis>
  );
}

// Separate component to access lenis instance
function LenisScrollTriggerSync() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    // Register Lenis scroll position with GSAP ScrollTrigger
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value?: number) {
        if (value !== undefined) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    // Tell ScrollTrigger to use Lenis scroll values
    const update = () => {
      ScrollTrigger.update();
    };
    gsap.ticker.add(update);

    ScrollTrigger.addEventListener("refresh", () => lenis.resize());
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(update);
      ScrollTrigger.scrollerProxy(document.body, undefined as any);
    };
  }, [lenis]);

  return null;
}