import {FC} from "react";
import {rowStyles} from "../../styles/common.ts";
import {DEFAULT_CURRENCY} from "../../common/constants.ts";
import {css} from "@emotion/react";
import messageIcon from '../../assets/icons/message.svg'

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
    justifyContent: 'space-between'
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
          <tr>
            <td>16:15</td>
            <td>
              <div style={{textAlign: 'left'}} css={rowStyles}>
                <p>5.00</p>
                <p>1.81x</p>
              </div>
            </td>
            <td>
              <div style={{justifyContent: 'end'}} css={rowStyles}>
                <img width={16} height={16} src={messageIcon} alt='history'/>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}