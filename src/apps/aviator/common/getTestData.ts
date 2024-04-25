import { getRandomNumber } from "../utils/generators.ts";

export const getTestData = () => {
  const res: number[] = [];
  for (let i = 0; i < 70; i++) {
    const n = getRandomNumber(1, 30).toFixed(2);
    res.push(Number(n));
  }
  return res;
};
