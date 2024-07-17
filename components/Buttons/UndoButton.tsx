import { TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface Props {
  handleUndo: () => void;
  currentDuelIndex: number; // Added currentDuelIndex to Props interface
}

export default function UndoButton({ handleUndo, currentDuelIndex }: Props) {
  return (
    <TouchableOpacity
      style={{ borderRadius: 10, width: 44, height: 44, top: 42 }}
      onPress={handleUndo}
      className={`flex items-center justify-center absolute right-6 bg-transparent border-2 border-neutral-300${
        currentDuelIndex > 0 ? "" : " opacity-50"
      }`}
    >
      <FontAwesome
        style={{
          textShadowColor: "black",
          textShadowOffset: { width: 0.5, height: 0.5 },
          textShadowRadius: 4,
        }}
        name="undo"
        size={20}
        color="white"
      />
    </TouchableOpacity>
  );
}
