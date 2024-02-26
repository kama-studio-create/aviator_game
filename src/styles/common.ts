import {css} from "@emotion/react";

export const TranscluscentBackgroundStyles = css({
  // background: 'light-dark(rgba(255, 255, 255, 0.24), rgba(0, 0, 0, 0.2))',
  background: 'rgba(0, 0, 0, 0.6)',
  borderRadius: 4,
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.34)',
  '@media(prefers-color-scheme: light)' : {
    background: 'rgba(255, 255,255, 0.24)',
    color: '#000',
    fontWeight: 600
  }

})
