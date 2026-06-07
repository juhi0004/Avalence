"use client";
import { Canvas } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import BrainParticles from "./BrainParticles";
import ZoomTransitionController from "./ZoomTransitionController";
import FrustumPlane from "./FrustumPlane";
import type { FrustumPlaneHandle } from "./FrustumPlane";

interface BrainSceneProps {
  onBurst?: () => void;
  onTransitionComplete?: () => void;
  onTransitionReverse?: () => void;
  isDark?: boolean;
}

export default function BrainScene({
  onBurst,
  onTransitionComplete,
  onTransitionReverse,
  isDark = true,
}: BrainSceneProps) {
  const brainRef = useRef<any>(null);
  const frustumPlaneRef = useRef<FrustumPlaneHandle>(null);

  return (
    <Canvas
      camera={{ fov: 50, position: [0, 0.2, 3.8], near: 0.1, far: 100 }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <ambientLight color="#BEA256" intensity={1.5} />
        <pointLight position={[2, 2, 2]} color="#ffffff" intensity={0.8} />
        <pointLight position={[-2, -1, -2]} color="#8b7355" intensity={0.5} />

        <FrustumPlane
          ref={frustumPlaneRef}
          planeZ={-3}
          color={isDark ? [0, 0, 0] : [0.97, 0.97, 1.0]}
          opacity={0}
        />

        <BrainParticles
          ref={brainRef}
          onBurst={onBurst}
        />

        <ZoomTransitionController
          brainRef={brainRef}
          frustumPlaneRef={frustumPlaneRef}
          onTransitionComplete={onTransitionComplete ?? (() => {})}
          onTransitionReverse={onTransitionReverse ?? (() => {})}
        />
      </Suspense>
    </Canvas>
  );
}
