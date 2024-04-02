import {allImages} from "../../common/images.ts";
import {useEffect, useState} from "react";

export const useImages = () => {

  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const promises = allImages.map(image => {
      return new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
      });
    });

    Promise.all(promises)
      .then(() => setImagesLoaded(true))
      .catch(error => console.error('Error loading images:', error));
  }, [allImages]);

  return imagesLoaded;

}