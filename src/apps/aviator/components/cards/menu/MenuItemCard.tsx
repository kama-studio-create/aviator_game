import {FC} from "react";
import SwitchInput from "../../inputs/SwitchInput.tsx";
import {css} from "@emotion/react";
import {GRAY_COLOR} from "../../../styles/colors.ts";

const cardStyles = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  height: "100%",
  background: GRAY_COLOR,
  paddingBlock: 10,
  paddingInline: 12,
  '& .title': {
    display: 'flex',
    gap: 12,
    alignItems: 'center',
    justifyContent: "start",
    h1: {
      fontSize: 14,
      fontWeight: 400,
      textTransform: 'capitalize',
    },
    img: {
      width: 16,
      height: 16
    }
  }
});
type props = {
  title: string,
  icon: string,
  handleChange: () => void,
  value?: boolean,
}

export const MenuItemCard: FC<props> = ({title, icon, handleChange, value}) => {
  return (
    <div css={cardStyles}>
      <div className={'title'}>
        <img src={icon} alt='sound'/>
        <h1>{title}</h1>
      </div>
      {value !== undefined &&<SwitchInput checked={value} onChange={handleChange}/>}
    </div>
  )
}