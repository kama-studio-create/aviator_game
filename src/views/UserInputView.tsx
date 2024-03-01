import {css} from "@emotion/react";
import {TranscluscentBackgroundStyles} from "../styles/common.ts";
import {useState} from "react";
import {NumberInput} from "../components/inputs/NumberInput.tsx";

const userInputStyles = {
  container: css({
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
    position: 'relative',
    padding: 8
  }),
  inputContainer: css({
    width: '100%',
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    flex: 1
  })

}
export const UserInputView = () => {
  const [inputValue, setInputValue] = useState<number>(0);

  const handleChange = (value: number) => {
    setInputValue(value);
  }

  return (
    <div css={userInputStyles.container}>
      <div css={[TranscluscentBackgroundStyles, userInputStyles.inputContainer]}>
        <NumberInput name="amount" handleChange={handleChange} />
        <button>Bet <br/>ksh. {inputValue}</button>
      </div>
      {/*<div css={[TranscluscentBackgroundStyles, userInputStyles.inputContainer]}>*/}
      {/*  <NumberInput name="amount" handleChange={handleChange} />*/}
      {/*  <button>Bet <br/>ksh. {inputValue}</button>*/}
      {/*</div>*/}
    </div>
  )
}
