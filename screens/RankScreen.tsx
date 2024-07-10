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
// import { CameraRoll } from "@react-native-camera-roll/camera-roll";

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

  return (
    <CustomSafeArea className="flex flex-col flex-1 items-center justify-start pt-24 bg-black">
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <Image
        className="absolute inset-0 top-0 left-0 w-full h-full scale-125 rounded-sm"
        blurRadius={blurIntensity}
        source={{ uri: albumInfos.albumCover }}
      />
      <TouchableOpacity
        className="flex items-center justify-center absolute top-14 left-5 bg-transparent border border-neutral-300"
        onPress={() => navigation?.navigate("Home")}
        style={{ borderRadius: 10, width: 40, height: 40 }}
      >
        <Entypo style={{ ...textShadow }} name="home" size={20} color="white" />
      </TouchableOpacity>
      <ScrollView
        className="w-full h-full flex flex-col bg-transparent px-4"
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "flex-start",
          borderRadius: 20,
          paddingTop: 30,
        }}
      >
        <TouchableOpacity
          className="flex items-center justify-center absolute top-14 left-5 bg-transparent border border-neutral-300"
          onPress={() => navigation?.navigate("Home")}
          style={{ borderRadius: 10, width: 40, height: 40 }}
        >
          <Entypo
            style={{ ...textShadow }}
            name="home"
            size={20}
            color="white"
          />
        </TouchableOpacity>
        <Image
          blurRadius={5}
          className="w-full h-full absolute top-0 left-0"
          source={{ uri: albumInfos.albumCover }}
          style={{
            resizeMode: "cover",
            borderRadius: 20,
            borderWidth: 1,
            borderColor: "rgba(255, 255, 255, 0.2)",
          }}
        />
        <Text
          className="text-white font-bold text-xl mb-6 px-4 py-2 "
          style={{
            borderRadius: 5,
            backgroundColor: "rgba(0,0,0,0.5)",
            letterSpacing: 2,
          }}
        >
          {albumInfos.albumArtist} • {albumInfos.albumName}
        </Text>
        <Image
          className="w-4/5 mb-6"
          source={{ uri: albumInfos.albumCover }}
          style={{
            height: 200,
            resizeMode: "cover",
            borderRadius: 20,
          }}
        />
        <View className="flex flex-1 w-full flex-col px-6 pb-16">
          {songRanking.map((song, index) => (
            <Text
              key={index}
              className="text-dark dark:text-white font-bold text-xl mb-2 px-4 py-2 "
              style={{
                borderRadius: 8,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                letterSpacing: 2,
                borderWidth: 1,
                borderColor: "rgba(255, 255, 255, 0.2)",
              }}
            >
              {index + 1}. {song.title}
            </Text>
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity
        className="absolute bottom-10 right-10 bg-blue-500 p-4 rounded-full"
        onPress={downloadImage}
      >
        <Text className="text-white">Download</Text>
      </TouchableOpacity>
    </CustomSafeArea>
  );
}
