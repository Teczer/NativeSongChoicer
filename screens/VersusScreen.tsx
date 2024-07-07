import { useEffect, useRef, useState } from "react";

import { useQuery } from "react-query";
import { useColorScheme } from "nativewind";

import { fetchAlbumById } from "../services/SpotifyServices";

import { generateDuels } from "../lib/duels";
import {
  calculateNewEloScore,
  revertEloScore,
} from "../lib/calculate-elo-score";
import { textShadow } from "../lib/styles";

import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Dimensions,
  Animated,
} from "react-native";
import CustomSafeArea from "../components/CustomSafeArea";
import { FontAwesome } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

export default function VersusScreen({ route, navigation }: NavigationProps) {
  const { albumId } = route.params;

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

  // Valeurs animées pour les positions de Song A et Song B
  const translateXSongA = useRef(
    new Animated.Value(-Dimensions.get("window").width)
  ).current;
  const translateXSongB = useRef(
    new Animated.Value(Dimensions.get("window").width)
  ).current;

  const startAnimations = () => {
    translateXSongA.setValue(-Dimensions.get("window").width);
    translateXSongB.setValue(Dimensions.get("window").width);
    Animated.parallel([
      Animated.timing(translateXSongA, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(translateXSongB, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    startAnimations();
  }, [currentDuelIndex]);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isError) {
    return <Text>Error</Text>;
  }
  return (
    <CustomSafeArea className="flex flex-col flex-1 items-center justify-start bg-white dark:bg-neutral-900 pt-24">
      {/* STATUS BAR */}
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle="light-content"
      />
      {/* BACKGROUND IMAGE */}
      <Image
        className="absolute inset-0 top-0 left-0 w-full h-full scale-125 rounded-sm"
        blurRadius={25}
        source={{
          uri: results?.images[0]?.url,
        }}
      />
      {/* BACK BUTTON */}
      <TouchableOpacity
        style={{ borderRadius: 10, width: 40, height: 40 }}
        onPress={() => navigation.goBack()}
        className="flex items-center justify-center absolute top-14 left-6 bg-transparent border-2 border-neutral-300"
      >
        <Entypo
          style={{ ...textShadow }}
          name="chevron-left"
          size={32}
          color="white"
        />
      </TouchableOpacity>
      {/* UNDO BUTTON */}
      {!isRankingFinished && (
        <TouchableOpacity
          style={{ borderRadius: 10, width: 44, height: 44, top: 53 }}
          onPress={handleUndo}
          className="flex items-center justify-center absolute right-6 bg-transparent border-2 border-neutral-300"
        >
          <FontAwesome
            style={{ ...textShadow }}
            name="undo"
            size={20}
            color="white"
          />
        </TouchableOpacity>
      )}
      {/* ALBUM ARTIST NAME */}
      <Text
        style={{ ...textShadow }}
        className="text-center text-white font-bold text-3xl mb-6"
      >
        {results?.artists[0].name} • {results?.name}
      </Text>
      {/* DUEL VIEW*/}
      {!isRankingFinished && (
        <View
          className="flex flex-1 w-full items-center justify-start"
          style={{ gap: 50 }}
        >
          {/* COMPLETION PERCENTAGE */}
          <Text
            style={{ ...textShadow }}
            className="text-white font-bold text-3xl"
          >
            {completionPercentage.toFixed(0)}%
          </Text>
          {/* SONG A */}
          <Animated.View
            style={{ transform: [{ translateX: translateXSongA }] }}
          >
            <TouchableOpacity
              className="flex justify-center items-center"
              onPress={() => handleVote(songA?.id, songB?.id)}
              style={{ gap: 10 }}
            >
              <View className="shadow-2xl shadow-black">
                <Image
                  source={{
                    uri: songA?.image.url,
                  }}
                  style={{
                    width: Dimensions.get("window").width / 1.3,
                    height: Dimensions.get("window").height / 4,
                    resizeMode: "cover",
                    borderRadius: 6,
                  }}
                />
              </View>
              <Text
                style={{
                  ...textShadow,
                  width: Dimensions.get("window").width - 10,
                  fontFamily: "Cochin",
                }}
                className="text-white font-bold text-2xl text-center"
              >
                {songA?.title}
              </Text>
            </TouchableOpacity>
          </Animated.View>
          {/* SONG B */}
          <Animated.View
            style={{ transform: [{ translateX: translateXSongB }] }}
          >
            <TouchableOpacity
              className="flex justify-center items-center"
              style={{ gap: 10 }}
              onPress={() => handleVote(songB?.id, songA?.id)}
            >
              <View className="shadow-2xl shadow-black">
                <Image
                  source={{
                    uri: songB?.image.url,
                  }}
                  style={{
                    width: Dimensions.get("window").width / 1.3,
                    height: Dimensions.get("window").height / 4,
                    resizeMode: "cover",
                    borderRadius: 6,
                  }}
                />
              </View>
              <Text
                className="text-white font-bold text-2xl text-center"
                style={{
                  ...textShadow,
                  width: Dimensions.get("window").width - 10,
                }}
              >
                {songB?.title}
              </Text>
            </TouchableOpacity>
          </Animated.View>
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
