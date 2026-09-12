"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { Check } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import CustomizableWatch from "@/components/3d/CustomizableWatch";
import ShoppingBag, {
  type ShoppingBagHandle,
} from "@/components/3d/ShoppingBag";
import FlyingWatch from "@/components/3d/FlyingWatch";
import NavbarBagIcon from "@/components/ui/NavbarBagIcon";

import SceneLights from "@/components/3d/SceneLights";
import SceneBackdrop from "@/components/3d/SceneBackdrop";

import { playWhoosh, playClick } from "@/lib/sounds";

function OwnSceneScene({
  isInView,
  onWatchFlightComplete,
}: {
  isInView: boolean;
  onWatchFlightComplete: () => void;
}) {
  const bagRef = useRef<ShoppingBagHandle>(null);
  const isAnimating = useCartStore((s) => s.isAnimating);
  const isAdded = useCartStore((s) => s.isAdded);

  useEffect(() => {
    if (isAnimating && isInView) {
      playWhoosh();
    }
  }, [isAnimating, isInView]);

  const handleFlightComplete = useCallback(() => {
    playClick();
    bagRef.current?.playBounce();
    onWatchFlightComplete();
  }, [onWatchFlightComplete]);

  // Main watch is visible only before the cart is used:
  // - During the flight, it's replaced by FlyingWatch
  // - After the cart is filled, only the bag remains
  const showMainWatch = !isAnimating && !isAdded;

  return (
    <group position={[0, 0.6, 0]}>
      {showMainWatch && <CustomizableWatch />}

      <FlyingWatch
        start={isAnimating}
        onComplete={handleFlightComplete}
        startPosition={[0, 0, 0]}
        endPosition={[0, -0.6, 0.5]}
      />

      <ShoppingBag ref={bagRef} visible={isAdded} />
    </group>
  );
}

export default function OwnScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  const isAdded = useCartStore((s) => s.isAdded);
  const addToCart = useCartStore((s) => s.addToCart);
  const resetCart = useCartStore((s) => s.resetCart);

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

  useEffect(() => {
    if (!isInView && isAdded) {
      resetCart();
    }
  }, [isInView, isAdded, resetCart]);

  const handleAddToCart = useCallback(() => {
    if (isAdded) return;
    addToCart();
  }, [isAdded, addToCart]);

  const handleFlightComplete = useCallback(() => {
    useCartStore.getState().finishAnimation();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full"
      style={{ height: "200vh" }}
    >
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full bg-bg-base overflow-hidden"
      >
        <SceneBackdrop />
        <Canvas
          camera={{ position: [0, 1.2, 5.5], fov: 45, near: 0.1, far: 100 }}
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
          <pointLight
            position={[0, -0.5, 2]}
            intensity={2}
            distance={6}
            color="#c9a84c"
          />

          <OwnSceneScene
            isInView={isInView}
            onWatchFlightComplete={handleFlightComplete}
          />
        </Canvas>

        <div
          className={`
            absolute inset-x-0 bottom-0 z-20
            pb-16 pt-8 px-4
            flex flex-col items-center
            pointer-events-none
            transition-opacity duration-700 ease-out
            ${isInView ? "opacity-100" : "opacity-0"}
          `}
          style={{
            background:
              "linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0) 100%)",
          }}
        >
          <h2
            className="font-display text-3xl sm:text-4xl md:text-5xl text-text-primary tracking-[0.15em] text-center"
            style={{
              textShadow: "0 0 40px rgba(201, 168, 76, 0.3)",
            }}
          >
            Own the Craftsmanship
          </h2>

          <p
            className="mt-4 font-display text-2xl sm:text-3xl text-accent-primary"
            style={{
              textShadow: "0 0 30px rgba(201, 168, 76, 0.4)",
            }}
          >
            €2,450
          </p>

          <div className="mt-6 pointer-events-auto">
            {!isAdded ? (
              <button
                onClick={handleAddToCart}
                className="
                  px-10 py-4 rounded-lg
                  font-sans text-sm uppercase tracking-[0.15em]
                  bg-accent-primary text-bg-base
                  border border-accent-primary
                  transition-all duration-300
                  hover:bg-accent-primary/90 hover:scale-105
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base
                "
              >
                Add to Cart
              </button>
            ) : (
              <div
                className="
                  px-8 py-4 rounded-lg
                  flex items-center gap-3
                  bg-bg-surface/90 backdrop-blur-md
                  border border-accent-primary/40
                  animate-[fadeInUp_0.5s_ease-out]
                "
              >
                <Check className="h-5 w-5 text-accent-primary" />
                <span className="font-sans text-sm uppercase tracking-[0.15em] text-text-primary">
                  Added to Cart
                </span>
              </div>
            )}
          </div>
        </div>

        <NavbarBagIcon />
      </div>
    </section>
  );
}
