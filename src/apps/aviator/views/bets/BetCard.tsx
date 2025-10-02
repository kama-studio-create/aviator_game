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
    if (nextBet) return ERROR_COLOR;
    switch (betState) {
      case BET_STATE_IDLE:
        return SUCCESS_COLOR;
      case BET_STATE_QUEUED:
      case BET_STATE_PLACING:
        return ERROR_COLOR;
      case BET_STATE_PLAYING:
      case BET_STATE_CASHING_OUT:
        return WARNING_COLOR;
      default:
        return SUCCESS_COLOR;
    }
  };

  const getButtonBorder = (): string => {
    if (nextBet) return BORDER_ERROR_COLOR;
    switch (betState) {
      case BET_STATE_IDLE:
        return BORDER_SUCCESS_COLOR;
      case BET_STATE_QUEUED:
      case BET_STATE_PLACING:
        return BORDER_ERROR_COLOR;
      case BET_STATE_PLAYING:
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

  const onSetBet = useCallback(() => {
    if (gameState === GAME_STATE_STARTING) {
      // Place bet before takeoff
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
      setIsPlaying(true);
      return;
    }

    if (gameState === GAME_STATE_IN_PROGRESS && isPlaying) {
      // Cash out while flying
      setExitTime(Date.now());
      setIsPlaying(false);
      // TODO: integrate cashout API
      return;
    }

    if (gameState === GAME_STATE_ENDED) {
      // Queue bet for next round
      const queuedBet: IBetPayload = {
        currency: DEFAULT_CURRENCY,
        amount: betAmount,
        autoCashout: 0,
        idx: index,
      };
      setNextBet(queuedBet);
    }
  }, [gameState, isPlaying, betAmount, index]);

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
        break;
      default:
        break;
    }
  }, [gameState, exitTime, isPlaying]);

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
          onClick={() => setAutoPlay(false)}
        >
          Bet
        </TabItem>
        <TabItem
          isActive={isAutoPlay}
          onClick={() => setAutoPlay(true)}
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
                onClick={() => setBetAmount(option.value)}
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
            flex: 5,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <div>{WAITING_FOR_NEXT_ROUND}</div>
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
