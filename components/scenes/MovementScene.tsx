"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import SceneLights from "@/components/3d/SceneLights";
import SceneBackdrop from "@/components/3d/SceneBackdrop";
import MechanicalMovement from "@/components/3d/MechanicalMovement";

// Labels for parts — positioned as overlay divs

export default function MovementScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = stickyRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.intersectionRatio > 0.4);
        });
      },
      { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full"
      style={{ height: "150vh" }}
    >
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full bg-bg-base overflow-hidden"
      >
        <SceneBackdrop />

        <div
          className={`
            absolute inset-0
            transition-opacity duration-700 ease-out
            ${isInView ? "opacity-100" : "opacity-0"}
          `}
        >
          <Canvas
            camera={{
              position: [0, 0, 4.2],
              fov: 40,
              near: 0.1,
              far: 100,
            }}
            dpr={[1, 2]}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.5,
            }}
          >
            <SceneLights />

            <pointLight
              position={[0, 0, 2.5]}
              intensity={1.5}
              distance={6}
              color="#e8c872"
            />

            <MechanicalMovement revealProgress={1} />
          </Canvas>
        </div>

        {/* Title */}
        <div
          className={`
            absolute inset-x-0 top-0 pt-16 md:pt-20
            flex flex-col items-center text-center px-4
            pointer-events-none
            transition-opacity duration-700 ease-out
            ${isInView ? "opacity-100" : "opacity-0"}
          `}
        >
          <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.4em] text-accent-primary mb-3">
            The Anatomy
          </span>
          <h2
            className="font-display text-3xl sm:text-4xl md:text-5xl text-text-primary tracking-[0.15em]"
            style={{ textShadow: "0 0 40px rgba(201, 168, 76, 0.25)" }}
          >
            Calibre A-100
          </h2>
          <p className="mt-3 font-sans text-xs sm:text-sm text-text-muted tracking-widest max-w-md">
            Every component, measured to a micron
          </p>
        </div>

        {/* Part labels — thin lines with text, overlaid on the parts */}

        {/* Specs */}
        <div
          className={`
            absolute inset-x-0 bottom-0 pb-14 md:pb-16 px-4
            flex justify-center
            pointer-events-none
            transition-opacity duration-700 ease-out
            ${isInView ? "opacity-100" : "opacity-0"}
          `}
        >
          <div className="grid grid-cols-3 gap-8 md:gap-20 text-center">
            <Spec label="Power Reserve" value="72 Hours" />
            <Spec label="Jewels" value="27" />
            <Spec label="Frequency" value="28,800 vph" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-text-muted">
        {label}
      </span>
      <span
        className="font-display text-lg sm:text-xl md:text-2xl text-accent-primary"
        style={{ textShadow: "0 0 20px rgba(201, 168, 76, 0.35)" }}
      >
        {value}
      </span>
    </div>
  );
}
