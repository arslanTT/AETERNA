"use client";

import { useEffect, useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useWatchStore } from "@/store/watch-store";
import {
  STRAP_COLORS,
  BEZEL_COLORS,
  CASE_COLORS,
  getColorDefinition,
} from "@/lib/constants";

const CHAIN_MESH_NAMES = [
  "strapClip_MenMetal2_0",
  "FinalStrap1_MenMetal2_0",
  "FinalStrap1_MenMetal_0",
  "FinalStrap2_MenMetal2_0",
  "FinalStrap2_MenMetal_0",
];

const BEZEL_MESH_NAMES = ["WatchshellTop_RIS_ShaderPxrDisney2_0"];

const CASE_MESH_NAMES = ["watchShell_MenMetal2_0", "watchShell_MenMetal_0"];

interface MaterialAnim {
  material: THREE.MeshStandardMaterial;
  originalColor: THREE.Color;
  originalMetalness: number;
  originalRoughness: number;
  originalMap: THREE.Texture | null;
  currentColor: THREE.Color;
  targetColor: THREE.Color;
  currentMetalness: number;
  targetMetalness: number;
  currentRoughness: number;
  targetRoughness: number;
}

export default function CustomizableWatch() {
  const { scene } = useGLTF("/models/watch.glb");
  const { gl } = useThree();
  const groupRef = useRef<THREE.Group>(null);

  const chainAnimsRef = useRef<MaterialAnim[]>([]);
  const bezelAnimsRef = useRef<MaterialAnim[]>([]);
  const caseAnimsRef = useRef<MaterialAnim[]>([]);

  const isDraggingRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0 });
  const dragVelocityRef = useRef(0);

  const customization = useWatchStore((s) => s.customization);

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.scale.set(0.115, 0.115, 0.115);
    clone.position.set(0, 0.22 * 0.115, 0.25 * 0.115);

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

        const materials = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];

        materials.forEach((mat) => {
          if (mat instanceof THREE.MeshStandardMaterial) {
            if (mat.name.includes("Metal") || mat.name.includes("RIS_Shader")) {
              mat.envMapIntensity = 1.5;
            }
            if (mat.name === "Plastic" || mat.name === "Glass") {
              mat.roughness = 0.3;
            }
          }
        });
      }
    });

    return clone;
  }, [scene]);

  useEffect(() => {
    const collectAnims = (meshNames: string[]): MaterialAnim[] => {
      const anims: MaterialAnim[] = [];
      meshNames.forEach((meshName) => {
        const mesh = clonedScene.getObjectByName(meshName) as
          | THREE.Mesh
          | undefined;
        if (!mesh) {
          console.warn(`CustomizableWatch: mesh "${meshName}" not found`);
          return;
        }
        const materials = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];
        materials.forEach((mat) => {
          if (!(mat instanceof THREE.MeshStandardMaterial)) return;
          anims.push({
            material: mat,
            originalColor: mat.color.clone(),
            originalMetalness: mat.metalness,
            originalRoughness: mat.roughness,
            originalMap: mat.map,
            currentColor: mat.color.clone(),
            targetColor: mat.color.clone(),
            currentMetalness: mat.metalness,
            targetMetalness: mat.metalness,
            currentRoughness: mat.roughness,
            targetRoughness: mat.roughness,
          });
        });
      });
      return anims;
    };
    chainAnimsRef.current = collectAnims(CHAIN_MESH_NAMES);
    bezelAnimsRef.current = collectAnims(BEZEL_MESH_NAMES);
    caseAnimsRef.current = collectAnims(CASE_MESH_NAMES);
  }, [clonedScene]);

  useEffect(() => {
    const applyColor = (
      anims: MaterialAnim[],
      colorKey: string,
      palette: typeof STRAP_COLORS,
    ) => {
      const def = getColorDefinition(palette, colorKey);
      const targetColor = new THREE.Color(def.hex);

      anims.forEach((anim) => {
        anim.targetColor.copy(targetColor);
        anim.targetMetalness = def.metalness;
        anim.targetRoughness = def.roughness;

        if (anim.material.name === "MenMetal" && anim.originalMap) {
          if (colorKey === "black") {
            if (anim.material.map !== anim.originalMap) {
              anim.material.map = anim.originalMap;
              anim.material.needsUpdate = true;
            }
          } else {
            if (anim.material.map !== null) {
              anim.material.map = null;
              anim.material.needsUpdate = true;
            }
          }
        }
      });
    };

    applyColor(chainAnimsRef.current, customization.chain, STRAP_COLORS);
    applyColor(bezelAnimsRef.current, customization.bezel, BEZEL_COLORS);
    applyColor(caseAnimsRef.current, customization.case, CASE_COLORS);
  }, [customization]);

  // Drag rotation — cursor handled via CSS on the container
  useEffect(() => {
    const domElement = gl.domElement;
    if (!domElement) return;

    const onPointerDown = (e: PointerEvent) => {
      isDraggingRef.current = true;
      lastPointerRef.current = { x: e.clientX, y: e.clientY };
      dragVelocityRef.current = 0;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current || !groupRef.current) return;

      const dx = e.clientX - lastPointerRef.current.x;
      const dy = e.clientY - lastPointerRef.current.y;

      const rotY = dx * 0.008;
      const rotX = dy * 0.008;

      groupRef.current.rotation.y += rotY;
      groupRef.current.rotation.x = THREE.MathUtils.clamp(
        groupRef.current.rotation.x + rotX,
        -Math.PI / 3,
        Math.PI / 3,
      );

      dragVelocityRef.current = rotY;
      lastPointerRef.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
    };

    domElement.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      domElement.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [gl]);

  useFrame((state, delta) => {
    const lerpSpeed = Math.min(delta * 4, 1);

    const animate = (anims: MaterialAnim[]) => {
      anims.forEach((anim) => {
        anim.currentColor.lerp(anim.targetColor, lerpSpeed);
        anim.material.color.copy(anim.currentColor);
        anim.currentMetalness +=
          (anim.targetMetalness - anim.currentMetalness) * lerpSpeed;
        anim.currentRoughness +=
          (anim.targetRoughness - anim.currentRoughness) * lerpSpeed;
        anim.material.metalness = anim.currentMetalness;
        anim.material.roughness = anim.currentRoughness;
      });
    };

    animate(chainAnimsRef.current);
    animate(bezelAnimsRef.current);
    animate(caseAnimsRef.current);

    if (groupRef.current) {
      if (!isDraggingRef.current) {
        groupRef.current.rotation.y += dragVelocityRef.current;
        dragVelocityRef.current *= 0.95;
        groupRef.current.rotation.y += delta * 0.15;
      }
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} />
    </group>
  );
}
