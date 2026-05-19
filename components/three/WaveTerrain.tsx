"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function WavePlane() {
  const planeRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const mesh = planeRef.current;
    if (!mesh) return;

    const geometry = mesh.geometry as THREE.PlaneGeometry;
    const positionAttr = geometry.attributes.position;
    const count = positionAttr.count;

    for (let i = 0; i < count; i++) {
      const x = positionAttr.getX(i);
      const y = positionAttr.getY(i);

      // Simplex-like sine wave displacement
      const z = Math.sin(x * 0.8 + time * 0.4) * 0.3 + Math.sin(y * 1.2 + time * 0.3) * 0.2;

      positionAttr.setZ(i, z);
    }

    positionAttr.needsUpdate = true;
  });

  return (
    <mesh ref={planeRef} rotation={[-Math.PI / 2.8, 0, 0]} position={[0, -2, -1]}>
      <planeGeometry args={[20, 8, 80, 32]} />
      <meshStandardMaterial
        color="#6C63FF"
        wireframe={true}
        transparent={true}
        opacity={0.15}
      />
    </mesh>
  );
}

export default function WaveTerrain() {
  return (
    <div className="absolute bottom-0 left-0 w-full h-[200px] z-[1] pointer-events-none overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent", pointerEvents: "none" }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 5, 5]} color="#6C63FF" intensity={2} />
        <WavePlane />
      </Canvas>

      {/* Vertical gradient fade mask */}
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, black 0%, transparent 40%, transparent 60%, black 100%)",
        }}
      />
    </div>
  );
}
