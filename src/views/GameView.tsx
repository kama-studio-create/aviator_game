import {css} from "@emotion/react";
import {
  AUDIO_FLY_AWAY,
  AUDIO_START,
  BORDER_RADIUS,
  CANVAS_PADDING,
  ENDED,
  PLANE_FRAME_RATE,
  PLANE_HEIGHT,
  PLANE_WIDTH,
  PLAYING,
  WAITING
} from "../common/constants.ts";
import {GRADIENTS} from "../styles/colors.ts";
import BgAudioFile from "../assets/audio/bg_music.mp3";
import AudioFile from "../assets/audio/audio.mp3";
import {useAudio} from "../hooks/audio/useAudio.ts";
import {useEffect, useRef, useState} from "react";
import {IGameState, IPlaneDirection} from "../types/game.type.ts";
import {backgroundImage, planeSprites, spinnerImage} from "../common/images.ts";
import {getRandomNumber} from "../utils/generators.ts";
import {COLORS} from "../common/colors.ts";

const gameStyles = css({
  width: '100%',
  padding: 8,
  backgroundSize: 'cover',
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  canvas: {
    position: 'absolute',
    top: CANVAS_PADDING,
    left: CANVAS_PADDING,
  },
})
const GameView = () => {
  const {audioRef, playSegment, isPlaying, bgAudioRef} = useAudio();

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const textCanvasRef = useRef<HTMLCanvasElement>(null);
  const waitingCanvasRef = useRef<HTMLCanvasElement>(null);

  const [gameState, setGameState] = useState<IGameState>(WAITING);

  const [mainMultiplier, setMainMultiplier] = useState(1);

  const [canvasWidth, setCanvasWidth] = useState(300);
  const [canvasHeight, setCanvasHeight] = useState(300);
  const [frameID, setFrameID] = useState<number | null>(null);

  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);

  let yPos = canvasRef.current ? canvasRef.current.height - PLANE_HEIGHT : 50;
  let xPos = PLANE_HEIGHT;

  const [planeXPos, setPlaneXPos] = useState(PLANE_HEIGHT);
  const [planeYPos, setPlaneYPos] = useState(0);

  useEffect(() => {
    const ref = audioRef.current
    return () => {
      if (isPlaying && ref) {
        ref.pause();
        ref.currentTime = 0;
      }
    };
  }, [audioRef, isPlaying]);


  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    const bgCtx = bgCanvasRef.current?.getContext('2d');
    const textCtx = textCanvasRef.current?.getContext('2d');
    const waitingCtx = waitingCanvasRef.current?.getContext('2d');

    const resizeAndStyleCanvases = () => {
      if (!containerRef.current || !ctx || !bgCtx || !textCtx || !waitingCtx) return;
      const currentWidth = containerRef.current.clientWidth;
      const currentHeight = currentWidth;
      if (ctx.canvas.width !== currentWidth || ctx.canvas.height !== currentHeight) {
        setCanvasWidth(currentWidth);
        setCanvasHeight(currentHeight);
        ctx.canvas.width = currentWidth;
        ctx.canvas.height = currentHeight;
        bgCtx.canvas.width = currentWidth - 20;
        bgCtx.canvas.height = currentHeight - 20;
        textCtx.canvas.width = currentWidth;
        textCtx.canvas.height = currentHeight;
        waitingCtx.canvas.width = currentWidth;
        waitingCtx.canvas.height = currentHeight;
      }
      ctx.canvas.style.borderRadius = BORDER_RADIUS;
      textCtx.canvas.style.borderRadius = BORDER_RADIUS;
      waitingCtx.canvas.style.borderRadius = BORDER_RADIUS;
    }

    resizeAndStyleCanvases();
    const resizeObserver = new ResizeObserver(resizeAndStyleCanvases);
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [canvasRef, containerRef]);

  useEffect(() => {
    let angle = 0;
    let progress = 0;
    const progressStartTime = Date.now();
    let currentMultiplier = 1;
    let currentSprite = 0;
    let currentPlaneDirection: IPlaneDirection = 'UP';
    let steps = 0;
    let counter = 0;
    const dotSpacing = 80;
    let moveX = 0;
    const dotRadius = 2
    let moveY = dotRadius;
    const drawBackground = () => {
      if (!bgCanvasRef.current || gameState !== PLAYING) return;
      const ctx = bgCanvasRef.current.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, bgCanvasRef.current.width, bgCanvasRef.current.height);
      ctx.save();
      ctx.canvas.style.marginLeft = `${CANVAS_PADDING}px`;
      ctx.canvas.style.marginBottom = `${CANVAS_PADDING}px`;
      ctx.translate(0, ctx.canvas.width)
      ctx.rotate(angle);
      ctx.scale(1, -1);
      ctx.globalAlpha = 0.2;
      ctx.drawImage(backgroundImage, -Math.floor(ctx.canvas.width * 4), -Math.floor(ctx.canvas.height * 4), ctx.canvas.width * 8, ctx.canvas.width * 8,);
      ctx.globalAlpha = 1;
      ctx.canvas.style.background = GRADIENTS.dark;
      ctx.canvas.style.borderLeft = '1px solid white';
      ctx.canvas.style.borderBottom = '1px solid white';
      ctx.restore();
      angle += 0.003;
      if (angle > 360) {
        angle = 0;
      }
    }

    const drawWaiting = () => {
      if (gameState !== WAITING) return;
      const canvas = waitingCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(angle);
      ctx.drawImage(spinnerImage, -spinnerImage.width / 2, -spinnerImage.height / 2,);
      const progressInterval = setInterval(() => {
        const elapsedTime = Date.now() - progressStartTime;
        progress = Math.min(elapsedTime / 8000, 1) * 100;
        if (progress >= 100) {
          clearInterval(progressInterval);
        }
      }, 50);
      ctx.restore();
      angle += 0.14;
      ctx.font = '18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#c9c9c9';
      ctx.fillText('Waiting for next round', canvas.width / 2, canvas.height * 0.85);
      ctx.canvas.style.background = 'rgba(0,0,0,0.5)';
      ctx.fillStyle = 'red';
      ctx.fillRect(canvas.width / 2 - 100, canvas.height * 0.75, progress * 2, 7);
    }

    const drawMultiplier  = () => {
      if (textCanvasRef.current && gameState !== 'WAITING') {
        const ctx = textCanvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          ctx.save();
          if (gameState === 'ENDED') {
            ctx.fillStyle = '#f7f7f7';
            ctx.font = 'bold 32px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`FLEW AT`, ctx.canvas.width / 2, ctx.canvas.height / 2.3);
            ctx.fillStyle = currentMultiplier < mainMultiplier ? 'white' : 'red';
            ctx.fillStyle = 'red';
            ctx.font = 'bold 72px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${mainMultiplier.toFixed(2)}x`, ctx.canvas.width / 2, ctx.canvas.height / 1.7);
          } else if (gameState === 'PLAYING') {
            ctx.fillStyle = currentMultiplier < mainMultiplier ? 'white' : 'red';
            ctx.font = 'bold 72px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${currentMultiplier.toFixed(2)}x`, ctx.canvas.width / 2, ctx.canvas.height / 1.7);
            currentMultiplier += 0.01;
          }
          ctx.restore();
        }
        if (currentMultiplier >= mainMultiplier && gameState === 'PLAYING') {
          setGameState("ENDED");
        }
      }
    }



    const drawPlane = () => {
      const drawDots = (ctx: CanvasRenderingContext2D) => {
        ctx.beginPath();
        for (let dotX = canvasWidth; dotX >= 0; dotX -= dotSpacing) {
          ctx.arc(dotX - moveX, canvasHeight - dotRadius, dotRadius, 0, Math.PI * 2, false);
        }
        ctx.fillStyle = COLORS.white;
        ctx.fill();
        ctx.closePath();
      }
      const drawYDots = (ctx: CanvasRenderingContext2D) => {
        ctx.beginPath();
        for (let dotY = moveY; dotY < canvasHeight; dotY += dotSpacing) {
          ctx.arc(dotRadius, dotY, dotRadius, 0, 2 * Math.PI, false);
        }
        ctx.fillStyle = COLORS.blue;
        ctx.fill();
        ctx.closePath();
      }
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;
        switch (gameState) {
          case 'WAITING' :
            ctx.drawImage(planeSprites[currentSprite], CANVAS_PADDING, ctx.canvas.height - PLANE_HEIGHT - CANVAS_PADDING, PLANE_WIDTH, PLANE_HEIGHT);
            break;
          case 'PLAYING':
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.drawImage(planeSprites[currentSprite], xPos + CANVAS_PADDING, yPos - PLANE_HEIGHT - CANVAS_PADDING, PLANE_WIDTH, PLANE_HEIGHT);
            ctx.beginPath();
            ctx.moveTo(CANVAS_PADDING, ctx.canvas.height - CANVAS_PADDING - 4);
            ctx.lineWidth = 5
            ctx.strokeStyle = COLORS.error;
            ctx.quadraticCurveTo(xPos / 2.5, ctx.canvas.height - CANVAS_PADDING, xPos + (CANVAS_PADDING * 2), yPos - (CANVAS_PADDING * 2));
            ctx.stroke();
            ctx.lineWidth = 0.5;
            ctx.lineTo(xPos + (CANVAS_PADDING * 2), ctx.canvas.height - (CANVAS_PADDING + 4));
            ctx.closePath();
            ctx.strokeStyle = COLORS.error;
            ctx.stroke();
            ctx.fillStyle = COLORS.bgRed;
            ctx.fill();
            drawDots(ctx);
            drawYDots(ctx);

            if (yPos > 100 && xPos < canvasRef.current.width * 0.85) {
              if (xPos > ctx.canvas.width * 0.6) {
                if (currentPlaneDirection === 'UP') {
                  yPos += 1.2;
                  xPos += 0.4;
                  if (steps === 120) {
                    currentPlaneDirection = 'DOWN';
                    steps = 0
                  } else steps++;
                } else {
                  yPos -= 1.2
                  xPos -= 0.4
                  if (steps === 120) {
                    currentPlaneDirection = 'UP';
                    steps = 0
                  } else steps++;
                }
                setPlaneYPos(yPos);

                moveX++;
                if (moveX > dotSpacing) moveX = 0;

                moveY++;
                if (moveY - dotRadius > dotSpacing) moveY = dotRadius;

              } else {
                // const xOffset = xPos / (canvasRef.current.width * 0.85); // Normalize x position for curve calculation
                if(elapsedTime && startTime) {
                  yPos = canvasHeight - Math.exp(0.000006 * elapsedTime); // Parabolic equation
                  xPos += 1.5;
                  setPlaneXPos(xPos);
                  setPlaneYPos(yPos);
                  setElapsedTime(Date.now() - startTime);
                }
              }
            }
            break;
          case 'ENDED':
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.drawImage(planeSprites[currentSprite], xPos, planeYPos - PLANE_HEIGHT, PLANE_WIDTH, PLANE_HEIGHT);
            if (xPos < ctx.canvas.width * 1.5) {
              xPos += 12;
              yPos -= 2;
              setPlaneYPos(yPos);
              setPlaneXPos(xPos);
            }
            break;
          default:
            break;
        }
        if (counter % PLANE_FRAME_RATE === 0) {
          if (currentSprite === planeSprites.length - 1) {
            currentSprite = 0;
          } else {
            currentSprite += 1;
          }
        }
        counter++;
      }
    }
    const animate = () => {
      drawBackground();
      drawWaiting();
      drawMultiplier();
      drawPlane();
      switch (gameState) {
        case WAITING:
          setTimeout(() => {
            const duration = getRandomNumber(50000, 10000000);
            setDuration(duration);
            setStartTime(Date.now());
            setMainMultiplier(14.4555)
            setGameState(PLAYING);
          }, 6000)
          break;
        case PLAYING:
          setStartTime(Date.now());
          playSegment(AUDIO_START);
          if(duration) setEndTime(Date.now() + duration);
          break;
        case ENDED:
          playSegment(AUDIO_FLY_AWAY);
          break;
        default:
          break;
      }

      const currentFrameID = requestAnimationFrame(animate);
      setFrameID(currentFrameID);
    }
    animate();

    return () => {
      if(frameID) {
        cancelAnimationFrame(frameID);
      }
    }
  }, [gameState]);

  return (
    <div css={gameStyles}>
      <audio ref={bgAudioRef} src={BgAudioFile} loop/>
      <audio ref={audioRef} src={AudioFile}/>
      <div ref={containerRef} style={{width: '100%', minHeight: canvasHeight, borderRadius: 8}}>
        <canvas style={{background: GRADIENTS.dark}} ref={bgCanvasRef}/>
        <canvas ref={canvasRef}/>
        <canvas ref={textCanvasRef}/>
        <canvas style={{display: gameState === 'WAITING' ? 'block' : 'none'}} ref={waitingCanvasRef}/>
      </div>
    </div>
  )
}

export default GameView;