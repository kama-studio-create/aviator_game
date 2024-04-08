import {FC} from "react";
import {css} from "@emotion/react";
import {MINIMUM_BET} from "../../common/constants.ts";
import IconMinus from "../../assets/icons/minus.svg";
import {NumberInput} from "./NumberInput.tsx";
import IconPlus from "../../assets/icons/plus.svg";


const smallBtn =  css({
  width: 6,
  height: 6,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  backgroundColor: 'transparent',
  fontSize: 12,
  border: 'none',
  transition: 'all 0.3s ease-in-out',
  ':hover': {
    backgroundColor: '#1b1c1d',
  },
  ':disabled': {
    opacity: 0.5
  }
})

const row = css({
  display: 'flex',
  flexDirection: 'row',
  gap: 8,
  position: 'relative',
  alignItems: 'center',
  maxWidth: 90,
  background: 'black',
  borderRadius: 16,
  paddingInline: 8
})

type props = {
  value: number,
  onChange: (value: number) => void,
  disabled: boolean
}

export const NumberInputWithButtons: FC<props> = ({ value, onChange, disabled}) => {
  return (
    <div css={row}>
      <button disabled={disabled} onClick={() => {
        if (value > MINIMUM_BET) {
          onChange(value - 1)
        }
      }} css={smallBtn}>
        <img src={IconMinus} width={16} height={16} alt='minus'/>
      </button>
      <NumberInput disabled={disabled} value={value} name="amount" handleChange={onChange}/>
      <button disabled={disabled} onClick={() => onChange(value + 1)} css={smallBtn}>
        <img src={IconPlus} width={16} height={16} alt='plus'/>
      </button>
    </div>
  )
}