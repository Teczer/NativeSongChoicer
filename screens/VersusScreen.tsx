import { useEffect, useRef, useState } from "react";

import { useQuery } from "react-query";

import { fetchAlbumById } from "../services/SpotifyServices";

import { generateDuels } from "../lib/duels";
import {
  calculateNewEloScore,
  revertEloScore,
} from "../lib/calculate-elo-score";
import { textShadow } from "../lib/styles";

import {
  Image,
  StatusBar,
  Text,
  View,
  Dimensions,
  Animated,
} from "react-native";
import CustomSafeArea from "../components/CustomSafeArea";
import VersusScreenSkeleton from "../components/VersusScreenSkeleton";
import BackButton from "../components/BackButton";
import UndoButton from "../components/UndoButton";
import VoteButton from "../components/VoteButton";

export default function VersusScreen({ route, navigation }: NavigationProps) {
  const { albumId, albumCover } = route.params;

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

  const albumInfos = {
    albumName: results?.name,
    albumArtist: results?.artists[0].name,
    albumCover: results?.images[0]?.url,
  };

  const [songs, setSongs] = useState<Song[]>([]);
  const [duels, setDuels] = useState<[Song, Song][]>([]);
  const [currentDuelIndex, setCurrentDuelIndex] = useState<number>(0);
  const [songsEloScores, setSongsEloScores] = useState<{
    [key: number]: number;
  }>({});
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
      navigation.navigate("Rank", {
        songRanking: songRanking,
        albumInfos: albumInfos,
      });
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
    return <VersusScreenSkeleton albumCover={albumCover} />;
  }

  if (isError) {
    return (
      <VersusScreenSkeleton
        albumCover={albumCover}
        error={true}
        navigation={navigation}
      />
    );
  }

  return (
    <CustomSafeArea className="flex flex-col flex-1 items-center justify-start bg-white dark:bg-neutral-900 pt-20">
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
          uri: albumInfos.albumCover,
        }}
      />
      {/* BACK BUTTON */}
      <BackButton handleBack={() => navigation.goBack()} />
      {/* UNDO BUTTON */}
      {!isRankingFinished && (
        <UndoButton
          handleUndo={handleUndo}
          currentDuelIndex={currentDuelIndex}
        />
      )}
      {/* ALBUM ARTIST NAME */}
      <Text
        numberOfLines={2}
        className="text-center text-white text-3xl mb-6"
        style={{
          ...textShadow,
          width: Dimensions.get("window").width / 1.3,
          fontFamily: "Geist Mono Bold",
        }}
      >
        {albumInfos.albumArtist} • {albumInfos.albumName}
      </Text>
      {/* DUEL VIEW*/}
      {!isRankingFinished && (
        <View
          className="flex flex-1 w-full items-center justify-start"
          style={{ gap: 30 }}
        >
          {/* COMPLETION PERCENTAGE */}
          <Text
            style={{
              fontFamily: "Geist Mono Bold",
              textShadowColor: "black",
              textShadowOffset: { width: 0.5, height: 0.5 },
              textShadowRadius: 6,
            }}
            className="text-white text-3xl"
          >
            {completionPercentage.toFixed(0)} %
          </Text>
          {/* SONG A */}
          <Animated.View
            style={{ transform: [{ translateX: translateXSongA }] }}
          >
            <VoteButton
              handleVote={() =>
                handleVote(songA?.id as number, songB?.id as number)
              }
              song={songA as Song}
            />
          </Animated.View>
          {/* SONG B */}
          <Animated.View
            style={{ transform: [{ translateX: translateXSongB }] }}
          >
            <VoteButton
              handleVote={() =>
                handleVote(songB?.id as number, songA?.id as number)
              }
              song={songB as Song}
            />
          </Animated.View>
        </View>
      )}
    </CustomSafeArea>
  );
}
