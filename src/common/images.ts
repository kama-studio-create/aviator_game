import PlaneImage from "../assets/plane.svg";
import BgImage from "../assets/canvas-bg.svg";
import SpinnerImage from "../assets/spinner.svg";
import Plane2 from '../assets/plane/plane_2.svg';
import Plane3 from '../assets/plane/plane_3.svg';
import Plane4 from '../assets/plane/plane_4.svg';

export const plane1 = new Image();
plane1.src = PlaneImage;

export const plane2 = new Image();
plane2.src = Plane2;

export const plane3 = new Image();
plane3.src = Plane3;

export const plane4 = new Image();
plane4.src = Plane4;

export const backgroundImage = new Image();
export const spinnerImage = new Image();

backgroundImage.src = BgImage;
backgroundImage.id = 'canvas-bg';
spinnerImage.src = SpinnerImage;


export const planeSprites = [plane1, plane2, plane3, plane4];

export const allImages = [backgroundImage, spinnerImage,...planeSprites];