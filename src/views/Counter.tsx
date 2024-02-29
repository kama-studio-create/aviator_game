import {FC, useEffect, useRef, useState} from "react";

interface CounterProps {
  min: number;
  max: number;
  speed?: number;
  fontSize?: number; // Option to control font size
  fontFamily?: string;
  width: number;
  height: number;

}
const Counter: FC<CounterProps> = ({ min, max, speed = 1, fontSize = 24, fontFamily = 'Inter', width, height }) => {
  return (
    <canvas css={{position: 'absolute', top: '50%', right: '50%'}} width={100} height={100} >Test...............</canvas>
  )
};

export default Counter;
