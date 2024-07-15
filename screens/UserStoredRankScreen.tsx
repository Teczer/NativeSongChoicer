import { useMMKVString, useMMKVNumber } from "react-native-mmkv";
import { useColorScheme } from "nativewind";
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Switch,
} from "react-native";
import CustomSafeArea from "../components/CustomSafeArea";
import { storage } from "../lib/mmkv";
import { useMemo, useState } from "react";
import { Feather } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import { formatDate } from "../lib/utils";

interface UserRankedAlbums {
  albumName: string;
  albumArtist: string;
  albumCover: string;
  albumId: string;
  songRanking: any[];
  createdAt: string;
}

export default function UserStoredRankScreen({ navigation }: NavigationProps) {
  const [userRankedAlbums, setUserRankedAlbums] = useMMKVString("song-ranking");
  const [backgroundImage] = useMMKVString("background-image");
  const [blurIntensity] = useMMKVNumber("blur-intensity");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterOption, setFilterOption] = useState<string>("default");
  const [selectMode, setSelectMode] = useState<boolean>(false);
  const [selectAllAlbums, setSelectAllAlbums] = useState<boolean>(false);
  const [selectedAlbums, setSelectedAlbums] = useState<string[]>([]);
  const { colorScheme } = useColorScheme();

  const fallBackImage =
    colorScheme === "light"
      ? "https://img.freepik.com/free-vector/winter-blue-pink-gradient-background-vector_53876-117275.jpg"
      : "https://cdns-images.dzcdn.net/images/cover/c1739b10fb9608e7fb6830162d90c8b4/1900x1900-000000-80-0-0.jpg";

  const deleteSelectedAlbums = () => {
    const updatedAlbums = parsedUserRankedAlbums.filter(
      (album) => !selectedAlbums.includes(album.albumId)
    );
    const updatedAlbumsString = JSON.stringify(updatedAlbums);
    storage.set("song-ranking", updatedAlbumsString);
    setUserRankedAlbums(updatedAlbumsString);
    setSelectedAlbums([]);
  };

  const toggleSelectAlbum = (albumId: string) => {
    if (selectedAlbums.includes(albumId)) {
      setSelectedAlbums(selectedAlbums.filter((id) => id !== albumId));
    } else {
      setSelectedAlbums([...selectedAlbums, albumId]);
    }
  };

  const parsedUserRankedAlbums: UserRankedAlbums[] = userRankedAlbums
    ? JSON.parse(userRankedAlbums)
    : [];

  const sortedAlbums = useMemo(() => {
    let sorted = [...parsedUserRankedAlbums];
    if (filterOption === "date") {
      sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (filterOption === "A-Z") {
      sorted.sort((a, b) => a.albumName.localeCompare(b.albumName));
    } else if (filterOption === "Z-A") {
      sorted.sort((a, b) => b.albumName.localeCompare(a.albumName));
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
        source={{ uri: backgroundImage || fallBackImage }}
      />
      <View className="w-full h-10 flex flex-row items-center justify-between mb-4 px-12">
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
            <Picker.Item label="Default" value="default" />
            <Picker.Item label="Most Recent" value="date" />
            <Picker.Item label="Album (A-Z)" value="A-Z" />
            <Picker.Item label="Album (Z-A)" value="Z-A" />
          </Picker>
        )}
        {selectMode && (
          <View
            className="flex flex-row items-center justify-between"
            style={{ gap: 10 }}
          >
            {selectedAlbums.length > 0 && (
              <TouchableOpacity
                onPress={deleteSelectedAlbums}
                className="flex flex-row items-center p-2"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                  borderRadius: 6,
                }}
              >
                <Feather name="trash-2" size={24} color="white" />
              </TouchableOpacity>
            )}
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

        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor="white"
          value={selectMode}
          onValueChange={setSelectMode}
          style={{
            alignSelf: "center",
          }}
        />
      </View>
      {/* SEARCH BAR */}
      <View className="w-full flex items-center justify-center mb-4">
        <TextInput
          className="w-2/3 border font-regular bg-transparent border-black/30 dark:border-white/30 dark:text-neutral-50 px-2"
          style={{
            borderRadius: 4,
          }}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by album or artist"
          placeholderTextColor={
            colorScheme === "light" ? "#000" : "rgba(255, 255, 255, 0.5)"
          }
        />
      </View>
      {!parsedUserRankedAlbums && (
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
              <TouchableOpacity
                key={album.albumId}
                onPress={() =>
                  selectMode
                    ? toggleSelectAlbum(album.albumId)
                    : navigation.navigate("Rank", {
                        songRanking: album.songRanking,
                        albumInfos: albumInfos,
                        RankingView: true,
                      })
                }
                className="flex w-3/4 mb-4 items-center justify-start bg-transparent"
                style={{
                  gap: 10,
                  borderRadius: 10,
                }}
              >
                {/* BLUR BACKGROUND IMAGE */}
                <Image
                  blurRadius={6}
                  className="w-full h-full absolute top-0 left-0"
                  source={{ uri: album.albumCover }}
                  style={{
                    resizeMode: "cover",
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: isSelected
                      ? "rgba(140, 255, 244, 1)"
                      : "rgba(255, 255, 255, 0.1)",
                  }}
                />
                {/* BLANK SPACE */}
                <View className="h-0 bg-transparent"></View>
                {/* ALBUM NAME + ARTIST */}
                <Text
                  className="text-white font-mono_bold text-lg px-2 py-1"
                  numberOfLines={1}
                  style={{
                    borderRadius: 5,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    letterSpacing: 2,
                  }}
                >
                  {album.albumArtist} • {album.albumName}
                </Text>
                <View className="w-full flex items-center justify-center">
                  <Image
                    source={{ uri: album.albumCover }}
                    className="w-4/5 h-48"
                    style={{
                      borderRadius: 10,
                      resizeMode: "cover",
                    }}
                  />
                </View>
                <View
                  className="flex flex-wrap w-full px-4 pb-4"
                  style={{ gap: 4 }}
                >
                  {album.songRanking.map((song, songIndex) => (
                    <Text
                      key={songIndex}
                      className="text-white p-2"
                      style={{
                        width: "100%",
                        borderRadius: 6,
                        backgroundColor: "rgba(0, 0, 0, 0.3)",
                        fontFamily: "Geist Medium",
                      }}
                    >
                      {songIndex + 1}. {song.title}
                    </Text>
                  ))}
                  <View className="w-full flex items-center justify-center mt-2">
                    <Text
                      className="w-3/5 text-center text-white p-1 font-mono_light"
                      style={{
                        fontSize: 12,
                        borderRadius: 6,
                        borderWidth: 1,
                        borderColor: "rgba(255, 255, 255, 0.1)",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                      }}
                    >
                      {formatDate(album.createdAt)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
          <View className="h-20 w-full"></View>
        </ScrollView>
      )}
    </CustomSafeArea>
  );
}
