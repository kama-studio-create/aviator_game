import {ComponentProps, FC, useState} from "react";
import {css} from "@emotion/react";
import {GRAY_COLOR, LIGHT_GRAY_COLOR, SUCCESS_COLOR, WHITE_COLOR} from "../../styles/colors.ts";
import {MEDIA_QUERIES} from "../../styles/breakpoints.ts";
import {DEFAULT_CURRENCY} from "../../common/constants.ts";

import logo from "../../assets/logo.svg";
import iconBurger from "../../assets/icons/burger.svg";
import {HeaderMenu} from "../menus/HeaderMenu.tsx";

const styles = {
  headerStyles: css({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBlock: 8,
    paddingInline: 8,
    backgroundColor: GRAY_COLOR
  }),
  appNameStyles: css({
    width: 84,
    height: 'auto',
    display: 'grid',
    placeContent: 'center',
    transition: 'all 0.2s ease-in-out',
    img: {
      width: '100%',
      height: '100%'
    },
    [MEDIA_QUERIES[0]]: {
      width: 72
    }
  }),
  actionAreaStyles: css({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: "flex-end",
    alignItems: 'center',
    gap: 2
  }),
  balanceStyles: css({
    display: 'flex',
    flexDirection: 'row',
    gap: 2,
    justifyContent: "flex-end",
    alignItems: 'baseline',
    color: SUCCESS_COLOR,
    fontWeight: 700,
    fontSize: 18,
    borderRight: `1px solid ${LIGHT_GRAY_COLOR}`,
    paddingInline: 8,
    transform: 'scale(1.1,1)',
    span: {
      fontWeight: 400,
      color: WHITE_COLOR,
      fontSize: 12,
      opacity: 0.6,
      transform: 'scale(0.8,1)'
    }
  }),
  menuStyles: css({
    paddingInline: 8,
    // borderRight: `1px solid ${LIGHT_GRAY_COLOR}`,
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
  }),
  chatStyles: css({
    paddingLeft: 8,
    display: 'grid',
    placeContent: 'center',
    height: '100%',
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
}

const Header: FC<ComponentProps<'nav'>> = ({...props}) => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);


  const handleMenuToggle = () => {
    setIsMenuOpen(state => !state);
  }

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  }



  return (
    <nav
      css={styles.headerStyles}
      {...props}
    >
      <div css={styles.appNameStyles}><img src={logo} alt='aviator'/> </div>
      <div css={styles.actionAreaStyles}>
        <div css={styles.balanceStyles}>
          6.06 <span>{DEFAULT_CURRENCY}</span>
        </div>
        <div css={styles.menuStyles}>
          <button onClick={handleMenuToggle}>
            <img src={iconBurger} alt='menu'/>
            {isMenuOpen && <HeaderMenu handleClose={handleMenuClose} isOpen={isMenuOpen} />}
          </button>
        </div>
        {/*<div css={styles.chatStyles}>*/}
        {/*  <button>*/}
        {/*    <img src={iconChat} alt='chat'/>*/}
        {/*  </button>*/}
        {/*</div>*/}
      </div>
    </nav>
  );
};
export default Header;
