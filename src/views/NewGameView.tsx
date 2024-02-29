import {ComponentPropsWithoutRef, FC, useEffect, useRef, useState} from "react";
import PlaneImage from '../assets/plane.svg';
import BgImage from '../assets/canvas-bg.svg';
import {css} from "@emotion/react";
import {GRADIENTS} from "../styles/colors.ts";
import {getRandomNumber} from "../utils/generators.ts";
import {GameState} from "../types/game.type.ts";

const gameStyles = css({
  width: '100%',
  padding: 8,
  backgroundSize: 'cover',
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  canvas: {
    position: 'absolute',
    top: 16,
    left: 16
  }
})
export const NewGameView: FC<ComponentPropsWithoutRef<'div'>> = (() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const textCanvasRef = useRef<HTMLCanvasElement>(null);
  // create a canvas image source
  const imageRef = useRef<HTMLImageElement>(new Image());
  const backgroundRef = useRef<HTMLImageElement>(new Image());
  imageRef.current.src = PlaneImage;
  backgroundRef.current.src = BgImage;
  backgroundRef.current.style.zIndex = '-1';

  let currentMultiplier = 1;


  const [canvasWidth, setCanvasWidth] = useState(300);
  const [canvasHeight, setCanvasHeight] = useState(300);

  const [gameState, setGameState] = useState('WAITING');
  const [userMultiplier, setUserMultiplier] = useState(1);
  const [mainMultiplier, setMainMultiplier] = useState(getRandomNumber(1,8));

  const [planeXPos, setPlaneXPos] = useState(0);


  let yPos = canvasRef.current ? canvasRef.current.height * 0.75 : 50;
  let xPos = 0;

  const startGame = () => {
    setGameState('PLAYING');
  }

  const drawBackground = () => {
    let angle = 0;
    const animate = () => {
      if (bgCanvasRef.current) {
        const ctx = bgCanvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, ctx.canvas.width - 32, ctx.canvas.height -32);
          ctx.save();
          ctx.canvas.style.opacity = '0.4';
          ctx.translate(0, ctx.canvas.height)
          ctx.rotate(angle);
          ctx.scale(1, -1)
          ctx.drawImage(
            backgroundRef.current,
            -Math.floor(ctx.canvas.width * 3),
            -Math.floor(ctx.canvas.width * 3),
            ctx.canvas.width * 6,
            ctx.canvas.height * 6,
          );
          ctx.restore();

          angle += 0.003;
          if(angle > 360) {
            angle = 0;
          }
        }
        requestAnimationFrame(animate);
      }
    }
    animate()

  }

  const drawPlane = () => {
    if (canvasRef.current && imageRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.drawImage(imageRef.current, 10, ctx.canvas.height-37, 75, 37);
      }
    }
  }

  const animatePlaneForward = () => {
    const path : {x: number, y: number}[] = [];
    const animate = () => {


      if (canvasRef.current && imageRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx){
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          ctx.drawImage(imageRef.current, xPos, yPos-30, 75, 37);
          ctx.beginPath();
          ctx.moveTo(0, ctx.canvas.height);
          for (let i = 0; i < path.length; i++) {
            ctx.lineTo(path[i].x, path[i].y);
          }
          ctx.lineTo(xPos, ctx.canvas.height);
          ctx.closePath()
          ctx.strokeStyle = 'rgba(241,4,4,0.5)';
          ctx.stroke();
          ctx.fillStyle = 'rgba(241,4,4,0.3)';
          ctx.fill();
          if( yPos > 50 && xPos < canvasRef.current.width * 0.85) {
            const xOffset = xPos / (canvasRef.current.width * 0.85); // Normalize x position for curve calculation
            yPos = canvasRef.current.height - (canvasRef.current.height * Math.pow(xOffset, 2)); // Parabolic equation
            xPos += 1.5;
            setPlaneXPos(xPos);
            path.push({x: xPos, y: yPos});
            requestAnimationFrame(animate);
          }
        }
      }
    };

    animate()
  };

  useEffect(() => {
    console.log('planeXPos', planeXPos)
  }, [planeXPos])

  const animatePlaneOut = () => {
    const canvasCtx = canvasRef.current?.getContext('2d');
    console.log('canvasCtx', canvasCtx)
    const animate = () => {
      if (canvasRef.current && imageRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) {
          return;
        }
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.drawImage(imageRef.current, xPos, yPos-37, 75, 37);
        xPos += 10;
        yPos -= 0.5;
        setPlaneXPos(xPos)
        if(xPos < canvasRef.current.width * 1.5) {
          requestAnimationFrame(animate);
        }
      }
    }
    animate()
  }


  const animateMultiplier = () => {

    const animate = () => {
      if (textCanvasRef.current) {
        const ctx = textCanvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          ctx.save();
          ctx.fillStyle = 'white';
          ctx.font = 'bold 70px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(currentMultiplier.toFixed(2), ctx.canvas.width / 2, ctx.canvas.height / 2);
          ctx.restore();
          currentMultiplier += 0.01;
        }
        if(currentMultiplier < mainMultiplier) {
          requestAnimationFrame(animate);
        } else {
          setGameState("ENDED");
        }

      }
    }
    animate()
  }


  useEffect(()=> {
    if (canvasRef.current && containerRef.current) {
      setCanvasWidth(containerRef.current.clientWidth);
      setCanvasHeight(containerRef.current.clientWidth);
      const ctx = canvasRef.current.getContext('2d');
      const bgCtx = bgCanvasRef.current?.getContext('2d');
      const textCtx = textCanvasRef.current?.getContext('2d');
      if (ctx) {
        ctx.canvas.width = containerRef.current.clientWidth;
        ctx.canvas.height = containerRef.current.clientWidth;
        ctx.canvas.style.borderRadius = 8 + 'px';
      }
      if(bgCtx) {
        bgCtx.canvas.width = containerRef.current.clientWidth;
        bgCtx.canvas.height = containerRef.current.clientWidth;

      }
      if(textCtx) {
        textCtx.canvas.width = containerRef.current.clientWidth;
        textCtx.canvas.height = containerRef.current.clientWidth;

      }
    }
  }, [canvasRef, containerRef]);


  useEffect(() => {

    switch (gameState) {
      case 'WAITING':
        setMainMultiplier(getRandomNumber(1,8));
        drawPlane();
        break;
      case 'PLAYING':
        drawBackground();
        animateMultiplier();
        animatePlaneForward();
        break;
      case 'EXITED':
        break;
      case 'ENDED':
        animatePlaneOut()
        setTimeout(() => {
          setGameState('WAITING');
        }, 5000)
        break;
      default: break;
    }
  }, [gameState])

  return (
    <div css={[gameStyles, {minHeight: canvasHeight}]}>
      <div ref={containerRef} css={{width: '100%', height: canvasHeight, background: GRADIENTS.dark, borderRadius: 8}}>
        <canvas ref={bgCanvasRef} />
        <canvas ref={canvasRef} />
        <canvas ref={textCanvasRef} />
      </div>
      <div>
        <button onClick={() => startGame()}>Start Game</button>
      </div>
    </div>
  )
})
