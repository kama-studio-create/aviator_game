import { css } from "@emotion/react";
import {
  CANVAS_PADDING,
  CANVAS_START_POSITION,
  CODE,
  DOT_RADIUS,
  DOT_SCROLL_SPEED,
  DOT_SPACING,
  FACTOR,
  HOVER_OFFSET_CONST,
  PLANE_FRAME_RATE,
  TIME_TO_TOP,
  UID,
  WAITING_DURATION,
  WAITING_FOR_NEXT_ROUND,
} from "../common/constants.ts";
import { useEffect, useRef, useState } from "react";
import {
  backgroundImage,
  imageLoadPromises,
  planeSprites,
  spinnerImage,
} from "../common/images.ts";
import {
  generateBetSlip,
  getRandomNumber,
  uuidGenerator,
} from "../utils/generators.ts";
import {
  BG_GRAY_COLOR,
  BLUE_COLOR,
  BORDER_GRAY,
  ERROR_COLOR,
  GRADIENT_DARK,
  GRADIENT_INDIGO,
  GRADIENT_PURPLE,
  TRANSPARENT_RED_COLOR,
  WHITE_COLOR,
} from "../styles/colors.ts";
import { MEDIA_QUERIES } from "../styles/breakpoints.ts";
import { BetCard } from "./bets/BetCard.tsx";
import { TBetSlip, useBetSlipStore } from "../data/store/zustanf/bets.store.ts";
import { useSoundEffects } from "../hooks/audio/useSoundEffects.ts";
import BGAudioFile from "../assets/audio/bg_music.mp3";
import PlaneAudio from "../assets/audio/audio.mp3";
import { NotificationsView } from "./NotificationsView.tsx";
import { BetSlips } from "./bets/BetSlips.tsx";
import { PreviousRoundsView } from "./bets/PreviousRoundsView.tsx";
import useCrashAppEffect from "../hooks/useCrashAppEffect.ts";
import { useAtom } from "../data/store/lib/atoms.ts";
import {
  GAME_STATE_ENDED,
  GAME_STATE_IN_PROGRESS,
  GAME_STATE_STARTING,
} from "../data/types/types.ts";
import {
  endTimeAtom,
  gameStateAtom,
  preferencesAtom,
  startTimeAtom,
} from "../data/store/atoms.ts";

const gameStyles = {
  mainContainer: css({
    width: "100%",
    backgroundSize: "cover",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    transition: "all 1s ease-in-out",
  }),
  canvasContainer: css({
    width: "100%",
    display: "grid",
    placeContent: "center",
    borderRadius: 20,
    border: `1px solid ${BORDER_GRAY}`,
    transition: "all 1s ease-in-out",
    canvas: {
      borderRadius: 32,
    },
    maxHeight: "40vh",
    maxWidth: "98vw",
  }),
  loadingContainer: css({
    width: "100%",
    height: "100%",
    background: GRADIENT_DARK,
    position: "fixed",
    top: 0,
    left: 0,
    display: "grid",
    placeContent: "center",
    fontSize: 32,
    zIndex: 1000,
  }),
  userInputContainer: css({
    display: "flex",
    flexDirection: "row",
    gap: 8,
    position: "relative",
    [MEDIA_QUERIES[0]]: {
      flexDirection: "column",
    },
  }),
};

let allImagesLoaded = false;

Promise.all(imageLoadPromises)
  .then(() => {
    allImagesLoaded = true;
  })
  .catch((error) => {
    console.error("Error loading images:", error);
  });

