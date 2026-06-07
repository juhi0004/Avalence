"use client";

import { useRef, useMemo, useEffect, forwardRef, useImperativeHandle, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

export interface BrainParticlesHandle {
  triggerBurst: () => void;
  resetBrain: () => void;
  setBrainScale: (scale: number) => void;
  setQuality: (quality: "full" | "half") => void;
  getPoints: () => THREE.Points | null;
}

interface BrainParticlesProps {
  onBurst?: () => void;
}

const PARTICLE_COUNT = 15000;

function generateBrainPositions(): {
  originalPositions: Float32Array;
  burstTargets: Float32Array;
  colors: Float32Array;
} {
  const origPos = new Float32Array(PARTICLE_COUNT * 3);
  const burst = new Float32Array(PARTICLE_COUNT * 3);
  const colors = new Float32Array(PARTICLE_COUNT * 3);

  // Holographic glowing colors
  const colTop = new THREE.Color("#e8dcc8");
  const colMid = new THREE.Color("#BEA256");
  const colBottom = new THREE.Color("#8b7355");
  const colHighlight = new THREE.Color("#ffffff");

  function isInsideBrain(x: number, y: number, z: number) {
    // Longitudinal fissure (split between hemispheres)
    if (Math.abs(z) < 0.04 && y > -0.2) return false;

    // Main Cerebrum
    let nx = x / 1.2;
    let ny = (y - 0.2) / 0.9;
    let nz = z / 0.65;
    
    if (ny < 0) ny *= 1.2; // flatten bottom of cerebrum
    if (nx < 0) nx *= 0.9; // blunt frontal lobe
    
    let d_cerebrum = Math.sqrt(nx*nx + ny*ny + nz*nz);
    
    // Procedural wrinkles (sulci/gyri)
    let theta = Math.atan2(y - 0.2, x);
    let phi = Math.atan2(z, Math.sqrt(x*x + y*y));
    let wrinkle = 0.04 * Math.sin(theta * 25) * Math.cos(phi * 18) 
                + 0.02 * Math.sin(theta * 35);
    
    if (d_cerebrum + wrinkle < 1.0) return true;

    // Cerebellum (back-bottom lobe)
    let cx = (x - 0.75) / 0.45;
    let cy = (y + 0.45) / 0.35;
    let cz = z / 0.5;
    let d_cerebellum = Math.sqrt(cx*cx + cy*cy + cz*cz);
    let cb_wrinkle = 0.04 * Math.sin(cy * 40);
    if (d_cerebellum + cb_wrinkle < 1.0) return true;

    // Brain stem
    let sx = (x - 0.35 + (y + 0.3) * 0.2) / 0.18; 
    let sy = y;
    let sz = z / 0.18;
    if (sy < -0.2 && sy > -1.2) {
      let d_stem = Math.sqrt(sx*sx + sz*sz);
      if (d_stem < 1.0) return true;
    }

    return false;
  }

  const rawPoints: THREE.Vector3[] = [];
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  let minZ = Infinity, maxZ = -Infinity;

  // Rejection sampling for perfect biological silhouette
  while (rawPoints.length < PARTICLE_COUNT) {
    let x = (Math.random() - 0.5) * 4;
    let y = (Math.random() - 0.5) * 4;
    let z = (Math.random() - 0.5) * 2.5;
    
    if (isInsideBrain(x, y, z)) {
      rawPoints.push(new THREE.Vector3(x, y, z));
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      if (z < minZ) minZ = z;
      if (z > maxZ) maxZ = z;
    }
  }

  // Calculate center of mass
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const cz = (minZ + maxZ) / 2;

  // INCREASED SIZE (Multiplier) - Adjusted to prevent cropping
  const SCALE = 1.25;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = rawPoints[i];
    
    // Center and scale perfectly
    const px = (p.x - cx) * SCALE;
    const py = (p.y - cy) * SCALE;
    const pz = (p.z - cz) * SCALE;

    origPos[i * 3] = px;
    origPos[i * 3 + 1] = py;
    origPos[i * 3 + 2] = pz;

    // Burst targets (explode outwards from center)
    const dir = new THREE.Vector3(px, py, pz).normalize();
    const force = 20 + Math.random() * 80;
    burst[i * 3] = px + dir.x * force;
    burst[i * 3 + 1] = py + dir.y * force;
    burst[i * 3 + 2] = pz + dir.z * force;

    // Gradient calculation
    const yNorm = THREE.MathUtils.clamp((py + 1.8) / 3.6, 0, 1);
    let col = yNorm > 0.5
      ? colTop.clone().lerp(colMid, (1 - yNorm) * 2)
      : colMid.clone().lerp(colBottom, (0.5 - yNorm) * 2);

    // Create bright neural network "nodes" (12% of particles)
    if (Math.random() < 0.12) {
      col.lerp(colHighlight, 0.7);
    }

    colors[i * 3] = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;
  }

  return { originalPositions: origPos, burstTargets: burst, colors };
}

