import { create } from "zustand";
import { getTestData } from "../../../common/getTestData.ts";
import createStore from "../lib/atoms.ts";

export type TBetSlip = {
  amount: number;
  gameId: string;
  startTime?: number;
  endTime?: number;
  exitTime?: number;
  username?: string;
  round?: number;
  index?: number;
};

interface IBetSlipStore {
  myBetSlips: TBetSlip[];
  allBetSlips: TBetSlip[];
  topBetSlips: TBetSlip[];
  currentGameID: string;
  previousGameID: string;

  previousRounds: number[];
}

const testRoundsData = getTestData();

export const useBetSlipStore = create<IBetSlipStore>()(() => ({
  myBetSlips: [] as TBetSlip[],
  allBetSlips: [] as TBetSlip[],
  topBetSlips: [] as TBetSlip[],
  currentGameID: "",
  previousGameID: "",
  previousRounds: testRoundsData,
}));



const betStore = createStore({});