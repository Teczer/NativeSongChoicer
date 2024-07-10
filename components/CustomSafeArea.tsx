import { Platform, SafeAreaView, View } from "react-native";

interface Props {
  style?: any;
  children: React.ReactNode;
  onlyBottom?: boolean;
  onlyTop?: boolean;
  className?: string; // Ajout de la propriété className
}

export default function CustomSafeArea({
  style,
  children,
  onlyBottom = false,
  onlyTop = false,
  ...props
}: Props) {
  return (
    <SafeAreaView style={style} {...props}>
      {!onlyBottom && Platform.OS !== "ios" && <View style={{ height: 20 }} />}
      {children}
      {!onlyTop && Platform.OS !== "ios" && <View style={{ height: 20 }} />}
    </SafeAreaView>
  );
}
