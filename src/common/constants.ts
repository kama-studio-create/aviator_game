export const CANVAS_PADDING = 16;
export const CANVAS_START_POSITION = CANVAS_PADDING * 2;

export const PLANE_FRAME_RATE = 60;
export const BORDER_RADIUS = '8px';
export const APP_NAME = 'Aviator';

export const WAITING_DURATION = 6000;

export const WAITING = 'WAITING';
export const PLAYING = 'PLAYING';
export const ENDED = 'ENDED';

export const AUDIO_START = "start";
export const AUDIO_FLY_AWAY = "flyAway";
export const TIME_TO_TOP = 3200;
export const HOVER_OFFSET_CONST = 96;

export const DOT_RADIUS = 2;
export const DOT_SPACING = 40;
export const DOT_SCROLL_SPEED = 10;

export const MINIMUM_BET = 10.00;
export const FACTOR = 0.00006;

export const WAITING_FOR_NEXT_ROUND = 'Waiting For Next Round';
export const DEFAULT_CURRENCY = 'KES';

export const STOP_IF_CASH_DECREASES = 'Stop If Cash Decreases by';
export const STOP_IF_CASH_INCREASES = 'Stop If Cash Increases by';
export const STOP_IF_SINGLE_WIN_EXCEEDS = 'Stop If Single Win Exceeds';

export const ERROR = 'error';
export const SUCCESS ='success';
export const NOTIFICATION_VISIBILITY = 5000;



const GAME_STATES = [WAITING, PLAYING, ENDED] as const;
export type TGameState = (typeof GAME_STATES)[number]

const NOTIFICATION_STATES = [ERROR, SUCCESS] as const;
export type TNotificationState = (typeof NOTIFICATION_STATES)[number]
