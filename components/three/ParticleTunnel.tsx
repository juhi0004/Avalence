"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PARTICLE_COUNT = 6000;

function TunnelParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const scrollVelocity = useRef(0);
  const lastScrollY = useRef(0);

  // Generate particles
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const cols = new Float32Array(PARTICLE_COUNT * 3);
    const color = new THREE.Color();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // angle = (i / 6000) * Math.PI * 2 * 80 (spiral around Z)
      const angle = (i / PARTICLE_COUNT) * Math.PI * 2 * 80;
      // radius = 2.5 + Math.random() * 1.5 (tunnel wall thickness)
      const radius = 2.5 + Math.random() * 1.5;
      // z = (i / 6000) * 80 - 40 (spread from z: -40 to z: +40)
      const z = (i / PARTICLE_COUNT) * 80 - 40;

      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      // Color gradient along Z axis
      if (z < -20) {
        color.setHex(0x4A3FBF); // deep violet
      } else if (z >= -20 && z < 0) {
        color.setHex(0x6C63FF); // violet
      } else if (z >= 0 && z < 20) {
        color.setHex(0x9D97FF); // light violet
      } else {
        color.setHex(0xC4C0FF); // lavender
      }

      cols[i * 3] = color.r;
      cols[i * 3 + 1] = color.g;
      cols[i * 3 + 2] = color.b;
    }

    return [pos, cols];
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const deltaY = currentScrollY - lastScrollY.current;
      scrollVelocity.current += deltaY * 0.005; // Base scroll influence
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const { camera, clock } = state;
    const time = clock.elapsedTime;

    // Camera shake effect
    camera.position.x = Math.sin(time * 0.3) * 0.05;
    camera.position.y = Math.cos(time * 0.2) * 0.03;

    // Dynamic FOV based on speed
    const targetFov = 75 + Math.abs(scrollVelocity.current) * 20;
    const perspectiveCamera = camera as THREE.PerspectiveCamera;
    perspectiveCamera.fov = THREE.MathUtils.lerp(perspectiveCamera.fov, Math.min(targetFov, 100), 0.1);
    perspectiveCamera.updateProjectionMatrix();

    // Move camera forward based on scroll velocity
    camera.position.z -= scrollVelocity.current * 0.08;

    // Decay scroll velocity
    scrollVelocity.current *= 0.92;

    // Rotate tunnel
    pointsRef.current.rotation.z += 0.002;

    // Loop particles that pass behind the camera
    const positionsAttr = pointsRef.current.geometry.attributes.position;
    const posArray = positionsAttr.array as Float32Array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const zIndex = i * 3 + 2;
      // If particle is behind camera, move it far ahead
      if (posArray[zIndex] > camera.position.z + 5) {
        posArray[zIndex] = camera.position.z - 80;
      }
      // If user scrolls backwards
      else if (posArray[zIndex] < camera.position.z - 80) {
        posArray[zIndex] = camera.position.z + 5;
      }
    }

    positionsAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        sizeAttenuation={true}
        vertexColors={true}
        transparent={true}
        opacity={0.8}
      />
    </points>
  );
}

export default function ParticleTunnel() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Determine if reduced motion is preferred to disable or scale down the effect
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    if (!containerRef.current) return;

    const sections = document.querySelectorAll(".section-wrapper");

    // Create ScrollTriggers for each section transition to show the tunnel
    sections.forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        end: "top 20%",
        onUpdate: (self) => {
          // Ramp opacity up and down based on progress
          let progress = self.progress;
          // Ramp up from 0 to 0.5 progress, ramp down from 0.5 to 1.0 progress
          let opacity = progress < 0.5 ? progress * 2 : (1 - progress) * 2;

          if (containerRef.current) {
            gsap.to(containerRef.current, {
              opacity: opacity,
              duration: 0.1,
              overwrite: "auto",
            });
          }
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 5,
        pointerEvents: "none",
        opacity: 0,
        background: "transparent",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 30], fov: 75 }}
        gl={{ antialias: false, alpha: true }}
      >
        <TunnelParticles />
      </Canvas>

      {/* Radial vignette overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse, transparent 30%, black 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
