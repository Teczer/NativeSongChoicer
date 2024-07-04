import { RouteProp } from "@react-navigation/native";
import { useQuery } from "react-query";
import CustomSafeArea from "../components/CustomSafeArea";
import { Text } from "react-native";
import { fetchAlbumTracks } from "../services/SpotifyServices";
import { useMemo } from "react";

type VersusScreenRouteProp = RouteProp<
  { params: { albumId: string } },
  "params"
>;

export default function VersusScreen({
  route,
}: {
  route: VersusScreenRouteProp;
}) {
  const { albumId } = route.params;

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
      <Text className="text-black dark:text-white font-bold text-4xl mb-10">
        VersusScreen
      </Text>
      <Text className="text-black dark:text-white font-bold text-4xl mb-10">
        albumId: {albumId}
      </Text>
    </CustomSafeArea>
  );
}
