import {FC} from "react";
import historyIcon from "../../assets/icons/history.svg";
import caretDown from "../../assets/icons/caret-down.svg";
import {css} from "@emotion/react";
import {ERROR_COLOR, GRAY_COLOR, LIGHT_GRAY_COLOR} from "../../styles/colors.ts";

const buttonStyles = css({
  fontWeight: 500,
  fontSize: 12,
  backgroundColor: GRAY_COLOR,
  border: `1px solid ${LIGHT_GRAY_COLOR}`,
  color: LIGHT_GRAY_COLOR,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingInline: 8,
  paddingBlock: 2,
  gap: 4,
  borderRadius: 16,
  position: 'relative',
  zIndex: 102,
  img: {
    opacity: 0.5,
    width: 16,
    height: 16,
    display: 'block',
    maxWidth: '100%',
  },
})

type props = {
  onClick: () => void
  isActive: boolean
}

export const PreviousHandButton: FC<props> = ({ isActive, onClick}) => {
  return (
    <button onClick={onClick} style={{color: isActive ? ERROR_COLOR: LIGHT_GRAY_COLOR}} css={buttonStyles}>
      <img style={{color: isActive ? ERROR_COLOR: LIGHT_GRAY_COLOR}} src={historyIcon} alt='history'/>
      <img style={{color: isActive ? ERROR_COLOR: LIGHT_GRAY_COLOR}} src={caretDown} alt='down'/>
    </button>
  )
}