"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import BrainParticles from "./BrainParticles";

interface BrainSceneProps {
  burstTrigger: number;
}

export default function BrainScene({ burstTrigger }: BrainSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.5], fov: 55 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <BrainParticles burstTrigger={burstTrigger} />
      </Suspense>
    </Canvas>
  );
}