const BrainParticles = forwardRef<BrainParticlesHandle, BrainParticlesProps>(
  ({ onBurst }, ref) => {
    const pointsRef = useRef<THREE.Points>(null);
    const materialRef = useRef<THREE.PointsMaterial>(null);
    const isBursting = useRef(false);
    const currentQuality = useRef<"full" | "half">("full");
    const scaleOverride = useRef<number | null>(null);
    const burstTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const burstTweenRef = useRef<gsap.core.Tween | null>(null);
    const returnTweenRef = useRef<gsap.core.Tween | null>(null);

    const { originalPositions, burstTargets, colors } = useMemo(
      () => generateBrainPositions(),
      []
    );

    const geometry = useMemo(() => {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(originalPositions), 3));
      geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
      return geo;
    }, [originalPositions, colors]);

    // Cleanup on unmount
    useEffect(() => {
      return () => {
        if (burstTimerRef.current) clearTimeout(burstTimerRef.current);
        if (burstTweenRef.current) burstTweenRef.current.kill();
        if (returnTweenRef.current) returnTweenRef.current.kill();
      };
    }, []);

    const triggerBurst = useCallback(() => {
      if (!pointsRef.current || isBursting.current) return;

      const reducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reducedMotion) return;

      isBursting.current = true;
      onBurst?.();

      const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;

      // Phase 1 - Explode
      const proxy = { t: 0 };
      burstTweenRef.current = gsap.to(proxy, {
        t: 1,
        duration: 1.2,
        ease: "power2.out",
        onUpdate: () => {
          for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
            arr[i] = originalPositions[i] + (burstTargets[i] - originalPositions[i]) * proxy.t;
          }
          posAttr.needsUpdate = true;
        },
      });

      if (materialRef.current) {
        gsap.to(materialRef.current.color, { r: 1, g: 1, b: 1, duration: 1.0 });
        gsap.to(materialRef.current, { opacity: 0.25, duration: 1.2 });
      }
    }, [originalPositions, burstTargets, onBurst]);

    const resetBrain = useCallback(() => {
      if (!pointsRef.current) return;

      // Kill any ongoing burst animation
      if (burstTweenRef.current) burstTweenRef.current.kill();
      if (burstTimerRef.current) clearTimeout(burstTimerRef.current);

      const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;

      // Calculate current interpolation state
      // We need to figure out where particles currently are relative to original->burst
      const ret = { t: 1 };
      returnTweenRef.current = gsap.to(ret, {
        t: 0,
        duration: 2.0,
        ease: "elastic.out(1, 0.4)",
        onUpdate: () => {
          for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
            arr[i] = originalPositions[i] + (burstTargets[i] - originalPositions[i]) * ret.t;
          }
          posAttr.needsUpdate = true;
        },
        onComplete: () => {
          isBursting.current = false;
        },
      });

      if (materialRef.current) {
        gsap.to(materialRef.current.color, { r: 1, g: 1, b: 1, duration: 1.5 });
        gsap.to(materialRef.current, { opacity: 0.95, duration: 1.5 });
      }
    }, [originalPositions, burstTargets]);

    const setBrainScale = useCallback((scale: number) => {
      scaleOverride.current = scale;
      if (pointsRef.current) {
        pointsRef.current.scale.setScalar(scale);
      }
    }, []);

    const setQuality = useCallback((quality: "full" | "half") => {
      currentQuality.current = quality;
      if (!pointsRef.current) return;

      const geo = pointsRef.current.geometry;
      if (quality === "half") {
        // Draw only half of particles
        geo.setDrawRange(0, Math.floor(PARTICLE_COUNT / 2));
      } else {
        geo.setDrawRange(0, PARTICLE_COUNT);
      }
    }, []);

    useImperativeHandle(ref, () => ({
      triggerBurst,
      resetBrain,
      setBrainScale,
      setQuality,
      getPoints: () => pointsRef.current,
    }), [triggerBurst, resetBrain, setBrainScale, setQuality]);

    useFrame(({ clock }) => {
      if (!pointsRef.current) return;
      
      if (!isBursting.current && scaleOverride.current === null) {
        const breathe = 1.0 + 0.03 * Math.sin(clock.elapsedTime * 0.6);
        pointsRef.current.scale.setScalar(breathe);
      }
    });

    return (
      <group>
        <points ref={pointsRef} geometry={geometry}>
          <pointsMaterial
            ref={materialRef}
            size={0.03}
            sizeAttenuation
            transparent
            opacity={0.95}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            vertexColors
          />
        </points>
      </group>
    );
  }
);

BrainParticles.displayName = "BrainParticles";

export default BrainParticles;
