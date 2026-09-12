"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { useWatchStore } from "@/store/watch-store";
import { WATCH_PARTS } from "@/lib/watch-parts";

export default function PartDetailsPanel() {
  const selectedPartId = useWatchStore((s) => s.selectedPartId);
  const clearSelection = useWatchStore((s) => s.clearSelection);

  // Close on ESC key
  useEffect(() => {
    if (!selectedPartId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") clearSelection();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedPartId, clearSelection]);

  const part = selectedPartId ? WATCH_PARTS[selectedPartId] : null;

  return (
    <>
      {/* Backdrop for mobile - click to close */}
      <div
        className={`fixed inset-0 z-20 md:hidden transition-opacity duration-500 ${
          part
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={clearSelection}
        aria-hidden="true"
      />

      {/* Panel - desktop: right side, mobile: bottom sheet */}
      <aside
        className={`
          fixed z-30
          md:right-6 md:top-1/2 md:-translate-y-1/2 md:w-80 md:max-h-[80vh]
          right-0 left-0 bottom-0 md:left-auto md:bottom-auto
          md:rounded-xl rounded-t-2xl
          bg-bg-surface/95 backdrop-blur-md
          border border-border-default
          shadow-2xl
          transition-all duration-500 ease-out
          ${
            part
              ? "translate-y-0  opacity-100 md:translate-x-0"
              : "translate-y-full md:translate-y-[-50%] md:translate-x-[120%] opacity-0 pointer-events-none"
          }
        `}
      >
        {/* Drag handle for mobile */}
        <div className="md:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-border-default" />
        </div>

        {part && (
          <div className="p-6 md:p-6 max-h-[70vh] md:max-h-[80vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={clearSelection}
              className="absolute top-4 right-4 md:top-4 md:right-4 p-2 rounded-md text-text-muted hover:text-text-primary hover:bg-bg-base/50 transition-colors"
              aria-label="Close details"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Part name */}
            <h2 className="font-display text-2xl md:text-3xl text-text-primary pr-8">
              {part.name}
            </h2>

            {/* Material */}
            <p className="mt-1 text-xs uppercase tracking-widest text-accent-primary">
              {part.material}
            </p>

            {/* Divider */}
            <div className="my-5 h-px bg-border-default" />

            {/* Description */}
            <p className="text-sm text-text-muted leading-relaxed">
              {part.description}
            </p>

            {/* Specs */}
            <div className="mt-6 space-y-3">
              <h3 className="text-xs uppercase tracking-widest text-text-muted">
                Specifications
              </h3>
              {part.specs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex justify-between items-baseline gap-4 text-sm"
                >
                  <span className="text-text-muted">{spec.label}</span>
                  <span className="text-text-primary text-right">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
