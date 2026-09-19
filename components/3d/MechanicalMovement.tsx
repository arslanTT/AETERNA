"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PALETTE = {
  gold: "#c9a84c",
  goldBright: "#e8c872",
  goldDeep: "#8a6f2e",
  steel: "#b8b8b8",
  steelBright: "#e0e0e0",
  gunmetal: "#1a1a1a",
  gunmetalDeep: "#0f0f0f",
  ruby: "#dc2626",
};

type PartKind = "ring" | "disc" | "cylinder" | "sphere" | "hex";

interface PartProps {
  kind: PartKind;
  position: [number, number, number];
  size: number;
  color: string;
  phase: number;
  showJewel?: boolean;
}

function Part({
  kind,
  position,
  size,
  color,
  phase,
  showJewel = false,
}: PartProps) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = position[1] + Math.sin(t * 0.6 + phase) * 0.03;
    ref.current.rotation.y += 0.004;
  });

  return (
    <group ref={ref} position={position}>
      {kind === "ring" && (
        <mesh>
          <torusGeometry args={[size, size * 0.18, 12, 48]} />
          <meshStandardMaterial
            color={color}
            metalness={1}
            roughness={0.15}
            envMapIntensity={2.5}
          />
        </mesh>
      )}
      {kind === "disc" && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[size, size, size * 0.15, 48]} />
          <meshStandardMaterial
            color={color}
            metalness={0.9}
            roughness={0.25}
            envMapIntensity={2}
          />
        </mesh>
      )}
      {kind === "cylinder" && (
        <mesh>
          <cylinderGeometry args={[size * 0.5, size * 0.5, size * 1.4, 32]} />
          <meshStandardMaterial
            color={color}
            metalness={1}
            roughness={0.2}
            envMapIntensity={2.5}
          />
        </mesh>
      )}
      {kind === "sphere" && (
        <mesh>
          <sphereGeometry args={[size * 0.55, 24, 24]} />
          <meshStandardMaterial
            color={color}
            metalness={0.9}
            roughness={0.15}
            envMapIntensity={2.5}
          />
        </mesh>
      )}
      {kind === "hex" && (
        <mesh>
          <cylinderGeometry args={[size * 0.4, size * 0.4, size * 0.35, 6]} />
          <meshStandardMaterial
            color={color}
            metalness={1}
            roughness={0.1}
            envMapIntensity={3}
          />
        </mesh>
      )}

      {showJewel && (
        <mesh position={[0, 0, size * 0.4]}>
          <sphereGeometry args={[size * 0.22, 16, 16]} />
          <meshStandardMaterial
            color={PALETTE.ruby}
            metalness={0.3}
            roughness={0.1}
            emissive="#991b1b"
            emissiveIntensity={0.7}
          />
        </mesh>
      )}
    </group>
  );
}

interface LayoutItem {
  kind: PartKind;
  size: number;
  color: string;
  showJewel?: boolean;
}

const ROW_1: LayoutItem[] = [
  { kind: "disc", size: 0.22, color: PALETTE.gold },
  { kind: "ring", size: 0.18, color: PALETTE.goldBright },
  { kind: "cylinder", size: 0.16, color: PALETTE.steelBright },
  { kind: "sphere", size: 0.18, color: PALETTE.ruby, showJewel: true },
];

const ROW_2: LayoutItem[] = [
  { kind: "hex", size: 0.16, color: PALETTE.steelBright },
  { kind: "disc", size: 0.22, color: PALETTE.goldBright },
  { kind: "ring", size: 0.18, color: PALETTE.goldDeep },
  { kind: "sphere", size: 0.18, color: PALETTE.ruby, showJewel: true },
];

function buildPositions(items: LayoutItem[], rowY: number) {
  const spacingX = 0.6;
  const startX = -((items.length - 1) * spacingX) / 2;
  return items.map((item, i) => ({
    ...item,
    position: [startX + i * spacingX, rowY, 0] as [number, number, number],
    phase: i * 0.8 + rowY * 2,
  }));
}

function Composition() {
  const row1 = useMemo(() => buildPositions(ROW_1, 0.42), []);
  const row2 = useMemo(() => buildPositions(ROW_2, -0.42), []);

  return (
    <group>
      <mesh position={[0, 0, -0.6]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.25, 1.25, 0.04, 96]} />
        <meshStandardMaterial
          color="#0d0d0d"
          metalness={0.85}
          roughness={0.4}
          envMapIntensity={1.2}
        />
      </mesh>

      <mesh position={[0, 0, -0.56]}>
        <torusGeometry args={[1.25, 0.006, 10, 128]} />
        <meshStandardMaterial
          color={PALETTE.goldDeep}
          metalness={1}
          roughness={0.3}
          envMapIntensity={2}
        />
      </mesh>

      <mesh position={[0, 0, -0.55]}>
        <torusGeometry args={[1.12, 0.004, 10, 128]} />
        <meshStandardMaterial
          color={PALETTE.goldDeep}
          metalness={1}
          roughness={0.35}
          envMapIntensity={1.8}
        />
      </mesh>

      {row1.map((p, i) => (
        <Part
          key={`r1-${i}`}
          kind={p.kind}
          position={p.position}
          size={p.size}
          color={p.color}
          phase={p.phase}
          showJewel={p.showJewel}
        />
      ))}

      {row2.map((p, i) => (
        <Part
          key={`r2-${i}`}
          kind={p.kind}
          position={p.position}
          size={p.size}
          color={p.color}
          phase={p.phase}
          showJewel={p.showJewel}
        />
      ))}
    </group>
  );
}

interface MechanicalMovementProps {
  revealProgress: number;
}

export default function MechanicalMovement({
  revealProgress,
}: MechanicalMovementProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    const s = Number.isFinite(revealProgress) ? revealProgress : 1;
    // Shrink the composition on mobile so it fits the narrow viewport
    const baseScale = isMobile ? 0.55 : 1;
    const scale = baseScale * (0.8 + s * 0.2);
    groupRef.current.scale.setScalar(scale);
    groupRef.current.visible = s > 0.01;
  });

  return (
    <group ref={groupRef}>
      <Composition />
    </group>
  );
}
