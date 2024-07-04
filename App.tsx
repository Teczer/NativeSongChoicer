import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { useColorScheme } from "nativewind";

import * as Splashscreen from "expo-splash-screen";

import { getItem } from "./utils/AsyncStorage";

import Navigation from "./Navigation";

const queryClient = new QueryClient();

Splashscreen.preventAutoHideAsync();

export default function App() {
  const { setColorScheme } = useColorScheme();

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

  useEffect(() => {
    fetchUserColorScheme();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Navigation />
    </QueryClientProvider>
  );
}
