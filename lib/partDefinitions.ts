// lib/partDefinitions.ts
import { PartId } from "@/store/exploreStore";

export interface PartDefinition {
  id: PartId;
  name: string;
  material: string;
  description: string;
  specs: {
    weight: string;
    dimensions: string;
    features: string[];
  };
}

export const PART_DEFINITIONS: Record<PartId, PartDefinition> = {
  FinalStrap1: {
    id: "FinalStrap1",
    name: "Upper Chain",
    material: "Stainless Steel",
    description:
      "Premium link bracelet with hand-polished finish and butterfly clasp mechanism.",
    specs: {
      weight: "42g",
      dimensions: "22mm × 85mm",
      features: [
        "Hand-polished links",
        "Scratch-resistant coating",
        "Butterfly clasp",
      ],
    },
  },
  FinalStrap2: {
    id: "FinalStrap2",
    name: "Lower Chain",
    material: "Stainless Steel",
    description:
      "Matching link bracelet ensuring secure and comfortable fit on the wrist.",
    specs: {
      weight: "38g",
      dimensions: "22mm × 75mm",
      features: [
        "Ergonomic design",
        "Quick-release spring bars",
        "Adjustable links",
      ],
    },
  },
  strapClip: {
    id: "strapClip",
    name: "Clasp",
    material: "Stainless Steel",
    description:
      "Double-locking deployment clasp providing security and elegance.",
    specs: {
      weight: "12g",
      dimensions: "18mm × 15mm",
      features: [
        "Double-locking mechanism",
        "Engraved logo",
        "Smooth operation",
      ],
    },
  },
  Watch: {
    id: "Watch",
    name: "Watch Case",
    material: "316L Steel",
    description:
      "Water-resistant case housing the precision movement, crafted from surgical-grade steel.",
    specs: {
      weight: "28g",
      dimensions: "42mm diameter",
      features: [
        "Water-resistant to 100m",
        "Screw-down crown",
        "Anti-magnetic shield",
      ],
    },
  },
  Men: {
    id: "Men",
    name: "Dial & Movement",
    material: "Sapphire",
    description:
      "Hand-finished dial with applied hour markers and precision automatic movement.",
    specs: {
      weight: "15g",
      dimensions: "38mm visible diameter",
      features: [
        "Applied indices",
        "Date complication",
        "28,800 vibrations/hour",
      ],
    },
  },
  watchGlass: {
    id: "watchGlass",
    name: "Crystal",
    material: "Sapphire",
    description:
      "Scratch-resistant sapphire crystal with anti-reflective coating.",
    specs: {
      weight: "5g",
      dimensions: "36mm diameter",
      features: ["Anti-reflective coating", "9H hardness", "Domed profile"],
    },
  },
  watchBottom: {
    id: "watchBottom",
    name: "Case Back",
    material: "Titanium",
    description:
      "Exhibition case back with sapphire window showcasing the movement.",
    specs: {
      weight: "18g",
      dimensions: "40mm diameter",
      features: [
        "Exhibition window",
        "Engraved serial number",
        "Screw-down design",
      ],
    },
  },
  WatchshellTop: {
    id: "WatchshellTop",
    name: "Bezel",
    material: "Ceramic",
    description:
      "Rotating bezel with 60-minute scale, precision-engineered for smooth operation.",
    specs: {
      weight: "8g",
      dimensions: "42mm diameter",
      features: [
        "Unidirectional rotation",
        "60-minute scale",
        "Luminous markers",
      ],
    },
  },
};
