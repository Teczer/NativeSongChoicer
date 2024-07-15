import { useEffect, useRef } from "react";

import { captureRef } from "react-native-view-shot";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import Share from "react-native-share";

import { ScrollView } from "react-native-gesture-handler";
import {
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Alert,
  PermissionsAndroid,
  Platform,
  BackHandler,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import CustomSafeArea from "../components/CustomSafeArea";
import { storage } from "../lib/mmkv";
interface ParamsProps {
  songRanking: any[];
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

  const getPermissionAndroid = async () => {
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
  };

  const downloadImage = async () => {
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
  };

  const shareImage = async () => {
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
  };

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
        <View
          ref={viewRef}
          className="w-full h-full flex flex-col bg-transparent"
          style={{
            alignItems: "center",
            justifyContent: "flex-start",
            borderRadius: 20,
          }}
        >
          {/* BLUR BACKGROUND IMAGE */}
          <Image
            blurRadius={6}
            className="w-full h-full absolute top-0 left-0"
            source={{ uri: albumInfos.albumCover }}
            style={{
              resizeMode: "cover",
              borderRadius: 20,
              borderWidth: 1,
              borderColor: "rgba(255, 255, 255, 0.1)",
            }}
          />
          {/* BLANK SPACE */}
          <View className="h-10 bg-transparent"></View>
          {/* ALBUM NAME + ARTIST */}
          <Text
            className="text-white font-mono_bold text-xl mb-6 px-4 py-2"
            style={{
              borderRadius: 5,
              backgroundColor: "rgba(0,0,0,0.5)",
              letterSpacing: 2,
            }}
          >
            {albumInfos.albumArtist} • {albumInfos.albumName}
          </Text>
          <Image
            className="mb-6"
            source={{ uri: albumInfos.albumCover }}
            style={{
              width: 300,
              height: 300,
              resizeMode: "contain",
              borderRadius: 20,
            }}
          />
          <View className="flex flex-1 w-full flex-col px-6 pb-6">
            {songRanking.map((song, index) => {
              const widthPercentage =
                index === 0
                  ? "100%"
                  : index === 1
                  ? "95%"
                  : index === 2
                  ? "90%"
                  : "80%";
              return (
                <Text
                  key={index}
                  className="text-white font-mono_bold text-base mb-2 px-4"
                  style={{
                    width: widthPercentage,
                    paddingTop: 6,
                    paddingBottom: 6,
                    borderRadius: 8,
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                    letterSpacing: 2,
                    borderWidth: 1,
                    borderColor: "rgba(255, 255, 255, 0.1)",
                  }}
                >
                  {index + 1}. {song.title}
                </Text>
              );
            })}
            {/* SONG CHOICER MARK */}
            <View className="w-full flex justify-center items-center mt-4">
              <Text
                className="w-2/3 text-white text-center font-mono text-sm mb-2 px-4 py-1"
                style={{
                  borderRadius: 8,
                  backgroundColor: "rgba(0, 0, 0, 0.4)",
                  letterSpacing: 2,
                  borderWidth: 1,
                  borderColor: "rgba(255, 255, 255, 0.1)",
                }}
              >
                songchoicer.com
              </Text>
            </View>
          </View>
        </View>
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
          <TouchableOpacity
            className="flex h-full items-center justify-center"
            style={{
              width: 100,
              borderWidth: 1,
              borderRadius: 6,
              borderColor: "rgba(255, 255, 255, 0.2)",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
            }}
            onPress={downloadImage}
          >
            <Text className="text-white font-bold">Download</Text>
          </TouchableOpacity>
          {/* SHARE BUTTON */}
          <TouchableOpacity
            className="flex h-full items-center justify-center"
            style={{
              width: 50,
              borderWidth: 1,
              borderRadius: 6,
              borderColor: "rgba(255, 255, 255, 0.2)",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
            }}
            onPress={shareImage}
          >
            <Entypo name="share" size={24} color="white" />
          </TouchableOpacity>
        </View>
        {/* SEPARATOR */}
        <View
          className="h-3/4"
          style={{ width: 1, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
        ></View>
        {/* BACK BUTTON */}
        <View className="h-3/4 flex flex-row justify-start items-center">
          <TouchableOpacity
            className="flex h-full items-center justify-center"
            style={{
              width: 120,
              borderWidth: 1,
              borderRadius: 6,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              borderColor: "rgba(255, 255, 255, 0.2)",
            }}
            onPress={() => navigation?.navigate("Home")}
          >
            <Text className="text-white font-bold">Back Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </CustomSafeArea>
  );
}
