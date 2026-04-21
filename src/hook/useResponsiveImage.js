// useResponsiveImage.js
import { useState, useEffect } from "react";
import { getResponsiveImageUrl } from "../assets/scripts/libs/getImageUrl";

export function useResponsiveImage(image, context) {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    // Vérifier que l'image existe et a au moins une propriété url ou formats
    if (!image || (!image.url && !image.formats)) {
      setImageUrl(null);
      return;
    }

    const updateImage = () => {
      const width = window.innerWidth;
      const url = getResponsiveImageUrl(image, context, width);
      setImageUrl(url);
    };

    updateImage();
    window.addEventListener("resize", updateImage);

    return () => window.removeEventListener("resize", updateImage);
  }, [image, context]);

  return imageUrl;
}
