import { Dual } from "../../types/types.ts";

export const createDual = <T>(value: T): Dual<T> => {
  return { 0: value, 1: value };
};

export const mergeDual = <T>(a: Dual<T>, b: Dual<T>): Dual<T> => {
  return {
    [0]: a[0],
    [1]: b[1],
  };
};
