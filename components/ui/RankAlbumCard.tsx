import { Image, Text, View } from "react-native";
import SongChoicerMark from "@/components/ui/SongChoicerMark";

interface Props {
  viewRef: any;
  albumInfos: {
    albumName: string;
    albumArtist: string;
    albumCover: string;
    albumId: string;
  };
  songRanking: SongRankInfo[];
}

export default function RankAlbumCard({
  viewRef,
  albumInfos,
  songRanking,
}: Props) {
  return (
    <View
      ref={viewRef}
      className="w-full h-full flex flex-col bg-transparent"
      style={{
        alignItems: "center",
        justifyContent: "flex-start",
        borderRadius: 20,
      }}
    >
      {/* BLUR BACKGROUND IMAGE */}
      <Image
        blurRadius={6}
        className="w-full h-full absolute top-0 left-0"
        source={{ uri: albumInfos.albumCover }}
        style={{
          resizeMode: "cover",
          borderRadius: 20,
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.1)",
        }}
      />
      {/* BLANK SPACE */}
      <View className="h-6 bg-transparent"></View>
      {/* ALBUM NAME + ARTIST */}
      <Text
        className="text-white font-mono_bold text-xl mb-6 px-4 py-2"
        style={{
          borderRadius: 5,
          backgroundColor: "rgba(0,0,0,0.5)",
          letterSpacing: 2,
        }}
      >
        {albumInfos.albumArtist} • {albumInfos.albumName}
      </Text>
      <Image
        className="mb-6"
        source={{ uri: albumInfos.albumCover }}
        style={{
          width: 300,
          height: 300,
          resizeMode: "contain",
          borderRadius: 20,
        }}
      />
      <View className="flex flex-1 w-full flex-col px-6 pb-6">
        {songRanking.map((song, index) => {
          const widthPercentage =
            index === 0
              ? "100%"
              : index === 1
              ? "95%"
              : index === 2
              ? "90%"
              : "80%";
          return (
            <Text
              key={index}
              className="text-white font-mono_bold text-base mb-2 px-4 py-1.5"
              style={{
                width: widthPercentage,
                borderRadius: 8,
                backgroundColor: "rgba(0, 0, 0, 0.4)",
              }}
            >
              {index + 1}. {song.title}
            </Text>
          );
        })}
        {/* SONG CHOICER MARK */}
        <SongChoicerMark />
      </View>
    </View>
  );
}
