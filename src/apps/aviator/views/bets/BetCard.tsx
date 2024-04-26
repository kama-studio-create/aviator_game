import { css } from "@emotion/react";
import {
  BACKGROUND_COLOR,
  BORDER_ERROR_COLOR,
  BORDER_SUCCESS_COLOR,
  BORDER_WARNING_COLOR,
  DARK_GRAY_COLOR,
  ERROR_COLOR,
  SUCCESS_COLOR,
  WARNING_COLOR,
  WHITE_COLOR,
} from "../../styles/colors.ts";
import { FC, useCallback, useEffect, useState } from "react";
import {
  DEFAULT_CURRENCY,
  FACTOR,
  MINIMUM_BET,
  SUCCESS,
  WAITING_FOR_NEXT_ROUND,
} from "../../common/constants.ts";
import { NumberInputWithButtons } from "../../components/inputs/NumberInputWithButtons.tsx";
import { useBetSlipStore } from "../../data/store/zustanf/bets.store.ts";
import { useNotificationStore } from "../../data/store/notifications.store.ts";
import { getMultiplier } from "../../utils/getMultiplier.ts";
import { BetButton } from "../../components/buttons/BetButton.tsx";
import { AutoPlayControls } from "./AutoPlayControls.tsx";
import { rowStyles } from "../../styles/common.ts";
import {
  GAME_STATE_ENDED,
  GAME_STATE_IN_PROGRESS,
  GAME_STATE_STARTING,
  GameState,
} from "../../data/types/types.ts";

const betInputStyles = {
  row: css({
    display: "flex",
    flexDirection: "row",
    gap: 8,
    position: "relative",
    alignItems: "center",
  }),
  inputContainer: css({
    width: "100%",
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    flex: 1,
    backgroundColor: "#1b1c1d",
    borderRadius: 8,
  }),
  tabContainer: css({
    display: "flex",
    flexDirection: "row",
    width: "60%",
    padding: 2,
    backgroundColor: "#141516",
    borderRadius: 16,
    marginInline: "auto",
  }),
  tab: css({
    width: "100%",
    padding: 4,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    flex: 1,
    backgroundColor: "transparent",
    borderRadius: 16,
    textAlign: "center",
    fontSize: 12,
    opacity: 0.6,
    "&.active": {
      backgroundColor: BACKGROUND_COLOR,
      // border: `1px solid ${DARK_GRAY_COLOR}`,
      opacity: 1,
    },
    transition: "background-color 0.2s ease-in-out",
  }),

  amountContainer: css({
    display: "flex",
    flexDirection: "column",
    gap: 4,
    flex: 3,
  }),

  smallBtn: css({
    width: 6,
    height: 6,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    backgroundColor: "transparent",
    fontSize: 12,
    border: "none",
    ":hover": {
      backgroundColor: "#1b1c1d",
    },
  }),

  buttonGrid: css({
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 4,
    marginInline: "auto",
    width: "100%",
    button: {
      color: WHITE_COLOR,
    },
  }),
  selectAmountBtn: css({
    width: "100%",
    paddingBlock: 4,
    textAlign: "center",
    backgroundColor: DARK_GRAY_COLOR,
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    p: {
      opacity: 0.6,
    },
  }),
};

type InputProps = {
  gameState: GameState;
  startTime: number;
  now: number;
  index: number;
};

export type TAutoPlaySettings = {
  rounds: number;
  lossAmountLimit?: number;
  winAmountLimit?: number;
  singleWinLimit?: number;
};

const quickBetOptions: { label: string; value: number }[] = [
  { label: "50", value: 50 },
  { label: "100", value: 100 },
  { label: "200", value: 200 },
  { label: "500", value: 500 },
];

