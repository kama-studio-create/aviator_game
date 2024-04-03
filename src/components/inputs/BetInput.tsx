import {css} from "@emotion/react";
import {DARK_GRAY_COLOR, GRAY_COLOR, SUCCESS_COLOR, WHITE_COLOR} from "../../styles/colors.ts";
import {useState} from "react";
import {NumberInput} from "./NumberInput.tsx";

import IconMinus from '../../assets/icons/minus.svg';
import IconPlus from '../../assets/icons/plus.svg';

const betInputStyles = {
  row: css({
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    position: 'relative',
    alignItems: 'center'
  }),
  inputContainer: css({
    width: '100%',
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    flex: 1,
    backgroundColor: '#1b1c1d',
    borderRadius: 8
  }),
  tabContainer: css({
    display: 'flex',
    flexDirection: 'row',
    width: '60%',
    padding: 2,
    backgroundColor: '#141516',
    borderRadius: 16,
    marginInline: 'auto'
  }),
  tab: css({
    width: '100%',
    padding: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    flex: 1,
    backgroundColor: DARK_GRAY_COLOR,
    borderRadius: 8,
    textAlign: 'center',
    '&.active': {
      backgroundColor: GRAY_COLOR,
    }

  }),

  smallBtn:  css({
    width: 6,
    height: 6,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    fontSize: 12,
    border: 'none',
    ':hover': {
      backgroundColor: '#1b1c1d',
    }
  }),

  buttonGrid: css({
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 4,
    marginInline: 'auto',
    width: '100%'
  }),
  selectAmountBtn: css({
    width: '100%',
    paddingBlock: 4,
    textAlign: 'center',
    backgroundColor: DARK_GRAY_COLOR,
    border: 'none',
    borderRadius: 8,
    fontSize: 10
  }),
  betButton: css({
    width: '100%',
    paddingBlock: 8,
    textAlign: 'center',
    backgroundColor: SUCCESS_COLOR,
    border: '1px solid white',
    borderRadius: 16,
    fontSize: 20,
    textTransform: 'uppercase',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
    ':hover': {
      backgroundColor: WHITE_COLOR,
    }
  })
}

export const BetInput = () => {
  const [inputValue, setInputValue] = useState<number>(1.00);

  const handleChange = (value: number) => {
    setInputValue(value);
  }
  return (
    <div css={betInputStyles.inputContainer}>
      <div css={betInputStyles.tabContainer}>
        <div className={'active'}  css={betInputStyles.tab}>Bet</div>
        <div css={betInputStyles.tab}>Auto</div>
      </div>
      <div css={betInputStyles.row}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
          <div style={{background: 'black', borderRadius: 32, paddingInline: 8}} css={betInputStyles.row}>
            <button onClick={() => {
              if (inputValue > 1) {
                setInputValue(prev => prev - 1)
              }
            }} css={betInputStyles.smallBtn}>
              <img src={IconMinus} width={16} height={16} alt='minus' />
            </button>
            <NumberInput value={inputValue} name="amount" handleChange={handleChange}/>
            <button onClick={() => setInputValue(prev => prev + 1)} css={betInputStyles.smallBtn}>
              <img src={IconPlus} width={16} height={16} alt='plus' />
            </button>
          </div>
          <div css={betInputStyles.buttonGrid}>
            <button onClick={() => setInputValue(1)} css={betInputStyles.selectAmountBtn}>1</button>
            <button onClick={() => setInputValue(2)} css={betInputStyles.selectAmountBtn}>2</button>
            <button onClick={() => setInputValue(5)} css={betInputStyles.selectAmountBtn}>5</button>
            <button onClick={() => setInputValue(10)} css={betInputStyles.selectAmountBtn}>10</button>
          </div>
        </div>


        <button css={betInputStyles.betButton}>
          <div>Bet</div>
          <div>ksh. {inputValue.toFixed(2)} </div>
        </button>
      </div>
    </div>
  )
}