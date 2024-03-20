import {css} from "@emotion/react";
import {TranscluscentBackgroundStyles} from "../../styles/common.ts";
import {ComponentProps, FC} from "react";
import {MEDIA_QUERIES} from "../../styles/breakpoints.ts";

const GameContainerStyles = css([{
  width: '100%',
  height: '100%',
  padding: 8,
  borderRadius: 8,
  [MEDIA_QUERIES[0]]: {
    marginBlock: 'auto',
  }
}, TranscluscentBackgroundStyles]);


const GameContainer: FC<ComponentProps<'div'>> = ({children, ...props}) => {
  return (
    <div
      css={GameContainerStyles}
      {...props}
    >{children}</div>
  );
};

export default GameContainer
