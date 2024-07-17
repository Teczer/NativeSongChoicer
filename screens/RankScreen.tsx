import { useEffect, useRef } from "react";

import { captureRef } from "react-native-view-shot";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import Share from "react-native-share";

import { storage } from "@/lib/mmkv";

import { ScrollView } from "react-native-gesture-handler";
import {
  Image,
  StatusBar,
  Text,
  View,
  Alert,
  PermissionsAndroid,
  Platform,
  BackHandler,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import CustomSafeArea from "@/components/CustomSafeArea";
import RankCardButton from "@/components/Buttons/RankCardButton";
import RankAlbumCard from "@/components/ui/RankAlbumCard";

interface ParamsProps {
  songRanking: SongRankInfo[];
  albumInfos: {
    albumName: string;
    albumArtist: string;
    albumCover: string;
    albumId: string;
  };
  rankingView?: boolean;
}

export default function RankScreen({ route, navigation }: NavigationProps) {
  const { songRanking, albumInfos, rankingView }: ParamsProps = route.params;
  const viewRef = useRef(null);

  async function getPermissionAndroid() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Image Download Permission",
          message: "Your permission is required to save images to your device",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      }
      Alert.alert(
        "",
        "Your permission is required to save images to your device",
        [{ text: "OK", onPress: () => {} }],
        { cancelable: false }
      );
    } catch (err) {
      console.log("err", err);
    }
  }

  async function downloadImage() {
    try {
      const uri = await captureRef(viewRef, {
        format: "png",
        quality: 0.8,
      });

      if (Platform.OS === "android") {
        const granted = await getPermissionAndroid();
        if (!granted) {
          return;
        }
      }

      const image = await CameraRoll.save(uri, { type: "photo" });
      if (image) {
        Alert.alert(
          "",
          "Image saved successfully.",
          [{ text: "OK", onPress: () => {} }],
          { cancelable: false }
        );
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  async function shareImage() {
    try {
      const uri = await captureRef(viewRef, {
        format: "png",
        quality: 0.8,
      });

      const options = {
        title: "Share via",
        url: uri,
      };

      Share.open(options)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          err && console.log(err);
        });
    } catch (error) {
      console.log("error", error);
    }
  }

  // Prevent back button on Android to Home instead of back to previous screen only if the user is not coming from the ranking view
  if (Platform.OS === "android" && !rankingView) {
    useEffect(() => {
      const backAction = () => {
        navigation.navigate("Home");
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove();
    }, []);
  }

  // useEffect for saving the current ranking in MMKV storage
  useEffect(() => {
    // Do not save the ranking if the users comes from the ranking view
    if (rankingView) return;
    // Retrieve existing data from MMKV
    let storedRankings = storage.getString("song-ranking");
    let albums = [];

    if (storedRankings) {
      albums = JSON.parse(storedRankings);
    }

    // Add new album ranking
    let newAlbum = {
      albumName: albumInfos.albumName,
      albumArtist: albumInfos.albumArtist,
      albumCover: albumInfos.albumCover,
      albumId: albumInfos.albumId,
      songRanking: songRanking,
      createdAt: new Date().toISOString(),
    };

    albums.push(newAlbum);
    // Update the 'song-ranking' key in MMKV
    storage.set("song-ranking", JSON.stringify(albums));
  }, [songRanking, albumInfos]);

  return (
    <CustomSafeArea
      onlyTop={true}
      className="flex flex-col flex-1 items-center justify-start pt-10 bg-black"
    >
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle="light-content"
      />
      {/* BACKGROUND IMAGE */}
      <Image
        className="absolute inset-0 top-0 left-0 w-full h-full scale-125 rounded-sm"
        blurRadius={25}
        source={{ uri: albumInfos.albumCover }}
      />
      {/* CARD VIEW */}
      <ScrollView
        className="w-full h-[95%] flex flex-col bg-transparent px-4"
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "flex-start",
          borderRadius: 20,
        }}
      >
        <RankAlbumCard
          viewRef={viewRef}
          albumInfos={albumInfos}
          songRanking={songRanking}
        />
      </ScrollView>
      {/* BUTTONS */}
      <View
        className="w-full h-[8%] flex-row items-center justify-center py-1"
        style={{ gap: 30 }}
      >
        {/* DOWNLOAD / SHARE BUTTON */}
        <View
          className="h-3/4 flex flex-row justify-center items-center"
          style={{ gap: 4 }}
        >
          {/* DOWNLOAD BUTTON */}
          <RankCardButton width={100} onPress={downloadImage}>
            <Text className="text-white font-bold">Download</Text>
          </RankCardButton>
          {/* SHARE BUTTON */}
          <RankCardButton width={50} onPress={shareImage}>
            <Entypo name="share" size={24} color="white" />
          </RankCardButton>
        </View>
        {/* SEPARATOR */}
        <View
          className="h-3/4"
          style={{ width: 1, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
        ></View>
        {/* BACK BUTTON */}
        <View className="h-3/4 flex flex-row justify-start items-center">
          <RankCardButton
            width={120}
            onPress={() => navigation?.navigate("Home")}
          >
            <Text className="text-white font-bold">Back Home</Text>
          </RankCardButton>
        </View>
      </View>
    </CustomSafeArea>
  );
}
