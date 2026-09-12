"use client";

import { useWatchStore } from "@/store/watch-store";
import {
  STRAP_COLORS,
  BEZEL_COLORS,
  CASE_COLORS,
  getColorDefinition,
} from "@/lib/constants";

export default function SelectionsPanel() {
  const customization = useWatchStore((s) => s.customization);

  const chainDef = getColorDefinition(STRAP_COLORS, customization.chain);
  const bezelDef = getColorDefinition(BEZEL_COLORS, customization.bezel);
  const caseDef = getColorDefinition(CASE_COLORS, customization.case);

  const rows = [
    { label: "Chain", def: chainDef },
    { label: "Bezel", def: bezelDef },
    { label: "Case", def: caseDef },
  ];

  return (
    <div className="rounded-lg border border-border-default bg-bg-surface/80 backdrop-blur-md p-4 min-w-[200px]">
      <h3 className="font-sans text-xs uppercase tracking-widest text-text-muted mb-3">
        Your Selection
      </h3>
      <div className="flex flex-col gap-2">
        {rows.map(({ label, def }) => (
          <div
            key={label}
            className="flex items-center justify-between gap-4 text-sm"
          >
            <span className="text-text-muted">{label}</span>
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full border border-border-default"
                style={{ backgroundColor: def.hex }}
              />
              <span className="text-text-primary">{def.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
