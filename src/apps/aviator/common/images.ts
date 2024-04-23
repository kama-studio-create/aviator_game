import PlaneImage from "../assets/plane.svg";
import BgImage from "../assets/canvas-bg.svg";
import SpinnerImage from "../assets/spinner.svg";
import Plane2 from '../assets/plane/plane_2.svg';
import Plane3 from '../assets/plane/plane_3.svg';
import Plane4 from '../assets/plane/plane_4.svg';

//avatars
import beetle from "../assets/avatars/beetle.webp";
import butterfly from "../assets/avatars/butterfly.webp";
import cat from "../assets/avatars/cat.webp";
import china from "../assets/avatars/china.webp";
import dolphin from "../assets/avatars/dolphin.webp";
import ford from "../assets/avatars/ford.webp";
import fox from "../assets/avatars/fox.webp";
import greatWall from "../assets/avatars/great-wall.webp";
import monkey from "../assets/avatars/monkey.webp";
import oldCar from "../assets/avatars/old-car.webp";
import paris from "../assets/avatars/paris.webp";
import plymouth from "../assets/avatars/plymouth.webp";
import rome from "../assets/avatars/rome.webp";
import tiger from "../assets/avatars/tiger.webp";

export const avatarBeetle = new Image();
avatarBeetle.src = beetle;
export const avatarButterfly = new Image();
avatarButterfly.src = butterfly;
export const avatarCat = new Image();
avatarCat.src = cat;
export const avatarChina = new Image();
avatarChina.src = china;
export const avatarDolphin = new Image();
avatarDolphin.src = dolphin;
export const avatarFord = new Image();
avatarFord.src = ford;
export const avatarFox = new Image();
avatarFox.src = fox;
export const avatarGreatWall = new Image();
avatarGreatWall.src = greatWall;
export const avatarMonkey = new Image();
avatarMonkey.src = monkey;
export const avatarOldCar = new Image();
avatarOldCar.src = oldCar;
export const avatarParis = new Image();
avatarParis.src = paris;
export const avatarPlymouth = new Image();
avatarPlymouth.src = plymouth;
export const avatarRome = new Image();
avatarRome.src = rome;
export const avatarTiger = new Image();
avatarTiger.src = tiger;

export const avatarImages: HTMLImageElement[] = [
  avatarBeetle,
  avatarButterfly,
  avatarCat,
  avatarChina,
  avatarDolphin,
  avatarFord,
  avatarFox,
  avatarGreatWall,
  avatarMonkey,
  avatarOldCar,
  avatarParis,
  avatarPlymouth,
  avatarRome,
  avatarTiger
];
export const allAvatarURls = avatarImages.map(image => image.src);


//plane sprites
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
export const allImages = [backgroundImage, spinnerImage, ...planeSprites, ...avatarImages];
export const allImageUrls = allImages.map(image => image.src);

export const imageLoadPromises = allImages.map(image => {
  return new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = reject;
  });
});

