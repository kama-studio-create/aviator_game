import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

type TPreferences = {
  isSoundEnabled: boolean;
  isMusicEnabled: boolean;
  isAnimationEnabled: boolean;
  setSoundEnabled: (s: boolean) => void;
  setMusicEnabled: (s: boolean) => void;
  setAnimationEnabled: (s: boolean) => void;
};

export const usePreferenceStore = create<TPreferences>()(
  devtools(
    persist(
      (set) => ({
        isSoundEnabled: true,
        isMusicEnabled: true,
        isAnimationEnabled: true,
        setSoundEnabled: (s: boolean) => {
          set({ isSoundEnabled: s });
        },
        setMusicEnabled: (s: boolean) => {
          set({ isMusicEnabled: s });
        },
        setAnimationEnabled: (s: boolean) => {
          set({ isAnimationEnabled: s });
        },
      }),
      { name: "preferences", storage: createJSONStorage(() => sessionStorage) },
    ),
  ),
);
