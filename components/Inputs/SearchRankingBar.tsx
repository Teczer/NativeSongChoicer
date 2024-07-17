import { ColorSchemeSystem } from "nativewind/dist/style-sheet/color-scheme";
import { TextInput, View } from "react-native";

interface Props {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  colorScheme: ColorSchemeSystem;
}

export default function SearchRankingBar({
  searchQuery,
  setSearchQuery,
  colorScheme,
}: Props) {
  return (
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
  );
}
