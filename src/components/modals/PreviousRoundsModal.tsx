import {FC} from "react";
import {css} from "@emotion/react";
import {MultiplierBadge} from "../badges/MultiplierBadge.tsx";

const modalStyles = css({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: 'auto',
  backgroundColor: '#262830',
  zIndex: 101,
  borderRadius:16,
  transition: 'all 0.3s ease-in-out',
})
const headerStyles = css({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  padding: 8,
  background: '#1f2128',
  h1: {
    fontSize: 14,
    fontWeight: 400
  }
})
const roundsContainerStyles = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(6, 1fr)',
  justifyContent: 'space-evenly',
  gap: 4,
  padding: 8,
})

export const PreviousRoundsModal: FC = () => {
  return (
    <div css={modalStyles}>
      <div css={headerStyles} >
        <h1>ROUND HISTORY</h1>
      </div>
      <div css={roundsContainerStyles}>
        <MultiplierBadge multiplier={1.35} />
        <MultiplierBadge multiplier={2.6} />
        <MultiplierBadge multiplier={8.33} />
        <MultiplierBadge multiplier={1.35} />
        <MultiplierBadge multiplier={2.6} />
        <MultiplierBadge multiplier={8.33} />
        <MultiplierBadge multiplier={8.33} />
        <MultiplierBadge multiplier={8.33} />
        <MultiplierBadge multiplier={8.33} />
        <MultiplierBadge multiplier={1.35} />
        <MultiplierBadge multiplier={2.6} />
        <MultiplierBadge multiplier={8.33} />
        <MultiplierBadge multiplier={1.35} />
        <MultiplierBadge multiplier={2.6} />
        <MultiplierBadge multiplier={8.33} />
        <MultiplierBadge multiplier={8.33} />
        <MultiplierBadge multiplier={8.33} />
        <MultiplierBadge multiplier={8.33} />
        <MultiplierBadge multiplier={1.35} />
        <MultiplierBadge multiplier={2.6} />
        <MultiplierBadge multiplier={8.33} />
        <MultiplierBadge multiplier={1.35} />
        <MultiplierBadge multiplier={2.6} />
        <MultiplierBadge multiplier={8.33} />
        <MultiplierBadge multiplier={8.33} />
        <MultiplierBadge multiplier={8.33} />
        <MultiplierBadge multiplier={8.33} />
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
    </div>
  )
}