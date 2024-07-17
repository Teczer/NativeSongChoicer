import { TouchableOpacity } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";

interface Props {
  showAlert: () => void;
}

export default function DeleteSelectedAlbumsButton({ showAlert }: Props) {
  return (
    <TouchableOpacity
      onPress={showAlert}
      className="flex flex-row items-center p-2"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        borderRadius: 6,
      }}
    >
      <Feather name="trash-2" size={24} color="white" />
    </TouchableOpacity>
  );
}
