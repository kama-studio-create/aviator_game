import {TBetSlip} from "../store/bets.store.ts";

export const getRandomNumber = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

export const randomUsernameGenerator = () => {
  return Math.random().toString(36).substring(2, 10)
}

export const uuidGenerator = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


export const generateBetSlip = (amount: number, gameId: string, startTime?: number, endTime?: number, exitTime?: number, username?: string, round?: number): TBetSlip => {

  const randomUsername = username ? username : randomUsernameGenerator();
  return {
    amount,
    gameId,
    startTime,
    endTime,
    exitTime,
    username: randomUsername,
    round
  };
}