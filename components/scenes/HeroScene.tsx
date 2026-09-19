"use client";

import SceneLights from "@/components/3d/SceneLights";
import SceneBackdrop from "@/components/3d/SceneBackdrop";

import {
  Suspense,
  useEffect,
  useRef,
  useCallback,
  useState,
  useMemo,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import HeroOverlay from "@/components/ui/HeroOverlay";
import { cloneWatchScene } from "@/lib/cloneWatchScene";

const INITIAL_OFFSETS: Record<string, [number, number, number]> = {
  FinalStrap1: [0, -1.5, -1.5],
  FinalStrap2: [0, -1.5, 1.5],
  strapClip: [0, -2.5, 0],
  Watch: [0, 1.5, 0],
  Men: [0, 0, 1.5],
  watchGlass: [0, 2.5, 0],
  watchBottom: [0, -1.5, 0],
  WatchshellTop: [0, 0.5, 0],
};

const PART_NAMES = Object.keys(INITIAL_OFFSETS);

interface WatchPart {
  name: string;
  object: THREE.Object3D;
  originalPosition: THREE.Vector3;
  separatedPosition: THREE.Vector3;
}

function WatchModel({
  onAnimationComplete,
}: {
  onAnimationComplete: () => void;
}) {
  const { scene } = useGLTF("/models/watch.glb");
  const groupRef = useRef<THREE.Group>(null);
  const isRotatingRef = useRef(false);
  const rotationStartTimeRef = useRef(0);
  const assemblyTimelineRef = useRef<gsap.core.Timeline | null>(null);

  // Clone the scene, enhance materials, and BUILD THE PARTS MAP —
  // all in one memo. Return both the scene AND the parts, so the effect
  // never has to re-derive positions from the scene.
  const { clonedScene, parts } = useMemo(() => {
    const clone = cloneWatchScene(scene);

    clone.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;
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
    });

    // Build parts + set separated positions, all synchronously
    const partsMap = new Map<string, WatchPart>();

    PART_NAMES.forEach((partName) => {
      const object = clone.getObjectByName(partName);
      if (!object) {
        console.warn(`Part "${partName}" not found in watch model`);
        return;
      }

      // CRITICAL: capture the ORIGINAL position FIRST,
      // before we mutate the object's position.
      const originalPosition = object.position.clone();
      const offset = INITIAL_OFFSETS[partName] || [0, 0, 0];
      const separatedPosition = new THREE.Vector3(
        originalPosition.x + offset[0],
        originalPosition.y + offset[1],
        originalPosition.z + offset[2],
      );

      // Now move the object to separated position
      object.position.copy(separatedPosition);

      partsMap.set(partName, {
        name: partName,
        object,
        originalPosition,
        separatedPosition,
      });
    });

    return { clonedScene: clone, parts: partsMap };
  }, [scene]);

  // Assembly animation — uses the parts map from the memo.
  // The effect does NOT re-derive positions, so it's StrictMode-safe.
  useEffect(() => {
    if (parts.size === 0) return;

    // Reset to separated position on every effect run,
    // in case StrictMode's cleanup previously reset them.
    parts.forEach((part) => {
      part.object.position.copy(part.separatedPosition);
    });

    const delayedCall = gsap.delayedCall(1.5, () => {
      const assemblyTimeline = gsap.timeline({
        onComplete: () => {
          rotationStartTimeRef.current = -1;
          isRotatingRef.current = true;
          onAnimationComplete();
        },
      });

      assemblyTimelineRef.current = assemblyTimeline;

      parts.forEach((part) => {
        assemblyTimeline.to(
          part.object.position,
          {
            x: part.originalPosition.x,
            y: part.originalPosition.y,
            z: part.originalPosition.z,
            duration: 2,
            ease: "power3.inOut",
          },
          0,
        );
      });
    });

    return () => {
      delayedCall.kill();
      if (assemblyTimelineRef.current) {
        assemblyTimelineRef.current.kill();
        assemblyTimelineRef.current = null;
      }
      isRotatingRef.current = false;
    };
  }, [parts, onAnimationComplete]);

  useFrame((state, delta) => {
    if (!isRotatingRef.current || !groupRef.current) return;

    if (rotationStartTimeRef.current < 0) {
      rotationStartTimeRef.current = state.clock.elapsedTime;
    }

    const elapsedSinceRotation =
      state.clock.elapsedTime - rotationStartTimeRef.current;
    groupRef.current.rotation.y += delta * 0.5;
    const targetXRotation = Math.sin(elapsedSinceRotation * 0.3) * 0.2;
    groupRef.current.rotation.x +=
      (targetXRotation - groupRef.current.rotation.x) * 0.1;
  });

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} />
    </group>
  );
}

export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const [isAssemblyComplete, setIsAssemblyComplete] = useState(false);

  const handleAnimationComplete = useCallback(() => {
    setIsAssemblyComplete(true);
  }, []);

  useEffect(() => {
    if (!isAssemblyComplete) return;

    const textTimeline = gsap.timeline();

    if (titleRef.current) {
      textTimeline.to(
        titleRef.current,
        { opacity: 1, duration: 0.6, ease: "power2.inOut" },
        0,
      );
    }

    if (subtitleRef.current) {
      textTimeline.to(
        subtitleRef.current,
        { opacity: 1, duration: 0.6, ease: "power2.inOut" },
        0.25,
      );
    }

    if (scrollIndicatorRef.current) {
      textTimeline.to(
        scrollIndicatorRef.current,
        { opacity: 1, duration: 0.6, ease: "power2.inOut" },
        0.55,
      );
    }

    return () => {
      textTimeline.kill();
    };
  }, [isAssemblyComplete]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const outOfView = entry.intersectionRatio < 0.5;
          const targets = [
            titleRef.current,
            subtitleRef.current,
            scrollIndicatorRef.current,
          ];

          targets.forEach((el) => {
            if (!el) return;
            if (outOfView) {
              el.style.transition = "opacity 400ms ease-out";
              el.style.opacity = "0";
            } else if (isAssemblyComplete) {
              el.style.transition = "opacity 400ms ease-out";
              el.style.opacity = "1";
            }
          });
        });
      },
      {
        threshold: [0, 0.3, 0.5, 0.7, 1],
      },
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, [isAssemblyComplete]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-bg-base overflow-hidden"
    >
      <SceneBackdrop />

      <div className="absolute inset-0">
        <Canvas
          camera={{
            position: [4, 1, 4],
            fov: 50,
            near: 0.1,
            far: 100,
          }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.6,
          }}
        >
          <Suspense fallback={null}>
            <SceneLights animateSpotlight />
            <WatchModel onAnimationComplete={handleAnimationComplete} />
          </Suspense>
        </Canvas>
      </div>

      <HeroOverlay
        titleRef={titleRef}
        subtitleRef={subtitleRef}
        scrollIndicatorRef={scrollIndicatorRef}
      />
    </section>
  );
}
