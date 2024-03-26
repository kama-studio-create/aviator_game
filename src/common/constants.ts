export const CANVAS_PADDING = 16;

export const PLANE_FRAME_RATE = 60;
export const BORDER_RADIUS = '8px';
export const PLANE_WIDTH =  75;
export const PLANE_HEIGHT =  37;

export const WAITING_DURATION = 6000;

export const WAITING = 'WAITING';
export const PLAYING  = 'PLAYING';
export const ENDED = 'ENDED';
export const UP = 'UP';
export const DOWN = 'DOWN';

export const AUDIO_START = "start";
export const AUDIO_FLY_AWAY = "flyAway";
export const PLANE_FLIGHT_RATE = 0.0012;

export const DOT_RADIUS = 2;
export const DOT_SPACING = 80;

const GAME_STATES = [WAITING, PLAYING, ENDED] as const;
const PLANE_DIRECTIONS = [UP, DOWN]
export type IGameState = (typeof GAME_STATES)[number]
export type IPlaneDirection = (typeof PLANE_DIRECTIONS)[number];
