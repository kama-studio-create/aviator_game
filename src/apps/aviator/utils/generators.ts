import { TBetSlip } from "../data/store/zustanf/bets.store.ts";
import { HTTPPlay } from "../data/types/types.ts";
import { DEFAULT_CURRENCY, WAITING_DURATION } from "../common/constants.ts";
import { setAllBets, setTopWins } from "../data/store/bets.store.ts";
import { setAtom } from "../data/store/lib/atoms.ts";
import { loadingBetsAtom } from "../data/store/atoms.ts";

export const getRandomNumber = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

export const randomUsernameGenerator = () => {
  return Math.random().toString(36).substring(2, 10);
};

export const uuidGenerator = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const generateBetSlip = (
  amount: number,
  gameId: string,
  startTime?: number,
  endTime?: number,
  exitTime?: number,
  username?: string,
  round?: number,
): TBetSlip => {
  const randomUsername = username ? username : randomUsernameGenerator();
  return {
    amount,
    gameId,
    startTime,
    endTime,
    exitTime,
    username: randomUsername,
    round,
  };
};

type TopWinProps = {
  from: Date;
  to: Date;
};

export const generateTopWins = (total: number, params: TopWinProps) => {
  setAtom(loadingBetsAtom, true);
  const slips: HTTPPlay[] = [];
  setTimeout(() => {
    for (let i = 0; i < total; i++) {
      const slip: HTTPPlay = {
        user_id: getRandomNumber(1, 2000000000000),
        xid: getRandomNumber(1, 2000000000000),
        game_id: getRandomNumber(1, 2000000000000),
        idx: 0,
        currency: DEFAULT_CURRENCY,
        bet: getRandomNumber(1, 200000),
        username: randomUsernameGenerator(),
        crash: getRandomNumber(10, 200),
        created_at: Date.now(),
      };
      slips.push(slip);
    }
    setTopWins(slips);
    setAtom(loadingBetsAtom, false);
  }, 2000);
};
export const generateAllBets = (total: number) => {
  setAtom(loadingBetsAtom, true);
  const slips: HTTPPlay[] = [];
  setTimeout(() => {
    for (let i = 0; i < total; i++) {
      const slip: HTTPPlay = {
        user_id: getRandomNumber(1, 2000000000000),
        xid: getRandomNumber(1, 2000000000000),
        game_id: getRandomNumber(1, 2000000000000),
        idx: 0,
        currency: DEFAULT_CURRENCY,
        bet: getRandomNumber(1, 200000),
        username: randomUsernameGenerator(),
        crash: i % 3 === 0 ? getRandomNumber(10, 200) : 0,
        created_at: Date.now(),
        stopped_at:  i % 3 === 0 ? Date.now() + WAITING_DURATION : undefined,
      };
      slips.push(slip);
    }
    setAllBets(slips);
    setAtom(loadingBetsAtom, false);
  }, 2000);
};
