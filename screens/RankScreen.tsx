import { Button, Image, StatusBar, Text, View } from "react-native";

import CustomSafeArea from "../components/CustomSafeArea";

import { useBackgroundImage } from "../store/useBackgroundImage";
import { useCustomBlurIntensity } from "../store/useCustomBlurPreference";
import { ScrollView } from "react-native-gesture-handler";

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

  const { image } = useBackgroundImage();
  const { blurIntensity } = useCustomBlurIntensity();

  return (
    <CustomSafeArea className="flex flex-col flex-1 items-center justify-start pt-10">
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <Image
        className="absolute inset-0 top-0 left-0 w-full h-full scale-125 rounded-sm"
        blurRadius={blurIntensity}
        source={{
          uri:
            image ||
            "https://www.rover.com/blog/wp-content/uploads/white-cat-min-960x540.jpg",
        }}
      />
      <Text className="text-dark dark:text-white font-bold text-2xl mb-10">
        Ranking of {albumInfos.albumArtist} {albumInfos.albumName}
      </Text>
      <ScrollView className="flex flex-1 w-4/5 flex-col">
        {songRanking.map((song, index) => (
          <View key={index}>
            <Text className="text-black dark:text-white font-bold text-2xl mb-10">
              #{index + 1} {song.title} {song.eloScore.toFixed(0)}
            </Text>
          </View>
        ))}
      </ScrollView>
      <Button title="Back Home" onPress={() => navigation.navigate("Main")} />
    </CustomSafeArea>
  );
}
