import { TouchableOpacity } from "react-native";

interface Props {
  width: number;
  onPress: () => void;
  children: React.ReactNode;
}

export default function RankCardButton({ width, onPress, children }: Props) {
  return (
    <TouchableOpacity
      className="flex h-full items-center justify-center"
      style={{
        width: width,
        borderWidth: 1,
        borderRadius: 6,
        borderColor: "rgba(255, 255, 255, 0.2)",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
      }}
      onPress={onPress}
    >
      {children}
    </TouchableOpacity>
  );
}
