import {create} from "zustand";
import {devtools} from "zustand/middleware";

export type TBetSlip = {
  amount: number;
  gameId: string;
  startTime?: number;
  endTime?: number;
  exitTime?: number;
  username?: string;
  round?: number;
  index?: number;
}

interface IBetSlipStore {
  myBetSlips: TBetSlip[];
  allBetSlips: TBetSlip[];
  topBetSlips: TBetSlip[];
  currentGameID: string;
  previousGameID: string;
  addNewSlip: (bet: TBetSlip) => void;
}


export const useBetSlipStore = create<IBetSlipStore>()(
  devtools(
    (set) => ({
      myBetSlips: [] as TBetSlip[],
      allBetSlips: [] as TBetSlip[],
      topBetSlips: [] as TBetSlip[],
      currentGameID: '',
      previousGameID: '',
      addNewSlip: (bet) => {
        console.log(bet);
        set((state) => ({myBetSlips: [...state.myBetSlips, bet]}));
      }
    })
  )
);