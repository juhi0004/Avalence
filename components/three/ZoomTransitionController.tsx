"use client";

import { useThree, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  brainRef: React.RefObject<any>;
  frustumPlaneRef: React.RefObject<any>;
  onTransitionComplete: () => void;
  onTransitionReverse: () => void;
}

export default function ZoomTransitionController({
  brainRef,
  frustumPlaneRef,
  onTransitionComplete,
  onTransitionReverse,
}: Props) {
  const { camera, gl } = useThree();
  const progressRef = useRef(0);
  const hasTriggeredBurst = useRef(false);
  const hasTriggeredReveal = useRef(false);
  const hasTriggeredReverse = useRef(false);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  useEffect(() => {
    if (isMobile) return;

    // Find the hero section element
    const heroSection = document.getElementById("home");
    if (!heroSection) {
      console.warn("ZoomTransitionController: #home section not found");
      return;
    }

    // Use a proxy object for GSAP to animate
    const proxy = { progress: 0 };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroSection,
        start: "top top",
        end: "bottom top",
        scrub: 1.2,
        onUpdate: (self) => {
          progressRef.current = self.progress;
        },
      },
    });

    tl.to(proxy, {
      progress: 1,
      duration: 1,
      ease: "none",
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === heroSection) st.kill();
      });
    };
  }, [isMobile]);

  useFrame((state) => {
    if (isMobile) return;

    const p = progressRef.current;
    const cam = camera as THREE.PerspectiveCamera;

    // Debug logging (remove after confirming it works)
    if (Math.floor(state.clock.elapsedTime * 2) % 20 === 0) {
      console.log("Zoom progress:", progressRef.current.toFixed(3));
    }

    // PHASE 1: Approach (progress 0 → 0.40)
    if (p <= 0.40) {
      const t = p / 0.40;
      const eased = t * t * (3 - 2 * t); // smoothstep

      cam.position.z = THREE.MathUtils.lerp(3.8, 1.2, eased);
      cam.fov = THREE.MathUtils.lerp(50, 65, eased);
      cam.updateProjectionMatrix();

      // Brain grows slightly
      if (brainRef.current?.setBrainScale) {
        brainRef.current.setBrainScale(THREE.MathUtils.lerp(1.0, 1.3, eased));
      }

      // Frustum plane appears subtly
      if (frustumPlaneRef.current?.setOpacity) {
        frustumPlaneRef.current.setOpacity(THREE.MathUtils.lerp(0, 0.2, eased));
      }

      // Reset flags when going back to phase 1
      if (hasTriggeredBurst.current && p < 0.3) {
        hasTriggeredBurst.current = false;
        brainRef.current?.resetBrain?.();
      }
      if (hasTriggeredReveal.current && p < 0.3) {
        hasTriggeredReveal.current = false;
        hasTriggeredReverse.current = true;
        onTransitionReverse();
        window.dispatchEvent(new CustomEvent("avalence:servicesHide"));
      }
    }

    // PHASE 2: Plunge & Burst (progress 0.40 → 0.75)
    else if (p > 0.40 && p <= 0.75) {
      const t = (p - 0.40) / 0.35;
      const eased = t * t * (3 - 2 * t);

      cam.position.z = THREE.MathUtils.lerp(1.2, -1.0, eased); // Fly into the center
      cam.fov = THREE.MathUtils.lerp(65, 110, eased); // Extreme warp FOV
      cam.updateProjectionMatrix();

      // Camera shake during burst
      if (t > 0.1 && t < 0.9) {
        const shakeIntensity = Math.sin(t * Math.PI) * 0.04;
        cam.position.x = Math.sin(state.clock.elapsedTime * 15) * shakeIntensity;
        cam.position.y = Math.cos(state.clock.elapsedTime * 12) * shakeIntensity;
      } else {
        cam.position.x = THREE.MathUtils.lerp(cam.position.x, 0, 0.1);
        cam.position.y = THREE.MathUtils.lerp(cam.position.y, 0, 0.1);
      }

      // Trigger burst once
      if (!hasTriggeredBurst.current && t > 0.15) {
        hasTriggeredBurst.current = true;
        brainRef.current?.triggerBurst?.();
        // Reduce pixel ratio for performance during burst
        gl.setPixelRatio(Math.min(window.devicePixelRatio, 1));
      }

      // Frustum plane fills screen
      if (frustumPlaneRef.current?.setOpacity) {
        frustumPlaneRef.current.setOpacity(THREE.MathUtils.lerp(0.2, 1.0, eased));
      }
    }

    // PHASE 3: Reveal (progress 0.75 → 1.0)
    else if (p > 0.75) {
      const t = (p - 0.75) / 0.25;
      const eased = t * t * (3 - 2 * t);

      cam.position.z = THREE.MathUtils.lerp(-1.0, -3.0, eased); // Keep flying through
      cam.fov = THREE.MathUtils.lerp(110, 120, eased);
      cam.updateProjectionMatrix();
      cam.position.x = THREE.MathUtils.lerp(cam.position.x, 0, 0.15);
      cam.position.y = THREE.MathUtils.lerp(cam.position.y, 0, 0.15);

      // Frustum plane stays full opacity
      if (frustumPlaneRef.current?.setOpacity) {
        frustumPlaneRef.current.setOpacity(1.0);
      }

      // Restore pixel ratio
      gl.setPixelRatio(window.devicePixelRatio);

      // Trigger services reveal once
      if (!hasTriggeredReveal.current && t > 0.3) {
        hasTriggeredReveal.current = true;
        hasTriggeredReverse.current = false;
        onTransitionComplete();
        window.dispatchEvent(new CustomEvent("avalence:servicesReveal"));
      }
    }
  });

  return null;
}
