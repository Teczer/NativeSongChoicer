import { useMemo, useState } from "react";

import { useMMKVNumber, useMMKVString } from "react-native-mmkv";
import { useQuery } from "react-query";
import { useColorScheme } from "nativewind";
import useDebounce from "@/hooks/useDebounce";

import { capitalizeFirstLetter } from "@/lib/utils";
import { fallBackImage } from "@/lib/utils";
import { fetchAlbums } from "@/services/SpotifyServices";

import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { TextInput } from "@/components/Inputs/text-input";
import CustomSafeArea from "@/components/CustomSafeArea";
import StepImage from "@/components/ui/StepImage";
import HomeErrorScreen from "@/components/ErrorScreens/HomeErrorScreen";
import AlbumItemResult from "@/components/ui/AlbumItemResult";

export default function HomeScreen({ navigation }: NavigationProps) {
  const [blurIntensity] = useMMKVNumber("blur-intensity");
  const [backgroundImage, setBackgroundImage] =
    useMMKVString("background-image");
  const [artist, setArtist] = useState<string>("");
  const [album, setAlbum] = useState<string>("");
  const debouncedQuery = useDebounce([artist, album], 500);

  const { colorScheme } = useColorScheme();

  const {
    data: results,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<Item[] | undefined>({
    queryKey: ["albums", ...debouncedQuery],
    queryFn: async () => {
      if (debouncedQuery[0] || debouncedQuery[1]) {
        const response = await fetchAlbums(
          debouncedQuery[0],
          debouncedQuery[1]
        );
        return response;
      }
    },
    enabled: Boolean(debouncedQuery[0]) || Boolean(debouncedQuery[1]),
  });

  const filteredAlbums = useMemo(() => {
    return results?.filter((item) =>
      item.name.toLowerCase().includes(album.toLowerCase())
    );
  }, [results, album]);

  if (isError) {
    return (
      <HomeErrorScreen
        queryError={queryError}
        backgroundImage={backgroundImage || fallBackImage(colorScheme)}
        blurIntensity={blurIntensity || 25}
      />
    );
  }

  return (
    <CustomSafeArea className="flex flex-col flex-1 px-4 pt-10 items-center justify-start bg-slate-400 dark:bg-neutral-800 dark:text-neutral-50">
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <Image
        className="absolute inset-0 top-0 left-0 w-full h-full scale-125 rounded-sm"
        blurRadius={blurIntensity || 25}
        source={{ uri: backgroundImage || fallBackImage(colorScheme) }}
      />
      {/* ARTIST INPUT */}
      <View className="w-full flex items-start justify-start gap-1">
        <Text
          className="text-dark dark:text-white"
          style={{ fontFamily: "Geist Bold" }}
        >
          Artist :
        </Text>
        <TextInput
          className="border-2 font-regular bg-transparent border-black/30 dark:border-white/30 dark:text-neutral-50 mb-4"
          value={artist}
          onChangeText={setArtist}
          placeholder="Taylor Swift, Drake, etc..."
        />
      </View>
      {/* ALBUM INPUT */}
      <View className="w-full flex items-start justify-start gap-1">
        <Text
          className="text-dark dark:text-white"
          style={{ fontFamily: "Geist Bold" }}
        >
          Album :
        </Text>
        <TextInput
          className="border-2 font-regular bg-transparent border-black/30 dark:border-white/30 dark:text-neutral-50 mb-10"
          value={album}
          onChangeText={setAlbum}
          placeholder="Lover, Scorpion, etc..."
        />
      </View>
      {/* STEP IMAGE */}
      {!isLoading && !filteredAlbums && <StepImage colorScheme={colorScheme} />}
      {/* SEARCH RESULTS */}
      <ScrollView className="flex flex-1 w-full h-full mb-16">
        {/* LOADER SPINNER */}
        {isLoading && <ActivityIndicator size="large" color="white" />}
        {/* ALBUM ITEMS */}
        {filteredAlbums &&
          filteredAlbums.map((album) => {
            const formattedReleaseDate = album.release_date.split("-")[0];
            const formattedAlbumType = capitalizeFirstLetter(album.type);
            return (
              <AlbumItemResult
                key={album.id}
                album={album}
                navigateFunction={() =>
                  navigation.navigate("Versus", {
                    albumId: album.id,
                    albumCover: album?.images[0]?.url,
                  })
                }
                colorScheme={colorScheme}
                formattedAlbumType={formattedAlbumType}
                formattedReleaseDate={formattedReleaseDate}
                setBackgroundImage={setBackgroundImage}
              />
            );
          })}
      </ScrollView>
    </CustomSafeArea>
  );
}
