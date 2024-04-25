import atom, { getAtom, setAtom } from "../common/atoms/atoms";
import {
  BET_STATE_IDLE,
  BET_STATE_QUEUED,
  BetState,
  GAME_STATE_ENDED,
  GameState,
  HTTPPlay,
  IBetPayload,
  IGameHistoryItem,
  IPlay,
} from "../common/types";
import { useEffect, useState } from "react";
import {
  DEFAULT_CURRENCY,
  Dual,
  FACTOR,
  GAME_STATE_IN_PROGRESS,
  GAME_STATE_STARTING,
  Idx,
  TGameState,
  WAITING_DURATION,
} from "../common/constants.ts";
import { useBetSlipStore } from "../store/bets.store.ts";
import { getRandomNumber } from "../utils/generators.ts";

export const createDual = <T>(value: T): Dual<T> => {
  return { 0: value, 1: value };
};

const mergeDual = <T>(a: Dual<T>, b: Dual<T>): Dual<T> => {
  return {
    [0]: a[0],
    [1]: b[1],
  };
};

export const roundsAtom = atom<IGameHistoryItem[]>([]);
export const userBetsAtom = atom<HTTPPlay[]>([]);

/** The game state is initialized. if not, all fields are unreadable */
export const initializedAtom = atom<boolean>(false);

/**
 * Client side times:
 * if the game is pending, startTime is how long till it starts
 * if the game is running, startTime is how long its running for
 * if the game is ended, startTime is how long since the game started
 */
export const startTimeAtom = atom<number>(0);

/**
 * Only used for simulation purposes
 * TODO: remove this on integration
 */
export const endTimeAtom = atom<number>(0);

/**
 * The state of the game
 * Possible states: IN_PROGRESS, GAME_STATE_ENDED, STARTING
 */
export const gameStateAtom = atom<GameState>(GAME_STATE_ENDED);

/** If you are currently placing a bet
 * True if the bet is queued (nextBetAmount)
 * True if the bet was sent to the server, but the server has not responded yet
 *
 * Cleared in game_started, it's possible to receive this event before receiving the response of
 */
export const betStateAtom = atom(createDual<BetState>(BET_STATE_IDLE), true);

/**
 * Queued bet: bet to be placed next round
 *
 * Saves the queued bet if the game is not 'game_starting',
 * cleared in 'place_bet_success' by us and 'game_started' and 'cancel bet'
 */
export const nextBetAtom = atom(
  createDual<IBetPayload | undefined>(undefined),
  true,
);

type PlayMap = Record<number, Record<number, IPlay>>;

/** Object containing the current game players and their status.
 * This is saved in game history every game crash, and cleared in game_starting.
 */
export const playMapAtom = atom<PlayMap>({});

export const playCountAtom = atom<number>(0);

type CrashAppOptions = {
  code: number;
  uid: string;
  now: number;
};

// code=150; uid=crash
export default function useCrashAppEffect(options: CrashAppOptions) {
  const { code, uid, now } = options;
  const startTime = getAtom(startTimeAtom);
  const endTime = getAtom(endTimeAtom);
  const [gameState, setGameState] = useState<TGameState>(
    GAME_STATE_IN_PROGRESS,
  );

  const currentGameID = useBetSlipStore((state) => state.currentGameID);
  const betSlipStore = useBetSlipStore;

  useEffect(() => {
    console.log(code, uid);
  }, [code, uid]);

  useEffect(() => {
    switch (gameState) {
      case GAME_STATE_STARTING:
        if (now > startTime) {
          setGameState(GAME_STATE_IN_PROGRESS);
        }
        break;
      case GAME_STATE_IN_PROGRESS:
        if (now > endTime) {
          const multiplier = Math.exp(FACTOR * (endTime - startTime));
          useBetSlipStore.setState((state) => ({
            previousRounds: [multiplier, ...state.previousRounds],
          }));
          setGameState(GAME_STATE_ENDED);
        }
        break;
      case GAME_STATE_ENDED:
        if (now > endTime + WAITING_DURATION) {
          setAtom(startTimeAtom, Date.now() + WAITING_DURATION);
          setGameState(GAME_STATE_STARTING);
        }
        break;
      default:
        break;
    }
  }, [betSlipStore, currentGameID, endTime, gameState, now, startTime]);

  useEffect(() => {
    if (gameState === GAME_STATE_STARTING) {
      const start = Date.now() + WAITING_DURATION;
      const end = start + getRandomNumber(3000, 25000);
      setAtom(startTimeAtom, start);
      setAtom(endTimeAtom, end);
    }
  }, [gameState]);

  return { gameState, startTime, endTime };
}

export function useBetCashout() {
  return function cashout(idx: Idx): void {};
}

export function useBetCreate() {
  const currency = DEFAULT_CURRENCY;

  return function createBet(params: Omit<IBetPayload, "currency">) {
    console.log(params);
    return true;
  };
}

export function useCancelBet() {
  return function cancelBet(idx: Idx) {
    if (getAtom(betStateAtom)[idx] !== BET_STATE_QUEUED) return false;

    setAtom(nextBetAtom, mergeDual(idx, undefined));
    setAtom(betStateAtom, mergeDual(idx, BET_STATE_IDLE));
    return true;
  };
}
