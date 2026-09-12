/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { useWatchStore } from "@/store/watch-store";
import ExplodableWatch from "@/components/3d/ExplodableWatch";
import PartDetailsPanel from "@/components/ui/PartDetailsPanel";
import SceneLights from "../3d/SceneLights";
import SceneBackdrop from "../3d/SceneBackdrop";

export default function ExploreScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef<number>(0);
  const [isReady, setIsReady] = useState(false);
  const clearSelection = useWatchStore((s) => s.clearSelection);

  const handleReady = useCallback(() => setIsReady(true), []);

  // Track scroll progress through this section
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => {
      const rect = container.getBoundingClientRect();
      const total = rect.height;
      const scrolled = -rect.top;
      const progress = THREE.MathUtils.clamp(scrolled / total, 0, 1);
      scrollProgressRef.current = progress;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Clear selection when scroll exits the exploded view range
  useEffect(() => {
    const checkProgress = () => {
      const p = scrollProgressRef.current;
      if (useWatchStore.getState().selectedPartId && (p < 0.5 || p > 0.95)) {
        clearSelection();
      }
    };
    const interval = setInterval(checkProgress, 100);
    return () => clearInterval(interval);
  }, [clearSelection]);

  return (
    <section
      ref={containerRef}
      className="relative w-full"
      style={{ height: "300vh" }}
    >
      {/* Sticky viewport */}
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full bg-bg-base overflow-hidden"
      >
        <SceneBackdrop />
        <Canvas
          camera={{ position: [3, 1, 6], fov: 50, near: 0.1, far: 100 }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.6,
          }}
        >
          <SceneLights />
          <ExplodableWatch
            scrollProgressRef={scrollProgressRef}
            onReady={handleReady}
          />
        </Canvas>

        {/* Hint text - only when exploded and nothing selected */}
        <ExplodeHint stickyRef={stickyRef} />

        {/* Part details panel */}
        <PartDetailsPanel />
      </div>
    </section>
  );
}

function ExplodeHint({
  stickyRef,
}: {
  stickyRef: React.RefObject<HTMLDivElement | null>;
}) {
  const selectedPartId = useWatchStore((s) => s.selectedPartId);
  const [isInView, setIsInView] = useState(false);

  // Hide hint when the sticky viewport starts leaving the screen
  useEffect(() => {
    const el = stickyRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Show when at least 60% of the sticky viewport is visible
          setIsInView(entry.intersectionRatio > 0.6);
        });
      },
      { threshold: [0, 0.3, 0.6, 0.9, 1] },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [stickyRef]);

  if (!isInView || selectedPartId) return null;

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none text-center">
      <p className="text-xs uppercase tracking-widest text-text-muted">
        Drag to rotate · Click a part to inspect
      </p>
    </div>
  );
}
