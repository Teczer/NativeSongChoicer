import "expo-dev-client";

import { useFonts } from "expo-font";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { useColorScheme } from "nativewind";

import * as Splashscreen from "expo-splash-screen";

import Navigation from "./Navigation";
import { getItem } from "./lib/AsyncStorage";
import { useBackgroundImage } from "./store/useBackgroundImage";
import { useCustomBlurIntensity } from "./store/useCustomBlurPreference";
const queryClient = new QueryClient();

Splashscreen.preventAutoHideAsync();

export default function App() {
  const { setColorScheme } = useColorScheme();
  const { setImage } = useBackgroundImage();
  const { setBlurIntensity } = useCustomBlurIntensity();
  const [loaded, error] = useFonts({
    "Geist Mono Light": require("./assets/fonts/GeistMono-Light.ttf"),
    "Geist Mono Bold": require("./assets/fonts/GeistMono-Bold.ttf"),
    "Geist Mono Regular": require("./assets/fonts/GeistMono-Regular.ttf"),
    "Geist Mono Medium": require("./assets/fonts/GeistMono-Medium.ttf"),
    "Geist Light": require("./assets/fonts/Geist-Light.ttf"),
    "Geist Bold": require("./assets/fonts/Geist-Bold.ttf"),
    "Geist Regular": require("./assets/fonts/Geist-Regular.ttf"),
    "Geist Medium": require("./assets/fonts/Geist-Medium.ttf"),
  });

  const fetchUserColorScheme = async () => {
    try {
      const userThemeData = await getItem("app-theme");
      if (userThemeData) {
        setColorScheme(userThemeData);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setTimeout(async () => {
        await Splashscreen.hideAsync();
      }, 1000);
    }
  };

  const fetchUserStoredImage = async () => {
    try {
      const imageData = await getItem("bg-image");
      if (imageData) {
        setImage(imageData);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setTimeout(async () => {
        await Splashscreen.hideAsync();
      }, 1000);
    }
  };

  const fetchUserBlurIntensity = async () => {
    try {
      const blurIntensityData = await getItem("blurIntensity");
      if (blurIntensityData) {
        setBlurIntensity(blurIntensityData);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setTimeout(async () => {
        await Splashscreen.hideAsync();
      }, 1000);
    }
  };

  useEffect(() => {
    fetchUserStoredImage();
    fetchUserColorScheme();
    fetchUserBlurIntensity();
  }, []);

  useEffect(() => {
    if (loaded || error) {
      Splashscreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Navigation />
    </QueryClientProvider>
  );
}
