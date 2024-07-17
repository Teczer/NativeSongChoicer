import { Dimensions, Image, Text, TouchableOpacity } from "react-native";

import { textShadow } from "@/lib/styles";

interface Props {
  handleVote: () => void;
  song: Song;
}

export default function VoteButton({ handleVote, song }: Props) {
  return (
    <TouchableOpacity
      className="flex justify-center items-center"
      onPress={handleVote}
      style={{ gap: 10 }}
    >
      <Image
        source={{
          uri: song?.image.url,
        }}
        style={{
          width: Dimensions.get("window").width / 1.3,
          height: Dimensions.get("window").height / 4,
          resizeMode: "cover",
          borderRadius: 6,
          borderWidth: 1,
          borderColor: "rgba(0, 0, 0, 0.1)",
        }}
      />
      <Text
        numberOfLines={1}
        style={{
          ...textShadow,
          width: Dimensions.get("window").width - 10,
          fontFamily: "Geist Mono Bold",
        }}
        className="text-white text-2xl text-center"
      >
        {song?.title}
      </Text>
    </TouchableOpacity>
  );
}
