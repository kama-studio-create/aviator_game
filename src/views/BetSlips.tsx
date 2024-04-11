import {FC} from "react";
import {Tab, Tabs} from "../components/tabs/Tabs.tsx";
import {css} from "@emotion/react";
import {GRAY_COLOR} from "../styles/colors.ts";
import {AllBetsView} from "./bets/AllBetsView.tsx";
import {MyBetsView} from "./bets/MyBetsView.tsx";
import {TopBetsView} from "./bets/TopBetsView.tsx";

const container = css({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: GRAY_COLOR,
  padding: 8,
  gap: 4,
  borderRadius: 8,
})

const tabs: Tab[] = [
  {
    label: 'All Bets',
    component: <AllBetsView/>
  },
  {
    label: 'My Bets',
    component: <MyBetsView/>
  },
  {
    label: 'Top',
    component: <TopBetsView/>
  }
]
export const BetSlips: FC = () => {

  return (
    <div css={container}>
      <Tabs tabs={tabs}/>
    </div>
  )
}