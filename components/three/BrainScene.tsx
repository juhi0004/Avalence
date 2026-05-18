"use client";

import { Canvas } from "@react-three/fiber";
import BrainParticles from "./BrainParticles";

export default function BrainScene({ burstTrigger }: { burstTrigger: number }) {
  return (
    <Canvas
      camera={{ position: [0, 0.2, 3.8], fov: 60 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <BrainParticles burstTrigger={burstTrigger} />
    </Canvas>
  );
}
