import { css, keyframes } from "@emotion/react";

export const translucentBackgroundStyles = css({
  background: "rgba(0, 0, 0, 0.6)",
  borderRadius: 4,
  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.34)",
  "@media(prefers-color-scheme: light)": {
    background: "rgba(255, 255,255, 0.24)",
    color: "#000",
    fontWeight: 600,
  },
});

export const rowStyles = css({
  display: "flex",
  flexDirection: "row",
  gap: 8,
  alignItems: "center",
});

export const fadeInAnimation = keyframes({
  "0%": {
    opacity: 0,
  },
  "100%": {
    opacity: 1,
  },
});
