import {css} from "@emotion/react";
import {
	AUDIO_FLY_AWAY,
	AUDIO_START,
	BORDER_RADIUS,
	ENDED,
	IGameState,
	PLANE_FLIGHT_RATE,
	PLANE_FRAME_RATE,
	PLANE_HEIGHT,
	PLANE_WIDTH,
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
import useClearCanvas from "../hooks/useClearCanvas.ts";
import {COLORS} from "../common/colors.ts";
import {getRandomNumber} from "../utils/generators.ts";

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
  const [canvasWidth, setCanvasWidth] = useState(300);
  const [canvasHeight, setCanvasHeight] = useState(300);

  const [startTime, setStartTime] = useState<number | null>(Date.now());
  const [duration, setDuration] = useState<number>(0);

  const [now, setNow] = useState(Date.now());
  const [currentSprite, setCurrentSprite] = useState(0);

  const clearCanvases = useClearCanvas({canvasRefs: [bgCanvasRef, canvasRef, textCanvasRef]});

  const [timeToTop, setTimeToTop] = useState<number>(0);
  const [timeToXposEnd, setTimeToXposEnd] = useState<number>(0);

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
		
    const calculateTimeToTop = (canvasHeight: number) => {
      if (PLANE_HEIGHT >= canvasHeight) {
        throw new Error("PLANE_HEIGHT must be less than canvasHeight");
      }
      const top = PLANE_HEIGHT * 2;
      return Math.log(canvasHeight - top) / PLANE_FLIGHT_RATE;
    }

    const resizeAndStyleCanvases = () => {
      if (!containerRef.current || !ctx || !bgCtx || !textCtx) return;
      const currentWidth = containerRef.current.clientWidth;
      const currentHeight = currentWidth;
      if (ctx.canvas.width !== currentWidth || ctx.canvas.height !== currentHeight) {
        setCanvasWidth(currentWidth);
        setCanvasHeight(currentHeight);
        const timeY = Math.floor(calculateTimeToTop(currentHeight));
        setTimeToTop(timeY);
      }
      ctx.canvas.style.borderRadius = BORDER_RADIUS;
      textCtx.canvas.style.borderRadius = BORDER_RADIUS;
    }

    resizeAndStyleCanvases();
    const resizeObserver = new ResizeObserver(resizeAndStyleCanvases);
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const dotSpacing = 80;
    const moveX = 0;
    const dotRadius = 2
    const moveY = dotRadius;

    if(!startTime || !duration) return;
    const elapsedTime = now - startTime;
    const drawBackground = () => {
      const ctx = bgCanvasRef.current?.getContext("2d");
      if (!ctx || gameState !== PLAYING || !startTime) return;

      const {width, height} = ctx.canvas;
      ctx.save();
      // Draw background image
      ctx.canvas.style.marginLeft = `${CANVAS_PADDING}px`;
      ctx.canvas.style.marginBottom = `${CANVAS_PADDING}px`;
      ctx.translate(0, width)
      const angle = (now - startTime) % 360 * 0.0005;
      ctx.rotate(angle);
      ctx.scale(1, -1);
      ctx.globalAlpha = 0.3;
      ctx.drawImage(backgroundImage, -Math.floor(width * 4), -Math.floor(height * 4), width * 8, height * 8,);

      // Draw axis
      ctx.globalAlpha = 1;
      ctx.canvas.style.background = GRADIENTS.dark;
      ctx.canvas.style.borderLeft = "1px solid white";
      ctx.canvas.style.borderBottom = "1px solid white";

      ctx.restore();
    }

    const drawWaiting = () => {
      const ctx = bgCanvasRef.current?.getContext("2d");
      if (!ctx || gameState !== WAITING || !startTime || !duration) return;
      const {width, height} = ctx.canvas;
      const angle = (now - startTime) % 360 * 0.01;

      // Draw spinner
      ctx.save();
      ctx.translate(width / 2, width / 2);
      ctx.rotate(angle);
      ctx.drawImage(spinnerImage, -spinnerImage.width / 2, -spinnerImage.height / 2,);
      ctx.restore();
      // Draw progress bar
      let progress = 0;
      if(elapsedTime > WAITING_DURATION) {
        progress = 100;
      } else {
        progress = elapsedTime / duration * 100;
      }
       
      // Draw text
      ctx.font = "18px sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = "#c9c9c9";
      ctx.fillText("Waiting for next round", width / 2, height * 0.9);
      ctx.canvas.style.background = "rgba(0,0,0,0.5)";
      ctx.fillStyle = "red";
      ctx.fillRect(width / 2 - 100, height * 0.8, progress * 2, 7);
      if(elapsedTime > duration) {
        setGameState(PLAYING);
      }
    }

    const drawMultiplier = () => {
      const ctx = textCanvasRef.current?.getContext("2d");
      if(!ctx || gameState === WAITING ||!startTime ||!duration) return;

      let multiplier = Math.exp(0.00006 * elapsedTime);
      if(elapsedTime >= duration) multiplier = Math.exp(0.00006 * duration);
      ctx.save();
      if(elapsedTime >= duration) {
        ctx.fillStyle = "#f7f7f7";
        ctx.font = "bold 32px Arial";
        ctx.textAlign = "center";
        ctx.fillText(`FLEW AT`, ctx.canvas.width / 2, ctx.canvas.height / 2.3);
      }
      ctx.fillStyle = elapsedTime >= duration ? "red": "white";
      ctx.font = "bold 72px Arial";
      ctx.textAlign = "center";
      ctx.fillText(`${multiplier.toFixed(2)}x`, ctx.canvas.width / 2, ctx.canvas.height / 1.7);
      ctx.restore();
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

      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx ||!startTime) return;

      const { height} = ctx.canvas;

      let yPos = height;
      let xPos = CANVAS_PADDING;
      
      switch (gameState) {
        case WAITING:
          ctx.globalAlpha = 0.5;
          ctx.drawImage(planeSprites[currentSprite], CANVAS_PADDING, ctx.canvas.height - PLANE_HEIGHT - CANVAS_PADDING, PLANE_WIDTH, PLANE_HEIGHT);
          break;
        case PLAYING:
          ctx.globalAlpha = 1;
          if(elapsedTime < timeToTop) {
            yPos = height - Math.exp(0.0012 * elapsedTime)
            xPos = Math.exp(0.0011 * elapsedTime);
          } else {
            yPos = height - Math.exp(0.0012 * timeToTop)
            xPos = Math.exp(0.0011 * timeToTop) + CANVAS_PADDING;
            const offset = Math.sin(elapsedTime * 0.002) * 32
            yPos += offset;
            xPos += (offset * 0.4);
          }

          ctx.drawImage(planeSprites[currentSprite], xPos, yPos - PLANE_HEIGHT - CANVAS_PADDING, PLANE_WIDTH, PLANE_HEIGHT);
					
          //draw line
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
          //draw dots
          drawXDots(ctx);
          drawYDots(ctx);
          break;
        case ENDED:
          ctx.drawImage(planeSprites[currentSprite], CANVAS_PADDING, ctx.canvas.height - PLANE_HEIGHT - CANVAS_PADDING, PLANE_WIDTH, PLANE_HEIGHT);
          break;
        default:
          break;
      }
      if(now % PLANE_FRAME_RATE === 0) {
        if(currentSprite === planeSprites.length -1 ){
          setCurrentSprite(0);
        } else {
          setCurrentSprite(prev => {
            return prev + 1;
          });
        }
      }
    }

    clearCanvases();
    drawBackground();
    drawPlane();
    drawWaiting();
    drawMultiplier();
    // handleGameState();
  }, [gameState, now]);

  useEffect(() => {

    switch (gameState) {
      case WAITING:
        setDuration(WAITING_DURATION);
        break;
      case PLAYING:
        setStartTime(Date.now());
        setDuration(getRandomNumber(10000, 25000))
        playSegment(AUDIO_START);
        break;
      case ENDED:
        setStartTime(Date.now());
        console.log(ENDED);
        playSegment(AUDIO_FLY_AWAY);
        break;
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
        <canvas width={canvasWidth - 20} height={canvasHeight - 20} ref={bgCanvasRef}/>
        <canvas width={canvasWidth} height={canvasHeight} ref={canvasRef}/>
        <canvas width={canvasWidth} height={canvasHeight} ref={textCanvasRef}/>
      </div>
    </div>
  )
}

export default GameView;
