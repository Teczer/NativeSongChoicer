import { useRef } from "react";
import {
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Alert,
  PermissionsAndroid,
  Platform,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import CustomSafeArea from "../components/CustomSafeArea";
import { Entypo } from "@expo/vector-icons";
import { captureRef } from "react-native-view-shot";
import { useCustomBlurIntensity } from "../store/useCustomBlurPreference";
import { textShadow } from "../lib/styles";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import Share from "react-native-share";

interface ParamsProps {
  songRanking: any[];
  albumInfos: {
    albumName: string;
    albumArtist: string;
    albumCover: string;
  };
}

export default function RankScreen({ route, navigation }: NavigationProps) {
  const { songRanking, albumInfos }: ParamsProps = route.params;
  const { blurIntensity } = useCustomBlurIntensity();
  const viewRef = useRef();

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

      const image = CameraRoll.save(uri, "photo");
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
        blurRadius={blurIntensity}
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
              borderColor: "rgba(255, 255, 255, 0.2)",
            }}
          />
          {/* BLANK SPACE */}
          <View className="h-10 bg-transparent"></View>
          {/* ALBUM NAME + ARTIST */}
          <Text
            className="text-white font-bold text-xl mb-6 px-4 py-2"
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
            {songRanking.map((song, index) => (
              <Text
                key={index}
                className="text-white font-bold text-lg mb-2 px-4"
                style={{
                  paddingTop: 6,
                  paddingBottom: 6,
                  borderRadius: 8,
                  backgroundColor: "rgba(0, 0, 0, 0.4)",
                  letterSpacing: 2,
                  borderWidth: 1,
                  borderColor: "rgba(255, 255, 255, 0.2)",
                }}
              >
                {index + 1}. {song.title}
              </Text>
            ))}
            {/* SONG CHOICER MARK */}
            <View className="w-full flex justify-center items-center mt-4">
              <Text
                className="w-2/3 text-white text-center font-bold text-sm mb-2 px-4 py-1"
                style={{
                  borderRadius: 8,
                  backgroundColor: "rgba(0, 0, 0, 0.4)",
                  letterSpacing: 2,
                  borderWidth: 1,
                  borderColor: "rgba(255, 255, 255, 0.2)",
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
        style={{ gap: 10 }}
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
