import {GAME_LIMITS} from "../../../common/constants.ts";
import {Modal} from "../Modal.tsx";
import {FC} from "react";
import {css} from "@emotion/react";
import {HEADER_COLOR, SUCCESS_COLOR, SUCCESS_COLOR_LIGHT, WHITE_COLOR} from "../../../styles/colors.ts";

type props = {
  handleClose: () => void
}

const styles = css({
  padding: 16,
  '& .container': {
    border: `1px solid ${HEADER_COLOR}`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 8,
    '& .item' : {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      paddingInline: 8,
      borderBottom: `1px solid ${HEADER_COLOR}`,
      fontWeight: 500,
      paddingBlock: 4,
      '& .title': {
        fontSize: 14
      },
      '& .value': {
        background: SUCCESS_COLOR_LIGHT,
        paddingInline: 8,
        paddingBlock: 2,
        borderRadius: 16,
        color: WHITE_COLOR,
        border: `1px solid ${SUCCESS_COLOR}`,
        minWidth: 32,
        textAlign: 'center'
      }
    }
  }
})

export const GameLimitsModal: FC<props> = ({handleClose}) => {
  return (
    <Modal
      title={GAME_LIMITS}
      handleClose={handleClose}
      isOpen={true}
      style={{
        position: 'fixed',
        width: '98vw',
        marginInline: '1vw'
      }}
      headerBackgroundColor={HEADER_COLOR}
      hasCloseButton={true}
    >
      <div css={styles}>
        <div className="container">
          <div className="item">
            <div className="title">Minimum bet KES:</div>
            <div className="value">5</div>
          </div>
          <div className="item">
            <div className="title">Maximum bet KES:</div>
            <div className="value">20000</div>
          </div>
          <div className="item">
            <div className="title">Maximum win for one bet KES</div>
            <div className="value">2000000</div>
          </div>
        </div>
      </div>
    </Modal>

  )
}