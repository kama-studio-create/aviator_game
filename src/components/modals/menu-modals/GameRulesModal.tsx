import {FC} from "react";
import {Modal} from "../Modal.tsx";
import {GAME_RULES} from "../../../common/constants.ts";

type props = {
  isOpen: boolean,
  handleClose: () => void
}

export const GameRulesModal: FC<props> = ({isOpen, handleClose}) => {
  return (
    <Modal title={GAME_RULES} isOpen={isOpen} handleClose={handleClose}>
      Game rules
    </Modal>
  )
}