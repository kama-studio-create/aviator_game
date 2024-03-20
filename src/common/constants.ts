import {breakpoints} from "../styles/breakpoints.ts";

export const PLANE_FRAME_RATE = 12;
export const BORDER_RADIUS = '8px';
export const PLANE_WIDTH = window.innerWidth > breakpoints[0] ? 150 : 75;
export const PLANE_HEIGHT = window.innerWidth > breakpoints[0] ? 74 : 37;

export const WAITING_DURATION = 6000;

export const WAITING = 'WAITING';
export const PLAYING  = 'PLAYING';
export const ENDED = 'ENDED';
export const UP = 'UP';
export const DOWN = 'DOWN';

export const AUDIO_START = "start";
export const AUDIO_FLY_AWAY = "flyAway";
export const PLANE_FLIGHT_RATE = 0.0012;

const GAME_STATES = [WAITING, PLAYING, ENDED] as const;
const PLANE_DIRECTIONS = [UP, DOWN]
export type IGameState = (typeof GAME_STATES)[number]
export type IPlaneDirection = (typeof PLANE_DIRECTIONS)[number];
