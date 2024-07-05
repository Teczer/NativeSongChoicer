import { Text, View } from "react-native";

import ToggleTheme from "../components/ToggleTheme";
import CustomSafeArea from "../components/CustomSafeArea";

import { useColorScheme } from "nativewind";

export default function SettingsScreen() {
  const { colorScheme, setColorScheme } = useColorScheme();

  const shadowBox = {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  };

  return (
    <CustomSafeArea className="flex flex-col flex-1 items-center justify-start bg-white dark:bg-neutral-800 pt-10">
      <Text className="text-black dark:text-white font-bold text-2xl mb-10">
        Settings
      </Text>
      <View
        className="flex w-full items-center justify-center mb-10"
        style={{ gap: 2 }}
      >
        <Text className="w-5/6 text-lg text-start font-bold dark:text-neutral-200 mb-4">
          Theme Settings
        </Text>
        <ToggleTheme
          colorScheme={colorScheme}
          setColorScheme={setColorScheme}
          theme="light"
        />
        <ToggleTheme
          colorScheme={colorScheme}
          setColorScheme={setColorScheme}
          theme="dark"
        />
      </View>

      <View
        className="flex w-full items-center justify-center"
        style={{ gap: 2 }}
      >
        <Text className="w-5/6 text-lg text-start font-bold dark:text-neutral-200 mb-4">
          Version
        </Text>

        <View
          style={{ ...(colorScheme === "light" ? shadowBox : {}) }}
          className="flex flex-row w-5/6 h-14 px-8 items-center justify-between bg-white dark:bg-neutral-900 rounded-xl"
        >
          <Text className="text-dark italic dark:text-white">beta v1.2.4</Text>
          <Text className="text-dark font-bold dark:text-white">
            @2024 by Teczer
          </Text>
        </View>
      </View>
    </CustomSafeArea>
  );
}
