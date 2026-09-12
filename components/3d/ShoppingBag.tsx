"use client";

import { useRef, forwardRef, useImperativeHandle } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export interface ShoppingBagHandle {
  getGroup: () => THREE.Group | null;
  playBounce: () => void;
}

interface ShoppingBagProps {
  visible: boolean;
}

const ShoppingBag = forwardRef<ShoppingBagHandle, ShoppingBagProps>(
  ({ visible }, ref) => {
    const groupRef = useRef<THREE.Group>(null);
    const scaleRef = useRef(0);
    const bounceRef = useRef(0);
    const bounceTimeRef = useRef(0);

    useImperativeHandle(ref, () => ({
      getGroup: () => groupRef.current,
      playBounce: () => {
        bounceTimeRef.current = 0;
        bounceRef.current = 1;
      },
    }));

    useFrame((_, delta) => {
      if (!groupRef.current) return;

      const targetScale = visible ? 1 : 0;
      scaleRef.current +=
        (targetScale - scaleRef.current) * Math.min(delta * 6, 1);

      if (bounceRef.current > 0) {
        bounceTimeRef.current += delta;
        const t = bounceTimeRef.current / 0.6;
        if (t >= 1) {
          bounceRef.current = 0;
        }
      }

      let bounceScale = 1;
      if (bounceRef.current > 0) {
        const t = bounceTimeRef.current / 0.6;
        bounceScale = 1 + Math.sin(t * Math.PI * 4) * 0.12 * (1 - t);
      }

      const s = scaleRef.current * bounceScale;
      groupRef.current.scale.setScalar(s);
      groupRef.current.visible = s > 0.001;
    });

    return (
      <group ref={groupRef} position={[0, -0.6, 0.5]} scale={0}>
        {/* Bag body — lighter charcoal so it reads on the dark bg */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[1.3, 1.5, 0.55]} />
          <meshStandardMaterial
            color="#2a2a2e"
            metalness={0.3}
            roughness={0.55}
            emissive="#0a0a0a"
            emissiveIntensity={0.4}
          />
        </mesh>

        {/* Side panel darker for depth (left) */}
        <mesh position={[-0.66, 0, 0]} castShadow>
          <boxGeometry args={[0.02, 1.5, 0.55]} />
          <meshStandardMaterial
            color="#141416"
            metalness={0.4}
            roughness={0.5}
          />
        </mesh>

        {/* Side panel darker for depth (right) */}
        <mesh position={[0.66, 0, 0]} castShadow>
          <boxGeometry args={[0.02, 1.5, 0.55]} />
          <meshStandardMaterial
            color="#141416"
            metalness={0.4}
            roughness={0.5}
          />
        </mesh>

        {/* Gold trim on top edge */}
        <mesh position={[0, 0.75, 0]}>
          <boxGeometry args={[1.32, 0.06, 0.57]} />
          <meshStandardMaterial
            color="#c9a84c"
            metalness={0.95}
            roughness={0.2}
            emissive="#c9a84c"
            emissiveIntensity={0.15}
          />
        </mesh>

        {/* Gold accent vertical line down the center (front) */}
        <mesh position={[0, 0, 0.28]}>
          <boxGeometry args={[0.04, 1.4, 0.02]} />
          <meshStandardMaterial
            color="#c9a84c"
            metalness={0.9}
            roughness={0.25}
          />
        </mesh>

        {/* Handles — half torus on each side */}
        <mesh position={[-0.4, 0.85, 0]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.18, 0.022, 8, 32, Math.PI]} />
          <meshStandardMaterial
            color="#c9a84c"
            metalness={0.95}
            roughness={0.15}
            emissive="#c9a84c"
            emissiveIntensity={0.2}
          />
        </mesh>
        <mesh position={[0.4, 0.85, 0]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.18, 0.022, 8, 32, Math.PI]} />
          <meshStandardMaterial
            color="#c9a84c"
            metalness={0.95}
            roughness={0.15}
            emissive="#c9a84c"
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>
    );
  },
);

ShoppingBag.displayName = "ShoppingBag";

export default ShoppingBag;
