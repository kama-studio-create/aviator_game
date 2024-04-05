import {css, keyframes} from "@emotion/react";
import {
  BORDER_RADIUS,
  CANVAS_PADDING,
  DOT_RADIUS,
  DOT_SCROLL_SPEED,
  DOT_SPACING,
  ENDED,
  TGameState,
  PLANE_FRAME_RATE,
  PLAYING, TIME_TO_TOP,
  WAITING,
  WAITING_DURATION, FACTOR, WAITING_FOR_NEXT_ROUND
} from "../common/constants.ts";
import BgAudioFile from "../assets/audio/bg_music.mp3";
import AudioFile from "../assets/audio/audio.mp3";
import {useAudio} from "../hooks/audio/useAudio.ts";
import {useEffect, useRef, useState} from "react";
import {backgroundImage, planeSprites, spinnerImage} from "../common/images.ts";
import {getRandomNumber} from "../utils/generators.ts";
import {BLUE_COLOR, ERROR_COLOR, WHITE_COLOR} from "../styles/colors.ts";
import {useImages} from "../hooks/images/useImages.ts";
import {GRADIENT_DARK} from "../styles/colors.ts";
import {MEDIA_QUERIES} from "../styles/breakpoints.ts";
import {BetInput} from "../components/inputs/BetInput.tsx";

const spin =  keyframes({
  "0%": {transform: "rotate(0deg)"},
  "100%": {transform: "rotate(360deg)"}
})


const gameStyles = {
  mainContainer: css({
    width: "100%",
    padding: 8,
    backgroundSize: "cover",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  }),
  canvasContainer: css({
    width: "100%",
    borderRadius: 8,
    background: GRADIENT_DARK,
    position: 'relative',
    '#canvas-bg': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      transformOrigin: 'bottom left',
      animation: `${spin} ${PLANE_FRAME_RATE}ms linear infinite`,
    }
  }),
  loadingContainer: css({
    width: '100%',
    height: '100%',
    background: GRADIENT_DARK,
    position: 'absolute',
    display: 'grid',
    placeContent: 'center',
    fontSize: 32
  }),
  userInputContainer: css({
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    position: 'relative',
    [MEDIA_QUERIES[0]]: {
      flexDirection: 'column',
    }
  }),

}

