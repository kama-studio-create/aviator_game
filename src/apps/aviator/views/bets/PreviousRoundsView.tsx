import { FC, useState } from "react";
import { css } from "@emotion/react";
import { MultiplierBadge } from "../../components/badges/MultiplierBadge.tsx";
import { PreviousHandButton } from "../../components/buttons/PreviousHandButton.tsx";
import { PreviousRoundsModal } from "../../components/modals/PreviousRoundsModal.tsx";
import { useBetSlipStore } from "../../data/store/zustanf/bets.store.ts";
import { SingleRoundModal } from "../../components/modals/SingleRoundModal.tsx";

const containerStyles = css({
  display: "flex",
  gap: 8,
  maxWidth: "100vw",
  justifyContent: "end",
  position: "relative",
  fontSize: 12,
  alignItems: "center",
  paddingBlock: 4,
});

const multiplierStyles = css({
  position: "absolute",
  top: 6,
  left: 0,
  overflowX: "hidden",
  width: "90%",
  height: "auto",
  transition: "all 0.6s ease-in-out",
});

export const PreviousRoundsView: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRoundModalOpen, setIsRoundModalOpen] = useState(false);
  const [selectedRound, setSelectedRound] = useState(0);
  const previousRounds = useBetSlipStore((state) => state.previousRounds);

  const handleModalOpen = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSelectRound = (round: number) => {
    setSelectedRound(round);
    setIsRoundModalOpen(true);
    if (isModalOpen) {
      handleModalOpen();
    }
  };
  return (
    <div css={containerStyles}>
      <PreviousRoundsModal
        handleClose={handleModalOpen}
        isOpen={isModalOpen}
        onSelect={handleSelectRound}
      />
      {isRoundModalOpen && (
        <SingleRoundModal
          multiplier={selectedRound}
          close={() => {
            setIsRoundModalOpen(false);
          }}
        />
      )}
      <div css={multiplierStyles}>
        {previousRounds.slice(0, 9).map((round) => (
          <MultiplierBadge
            onClick={() => {
              handleSelectRound(round);
            }}
            key={round}
            multiplier={round}
          />
        ))}
      </div>
      <PreviousHandButton onClick={handleModalOpen} isActive={isModalOpen} />
    </div>
  );
};
