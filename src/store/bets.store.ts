import {create} from "zustand";
import {devtools, persist} from "zustand/middleware";

export type TBetSlip = {
  amount: number;
  gameId: string;
  startTime?: number;
  endTime?: number;
  exitTime?: number;
  username?: string;
  round?: number;
}

type TBetSlipStore = {
  myBetSlips: TBetSlip[];
  allBetSlips: TBetSlip[];
  topBetSlips: TBetSlip[];
  currentGameID: string | undefined;
  previousGameID: string | undefined;
}


export const useBetSlipStore = create<TBetSlipStore>()(
  devtools(
    persist(
      (set, get) => ({
        myBetSlips: [],
        allBetSlips: [],
        topBetSlips: [],
        currentGameID: undefined,
        previousGameID: undefined
      }),
      {
        name: 'bets'
      }
    )
  )
);