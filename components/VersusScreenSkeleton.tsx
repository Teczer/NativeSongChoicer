import { Image, StatusBar, View, ActivityIndicator } from "react-native";

export default function VersusScreenSkeleton({
  albumCover,
}: {
  albumCover: string;
}) {
  return (
    <View
      className="flex flex-1 w-full flex-col items-center justify-center"
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
        blurRadius={25}
        source={{
          uri: albumCover,
        }}
      />
      <ActivityIndicator size="large" color="white" />
    </View>
  );
}
