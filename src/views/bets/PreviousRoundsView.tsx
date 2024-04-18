import {FC, useState} from "react";
import {css} from "@emotion/react";
import {MultiplierBadge} from "../../components/badges/MultiplierBadge.tsx";
import {PreviousHandButton} from "../../components/buttons/PreviousHandButton.tsx";
import {PreviousRoundsModal} from "../../components/modals/PreviousRoundsModal.tsx";

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

  const handleModalOpen = () => {
    setIsModalOpen(!isModalOpen);
  }
  return (
    <div css={containerStyles}>
      {isModalOpen && <PreviousRoundsModal/>}
      <div css={multiplierStyles}>
        <MultiplierBadge multiplier={1.35} />
        <MultiplierBadge multiplier={2.6} />
        <MultiplierBadge multiplier={8.33} />
        <MultiplierBadge multiplier={1.35} />
        <MultiplierBadge multiplier={2.6} />
        <MultiplierBadge multiplier={8.33} />
        <MultiplierBadge multiplier={8.33} />
        <MultiplierBadge multiplier={8.33} />
        <MultiplierBadge multiplier={8.33} />
      </div>
      <PreviousHandButton onClick={handleModalOpen} isActive={isModalOpen} />
    </div>
  )
}