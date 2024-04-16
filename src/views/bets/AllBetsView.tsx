import {FC} from "react";
import {css} from "@emotion/react";
import {PillButton} from "../../components/buttons/PillButton.tsx";
import {DARK_GRAY_COLOR, LIGHT_GRAY_COLOR, SUCCESS_COLOR, WHITE_COLOR} from "../../styles/colors.ts";
import {rowStyles} from "../../styles/common.ts";
import {DEFAULT_CURRENCY} from "../../common/constants.ts";
import historyIcon from "../../assets/icons/history.svg";
import {censor} from "../../utils/censor.ts";
import {useBetSlipStore} from "../../store/bets.store.ts";

const headerStyles = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBlock: 8,
  flexDirection: 'row',
  h1: {
    fontSize: 14,
    fontWeight: 400
  },
  '& .button': {
    fontWeight: 500,
    fontSize: 12,
    background: 'transparent',
    border: `1px solid ${LIGHT_GRAY_COLOR}`,
    color: LIGHT_GRAY_COLOR,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingInline: 8,
    paddingBlock: 2,
    gap: 8,
    img: {
      opacity: 0.5,
    }
  }
})

const tableItem = css({
  width: '100%',
  fontSize: 12,
  fontWeight: 400,
  color: WHITE_COLOR,
  backgroundColor: 'black',
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingBlock: 2,
  padding: 8,
  borderRadius: 8,
  '& .avatar': {
    width: 24,
    height: 24,
    background: 'white',
    borderRadius: '50%',
    border: `1px solid ${LIGHT_GRAY_COLOR}`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  '& .name': {
    fontSize: 12,
    fontWeight: 400,
    color: WHITE_COLOR,
    opacity: 0.5
  }
},)


export const AllBetsView: FC = () => {

  const allBets = useBetSlipStore(state => state.allBetSlips);
  return (
    <div style={{}}>
      <div css={headerStyles}>
        <div>
          <h1>All Bets</h1>
          <h1>4590</h1>
        </div>
        <div>
          <PillButton className='button' variant="success">
            <img width={16} height={16} src={historyIcon} alt='history'/>
            Previous hand</PillButton>
        </div>
      </div>
      <table style={{width: '100%', fontSize: 12, fontWeight: 400}}>
        <thead>
          <tr style={{justifyContent: 'space-between', paddingInline: 4}} css={rowStyles}>
            <th css={rowStyles}>User</th>
            <th style={{justifyContent: 'start'}} css={rowStyles}>
              <div>Bet {DEFAULT_CURRENCY}</div>
              <div>X</div>
            </th>
            <th css={rowStyles}>Cash Out {DEFAULT_CURRENCY}</th>
          </tr>
        </thead>
        <tbody style={{
          justifyContent: 'space-between',
          gap: 4,
          flexDirection: 'column',
          maxHeight: '50vh',
          overflowY: 'scroll'
        }} css={rowStyles}>
          {allBets.map((betSlip) => (
            <tr key={betSlip.username} style={{backgroundColor: betSlip.exitTime ? SUCCESS_COLOR : 'black'}}
              css={tableItem}>
              <td css={rowStyles}>
                <div className='avatar'/>
                {betSlip.username && <p className='name'>{censor(betSlip.username)}</p>}
              </td>
              <td style={{justifyContent: 'center'}} css={rowStyles}>
                <div style={{textAlign: 'right'}}>{betSlip.amount.toFixed(2)}</div>
                <div style={{
                  paddingInline: 8,
                  background: DARK_GRAY_COLOR,
                  borderRadius: 8,
                  textAlign: 'center',
                  color: 'purple',
                  fontWeight: 600
                }}>1.24
                </div>
              </td>
              <td style={{justifyContent: 'end'}} css={rowStyles}>
                <p style={{textAlign: 'right'}}>2500</p>
              </td>
            </tr>
          ))}

        </tbody>
      </table>


    </div>
  )
}