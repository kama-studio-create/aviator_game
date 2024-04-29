import { ComponentProps, FC } from "react";
import { css } from "@emotion/react";
import {
  DARK_GRAY_COLOR,
  LIGHT_GRAY_COLOR,
  WHITE_COLOR,
} from "../../styles/colors.ts";

const tabStyles = css({
  width: "100%",
  padding: 4,
  display: "flex",
  flexDirection: "column",
  gap: 8,
  flex: 1,
  backgroundColor: DARK_GRAY_COLOR,
  borderRadius: 16,
  textAlign: "center",
  fontSize: 12,
  color: "#9ea0a3",
  "&.active": {
    backgroundColor: LIGHT_GRAY_COLOR,
    border: `1px solid ${DARK_GRAY_COLOR}`,
    opacity: 1,
    color: WHITE_COLOR,
  },
  transition: "background-color 0.3s ease-in-out",
});

type props = {
  isActive: boolean;
} & ComponentProps<"div">;

export const TabItem: FC<props> = ({ children, isActive, onClick }) => {
  return (
    <div className={isActive ? "active" : ""} onClick={onClick} css={tabStyles}>
      {children}
    </div>
  );
};
