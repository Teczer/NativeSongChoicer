import Navigation from "./Navigation";
import * as Splashscreen from "expo-splash-screen";
import { QueryClient, QueryClientProvider } from "react-query";
import { useEffect } from "react";
import { getItem } from "./utils/AsyncStorage";
import { useColorScheme } from "nativewind";

const queryClient = new QueryClient();

Splashscreen.preventAutoHideAsync();

export default function App() {
  const { setColorScheme } = useColorScheme();

  function updateColorScheme(theme: "light" | "dark" | "system") {
    setColorScheme(theme);
  }

  const fetchUserColorScheme = async () => {
    try {
      const userThemeData = await getItem("app-theme");

      if (userThemeData) {
        updateColorScheme(userThemeData);
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
