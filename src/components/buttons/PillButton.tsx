import {css} from "@emotion/react";
import {ComponentProps, FC} from "react";
import {BUTTON_COLORS} from "../../common/colors.ts";

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
})

const customStyles = {
  sm: css({}),
  md: css({}),
  lg: css({}),
  xl: css({}),
}
export const PillButton: FC<Props> = ({variant = 'primary', size = 'md', children, ...props}) => {

  return (
    <button
      css={[baseStyles, BUTTON_COLORS[variant], customStyles[size]]}
      {...props}
    >
      {children}
    </button>
  )
}
