"use client";

import { useEffect, useState } from "react";
import { useLoadingStore } from "@/lib/loading-store";
import { cn } from "@/lib/utils";

export default function LoadingScreen() {
  const progress = useLoadingStore((s) => s.progress);
  const isReady = useLoadingStore((s) => s.isReady);
  const hasEntered = useLoadingStore((s) => s.hasEntered);
  const setEntered = useLoadingStore((s) => s.setEntered);

  // Delay before actually fading out, so the bar visibly hits 100%
  const [canExit, setCanExit] = useState(false);
  // In LoadingScreen, add a "minimum elapsed time" gate
  const [minTimePassed, setMinTimePassed] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMinTimePassed(true), 800);
    return () => clearTimeout(t);
  }, []);

  // Then change the effect that sets canExit:
  useEffect(() => {
    if (!isReady || !minTimePassed) return;
    const t = setTimeout(() => setCanExit(true), 500);
    return () => clearTimeout(t);
  }, [isReady, minTimePassed]);
  useEffect(() => {
    if (!isReady) return;
    // Small delay so the user sees the bar at 100% before it fades
    const t = setTimeout(() => setCanExit(true), 500);
    return () => clearTimeout(t);
  }, [isReady]);

  // After fade transition completes, mark as entered
  useEffect(() => {
    if (!canExit) return;
    const t = setTimeout(() => setEntered(), 900); // matches transition duration
    return () => clearTimeout(t);
  }, [canExit, setEntered]);

  // Don't render after fully entered
  if (hasEntered) return null;

  const displayPercent = Math.round(progress * 100);

  return (
    <div
      className={cn(
        "fixed inset-0 z-100 bg-bg-base",
        "flex flex-col items-center justify-center gap-8",
        "transition-opacity duration-700 ease-out",
        canExit ? "opacity-0 pointer-events-none" : "opacity-100",
      )}
      aria-hidden={canExit}
    >
      {/* Wordmark */}
      <h1
        className="font-display text-3xl sm:text-4xl md:text-5xl text-text-primary tracking-[0.3em] pl-[0.3em] select-none"
        style={{
          textShadow: "0 0 40px rgba(201, 168, 76, 0.2)",
        }}
      >
        AETERNA
      </h1>

      {/* Progress bar */}
      <div className="w-56 sm:w-64 h-px bg-border-default relative overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-accent-primary"
          style={{
            width: `${displayPercent}%`,
            transition: "width 300ms ease-out",
            boxShadow: "0 0 12px rgba(201, 168, 76, 0.8)",
          }}
        />
      </div>

      {/* Percentage */}
      <div className="font-sans text-xs uppercase tracking-[0.3em] text-text-muted tabular-nums">
        {displayPercent}%
      </div>
    </div>
  );
}