const GameView = () => {

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [gameState, setGameState] = useState<TGameState>(WAITING);
  const [canvasWidth, setCanvasWidth] = useState(300);
  const [canvasHeight, setCanvasHeight] = useState(300);

  const [startTime, setStartTime] = useState<number>(Date.now() + WAITING_DURATION);
  const [endTime, setEndTime] = useState(0);

  const {audioRef, isPlaying, bgAudioRef} = useAudio({gameState});

  const [now, setNow] = useState(Date.now());

  const imagesLoaded = useImages();

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
        setCanvasHeight(currentHeight * 0.8);
        const desiredPlaneWidth = currentWidth * 0.2; // 10% of canvas width
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
    const ctx = canvasRef.current?.getContext("2d");
    if(!ctx) return;

    const {width, height} = ctx.canvas;
    const moveY = DOT_RADIUS;
    const elapsedTime = now - startTime;
    const planeHeight = planeSprites[0].height;
    const planeWidth = planeSprites[0].width;

    const drawAxis = () => {
      if(gameState!== PLAYING) return;
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

    const drawXDots = () => {
      if(gameState!== PLAYING) return;
      const moveX = 0;
      ctx.beginPath();
      const timeOffset = (elapsedTime / 1000) * DOT_SCROLL_SPEED; // Seconds * speed
      const scrollOffset = elapsedTime > TIME_TO_TOP ? timeOffset % (DOT_SPACING + (DOT_RADIUS * 2)): 0;
      for (let dotX = width - moveX - scrollOffset; dotX >= 0; dotX -= DOT_SPACING) {
        ctx.arc(dotX, height - DOT_RADIUS, DOT_RADIUS, 0, 2 * Math.PI, false);
      }
      ctx.fillStyle = WHITE_COLOR;
      ctx.fill();
      ctx.closePath();
    }

    const drawYDots = () => {
      if(gameState!== PLAYING) return;
      ctx.beginPath();
      const timeOffset = (elapsedTime / 1000) * DOT_SCROLL_SPEED; // Seconds * speed
      const scrollOffset = elapsedTime > TIME_TO_TOP ? timeOffset % (DOT_SPACING + (DOT_RADIUS * 2)) : 0;
      for (let dotY = moveY - scrollOffset; dotY < height; dotY += DOT_SPACING) {
        ctx.arc(DOT_RADIUS, height - dotY, DOT_RADIUS, 0, 2 * Math.PI, false);
      }
      ctx.fillStyle = BLUE_COLOR;
      ctx.fill();
      ctx.closePath();
    }

    const drawBackground = () => {
      if (!startTime) return;

      const scaledImageWidth = width * 4;
      const scaledImageHeight = width * 4;
      const xOffset = -(width * 2);
      const yOffset = height - scaledImageHeight / 2;

      const angle = elapsedTime % 360 * 0.0005;
      ctx.save();
      if(gameState === PLAYING) {
        ctx.rotate(angle);
      }
      ctx.translate(0 , height );
      ctx.scale(1, -1);
      ctx.globalAlpha = 0.5;
      ctx.drawImage(backgroundImage, xOffset, yOffset, scaledImageWidth, scaledImageHeight);
      ctx.restore();
    }

    const drawWaiting = () => {
      if (gameState !== WAITING || !startTime) return;

      const angle = elapsedTime % 360 * 0.00875;
      // Draw spinner
      const spinnerWidth = width * 0.15;
      const spinnerHeight = spinnerWidth * (spinnerImage.height / spinnerImage.width);
      const centerX = width / 2 - spinnerWidth / 2;
      const centerY = height / 2 - spinnerHeight / 2;
      ctx.save();
      ctx.translate(centerX + spinnerWidth / 2, centerY + spinnerHeight / 2);
      ctx.rotate(angle);
      ctx.drawImage(spinnerImage, -spinnerWidth / 2, -spinnerHeight / 2, spinnerWidth, spinnerHeight);
      ctx.restore();

      // Draw progress bar
      const progress = -elapsedTime / WAITING_DURATION * 100 > 0 ? -elapsedTime / WAITING_DURATION * 100 : 0;
      // Draw text
      ctx.font = "18px sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = "#c9c9c9";
      ctx.fillText(WAITING_FOR_NEXT_ROUND, width / 2, (height / 2) + (spinnerHeight * 1.5));
      ctx.canvas.style.background = "rgba(0,0,0,0.5)";
      ctx.fillStyle = "red";
      ctx.fillRect(width / 2 - 100, height / 2 + spinnerHeight, progress * 2, 7);
    }

    const drawMultiplier = () => {
      if (gameState === WAITING || !startTime) return;

      const multiplier = gameState === ENDED ? Math.exp(FACTOR * (endTime - startTime)): Math.exp(0.00006 * elapsedTime);
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
      ctx.fillText(`${multiplier.toFixed(2)}x`, ctx.canvas.width / 2, ctx.canvas.height / 1.6);
      ctx.restore();
    }

    const drawPlane = () => {
      if ( !startTime) return;
      let yPos;
      let xPos;
      const startX = 0;
      const startY = height -planeHeight;
      const endX = width - (planeWidth * 1.5);
      const endY = planeHeight * 3;
      const progress = elapsedTime >= TIME_TO_TOP ? 1:  elapsedTime / TIME_TO_TOP;

      const hoverOffset = elapsedTime >= TIME_TO_TOP ? Math.sin(elapsedTime * 0.002) * 32: 0;

      const calculatePlaneProgress = (start: number, end: number, progress: number): number => {
        return (end - start) * progress + start;
      }

      yPos = calculatePlaneProgress(startY, endY, progress);
      xPos = calculatePlaneProgress(startX, endX, progress);

      const currentSprite = Math.floor(Date.now() / PLANE_FRAME_RATE) % planeSprites.length;
      const planeSprite = planeSprites[currentSprite];

      switch (gameState) {
        case WAITING:
          ctx.globalAlpha = 0.5;
          ctx.drawImage(planeSprite, CANVAS_PADDING, ctx.canvas.height - planeSprite.height - CANVAS_PADDING, planeSprite.width, planeSprite.height);
          break;
        case PLAYING:
          if (elapsedTime >= TIME_TO_TOP) {
            yPos += hoverOffset;
            xPos += (hoverOffset * 0.4);
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
          break;
        case ENDED:
          yPos -= Math.exp(0.012 * (Date.now() - endTime)) / 2;
          xPos += Math.exp(0.012 * (Date.now() - endTime));
          ctx.drawImage(planeSprite, xPos, yPos, planeSprite.width, planeSprite.height);
          break;
        default:
          break;
      }
    }

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    drawBackground();
    drawWaiting();
    drawAxis();
    drawXDots();
    drawYDots();
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
    <div css={gameStyles.mainContainer}>
      <audio ref={bgAudioRef} src={BgAudioFile} loop/>
      <audio ref={audioRef} src={AudioFile}/>
      <div ref={containerRef} css={gameStyles.canvasContainer}>
        {!imagesLoaded && <div css={gameStyles.loadingContainer}>Loading</div>}
        <canvas width={canvasWidth} height={canvasHeight} ref={canvasRef}/>
      </div>
      <div css={gameStyles.userInputContainer}>

        <BetInput now={now} startTime={startTime} gameState={gameState}/>
        <BetInput now={now} startTime={startTime} gameState={gameState}/>
      </div>
    </div>
  )
}

export default GameView;
