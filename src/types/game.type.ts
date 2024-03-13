import {DOWN, ENDED, PLAYING, UP, WAITING} from "../common/constants.ts";

const GAME_STATES = [WAITING, PLAYING, ENDED] as const;
const PLANE_DIRECTIONS = [UP, DOWN]
export type IGameState = (typeof GAME_STATES)[number]
export type IPlaneDirection = (typeof PLANE_DIRECTIONS)[number];