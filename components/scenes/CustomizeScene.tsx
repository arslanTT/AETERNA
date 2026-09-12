"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { useWatchStore } from "@/store/watch-store";
import CustomizableWatch from "@/components/3d/CustomizableWatch";
import ColorSwatchGroup from "@/components/ui/ColorSwatchGroup";
import SelectionsPanel from "@/components/ui/SelectionsPanel";
import SceneLights from "@/components/3d/SceneLights";
import SceneBackdrop from "@/components/3d/SceneBackdrop";
import { STRAP_COLORS, BEZEL_COLORS, CASE_COLORS } from "@/lib/constants";

export default function CustomizeScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  const customization = useWatchStore((s) => s.customization);
  const setCustomization = useWatchStore((s) => s.setCustomization);

  // Watch when the section enters/leaves view
  useEffect(() => {
    const el = stickyRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.intersectionRatio > 0.5);
        });
      },
      { threshold: [0, 0.3, 0.5, 0.7, 1] },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleSelect = useCallback(
    (key: "chain" | "bezel" | "case", color: string) => {
      setCustomization(key, color);
    },
    [setCustomization],
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full"
      style={{ height: "200vh" }}
    >
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full bg-bg-base overflow-hidden cursor-grab active:cursor-grabbing"
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
          <CustomizableWatch />
        </Canvas>

        {/* Title */}
        <div
          className={`
            absolute top-16 left-1/2 -translate-x-1/2 text-center
            pointer-events-none
            transition-opacity duration-700 ease-out
            ${isInView ? "opacity-100" : "opacity-0"}
          `}
        >
          <h2
            className="font-display text-3xl sm:text-4xl md:text-5xl text-text-primary tracking-[0.15em]"
            style={{
              textShadow: "0 0 40px rgba(201, 168, 76, 0.25)",
            }}
          >
            Make It Yours
          </h2>
          <p className="mt-3 font-sans text-sm text-text-muted tracking-widest uppercase">
            Configure your Aeterna
          </p>
        </div>

        {/* Swatch Panel - desktop: bottom center; mobile: bottom sheet */}
        <div
          className={`
            absolute left-0 right-0 bottom-0 z-20
            px-4 pb-6 pt-4 sm:px-8 sm:pb-8
            transition-all duration-700 ease-out
            ${
              isInView
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0 pointer-events-none"
            }
          `}
        >
          <div className="max-w-4xl mx-auto">
            {/* Desktop: 3 groups + selections side by side */}
            <div className="hidden md:flex items-end justify-between gap-8 bg-bg-surface/70 backdrop-blur-md border border-border-default rounded-xl p-6">
              <ColorSwatchGroup
                label="Chain"
                colors={STRAP_COLORS}
                selected={customization.chain}
                onSelect={(c) => handleSelect("chain", c)}
              />
              <ColorSwatchGroup
                label="Bezel"
                colors={BEZEL_COLORS}
                selected={customization.bezel}
                onSelect={(c) => handleSelect("bezel", c)}
              />
              <ColorSwatchGroup
                label="Case"
                colors={CASE_COLORS}
                selected={customization.case}
                onSelect={(c) => handleSelect("case", c)}
              />
              <SelectionsPanel />
            </div>

            {/* Mobile: stacked groups + smaller selections panel */}
            <div className="md:hidden flex flex-col gap-4 bg-bg-surface/70 backdrop-blur-md border border-border-default rounded-2xl p-5">
              <ColorSwatchGroup
                label="Chain"
                colors={STRAP_COLORS}
                selected={customization.chain}
                onSelect={(c) => handleSelect("chain", c)}
              />
              <ColorSwatchGroup
                label="Bezel"
                colors={BEZEL_COLORS}
                selected={customization.bezel}
                onSelect={(c) => handleSelect("bezel", c)}
              />
              <ColorSwatchGroup
                label="Case"
                colors={CASE_COLORS}
                selected={customization.case}
                onSelect={(c) => handleSelect("case", c)}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
