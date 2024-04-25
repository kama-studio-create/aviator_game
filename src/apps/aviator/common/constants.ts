export const CANVAS_PADDING = 8;
export const CANVAS_START_POSITION = CANVAS_PADDING * 2;

export const PLANE_FRAME_RATE = 60;
export const BORDER_RADIUS = "8px";
export const APP_NAME = "Aviator";

export const WAITING_DURATION = 6000;

export const GAME_STATE_STARTING = 1;
export const GAME_STATE_IN_PROGRESS = 3;
export const GAME_STATE_ENDED = 4;

export const AUDIO_START = "start";
export const AUDIO_FLY_AWAY = "flyAway";
export const TIME_TO_TOP = 3200;
export const HOVER_OFFSET_CONST = 96;

export const DOT_RADIUS = 2;
export const DOT_SPACING = 40;
export const DOT_SCROLL_SPEED = 10;

export const MINIMUM_BET = 10.0;
export const FACTOR = 0.00006;

export const WAITING_FOR_NEXT_ROUND = "Waiting For Next Round";
export const DEFAULT_CURRENCY = "KES";

export const STOP_IF_CASH_DECREASES = "Stop If Cash Decreases by";
export const STOP_IF_CASH_INCREASES = "Stop If Cash Increases by";
export const STOP_IF_SINGLE_WIN_EXCEEDS = "Stop If Single Win Exceeds";

export const ERROR = "error";
export const SUCCESS = "success";
export const NOTIFICATION_VISIBILITY = 5000;

export const SOUND = "sound";
export const MUSIC = "music";
export const ANIMATION = "animation";
export const FREE_BETS = "free bets";
export const PROVABLY_FAIR_SETTINGS = "provably fair settings";
export const GAME_RULES = "game rules";
export const MY_BET_HISTORY = "my bet history";
export const GAME_LIMITS = "game limits";
export const HOME = "home";
export const ROUND_HISTORY = "round history";
export const CODE = 106;
export const UID = "crash";
export const URL = "";

const GAME_STATES = [
  GAME_STATE_STARTING,
  GAME_STATE_IN_PROGRESS,
  GAME_STATE_ENDED,
] as const;
export type TGameState = (typeof GAME_STATES)[number];

const NOTIFICATION_STATES = [ERROR, SUCCESS] as const;
export type TNotificationState = (typeof NOTIFICATION_STATES)[number];
export type Idx = 0 | 1;
export type Dual<T> = Record<Idx, T>;
