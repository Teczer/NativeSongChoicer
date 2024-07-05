import { create } from "zustand";

interface CustomBlurPreference {
  blur: "light" | "dark";
  setBlur: (blur: "light" | "dark") => void;
}

export const useCustomBlurPreference = create<CustomBlurPreference>()(
  (set) => ({
    blur: "light",
    setBlur: (blur: "light" | "dark") => set({ blur: blur }),
  })
);
