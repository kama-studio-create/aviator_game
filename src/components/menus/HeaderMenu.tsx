import {ComponentProps, FC, useEffect, useRef, useState} from "react";
import {css, keyframes} from "@emotion/react";
import {BACKGROUND_COLOR} from "../../styles/colors.ts";
import {MenuUserCard} from "../cards/menu/MenuUserCard.tsx";
import {MenuSettingsCard} from "../cards/menu/MenuSettingsCard.tsx";
import {MenuInfoCard} from "../cards/menu/MenuInfoCard.tsx";
import {HOME} from "../../common/constants.ts";

import iconHome from "../../assets/icons/home.svg";
import iconBurger from "../../assets/icons/burger.svg";

const menuToggleStyles = css({
  paddingInline: 8,
  display: 'grid',
  placeContent: 'center',
  height: '100%',
  position: 'relative',
  button: {
    background: 'transparent',
    border: "none",
    display: 'grid',
    placeContent: 'center',
    paddingBlock: 4,
    img: {
      width: 18,
      height: 18
    }
  }
})

const menuAnimation = keyframes({
  '0%': {
    opacity: 0,
    transform: 'translateX(100%)'
  },
  '100%': {
    opacity: 1,
    transform: 'translateX(0)'
  },
})

const menuStyles = css({
  position: 'absolute',
  width: 320,
  height: "auto",
  background: BACKGROUND_COLOR,
  top: 36,
  right: 0,
  zIndex: 104,
  borderRadius: 8,
  animation: `${menuAnimation} 0.2s ease-in-out`,
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




export const HeaderMenu: FC<ComponentProps<'div'>> = () => {

  const headerRef = useRef<HTMLDivElement>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if(headerRef.current && !headerRef.current.contains(event.target as Node) && isMenuOpen){
        handleMenuToggle();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }

  }, [handleMenuToggle, isMenuOpen]);

  return (
    <div ref={headerRef} css={menuToggleStyles}>
      <button onClick={handleMenuToggle}>
        <img src={iconBurger} alt='menu'/>
      </button>
      {isMenuOpen && <div css={menuStyles}>
        <MenuUserCard username={'randomy'}/>
        <MenuSettingsCard/>
        <MenuInfoCard/>
        <div css={footerStyles}>
          <img src={iconHome} alt={HOME}/>
          <p>{HOME}</p>
        </div>
      </div>}
    </div>

  )
}