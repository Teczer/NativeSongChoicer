import { create } from "zustand";

interface BackgroundImage {
  image: string;
  setImage: (image: string) => void;
}

export const useBackgroundImage = create<BackgroundImage>()((set) => ({
  image:
    "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/c0/14/53/c01453c4-8552-06ce-5dd8-adb06dc3ee3d/196871697422.jpg/1200x1200bf-60.jpg",
  setImage: (image) => set({ image: image }),
}));
