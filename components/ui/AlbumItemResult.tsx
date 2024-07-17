import { ColorSchemeSystem } from "nativewind/dist/style-sheet/color-scheme";

import { Image, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface Props {
  album: Album;
  setBackgroundImage: (uri: string) => void;
  navigateFunction: () => void;
  colorScheme: ColorSchemeSystem;
  formattedReleaseDate: string;
  formattedAlbumType: string;
}

export default function AlbumItemResult({
  album,
  setBackgroundImage,
  navigateFunction,
  colorScheme,
  formattedReleaseDate,
  formattedAlbumType,
}: Props) {
  return (
    <TouchableOpacity
      onPress={navigateFunction}
      className="flex flex-row w-full mb-4"
    >
      <Image
        className="w-2/5 h-40"
        source={{ uri: album?.images[0]?.url }}
        borderRadius={10}
      />
      <View className="w-3/5 flex flex-col justify-center items-start pl-3">
        <TouchableOpacity
          className="absolute top-2 right-0 w-auto"
          onPress={() => setBackgroundImage(album?.images[0]?.url)}
        >
          <MaterialCommunityIcons
            name="image-plus"
            size={28}
            color={colorScheme === "light" ? "black" : "white"}
          />
        </TouchableOpacity>
        <Text
          className="w-full h-auto mb-1 text-start text-dark dark:text-white"
          style={{ fontFamily: "Geist Bold" }}
        >
          {album.name}
        </Text>
        <Text className="w-full font-regular text-dark dark:text-neutral-300 mb-1">
          {formattedReleaseDate} • {formattedAlbumType}
        </Text>
        <Text className="w-full text-dark font-light italic dark:text-neutral-300">
          {album.total_tracks} Titres
        </Text>
      </View>
    </TouchableOpacity>
  );
}
