import {css} from "@emotion/react";
import {ComponentProps, FC} from "react";
import {COLORS} from "../../common/colors.ts";

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
    background: COLORS.primary,
    color: COLORS.white,
  },
  '[data-variant]=secondary': {
    background: COLORS.secondary,
    color: COLORS.white,
  },
  '[data-variant]=dark': {
    background: COLORS.dark,
    color: COLORS.white,
  },
  '[data-variant]=light': {
    background: COLORS.light,
    color: COLORS.dark,
  },
  '[data-variant]=success': {
    background: COLORS.success,
    color: COLORS.white,
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
