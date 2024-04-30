import { ComponentProps, FC } from "react";
import { css } from "@emotion/react";
import iconLoader from "../../assets/icons/tube-spinner.svg";

const styles = css({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "100%",
  img: {
    width: 60,
    height: 60,
  },
});

export const Loader: FC<ComponentProps<"div">> = () => {
  return (
    <div css={styles}>
      <img src={iconLoader} alt="loading" />
    </div>
  );
};
