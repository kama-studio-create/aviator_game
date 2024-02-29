const GAME_STATES = ['WAITING', 'PLAYING', 'EXITED', 'ENDED'] as const;
export type IGameState = (typeof GAME_STATES)[number]
