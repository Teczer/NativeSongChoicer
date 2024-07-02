import { useColorScheme } from "nativewind";
import { Pressable, Text } from "react-native";

export default function ToggleTheme() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <Pressable
      className="items-center justify-center"
      onPress={toggleColorScheme}
    >
      <Text className="text-2xl">{colorScheme === "dark" ? "🌙" : "🌞"}</Text>
    </Pressable>
  );
}
