import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text } from "react-native";

export default function SettingsScreen({ navigation }: NavigationProps) {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white dark:bg-neutral-800">
      <Button title="Homepage" onPress={() => navigation.navigate("Home")} />
      <Text className="text-black dark:text-white font-bold text-4xl">
        SettingsScreen
      </Text>
    </SafeAreaView>
  );
}
