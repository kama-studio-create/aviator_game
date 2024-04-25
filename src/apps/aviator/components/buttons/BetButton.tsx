import { ComponentProps, CSSProperties, FC } from "react";
import { css } from "@emotion/react";
import {
  BORDER_SUCCESS_COLOR,
  SUCCESS_COLOR,
  WHITE_COLOR,
} from "../../styles/colors.ts";

const buttonStyles = css({
  width: "100%",
  height: "100%",
  flex: 1,
  flexGrow: 1,
  paddingBlock: 12,
  paddingInline: 16,
  textAlign: "center",
  backgroundColor: SUCCESS_COLOR,
  color: WHITE_COLOR,
  border: `1px solid ${BORDER_SUCCESS_COLOR}`,
  borderRadius: 16,
  fontSize: 20,
  textTransform: "uppercase",
  display: "flex",
  flexDirection: "column",
  gap: 2,
  justifyContent: "center",
  alignItems: "center",
  transition: "background-color 0.4s ease-in-out",
  textShadow: "0 1px 2px rgba(0,0,0,.5)",
  span: {
    fontSize: 16,
  },
  "& .amount": {
    fontSize: 24,
  },
});

type props = {
  backgroundColor: string;
  borderColor: string;
  title: string;
  amount: number;
} & ComponentProps<"button">;

export const BetButton: FC<props> = ({
  backgroundColor,
  title,
  amount,
  borderColor,
  ...props
}) => {
  const styles: CSSProperties = {
    backgroundColor,
    borderColor,
  };
  return (
    <button style={styles} css={buttonStyles} {...props}>
      <div>{title}</div>
      <div className="amount">{amount.toFixed(2)}</div>
    </button>
  );
};
