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

export const MINIMUM_BET = 10.00;
export const FACTOR = 0.00006;

export const WAITING_FOR_NEXT_ROUND= 'Waiting For Next Round';
export const DEFAULT_CURRENCY = 'KSH';

export const STOP_IF_CASH_DECREASES = 'Stop If Cash Decreases';
export const STOP_IF_CASH_INCREASES = 'Stop If Cash Increases';
export const STOP_IF_SINGLE_WIN_EXCEEDS = 'Stop If Single Win Exceeds';

const GAME_STATES = [WAITING, PLAYING, ENDED] as const;
export type TGameState = (typeof GAME_STATES)[number]
