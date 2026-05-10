"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

interface BrainParticlesProps {
  burstTrigger: number;
}

const PARTICLE_COUNT = 8000;

export default function BrainParticles({ burstTrigger }: BrainParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const isBursting = useRef(false);

  /* ── Generate brain-shaped particle positions ── */
  const { originalPositions, burstTargets } = useMemo(() => {
    const origPos = new Float32Array(PARTICLE_COUNT * 3);
    const burst = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const nx = Math.sin(phi) * Math.cos(theta);
      const ny = Math.cos(phi);
      const nz = Math.sin(phi) * Math.sin(theta);

      /* Wrinkle noise (brain folds) */
      const wrinkle =
        Math.sin(theta * 8) * Math.sin(phi * 6) * 0.07 +
        Math.sin(theta * 3 + phi * 5) * 0.04 +
        Math.sin(phi * 15) * 0.02;

      const r = 1.5 + wrinkle;
      let x = nx * r;
      let y = ny * r;
      const z = nz * r;

      /* Hemisphere separation (central fissure) */
      x += nx > 0 ? 0.18 : -0.18;

      /* Flatten Y slightly */
      y *= 0.82;

      origPos[i * 3] = x;
      origPos[i * 3 + 1] = y;
      origPos[i * 3 + 2] = z;

      /* Random burst targets (outward explosion) */
      const bR = 3 + Math.random() * 5;
      const bTheta = Math.random() * Math.PI * 2;
      const bPhi = Math.acos(2 * Math.random() - 1);
      burst[i * 3] = Math.sin(bPhi) * Math.cos(bTheta) * bR;
      burst[i * 3 + 1] = Math.cos(bPhi) * bR;
      burst[i * 3 + 2] = Math.sin(bPhi) * Math.sin(bTheta) * bR;
    }

    return { originalPositions: origPos, burstTargets: burst };
  }, []);

  /* ── Build geometry once ── */
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(originalPositions);
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    return geo;
  }, [originalPositions]);

  /* ── Rotation + breathing ── */
  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += 0.0008;

    if (!isBursting.current) {
      const breathe = 1.0 + 0.04 * Math.sin(clock.elapsedTime * 0.7);
      pointsRef.current.scale.setScalar(breathe);
    }
  });

  /* ── Burst effect ── */
  useEffect(() => {
    if (burstTrigger === 0 || !pointsRef.current || isBursting.current) return;
    isBursting.current = true;

    const posAttr = pointsRef.current.geometry.attributes
      .position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      isBursting.current = false;
      return;
    }

    /* Phase 1 — Explode */
    const proxy = { t: 0 };
    gsap.to(proxy, {
      t: 1,
      duration: 1.2,
      ease: "power2.out",
      onUpdate: () => {
        for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
          arr[i] =
            originalPositions[i] +
            (burstTargets[i] - originalPositions[i]) * proxy.t;
        }
        posAttr.needsUpdate = true;
      },
    });

    /* Color: violet → white, then fade */
    if (materialRef.current) {
      gsap.to(materialRef.current.color, {
        r: 1,
        g: 1,
        b: 1,
        duration: 1.0,
      });
      gsap.to(materialRef.current, {
        opacity: 0.3,
        duration: 1.2,
      });
    }

    /* Phase 2 — Return after 1.4s */
    const timer = setTimeout(() => {
      const ret = { t: 1 };
      gsap.to(ret, {
        t: 0,
        duration: 2.0,
        ease: "elastic.out(1, 0.4)",
        onUpdate: () => {
          for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
            arr[i] =
              originalPositions[i] +
              (burstTargets[i] - originalPositions[i]) * ret.t;
          }
          posAttr.needsUpdate = true;
        },
        onComplete: () => {
          isBursting.current = false;
        },
      });

      if (materialRef.current) {
        gsap.to(materialRef.current.color, {
          r: 0.545,
          g: 0.498,
          b: 1.0,
          duration: 1.5,
        });
        gsap.to(materialRef.current, { opacity: 1.0, duration: 1.5 });
      }
    }, 1400);

    return () => clearTimeout(timer);
  }, [burstTrigger, originalPositions, burstTargets]);

  return (
    <group>
      <points ref={pointsRef} geometry={geometry}>
        <pointsMaterial
          ref={materialRef}
          color="#8B7FFF"
          size={0.012}
          sizeAttenuation
          transparent
          opacity={1}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <pointLight position={[0, 0, 2]} color="#6C63FF" intensity={2} />
      <ambientLight intensity={0.1} />
    </group>
  );
}
