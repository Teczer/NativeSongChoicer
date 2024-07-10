import { StackNavigationProp } from "@react-navigation/stack";
import {
  Image,
  StatusBar,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";

interface Props {
  albumCover: string;
  error?: boolean;
  navigation?: StackNavigationProp<RootStackParamList, "Home">;
}

export default function VersusScreenSkeleton({
  albumCover,
  error,
  navigation,
}: Props) {
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
      {!error && <ActivityIndicator size="large" color="white" />}
      {error && (
        <View
          className="flex flex-1 w-full items-center justify-center"
          style={{ gap: 20 }}
        >
          <Text className="text-red-600 font-bold text-2xl">
            An error occured
          </Text>
          <TouchableOpacity
            className="flex justify-center items-center px-3 py-1"
            style={{
              borderWidth: 1,
              borderColor: "white",
              borderRadius: 6,
            }}
            onPress={() => navigation?.navigate("Home")}
          >
            <Text className="text-white font-bold text-lg">Back to home</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
