import {FC, useEffect} from "react";
import {Modal} from "../Modal.tsx";
import {PROVABLY_FAIR_SETTINGS} from "../../../common/constants.ts";
import {BACKGROUND_COLOR, ERROR_COLOR, GRAY_COLOR, WHITE_COLOR} from "../../../styles/colors.ts";
import {css} from "@emotion/react";
import {rowStyles} from "../../../styles/common.ts";

const bodyStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  padding: 16,
  p: {
    opacity: 0.7,
    color: WHITE_COLOR
  },
  '& .error': {
    color: ERROR_COLOR,
    opacity: 0.7
  }
})

type props = {
  isOpen: boolean,
  handleClose: () => void
}

export const ProvablyFairModal: FC<props> = ({isOpen, handleClose}) => {

  useEffect(() => {
    console.log(PROVABLY_FAIR_SETTINGS, isOpen);
  }, []);
  return (
    <Modal
      title={PROVABLY_FAIR_SETTINGS}
      isOpen={true}
      handleClose={handleClose}
      style={{
        position: 'fixed',
        width: '98vw',
        marginInline: '1vw'
      }}
      headerBackgroundColor={BACKGROUND_COLOR}
      bodyBackgroundColor={GRAY_COLOR}
      hasCloseButton={true}
    >
      <div css={bodyStyles}>
        <p>This game uses Provably Fair technology to determine game result. This tool gives you ability to change your seed and check fairness of the game.</p>
        <div className='error' css={rowStyles}>
          What is Provably Fair
        </div>
      </div>
    </Modal>
  )
}