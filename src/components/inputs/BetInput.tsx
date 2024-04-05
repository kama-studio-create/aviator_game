import {css} from "@emotion/react";
import {
  BLUE_COLOR,
  COLOR_BLUE,
  DARK_GRAY_COLOR,
  ERROR_COLOR,
  GRAY_COLOR,
  PRIMARY_COLOR,
  SUCCESS_COLOR,
  WHITE_COLOR
} from "../../styles/colors.ts";
import {FC, useEffect, useState} from "react";
import {NumberInput} from "./NumberInput.tsx";

import IconMinus from '../../assets/icons/minus.svg';
import IconPlus from '../../assets/icons/plus.svg';
import {
  ENDED,
  FACTOR,
  MINIMUM_BET,
  PLAYING,
  TGameState,
  WAITING,
  WAITING_FOR_NEXT_ROUND
} from "../../common/constants.ts";
import SwitchInput from "./SwitchInput.tsx";

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
    borderRadius: 16,
    textAlign: 'center',
    fontSize: 12,
    '&.active': {
      backgroundColor: GRAY_COLOR,
      border: `1px solid ${DARK_GRAY_COLOR}`,
    },
    transition: 'background-color 0.2s ease-in-out'

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
    height: '100%',
    paddingBlock: 8,
    paddingInline: 16,
    textAlign: 'center',
    backgroundColor: SUCCESS_COLOR,
    border: '1px solid white',
    borderRadius: 16,
    fontSize: 14,
    textTransform: 'uppercase',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'background-color 0.4s ease-in-out',
    ':hover': {
      backgroundColor: WHITE_COLOR,
    }
  }),
  autoplayContainer: css({
    display: 'flex',
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
    paddingBlock: 4,
    borderTop: '1px solid black'
  }),
  autoplayButton: css({
    height: '100%',
    paddingBlock: 4,
    paddingInline: 8,
    textAlign: 'center',
    backgroundColor: COLOR_BLUE,
    border: 'none',
    borderRadius: 16,
    fontSize: 10,
    textTransform: 'uppercase',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
    color: WHITE_COLOR,
    transition: 'background-color 0.2s ease-in-out',
    ':hover': {
      backgroundColor: WHITE_COLOR,
      color: BLUE_COLOR
    }
  })
}


type InputProps = {
  gameState: TGameState,
  startTime: number,
  now: number
}

