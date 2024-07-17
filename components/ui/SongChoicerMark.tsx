import { Text, View } from "react-native";

export default function SongChoicerMark() {
  return (
    <View className="w-full flex justify-center items-center mt-4">
      <Text
        className="w-2/3 text-white text-center font-mono text-sm mb-2 px-4 py-1"
        style={{
          borderRadius: 8,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          letterSpacing: 2,
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.1)",
        }}
      >
        songchoicer.com
      </Text>
    </View>
  );
}
