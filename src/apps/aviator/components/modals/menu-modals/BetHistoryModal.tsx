import {FC} from "react";
import {Modal} from "../Modal.tsx";
import {MY_BET_HISTORY} from "../../../common/constants.ts";
import {MyBetsView} from "../../../views/bets/MyBetsView.tsx";

type props = {
  isOpen: boolean,
  handleClose: () => void
}

export const BetHistoryModal: FC<props> = ({isOpen, handleClose}) => {
  return (
    <Modal
      title={MY_BET_HISTORY}
      isOpen={isOpen}
      handleClose={handleClose}
      hasCloseButton={true}
      style={{
        position: 'fixed',
        width: '98vw',
        marginInline: '1vw'
      }}
    >
      <MyBetsView />
    </Modal>
  )
}