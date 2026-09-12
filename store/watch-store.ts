import { create } from "zustand";

export interface CustomizationState {
  chain: string;
  bezel: string;
  case: string;
}

interface WatchState {
  // Scene 2 state
  selectedPartId: string | null;
  hoveredPartId: string | null;
  isExplodedMode: boolean;
  setSelectedPart: (id: string | null) => void;
  setHoveredPart: (id: string | null) => void;
  setIsExplodedMode: (value: boolean) => void;
  clearSelection: () => void;

  // Scene 3 state
  customization: CustomizationState;
  setCustomization: (key: keyof CustomizationState, value: string) => void;
  resetCustomization: () => void;
}

const DEFAULT_CUSTOMIZATION: CustomizationState = {
  chain: "black",
  bezel: "silver",
  case: "graphite",
};

export const useWatchStore = create<WatchState>((set) => ({
  // Scene 2
  selectedPartId: null,
  hoveredPartId: null,
  isExplodedMode: false,
  setSelectedPart: (id) => set({ selectedPartId: id }),
  setHoveredPart: (id) => set({ hoveredPartId: id }),
  setIsExplodedMode: (value) => set({ isExplodedMode: value }),
  clearSelection: () => set({ selectedPartId: null, hoveredPartId: null }),

  // Scene 3
  customization: { ...DEFAULT_CUSTOMIZATION },
  setCustomization: (key, value) =>
    set((state) => ({
      customization: { ...state.customization, [key]: value },
    })),
  resetCustomization: () =>
    set({ customization: { ...DEFAULT_CUSTOMIZATION } }),
}));
