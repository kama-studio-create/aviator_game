import {ComponentProps, FC} from "react";
import {css} from "@emotion/react";

const loadingStyles = css({
  display: "grid",
  placeItems: "center",
})

type LoadingProps = {
  width: number;
  height: number;
} & ComponentProps<'div'>;
export const Loading: FC<LoadingProps>  = ({width, height}) => {
  return (
    <div style={{width: width, height: height}} css={loadingStyles}>
      <p>Loading Assets...</p>
    </div>
  )
}