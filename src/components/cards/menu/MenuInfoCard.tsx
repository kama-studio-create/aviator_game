import {FC, ReactNode, useEffect, useState} from "react";
import {css} from "@emotion/react";
import {MenuItemCard} from "./MenuItemCard.tsx";
import {GAME_LIMITS, GAME_RULES, MY_BET_HISTORY, PROVABLY_FAIR_SETTINGS} from "../../../common/constants.ts";
import iconShield from "../../../assets/icons/shield.svg";
import iconRules from "../../../assets/icons/rules.svg";
import iconHistory from "../../../assets/icons/history-grey.svg";
import iconLimits from "../../../assets/icons/limits.svg"
import {ProvablyFairModal} from "../../modals/menu-modals/ProvablyFairModal.tsx";
import {GameRulesModal} from "../../modals/menu-modals/GameRulesModal.tsx";
import {BetHistoryModal} from "../../modals/menu-modals/BetHistoryModal.tsx";

const cardStyles = css({
  display: "flex",
  flexDirection: "column",
  marginBlock: 1
})

type TInfoCard = {
  title: string,
  icon: string,
  onClick: () => void,
  modal: ReactNode
}


export const MenuInfoCard: FC = () => {

  const [isProvablyFairModalOpen, setIsProvablyFairModalOpen] = useState(false);
  const [isGameRulesModalOpen, setIsGameRulesModalOpen] = useState(false);
  const [isBetHistoryModalOpen, setIsBetHistoryModalOpen] = useState(false);

  useEffect(() => {
  }, [isBetHistoryModalOpen, isGameRulesModalOpen, isProvablyFairModalOpen]);


  const infoItems: TInfoCard[] = [
    {
      title: PROVABLY_FAIR_SETTINGS,
      icon: iconShield,
      onClick: () => {
        setIsProvablyFairModalOpen(!isProvablyFairModalOpen);
      },
      modal: <ProvablyFairModal isOpen={isProvablyFairModalOpen} handleClose={() => {setIsProvablyFairModalOpen(!isProvablyFairModalOpen)}}/>
    },
    {
      title: GAME_RULES,
      icon: iconRules,
      onClick: () => {
        setIsGameRulesModalOpen(true);
      },
      modal: <GameRulesModal isOpen={isGameRulesModalOpen} handleClose={() => {setIsGameRulesModalOpen(false)}}/>
    },
    {
      title: MY_BET_HISTORY,
      icon: iconHistory,
      onClick: () => {
        setIsBetHistoryModalOpen(!isBetHistoryModalOpen);
      },
      modal: <BetHistoryModal isOpen={true} handleClose={() => {setIsBetHistoryModalOpen(!isBetHistoryModalOpen)}}/>
    },
    {
      title: GAME_LIMITS,
      icon: iconLimits,
      onClick: () => {
        setIsProvablyFairModalOpen(!isProvablyFairModalOpen);
      },
      modal: <ProvablyFairModal isOpen={isProvablyFairModalOpen} handleClose={() => {setIsProvablyFairModalOpen(!isProvablyFairModalOpen)}}/>
    }
  ]
  return (
    <>
      {isProvablyFairModalOpen &&<ProvablyFairModal isOpen={true} handleClose={() => {
        setIsProvablyFairModalOpen(!isProvablyFairModalOpen)
      }}/>}
      <div onClick={() => {
        setIsProvablyFairModalOpen(!isProvablyFairModalOpen)
      }} css={cardStyles}>

        <MenuItemCard title={PROVABLY_FAIR_SETTINGS} icon={iconShield} handleChange={() => {
          setIsProvablyFairModalOpen(!isProvablyFairModalOpen)
        }}/>
      </div>
      <div onClick={() => {
        setIsGameRulesModalOpen(true);
      }} css={cardStyles}>
        <GameRulesModal isOpen={isGameRulesModalOpen} handleClose={() => {setIsGameRulesModalOpen(false)}}/>
        <MenuItemCard title={GAME_RULES} icon={iconRules} handleChange={() => {
          setIsGameRulesModalOpen(true);
        }}/>
      </div>
      <div onClick={() => {setIsBetHistoryModalOpen(!isBetHistoryModalOpen)}} css={cardStyles}>
        {isBetHistoryModalOpen && <BetHistoryModal isOpen={isBetHistoryModalOpen} handleClose={() => {
          setIsBetHistoryModalOpen(!isBetHistoryModalOpen)
        }}/>}
        <MenuItemCard title={MY_BET_HISTORY} icon={iconHistory} handleChange={() => {
          setIsBetHistoryModalOpen(!isBetHistoryModalOpen);
        }}/>
      </div>

      {/*{infoItems.map((item) => (*/}
      {/*  <div key={item.title} onClick={item.onClick} css={cardStyles}>*/}
      {/*    <MenuItemCard  title={item.title} icon={item.icon} handleChange={() => {}}/>*/}
      {/*  </div>*/}
      {/*))*/}
      {/*}*/}
    </>
  )
}