import { useMMKVNumber, useMMKVString } from "react-native-mmkv";
import { useColorScheme } from "nativewind";

import appJson from "../app.json";

import { Image, StatusBar, Text, View } from "react-native";
import Slider from "@react-native-community/slider";
import CustomSafeArea from "../components/CustomSafeArea";
import ToggleTheme from "../components/ToggleTheme";

export default function SettingsScreen() {
  const [backgroundImage] = useMMKVString("background-image");
  const [blurIntensity, setBlurIntensity] = useMMKVNumber("blur-intensity");
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

  const fallBackImage =
    colorScheme === "light"
      ? "https://img.freepik.com/free-vector/winter-blue-pink-gradient-background-vector_53876-117275.jpg"
      : "https://cdns-images.dzcdn.net/images/cover/c1739b10fb9608e7fb6830162d90c8b4/1900x1900-000000-80-0-0.jpg";

  // Get the app version from the app.json file
  const {
    expo: { version },
  } = appJson;

  return (
    <CustomSafeArea className="flex flex-col flex-1 items-center justify-start pt-10">
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <Image
        className="absolute inset-0 top-0 left-0 w-full h-full scale-125 rounded-sm"
        blurRadius={blurIntensity || 25}
        source={{ uri: backgroundImage || fallBackImage }}
      />
      <Text className="text-dark dark:text-white font-mono_bold text-2xl mb-10">
        Settings
      </Text>
      <View
        className="flex w-full items-center justify-center mb-10"
        style={{ gap: 2 }}
      >
        <Text
          style={{ fontFamily: "Geist Bold" }}
          className="w-5/6 text-lg text-start text-dark dark:text-neutral-200 mb-4"
        >
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
        className="flex w-full items-center justify-center mb-10"
        style={{ gap: 2 }}
      >
        <Text
          style={{ fontFamily: "Geist Bold" }}
          className="w-5/6 text-lg text-start text-dark dark:text-neutral-200 mb-4"
        >
          Blur Intensity
        </Text>
        <Slider
          style={{ width: 350 }}
          value={blurIntensity}
          onValueChange={(blurValue) => setBlurIntensity(blurValue)}
          minimumValue={0}
          maximumValue={30}
          thumbTintColor={colorScheme === "dark" ? "#FFFFFF" : "#000000"}
          minimumTrackTintColor={colorScheme === "dark" ? "#FFFFFF" : "#000000"}
          maximumTrackTintColor={
            colorScheme === "dark" ? "rgba(255,255,255,0.7)" : "#FFFFFF"
          }
        />
      </View>
      <View
        className="flex w-full items-center justify-center"
        style={{ gap: 2 }}
      >
        <Text
          style={{ fontFamily: "Geist Bold" }}
          className="w-5/6 text-lg text-start text-dark dark:text-neutral-200 mb-4"
        >
          Version
        </Text>

        <View
          style={{ ...(colorScheme === "light" ? shadowBox : {}) }}
          className="flex flex-row w-5/6 h-14 px-6 items-center justify-between bg-white dark:bg-neutral-900 rounded-xl"
        >
          <Text className="text-dark font-mono dark:text-white">
            beta v{version}
          </Text>
          <Text className="text-dark font-mono_bold dark:text-white">
            @2024 by Teczer
          </Text>
        </View>
      </View>
    </CustomSafeArea>
  );
}
