import { BET_STATE_QUEUED, IBetPayload, Idx } from "../data/types/types.ts";
import { DEFAULT_CURRENCY } from "../common/constants.ts";
import { getAtom } from "../data/store/lib/atoms.ts";
import { betStateAtom } from "../data/store/atoms.ts";

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

    // setAtom(nextBetAtom, mergeDual(undefined));
    // setAtom(betStateAtom, mergeDual(BET_STATE_IDLE));
    return true;
  };
}
