import {FC, useCallback, useState} from "react";
import {css} from "@emotion/react";
import {SettingsItemCard} from "./SettingsItemCard.tsx";
import {ANIMATION, MUSIC, SOUND} from "../../../common/constants.ts";

import iconSound from "../../../assets/icons/sound.svg";
import iconMusic from "../../../assets/icons/music.svg";
import iconAnimation from "../../../assets/icons/animation.svg"

const cardStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  marginBottom: 32,
})


export const MenuSettingsCard: FC = () => {

  const [isSoundActive, setIsSoundActive] = useState(true);
  const [isMusicActive, setIsMusicActive] = useState(true);
  const [isAnimationActive, setIsAnimationActive] = useState(true);



  const handleSound = useCallback(() => {
    setIsSoundActive(!isSoundActive)
  },[isSoundActive]);

  const handleMusic = useCallback(() => {
    setIsMusicActive(!isMusicActive);
  }, [isMusicActive])

  const handleAnimation = useCallback(() => {
    setIsAnimationActive(!isAnimationActive);
  }, [isAnimationActive])

  return (
    <div css={cardStyles}>
      <SettingsItemCard title={SOUND} icon={iconSound} handleChange={handleSound} value={isSoundActive} />
      <SettingsItemCard title={MUSIC} icon={iconMusic} handleChange={handleMusic} value={isMusicActive} />
      <SettingsItemCard title={ANIMATION} icon={iconAnimation} handleChange={handleAnimation} value={isAnimationActive} />
    </div>
  )
}