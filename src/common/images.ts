import PlaneImage from "../assets/plane.svg";
import BgImage from "../assets/canvas-bg.svg";
import SpinnerImage from "../assets/spinner.svg";
import Plane2 from '../assets/plane/plane_2.svg';


export const plane1 = new Image();
plane1.src = PlaneImage;

export const plane2 = new Image();
plane2.src = Plane2;

export const backgroundImage = new Image();
export const spinnerImage = new Image();

backgroundImage.src = BgImage;
spinnerImage.src = SpinnerImage;


export const planeSprites = [plane1, plane2]