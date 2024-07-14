import { MMKV } from "react-native-mmkv";

export const storage = new MMKV();

// global GET states

export const backgroundImage = storage.getString("background-image") || "";
export const blurIntensity = storage.getNumber("blur-intensity");
