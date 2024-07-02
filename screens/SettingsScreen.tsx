import { Text } from "react-native";

import ToggleTheme from "../components/ToggleTheme";
import CustomSafeArea from "../components/CustomSafeArea";

export default function SettingsScreen() {
  return (
    <CustomSafeArea className="flex flex-col flex-1 items-center justify-center bg-white dark:bg-neutral-900">
      <Text className="text-black dark:text-white font-bold text-4xl mb-10">
        SettingsScreen
      </Text>
      <ToggleTheme />
    </CustomSafeArea>
  );
}
