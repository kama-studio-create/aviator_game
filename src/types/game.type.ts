const GAME_STATES = ['WAITING', 'PLAYING', 'EXITED', 'ENDED'] as const;
export type GameState = (typeof GAME_STATES)[number]
