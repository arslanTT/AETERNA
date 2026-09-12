import { create } from "zustand";

interface CartState {
  itemCount: number;
  isAnimating: boolean;
  isAdded: boolean;
  addToCart: () => void;
  finishAnimation: () => void;
  resetCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  itemCount: 0,
  isAnimating: false,
  isAdded: false,
  addToCart: () => set({ itemCount: 1, isAnimating: true, isAdded: true }),
  finishAnimation: () => set({ isAnimating: false }),
  resetCart: () => set({ itemCount: 0, isAnimating: false, isAdded: false }),
}));
