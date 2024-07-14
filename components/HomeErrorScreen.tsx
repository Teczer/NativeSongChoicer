import { Image, StatusBar, Text } from "react-native";

import CustomSafeArea from "./CustomSafeArea";

interface Props {
  queryError: any;
  backgroundImage: string;
  blurIntensity: number;
}

export default function HomeErrorScreen({
  queryError,
  backgroundImage,
  blurIntensity,
}: Props) {
  return (
    <CustomSafeArea
      className="flex flex-1 w-full flex-col items-center justify-start pt-10"
      style={{
        gap: 10,
      }}
    >
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <Image
        className="absolute inset-0 top-0 left-0 w-full h-full scale-125 rounded-sm"
        blurRadius={blurIntensity}
        source={{ uri: backgroundImage }}
      />
      <Text className="text-white font-bold text-xl mb-6 px-4 py-2 text-center">
        An error occured : {queryError?.toString() || "No error"}
      </Text>
    </CustomSafeArea>
  );
}
