import { ComponentProps, FC } from "react";
import { rowStyles } from "../../../../styles/common.ts";
import iconRedArrow from "../../../../assets/icons/red-arrow-right.svg";
import { css } from "@emotion/react";
import { WHITE_COLOR } from "../../../../styles/colors.ts";

const styles = css([
  rowStyles,
  {
    alignItems: "start",
    p: {
      opacity: 0.7,
      color: WHITE_COLOR,
      fontSize: 14,
    },
  },
]);



export const ListItem: FC<ComponentProps<"div">> = ({children, ...props}) => {
  return (
    <div css={styles} {...props}>
      <img src={iconRedArrow} alt="" />
      <p>{children}</p>
    </div>
  );
};