"use client";

import { useEffect, useRef, useMemo, useCallback } from "react";
import { useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useWatchStore } from "@/store/watch-store";
import { WATCH_PARTS, PART_NAMES } from "@/lib/watch-parts";

interface ExplodableWatchProps {
  scrollProgressRef: React.RefObject<number>;
  onReady?: () => void;
}

interface PartEntry {
  id: string;
  object: THREE.Object3D;
  originalPosition: THREE.Vector3;
  explodedPosition: THREE.Vector3;
  currentScale: number;
  focusOffset: number;
  floatPhase: number;
}

// Scroll thresholds (must match ExploreScene if changed)
const EXPLODE_START = 0.1;
const EXPLODE_END = 0.7;
const SNAP_THRESHOLD = 0.5; // crossing this activates "exploded mode"
const REASSEMBLE_START = 0.85;
const REASSEMBLE_END = 1.0;

function ClickCatcher() {
  const clearSelection = useWatchStore((s) => s.clearSelection);

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      // Only fire if we actually hit the plane (not a part behind it)
      if (e.delta > 5) return; // ignore drag-then-release
      e.stopPropagation();
      clearSelection();
    },
    [clearSelection],
  );

  return (
    <mesh position={[0, 0, -10]} onClick={handleClick} visible={false}>
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  );
}

