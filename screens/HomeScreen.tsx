import { useState } from "react";

import { Button, Image, ScrollView, Text, View } from "react-native";
import { fetchAlbums } from "../services/SpotifyServices";
import CustomSafeArea from "../components/CustomSafeArea";
import { Item } from "../types/song";
import { TextInput } from "../components/text-input";

export default function HomeScreen() {
  const [artist, setArtist] = useState<string>("");
  const [album, setAlbum] = useState<string>("");
  const [data, setData] = useState<null | Item[]>(null);

  async function getAlbums() {
    try {
      const response = await fetchAlbums(artist, album);
      setData(response.albums.items);
    } catch (error) {
      console.log("error", error);
    }
  }

  return (
    <CustomSafeArea className="flex flex-col flex-1 px-4 pt-10 items-center justify-start bg-slate-400 dark:bg-neutral-900 dark:text-neutral-50">
      <TextInput
        className="border border-black/20 dark:border-white/20 dark:bg-neutral-900 dark:text-neutral-50 mb-4"
        value={artist}
        onChangeText={setArtist}
        placeholder="Taylor Swift, Drake, etc..."
      />
      <TextInput
        className="border border-black/20 dark:border-white/20 dark:bg-neutral-900 dark:text-neutral-50 mb-4"
        value={album}
        onChangeText={setAlbum}
        placeholder="Lover, Scorpion, etc..."
      />
      <Button title="Search" onPress={getAlbums} />
      <ScrollView className="flex flex-1 w-full">
        {data &&
          data.map((album) => {
            const formattedRealeaseDate = album.release_date.split("-")[0];
            const formattedAlbumType =
              album.type.charAt(0).toUpperCase() + album.type.slice(1);

            return (
              <View className="flex flex-row w-full mb-4" key={album.id}>
                <Image
                  className="w-2/5 h-40 rounded-sm"
                  source={{ uri: album?.images[0]?.url }}
                />
                <View className="w-3/5 flex flex-col justify-center items-center pl-3">
                  <Text className="w-full h-auto mb-2 text-start font-bold text-dark dark:text-white">
                    {album.name}
                  </Text>
                  <Text className="w-full text-dark dark:text-neutral-300">
                    {formattedRealeaseDate} • {formattedAlbumType}
                  </Text>
                </View>
              </View>
            );
          })}
      </ScrollView>
    </CustomSafeArea>
  );
}
