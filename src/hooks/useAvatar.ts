import {allImageUrls} from "../common/images.ts";

export const useAvatar = () => {

  const assignAvatar = (username: string) => {
    const hash = (str: string): number => {
      let hashValue = 0;
      for (let i = 0; i < str.length; i++) {
        hashValue = (str.charCodeAt(i) + ((hashValue << 5) - hashValue)) % allImageUrls.length;
      }
      return hashValue;
    };

    const avatarIndex = hash(username);

    return allImageUrls[avatarIndex];
  }

  return {
    assignAvatar
  }
}