export const BetCard: FC<InputProps> = ({
  gameState,
  startTime,
  now,
  index,
}) => {
  const [betAmount, setBetAmount] = useState(MINIMUM_BET);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWaitingForNext, setIsWaitingForNext] = useState(false);
  const [exitTime, setExitTime] = useState<number | null>(null);
  const [isAutoPlay, setAutoPlay] = useState(false);

  // TODO: use from data
  // const { cashout } = useBetCashout();
  // const { createBet } = useBetCreate();

  const currentBetID = useBetSlipStore((state) => state.currentGameID);

  const getWinAmount = () => {
    let amount;
    if (isWaitingForNext) {
      return betAmount;
    }

    if (gameState === GAME_STATE_IN_PROGRESS && isPlaying) {
      const elapsedTime = Date.now() - startTime;
      const multiplier = Math.exp(FACTOR * elapsedTime);
      amount = multiplier * betAmount;
    } else if (gameState === GAME_STATE_ENDED && isPlaying && exitTime) {
      const exitMultiplier = getMultiplier(startTime, exitTime);
      amount = exitMultiplier * betAmount;
    } else {
      amount = betAmount;
    }
    return amount;
  };

  const getButtonColor = (): string => {
    let color = SUCCESS_COLOR;
    if (gameState === GAME_STATE_IN_PROGRESS && isPlaying) {
      color = WARNING_COLOR;
    } else if (
      (gameState === GAME_STATE_ENDED && isPlaying) ||
      (gameState === GAME_STATE_STARTING && isPlaying)
    ) {
      color = ERROR_COLOR;
    }
    return color;
  };

  const getButtonBorder = (): string => {
    let color = BORDER_SUCCESS_COLOR;
    if (gameState === GAME_STATE_IN_PROGRESS && isPlaying) {
      color = BORDER_WARNING_COLOR;
    } else if (
      (gameState === GAME_STATE_ENDED && isPlaying) ||
      (gameState === GAME_STATE_STARTING && isPlaying)
    ) {
      color = BORDER_ERROR_COLOR;
    }
    return color;
  };

  const getButtonTitle = (): string => {
    let title = "BET";
    if (gameState === GAME_STATE_IN_PROGRESS && isPlaying) {
      title = "Cash Out";
    } else if (
      (gameState === GAME_STATE_ENDED && isPlaying) ||
      (gameState === GAME_STATE_STARTING && isPlaying)
    ) {
      title = "CANCEL";
    }
    return title;
  };

  const onBetAmountChange = useCallback((value: number) => {
    setBetAmount(value);
  }, []);

  const onSetBet = useCallback(() => {
    if (isPlaying && gameState === GAME_STATE_STARTING) {
      setIsPlaying(false);
      return;
    }

    if (gameState === GAME_STATE_IN_PROGRESS && isPlaying) {
      setExitTime(Date.now());
      setIsPlaying(false);
      // cashout();
      return;
    }
    if (!isPlaying) {
      if (gameState !== GAME_STATE_STARTING) {
        setIsWaitingForNext(true);
      }
      setIsPlaying(true);
      return;
    }
  }, [gameState, isPlaying, isWaitingForNext]);

  useEffect(() => {
    switch (gameState) {
      case GAME_STATE_STARTING:
        setExitTime(null);
        break;
      case GAME_STATE_IN_PROGRESS:
        if (exitTime && isPlaying) {
          setIsPlaying(false);
        }
        break;
      case GAME_STATE_ENDED:
        // if (!isWaitingForNext) {
        //   if (autoplayRounds > 0 && isAutoPlay) {
        //     setIsPlaying(true);
        //     setIsAutoCashOut(true);
        //   } else {
        //     setIsPlaying(false);
        //   }
        // }
        break;
      default:
        break;
    }
  }, [gameState, exitTime, isWaitingForNext, isPlaying, isAutoPlay]);

  // handle amount limits on autoplay

  //TODO: make the loss and win be based on the end amount
  // useEffect(() => {
  //   if (gameState === GAME_STATE_ENDED && isAutoPlay) {
  //     const mySlips = useBetSlipStore.getState().myBetSlips;
  //     const mySlip = mySlips.find(
  //       (s) => s.gameId === currentBetID && index === s.index,
  //     );
  //     if (!mySlip) return;
  //     if (mySlip.exitTime && mySlip.startTime) {
  //       const multiplier = getMultiplier(mySlip.exitTime, mySlip.startTime);
  //       const amountWon = Math.floor(multiplier * mySlip.amount);
  //       setAmountWon((prev) => prev + amountWon);
  //
  //       if (
  //         autoPlayConfig &&
  //         autoPlayConfig.singleWinLimit &&
  //         amountWon > autoPlayConfig.singleWinLimit
  //       ) {
  //         onEndAutoPlaySession();
  //       }
  //     } else {
  //       setAmountLost((prev) => prev + mySlip.amount);
  //     }
  //   }
  // }, [
  //   autoPlayConfig,
  //   currentBetID,
  //   gameState,
  //   onEndAutoPlaySession,
  //   index,
  //   isAutoPlay,
  // ]);

  //handle end autoplay if limit exceeded

  // useEffect(() => {
  //   if (gameState !== GAME_STATE_ENDED && !isAutoPlay) return;
  //   if (
  //     autoPlayConfig &&
  //     autoPlayConfig.lossAmountLimit &&
  //     amountLost > autoPlayConfig.lossAmountLimit
  //   ) {
  //     onEndAutoPlaySession();
  //   }
  //
  //   if (
  //     autoPlayConfig &&
  //     autoPlayConfig.winAmountLimit &&
  //     amountWon > autoPlayConfig.winAmountLimit
  //   ) {
  //     onEndAutoPlaySession();
  //   }
  // }, [
  //   amountLost,
  //   amountWon,
  //   autoPlayConfig,
  //   gameState,
  //   onEndAutoPlaySession,
  //   isAutoPlay,
  // ]);

  // handle bet slips
  // useEffect(() => {
  //   const mySlips = useBetSlipStore.getState().myBetSlips;
  //   const mySlip = mySlips.find(
  //     (s) => s.gameId === currentBetID && index === s.index,
  //   );
  //
  //   switch (gameState) {
  //     case GAME_STATE_STARTING:
  //       if (currentBetID && isPlaying && now >= startTime) {
  //         if (isAutoPlay && autoplayRounds > 0) {
  //           setAutoPlayRounds((prev) => prev - 1);
  //           onSetBet();
  //         }
  //         if (!mySlip) {
  //           const bet: TBetSlip = {
  //             amount: betAmount,
  //             gameId: currentBetID,
  //             startTime: startTime,
  //             index,
  //           };
  //           useBetSlipStore.setState((state) => ({
  //             myBetSlips: [...state.myBetSlips, bet],
  //           }));
  //         }
  //       }
  //       break;
  //     case GAME_STATE_IN_PROGRESS:
  //       if (exitTime && mySlip && !mySlip.exitTime) {
  //         mySlip.exitTime = exitTime;
  //         useBetSlipStore.setState((state) => ({
  //           myBetSlips: state.myBetSlips.map((s) => {
  //             if (s.gameId === currentBetID && index === s.index) {
  //               return mySlip;
  //             } else {
  //               return s;
  //             }
  //           }),
  //         }));
  //       }
  //       break;
  //     case GAME_STATE_ENDED:
  //       if (mySlip) {
  //         mySlip.endTime = Date.now();
  //         useBetSlipStore.setState((state) => ({
  //           myBetSlips: state.myBetSlips.map((s) => {
  //             if (s.gameId === currentBetID && index === s.index) {
  //               return mySlip;
  //             } else {
  //               return s;
  //             }
  //           }),
  //         }));
  //       }
  //       break;
  //     default:
  //       break;
  //   }
  // }, [
  //   index,
  //   now,
  //   betAmount,
  //   currentBetID,
  //   exitTime,
  //   gameState,
  //   isPlaying,
  //   startTime,
  //   isAutoPlay,
  //   autoplayRounds,
  //   onSetBet,
  // ]);

  //handle notifications
  useEffect(() => {
    const mySlips = useBetSlipStore.getState().myBetSlips;
    const mySlip = mySlips.find(
      (s) => s.gameId === currentBetID && index === s.index,
    );

    if (
      gameState !== GAME_STATE_IN_PROGRESS ||
      !exitTime ||
      !startTime ||
      !mySlip
    )
      return;

    const notifications = useNotificationStore.getState().notifications;
    const winNotification = notifications.find(
      (n) => n.gameId === currentBetID && n.slipIndex === index,
    );
    if (!winNotification) {
      const multiplier = getMultiplier(startTime, exitTime);
      const winAmount = multiplier * mySlip.amount;

      useNotificationStore.setState((state) => {
        return {
          notifications: [
            {
              type: SUCCESS,
              header: "CONGRATULATIONS!!!!",
              message: `You have cashed out ${DEFAULT_CURRENCY} ${winAmount.toFixed(2)}`,
              gameId: currentBetID,
              slipIndex: index,
              viewed: false,
            },
            ...state.notifications,
          ],
        };
      });
    }
  }, [currentBetID, exitTime, gameState, index, startTime]);

  return (
    <div css={betInputStyles.inputContainer}>
      <div css={betInputStyles.tabContainer}>
        <div
          onClick={() => {
            setAutoPlay(false);
          }}
          className={!isAutoPlay ? "active" : ""}
          css={betInputStyles.tab}
        >
          Bet
        </div>
        <div
          onClick={() => {
            setAutoPlay(true);
          }}
          className={isAutoPlay ? "active" : ""}
          css={betInputStyles.tab}
        >
          Auto
        </div>
      </div>
      <div css={betInputStyles.row}>
        <div css={betInputStyles.amountContainer}>
          <div css={rowStyles}>
            <NumberInputWithButtons
              style={{ width: "100%" }}
              disabled={false}
              onValueChange={onBetAmountChange}
              value={betAmount}
            />
          </div>
          <div css={betInputStyles.buttonGrid}>
            {quickBetOptions.map((option) => (
              <button
                key={option.label}
                onClick={() => {
                  setBetAmount(option.value);
                }}
                css={betInputStyles.selectAmountBtn}
              >
                <p>{option.label}</p>
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            width: "100%",
            textAlign: "center",
            height: "100%",
            flex: 5,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <div
            style={{
              flexGrow: isWaitingForNext ? 1 : 0,
              height: isWaitingForNext ? 12 : 0,
              opacity: isWaitingForNext ? 1 : 0,
            }}
          >
            {WAITING_FOR_NEXT_ROUND}
          </div>
          <BetButton
            style={{
              backgroundColor: getButtonColor(),
              border: `1px solid ${getButtonBorder()}`,
            }}
            onClick={onSetBet}
            backgroundColor={getButtonColor()}
            borderColor={getButtonBorder()}
            title={getButtonTitle()}
            amount={getWinAmount()}
          />
        </div>
      </div>
      {isAutoPlay && <AutoPlayControls now={now} />}
    </div>
  );
};
