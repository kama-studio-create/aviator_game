import {FC} from "react";
import {css} from "@emotion/react";
import {MenuItemCard} from "./MenuItemCard.tsx";
import {FREE_BETS, GAME_LIMITS, GAME_RULES, MY_BET_HISTORY, PROVABLY_FAIR_SETTINGS} from "../../../common/constants.ts";

import iconStar from "../../../assets/icons/star.svg";
import iconShield from "../../../assets/icons/shield.svg";
import iconRules from "../../../assets/icons/rules.svg";
import iconHistory from "../../../assets/icons/history-grey.svg";
import iconLimits from "../../../assets/icons/limits.svg"

const cardStyles = css({
  display: "flex",
  flexDirection: "column",
  gap: 2,
})

export const MenuInfoCard: FC = () => {
  return (
    <div css={cardStyles}>
      <MenuItemCard title={FREE_BETS} icon={iconStar} handleChange={() => {}}/>
      <MenuItemCard title={PROVABLY_FAIR_SETTINGS} icon={iconShield} handleChange={() => {}}/>
      <MenuItemCard title={GAME_RULES} icon={iconRules} handleChange={() => {}}/>
      <MenuItemCard title={MY_BET_HISTORY} icon={iconHistory} handleChange={() => {}}/>
      <MenuItemCard title={GAME_LIMITS} icon={iconLimits} handleChange={() => {}}/>
    </div>
  )
}