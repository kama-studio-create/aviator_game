import { css } from "@emotion/react";
import { ComponentProps, FC } from "react";
import {
  BORDER_SUCCESS_COLOR,
  BORDER_WARNING_COLOR,
  BUTTON_BG_COLOR,
  ERROR_COLOR,
  LIGHT_GRAY_COLOR,
  SUCCESS_COLOR,
  WARNING_COLOR,
  WHITE_COLOR,
} from "../../styles/colors.ts";

type Props = {
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "warning"
    | "transparent";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  active?: boolean;
} & ComponentProps<"button">;

const baseStyles = css({
  paddingBlock: 4,
  paddingInline: 24,
  borderRadius: 32,
  fontWeight: 400,
  fontFamily: "Inter, sans-serif",
  border: "none",
  cursor: "pointer",
  textDecoration: "capitalize",
  transition: "all 0.1s ease-in-out",
  div: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  "&.active": {
    fontWeight: 400,
    paddingBlock: 6,
  },
  //handle sizes
  "&[data-size='xs']": {
    paddingInline: 12,
    minWidth: 60,
    fontSize: 12,
  },
  "&[data-size='sm']": {
    paddingInline: 16,
    minWidth: 60,
    fontSize: 14,
  },
  "&[data-size='md']": {
    paddingInline: 24,
    minWidth: 80,
    fontSize: 14,
  },
  "&[data-size='lg']": {
    paddingInline: 32,
    minWidth: 120,
    fontSize: 16,
  },
  "&[data-size='xl']": {
    paddingInline: 40,
    minWidth: 160,
    fontSize: 18,
  },
  // handles variants
  "&[data-variant='secondary']": {
    background: BUTTON_BG_COLOR,
    color: LIGHT_GRAY_COLOR,
    border: `1px solid ${LIGHT_GRAY_COLOR}`,
    "&.active": {
      backgroundColor: LIGHT_GRAY_COLOR,
      color: WHITE_COLOR,
      border: `1px solid ${SUCCESS_COLOR}`,
      opacity: 0.9,
    },
  },
  "&[data-variant='success']": {
    background: SUCCESS_COLOR,
    color: WHITE_COLOR,
    border: `1px solid ${BORDER_SUCCESS_COLOR}`,
    "&.active": {
      border: `2px solid ${BORDER_SUCCESS_COLOR}`,
    },
  },
  "&[data-variant='warning']": {
    background: WARNING_COLOR,
    color: WHITE_COLOR,
    border: `1px solid ${BORDER_WARNING_COLOR}`,
    "&.active": {
      backgroundColor: WARNING_COLOR,
      color: WHITE_COLOR,
      border: `2px solid ${SUCCESS_COLOR}`,
    },
  },
  "&[data-variant='transparent']": {
    background: "transparent",
    color: WHITE_COLOR,
    border: "none",
    paddingInline: 6,
    "&.active": {
      border: `2px solid ${ERROR_COLOR}`,
    },
  },

});

export const PillButton: FC<Props> = ({
  variant = "primary",
  size = "md",
  active = false,
  children,
  ...props
}) => {
  return (
    <button
      className={active ? "active" : ""}
      css={baseStyles}
      data-variant={variant}
      data-size={size}
      {...props}
    >
      <div>{children}</div>
    </button>
  );
};
