import {FC} from "react";
import {rowStyles} from "../../styles/common.ts";
import {DEFAULT_CURRENCY} from "../../common/constants.ts";
import {css} from "@emotion/react";
import messageIcon from '../../assets/icons/message.svg'
import {TBetSlip, useBetSlipStore} from "../../store/bets.store.ts";
import {getMultiplier} from "../../utils/getMultiplier.ts";
import {SUCCESS_COLOR, SUCCESS_COLOR_LIGHT} from "../../styles/colors.ts";

const betTableStyles = css({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  thead: {
    width: '100%',
    marginBottom: 4
  },
  tr: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    justifyContent: 'space-between',
    transition: 'all 0.2s ease-in-out',
  },
  th: {
    fontSize: 12,
    opacity: 0.6,
    fontWeight: 400,
    textAlign: 'start'
  },
  tbody: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    gap: 4,
    maxHeight: '50vh',
    overflowY: 'scroll',
    tr: {
      background: 'black',
      padding: 8,
      alignItems: 'center',
      fontSize: 12,
      textAlign: 'left',
      borderRadius: 8
    }
  }
})

export const MyBetsView: FC = () => {

  const myBetSlips = useBetSlipStore(state => state.myBetSlips);

  const getBetTime = (slip: TBetSlip) => {
    if (!slip.startTime) return '';
    const date = new Date(slip.startTime);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric'
    })
  }

  const getSlipMultiplier = (slip: TBetSlip): string => {
    if (slip.exitTime && slip.startTime) {
      return getMultiplier(slip.startTime, slip.exitTime).toFixed(2);
    }
    if (slip.endTime && slip.startTime) {
      return getMultiplier(slip.startTime, slip.endTime).toFixed(2);
    } else {
      return "";
    }
  }

  return (
    <div>
      <table css={betTableStyles}>
        <thead>
          <tr>
            <th>Date</th>
            <th>
              <div css={rowStyles}>
                <p>Bet {DEFAULT_CURRENCY}</p>
                <p>X</p>
              </div>
            </th>
            <th style={{textAlign: 'end'}}>Cash Out {DEFAULT_CURRENCY}</th>
          </tr>
        </thead>
        <tbody>
          {myBetSlips.map((slip, index) => (
            <tr style={{
              backgroundColor: slip.exitTime ? SUCCESS_COLOR_LIGHT : 'black',
              border: `1px solid ${slip.exitTime ? SUCCESS_COLOR : 'black'}`,
              backgroundBlendMode: slip.exitTime ? 'color' : 'normal'
            }} key={index}>
              <td>{getBetTime(slip)}</td>
              <td>
                <div style={{textAlign: 'left'}} css={rowStyles}>
                  <p>{slip.amount.toFixed(2)}</p>
                  {slip.exitTime && <p>{getSlipMultiplier(slip)}x</p>}
                </div>
              </td>
              <td>
                <div style={{justifyContent: 'end'}} css={rowStyles}>
                  {slip.exitTime && <p>{(slip.amount * Number(getSlipMultiplier(slip))).toFixed(2)}</p>}
                  <img width={16} height={16} src={messageIcon} alt='history'/>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}