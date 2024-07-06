import { Dimensions } from "react-native";

import { BlurView } from "@react-native-community/blur";
import { useCustomBlurPreference } from "../store/useCustomBlurPreference";

export default function CustomBlurView({ currentStatusBarHeight }: any) {
  const { blur } = useCustomBlurPreference();

  return (
    <BlurView
      style={{
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height + currentStatusBarHeight,
        position: "absolute",
        alignSelf: "center",
      }}
      blurType={blur || "light"}
      blurAmount={20}
    />
  );
}
