import {FC} from "react";
import {css} from "@emotion/react";
import {PillButton} from "../../components/buttons/PillButton.tsx";
import {LIGHT_GRAY_COLOR, WHITE_COLOR} from "../../styles/colors.ts";
import {rowStyles} from "../../styles/common.ts";
import {DEFAULT_CURRENCY} from "../../common/constants.ts";
import historyIcon from "../../assets/icons/history.svg";

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

const betTableStyles = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  width: '100%',
  justifyContent: 'space-between',
  paddingBlock: 8,
  '&.border-top': {
    borderBlock: `1px solid black`,
  },
  '& .title': {
    fontWeight: 500,
    fontSize: 12,
    color: LIGHT_GRAY_COLOR
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
  justifyContent: 'start',
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
  return (
    <div>
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
        <tbody style={{justifyContent: 'space-between', gap: 4}} css={rowStyles}>
          <tr style={{justifyContent: 'space-between', width: '100%'}} css={tableItem}>
            <td css={rowStyles}>
              <div className='avatar'/>
              <p className='name'>u*****e</p>
            </td>
            <td style={{justifyContent: 'center'}} css={rowStyles}>
              <div style={{textAlign: 'right'}}>2800.00</div>
              <div style={{
                paddingInline: 8,
                background: LIGHT_GRAY_COLOR,
                borderRadius: 8,
                textAlign: 'center',
                color: 'purple'
              }}>1.24
              </div>
            </td>
            <td style={{justifyContent: 'end'}} css={rowStyles}>
              <p style={{textAlign: 'right'}}>2500</p>
            </td>
          </tr>

        </tbody>
      </table>

      {/*<div className='border-top' css={betTableStyles}>*/}
      {/*  <h2 className='title'>User</h2>*/}
      {/*  <h2 className='title'>Bet {DEFAULT_CURRENCY} X</h2>*/}
      {/*  <h2 style={{textAlign: 'end'}} className='title'>Cash Out KES</h2>*/}
      {/*</div>*/}
      {/*<div css={betSlipsStyles}>*/}
      {/*  <div className='item' css={betTableStyles}>*/}
      {/*    <div css={rowStyles}>*/}
      {/*      <div className='avatar'/>*/}
      {/*      <p className='name'>u*****e</p>*/}
      {/*    </div>*/}
      {/*    <p className='name'>250000.00</p>*/}
      {/*    <p style={{textAlign: 'right'}}>1200</p>*/}
      {/*  </div>*/}

      {/*</div>*/}

    </div>
  )
}