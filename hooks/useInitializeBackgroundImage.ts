import { useCallback, useEffect, useState } from "react";
import { useBackgroundImage } from "../store/useBackgroundImage";
import { getItem } from "../lib/AsyncStorage";

export const useInitializeBackgroundImage = (): string | null => {
  const [image, setImageState] = useState<string | null>("");
  const setImage = useBackgroundImage((state) => state.setImage);

  const fetchImageData = useCallback(async () => {
    const imageData = await getItem("bg-image");
    if (imageData) {
      setImage(imageData);
      setImageState(imageData);
    }
    console.log("imageData", imageData);
  }, [setImage]);

  useEffect(() => {
    fetchImageData();
  }, [fetchImageData]);

  return image;
};
