import { useEffect, useMemo, useState } from "react";
import { setItem } from "../utils/AsyncStorage";

import { useQuery } from "react-query";
import useDebounce from "../hooks/useDebounce";
import { useBackgroundImage } from "../store/useBackgroundImage";
import { useColorScheme } from "nativewind";
import { useInitializeBackgroundImage } from "../hooks/useInitializeBackgroundImage";

import { fetchAlbums } from "../services/SpotifyServices";

import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "../components/text-input";
import CustomSafeArea from "../components/CustomSafeArea";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import StepImage from "../components/StepImage";

export default function HomeScreen({ navigation }: NavigationProps) {
  const [artist, setArtist] = useState<string>("");
  const [album, setAlbum] = useState<string>("");
  const debouncedQuery = useDebounce([artist, album], 500);

  const { colorScheme } = useColorScheme();

  const userStoredImage = useInitializeBackgroundImage();
  const { image, setImage } = useBackgroundImage();

  const {
    data: results,
    isLoading,
    isError,
  } = useQuery<Item[] | undefined>({
    queryKey: ["albums", ...debouncedQuery],
    queryFn: async () => {
      if (debouncedQuery[0] || debouncedQuery[1]) {
        const response = await fetchAlbums(
          debouncedQuery[0],
          debouncedQuery[1]
        );
        return response.albums.items;
      }
    },
    enabled: Boolean(debouncedQuery[0]) || Boolean(debouncedQuery[1]),
  });

  const filteredAlbums = useMemo(() => {
    return results?.filter((item) =>
      item.name.toLowerCase().includes(album.toLowerCase())
    );
  }, [results, album]);

  useEffect(() => {
    if (!userStoredImage) return;
    setImage(userStoredImage);
  }, []);

  if (isError) {
    return <Text>Error</Text>;
  }

  return (
    <CustomSafeArea className="flex flex-col flex-1 px-4 pt-10 items-center justify-start bg-slate-400 dark:bg-neutral-900 dark:text-neutral-50">
      <Image
        blurRadius={30}
        className="absolute inset-0 top-0 left-0 w-full h-full scale-125 rounded-sm"
        source={{
          uri:
            image ||
            "https://www.rover.com/blog/wp-content/uploads/white-cat-min-960x540.jpg",
        }}
      />
      {/* ARTIST INPUT */}
      <View className="w-full flex items-start justify-start gap-1">
        <Text className="font-bold text-dark dark:text-white">Artist :</Text>
        <TextInput
          className="border-2 bg-transparent border-black/30 dark:border-white/30 dark:text-neutral-50 mb-4"
          value={artist}
          onChangeText={setArtist}
          placeholder="Taylor Swift, Drake, etc..."
        />
      </View>
      {/* ALBUM INPUT */}
      <View className="w-full flex items-start justify-start gap-1">
        <Text className="font-bold text-dark dark:text-white">Album :</Text>
        <TextInput
          className="border-2 bg-transparent border-black/30 dark:border-white/30 dark:text-neutral-50 mb-10"
          value={album}
          onChangeText={setAlbum}
          placeholder="Lover, Scorpion, etc..."
        />
      </View>

      {/* STEP IMAGE */}
      {!isLoading && !filteredAlbums && <StepImage colorScheme={colorScheme} />}

      {/* SEARCH RESULTS */}
      <ScrollView className="flex flex-1 w-full h-full mb-16">
        {isLoading && <ActivityIndicator size="large" color="white" />}
        {filteredAlbums &&
          filteredAlbums.map((album) => {
            const formattedReleaseDate = album.release_date.split("-")[0];
            const formattedAlbumType =
              album.type.charAt(0).toUpperCase() + album.type.slice(1);

            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Versus", {
                    albumId: album.id,
                  });
                }}
                className="flex flex-row w-full mb-4"
                key={album.id}
              >
                <Image
                  className="w-2/5 h-40"
                  source={{ uri: album?.images[0]?.url }}
                  borderRadius={10}
                />
                <View className="w-3/5 flex flex-col justify-center items-start pl-3">
                  <TouchableOpacity
                    className="absolute top-2 right-0 w-auto"
                    onPress={() => {
                      setImage(album?.images[0]?.url);
                      setItem("bg-image", album?.images[0]?.url);
                    }}
                  >
                    <MaterialCommunityIcons
                      name="image-plus"
                      size={28}
                      color={colorScheme === "light" ? "black" : "white"}
                    />
                  </TouchableOpacity>
                  <Text className="w-full h-auto mb-1 text-start font-bold text-dark dark:text-white">
                    {album.name}
                  </Text>
                  <Text className="w-full text-dark dark:text-neutral-300">
                    {formattedReleaseDate} • {formattedAlbumType}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
      </ScrollView>
    </CustomSafeArea>
  );
}
