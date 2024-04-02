import {css} from "@emotion/react";
import {
  BORDER_RADIUS,
  CANVAS_PADDING,
  DOT_RADIUS,
  DOT_SCROLL_SPEED,
  DOT_SPACING,
  ENDED,
  IGameState,
  PLANE_FLIGHT_RATE,
  PLANE_FRAME_RATE,
  PLAYING,
  WAITING,
  WAITING_DURATION
} from "../common/constants.ts";
import {GRADIENTS} from "../styles/colors.ts";
import BgAudioFile from "../assets/audio/bg_music.mp3";
import AudioFile from "../assets/audio/audio.mp3";
import {useAudio} from "../hooks/audio/useAudio.ts";
import {useEffect, useRef, useState} from "react";
import {backgroundImage, planeSprites, spinnerImage} from "../common/images.ts";
import {getRandomNumber} from "../utils/generators.ts";
import {BLUE_COLOR, ERROR_COLOR, WHITE_COLOR} from "../common/colors.ts";


const gameStyles = css({
  width: "100%",
  padding: 8,
  backgroundSize: "cover",
  display: "flex",
  flexDirection: "column",
  gap: 16,
  canvas: {
    position: "absolute",
    top: CANVAS_PADDING,
    left: CANVAS_PADDING,
  },
})
const GameView = () => {

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [gameState, setGameState] = useState<IGameState>(WAITING);
  const [canvasWidth, setCanvasWidth] = useState(300);
  const [canvasHeight, setCanvasHeight] = useState(300);

  const [startTime, setStartTime] = useState<number>(Date.now() + WAITING_DURATION);
  const [endTime, setEndTime] = useState(0);

  const {audioRef, isPlaying, bgAudioRef} = useAudio({gameState});

  const [now, setNow] = useState(Date.now());


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
    const ctx = canvasRef.current?.getContext("2d");
    const resizeAndStyleCanvases = () => {
      if (!containerRef.current || !ctx) return;
      const currentWidth = containerRef.current.clientWidth;
      const currentHeight = currentWidth;
      if (ctx.canvas.width !== currentWidth || ctx.canvas.height !== currentHeight) {
        setCanvasWidth(currentWidth);
        setCanvasHeight(currentHeight);
        const desiredPlaneWidth = currentWidth * 0.3; // 10% of canvas width
        planeSprites.map(sprite => {
          const ratio = desiredPlaneWidth / sprite.width;
          const newHeight = sprite.height * ratio;
          sprite.width = desiredPlaneWidth;
          sprite.height = newHeight;
          return sprite;
        });
      }
      ctx.canvas.style.borderRadius = BORDER_RADIUS;
    }

    resizeAndStyleCanvases();
    const resizeObserver = new ResizeObserver(resizeAndStyleCanvases);
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const moveY = DOT_RADIUS;
    const elapsedTime = now - startTime;

    const clearCanvases = () => {
      const canvases = [canvasRef];
      canvases.forEach((ref) => {
        if (ref.current) {
          const ctx = ref.current.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, ref.current.width, ref.current.height);
          }
        }
      });
    }

    const drawBackground = () => {
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx || gameState !== PLAYING || !startTime) return;

      const {width, height} = ctx.canvas;
      ctx.save();
      // Draw background image
      ctx.translate(0, width)
      const angle = elapsedTime % 360 * 0.0005;
      ctx.rotate(angle);
      ctx.scale(1, -1);
      ctx.globalAlpha = 0.5;
      ctx.drawImage(backgroundImage, -Math.floor(width * 4), -Math.floor(height * 4), width * 8, height * 8,);

      // Draw axis

      ctx.moveTo(CANVAS_PADDING * 3, height - CANVAS_PADDING * 3);
      ctx.beginPath();
      ctx.lineTo(width - CANVAS_PADDING * 3, height - CANVAS_PADDING * 3);
      ctx.closePath();

      ctx.fill();
      ctx.restore();
    }

    const drawWaiting = () => {
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx || gameState !== WAITING || !startTime) return;
      const {width, height} = ctx.canvas;
      const angle = elapsedTime % 360 * 0.01;
      const waitingTime = startTime - Date.now();
      // Draw spinner
      ctx.save();
      ctx.translate(width / 2, width / 2);
      ctx.rotate(angle);
      ctx.drawImage(spinnerImage, -spinnerImage.width / 2, -spinnerImage.height / 2,);
      ctx.restore();
      // Draw progress bar
      const progress = waitingTime / WAITING_DURATION * 100 > 0 ? waitingTime / WAITING_DURATION * 100 : 0;
      // Draw text
      ctx.font = "18px sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = "#c9c9c9";
      ctx.fillText("Waiting for next round", width / 2, height * 0.9);
      ctx.canvas.style.background = "rgba(0,0,0,0.5)";
      ctx.fillStyle = "red";
      ctx.fillRect(width / 2 - 100, height * 0.8, progress * 2, 7);
    }

    const drawMultiplier = () => {
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx || gameState === WAITING || !startTime) return;

      const multiplier = gameState === ENDED ? Math.exp(0.00006 * (endTime - startTime)): Math.exp(0.00006 * elapsedTime);
      ctx.save();
      if (gameState === ENDED) {
        ctx.fillStyle = "#f7f7f7";
        ctx.font = "bold 32px Arial";
        ctx.textAlign = "center";
        ctx.fillText(`FLEW AT`, ctx.canvas.width / 2, ctx.canvas.height / 2.3);
      }
      ctx.fillStyle = gameState === ENDED ? "red" : "white";
      ctx.font = "bold 72px Arial";
      ctx.textAlign = "center";
      ctx.fillText(`${multiplier.toFixed(2)}x`, ctx.canvas.width / 2, ctx.canvas.height / 1.7);
      ctx.restore();
    }

    const drawPlane = () => {

      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx || !startTime) return;

      const {width, height} = ctx.canvas;

      let yPos;
      let xPos;
      // timeto top should be same;
      const calculateTimeToTop = (canvasHeight: number) => {
        if (planeSprites.length === 0) return 0;
        if (planeSprites[0].height >= canvasHeight) {
          throw new Error("PLANE_HEIGHT must be less than canvasHeight");
        }
        const top = planeSprites[0].height * 2;
        return Math.log(canvasHeight - top) / PLANE_FLIGHT_RATE;
      }
      const timeToTop = Math.floor(calculateTimeToTop(height));

      const offset = Math.sin(elapsedTime * 0.002) * 32;
      const drawXDots = (ctx: CanvasRenderingContext2D) => {
        const moveX = 0;
        ctx.beginPath();

        if (elapsedTime > timeToTop) {
          const timeOffset = (elapsedTime / 1000) * DOT_SCROLL_SPEED; // Seconds * speed
          const scrollOffset = timeOffset % (DOT_SPACING + (DOT_RADIUS * 2));
          //remove code repetition to single loop
          for (let dotX = width - moveX - scrollOffset; dotX >= 0; dotX -= DOT_SPACING) {
            ctx.arc(dotX, height - DOT_RADIUS, DOT_RADIUS, 0, 2 * Math.PI, false);
          }
        } else {
          for (let dotX = width - moveX; dotX >= 0; dotX -= DOT_SPACING) {
            ctx.arc(dotX, height - DOT_RADIUS, DOT_RADIUS, 0, 2 * Math.PI, false);
          }
        }

        ctx.fillStyle = WHITE_COLOR;
        ctx.fill();
        ctx.closePath();
      }
      const drawYDots = (ctx: CanvasRenderingContext2D) => {
        ctx.beginPath();
        if (elapsedTime > timeToTop) {
          // Calculate offset based on time
          const timeOffset = (elapsedTime / 1000) * DOT_SCROLL_SPEED; // Seconds * speed
          const scrollOffset = timeOffset % (DOT_SPACING + (DOT_RADIUS * 2));
          for (let dotY = moveY - scrollOffset; dotY < height; dotY += DOT_SPACING) {
            ctx.arc(DOT_RADIUS, height - dotY, DOT_RADIUS, 0, 2 * Math.PI, false);
          }
        } else {
          for (let dotY = moveY; dotY < height; dotY += DOT_SPACING) {
            ctx.arc(DOT_RADIUS, dotY, DOT_RADIUS, 0, 2 * Math.PI, false);
          }
        }
        ctx.fillStyle = BLUE_COLOR;
        ctx.fill();
        ctx.closePath();
      }

      const drawAxis = (ctx: CanvasRenderingContext2D) => {
        ctx.strokeStyle = WHITE_COLOR;
        ctx.lineWidth = 1;
        //draw x axis
        ctx.beginPath();
        ctx.moveTo(CANVAS_PADDING, height - CANVAS_PADDING);
        ctx.lineTo(width - CANVAS_PADDING, height - CANVAS_PADDING);
        ctx.closePath();
        ctx.stroke();

        //draw y axis
        ctx.beginPath();
        ctx.moveTo(CANVAS_PADDING, CANVAS_PADDING);
        ctx.lineTo(CANVAS_PADDING, height - CANVAS_PADDING);
        ctx.closePath();

        ctx.stroke();
      }

      yPos = height - Math.exp(0.0012 * elapsedTime)
      xPos = Math.exp(0.00117 * elapsedTime);

      const accelerationFactor = 0.02;
      const planeExitSpeed = 5 + elapsedTime * accelerationFactor;

      const currentSprite = Math.floor(Date.now() / PLANE_FRAME_RATE) % planeSprites.length;
      const planeSprite = planeSprites[currentSprite];
      switch (gameState) {
        case WAITING:
          ctx.globalAlpha = 0.5;
          ctx.drawImage(planeSprite, CANVAS_PADDING, ctx.canvas.height - planeSprite.height - CANVAS_PADDING, planeSprite.width, planeSprite.height);
          break;
        case PLAYING:
          if (elapsedTime >= timeToTop) {
            yPos = height - Math.exp(0.0012 * timeToTop)
            xPos = Math.exp(0.00117 * timeToTop);
            yPos += offset;
            xPos += (offset * 0.4);
          }
          ctx.globalAlpha = 1;
          ctx.drawImage(
            planeSprite,
            xPos,
            yPos - planeSprite.height - CANVAS_PADDING,
            planeSprite.width,
            planeSprite.height
          );

          //draw line
          ctx.beginPath();
          ctx.moveTo(CANVAS_PADDING, ctx.canvas.height - CANVAS_PADDING);
          ctx.lineWidth = 5
          ctx.strokeStyle = ERROR_COLOR;
          ctx.quadraticCurveTo(xPos / 1.5, ctx.canvas.height - CANVAS_PADDING, xPos + (CANVAS_PADDING * 1.5), yPos - (CANVAS_PADDING * 1.5));
          ctx.stroke();
          ctx.lineWidth = 0.5;
          ctx.lineTo(xPos + (CANVAS_PADDING * 2), ctx.canvas.height - (CANVAS_PADDING + 4));
          ctx.closePath();
          ctx.strokeStyle = ERROR_COLOR;
          ctx.stroke();
          ctx.fillStyle = ERROR_COLOR;
          ctx.fill();
          //draw dots
          drawXDots(ctx);
          drawYDots(ctx);
          drawAxis(ctx);
          break;
        case ENDED:
          // if(xPos > width * 1.5) return;
          if (elapsedTime >= timeToTop) {
            yPos = height - Math.exp(0.0012 * timeToTop)
            xPos = Math.exp(0.00117 * timeToTop);
            xPos += planeExitSpeed;
          }
          ctx.drawImage(planeSprite, xPos, yPos, planeSprite.width, planeSprite.height);

          break;
        default:
          break;
      }
    }

    clearCanvases();
    drawBackground();
    drawWaiting();
    drawPlane();
    drawWaiting();
    drawMultiplier();

  }, [gameState, startTime, endTime, now]);

  useEffect(() => {
    switch (gameState) {
      case WAITING:
        if (now > startTime) {
          setGameState(PLAYING)
        }
        break;
      case PLAYING:
        if (now > endTime) setGameState(ENDED);
        break;
      case ENDED:
        if (now > (endTime + WAITING_DURATION)) {
          setStartTime(Date.now() + WAITING_DURATION);
          setGameState(WAITING);
        }
        break;
      default:
        break;
    }
  }, [endTime, gameState, now, startTime]);

  useEffect(() => {
    if (gameState === WAITING) {
      const start = Date.now() + WAITING_DURATION;
      const end = start + getRandomNumber(3000, 25000);
      setEndTime(end);
    }
  }, [gameState]);


  useEffect(() => {
    let frameID = 0;

    function run() {
      setNow(Date.now());
      frameID = requestAnimationFrame(run);
    }

    run();
    return () => {
      cancelAnimationFrame(frameID);
    }
  }, []);

  return (
    <div css={gameStyles}>
      <audio ref={bgAudioRef} src={BgAudioFile} loop/>
      <audio ref={audioRef} src={AudioFile}/>
      <div ref={containerRef}
        style={{width: "100%", height: canvasHeight, borderRadius: 8, background: GRADIENTS.dark}}>
        <canvas width={canvasWidth} height={canvasHeight} ref={canvasRef}/>
      </div>
    </div>
  )
}

export default GameView;
