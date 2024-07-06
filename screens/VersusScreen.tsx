import { useQuery } from "react-query";
import CustomSafeArea from "../components/CustomSafeArea";
import { Image, Text } from "react-native";
import { fetchAlbumTracks } from "../services/SpotifyServices";
import { useMemo } from "react";
import CustomBlurView from "../components/CustomBlurView";
import { useBackgroundImage } from "../store/useBackgroundImage";

export default function VersusScreen({ route }: NavigationProps) {
  const { albumId } = route.params;
  const { image } = useBackgroundImage();

  const {
    data: results,
    isLoading,
    isError,
  } = useQuery<Item[] | undefined>({
    queryKey: ["albums", albumId],
    queryFn: async () => {
      const response = await fetchAlbumTracks(albumId);

      return response;
    },
  });

  const albumTracks = useMemo(
    () => results?.map((song) => song.name) ?? [],
    [results]
  );

  console.log("albumTracks", albumTracks);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isError) {
    return <Text>Error</Text>;
  }
  return (
    <CustomSafeArea className="flex flex-col flex-1 items-center justify-center bg-white dark:bg-neutral-900">
      <Image
        className="absolute inset-0 top-0 left-0 w-full h-full scale-125 rounded-sm"
        source={{
          uri:
            image ||
            "https://www.rover.com/blog/wp-content/uploads/white-cat-min-960x540.jpg",
        }}
      />
      <CustomBlurView />
      <Text className="text-black dark:text-white font-bold text-4xl mb-10">
        VersusScreen
      </Text>
      <Text className="text-black dark:text-white font-bold text-4xl mb-10">
        albumId: {albumId}
      </Text>
    </CustomSafeArea>
  );
}
