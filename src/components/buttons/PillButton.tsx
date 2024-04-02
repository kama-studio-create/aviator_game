import {css} from "@emotion/react";
import {ComponentProps, FC} from "react";
import {
  DARK_COLOR,
  LIGHT_COLOR,
  PRIMARY_COLOR,
  SECONDARY_COLOR,
  SUCCESS_COLOR,
  WHITE_COLOR
} from "../../styles/colors.ts";

type Props = {
  variant?: 'primary' | 'secondary' | 'dark' | 'light' | 'success' | 'error',
  size?: 'sm' | 'md' | 'lg' | 'xl'
} & ComponentProps<'button'>


const baseStyles = css({
  paddingBlock: 8,
  paddingInline: 24,
  borderRadius: 16,
  fontWeight: 900,
  border: 'none',
  cursor: 'pointer',
  textDecoration: 'capitalize',
  '[data-variant]=primary': {
    background: PRIMARY_COLOR,
    color: WHITE_COLOR,
  },
  '[data-variant]=secondary': {
    background: SECONDARY_COLOR,
    color: WHITE_COLOR,
  },
  '[data-variant]=dark': {
    background: DARK_COLOR,
    color: WHITE_COLOR,
  },
  '[data-variant]=light': {
    background: LIGHT_COLOR,
    color: DARK_COLOR,
  },
  '[data-variant]=success': {
    background: SUCCESS_COLOR,
    color: WHITE_COLOR,
  },
  '[data-size]=md': {
    paddingBlock: 16,
    paddingInline: 32,
  },
  '[data-size]=lg': {
    paddingBlock: 24,
    paddingInline: 40,
  }
})

export const PillButton: FC<Props> = ({variant = 'primary', size = 'md', children, ...props}) => {

  return (
    <button
      css={baseStyles}
      {...props}
      data-variant={variant}
      data-size={size}
    >
      {children}
    </button>
  )
}
