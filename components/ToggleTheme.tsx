import { useColorScheme } from "nativewind";
import { Pressable, Text } from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { setItem } from "../utils/AsyncStorage";

export default function ToggleTheme() {
  const { colorScheme, setColorScheme } = useColorScheme();

  return (
    <Pressable
      className="items-center justify-center"
      onPress={async () => {
        setColorScheme(colorScheme === "dark" ? "light" : "dark");
        await setItem("app-theme", colorScheme === "dark" ? "light" : "dark");
      }}
    >
      <Text className="text-2xl text-black dark:text-white">
        {colorScheme}
        {colorScheme === "dark" ? (
          <MaterialIcons name="dark-mode" size={24} color="white" />
        ) : (
          <MaterialIcons name="light-mode" size={24} color="black" />
        )}
      </Text>
    </Pressable>
  );
}
