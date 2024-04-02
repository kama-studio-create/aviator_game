export const CANVAS_PADDING = 16;

export const PLANE_FRAME_RATE = 60;
export const BORDER_RADIUS = '8px';
export const APP_NAME = 'Aviator';

export const WAITING_DURATION = 6000;

export const WAITING = 'WAITING';
export const PLAYING  = 'PLAYING';
export const ENDED = 'ENDED';

export const AUDIO_START = "start";
export const AUDIO_FLY_AWAY = "flyAway";
export const TIME_TO_TOP = 1500;

export const DOT_RADIUS = 2;
export const DOT_SPACING = 80;
export const DOT_SCROLL_SPEED = 20;

const GAME_STATES = [WAITING, PLAYING, ENDED] as const;
export type IGameState = (typeof GAME_STATES)[number]
