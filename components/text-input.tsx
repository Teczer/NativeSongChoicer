import { useColorScheme } from "nativewind";
import { useState } from "react";
import {
  TextInput as DefaultTextInput,
  Platform,
  TextInputProps,
} from "react-native";
import tailwind from "twrnc";

export const TextInput = ({
  placeholderTextColor,
  ...props
}: TextInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const { colorScheme } = useColorScheme();

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleEndEditing = () => {
    setIsFocused(false);
  };

  return (
    <DefaultTextInput
      {...props}
      onFocus={handleFocus}
      onEndEditing={handleEndEditing}
      style={[
        tailwind`w-full bg-neutral-100 dark:bg-neutral-900 rounded-md h-12 px-4 text-neutral-950 dark:text-neutral-50`,
        isFocused && Platform.OS !== "web" ? tailwind`border-white` : null,
        props.style,
      ]}
      placeholderTextColor={
        placeholderTextColor || colorScheme === "light"
          ? tailwind.color("text-neutral-500")
          : tailwind.color("text-neutral-300")
      }
    />
  );
};
