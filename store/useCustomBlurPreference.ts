import { create } from "zustand";

interface CustomBlurIntensity {
  blurIntensity: number;
  setBlurIntensity: (blurIntensity: number) => void;
}

export const useCustomBlurIntensity = create<CustomBlurIntensity>()((set) => ({
  blurIntensity: 6,
  setBlurIntensity: (blurIntensity: number) =>
    set({ blurIntensity: blurIntensity }),
}));
