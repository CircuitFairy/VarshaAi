"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Sphere } from "@react-three/drei";
import * as THREE from "three";

function Globe({ opacity, layer }: { opacity: number, layer: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001; // slow rotation
    }
  });

  // Depending on the selected layer, we change the material colors slightly
  let baseColor = "#111827"; // dark blue/gray
  let emissiveColor = "#000000";
  
  if (layer === "infrared") {
    baseColor = "#450a0a"; // dark red
    emissiveColor = "#dc2626"; // red glow
  } else if (layer === "water-vapor") {
    baseColor = "#064e3b"; // dark green
    emissiveColor = "#059669"; // emerald glow
  } else if (layer === "visible") {
    baseColor = "#1e3a8a"; // blue
    emissiveColor = "#3b82f6";
  }

  return (
    <Sphere ref={meshRef} args={[2, 64, 64]}>
      <meshStandardMaterial 
        color={baseColor}
        emissive={emissiveColor}
        emissiveIntensity={opacity / 100 * 0.5}
        transparent={true}
        opacity={opacity / 100}
        wireframe={layer === 'cloud-top'} // wireframe for cloud top
      />
    </Sphere>
  );
}

export function EarthGlobe({ opacity, activeLayer }: { opacity: number, activeLayer: string }) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      
      <Globe opacity={opacity} layer={activeLayer} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <OrbitControls 
        enablePan={false}
        enableZoom={true}
        minDistance={3}
        maxDistance={10}
        autoRotate={false}
      />
    </Canvas>
  );
}
