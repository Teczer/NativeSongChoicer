import { useColorScheme } from "nativewind";
import { Pressable, Text } from "react-native";

import { MaterialIcons } from "@expo/vector-icons";

export default function ToggleTheme() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <Pressable
      className="items-center justify-center"
      onPress={toggleColorScheme}
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
