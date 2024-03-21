import {allImages} from "../common/images.ts";


type resizeProps = {
  canvasWidth: number;
  canvasHeight: number;
}
export const useImages = () => {

  const resizeImages = (measurements: resizeProps) => {}

  const loadImages = () => {

    return new Promise((resolve, reject) => {
      let loadedImagesCount = 0;

      const onImageLoad = () => {
        loadedImagesCount++;

        if (loadedImagesCount === allImages.length) {
          resolve(allImages);
        }
      };

      const onImageError = (error: ErrorEvent) => {
        reject(error);
      }

      allImages.forEach(image => {
        image.addEventListener('load', onImageLoad);
        image.addEventListener('error', onImageError);
      });
    });
  }
	
  return {loadImages, resizeImages}

}