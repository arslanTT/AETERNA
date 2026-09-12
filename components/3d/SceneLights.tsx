"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

interface SceneLightsProps {
  /**
   * If true, the spotlight fades in over time (used in Hero scene).
   * If false (default), the spotlight is at full intensity immediately.
   */
  animateSpotlight?: boolean;
}

export default function SceneLights({
  animateSpotlight = false,
}: SceneLightsProps) {
  const spotlightRef = useRef<THREE.SpotLight>(null);

  useEffect(() => {
    const light = spotlightRef.current;
    if (!light) return;

    if (!animateSpotlight) {
      light.intensity = 4;
      return;
    }

    const spotlightTimeline = gsap.timeline();
    spotlightTimeline.to(
      light,
      { intensity: 3, duration: 1, ease: "power2.inOut" },
      0.5,
    );
    spotlightTimeline.to(
      light,
      { intensity: 4, duration: 1, ease: "power1.inOut" },
      3.0,
    );

    return () => {
      spotlightTimeline.kill();
    };
  }, [animateSpotlight]);

  return (
    <>
      <ambientLight intensity={1.0} />

      {/* Main spotlight from above */}
      <spotLight
        ref={spotlightRef}
        position={[5, 10, 5]}
        angle={0.6}
        penumbra={0.7}
        intensity={animateSpotlight ? 0 : 4}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Key light — front-left */}
      <directionalLight position={[-5, 5, 5]} intensity={2.5} color="#ffffff" />

      {/* Fill light — front-right */}
      <directionalLight position={[5, 3, 5]} intensity={2} color="#ffffff" />

      {/* Rim light — back-top */}
      <directionalLight position={[0, 6, -6]} intensity={2.5} color="#ffffff" />

      {/* Back-left rim (warm) */}
      <directionalLight
        position={[-6, 2, -4]}
        intensity={1.5}
        color="#e8c872"
      />

      {/* Bottom fill */}
      <directionalLight position={[0, -5, 2]} intensity={0.8} color="#ffffff" />
    </>
  );
}
