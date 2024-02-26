import {css} from "@emotion/react";
import {TranscluscentBackgroundStyles} from "../../styles/common.ts";
import {ComponentProps, FC} from "react";
import {mq} from "../../styles/breakpoints.ts";

const GameContainerStyles = css({
  width: '100%',
  height: '100%',
  padding: 8,
  borderRadius: 8,
  [mq[0]]: {
    height: window.innerWidth,
    marginBlock: 'auto',
  }
});

type GameContainerProps = {
  isAuthenticated?: boolean
} & ComponentProps<'div'>

const GameContainer: FC<GameContainerProps> = ({children, ...props}) => {
  return (
    <div
      css={[GameContainerStyles, TranscluscentBackgroundStyles]}
      {...props}
    >{children}</div>
  );
};

export default GameContainer
