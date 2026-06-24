"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function MeshGeometry() {
  const meshRef = useRef<THREE.Mesh>(null);
  const uniforms = useRef({
    uTime: { value: 0 },
    uAmplitude: { value: 0.15 }, // Subtle, gentle movement
  }).current;

  // Custom vertex shader to displace the grid points like smooth cloth waves
  const vertexShader = `
    uniform float uTime;
    uniform float uAmplitude;
    
    varying vec2 vUv;
    varying float vWave;

    void main() {
      vUv = uv;
      
      vec3 pos = position;
      // Very slow and large wave structure to mimic organic silk cloth folds
      float wave = sin(pos.x * 0.8 + uTime * 0.15) * cos(pos.y * 0.8 + uTime * 0.12) * uAmplitude;
      pos.z += wave;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      vWave = wave;
    }
  `;

  // Custom fragment shader using a single luxurious gold shade
  const fragmentShader = `
    uniform float uTime;
    varying vec2 vUv;
    varying float vWave;

    void main() {
      // Luxurious brand gold base color (#BEA256)
      vec3 goldColor = vec3(0.745, 0.635, 0.337); 
      
      // Calculate opacity shading based on the wave depth, keeping it very smooth and subtle
      float waveShading = (vWave + 0.15) / 0.3; // Map to 0..1 range
      float alpha = 0.05 + waveShading * 0.08 + sin(uTime * 0.1 + vUv.y * 0.5) * 0.02;
      
      gl_FragColor = vec4(goldColor, alpha);
    }
  `;

  useFrame(({ clock }) => {
    if (meshRef.current) {
      uniforms.uTime.value = clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -3]}>
      <planeGeometry args={[18, 10, 64, 64]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

export default function SilkMesh() {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <Canvas
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
        camera={{ position: [0, 0, 1], fov: 55 }}
        gl={{ alpha: true, antialias: true }}
      >
        <MeshGeometry />
      </Canvas>
    </div>
  );
}
