"use client";

import { useGLTF } from "@react-three/drei";
import {
  useEffect,
  useMemo,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { cloneWatchScene, WATCH_SCALE } from "@/lib/cloneWatchScene";

export interface WatchModelHandle {
  getParts: () => Map<string, THREE.Object3D>;
  startRotation: () => void;
  stopRotation: () => void;
}

interface WatchModelProps {
  scale?: number;
  onModelLoaded?: (parts: Map<string, THREE.Object3D>) => void;
}

const PART_NAMES = [
  "FinalStrap1",
  "FinalStrap2",
  "strapClip",
  "Watch",
  "Men",
  "watchGlass",
  "watchBottom",
  "WatchshellTop",
] as const;

const INITIAL_OFFSETS: Record<string, [number, number, number]> = {
  FinalStrap1: [0, -0.15, -0.15],
  FinalStrap2: [0, -0.15, 0.15],
  strapClip: [0, -0.25, 0],
  Watch: [0, 0.15, 0],
  Men: [0, 0, 0.1],
  watchGlass: [0, 0.25, 0],
  watchBottom: [0, -0.1, 0],
  WatchshellTop: [0, 0.05, 0],
};

const WatchModel = forwardRef<WatchModelHandle, WatchModelProps>(
  ({ scale = WATCH_SCALE, onModelLoaded }, ref) => {
    const { scene } = useGLTF("/models/watch.glb");
    const groupRef = useRef<THREE.Group>(null);
    const partsRef = useRef<Map<string, THREE.Object3D>>(new Map());
    const originalPositionsRef = useRef<Map<string, THREE.Vector3>>(new Map());
    const isRotatingRef = useRef(false);

    const clonedScene = useMemo(
      () => cloneWatchScene(scene, scale),
      [scene, scale],
    );

    useEffect(() => {
      const parts = new Map<string, THREE.Object3D>();
      const originalPositions = new Map<string, THREE.Vector3>();

      PART_NAMES.forEach((partName) => {
        const part = clonedScene.getObjectByName(partName);
        if (part) {
          parts.set(partName, part);
          originalPositions.set(partName, part.position.clone());

          const offset = INITIAL_OFFSETS[partName];
          if (offset) {
            part.position.set(
              part.position.x + offset[0],
              part.position.y + offset[1],
              part.position.z + offset[2],
            );
          }
        }
      });

      partsRef.current = parts;
      originalPositionsRef.current = originalPositions;
      onModelLoaded?.(parts);

      return () => {
        parts.clear();
        originalPositions.clear();
      };
    }, [clonedScene, onModelLoaded]);

    useImperativeHandle(ref, () => ({
      getParts: () => partsRef.current,
      startRotation: () => {
        isRotatingRef.current = true;
      },
      stopRotation: () => {
        isRotatingRef.current = false;
      },
    }));

    useFrame((_, delta) => {
      if (isRotatingRef.current && groupRef.current) {
        groupRef.current.rotation.y += delta * 0.1;
      }
    });

    return (
      <group ref={groupRef}>
        <primitive object={clonedScene} />
      </group>
    );
  },
);

WatchModel.displayName = "WatchModel";

export default WatchModel;

useGLTF.preload("/models/watch.glb");