export const BetInput: FC<InputProps> = ({gameState, startTime, now}) => {
  const [betAmount, setBetAmount] = useState(MINIMUM_BET);
  const [isPlaying, setIsPlaying] = useState(false);
  const [waitingForNext, setWaitingForNext] = useState(false);
  const [exitTime, setExitTime] = useState<number | null>(null);
  const [exitMultiplier, setExitMultiplier] = useState(1);
  const [buttonColor, setButtonColor] = useState(SUCCESS_COLOR);

  const [isAutoPlay, setAutoPlay] = useState(true);

  const [buttonTitle, setButtonTitle] = useState('BET');

  const [isAutoCheckout, setAutoCheckout] = useState(false);

  const [autoPlayMultiplierLimit, setAutoPlayMultiplierLimit] = useState(1.10);

  const getWinAmount = () => {
    if(isPlaying) {
      return betAmount
    }
    if (gameState === PLAYING && isPlaying) {
      const elapsedTime = Date.now() - startTime;
      const multiplier = Math.exp(FACTOR * elapsedTime);
      return (multiplier * betAmount).toFixed(2);
    }
    else if(gameState === ENDED && isPlaying) {
      return (exitMultiplier * betAmount).toFixed(2);
    }
    else {
      return betAmount;
    }
  }



  const handleChange = (value: number) => {
    setBetAmount(value);
    setIsPlaying(false);
  }

  const getMultiplier = (timeA: number, timeB: number) => {
    const elapsedTime = timeA - timeB;
    return Math.exp(FACTOR * elapsedTime);
  }

  const handleBetButtonClick = () => {
    if(waitingForNext) {
      setWaitingForNext(false);
      setIsPlaying(false);
      return;
    }

    if(gameState === PLAYING && isPlaying) {
      setExitTime(Date.now());
      return;
    }
    if(!waitingForNext && !isPlaying) {
      setWaitingForNext(true);
      setButtonColor(ERROR_COLOR);
      setButtonTitle('CANCEL');
      setIsPlaying(true);
      return;
    }

  }
  useEffect(() => {
    if(gameState === PLAYING && isAutoCheckout && isPlaying) {
      const elapsedTime = now - startTime;
      const multiplier = Math.exp(FACTOR * elapsedTime);
      if(multiplier >= autoPlayMultiplierLimit) {
        setExitTime(now);
        setExitMultiplier(multiplier);
        console.log('ended at', multiplier);
      }
    }

  }, [autoPlayMultiplierLimit, gameState, isAutoCheckout, isPlaying, now, startTime]);

  useEffect(() => {
    switch (gameState) {
      case "WAITING":
        setWaitingForNext(false);
        setExitTime(null);
        setExitMultiplier(0);
        if(isPlaying) {
          setButtonTitle('CANCEL');
        }
        break;
      case "PLAYING":
        if(exitTime && isPlaying){
          const multiplier = getMultiplier(Date.now(), exitTime);
          setExitMultiplier(multiplier);
          setWaitingForNext(false);
          setButtonColor(SUCCESS_COLOR);
          setButtonTitle('BET');
          setIsPlaying(false);
        }
        if(isPlaying && !waitingForNext) {
          setButtonColor(PRIMARY_COLOR);
          setButtonTitle('EXIT');
        }
        if(!isPlaying && !waitingForNext) {
          setButtonColor(SUCCESS_COLOR);
          setButtonTitle('BET');
        }
        break;
      case "ENDED":
        if(!waitingForNext) {
          setButtonColor(SUCCESS_COLOR);
          setButtonTitle('BET');
          setIsPlaying(false);
        }
        break;
      default:
        break;
    }
  }, [gameState, exitTime, waitingForNext, isPlaying, isAutoCheckout, autoPlayMultiplierLimit]);


  return (
    <div css={betInputStyles.inputContainer}>
      <div css={betInputStyles.tabContainer}>
        <div onClick={() => setAutoPlay(false)} className={!isAutoPlay ? 'active' : ''} css={betInputStyles.tab}>Bet
        </div>
        <div onClick={() => setAutoPlay(true)} className={isAutoPlay ? 'active' : ''} css={betInputStyles.tab}>Auto
        </div>
      </div>
      <div css={betInputStyles.row}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
          <div style={{background: 'black', borderRadius: 32, paddingInline: 8}} css={betInputStyles.row}>
            <button onClick={() => {
              if (betAmount > MINIMUM_BET) {
                setBetAmount(prev => prev - 1)
              }
            }} css={betInputStyles.smallBtn}>
              <img src={IconMinus} width={16} height={16} alt='minus'/>
            </button>
            <NumberInput value={betAmount} name="amount" handleChange={handleChange}/>
            <button onClick={() => setBetAmount(prev => prev + 1)} css={betInputStyles.smallBtn}>
              <img src={IconPlus} width={16} height={16} alt='plus'/>
            </button>
          </div>
          <div css={betInputStyles.buttonGrid}>
            <button onClick={() => setBetAmount(1)} css={betInputStyles.selectAmountBtn}>1</button>
            <button onClick={() => setBetAmount(2)} css={betInputStyles.selectAmountBtn}>2</button>
            <button onClick={() => setBetAmount(5)} css={betInputStyles.selectAmountBtn}>5</button>
            <button onClick={() => setBetAmount(10)} css={betInputStyles.selectAmountBtn}>10</button>
          </div>
        </div>

        <div style={{width: '100%', textAlign: 'center', height: '100%'}}>
          {waitingForNext && <div>{WAITING_FOR_NEXT_ROUND}</div>}
          <button style={{backgroundColor: buttonColor}} onClick={handleBetButtonClick}
            css={betInputStyles.betButton}>
            <div>{buttonTitle}</div>
            <div>ksh. {getWinAmount()} </div>
          </button>
        </div>


      </div>
      {isAutoPlay && <div css={betInputStyles.autoplayContainer}>
        <button css={betInputStyles.autoplayButton}>Autoplay</button>
        <div style={{display: 'flex', flexDirection: 'row', gap: 16, alignItems: 'center'}}>
                Auto Cash Out
          <SwitchInput checked={isAutoCheckout} onChange={setAutoCheckout}/>
          <NumberInput style={{maxWidth: 80}} disabled={!isAutoCheckout}
            handleChange={(value) => setAutoPlayMultiplierLimit(value)}
            value={autoPlayMultiplierLimit}/>
        </div>
      </div>}
    </div>
  )
}