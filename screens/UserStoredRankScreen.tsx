import { useMemo, useState } from "react";
import { useMMKVString, useMMKVNumber } from "react-native-mmkv";
import { useColorScheme } from "nativewind";

import { storage } from "@/lib/mmkv";
import { fallBackImage } from "@/lib/utils";

import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  View,
  Switch,
  Alert,
} from "react-native";
import CustomSafeArea from "@/components/CustomSafeArea";
import { Picker } from "@react-native-picker/picker";
import DeleteSelectedAlbumsButton from "@/components/Buttons/DeleteSelectedAlbumsButton";
import SearchRankingBar from "@/components/Inputs/SearchRankingBar";
import MiniAlbumCard from "@/components/ui/MiniAlbumCard";

interface UserRankedAlbums {
  albumName: string;
  albumArtist: string;
  albumCover: string;
  albumId: string;
  songRanking: any[];
  createdAt: string;
}

export default function UserStoredRankScreen({ navigation }: NavigationProps) {
  // MMKV States hooks
  const [userRankedAlbums, setUserRankedAlbums] = useMMKVString("song-ranking");
  const [backgroundImage] = useMMKVString("background-image");
  const [blurIntensity] = useMMKVNumber("blur-intensity");

  // Search State
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter State
  const [filterOption, setFilterOption] = useState<string>("recent");

  // Select States
  const [selectMode, setSelectMode] = useState<boolean>(false);
  const [selectedAlbums, setSelectedAlbums] = useState<string[]>([]);
  const [selectAllAlbums, setSelectAllAlbums] = useState<boolean>(false);

  const { colorScheme } = useColorScheme();

  function deleteSelectedAlbums() {
    const updatedAlbums = parsedUserRankedAlbums.filter(
      (album) => !selectedAlbums.includes(album.albumId)
    );
    const updatedAlbumsString = JSON.stringify(updatedAlbums);
    storage.set("song-ranking", updatedAlbumsString);
    setUserRankedAlbums(updatedAlbumsString);
    setSelectedAlbums([]);
  }

  function showAlert() {
    Alert.alert(
      "WARNING",
      "Are you sure you want to delete all selected albums?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Delete", onPress: () => deleteSelectedAlbums() },
      ]
    );
  }

  function toggleSelectAlbum(albumId: string) {
    if (selectedAlbums.includes(albumId)) {
      setSelectedAlbums(selectedAlbums.filter((id) => id !== albumId));
    } else {
      setSelectedAlbums([...selectedAlbums, albumId]);
    }
  }

  const parsedUserRankedAlbums: UserRankedAlbums[] = userRankedAlbums
    ? JSON.parse(userRankedAlbums)
    : [];

  const sortedAlbums = useMemo(() => {
    let sorted = [...parsedUserRankedAlbums];
    switch (filterOption) {
      case "recent":
        sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "oldest":
        sorted.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "A-Z":
        sorted.sort((a, b) => a.albumName.localeCompare(b.albumName));
        break;
      case "Z-A":
        sorted.sort((a, b) => b.albumName.localeCompare(a.albumName));
        break;
      default:
        break;
    }
    return sorted;
  }, [filterOption, parsedUserRankedAlbums]);

  const filteredAlbums = useMemo(() => {
    if (!searchQuery) return sortedAlbums;
    return sortedAlbums.filter(
      (album) =>
        album.albumName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        album.albumArtist.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, sortedAlbums]);

  return (
    <CustomSafeArea className="flex flex-col flex-1 items-center justify-start pt-10">
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
      <View className="w-full h-10 flex flex-row items-center justify-between mb-4 px-12">
        {/* FILTER */}
        {!selectMode && (
          <Picker
            selectedValue={filterOption}
            dropdownIconColor="white"
            selectionColor="white"
            onValueChange={(itemValue) => setFilterOption(itemValue)}
            style={{
              height: 50,
              width: 175,
              color: "white",
            }}
          >
            <Picker.Item label="Most Recent" value="recent" />
            <Picker.Item label="Oldest First" value="oldest" />
            <Picker.Item label="Album (A-Z)" value="A-Z" />
            <Picker.Item label="Album (Z-A)" value="Z-A" />
          </Picker>
        )}
        {/* SELECT MODE */}
        {selectMode && (
          <View
            className="flex flex-row items-center justify-between"
            style={{ gap: 10 }}
          >
            {/* TRASH BUTTON */}
            {selectedAlbums.length > 0 && (
              <DeleteSelectedAlbumsButton showAlert={showAlert} />
            )}
            {/* SWITCH SELECT ALL */}
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor="white"
              value={selectAllAlbums}
              onValueChange={() => {
                if (selectAllAlbums) {
                  // If currently all albums are selected, deselect all
                  setSelectedAlbums([]);
                } else {
                  // If not all are selected, select all
                  setSelectedAlbums(
                    filteredAlbums.map((album) => album.albumId)
                  );
                }
                // Toggle the selectAllAlbums state
                setSelectAllAlbums(!selectAllAlbums);
              }}
              style={{ alignSelf: "center" }}
            />
          </View>
        )}
        {/* SWITCH SELECT MODE */}
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor="white"
          value={selectMode}
          onValueChange={(value) => {
            setSelectMode(value);
            if (!value) {
              setSelectedAlbums([]);
            }
          }}
          style={{ alignSelf: "center" }}
        />
      </View>
      {/* SEARCH BAR */}
      <SearchRankingBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        colorScheme={colorScheme}
      />
      {/* NO ALBUMS FOUND */}
      {filteredAlbums.length === 0 && (
        <Text className="text-dark dark:text-white font-mono_bold text-2xl mt-10">
          No albums saved found
        </Text>
      )}
      {/* ALBUMS */}
      {filteredAlbums.length > 0 && (
        <ScrollView
          className="flex w-full"
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          {/* ALBUM CARD */}
          {filteredAlbums.map((album) => {
            const albumInfos = {
              albumName: album.albumName,
              albumArtist: album.albumArtist,
              albumCover: album.albumCover,
              albumId: album.albumId,
            };
            const isSelected = selectedAlbums.includes(album.albumId);
            return (
              <MiniAlbumCard
                key={`ranked-album-${album.albumId}`}
                album={album}
                selectMode={selectMode}
                isSelected={isSelected}
                toggleSelectAlbum={toggleSelectAlbum}
                navigateFunction={() =>
                  navigation.navigate("Rank", {
                    songRanking: album.songRanking,
                    albumInfos: albumInfos,
                    rankingView: true,
                  })
                }
              />
            );
          })}
          <View className="h-20 w-full"></View>
        </ScrollView>
      )}
    </CustomSafeArea>
  );
}
