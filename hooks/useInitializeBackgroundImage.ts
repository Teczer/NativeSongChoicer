import { useCallback, useEffect, useState } from "react";
import { getItem } from "../lib/AsyncStorage";

export const useInitializeBackgroundImage = (): string | null => {
  const [image, setImageState] = useState<string | null>("");

  const fetchImageData = useCallback(async () => {
    const imageData = await getItem("bg-image");
    if (imageData) {
      setImageState(imageData);
    }
  }, []);

  useEffect(() => {
    fetchImageData();
  }, [fetchImageData]);

  console.log("image", image);
  return image;
};
