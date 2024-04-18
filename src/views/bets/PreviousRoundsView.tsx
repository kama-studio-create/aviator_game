import {FC, useState} from "react";
import {css} from "@emotion/react";
import {MultiplierBadge} from "../../components/badges/MultiplierBadge.tsx";
import {PreviousHandButton} from "../../components/buttons/PreviousHandButton.tsx";
import {PreviousRoundsModal} from "../../components/modals/PreviousRoundsModal.tsx";
import {useBetSlipStore} from "../../store/bets.store.ts";

const containerStyles = css({
  display: 'flex',
  gap: 8,
  maxWidth: '100vw',
  justifyContent: 'end',
  position: 'relative',
  fontSize: 12,
  alignItems: 'center',
  paddingBlock: 4
})

const multiplierStyles = css({
  position: 'absolute',
  top: 6,
  left: 0,
  overflowX: 'hidden',
  width: '90%',
  height: 'auto',
})

export const PreviousRoundsView: FC = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const previousRounds = useBetSlipStore(state => state.previousRounds);

  const handleModalOpen = () => {
    setIsModalOpen(!isModalOpen);
  }
  return (
    <div css={containerStyles}>
      {isModalOpen && <PreviousRoundsModal/>}
      <div css={multiplierStyles}>
        {previousRounds.slice(0, 9).map((round) => (
          <MultiplierBadge key={round} multiplier={round} />
        ))}
      </div>
      <PreviousHandButton onClick={handleModalOpen} isActive={isModalOpen} />
    </div>
  )
}