import { TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";

import { textShadow } from "../lib/styles";

export default function BackButton({ handleBack }: { handleBack: () => void }) {
  return (
    <TouchableOpacity
      style={{ borderRadius: 10, width: 40, height: 40 }}
      onPress={handleBack}
      className="flex items-center justify-center absolute top-14 left-6 bg-transparent"
    >
      <Entypo
        style={{ ...textShadow }}
        name="chevron-left"
        size={36}
        color="white"
      />
    </TouchableOpacity>
  );
}
