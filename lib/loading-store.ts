import { create } from "zustand";

interface LoadingState {
  progress: number; // 0 to 1
  isReady: boolean; // model has finished loading
  hasEntered: boolean; // loading screen has faded out
  setProgress: (value: number) => void;
  setReady: () => void;
  setEntered: () => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  progress: 0,
  isReady: false,
  hasEntered: false,
  setProgress: (value) => set({ progress: Math.min(Math.max(value, 0), 1) }),
  setReady: () => set({ isReady: true, progress: 1 }),
  setEntered: () => set({ hasEntered: true }),
}));