export default function ExplodableWatch({
  scrollProgressRef,
  onReady,
}: ExplodableWatchProps) {
  const { scene } = useGLTF("/models/watch.glb");
  const { gl } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const partsRef = useRef<Map<string, PartEntry>>(new Map());
  const autoRotateRef = useRef(0);
  const isDraggingRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0 });
  const dragVelocityRef = useRef(0);

  // Snap state: 0 = off, 1 = fully snapped open
  const snapProgressRef = useRef(0);
  // Whether we're in interactive exploded mode
  const isInteractiveRef = useRef(false);

  const selectedPartId = useWatchStore((s) => s.selectedPartId);
  const hoveredPartId = useWatchStore((s) => s.hoveredPartId);
  const setSelectedPart = useWatchStore((s) => s.setSelectedPart);
  const setHoveredPart = useWatchStore((s) => s.setHoveredPart);
  const clearSelection = useWatchStore((s) => s.clearSelection);

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.scale.set(0.115, 0.115, 0.115);
    clone.position.set(0, 0.22 * 0.115, 0.25 * 0.115);

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const materials = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];

        materials.forEach((mat) => {
          if (mat instanceof THREE.MeshStandardMaterial) {
            if (mat.name.includes("Metal") || mat.name.includes("RIS_Shader")) {
              mat.metalness = 0.8;
              mat.roughness = 0.2;
              mat.envMapIntensity = 1.5;
            }
            if (mat.name === "Plastic" || mat.name === "Glass") {
              mat.roughness = 0.3;
            }
            if (mat.color.getHex() === 0x000000) {
              mat.color.set("#333333");
            }
          }
        });
      }
    });

    return clone;
  }, [scene]);

  useEffect(() => {
    const parts = new Map<string, PartEntry>();

    PART_NAMES.forEach((partName) => {
      const object = clonedScene.getObjectByName(partName);
      if (!object) {
        console.warn(`Part "${partName}" not found`);
        return;
      }

      const originalPosition = object.position.clone();
      const info = WATCH_PARTS[partName];
      const explodedPosition = new THREE.Vector3(
        originalPosition.x + info.explosionOffset[0],
        originalPosition.y + info.explosionOffset[1],
        originalPosition.z + info.explosionOffset[2],
      );

      object.traverse((child) => {
        child.userData.partId = partName;
      });

      parts.set(partName, {
        id: partName,
        object,
        originalPosition,
        explodedPosition,
        currentScale: 1,
        focusOffset: 0,
        floatPhase: Math.random() * Math.PI * 2,
      });
    });

    partsRef.current = parts;
    onReady?.();

    return () => {
      parts.clear();
    };
  }, [clonedScene, onReady]);

  // Drag rotation
  useEffect(() => {
    const domElement = gl.domElement;
    if (!domElement) return;

    const onPointerDown = (e: PointerEvent) => {
      // Only enable drag when in interactive exploded mode
      if (!isInteractiveRef.current) return;
      isDraggingRef.current = true;
      lastPointerRef.current = { x: e.clientX, y: e.clientY };
      dragVelocityRef.current = 0;
      domElement.style.cursor = "grabbing";
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
      domElement.style.cursor = "auto";
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

  const handlePointerOver = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      // Gate interaction: only when fully snapped open
      if (!isInteractiveRef.current) return;
      if (isDraggingRef.current) return;
      e.stopPropagation();
      if (useWatchStore.getState().selectedPartId) return;
      const partId = e.object.userData.partId as string | undefined;
      if (partId) {
        setHoveredPart(partId);
        document.body.style.cursor = "pointer";
      }
    },
    [setHoveredPart],
  );

  const handlePointerOut = useCallback(() => {
    setHoveredPart(null);
    document.body.style.cursor = "auto";
  }, [setHoveredPart]);

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      // Gate interaction: only when fully snapped open
      if (!isInteractiveRef.current) return;
      e.stopPropagation();
      if (isDraggingRef.current) return;
      const partId = e.object.userData.partId as string | undefined;
      if (partId) {
        setSelectedPart(partId);
      }
    },
    [setSelectedPart],
  );

  useFrame((state, delta) => {
    const parts = partsRef.current;
    const progress = scrollProgressRef.current ?? 0;

    // --- 1. Compute scroll-driven explosion progress ---
    let scrollExplosion = 0;
    if (progress <= EXPLODE_START) scrollExplosion = 0;
    else if (progress <= EXPLODE_END) {
      const t = (progress - EXPLODE_START) / (EXPLODE_END - EXPLODE_START);
      scrollExplosion = t * t * (3 - 2 * t);
    } else if (progress <= REASSEMBLE_START) scrollExplosion = 1;
    else {
      const t =
        (progress - REASSEMBLE_START) / (REASSEMBLE_END - REASSEMBLE_START);
      const eased = t * t * (3 - 2 * t);
      scrollExplosion = 1 - eased;
    }

    // --- 2. Snap behavior ---
    // Determine target snap state based on scroll threshold
    const aboveThreshold = progress >= SNAP_THRESHOLD;
    const belowReassemble = progress < REASSEMBLE_START;
    const shouldBeInteractive = aboveThreshold && belowReassemble;

    // Smooth snap progress
    const snapTarget = shouldBeInteractive ? 1 : 0;
    snapProgressRef.current +=
      (snapTarget - snapProgressRef.current) * Math.min(delta * 4, 1);

    // Consider "interactive" once snap is > 0.9
    const wasInteractive = isInteractiveRef.current;
    isInteractiveRef.current = snapProgressRef.current > 0.9;

    // If we just left interactive mode, clear selection
    if (wasInteractive && !isInteractiveRef.current) {
      if (useWatchStore.getState().selectedPartId) {
        clearSelection();
      }
    }

    // --- 3. Final explosion = max of scroll-driven and snap-driven ---
    // When snapped in, force full explosion; otherwise follow scroll
    const explosionProgress = Math.max(
      scrollExplosion,
      snapProgressRef.current * (aboveThreshold && belowReassemble ? 1 : 0),
    );

    const isFullyExploded = explosionProgress > 0.95;
    const hasSelection = selectedPartId !== null && isInteractiveRef.current;

    // --- 4. Group rotation ---
    if (groupRef.current) {
      if (!isDraggingRef.current) {
        groupRef.current.rotation.y += dragVelocityRef.current;
        dragVelocityRef.current *= 0.95;
      }

      if (!isDraggingRef.current && !hasSelection) {
        const targetAutoRotate = isFullyExploded ? 0.35 : 0.15;
        autoRotateRef.current +=
          (targetAutoRotate - autoRotateRef.current) * Math.min(delta * 2, 1);
        groupRef.current.rotation.y += autoRotateRef.current * delta;
      } else if (hasSelection) {
        autoRotateRef.current *= 0.9;
      }
    }

    const time = state.clock.elapsedTime;

    // --- 5. Update parts ---
    parts.forEach((part) => {
      const { object, id } = part;

      const baseX = THREE.MathUtils.lerp(
        part.originalPosition.x,
        part.explodedPosition.x,
        explosionProgress,
      );
      const baseY = THREE.MathUtils.lerp(
        part.originalPosition.y,
        part.explodedPosition.y,
        explosionProgress,
      );
      const baseZ = THREE.MathUtils.lerp(
        part.originalPosition.z,
        part.explodedPosition.z,
        explosionProgress,
      );

      let floatY = 0;
      let floatX = 0;
      if (isFullyExploded && isInteractiveRef.current) {
        const isSelected = hasSelection && selectedPartId === id;
        const floatAmp = 0.02 * (isSelected ? 0.2 : 1);
        floatY = Math.sin(time * 0.8 + part.floatPhase) * floatAmp;
        floatX = Math.cos(time * 0.6 + part.floatPhase) * floatAmp * 0.5;
      }

      let targetScale = 1;
      if (hasSelection) {
        targetScale = selectedPartId === id ? 1.5 : 0.95;
      } else if (hoveredPartId === id && isInteractiveRef.current) {
        targetScale = 1.08;
      }

      part.currentScale +=
        (targetScale - part.currentScale) * Math.min(delta * 8, 1);

      const targetFocus = hasSelection && selectedPartId === id ? 1.5 : 0;
      part.focusOffset +=
        (targetFocus - part.focusOffset) * Math.min(delta * 5, 1);

      object.position.set(
        baseX + floatX,
        baseY + floatY,
        baseZ + part.focusOffset,
      );
      object.scale.setScalar(part.currentScale);
    });
  });

  return (
    <group ref={groupRef}>
      <ClickCatcher />
      <primitive
        object={clonedScene}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      />
    </group>
  );
}
