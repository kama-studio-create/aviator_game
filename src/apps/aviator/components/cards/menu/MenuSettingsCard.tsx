import { FC } from "react";
import { css } from "@emotion/react";
import { MenuItemCard } from "./MenuItemCard.tsx";
import { ANIMATION, MUSIC, SOUND } from "../../../common/constants.ts";

import iconSound from "../../../assets/icons/sound.svg";
import iconMusic from "../../../assets/icons/music.svg";
import iconAnimation from "../../../assets/icons/animation.svg";
import { usePreferenceStore } from "../../../data/store/zustanf/preferences.store.ts";

const cardStyles = css({
  display: "flex",
  flexDirection: "column",
  gap: 2,
  marginBottom: 24,
});

export const MenuSettingsCard: FC = () => {
  const isSoundEnabled = usePreferenceStore((state) => state.isSoundEnabled);
  const isMusicEnabled = usePreferenceStore((state) => state.isMusicEnabled);
  const isAnimationEnabled = usePreferenceStore(
    (state) => state.isAnimationEnabled,
  );

  const setSoundEnabled = usePreferenceStore((state) => state.setSoundEnabled);
  const setMusicEnabled = usePreferenceStore((state) => state.setMusicEnabled);
  const setAnimationEnabled = usePreferenceStore(
    (state) => state.setAnimationEnabled,
  );

  const handleSound = () => {
    setSoundEnabled(!isSoundEnabled);
  };

  const handleMusic = () => {
    setMusicEnabled(!isMusicEnabled);
  };

  const handleAnimation = () => {
    setAnimationEnabled(!isAnimationEnabled);
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
