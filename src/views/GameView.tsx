import {css} from "@emotion/react";
import {
  AUDIO_FLY_AWAY,
  AUDIO_START,
  BORDER_RADIUS,
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

const CANVAS_PADDING = 16;

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
  const {audioRef, playSegment, isPlaying, bgAudioRef} = useAudio();

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const textCanvasRef = useRef<HTMLCanvasElement>(null);

  const [gameState, setGameState] = useState<IGameState>(WAITING);

  const [mainMultiplier, setMainMultiplier] = useState(1);

  const [canvasWidth, setCanvasWidth] = useState(300);
  const [canvasHeight, setCanvasHeight] = useState(300);

  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);

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
    const ctx = canvasRef.current.getContext("2d");
    const bgCtx = bgCanvasRef.current?.getContext("2d");
    const textCtx = textCanvasRef.current?.getContext("2d");
    const waitingCtx = waitingCanvasRef.current?.getContext("2d");

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
  }, []);

  useEffect(() => {
    let currentSprite = 0;
    let currentPlaneDirection: IPlaneDirection = "UP";
    let steps = 0;
    let counter = 0;
    const dotSpacing = 80;
    let moveX = 0;
    const dotRadius = 2
    let moveY = dotRadius;

    const drawBackground = () => {
      const ctx = bgCanvasRef.current?.getContext("2d");
      if (!ctx || gameState !== PLAYING) return;

      const {width, height} = ctx.canvas;

      ctx.save();

      // Draw background image
      ctx.canvas.style.marginLeft = `${CANVAS_PADDING}px`;
      ctx.canvas.style.marginBottom = `${CANVAS_PADDING}px`;
      ctx.translate(0, width)
      const angle = (now - startTime) % 360;
      ctx.rotate(angle);
      ctx.scale(1, -1);
      ctx.globalAlpha = 0.2;
      ctx.drawImage(backgroundImage, -Math.floor(ctx.canvas.width * 4), -Math.floor(ctx.canvas.height * 4), ctx.canvas.width * 8, ctx.canvas.width * 8,);

      // Draw axis
      ctx.globalAlpha = 1;
      ctx.canvas.style.background = GRADIENTS.dark;
      ctx.canvas.style.borderLeft = "1px solid white";
      ctx.canvas.style.borderBottom = "1px solid white";
      ctx.restore();
    }

    const drawWaiting = () => {
      const ctx = bgCanvasRef.current?.getContext("2d");
      if (!ctx || gameState !== WAITING) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw spinner
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(angle);
      ctx.drawImage(spinnerImage, -spinnerImage.width / 2, -spinnerImage.height / 2,);
      ctx.restore();

      // Draw progress bar

      // Draw text
      ctx.font = "18px sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = "#c9c9c9";
      ctx.fillText("Waiting for next round", canvas.width / 2, canvas.height * 0.85);
      ctx.canvas.style.background = "rgba(0,0,0,0.5)";
      ctx.fillStyle = "red";
      ctx.fillRect(canvas.width / 2 - 100, canvas.height * 0.75, progress * 2, 7);
    }

    const drawMultiplier = () => {
      if (textCanvasRef.current && gameState !== "WAITING") {
        const ctx = textCanvasRef.current.getContext("2d");
        if (ctx) {
          ctx.save();
          if (gameState === "ENDED") {
            ctx.fillStyle = "#f7f7f7";
            ctx.font = "bold 32px Arial";
            ctx.textAlign = "center";
            ctx.fillText(`FLEW AT`, ctx.canvas.width / 2, ctx.canvas.height / 2.3);
            ctx.fillStyle = currentMultiplier < mainMultiplier ? "white" : "red";
            ctx.fillStyle = "red";
            ctx.font = "bold 72px Arial";
            ctx.textAlign = "center";
            ctx.fillText(`${mainMultiplier.toFixed(2)}x`, ctx.canvas.width / 2, ctx.canvas.height / 1.7);
          } else if (gameState === "PLAYING") {
            ctx.fillStyle = currentMultiplier < mainMultiplier ? "white" : "red";
            ctx.font = "bold 72px Arial";
            ctx.textAlign = "center";
            ctx.fillText(`${currentMultiplier.toFixed(2)}x`, ctx.canvas.width / 2, ctx.canvas.height / 1.7);
          }
          ctx.restore();
        }
      }
    }


    const drawPlane = () => {
      const drawXDots = (ctx: CanvasRenderingContext2D) => {
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
        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;
        switch (gameState) {
          case "WAITING" :
            ctx.drawImage(planeSprites[currentSprite], CANVAS_PADDING, ctx.canvas.height - PLANE_HEIGHT - CANVAS_PADDING, PLANE_WIDTH, PLANE_HEIGHT);
            break;
          case "PLAYING":
            ctx.drawImage(planeSprites[currentSprite], xPos + CANVAS_PADDING, yPos - PLANE_HEIGHT - CANVAS_PADDING, PLANE_WIDTH, PLANE_HEIGHT);
            ctx.beginPath();
            ctx.moveTo(CANVAS_PADDING, ctx.canvas.height - CANVAS_PADDING - 4);
            ctx.lineWidth = 5
            ctx.strokeStyle = COLORS.error;
            ctx.quadraticCurveTo(
              xPos / 2.5,
              ctx.canvas.height - CANVAS_PADDING,
              xPos + (CANVAS_PADDING * 2),
              yPos - (CANVAS_PADDING * 2)
            );
            ctx.stroke();
            ctx.lineWidth = 0.5;
            ctx.lineTo(xPos + (CANVAS_PADDING * 2), ctx.canvas.height - (CANVAS_PADDING + 4));
            ctx.closePath();
            ctx.strokeStyle = COLORS.error;
            ctx.stroke();
            ctx.fillStyle = COLORS.bgRed;
            ctx.fill();
            drawXDots(ctx);
            drawYDots(ctx);

            if (yPos > 100 && xPos < canvasRef.current.width * 0.85) {
              if (xPos > ctx.canvas.width * 0.6) {
                if (currentPlaneDirection === "UP") {
                  yPos += 1.2;
                  xPos += 0.4;
                  if (steps === 120) {
                    currentPlaneDirection = "DOWN";
                    steps = 0
                  } else steps++;
                } else {
                  yPos -= 1.2
                  xPos -= 0.4
                  if (steps === 120) {
                    currentPlaneDirection = "UP";
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
                if (elapsedTime && startTime) {
                  yPos = canvasHeight - Math.exp(0.000006 * elapsedTime); // Parabolic equation
                  xPos += 1.5;
                  setPlaneXPos(xPos);
                  setPlaneYPos(yPos);
                  setElapsedTime(Date.now() - startTime);
                }
              }
            }
            break;
          case "ENDED":
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

    // todo:  clear all canvases here
    drawBackground();
    drawWaiting();
    drawMultiplier();
    drawPlane();
  }, [gameState, now]);

  useEffect(() => {
    switch (gameState) {
      case PLAYING:
        playSegment(AUDIO_START);
        break;
      case ENDED:
        playSegment(AUDIO_FLY_AWAY);
        break;
    }
  }, [gameState]);

  const [now, setNow] = useState(Date.now());
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
           style={{width: "100%", minHeight: canvasHeight, borderRadius: 8, background: GRADIENTS.dark}}>
        <canvas ref={bgCanvasRef}/>
        <canvas ref={canvasRef}/>
        <canvas ref={textCanvasRef}/>
      </div>
    </div>
  )
}

export default GameView;
