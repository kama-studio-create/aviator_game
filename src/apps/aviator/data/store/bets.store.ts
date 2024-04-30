import { BET_STATE_QUEUED, HTTPPlay, IBetPayload } from "../types/types.ts";
import {
  betStateAtom,
  nextBetAtom,
  topWinsAtom,
  userBetsAtom,
} from "./atoms.ts";
import { setAtom } from "./lib/atoms.ts";

export const setBet = (bet: HTTPPlay) => {
  const bets = userBetsAtom.initial;
  const betState = betStateAtom.initial;
  bets[bet.idx] = bet;
  setAtom(userBetsAtom, bets);
  betState[bet.idx] = BET_STATE_QUEUED;
  return true;
};

export const setNextBet = (bet: IBetPayload) => {
  const bets = nextBetAtom.initial;
  bets[bet.idx] = bet;
  setAtom(nextBetAtom, bets);
  return true;
};

export const setTopWins = (bets: HTTPPlay[]) => {
  return setAtom(topWinsAtom, bets);
};
