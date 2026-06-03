"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, Billboard } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

gsap.registerPlugin(ScrollTrigger);

// Utility to convert lat/lon to 3D sphere coordinates
const toSphere = (lat: number, lon: number, radius: number) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
};

const CLIENTS = [
  { name: "injazat", lat: 24.4539, lon: 54.3773, desc: "AI Solutions Partner" },
  { name: "Lowe's", lat: 35.2271, lon: -80.8431, desc: "Retail Analytics Integration" },
  { name: "Cognizant", lat: 40.7128, lon: -74.006, desc: "Enterprise AI Transformation" },
  { name: "Trimble", lat: 37.3861, lon: -122.0839, desc: "Geospatial Data Processing" },
  { name: "e2open", lat: 30.2672, lon: -97.7431, desc: "Supply Chain Optimization" },
  { name: "Toyota", lat: 35.0564, lon: 137.1785, desc: "Automotive Intelligence" },
];

const HQ_LAT = 33.7490; // Atlanta HQ
const HQ_LON = -84.3880;

function Globe({ globeColor }: { globeColor: string }) {
  return (
    <group>
      {/* Main Sphere */}
      <mesh>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial
          color={globeColor}
          roughness={0.8}
          metalness={0.1}
          transparent={true}
          opacity={0.9}
        />
      </mesh>

      {/* Wireframe Overlay */}
      <mesh>
        <sphereGeometry args={[1.52, 24, 16]} />
        <meshBasicMaterial
          color="#6C63FF"
          wireframe={true}
          transparent={true}
          opacity={0.08}
        />
      </mesh>

      {/* Atmosphere Glow */}
      <mesh>
        <sphereGeometry args={[1.65, 32, 32]} />
        <meshStandardMaterial
          color="#6C63FF"
          transparent={true}
          opacity={0.04}
          side={THREE.BackSide}
          emissive="#6C63FF"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}

function Pin({ client, isHovered, onHover, isAnyHovered }: any) {
  const pos = useMemo(() => toSphere(client.lat, client.lon, 1.52), [client]);
  const pinRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const [distance, setDistance] = useState(0);

  useFrame(() => {
    if (pinRef.current) {
      // Calculate distance to camera to hide labels that are on the back of the globe
      const dist = camera.position.distanceTo(pinRef.current.getWorldPosition(new THREE.Vector3()));
      setDistance(dist);
    }
  });

  useEffect(() => {
    if (!ringRef.current) return;
    
    // Pulsing ring animation
    const ring = ringRef.current;
    gsap.to(ring.scale, {
      x: 2.5,
      y: 2.5,
      z: 2.5,
      duration: 2,
      repeat: -1,
      ease: "power1.out",
    });
    
    gsap.to(ring.material as THREE.Material, {
      opacity: 0,
      duration: 2,
      repeat: -1,
      ease: "power1.out",
    });
  }, []);

  useEffect(() => {
    if (pinRef.current) {
      gsap.to(pinRef.current.scale, {
        x: isHovered ? 2.5 : 1,
        y: isHovered ? 2.5 : 1,
        z: isHovered ? 2.5 : 1,
        duration: 0.3,
      });

      const material = pinRef.current.material as THREE.MeshStandardMaterial;
      gsap.to(material, {
        opacity: isAnyHovered && !isHovered ? 0.3 : 1,
        duration: 0.3,
      });
    }
  }, [isHovered, isAnyHovered]);

  // Only show label if it's somewhat facing the camera
  const showLabel = distance < 5;

  return (
    <group position={pos}>
      <mesh
        ref={pinRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(client.name);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          onHover(null);
        }}
      >
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial
          color="#6C63FF"
          emissive="#6C63FF"
          emissiveIntensity={1.5}
          transparent
        />
      </mesh>

      <Billboard>
        <mesh ref={ringRef}>
          <ringGeometry args={[0.03, 0.05, 16]} />
          <meshBasicMaterial color="#6C63FF" transparent opacity={1} side={THREE.DoubleSide} />
        </mesh>
      </Billboard>

      {showLabel && (
        <Html center position={[0, 0.1, 0]} style={{ pointerEvents: "none" }}>
          <div
            style={{
              fontSize: "11px",
              color: "white",
              background: "rgba(108,99,255,0.8)",
              padding: "3px 8px",
              borderRadius: "4px",
              whiteSpace: "nowrap",
              opacity: isAnyHovered && !isHovered ? 0.2 : 1,
              transition: "opacity 0.3s",
            }}
          >
            {client.name}
          </div>
          <AnimatePresence>
            {isHovered && (
              <motion.div
                key="tooltip"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                style={{
                  position: "absolute",
                  top: "100%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  marginTop: "4px",
                  fontSize: "10px",
                  color: "rgba(255,255,255,0.8)",
                  background: "rgba(0,0,0,0.8)",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  whiteSpace: "nowrap",
                  border: "1px solid rgba(108,99,255,0.4)",
                }}
              >
                {client.desc}
              </motion.div>
            )}
          </AnimatePresence>
        </Html>
      )}
    </group>
  );
}

