"use client";
import { forwardRef, useImperativeHandle, useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface FrustumPlaneProps {
  planeZ?: number;
  color?: number[];
  opacity?: number;
}

export interface FrustumPlaneHandle {
  setOpacity: (opacity: number) => void;
  setColor: (r: number, g: number, b: number) => void;
}

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uTime;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
               mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
  }

  void main() {
    // Subtle animated noise
    float n = noise(vUv * 5.0 + uTime * 0.1) * 0.05;
    
    // Radial vignette so it blends perfectly
    float dist = distance(vUv, vec2(0.5));
    float alpha = smoothstep(0.75, 0.2, dist) * uOpacity;
    
    vec3 finalColor = uColor + vec3(n);
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

const FrustumPlane = forwardRef<FrustumPlaneHandle, FrustumPlaneProps>(
  ({ planeZ = -3, color = [0, 0, 0], opacity = 0 }, ref) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const { camera, size } = useThree();

    const uniforms = useMemo(
      () => ({
        uColor: { value: new THREE.Color(color[0], color[1], color[2]) },
        uOpacity: { value: opacity },
        uTime: { value: 0 },
      }),
      [] // eslint-disable-line react-hooks/exhaustive-deps
    );

    useFrame((state) => {
      if (materialRef.current) {
        materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      }
    });

    useImperativeHandle(ref, () => ({
      setOpacity: (val: number) => {
        if (materialRef.current) {
          materialRef.current.uniforms.uOpacity.value = Math.max(0, Math.min(1, val));
        }
      },
      setColor: (r: number, g: number, b: number) => {
        if (materialRef.current) {
          materialRef.current.uniforms.uColor.value.setRGB(r, g, b);
        }
      },
    }));

    // Calculate frustum dimensions dynamically to always fill screen
    const cam = camera as THREE.PerspectiveCamera;
    const fovRad = (cam.fov * Math.PI) / 180;
    const dist = Math.abs(planeZ - cam.position.z);
    const height = 2 * Math.tan(fovRad / 2) * dist;
    const width = height * (size.width / size.height);

    return (
      <mesh ref={meshRef} position={[0, 0, planeZ]} renderOrder={-1}>
        <planeGeometry args={[width * 1.5, height * 1.5]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
        />
      </mesh>
    );
  }
);

FrustumPlane.displayName = "FrustumPlane";
export default FrustumPlane;
