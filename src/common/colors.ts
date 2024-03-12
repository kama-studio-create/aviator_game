import {css} from "@emotion/react";

export const COLORS = {
  primary: '#FF5E3A',
  secondary: '#FF9966',
  dark: '#222',
  light: 'light-dark(rgba(255, 255, 255, 0.24), rgba(0, 0, 0, 0.2))',
  success: '#00de60',
  error: '#f00',
  white: '#fff',
  black: '#000',
  bgRed: 'rgba(241,4,4,0.5)'
}

export const BUTTON_COLORS = {
  primary: css({
    background: COLORS.primary,
    color: COLORS.white,
  }),
  secondary: css({
    background: COLORS.secondary,
    color: COLORS.white
  }),
  dark: css({
    background: COLORS.dark,
    color: COLORS.white
  }),
  light: css({
    background: COLORS.light,
    color: COLORS.dark
  }),
  success: css({
    background: COLORS.success,
    color: COLORS.dark
  }),
  error: css({
    background: COLORS.error,
    color: COLORS.white
  })
}
