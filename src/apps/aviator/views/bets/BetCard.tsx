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
import { getMultiplier } from "../../utils/getMultiplier.ts";
import { BetButton } from "../../components/buttons/BetButton.tsx";
import { AutoPlayControls } from "./AutoPlayControls.tsx";
import { rowStyles } from "../../styles/common.ts";
import {
  BET_STATE_CASHING_OUT,
  BET_STATE_IDLE,
  BET_STATE_PLACING,
  BET_STATE_PLAYING,
  BET_STATE_QUEUED,
  BetState,
  GAME_STATE_ENDED,
  GAME_STATE_IN_PROGRESS,
  GAME_STATE_STARTING,
  GameState,
  HTTPPlay,
  IBetPayload,
  Idx,
  TNotification,
} from "../../data/types/types.ts";
import { setAtom, useAtom } from "../../data/store/lib/atoms.ts";
import { notificationsAtom } from "../../data/store/atoms.ts";
import { TabItem } from "../../components/tabs/TabItem.tsx";
import { setBet, setNextBet } from "../../data/store/bets.store.ts";

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

type BetCardProps = {
  gameState: GameState;
  startTime: number;
  now: number;
  index: Idx;
  betState: BetState;
  nextBet?: IBetPayload;
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

export const BetCard: FC<BetCardProps> = ({
  gameState,
  startTime,
  now,
  index,
  betState,
  nextBet,
}) => {
  const [betAmount, setBetAmount] = useState(MINIMUM_BET);
  const [isPlaying, setIsPlaying] = useState(false);
  const [exitTime, setExitTime] = useState<number | null>(null);
  const [isAutoPlay, setAutoPlay] = useState(false);

  const notifications = useAtom(notificationsAtom);

  // TODO: use from data
  // const { cashout } = useBetCashout();
  // const { createBet } = useBetCreate();

  const currentBetID = useBetSlipStore((state) => state.currentGameID);

  const getWinAmount = () => {
    let amount;
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
    if(nextBet) return ERROR_COLOR;
    switch (betState) {
      case BET_STATE_IDLE:
        return SUCCESS_COLOR;
      case BET_STATE_QUEUED:
        return ERROR_COLOR;
      case BET_STATE_PLACING:
        return ERROR_COLOR;
      case BET_STATE_PLAYING:
        return WARNING_COLOR;
      case BET_STATE_CASHING_OUT:
        return WARNING_COLOR;
      default:
        return SUCCESS_COLOR;
    }
  };

  const getButtonBorder = (): string => {
    if(nextBet) return BORDER_ERROR_COLOR;
    switch (betState) {
      case BET_STATE_IDLE:
        return BORDER_SUCCESS_COLOR;
      case BET_STATE_QUEUED:
        return BORDER_ERROR_COLOR;
      case BET_STATE_PLACING:
        return BORDER_ERROR_COLOR;
      case BET_STATE_PLAYING:
        return BORDER_WARNING_COLOR;
      case BET_STATE_CASHING_OUT:
        return BORDER_WARNING_COLOR;
      default:
        return BORDER_SUCCESS_COLOR;
    }
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

  useEffect(() => {
    console.log("betState", betState);
  }, [betState]);

  // const onSetBet = useCallback(() => {
  //   if (isPlaying && gameState === GAME_STATE_STARTING) {
  //     setIsPlaying(false);
  //     return;
  //   }
  //
  //   if (gameState === GAME_STATE_IN_PROGRESS && isPlaying) {
  //     setExitTime(Date.now());
  //     setIsPlaying(false);
  //     // cashout();
  //     return;
  //   }
  //   if (!isPlaying) {
  //     if (gameState !== GAME_STATE_STARTING) {
  //       setIsPlaying(true);
  //     }
  //     setIsPlaying(true);
  //     return;
  //   }
  // }, [gameState, isPlaying]);

  const onSetBet = useCallback(() => {
    if (GAME_STATE_STARTING) {
      const bet: HTTPPlay = {
        user_id: 200009,
        xid: 0,
        game_id: 12,
        idx: index,
        currency: DEFAULT_CURRENCY,
        bet: betAmount,
        username: "test",
        crash: 0,
        created_at: Date.now(),
      };
      setBet(bet);
      return;
    } else if (GAME_STATE_IN_PROGRESS || GAME_STATE_ENDED) {
      const nextBet: IBetPayload = {
        currency: DEFAULT_CURRENCY,
        amount: betAmount,
        autoCashout: 0,
        idx: index,
      };
      setNextBet(nextBet);
    }
  }, [gameState, isPlaying]);
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
  }, [gameState, exitTime, isPlaying, isAutoPlay]);

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

    const winNotification = notifications.find(
      (n) => n.gameId === currentBetID && n.slipIndex === index,
    );
    if (!winNotification) {
      const multiplier = getMultiplier(startTime, exitTime);
      const winAmount = multiplier * mySlip.amount;
      const notification: TNotification = {
        type: SUCCESS,
        header: "CONGRATULATIONS!!!!",
        message: `You have cashed out ${DEFAULT_CURRENCY} ${winAmount.toFixed(2)}`,
        gameId: currentBetID,
        slipIndex: index,
        viewed: false,
      };
      setAtom(notificationsAtom, [notification, ...notifications]);
    }
  }, [currentBetID, exitTime, gameState, index, notifications, startTime]);

  return (
    <div css={betInputStyles.inputContainer}>
      <div css={betInputStyles.tabContainer}>
        <TabItem
          isActive={!isAutoPlay}
          onClick={() => {
            setAutoPlay(false);
          }}
        >
          Bet
        </TabItem>
        <TabItem
          isActive={isAutoPlay}
          onClick={() => {
            setAutoPlay(true);
          }}
        >
          Auto
        </TabItem>
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
            style={
              {
                // flexGrow: isWaitingForNext ? 1 : 0,
                // height: isWaitingForNext ? 12 : 0,
                // opacity: isWaitingForNext ? 1 : 0,
              }
            }
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
