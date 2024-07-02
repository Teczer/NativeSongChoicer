import { Image, Text, View } from "react-native";
import ToggleTheme from "../components/ToggleTheme";
import CustomSafeArea from "../components/CustomSafeArea";

export default function HomeScreen() {
  return (
    <CustomSafeArea className="flex flex-col flex-1 items-center justify-start gap-4 bg-slate-400 dark:bg-neutral-900">
      <View className="w-full h-auto px-4 flex flex-row items-center justify-between border border-red-500">
        <Image
          className="w-10 h-10"
          width={40}
          height={40}
          source={require("../assets/song-choicer.png")}
        />
        <ToggleTheme />
      </View>
      <Text className="text-4xl font-bold text-center dark:text-white">
        Welcome to Song Choicer!
      </Text>
      <Text className="w-4/5 text-lg text-center dark:text-white">
        Make a ranking of songs of an album easily and share it !
      </Text>
    </CustomSafeArea>
  );
}
