"use client";

import { cn } from "@/lib/utils";
import type { ColorDefinition } from "@/lib/constants";

interface ColorSwatchGroupProps {
  label: string;
  colors: ColorDefinition[];
  selected: string;
  onSelect: (key: string) => void;
}

export default function ColorSwatchGroup({
  label,
  colors,
  selected,
  onSelect,
}: ColorSwatchGroupProps) {
  return (
    <div className="flex flex-col gap-3">
      <span className="font-sans text-xs uppercase tracking-widest text-text-muted">
        {label}
      </span>
      <div className="flex gap-3">
        {colors.map((color) => {
          const isSelected = selected === color.key;
          return (
            <button
              key={color.key}
              onClick={() => onSelect(color.key)}
              aria-label={`${label}: ${color.label}`}
              aria-pressed={isSelected}
              title={color.label}
              className={cn(
                "relative w-8 h-8 rounded-full transition-all duration-300",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base",
                "hover:scale-110",
                isSelected
                  ? "ring-2 ring-accent-primary ring-offset-2 ring-offset-bg-base scale-110"
                  : "ring-1 ring-border-default",
              )}
              style={{
                backgroundColor: color.hex,
                boxShadow: isSelected ? `0 0 20px ${color.hex}66` : undefined,
              }}
            >
              {isSelected && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-bg-base/70" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
