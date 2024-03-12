import {breakpoints} from "../styles/breakpoints.ts";

export const PLANE_FRAME_RATE = 8;
export const BORDER_RADIUS = '8px';
export const PLANE_WIDTH = window.innerWidth > breakpoints[0] ? 150 : 75;
export const PLANE_HEIGHT = window.innerWidth > breakpoints[0] ? 74 : 37;