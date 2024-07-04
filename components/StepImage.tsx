import { Image, View } from "react-native";

import { AntDesign } from "@expo/vector-icons";

export default function StepImage({ colorScheme }: { colorScheme: string }) {
  return (
    <View
      className="flex w-full h-full flex-col items-center justify-start"
      style={{
        gap: 10,
      }}
    >
      <Image
        className="w-5/6 h-1/4 border border-red-500"
        source={require("../assets/images/step1-mobile.png")}
        style={{
          resizeMode: "contain",
          borderRadius: 5,
          borderWidth: 1,
          borderColor: colorScheme === "light" ? "#000" : "#cbd5e1",
        }}
      />

      <AntDesign
        name="arrowdown"
        size={50}
        color={colorScheme === "light" ? "black" : "white"}
      />

      <Image
        className="w-5/6 h-1/4 border border-red-500"
        source={require("../assets/images/step2-mobile.png")}
        style={{
          resizeMode: "contain",
          borderRadius: 5,
          borderWidth: 1,
          borderColor: colorScheme === "light" ? "#000" : "#cbd5e1",
        }}
      />
    </View>
  );
}
