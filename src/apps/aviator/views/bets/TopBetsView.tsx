import {FC} from "react";
import {css} from "@emotion/react";
import {Tab, Tabs} from "../../components/tabs/Tabs.tsx";
import {rowStyles} from "../../styles/common.ts";
import {DEFAULT_CURRENCY} from "../../common/constants.ts";
import {DARK_GRAY_COLOR, LIGHT_GRAY_COLOR} from "../../styles/colors.ts";
import {censor} from "../../utils/censor.ts";

const containerStyles = css({
  display: 'flex',
  flexDirection: 'column',
  paddingBlock: 8,

  h1: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 400
  }
})

const cardStyles = css([
  rowStyles,
  {
    justifyContent: 'space-around',
    fontSize: 12,
    backgroundColor: DARK_GRAY_COLOR,
    borderRadius: 4,
    padding: 8,
    '& .avatar': {
      width: 40,
      height: 40,
      borderRadius: '50%',
      backgroundColor: 'white'
    },
  }
])
const cardFooterStyles = css([
  rowStyles,
  {
    justifyContent: 'space-between',
    gap: 4,
    background: 'black',
    paddingInline: 8,
    paddingBlock: 4,
    fontSize: 12,
    p: {
      opacity: 0.7,
      '&.multiplier': {
        opacity: 1,
        fontWeight: 600
      }
    },
    '& .pill': {
      paddingInline: 16,
      borderRadius: 8,
      background: DARK_GRAY_COLOR,
      border: `1px solid ${LIGHT_GRAY_COLOR}`,
      height: '100%',
      color: DARK_GRAY_COLOR,

    }
  }
])

const betDetails = css({
  textAlign: 'center',
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  justifyContent: 'space-around',
  fontSize: 12,
  fontWeight: 400,
  gap: 4,
  '& .title': {

    textAlign: 'right',
    opacity: 0.5
  },
  '& .value': {
    textAlign: 'left',
    fontWeight: 600
  },
  '& .multiplier': {
    paddingInline: 8,
    background: 'black',
    color: 'purple',
    fontSize: 12,
    textAlign: 'center',
    borderRadius: 8,
    fontWeight: 900
  }
})


const TopBetSlips: FC = () => {
  return (
    <div css={containerStyles}>
      <div css={cardStyles}>
        <div style={{display: 'grid', placeContent: 'center'}}>
          <div className='avatar'></div>
          <p style={{opacity: 0.7, textAlign: 'center'}}>{censor('daniel')}</p>
        </div>
        <div css={betDetails}>
          <p className='title'>Bet {DEFAULT_CURRENCY}: </p>
          <p className='value'>19.38</p>
          <p className='title'>Cashed out: </p>
          <p className='value multiplier'>198998.38x</p>
          <p className='title'>Win {DEFAULT_CURRENCY}: </p>
          <p className='value'>300,900</p>
        </div>
        <div></div>
      </div>
      <div css={cardFooterStyles}>
        <div css={rowStyles}>
          <p>11 Apr</p>
          <div style={{justifyContent: 'left', gap: 4}} css={rowStyles}>
            <p>Round: </p>
            <p className='multiplier'>2098989.5x</p>
          </div>
        </div>
        <div className='pill'>test</div>
      </div>
    </div>
  )
}

const tabs: Tab[] = [
  {
    label: 'Day',
    component: <TopBetSlips/>
  },
  {
    label: 'Month',
    component: <TopBetSlips/>
  }, {
    label: 'Year',
    component: <TopBetSlips/>
  },
]
export const TopBetsView: FC = () => {
  return (
    <div css={containerStyles}>
      <h1>HUGE WINS BIGGEST WIN MULTIPLIERS</h1>
      <Tabs tabs={tabs}/>
    </div>
  )
}