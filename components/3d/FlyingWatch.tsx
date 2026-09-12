"use client";

import { useEffect, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useWatchStore } from "@/store/watch-store";
import {
  STRAP_COLORS,
  BEZEL_COLORS,
  CASE_COLORS,
  getColorDefinition,
} from "@/lib/constants";

interface FlyingWatchProps {
  start: boolean;
  onComplete: () => void;
  startPosition?: [number, number, number];
  endPosition?: [number, number, number];
}

const FLIGHT_DURATION = 1.0;

// Same mesh name mapping as CustomizableWatch
const CHAIN_MESH_NAMES = [
  "strapClip_MenMetal2_0",
  "FinalStrap1_MenMetal2_0",
  "FinalStrap1_MenMetal_0",
  "FinalStrap2_MenMetal2_0",
  "FinalStrap2_MenMetal_0",
];
const BEZEL_MESH_NAMES = ["WatchshellTop_RIS_ShaderPxrDisney2_0"];
const CASE_MESH_NAMES = ["watchShell_MenMetal2_0", "watchShell_MenMetal_0"];

export default function FlyingWatch({
  start,
  onComplete,
  startPosition = [0, 0, 0],
  endPosition = [0, -0.6, 0.5],
}: FlyingWatchProps) {
  const { scene } = useGLTF("/models/watch.glb");
  const groupRef = useRef<THREE.Group>(null);
  const progressRef = useRef(0);
  const hasCompletedRef = useRef(false);
  const arcVecRef = useRef(new THREE.Vector3());
  const startVecRef = useRef(new THREE.Vector3());
  const endVecRef = useRef(new THREE.Vector3());

  // Read current customization so the flying watch matches the user's watch
  const customization = useWatchStore((s) => s.customization);

  // Build the flying watch clone with the current colors applied
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.scale.set(0.115, 0.115, 0.115);
    clone.position.set(0, 0.22 * 0.115, 0.25 * 0.115);

    // Clone materials per-mesh so we can recolor independently
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const uniquePerMesh = new Map<THREE.Material, THREE.Material>();
        const cloneMaterial = (mat: THREE.Material): THREE.Material => {
          if (uniquePerMesh.has(mat)) return uniquePerMesh.get(mat)!;
          const cloned = mat.clone();
          uniquePerMesh.set(mat, cloned);
          return cloned;
        };
        mesh.material = Array.isArray(mesh.material)
          ? mesh.material.map(cloneMaterial)
          : cloneMaterial(mesh.material);
      }
    });

    // Apply colors
    const applyGroup = (
      meshNames: string[],
      colorKey: string,
      palette: typeof STRAP_COLORS,
    ) => {
      const def = getColorDefinition(palette, colorKey);
      meshNames.forEach((name) => {
        const mesh = clone.getObjectByName(name) as THREE.Mesh | undefined;
        if (!mesh) return;
        const materials = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];
        materials.forEach((mat) => {
          if (mat instanceof THREE.MeshStandardMaterial) {
            mat.color.set(def.hex);
            mat.metalness = def.metalness;
            mat.roughness = def.roughness;
            // Match texture-map handling for MenMetal
            if (mat.name === "MenMetal" && colorKey !== "black") {
              mat.map = null;
              mat.needsUpdate = true;
            }
          }
        });
      });
    };

    applyGroup(CHAIN_MESH_NAMES, customization.chain, STRAP_COLORS);
    applyGroup(BEZEL_MESH_NAMES, customization.bezel, BEZEL_COLORS);
    applyGroup(CASE_MESH_NAMES, customization.case, CASE_COLORS);

    return clone;
  }, [scene, customization]);

  useEffect(() => {
    if (start) {
      progressRef.current = 0;
      hasCompletedRef.current = false;
      if (groupRef.current) {
        groupRef.current.visible = true;
        groupRef.current.position.set(...startPosition);
        groupRef.current.scale.setScalar(1);
        groupRef.current.rotation.set(0, 0, 0);
      }
    } else {
      if (groupRef.current) {
        groupRef.current.visible = false;
      }
    }
  }, [start, startPosition]);

  useFrame((_, delta) => {
    if (!start || !groupRef.current) return;
    if (hasCompletedRef.current) return;

    progressRef.current = Math.min(
      progressRef.current + delta / FLIGHT_DURATION,
      1,
    );
    const t = progressRef.current;
    const eased = t * t * (3 - 2 * t);

    startVecRef.current.set(...startPosition);
    endVecRef.current.set(...endPosition);
    arcVecRef.current.lerpVectors(
      startVecRef.current,
      endVecRef.current,
      eased,
    );

    // Y-arc bump
    const arcHeight = 1.2;
    const yBump = Math.sin(eased * Math.PI) * arcHeight;
    arcVecRef.current.y += yBump;

    groupRef.current.position.copy(arcVecRef.current);

    // Scale 1 → 0.15
    const scale = 1 - eased * 0.85;
    groupRef.current.scale.setScalar(scale);

    // Spin
    groupRef.current.rotation.y += delta * 9;
    groupRef.current.rotation.x += delta * 4;

    if (t >= 1 && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      groupRef.current.visible = false;
      onComplete();
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      <primitive object={clonedScene} />
    </group>
  );
}