function ConnectionArc({ client, index }: { client: any; index: number }) {
  const hqPos = useMemo(() => toSphere(HQ_LAT, HQ_LON, 1.52), []);
  const clientPos = useMemo(() => toSphere(client.lat, client.lon, 1.52), [client]);
  
  const curve = useMemo(() => {
    // Midpoint for the bezier curve
    const midPoint = hqPos.clone().lerp(clientPos, 0.5);
    // Push the midpoint out from the center of the globe to create an arc
    midPoint.normalize().multiplyScalar(1.52 + hqPos.distanceTo(clientPos) * 0.3);
    return new THREE.QuadraticBezierCurve3(hqPos, midPoint, clientPos);
  }, [hqPos, clientPos]);

  const points = useMemo(() => curve.getPoints(50), [curve]);
  const lineGeometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  const dotRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!dotRef.current) return;
    const time = state.clock.elapsedTime;
    // Staggered travel time
    const t = ((time * 0.2 + index * 0.15) % 1.0);
    const pos = curve.getPointAt(t);
    dotRef.current.position.copy(pos);
  });

  const linePrimitive = useMemo(() => {
    const mat = new THREE.LineBasicMaterial({ color: 0x9d97ff, transparent: true, opacity: 0.25 });
    return new THREE.Line(lineGeometry, mat);
  }, [lineGeometry]);

  return (
    <group>
      <primitive object={linePrimitive} />
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

function Scene({ globeColor }: { globeColor: string }) {
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);
  const groupRef = useRef<THREE.Group>(null);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (!groupRef.current) return;
    
    // Slight delay to ensure DOM is ready
    const timeout = setTimeout(() => {
      const sectionElement = document.getElementById("clients");
      const ctx = gsap.context(() => {
        // Start hidden
        groupRef.current!.scale.set(0, 0, 0);
        
        gsap.to(groupRef.current!.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 1.4,
          ease: "elastic.out(1, 0.5)",
          scrollTrigger: {
            trigger: sectionElement || "#clients",
            start: "top 60%",
          },
        });
      });
      return () => ctx.revert();
    }, 100);
    
    return () => clearTimeout(timeout);
  }, []);

  // Pins appear one by one
  const [pinsVisible, setPinsVisible] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => {
      const sectionElement = document.getElementById("clients");
      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: sectionElement || "#clients",
          start: "top 60%",
          onEnter: () => {
            setTimeout(() => setPinsVisible(true), 1000);
          }
        });
      });
      return () => ctx.revert();
    }, 100);
    
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 3, 5]} color="white" intensity={1.2} />
      <pointLight position={[-5, -3, -5]} color="#4A3FBF" intensity={0.4} />
      <pointLight position={[0, 0, 4]} color="#6C63FF" intensity={0.3} />

      <group ref={groupRef}>
        <Globe globeColor={globeColor} />
        {pinsVisible && CLIENTS.map((client, i) => (
          <group key={client.name}>
            <Pin
              client={client}
              isHovered={hoveredPin === client.name}
              isAnyHovered={hoveredPin !== null}
              onHover={setHoveredPin}
            />
            <ConnectionArc client={client} index={i} />
          </group>
        ))}
      </group>

      <OrbitControls
        ref={controlsRef}
        enableZoom={false}
        enablePan={false}
        autoRotate={hoveredPin === null}
        autoRotateSpeed={0.6}
        minPolarAngle={Math.PI * 0.3}
        maxPolarAngle={Math.PI * 0.7}
        enableDamping={true}
        dampingFactor={0.05}
      />
    </>
  );
}

export default function ClientsGlobe() {
  const { theme } = useTheme();
  const globeColor = theme === "light" ? "#F0F0FF" : "#0A0A1A";

  return (
    <div style={{ width: "100%", height: "45vh", minHeight: "350px", maxHeight: "450px", background: "transparent" }}>
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene globeColor={globeColor} />
      </Canvas>
    </div>
  );
}
