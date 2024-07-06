import { useQuery } from "react-query";
import CustomSafeArea from "../components/CustomSafeArea";
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { fetchAlbumById } from "../services/SpotifyServices";
import { useState } from "react";
import { useBackgroundImage } from "../store/useBackgroundImage";
import { generateDuels } from "../lib/duels";
import {
  calculateNewEloScore,
  revertEloScore,
} from "../lib/calculate-elo-score";
import { FontAwesome } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";

export default function VersusScreen({ route }: NavigationProps) {
  const { albumId } = route.params;
  const { image } = useBackgroundImage();
  const { colorScheme } = useColorScheme();

  const {
    data: results,
    isLoading,
    isError,
  } = useQuery<AlbumResponse>({
    queryKey: ["albums", albumId],
    queryFn: async () => {
      const response = await fetchAlbumById(albumId);
      const songsToDuels: Song[] = response.tracks.items.map(
        (track: any, index: number) => {
          return {
            id: index + 1,
            title: track.name,
            image: response.images[0],
          };
        }
      );
      setSongs(songsToDuels);
      setDuels(generateDuels(songsToDuels));
      setSongsEloScores(
        Object.fromEntries(songsToDuels.map((song) => [song.id, 1000]))
      );
      return response;
    },
  });

  const [songs, setSongs] = useState<Song[]>([]);
  const [duels, setDuels] = useState<[Song, Song][]>([]);
  const [currentDuelIndex, setCurrentDuelIndex] = useState<number>(0);
  const [songsEloScores, setSongsEloScores] = useState<{
    [key: number]: number;
  }>({});
  const [finalRanking, setFinalRanking] = useState([]);
  console.log("finalRanking", finalRanking);
  const [voteHistory, setVoteHistory] = useState<
    {
      winnerId: number;
      loserId: number;
      previousWinnerElo: number;
      previousLoserElo: number;
    }[]
  >([]);

  const handleVote = (winnerId: number, loserId: number) => {
    const previousWinnerElo = songsEloScores[winnerId];
    const previousLoserElo = songsEloScores[loserId];
    const { newWinnerElo, newLoserElo } = calculateNewEloScore(
      previousWinnerElo,
      previousLoserElo
    );
    setSongsEloScores((prevEloScores) => ({
      ...prevEloScores,
      [winnerId]: newWinnerElo,
      [loserId]: newLoserElo,
    }));
    setVoteHistory((prevHistory) => [
      ...prevHistory,
      { winnerId, loserId, previousWinnerElo, previousLoserElo },
    ]);
    const nextDuelIndex = currentDuelIndex + 1;
    setCurrentDuelIndex(nextDuelIndex);

    // Vérifier si le classement est terminé et rediriger si nécessaire
    if (nextDuelIndex >= duels.length) {
      const songsWithEloScores = songs.map((song) => ({
        title: song.title,
        eloScore: songsEloScores[song.id],
      }));
      const songRanking = songsWithEloScores.sort(
        (a, b) => b.eloScore - a.eloScore
      );
      setFinalRanking(songRanking);
    }
  };

  const handleUndo = () => {
    if (currentDuelIndex > 0) {
      const lastVote = voteHistory[voteHistory.length - 1];
      const { winnerId, loserId, previousWinnerElo, previousLoserElo } =
        lastVote;

      const { revertedWinnerElo, revertedLoserElo } = revertEloScore(
        previousWinnerElo,
        previousLoserElo
      );

      // Restaurer les scores ELO précédents en utilisant revertEloScore
      setSongsEloScores((prevEloScores) => ({
        ...prevEloScores,
        [winnerId]: revertedWinnerElo,
        [loserId]: revertedLoserElo,
      }));
      // Supprimer le dernier vote de l'historique
      setVoteHistory((prevHistory) => prevHistory.slice(0, -1));
      // Décrémenter l'index du duel
      setCurrentDuelIndex((prevIndex) => prevIndex - 1);
    }
  };

  const isRankingFinished: boolean = currentDuelIndex >= duels.length;
  const [songA, songB] = isRankingFinished
    ? [null, null]
    : duels[currentDuelIndex];

  const completionPercentage = (currentDuelIndex / duels.length) * 100;

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isError) {
    return <Text>Error</Text>;
  }
  return (
    <CustomSafeArea className="flex flex-col flex-1 items-center justify-start bg-white dark:bg-neutral-900 pt-10">
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <Image
        className="absolute inset-0 top-0 left-0 w-full h-full scale-125 rounded-sm"
        blurRadius={10}
        source={{
          uri:
            image ||
            "https://www.rover.com/blog/wp-content/uploads/white-cat-min-960x540.jpg",
        }}
      />
      <Text className="text-center text-black dark:text-white font-bold text-4xl mb-6">
        {results?.artists[0].name} • {results?.name}
      </Text>
      {/* DUEL VIEW*/}
      {!isRankingFinished && (
        <View
          className="flex flex-1 w-full items-center justify-start"
          style={{ gap: 40 }}
        >
          <Text className="text-black dark:text-white font-bold text-4xl">
            {completionPercentage.toFixed(0)}%
          </Text>
          {/* SONG A */}
          <TouchableOpacity
            className="flex justify-center items-center"
            onPress={() => handleVote(songA?.id, songB?.id)}
            style={{ gap: 10 }}
          >
            <Image
              source={{
                uri: songA?.image.url,
              }}
              style={{
                width: 300,
                height: 200,
                resizeMode: "cover",
                borderRadius: 6,
              }}
            />
            <Text className="text-black dark:text-white font-bold text-2xl">
              {songA?.title}
            </Text>
          </TouchableOpacity>
          {/* UNDO BUTTON */}
          <TouchableOpacity
            className="flex flex-row items-center justify-center border-2 border-dark dark:border-[#ffffffa1] py-2 px-4"
            style={{ borderRadius: 6, gap: 10 }}
            onPress={handleUndo}
          >
            <Text className="text-black dark:text-white font-bold text-xl">
              Previous Duel
            </Text>
            <FontAwesome
              name="undo"
              size={20}
              color={colorScheme === "light" ? "#000000" : "#ffffff"}
            />
          </TouchableOpacity>
          {/* SONG B */}
          <TouchableOpacity
            className="flex justify-center items-center"
            style={{ gap: 10 }}
            onPress={() => handleVote(songB?.id, songA?.id)}
          >
            <Image
              source={{
                uri: songB?.image.url,
              }}
              style={{
                width: 300,
                height: 200,
                resizeMode: "cover",
                borderRadius: 6,
              }}
            />
            <Text className="text-black dark:text-white font-bold text-2xl">
              {songB?.title}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {/* FINAL RANKING VIEW */}
      {isRankingFinished && (
        <ScrollView className="flex flex-1 w-4/5 flex-col">
          {finalRanking.map((song, index) => (
            <View key={index}>
              <Text className="text-black dark:text-white font-bold text-2xl mb-10">
                #{index + 1} {song.title} {song.eloScore.toFixed(0)}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </CustomSafeArea>
  );
}