const GameView = () => {
  const [now, setNow] = useState(Date.now());
  const gameState = useAtom(gameStateAtom);
  const endTime = useAtom(endTimeAtom);
  const startTime = useAtom(startTimeAtom);
  const { isAnimationEnabled } = useAtom(preferencesAtom);

  useCrashAppEffect({
    code: CODE,
    uid: UID,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [canvasWidth, setCanvasWidth] = useState(300);
  const [canvasHeight, setCanvasHeight] = useState(300);
  //TODO: derive planeWidth & height from canvasWidth & canvasHeight

  const { audioRef, isPlaying, bgAudioRef } = useSoundEffects({ gameState });

  const currentGameID = useBetSlipStore((state) => state.currentGameID);
  const betSlipStore = useBetSlipStore;

  const [bgColor, setBgColor] = useState(BG_GRAY_COLOR);

  useEffect(() => {
    const ref = audioRef.current;
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

    const resizeAndStyleCanvases = () => {
      if (!containerRef.current || !ctx) return;
      const currentWidth = containerRef.current.clientWidth;
      const currentHeight = currentWidth * 0.8;
      if (
        ctx.canvas.width !== currentWidth ||
        ctx.canvas.height !== currentHeight
      ) {
        setCanvasWidth(currentWidth);
        setCanvasHeight(currentHeight);
      }
    };

    resizeAndStyleCanvases();
    const resizeObserver = new ResizeObserver(resizeAndStyleCanvases);
    resizeObserver.observe(containerRef.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !allImagesLoaded) return;

    const { width, height } = ctx.canvas;
    const moveY = DOT_RADIUS;
    const elapsedTime = now - startTime;
    const multiplier =
      gameState === GAME_STATE_ENDED
        ? Math.exp(FACTOR * (endTime - startTime))
        : Math.exp(FACTOR * elapsedTime);

    const drawAxis = () => {
      if (gameState !== GAME_STATE_IN_PROGRESS) return;
      ctx.strokeStyle = BORDER_GRAY;
      ctx.lineWidth = 0.8;
      //draw x axis
      ctx.beginPath();
      ctx.moveTo(CANVAS_START_POSITION, height - CANVAS_START_POSITION);
      ctx.lineTo(width - CANVAS_PADDING, height - CANVAS_START_POSITION);
      ctx.closePath();
      ctx.stroke();

      //draw y axis
      ctx.beginPath();
      ctx.moveTo(CANVAS_START_POSITION, CANVAS_PADDING);
      ctx.lineTo(CANVAS_START_POSITION, height - CANVAS_START_POSITION);
      ctx.closePath();

      ctx.stroke();
    };

    const drawXDots = () => {
      if (gameState !== GAME_STATE_IN_PROGRESS) return;
      const moveX = 0;
      ctx.beginPath();
      const timeOffset = (elapsedTime / 1000) * DOT_SCROLL_SPEED; // Seconds * speed
      const scrollOffset =
        elapsedTime > TIME_TO_TOP ? timeOffset % (DOT_SPACING + DOT_RADIUS) : 0;
      for (
        let dotX = width - CANVAS_START_POSITION - moveX - scrollOffset;
        dotX >= 0;
        dotX -= DOT_SPACING
      ) {
        ctx.arc(
          dotX + CANVAS_START_POSITION,
          height - CANVAS_PADDING - DOT_RADIUS,
          DOT_RADIUS,
          0,
          2 * Math.PI,
          false,
        );
      }
      ctx.fillStyle = WHITE_COLOR;
      ctx.fill();
      ctx.closePath();
    };

    const drawYDots = () => {
      if (gameState !== GAME_STATE_IN_PROGRESS) return;
      ctx.beginPath();
      const timeOffset = (elapsedTime / 1000) * DOT_SCROLL_SPEED; // Seconds * speed
      const scrollOffset =
        elapsedTime > TIME_TO_TOP
          ? timeOffset % (DOT_SPACING + CANVAS_START_POSITION)
          : 0;
      for (
        let dotY = moveY - scrollOffset + CANVAS_START_POSITION;
        dotY < height - CANVAS_START_POSITION;
        dotY += DOT_SPACING
      ) {
        ctx.arc(
          DOT_RADIUS + CANVAS_PADDING,
          height - dotY - CANVAS_START_POSITION,
          DOT_RADIUS,
          0,
          2 * Math.PI,
          false,
        );
      }
      ctx.fillStyle = BLUE_COLOR;
      ctx.fill();
      ctx.closePath();
    };

    const drawBackground = () => {
      const angle = (elapsedTime * 0.01 * Math.PI) / 180;
      // Draw spinner
      const spinnerWidth = width * 3;
      const spinnerHeight =
        spinnerWidth * (backgroundImage.height / backgroundImage.width);

      ctx.save();
      ctx.globalAlpha = 1;
      ctx.translate(width / 2, height / 2);
      ctx.translate(-width / 2, height / 2);
      if (gameState === GAME_STATE_IN_PROGRESS) {
        ctx.rotate(angle);
        ctx.globalAlpha = 0.4;
      }
      ctx.drawImage(
        backgroundImage,
        -spinnerWidth / 2,
        -spinnerHeight / 2,
        spinnerWidth,
        spinnerHeight,
      );
      ctx.restore();

      // handle gradient changes
      if (gameState !== GAME_STATE_IN_PROGRESS) {
        setBgColor(BG_GRAY_COLOR);
      } else {
        if (multiplier > 8) {
          setBgColor(GRADIENT_INDIGO);
        } else if (multiplier > 1.8) {
          setBgColor(GRADIENT_PURPLE);
        } else {
          setBgColor(GRADIENT_DARK);
        }
      }
    };

    const drawWaiting = () => {
      if (gameState !== GAME_STATE_STARTING || !startTime) return;

      const angle = (elapsedTime % 360) * 0.00875;
      // Draw spinner
      const spinnerWidth = width * 0.15;
      const spinnerHeight =
        spinnerWidth * (spinnerImage.height / spinnerImage.width);
      const centerX = width / 2 - spinnerWidth / 2;
      const centerY = height / 2 - spinnerHeight / 2;
      ctx.save();
      ctx.translate(centerX + spinnerWidth / 2, centerY + spinnerHeight / 2);
      ctx.rotate(angle);
      ctx.drawImage(
        spinnerImage,
        -spinnerWidth / 2,
        -spinnerHeight / 2,
        spinnerWidth,
        spinnerHeight,
      );
      ctx.restore();

      // Draw progress bar
      const progress =
        (-elapsedTime / WAITING_DURATION) * 100 > 0
          ? (-elapsedTime / WAITING_DURATION) * 100
          : 0;
      // Draw text
      ctx.font = "18px sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = "#c9c9c9";
      ctx.fillText(
        WAITING_FOR_NEXT_ROUND,
        width / 2,
        height / 2 + spinnerHeight * 1.5,
      );
      ctx.canvas.style.background = "rgba(0,0,0,0.5)";
      ctx.fillStyle = "red";
      ctx.fillRect(
        width / 2 - 100,
        height / 2 + spinnerHeight,
        progress * 2,
        7,
      );
    };

    const drawMultiplier = () => {
      if (gameState === GAME_STATE_STARTING || !startTime) return;

      ctx.save();
      if (gameState === GAME_STATE_ENDED) {
        ctx.fillStyle = "#f7f7f7";
        ctx.font = "bold 24px Arial";
        ctx.textAlign = "center";
        ctx.fillText(
          "FLEW AWAY",
          ctx.canvas.width / 2,
          ctx.canvas.height / 2.3,
        );
      }
      ctx.fillStyle = gameState === GAME_STATE_ENDED ? "red" : "white";
      ctx.font = "bold 72px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        `${multiplier.toFixed(2)}x`,
        ctx.canvas.width / 2,
        ctx.canvas.height / 1.6,
      );
      ctx.restore();
    };

    const drawPlane = () => {
      if (!startTime) return;

      let yPos;
      let xPos;

      const currentSprite =
        Math.floor(Date.now() / PLANE_FRAME_RATE) % planeSprites.length;
      const planeSprite = planeSprites[currentSprite];
      const planeWidth = Math.floor(width * 0.28);
      const ratio = planeWidth / planeSprite.width;
      const planeHeight = Math.floor(planeSprite.height * ratio);

      const startX = 0;
      const startY = height;
      const endX = width - planeWidth * 1.5;
      const endY = planeHeight * 3;
      const progress =
        elapsedTime >= TIME_TO_TOP ? 1 : elapsedTime / TIME_TO_TOP;

      const hoverOffset =
        elapsedTime >= TIME_TO_TOP
          ? Math.sin(elapsedTime * 0.001) * HOVER_OFFSET_CONST
          : 0;

      const calculatePlaneProgress = (
        start: number,
        end: number,
        progress: number,
      ): number => {
        return (end - start) * progress + start;
      };

      yPos = calculatePlaneProgress(startY, endY, progress);
      xPos = calculatePlaneProgress(startX, endX, progress);

      switch (gameState) {
        case GAME_STATE_STARTING:
          ctx.globalAlpha = 0.5;
          ctx.drawImage(
            planeSprite,
            CANVAS_START_POSITION,
            height - planeHeight - CANVAS_START_POSITION,
            planeWidth,
            planeHeight,
          );
          break;
        case GAME_STATE_IN_PROGRESS:
          if (elapsedTime >= TIME_TO_TOP) {
            yPos += hoverOffset;
            xPos += hoverOffset * 0.4;
          }
          ctx.globalAlpha = 1;
          ctx.drawImage(
            planeSprite,
            xPos + CANVAS_START_POSITION,
            yPos - planeHeight - CANVAS_PADDING,
            planeWidth,
            planeHeight,
          );

          //draw line
          ctx.beginPath();
          ctx.moveTo(CANVAS_START_POSITION, height - CANVAS_START_POSITION);
          ctx.lineWidth = 5;
          ctx.strokeStyle = ERROR_COLOR;
          ctx.quadraticCurveTo(
            xPos / 1.5,
            height - CANVAS_START_POSITION,
            xPos + CANVAS_START_POSITION * 1.5,
            yPos - CANVAS_PADDING * 1.5,
          );
          ctx.stroke();
          ctx.lineWidth = 0.5;
          ctx.lineTo(
            xPos + CANVAS_START_POSITION * 1.5,
            height - CANVAS_START_POSITION,
          );
          ctx.closePath();
          ctx.strokeStyle = ERROR_COLOR;
          ctx.stroke();
          ctx.fillStyle = TRANSPARENT_RED_COLOR;
          ctx.fill();
          break;
        case GAME_STATE_ENDED:
          yPos -= Math.exp(0.012 * (Date.now() - endTime)) / 2;
          xPos += Math.exp(0.012 * (Date.now() - endTime));
          ctx.drawImage(planeSprite, xPos, yPos, planeWidth, planeHeight);
          break;
      }
    };

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    drawBackground();
    drawWaiting();
    drawAxis();
    drawXDots();
    drawYDots();
    if (isAnimationEnabled) {
      drawPlane();
    }
    drawWaiting();
    drawMultiplier();
  }, [gameState, startTime, endTime, now, isAnimationEnabled]);

  useEffect(() => {
    if (gameState === GAME_STATE_STARTING) {
      betSlipStore.setState({ allBetSlips: [] });
      betSlipStore.setState({ currentGameID: uuidGenerator() });
    }
  }, [gameState, betSlipStore]);

  // handle bet generation
  useEffect(() => {
    if (!currentGameID) return;
    const generateBetslips = (): TBetSlip[] => {
      const slips: TBetSlip[] = [];
      for (let i = 0; i < 40; i++) {
        const amount = getRandomNumber(100, 5000);
        const slip = generateBetSlip(amount, currentGameID, startTime);
        slips.push(slip);
      }
      return slips;
    };
    if (gameState === GAME_STATE_STARTING) {
      const slips = generateBetslips();
      betSlipStore.setState({ allBetSlips: slips });
    } else if (
      gameState === GAME_STATE_IN_PROGRESS &&
      betSlipStore.getState().allBetSlips.length > 0
    ) {
      const currentSlips = betSlipStore.getState().allBetSlips;
      const i = Math.floor(Math.random() * currentSlips.length);
      currentSlips[i].exitTime = Date.now() + 6000;
      betSlipStore.setState({ allBetSlips: currentSlips });
    }
  }, [betSlipStore, currentGameID, gameState, startTime]);

  useEffect(() => {
    let frameID = 0;

    function run() {
      setNow(Date.now());
      frameID = requestAnimationFrame(run);
    }

    run();
    return () => {
      cancelAnimationFrame(frameID);
    };
  }, []);

  return (
    <div css={gameStyles.mainContainer}>
      <audio ref={bgAudioRef} src={BGAudioFile} loop />
      <audio ref={audioRef} src={PlaneAudio} />
      <PreviousRoundsView />
      <div
        className={"bg-gray"}
        style={{ background: bgColor }}
        ref={containerRef}
        css={gameStyles.canvasContainer}
      >
        {!allImagesLoaded && (
          <div css={gameStyles.loadingContainer}>Loading</div>
        )}
        <canvas width={canvasWidth} height={canvasHeight} ref={canvasRef} />
      </div>
      <div css={gameStyles.userInputContainer}>
        <BetCard
          index={0}
          now={now}
          startTime={startTime}
          gameState={gameState}
        />
        <BetCard
          index={1}
          now={now}
          startTime={startTime}
          gameState={gameState}
        />
      </div>
      <BetSlips />
      <NotificationsView />
    </div>
  );
};

export default GameView;
