import { Image, StatusBar, Text, TouchableOpacity, View } from "react-native";

import { textShadow } from "../lib/styles";
import { useCustomBlurIntensity } from "../store/useCustomBlurPreference";
import { ScrollView } from "react-native-gesture-handler";

import CustomSafeArea from "../components/CustomSafeArea";
import { Entypo } from "@expo/vector-icons";
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

  return (
    <CustomSafeArea className="flex flex-col flex-1 items-center justify-start pt-24 bg-black">
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
      {/* BACK HOME BUTTON */}
      <TouchableOpacity
        className="flex items-center justify-center absolute top-14 left-5 bg-transparent border border-neutral-300"
        onPress={() => navigation?.navigate("Home")}
        style={{ borderRadius: 10, width: 40, height: 40 }}
      >
        <Entypo
          style={{
            ...textShadow,
          }}
          name="home"
          size={20}
          color="white"
        />
      </TouchableOpacity>
      {/* CARD VIEW */}
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
            style={{
              ...textShadow,
            }}
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
    </CustomSafeArea>
  );
}
