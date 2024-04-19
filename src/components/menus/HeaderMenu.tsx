import {FC, useEffect, useRef} from "react";
import {css} from "@emotion/react";
import {BACKGROUND_COLOR} from "../../styles/colors.ts";
import {MenuUserCard} from "../cards/menu/MenuUserCard.tsx";
import {MenuSettingsCard} from "../cards/menu/MenuSettingsCard.tsx";
import {MenuInfoCard} from "../cards/menu/MenuInfoCard.tsx";

import iconHome from "../../assets/icons/home.svg";
import {HOME} from "../../common/constants.ts";

const menuStyles = css({
  position: 'absolute',
  width: 320,
  height: "auto",
  background: BACKGROUND_COLOR,
  top: 36,
  right: 0,
  zIndex: 104,
  borderRadius: 8,
})

const footerStyles = css({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 16,
  gap: 8,
  boxShadow: ' 10px 10px 31px 2px rgba(0,0,0,0.45)',
  img: {
    width: 14,
    height: 14
  },
  p: {
    opacity: 0.6,
    textTransform: 'capitalize',
    fontSize: 12,
    lineHeight: 1
  }
})

type props = {
  isOpen: boolean,
  handleClose: () => void
}


export const HeaderMenu: FC<props> = ({isOpen, handleClose}) => {

  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if(headerRef.current && !headerRef.current.contains(event.target as Node) && isOpen){
        handleClose();
      }
    }

    if(isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }

  }, [isOpen]);

  return (
    <div ref={headerRef} css={menuStyles}>
      <MenuUserCard username={'randomy'}/>
      <MenuSettingsCard />
      <MenuInfoCard />
      <div css={footerStyles}>
        <img src={iconHome} alt={HOME} />
        <p>{HOME}</p>
      </div>
    </div>
  )
}