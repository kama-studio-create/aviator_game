import { FC } from "react";
import { css } from "@emotion/react";
import { MultiplierBadge } from "../badges/MultiplierBadge.tsx";
import { useBetSlipStore } from "../../store/bets.store.ts";
import { Modal } from "./Modal.tsx";
import { GRAY_COLOR, HEADER_COLOR } from "../../styles/colors.ts";
import { ROUND_HISTORY } from "../../common/constants.ts";

const modalStyles = css({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "auto",
  backgroundColor: "#262830",
  zIndex: 101,
  borderRadius: 16,
});

const roundsContainerStyles = css({
  display: "flex",
  justifyContent: "start",
  width: "100%",
  flexWrap: "wrap",
  gap: 4,
  padding: 8,
});

type props = {
  onSelect: (round: number) => void;
  isOpen: boolean;
  handleClose: () => void;
};

export const PreviousRoundsModal: FC<props> = ({
  onSelect,
  isOpen,
  handleClose,
}) => {
  const previousRounds = useBetSlipStore((state) => state.previousRounds);
  const handleSelect = (round: number) => {
    onSelect(round);
  };
  return (
    <div css={modalStyles}>
      <Modal
        title={ROUND_HISTORY}
        handleClose={handleClose}
        isOpen={isOpen}
        style={{ top: -4, padding: 0, justifyContent: "end" }}
        headerBackgroundColor={GRAY_COLOR}
        bodyBackgroundColor={HEADER_COLOR}
      >
        <div css={roundsContainerStyles}>
          {previousRounds.slice(0, 60).map((round) => (
            <MultiplierBadge
              onClick={() => {
                handleSelect(round);
              }}
              key={round}
              multiplier={round}
            />
          ))}
        </div>
      </Modal>
    </div>
  );
};
