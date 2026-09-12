"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

interface SceneDef {
  id: string;
  label: string;
  number: string;
}

const SCENES: SceneDef[] = [
  { id: "scene-hero", label: "The Reveal", number: "01" },
  { id: "scene-explore", label: "Explore", number: "02" },
  { id: "scene-movement", label: "The Movement", number: "03" },
  { id: "scene-customize", label: "Customize", number: "04" },
  { id: "scene-own", label: "Own", number: "05" },
];
export default function SceneNav() {
  const [activeId, setActiveId] = useState<string>(SCENES[0].id);
  const [isVisible, setIsVisible] = useState(false);
  const tickingRef = useRef(false);

  // Detect which scene contains the viewport center
  useEffect(() => {
    const updateActive = () => {
      const viewportCenter = window.innerHeight / 2;

      let currentId = SCENES[0].id;
      // Iterate scenes and pick the last one whose top is above the center
      for (const scene of SCENES) {
        const el = document.getElementById(scene.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        // If the viewport center is within [rect.top, rect.bottom]
        if (rect.top <= viewportCenter && rect.bottom > viewportCenter) {
          currentId = scene.id;
          break;
        }
        // Fallback: if scene top has passed viewport center but bottom hasn't yet,
        // treat it as active (handles edge cases when scrolling fast)
        if (rect.top > viewportCenter) {
          // The first scene whose top is below the center: previous scene is active
          break;
        }
        currentId = scene.id;
      }

      setActiveId(currentId);
    };

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        updateActive();
        tickingRef.current = false;
      });
    };

    updateActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Fade in after a delay
  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const handleClick = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <nav
      aria-label="Scene navigation"
      className={cn(
        "fixed right-6 top-1/2 -translate-y-1/2 z-40",
        "hidden md:flex flex-col items-end gap-5",
        "transition-opacity duration-700 ease-out",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
    >
      {SCENES.map((scene) => {
        const isActive = activeId === scene.id;
        return (
          <button
            key={scene.id}
            onClick={() => handleClick(scene.id)}
            aria-label={`Go to ${scene.label}`}
            aria-current={isActive ? "step" : undefined}
            className={cn(
              "group flex items-center gap-3",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base rounded-md",
            )}
          >
            <span
              className={cn(
                "font-sans text-xs uppercase tracking-[0.2em]",
                "whitespace-nowrap transition-all duration-300",
                isActive
                  ? "text-accent-primary opacity-100 translate-x-0"
                  : "text-text-muted opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0",
              )}
            >
              {scene.number} · {scene.label}
            </span>

            <span
              className={cn(
                "block rounded-full transition-all duration-300 ease-out",
                isActive
                  ? "w-2.5 h-2.5 bg-accent-primary shadow-[0_0_12px_rgba(201,168,76,0.6)]"
                  : "w-1.5 h-1.5 bg-border-default group-hover:bg-text-muted group-hover:scale-125",
              )}
            />
          </button>
        );
      })}
    </nav>
  );
}
