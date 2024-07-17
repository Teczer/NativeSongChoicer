import { formatDate } from "@/lib/utils";

import { Image, Text, TouchableOpacity, View } from "react-native";

interface Props {
  album: UserRankedAlbums;
  selectMode: boolean;
  isSelected: boolean;
  toggleSelectAlbum: (albumId: string) => void;
  navigateFunction: () => void;
}

export default function MiniAlbumCard({
  album,
  navigateFunction,
  selectMode,
  isSelected,
  toggleSelectAlbum,
}: Props) {
  return (
    <TouchableOpacity
      onPress={() =>
        selectMode ? toggleSelectAlbum(album.albumId) : navigateFunction()
      }
      className="flex w-3/4 mb-4 items-center justify-start bg-transparent"
      style={{
        gap: 10,
        borderRadius: 10,
      }}
    >
      {/* BLUR BACKGROUND IMAGE */}
      <Image
        blurRadius={6}
        className="w-full h-full absolute top-0 left-0"
        source={{ uri: album.albumCover }}
        style={{
          resizeMode: "cover",
          borderRadius: 10,
          borderWidth: 1,
          borderColor: isSelected
            ? "rgba(140, 255, 244, 1)"
            : "rgba(255, 255, 255, 0.1)",
        }}
      />
      {/* BLANK SPACE */}
      <View className="h-0 bg-transparent"></View>
      {/* ALBUM NAME + ARTIST */}
      <Text
        className="text-white font-mono_bold text-lg px-2 py-1"
        numberOfLines={1}
        style={{
          borderRadius: 5,
          backgroundColor: "rgba(0,0,0,0.5)",
          letterSpacing: 2,
        }}
      >
        {album.albumArtist} • {album.albumName}
      </Text>
      <View className="w-full flex items-center justify-center">
        <Image
          source={{ uri: album.albumCover }}
          className="w-4/5 h-48"
          style={{
            borderRadius: 10,
            resizeMode: "cover",
          }}
        />
      </View>
      <View className="flex flex-wrap w-full px-4 pb-4" style={{ gap: 4 }}>
        {album.songRanking.map((song, songIndex) => (
          <Text
            key={songIndex}
            className="text-white p-2"
            style={{
              width: "100%",
              borderRadius: 6,
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              fontFamily: "Geist Medium",
            }}
          >
            {songIndex + 1}. {song.title}
          </Text>
        ))}
        <View className="w-full flex items-center justify-center mt-2">
          <Text
            className="w-3/5 text-center text-white p-1 font-mono_light"
            style={{
              fontSize: 12,
              borderRadius: 6,
              borderWidth: 1,
              borderColor: "rgba(255, 255, 255, 0.1)",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            {formatDate(album.createdAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
