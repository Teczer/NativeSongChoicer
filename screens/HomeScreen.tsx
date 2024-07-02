import { Text } from "react-native";
import CustomSafeArea from "../components/CustomSafeArea";

export default function HomeScreen() {
  return (
    <CustomSafeArea className="flex flex-col flex-1 items-center justify-start gap-4 bg-slate-400 dark:bg-neutral-900">
      <Text className="text-4xl font-bold text-center dark:text-white">
        Welcome to Song Choicer!
      </Text>
      <Text className="w-4/5 text-lg text-center dark:text-white">
        Make a ranking of songs of an album easily and share it !
      </Text>
    </CustomSafeArea>
  );
}
