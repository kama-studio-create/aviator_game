import {css} from "@emotion/react";
import {BetInput} from "../components/inputs/BetInput.tsx";
import {MEDIA_QUERIES} from "../styles/breakpoints.ts";


const userInputStyles = {
  container: css({
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    position: 'relative',
    [MEDIA_QUERIES[0]]: {
      flexDirection: 'column',
    }
  }),
}


export const UserInputView = () => {
  return (
    <div css={userInputStyles.container}>
      <BetInput />
      <BetInput />
    </div>
  )
}
