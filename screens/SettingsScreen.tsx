import { Image, StatusBar, Text, View } from "react-native";

import ToggleTheme from "../components/ToggleTheme";
import CustomSafeArea from "../components/CustomSafeArea";

import { useColorScheme } from "nativewind";
import { useBackgroundImage } from "../store/useBackgroundImage";
import Slider from "@react-native-community/slider";
import { useCustomBlurIntensity } from "../store/useCustomBlurPreference";
import { setItem } from "../lib/AsyncStorage";

export default function SettingsScreen() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const { image } = useBackgroundImage();
  const { blurIntensity, setBlurIntensity } = useCustomBlurIntensity();

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
      : "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/f0/39/e8/f039e88b-ed90-c43d-f4d2-1248850c8ebf/196589980014.jpg/1200x1200bb.jpg";

  return (
    <CustomSafeArea className="flex flex-col flex-1 items-center justify-start pt-10">
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <Image
        className="absolute inset-0 top-0 left-0 w-full h-full scale-125 rounded-sm"
        blurRadius={blurIntensity}
        source={{ uri: image || fallBackImage }}
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
          onValueChange={(blurValue) => {
            setBlurIntensity(blurValue);
            setItem("blurIntensity", blurValue);
          }}
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
            beta v1.2.4
          </Text>
          <Text className="text-dark font-mono_bold dark:text-white">
            @2024 by Teczer
          </Text>
        </View>
      </View>
    </CustomSafeArea>
  );
}
