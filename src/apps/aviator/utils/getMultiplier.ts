import { FACTOR } from "../common/constants.ts";

export const getMultiplier = (startTime: number, endTime: number): number => {
  const elapsed = endTime - startTime;
  return Math.exp(FACTOR * elapsed);
};
