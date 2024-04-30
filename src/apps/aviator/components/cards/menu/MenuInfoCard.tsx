import { FC, useEffect, useState } from "react";
import { css } from "@emotion/react";
import { MenuItemCard } from "./MenuItemCard.tsx";
import {
  GAME_LIMITS,
  GAME_RULES,
  MY_BET_HISTORY,
  PROVABLY_FAIR_SETTINGS,
} from "../../../common/constants.ts";
import iconShield from "../../../assets/icons/shield.svg";
import iconRules from "../../../assets/icons/rules.svg";
import iconHistory from "../../../assets/icons/history-grey.svg";
import iconLimits from "../../../assets/icons/limits.svg";
import { ProvablyFairModal } from "../../modals/menu-modals/ProvablyFairModal.tsx";
import { BetHistoryModal } from "../../modals/menu-modals/BetHistoryModal.tsx";
import { GameLimitsModal } from "../../modals/menu-modals/GameLimitsModal.tsx";
import { GameRulesModal } from "../../modals/menu-modals/GameRules/GameRulesModal.tsx";

const cardStyles = css({
  display: "flex",
  flexDirection: "column",
  marginBlock: 1,
});

// type TInfoCard = {
//   title: string;
//   icon: string;
//   onClick: () => void;
//   modal: ReactNode;
// };

export const MenuInfoCard: FC = () => {
  const [isProvablyFairModalOpen, setIsProvablyFairModalOpen] = useState(false);
  const [isGameRulesModalOpen, setIsGameRulesModalOpen] = useState(false);
  const [isBetHistoryModalOpen, setIsBetHistoryModalOpen] = useState(false);
  const [isGameLimitsModalOpen, setIsGameLimitsModalOpen] = useState(false);

  useEffect(() => {}, [
    isBetHistoryModalOpen,
    isGameRulesModalOpen,
    isProvablyFairModalOpen,
  ]);

  return (
    <>
      {isProvablyFairModalOpen && (
        <ProvablyFairModal
          isOpen={true}
          handleClose={() => {
            setIsProvablyFairModalOpen(!isProvablyFairModalOpen);
          }}
        />
      )}
      {isGameRulesModalOpen && (
        <GameRulesModal
          isOpen={true}
          handleClose={() => {
            setIsGameRulesModalOpen(false);
          }}
        />
      )}
      {isBetHistoryModalOpen && (
        <BetHistoryModal
          isOpen={isBetHistoryModalOpen}
          handleClose={() => {
            setIsBetHistoryModalOpen(!isBetHistoryModalOpen);
          }}
        />
      )}
      {isGameLimitsModalOpen && (
        <GameLimitsModal
          handleClose={() => {
            setIsGameLimitsModalOpen(!isGameLimitsModalOpen);
          }}
        />
      )}
      <div
        onClick={() => {
          setIsProvablyFairModalOpen(!isProvablyFairModalOpen);
        }}
        css={cardStyles}
      >
        <MenuItemCard
          title={PROVABLY_FAIR_SETTINGS}
          icon={iconShield}
          handleChange={() => {
            setIsProvablyFairModalOpen(!isProvablyFairModalOpen);
          }}
        />
      </div>
      <div
        onClick={() => {
          setIsGameRulesModalOpen(true);
        }}
        css={cardStyles}
      >
        <MenuItemCard
          title={GAME_RULES}
          icon={iconRules}
          handleChange={() => {
            setIsGameRulesModalOpen(true);
          }}
        />
      </div>
      <div
        onClick={() => {
          setIsBetHistoryModalOpen(!isBetHistoryModalOpen);
        }}
        css={cardStyles}
      >
        <MenuItemCard
          title={MY_BET_HISTORY}
          icon={iconHistory}
          handleChange={() => {
            setIsBetHistoryModalOpen(!isBetHistoryModalOpen);
          }}
        />
      </div>
      <div
        onClick={() => {
          setIsGameLimitsModalOpen(!isGameLimitsModalOpen);
        }}
        css={cardStyles}
      >
        <MenuItemCard
          title={GAME_LIMITS}
          icon={iconLimits}
          handleChange={() => {
            setIsGameLimitsModalOpen(!isGameLimitsModalOpen);
          }}
        />
      </div>

      {/*{infoItems.map((item) => (*/}
      {/*  <div key={item.title} onClick={item.onClick} css={cardStyles}>*/}
      {/*    <MenuItemCard  title={item.title} icon={item.icon} handleChange={() => {}}/>*/}
      {/*  </div>*/}
      {/*))*/}
      {/*}*/}
    </>
  );
};
