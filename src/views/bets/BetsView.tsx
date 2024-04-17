import {css} from "@emotion/react";
import {
  BLUE_COLOR,
  BORDER_SUCCESS_COLOR,
  COLOR_BLUE,
  DARK_GRAY_COLOR,
  ERROR_COLOR,
  GRAY_COLOR,
  LIGHT_GRAY_COLOR,
  PRIMARY_COLOR,
  SUCCESS_COLOR,
  WHITE_COLOR
} from "../../styles/colors.ts";
import {FC, useCallback, useEffect, useState} from "react";
import {NumberInput} from "../../components/inputs/NumberInput.tsx";
import {
  DEFAULT_CURRENCY,
  ENDED,
  FACTOR,
  MINIMUM_BET,
  PLAYING,
  SUCCESS,
  TGameState,
  WAITING,
  WAITING_FOR_NEXT_ROUND
} from "../../common/constants.ts";
import SwitchInput from "../../components/inputs/SwitchInput.tsx";
import {AutoPlayModal} from "../../components/modals/AutoPlayModal.tsx";
import {NumberInputWithButtons} from "../../components/inputs/NumberInputWithButtons.tsx";
import {TBetSlip, useBetSlipStore} from "../../store/bets.store.ts";
import {useNotificationStore} from "../../store/notifications.store.ts";

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

  smallBtn: css({
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
    width: '100%',
    button: {
      color: WHITE_COLOR
    }
  }),
  selectAmountBtn: css({
    width: '100%',
    paddingBlock: 4,
    textAlign: 'center',
    backgroundColor: DARK_GRAY_COLOR,
    border: 'none',
    borderRadius: 8,
    fontSize: 12,
    p: {
      opacity: 0.6
    }


  }),
  betButton: css({
    width: '100%',
    height: '100%',
    flex: 1,
    paddingBlock: 12,
    paddingInline: 16,
    textAlign: 'center',
    backgroundColor: SUCCESS_COLOR,
    color: WHITE_COLOR,
    border: `1px solid ${BORDER_SUCCESS_COLOR}`,
    borderRadius: 16,
    fontSize: 14,
    textTransform: 'uppercase',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'background-color 0.4s ease-in-out',
    textShadow: '0 1px 2px rgba(0,0,0,.5)',
    '& .amount': {
      fontSize: 20
    },
    '&.success': {
      backgroundColor: SUCCESS_COLOR,
      color: WHITE_COLOR
    },
    '&.danger': {

    },
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
    paddingTop: 16,
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
  now: number,
  index: number
}

export type TAutoPlaySettings = {
  rounds: number,
  lossAmountLimit?: number
  winAmountLimit?: number
  singleWinLimit?: number
}

const quickBetOptions: { label: string, value: number }[] = [
  {label: '50', value: 50},
  {label: '100', value: 100},
  {label: '200', value: 200},
  {label: '500', value: 500}
]

export const BetsView: FC<InputProps> = ({gameState, startTime, now, index}) => {
  const [betAmount, setBetAmount] = useState(MINIMUM_BET);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWaitingForNext, setIsWaitingForNext] = useState(false);
  const [exitTime, setExitTime] = useState<number | null>(null);
  const [exitMultiplier, setExitMultiplier] = useState(1);
  const [buttonColor, setButtonColor] = useState(SUCCESS_COLOR);

  const [isAutoPlay, setAutoPlay] = useState(false);

  const [buttonTitle, setButtonTitle] = useState('BET');

  const [isAutoCashOut, setIsAutoCashOut] = useState(false);

  const [autoPlayMultiplierLimit, setAutoPlayMultiplierLimit] = useState(1.10);
  const [isAutoplayModalOpen, setIsAutoplayModalOpen] = useState(false);

  const [autoPlayConfig, setAutoPlayConfig] = useState<TAutoPlaySettings | undefined>(undefined);
  const [autoplayRounds, setAutoPlayRounds] = useState(0);
  const [amountLost, setAmountLost] = useState(0);
  const [amountWon, setAmountWon] = useState(0);

  const currentBetID = useBetSlipStore(state => state.currentGameID)

  const getWinAmount = () => {
    if (isWaitingForNext) {
      return betAmount
    }

    if (gameState === PLAYING && isPlaying) {
      const elapsedTime = Date.now() - startTime;
      const multiplier = Math.exp(FACTOR * elapsedTime);
      return (multiplier * betAmount).toFixed(2);
    } else if (gameState === ENDED && isPlaying) {
      return (exitMultiplier * betAmount).toFixed(2);
    } else {
      return betAmount;
    }
  }


  const handleChange = useCallback((value: number) => {
    setBetAmount(value);
    setIsPlaying(false);
  }, [setBetAmount, setIsPlaying]);

  const getMultiplier = (endedAt: number, startedAt: number) => {
    const elapsedTime = endedAt - startedAt;
    return Math.exp(FACTOR * elapsedTime);
  }


  const handleSetBet = useCallback(() => {
    if (isWaitingForNext) {
      setIsWaitingForNext(false);
      setIsPlaying(false);
      return;
    }

    if (gameState === PLAYING && isPlaying) {
      setExitTime(Date.now());
      setIsPlaying(false);
      return;
    }
    if (!isPlaying) {
      if (gameState !== WAITING) {
        setIsWaitingForNext(true);
      }
      setButtonColor(ERROR_COLOR);
      setButtonTitle('CANCEL');
      setIsPlaying(true);
      return;
    }
  }, [gameState, isPlaying, isWaitingForNext]);

  const handleEndAutobetSession = useCallback(() => {
    setAutoPlay(false);
    setAutoPlayRounds(0);
    setAmountLost(0);
    setAmountWon(0);
    setIsAutoCashOut(false);
  }, [])

  useEffect(() => {
    if (gameState === PLAYING && isAutoCashOut && isPlaying && !isWaitingForNext) {
      const multiplier = getMultiplier(now, startTime);
      if (multiplier >= autoPlayMultiplierLimit) {
        setExitTime(now);
        setExitMultiplier(multiplier);
      }
    }
  }, [autoPlayMultiplierLimit, gameState, isAutoCashOut, isPlaying, isWaitingForNext, now, startTime]);

  useEffect(() => {
    if(autoPlayConfig) {
      setAutoPlayRounds(autoPlayConfig.rounds);
      setAutoPlay(true);
      setIsAutoCashOut(true);
      setIsPlaying(true);
    }
  }, [autoPlayConfig]);

  useEffect(() => {
    switch (gameState) {
      case WAITING:
        setIsWaitingForNext(false);
        setExitTime(null);
        setExitMultiplier(0);
        if (isPlaying) {
          setButtonTitle('CANCEL');
        }
        break;
      case PLAYING:
        if (exitTime && isPlaying) {
          const multiplier = getMultiplier(Date.now(), exitTime);
          setExitMultiplier(multiplier);
          setIsWaitingForNext(false);
          setButtonColor(SUCCESS_COLOR);
          setButtonTitle('BET');
          setIsPlaying(false);
        }
        if (isPlaying && !isWaitingForNext) {
          setButtonColor(PRIMARY_COLOR);
          setButtonTitle('EXIT');
        }
        if (!isPlaying && !isWaitingForNext) {
          setButtonColor(SUCCESS_COLOR);
          setButtonTitle('BET');
        }
        break;
      case ENDED:
        if (!isWaitingForNext) {

          if(autoplayRounds > 0 && isAutoPlay ) {
            setIsPlaying(true);
            setIsAutoCashOut(true);
            setButtonColor(ERROR_COLOR);
            setButtonTitle('CANCEL')
          } else {
            setIsPlaying(false);
            setButtonColor(SUCCESS_COLOR);
            setButtonTitle('BET');
          }
        }
        break;
      default:
        break;
    }
  }, [gameState, exitTime, isWaitingForNext, isPlaying, isAutoCashOut, autoPlayMultiplierLimit, autoplayRounds, isAutoPlay]);

  // handle amount limits on autoplay

  useEffect(() => {
    if(gameState === ENDED && isAutoPlay) {
      const mySlips = useBetSlipStore.getState().myBetSlips;
      const mySlip = mySlips.find(s => s.gameId === currentBetID && index === s.index);
      if(!mySlip) return;
      if (mySlip.exitTime && mySlip.startTime) {
        const multiplier = getMultiplier(mySlip.exitTime, mySlip.startTime);
        const amountWon = Math.floor (multiplier * mySlip.amount);
        setAmountWon(prev => prev + amountWon);
        
        if(autoPlayConfig && autoPlayConfig.singleWinLimit && amountWon > autoPlayConfig.singleWinLimit) {
          handleEndAutobetSession();
        }
      } else  {
        setAmountLost(prev => prev + mySlip.amount);
      }
    }
    
  }, [autoPlayConfig, currentBetID, gameState, handleEndAutobetSession, index, isAutoPlay]);
  
  //handle end autoplay if limit exceeded

  useEffect(() => {
    if(gameState !== ENDED && !isAutoPlay) return;
    if(autoPlayConfig && autoPlayConfig.lossAmountLimit && amountLost > autoPlayConfig.lossAmountLimit) {
      handleEndAutobetSession();
    }

    if(autoPlayConfig && autoPlayConfig.winAmountLimit && amountWon > autoPlayConfig.winAmountLimit) {
      handleEndAutobetSession();
    }
  }, [amountLost, amountWon, autoPlayConfig, gameState, handleEndAutobetSession, isAutoPlay]);

  // handle bet slips
  useEffect(() => {
    const mySlips = useBetSlipStore.getState().myBetSlips;
    const mySlip = mySlips.find(s => s.gameId === currentBetID && index === s.index);

    switch (gameState) {
      case WAITING:

        if (currentBetID && isPlaying && now >= startTime) {
          if(isAutoPlay && autoplayRounds > 0) {
            setAutoPlayRounds(prev => prev - 1);
            handleSetBet();
          }
          if (!mySlip) {

            const bet: TBetSlip = {
              amount: betAmount,
              gameId: currentBetID,
              startTime: startTime,
              index
            }
            useBetSlipStore.setState((state) => ({
              myBetSlips: [...state.myBetSlips, bet]
            }))
          }
        }
        break;
      case PLAYING:
        if (exitTime && mySlip && !mySlip.exitTime) {
          mySlip.exitTime = exitTime;
          useBetSlipStore.setState((state) => ({
            myBetSlips: state.myBetSlips.map((s) => {
              if (s.gameId === currentBetID && index === s.index) {
                return mySlip;
              } else {
                return s;
              }
            })
          }))
        }
        break;
      case ENDED:
        if (mySlip) {
          mySlip.endTime = Date.now();
          useBetSlipStore.setState((state) => ({
            myBetSlips: state.myBetSlips.map((s) => {
              if (s.gameId === currentBetID && index === s.index) {
                return mySlip;
              } else {
                return s;
              }
            })
          }))
        }
        break;
      default:
        break;
    }
  }, [index, now, betAmount, currentBetID, exitTime, gameState, isPlaying, startTime, isAutoPlay, autoplayRounds, handleSetBet]);
  
  //handle notifications
  useEffect(() => {
    const mySlips = useBetSlipStore.getState().myBetSlips;
    const mySlip = mySlips.find(s => s.gameId === currentBetID && index === s.index);
    
    if(gameState !== PLAYING || !exitTime || !startTime || !mySlip) return;

    const notifications = useNotificationStore.getState().notifications;
    const winNotification = notifications.find(n => n.gameId === currentBetID);
    if(!winNotification) {

      const multiplier = getMultiplier(exitTime, startTime);
      const winAmount = multiplier * mySlip.amount;

      useNotificationStore.setState((state) => {
        return ({
          notifications: [
            {
              type: SUCCESS,
              header: "CONGRATULATIONS!!!!",
              message: `You have cashed out ${DEFAULT_CURRENCY} ${winAmount.toFixed(2)}`,
            },
            ...state.notifications,
          ]
        });
      })
    }
  }, [currentBetID, exitTime, gameState, index, startTime]);

  return (
    <div css={betInputStyles.inputContainer}>
      <AutoPlayModal isOpen={isAutoplayModalOpen} onClose={setIsAutoplayModalOpen} onStart={setAutoPlayConfig}/>
      <div css={betInputStyles.tabContainer}>
        <div onClick={() => {
          setAutoPlay(false);
        }} className={!isAutoPlay ? 'active' : ''} css={betInputStyles.tab}>Bet
        </div>
        <div onClick={() => {
          setAutoPlay(true);
        }} className={isAutoPlay ? 'active' : ''} css={betInputStyles.tab}>Auto
        </div>
      </div>
      <div css={betInputStyles.row}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 4, flex: 1}}>
          <div style={{display: 'flex', width: '100%'}}>
            <NumberInputWithButtons
              style={{width: '100%'}}
              disabled={false}
              onValueChange={handleChange}
              value={betAmount}
            />
          </div>
          <div css={betInputStyles.buttonGrid}>
            {quickBetOptions.map(option => (
              <button
                key={option.label}
                onClick={() => {
                  setBetAmount(option.value);
                }}
                css={betInputStyles.selectAmountBtn}><p>{option.label}</p></button>
            ))}
          </div>
        </div>

        <div style={{
          width: '100%',
          textAlign: 'center',
          height: '100%',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}>
          {/*{isWaitingForNext && <div>{WAITING_FOR_NEXT_ROUND}</div>}*/}
          <div style={{
            flexGrow: isWaitingForNext ? 1 : 0,
            height: isWaitingForNext ? 12 : 0,
            opacity: isWaitingForNext ? 1 : 0
          }}>{WAITING_FOR_NEXT_ROUND}</div>
          <button style={{backgroundColor: buttonColor, flexGrow: 1, flex: 1}} onClick={handleSetBet}
            css={betInputStyles.betButton}>
            <div>{buttonTitle}</div>
            <div className='amount'>ksh. {getWinAmount()} </div>
          </button>
        </div>


      </div>
      {isAutoPlay && <div css={betInputStyles.autoplayContainer}>
        <button onClick={() => {
          setIsAutoplayModalOpen(true);
        }} css={betInputStyles.autoplayButton}>
              Autoplay
        </button>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 16,
          alignItems: 'center',
          color: LIGHT_GRAY_COLOR,
          fontWeight: 500
        }}>
          <div>Auto Cash Out</div>
          <SwitchInput checked={isAutoCashOut} onChange={setIsAutoCashOut}/>
          <NumberInput
            style={{maxWidth: 80}}
            disabled={!isAutoCashOut}
            handleChange={(value) => {
              setAutoPlayMultiplierLimit(value);
            }}
            value={autoPlayMultiplierLimit}
          />
        </div>
      </div>}
    </div>
  )
}