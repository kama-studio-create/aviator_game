import { getAtom, setAtom, subAtom } from "../lib/atoms.ts";
import { useEffect, useState } from "react";
import { FACTOR, WAITING_DURATION } from "../../../common/constants.ts";
import { useBetSlipStore } from "../zustanf/bets.store.ts";
import { getRandomNumber } from "../../../utils/generators.ts";
import { endTimeAtom, gameStateAtom, startTimeAtom } from "../atoms.ts";
import {
  GAME_STATE_ENDED,
  GAME_STATE_IN_PROGRESS,
  GAME_STATE_STARTING,
  GameState,
} from "../../types/types.ts";

type CrashAppOptions = {
  code: number;
  uid: string;
};

// code=150; uid=crash
export default function useCrashAppEffect(options: CrashAppOptions) {
  const now = Date.now();

  const setGameStateAtom = (state: GameState) => {
    return setAtom(gameStateAtom, state);
  };

  const [gameState, setGameState] = useState(GAME_STATE_ENDED);

  const { code, uid } = options;
  const startTime = getAtom(startTimeAtom);
  const endTime = getAtom(endTimeAtom);

  const currentGameID = useBetSlipStore((state) => state.currentGameID);
  const betSlipStore = useBetSlipStore;

  useEffect(() => {
    console.log(code, uid);
  }, [code, uid]);

  useEffect(() => {
    const onGameStateChange = (state: GameState, previousState: GameState) => {
      if (state === previousState) return;
      console.log(`Game state changed from ${previousState} to ${state}`);
      setGameState(state);
    };

    subAtom(gameStateAtom, onGameStateChange);
  }, []);

  useEffect(() => {
    switch (gameState) {
      case GAME_STATE_STARTING:
        if (now > startTime) {
          setGameStateAtom(GAME_STATE_IN_PROGRESS);
        }
        break;
      case GAME_STATE_IN_PROGRESS:
        if (now > endTime) {
          const multiplier = Math.exp(FACTOR * (endTime - startTime));
          useBetSlipStore.setState((state) => ({
            previousRounds: [multiplier, ...state.previousRounds],
          }));
          setGameStateAtom(GAME_STATE_ENDED);
        }
        break;
      case GAME_STATE_ENDED:
        if (now > endTime + WAITING_DURATION) {
          setAtom(startTimeAtom, Date.now() + WAITING_DURATION);
          setGameStateAtom(GAME_STATE_STARTING);
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
