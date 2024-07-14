import "expo-dev-client";

import { useEffect } from "react";
import { useFonts } from "expo-font";
import { useColorScheme } from "nativewind";

import { QueryClient, QueryClientProvider } from "react-query";
import * as Splashscreen from "expo-splash-screen";

import { storage } from "./lib/mmkv";
import { ColorSchemeSystem } from "nativewind/dist/style-sheet/color-scheme";

import Navigation from "./Navigation";

const queryClient = new QueryClient();

Splashscreen.preventAutoHideAsync();

export default function App() {
  const { setColorScheme } = useColorScheme();
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

  const userThemeData = storage.getString("app-theme");

  useEffect(() => {
    if (!userThemeData) return;
    setColorScheme(userThemeData as ColorSchemeSystem);
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
