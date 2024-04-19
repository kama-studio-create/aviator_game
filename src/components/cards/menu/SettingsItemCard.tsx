import {FC} from "react";
import SwitchInput from "../../inputs/SwitchInput.tsx";
import {css} from "@emotion/react";
import {GRAY_COLOR} from "../../../styles/colors.ts";

type props = {
  title: string,
  icon: string,
  handleChange: () => void,
  value: boolean
}

const cardStyles = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  height: "100%",
  background: GRAY_COLOR,
  paddingBlock: 8,
  paddingInline: 12,
  '& .title': {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    justifyContent: "start",
    h1: {
      fontSize: 14,
      fontWeight: 400,
      transform: 'scale(1.1,1)',
      textTransform: 'capitalize',
    },
    img: {
      width: 16,
      height: 16
    }
  }
})

export const SettingsItemCard: FC<props> = ({title, icon, handleChange, value}) => {
  return (
    <div css={cardStyles}>
      <div className={'title'}>
        <img src={icon} alt='sound'/>
        <h1>{title}</h1>
      </div>
      <SwitchInput checked={value} onChange={handleChange}/>
    </div>
  )
}