export interface ColorDefinition {
  key: string;
  label: string;
  hex: string;
  metalness: number;
  roughness: number;
}

// CHAIN - the wristband
export const STRAP_COLORS: ColorDefinition[] = [
  {
    key: "gold",
    label: "Gold",
    hex: "#D4AF37",
    metalness: 1.0,
    roughness: 0.2,
  },
  {
    key: "silver",
    label: "Silver",
    hex: "#E5E4E2",
    metalness: 1.0,
    roughness: 0.12,
  },
  {
    key: "roseGold",
    label: "Rose Gold",
    hex: "#B76E79",
    metalness: 0.9,
    roughness: 0.22,
  },
  {
    key: "black",
    label: "Black",
    hex: "#1A1A1A",
    metalness: 1.0,
    roughness: 0.25,
  },
];

// BEZEL - the ring around the glass
export const BEZEL_COLORS: ColorDefinition[] = [
  {
    key: "gold",
    label: "Gold",
    hex: "#D4AF37",
    metalness: 0.95,
    roughness: 0.15,
  },
  {
    key: "silver",
    label: "Silver",
    hex: "#E5E4E2",
    metalness: 0.95,
    roughness: 0.1,
  },
  {
    key: "roseGold",
    label: "Rose Gold",
    hex: "#B76E79",
    metalness: 0.9,
    roughness: 0.18,
  },
  {
    key: "midnightBlue",
    label: "Midnight Blue",
    hex: "#1E2A4A",
    metalness: 0.7,
    roughness: 0.25,
  },
];

// CASE - the metal body
export const CASE_COLORS: ColorDefinition[] = [
  {
    key: "gold",
    label: "Gold",
    hex: "#D4AF37",
    metalness: 1.0,
    roughness: 0.18,
  },
  {
    key: "silver",
    label: "Silver",
    hex: "#E5E4E2",
    metalness: 1.0,
    roughness: 0.12,
  },
  {
    key: "roseGold",
    label: "Rose Gold",
    hex: "#B76E79",
    metalness: 0.9,
    roughness: 0.2,
  },
  {
    key: "graphite",
    label: "Graphite",
    hex: "#2A2A2E",
    metalness: 0.85,
    roughness: 0.3,
  },
];

export function getColorDefinition(
  colors: ColorDefinition[],
  key: string,
): ColorDefinition {
  return colors.find((c) => c.key === key) ?? colors[0];
}
