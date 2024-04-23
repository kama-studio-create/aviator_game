import {css} from "@emotion/react";
import {ComponentProps, FC} from "react";
import {MEDIA_QUERIES} from "../../styles/breakpoints.ts";
import {BLACK_COLOR} from "../../styles/colors.ts";

const GameContainerStyles = css({
  width: '100%',
  height: '100%',
  padding: 8,
  borderRadius: 8,
  backgroundColor: BLACK_COLOR,
  [MEDIA_QUERIES[0]]: {
    marginBlock: 'auto',
  }
});


const GameContainer: FC<ComponentProps<'div'>> = ({children, ...props}) => {
  return (
    <div
      css={GameContainerStyles}
      {...props}
    >{children}</div>
  );
};

export default GameContainer
