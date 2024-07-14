import { Pressable, Text, View } from "react-native";

import { MaterialIcons } from "@expo/vector-icons";

import { capitalizeFirstLetter } from "../lib/utils";
import { storage } from "../lib/mmkv";

import { ColorSchemeSystem } from "nativewind/dist/style-sheet/color-scheme";

interface Props {
  theme: "light" | "dark";
  colorScheme: ColorSchemeSystem;
  setColorScheme: (colorSchemeSystem: ColorSchemeSystem) => void;
}

export default function ToggleTheme({
  theme,
  colorScheme,
  setColorScheme,
}: Props) {
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
    <Pressable
      className="flex flex-row w-5/6 h-14 px-8 items-center justify-between bg-white dark:bg-neutral-900"
      style={{
        gap: 10,
        ...(colorScheme === "light" ? shadowBox : {}),

        ...(theme === "light"
          ? { borderTopLeftRadius: 20, borderTopRightRadius: 20 }
          : { borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }),
      }}
      onPress={async () => {
        setColorScheme(theme as "light" | "dark" | "system");
        storage.set("app-theme", theme);
      }}
    >
      <View
        className="flex flex-row items-center justify-center"
        style={{ gap: 15 }}
      >
        <MaterialIcons
          name={theme === "dark" ? "dark-mode" : "light-mode"}
          size={20}
          color={colorScheme === "dark" ? "white" : "black"}
        />
        <Text className="text-xl italic text-black dark:text-white">
          {capitalizeFirstLetter(theme)}
        </Text>
      </View>
      <View
        style={{
          height: 24,
          width: 24,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: colorScheme === "light" ? "black" : "white",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {colorScheme === theme && (
          <View
            style={{
              height: 10,
              width: 10,
              borderRadius: 6,
              backgroundColor: colorScheme === "light" ? "black" : "white",
            }}
          />
        )}
      </View>
    </Pressable>
  );
}
