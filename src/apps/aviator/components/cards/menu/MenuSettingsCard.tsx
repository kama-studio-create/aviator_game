import { FC } from "react";
import { css } from "@emotion/react";
import { MenuItemCard } from "./MenuItemCard.tsx";
import { ANIMATION, MUSIC, SOUND } from "../../../common/constants.ts";

import iconSound from "../../../assets/icons/sound.svg";
import iconMusic from "../../../assets/icons/music.svg";
import iconAnimation from "../../../assets/icons/animation.svg";
import { setAtom, useAtom } from "../../../data/store/lib/atoms.ts";
import { preferencesAtom } from "../../../data/store/atoms.ts";
import {
  IS_ANIMATION_ENABLED,
  IS_MUSIC_ENABLED,
  IS_SOUND_ENABLED,
  TPreferences,
} from "../../../data/types/types.ts";

const cardStyles = css({
  display: "flex",
  flexDirection: "column",
  gap: 2,
  marginBottom: 24,
});

export const MenuSettingsCard: FC = () => {
  const preferences: TPreferences = useAtom(preferencesAtom);
  const { isSoundEnabled, isMusicEnabled, isAnimationEnabled } = preferences;

  const setPreference = (key: string, value: boolean) => {
    const newPrefs: TPreferences = { ...preferences, [key]: value };
    setAtom(preferencesAtom, newPrefs);
  };

  const handleSound = () => {
    setPreference(IS_SOUND_ENABLED, !isSoundEnabled);
  };

  const handleMusic = () => {
    setPreference(IS_MUSIC_ENABLED, !isMusicEnabled);
  };

  const handleAnimation = () => {
    setPreference(IS_ANIMATION_ENABLED, !isAnimationEnabled);
  };

  return (
    <div css={cardStyles}>
      <MenuItemCard
        title={SOUND}
        icon={iconSound}
        handleChange={handleSound}
        value={isSoundEnabled}
      />
      <MenuItemCard
        title={MUSIC}
        icon={iconMusic}
        handleChange={handleMusic}
        value={isMusicEnabled}
      />
      <MenuItemCard
        title={ANIMATION}
        icon={iconAnimation}
        handleChange={handleAnimation}
        value={isAnimationEnabled}
      />
    </div>
  );
};
