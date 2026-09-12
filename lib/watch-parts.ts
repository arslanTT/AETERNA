export interface WatchPartInfo {
  id: string;
  name: string;
  material: string;
  description: string;
  specs: {
    label: string;
    value: string;
  }[];
  explosionOffset: [number, number, number];
}

export const WATCH_PARTS: Record<string, WatchPartInfo> = {
  FinalStrap1: {
    id: "FinalStrap1",
    name: "Upper Bracelet",
    material: "316L Stainless Steel",
    description:
      "Precision-machined link bracelet with a brushed finish and polished beveled edges. Each link is hand-finished for a seamless drape.",
    specs: [
      { label: "Links", value: "22 precision links" },
      { label: "Finish", value: "Brushed & Polished" },
      { label: "Clasp", value: "Butterfly deployant" },
    ],
    explosionOffset: [0, -1.5, -1.5],
  },
  FinalStrap2: {
    id: "FinalStrap2",
    name: "Lower Bracelet",
    material: "316L Stainless Steel",
    description:
      "The lower half of the integrated bracelet, contoured to follow the wrist naturally. Features micro-adjustment for a perfect fit.",
    specs: [
      { label: "Links", value: "22 precision links" },
      { label: "Finish", value: "Brushed & Polished" },
      { label: "Adjustment", value: "5 micro-positions" },
    ],
    explosionOffset: [0, -1.5, 1.5],
  },
  strapClip: {
    id: "strapClip",
    name: "Deployant Clasp",
    material: "Stainless Steel",
    description:
      "Butterfly deployant clasp with double push-button release. Engraved with the AETERNA emblem on the fold-over blade.",
    specs: [
      { label: "Type", value: "Butterfly deployant" },
      { label: "Release", value: "Double push-button" },
      { label: "Engraving", value: "AETERNA emblem" },
    ],
    explosionOffset: [0, -2.5, 0],
  },
  Watch: {
    id: "Watch",
    name: "Case & Midcase",
    material: "Surgical-Grade Stainless Steel",
    description:
      "The central case, machined from a single block of steel. Houses the movement with a screw-down construction for water resistance.",
    specs: [
      { label: "Diameter", value: "40mm" },
      { label: "Thickness", value: "11.2mm" },
      { label: "Water Resistance", value: "100m / 10 ATM" },
    ],
    explosionOffset: [0, 1.5, 0],
  },
  Men: {
    id: "Men",
    name: "Dial & Hands",
    material: "Lacquered Brass / Rhodium",
    description:
      "Multi-layer lacquered dial with applied hour markers. Hands are rhodium-plated with a thermally blued seconds hand.",
    specs: [
      { label: "Lacquer", value: "8-layer application" },
      { label: "Hands", value: "Rhodium + Blued Steel" },
      { label: "Markers", value: "Applied indices" },
    ],
    explosionOffset: [0, 0, 1],
  },
  watchGlass: {
    id: "watchGlass",
    name: "Sapphire Crystal",
    material: "Synthetic Sapphire",
    description:
      "Domed sapphire crystal with anti-reflective coating on both faces. Scratch-resistant to Mohs 9, second only to diamond.",
    specs: [
      { label: "Hardness", value: "Mohs 9" },
      { label: "Coating", value: "Dual AR coating" },
      { label: "Shape", value: "Domed" },
    ],
    explosionOffset: [0, 2.5, 0],
  },
  watchBottom: {
    id: "watchBottom",
    name: "Case Back",
    material: "Stainless Steel",
    description:
      "Screw-down case back with engraved specifications and AETERNA crest. Sealed with a custom gasket for water resistance.",
    specs: [
      { label: "Type", value: "Screw-down" },
      { label: "Seal", value: "Custom gasket" },
      { label: "Engraving", value: "AETERNA crest" },
    ],
    explosionOffset: [0, -1, 0],
  },
  WatchshellTop: {
    id: "WatchshellTop",
    name: "Bezel",
    material: "Polished Stainless Steel",
    description:
      "Fixed polished bezel framing the sapphire crystal. Hand-polished to a mirror finish over multiple stages.",
    specs: [
      { label: "Type", value: "Fixed" },
      { label: "Finish", value: "Mirror polish" },
      { label: "Profile", value: "Sloped" },
    ],
    explosionOffset: [0, 0.5, 0],
  },
};

export const PART_NAMES = Object.keys(WATCH_PARTS);

export function getExplosionOffsets(): Record<
  string,
  [number, number, number]
> {
  const offsets: Record<string, [number, number, number]> = {};
  Object.values(WATCH_PARTS).forEach((part) => {
    offsets[part.id] = part.explosionOffset;
  });
  return offsets;
}
