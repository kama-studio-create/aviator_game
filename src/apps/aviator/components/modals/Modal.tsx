import {ComponentPropsWithRef, CSSProperties, FC, forwardRef, ReactNode} from "react";
import {css, keyframes} from "@emotion/react";
import {BACKGROUND_COLOR, ERROR_COLOR, GRAY_COLOR, HEADER_COLOR} from "../../styles/colors.ts";
import iconClose from "../../assets/icons/close.svg";

const modalBorderRadius = 8

const slideIn = keyframes({
  "0%": {
    transform: "translateY(100%)",
    opacity: 0
  },
  "100%": {
    transform: "translateY(0)",
    opacity: 1
  }
})
const modalStyles = css({
  position: 'absolute',
  height: '100%',
  width: '100%',
  zIndex: 103,
  borderRadius: 16,
  top: 0,
  left: 0,
  display: 'flex',
  justifyContent: 'center',
  padding: 8,
})

const modalContainer = css({
  width: '100%',
  height: 'auto',
  animation: `${slideIn} 0.1s ease-in-out`,
  maxWidth: 600
})

const headerStyles = css({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  padding: 8,
  background: BACKGROUND_COLOR,
  borderTopLeftRadius: modalBorderRadius,
  borderTopRightRadius: modalBorderRadius,
  h1: {
    color: 'white',
    fontSize: 14,
    fontWeight: 400,
    textTransform: 'uppercase'
  },
  button: {
    background: 'transparent',
    border: 'none',
    width: 24,
    height: 24,
    cursor: 'pointer',
    img: {
      width: 20,
      height: 20
    }
  },

});
const bodyStyles = css({
  backgroundColor: GRAY_COLOR,
  paddingBlock: 8,

})

const footerStyles = css({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  padding: 16,
  background: HEADER_COLOR,
  borderBottomLeftRadius: modalBorderRadius,
  borderBottomRightRadius: modalBorderRadius,
  p : {
    color: '6f7072',
    fontSize: 15,
    fontWeight: 400,
    opacity: 0.7,
    textAlign: "center",
    span: {
      color: ERROR_COLOR
    }
  },
  div: {
    opacity: 0.6
  }

})

type TModalProps = {
  title: string | ReactNode,
  isOpen: boolean,
  handleClose: () => void,
  footer?: ReactNode,
  hasCloseButton?: boolean,
  bodyBackgroundColor?: string,
  headerBackgroundColor?: string,
  footerBackgroundColor?: string,
  position?: 'fixed' | 'absolute',
} & ComponentPropsWithRef<'div'>

export const Modal: FC<TModalProps> = forwardRef(
  ({
    title,
    footerBackgroundColor, 
    bodyBackgroundColor, 
    headerBackgroundColor, 
    footer, 
    children, 
    isOpen, 
    handleClose, 
    hasCloseButton = false, 
    position = 'absolute',
    ...props}, ref) => {

    const headerCss: CSSProperties = {
      background: headerBackgroundColor || HEADER_COLOR
    }

    const footerCss: CSSProperties = {
      background: footerBackgroundColor || headerBackgroundColor || HEADER_COLOR,

    }

    const containerCss: CSSProperties = {
      width: isOpen? '100%' : '0',
      height: isOpen? '100%' : '0',
      opacity: isOpen? 1 : 0,
    }

    const bodyCss: CSSProperties = {
      borderBottomRightRadius: footer ? 0: 8,
      borderBottomLeftRadius: footer ? 0: 8,
      backgroundColor: bodyBackgroundColor || GRAY_COLOR
    }

    return (
      <div style={containerCss} ref={ref} css={modalStyles} {...props}>
        {isOpen && <div style={{position: position }} css={modalContainer}>
          <header style={headerCss} css={headerStyles}>
            <h1>{title}</h1>
            {hasCloseButton && <button onClick={handleClose}>
              <img src={iconClose} alt="close"/>
            </button>}
          </header>
          <div style={bodyCss} css={bodyStyles}>{children}</div>
          {footer && <footer style={footerCss} css={footerStyles}>
            <div>
              {footer}
            </div>
          </footer>}
        </div>}
      </div>
    )
  })