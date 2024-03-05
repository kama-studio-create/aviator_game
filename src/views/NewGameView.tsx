import {ComponentPropsWithoutRef, FC, useEffect, useRef, useState} from "react";
import AudioFile from '../assets/audio/audio.mp3';
import BgAudioFile from '../assets/audio/bg_music.mp3'
import {css} from "@emotion/react";
import {GRADIENTS} from "../styles/colors.ts";
import {getRandomNumber} from "../utils/generators.ts";
import {IGameState} from "../types/game.type.ts";
import useClearCanvas from "../hooks/useClearCanvas.ts";
import {breakpoints} from "../styles/breakpoints.ts";
import {backgroundImage, plane1, planeSprites, spinnerImage} from "../common/images.ts";
import {audioSprite} from "../common/audio.ts";


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
    left: 16,
    ".bg-canvas" : {
      opacity: 0,
      transition: 'opacity 0.5s ease-in-out'
    }
  },

})



export const NewGameView: FC<ComponentPropsWithoutRef<'div'>> = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const textCanvasRef = useRef<HTMLCanvasElement>(null);
  const waitingCanvasRef = useRef<HTMLCanvasElement>(null);
  const dotsCanvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const bgAudioRef = useRef<HTMLAudioElement>(null);

  const clearCanvas = useClearCanvas({canvasRef});
  const clearWaitingCanvas = useClearCanvas({canvasRef: waitingCanvasRef});
  const clearTextCanvas = useClearCanvas({canvasRef: textCanvasRef});
  const clearBgCanvas = useClearCanvas({canvasRef: bgCanvasRef})

  let currentMultiplier = 1;

  const [canvasWidth, setCanvasWidth] = useState(300);
  const [canvasHeight, setCanvasHeight] = useState(300);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const [gameState, setGameState] = useState<IGameState>('WAITING');

  const [mainMultiplier, setMainMultiplier] = useState(1);


  const [backgroundFrameId, setBackgroundFrameId] = useState(0);
  const [planeFrameId, setPlaneFrameId] = useState(0);
  const [spinnerFrameId, setSpinnerFrameId] = useState(0);

  const [dotPositions, setDotPositions] = useState<number[]>([]);


  const [imagesLoaded, setImagesLoaded] = useState(false);


  let yPos = canvasRef.current ? canvasRef.current.height * 0.75 : 50;
  let xPos = 0;

  const planeWidth = window.innerWidth > breakpoints[0] ? 150 : 75;
  const planeHeight = window.innerWidth > breakpoints[0] ? 74: 37;

  const [planeXPos, setPlaneXPos] = useState(0);
  const [planeYPos, setPlaneYPos] = useState(0);
  const handleImageLoad = () => {
    if (backgroundImage.complete && plane1.complete && spinnerImage.complete) {
      setImagesLoaded(true);
    }
  };

  useEffect(() => {
    backgroundImage.onload = () => handleImageLoad();
    plane1.onload = () => handleImageLoad();
    spinnerImage.onload = () => handleImageLoad();
  }, []);

  const handlePlayBgAudio = () => {
    if (!hasInteracted && bgAudioRef.current) {
      bgAudioRef.current.play();
      bgAudioRef.current.volume = 0.5;
      setHasInteracted(true);
    }
  };

  const playSegment = (segmentName: string) => {
    if(!hasInteracted) return;
    const [startTime, duration] = audioSprite[segmentName];
    if(!audioRef.current) return;
    audioRef.current.currentTime = startTime / 1000;
    audioRef.current.play();
    setIsPlaying(true);

    setTimeout(() => {
      if(!audioRef.current) return;
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }, duration);
  };

  useEffect(() => {
    return () => {
      if (isPlaying) {
        if(!audioRef.current || !bgAudioRef.current) return;
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    window.addEventListener('click', handlePlayBgAudio);
    window.addEventListener('touchstart', handlePlayBgAudio);
    window.addEventListener('keydown', handlePlayBgAudio);

    return () => {
      window.removeEventListener('click', handlePlayBgAudio);
      window.removeEventListener('touchstart', handlePlayBgAudio);
      window.removeEventListener('keydown', handlePlayBgAudio);
    };
  }, []);
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
            backgroundImage,
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
        const frameID = requestAnimationFrame(animate);
        setBackgroundFrameId(frameID);
      }
    }
    animate();
  }

  const drawWaiting = () => {
    let angle = 0;
    let progress = 0;
    const startTime = Date.now();
    const animate = () => {
      const canvas = waitingCanvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(angle);
      ctx.drawImage(
        spinnerImage,
        -spinnerImage.width / 2,
        -spinnerImage.height / 2,
      );


      const progressInterval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
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
      ctx.fillRect(
        canvas.width / 2 - 100,  // Center horizontally
        canvas.height * 0.75, // Below the image
        progress * 2,         // 200 pixels wide at max
        7                    // Height of bar
      );
      const frameId = requestAnimationFrame(animate);
      setSpinnerFrameId(frameId);
    }
    animate()
  }

  const drawPlane = () => {
    if (canvasRef.current && plane1) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.drawImage(plane1, 10, ctx.canvas.height-planeHeight, planeWidth, planeHeight);
      }
    }
  }

  const animatePlane = () => {
    const path : {x: number, y: number}[] = [];
    let frameID = 0;
    let x = planeXPos;
    let currentGameState: IGameState = 'WAITING';
    let currentSprite = 0
    const animate = () => {
      currentGameState = gameState;
      if(canvasRef.current && plane1) {
        const ctx = canvasRef.current.getContext('2d');
        if(!ctx) return;
        switch (currentGameState) {
          case 'WAITING' :
            cancelAnimationFrame(planeFrameId);
            clearCanvas();
            break;
          case 'PLAYING':
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.drawImage(planeSprites[currentSprite], xPos, yPos-planeHeight, planeWidth, planeHeight);
            ctx.beginPath();
            ctx.moveTo(0, ctx.canvas.height);
            for (let i = 0; i < path.length; i++) {
              ctx.lineTo(path[i].x, path[i].y);
            }
            ctx.lineTo(xPos, ctx.canvas.height);
            ctx.closePath();
            ctx.strokeStyle = 'rgba(241,4,4,0.8)';
            ctx.stroke();
            ctx.fillStyle = 'rgba(241,4,4,0.5)';
            ctx.fill();
            if( yPos > 100 && xPos < canvasRef.current.width * 0.85) {
              const xOffset = xPos / (canvasRef.current.width * 0.85); // Normalize x position for curve calculation
              yPos = canvasRef.current.height - canvasRef.current.height * Math.pow(xOffset, 2); // Parabolic equation
              xPos += 1.5;
              x +=1.5;
              setPlaneXPos(xPos);
              setPlaneYPos(yPos);
              path.push({x: xPos, y: yPos});
              if(currentSprite === planeSprites.length - 1) {
                currentSprite = 0;
              } else {
                currentSprite += 1;
              }
            }

            break;
          case 'ENDED':
            cancelAnimationFrame(frameID);
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.drawImage(planeSprites[currentSprite], x, planeYPos - planeHeight, planeWidth, planeHeight);
            if(x < ctx.canvas.width * 1.5) {
              x += 12;
              yPos -= 2;
              setPlaneYPos(yPos);
              setPlaneXPos(x);
            }
            break;
        }
        frameID = requestAnimationFrame(animate);
        setPlaneFrameId(frameID);
      }
    }
    animate()
  }
  const animateMultiplier = () => {
    let currentState = gameState
    const animate = () => {
      currentState = gameState;
      if (textCanvasRef.current && currentState !== 'WAITING') {
        const ctx = textCanvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          ctx.save();
          if(currentState === 'ENDED') {
            ctx.fillStyle = '#f7f7f7';
            ctx.font = 'bold 32px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`FLEW AT`, ctx.canvas.width / 2, ctx.canvas.height / 2.3);ctx.fillStyle = currentMultiplier < mainMultiplier ? 'white': 'red';
            ctx.fillStyle = 'red';
            ctx.font = 'bold 72px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${mainMultiplier.toFixed(2)}x`, ctx.canvas.width / 2, ctx.canvas.height / 1.7);
          } else if(currentState === 'PLAYING') {
            ctx.fillStyle = currentMultiplier < mainMultiplier ? 'white': 'red';
            ctx.font = 'bold 72px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${currentMultiplier.toFixed(2)}x`, ctx.canvas.width / 2, ctx.canvas.height / 1.7);
          }

          ctx.restore();
          currentMultiplier += 0.01;
        }
        if(currentMultiplier < mainMultiplier && currentState === 'PLAYING') {
          requestAnimationFrame(animate);
        } else {
          setGameState("ENDED");
        }

      }
    }
    animate()
  }

  const animateDots = () => {
    const dotSpacing = 40;
    const dotRadius = 5;
    const currentState = gameState;
    const numDotsX = Math.floor(canvasWidth / dotSpacing) + 1;
    const numDotsY = Math.floor(canvasHeight / dotSpacing) + 1;
    let dotPositionsX = Array(numDotsY).fill(0);
    const animationSpeed = 24;
    const dotColor = 'white';
    const initialPositions = Array(numDotsX).fill(canvasWidth + dotRadius);
    setDotPositions(initialPositions);
    const animate = () => {
      if(dotsCanvasRef.current && currentState !== 'WAITING') {
        const ctx = dotsCanvasRef.current.getContext('2d');
        if(!ctx) return;
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        setDotPositions((prevPositions) =>
          prevPositions.map((x) => (x - animationSpeed + canvasWidth) % canvasWidth)
        );
        dotPositionsX = dotPositionsX.map((x) => (x + 2) % (canvasWidth - dotRadius * 2));

        for (let i = 0; i < numDotsX; i++) {
          const x = dotPositions[i];
          const y = canvasHeight - dotRadius; // Place dots on the bottom

          ctx.beginPath();
          ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
          ctx.fillStyle = dotColor;
          ctx.fill();
        }

        requestAnimationFrame(animate);
      }

    }

    animate();
  }


  useEffect(()=> {
    if (canvasRef.current && containerRef.current) {
      setCanvasWidth(containerRef.current.clientWidth);
      setCanvasHeight(containerRef.current.clientWidth);
      const ctx = canvasRef.current.getContext('2d');
      const bgCtx = bgCanvasRef.current?.getContext('2d');
      const textCtx = textCanvasRef.current?.getContext('2d');
      const waitingCtx = waitingCanvasRef.current?.getContext('2d');
      const dotsCtx = dotsCanvasRef.current?.getContext('2d');
      if (ctx) {
        ctx.canvas.width = containerRef.current.clientWidth;
        ctx.canvas.height = containerRef.current.clientWidth;
        ctx.canvas.style.borderRadius = `8px`;
      }
      if(bgCtx) {
        bgCtx.canvas.width = containerRef.current.clientWidth;
        bgCtx.canvas.height = containerRef.current.clientWidth;
        bgCtx.canvas.style.borderRadius = `8px`;
      }
      if(textCtx) {
        textCtx.canvas.width = containerRef.current.clientWidth;
        textCtx.canvas.height = containerRef.current.clientWidth;
        textCtx.canvas.style.borderRadius = `8px`;
      }
      if(waitingCtx) {
        waitingCtx.canvas.width = containerRef.current.clientWidth;
        waitingCtx.canvas.height = containerRef.current.clientWidth;
        waitingCtx.canvas.style.borderRadius = `8px`;
      }
      if(dotsCtx) {
        dotsCtx.canvas.width = containerRef.current.clientWidth;
        dotsCtx.canvas.height = containerRef.current.clientWidth;
        dotsCtx.canvas.style.borderRadius = `8px`;
      }
      animatePlane();
    }
  }, [canvasRef, containerRef]);


  useEffect(() => {
    if(!imagesLoaded) return;
    switch (gameState) {
      case 'WAITING':
        clearTextCanvas();
        drawPlane();
        drawWaiting()
        setTimeout(() => {
          setMainMultiplier(getRandomNumber(1,8));
          setGameState('PLAYING');
        }, 6000)
        break;
      case 'PLAYING':
        playSegment("start");
        cancelAnimationFrame(spinnerFrameId);
        clearWaitingCanvas();
        drawBackground();
        animateMultiplier();
        animatePlane();
        animateDots();
        break;
      case 'EXITED':
        break;
      case 'ENDED':
        playSegment("flyAway")
        animatePlane();
        animateMultiplier();
        cancelAnimationFrame(backgroundFrameId);
        // animateDots();
        clearBgCanvas();
        setTimeout(() => {
          setGameState('WAITING');
        }, 5000)
        break;
      default: break;
    }
  }, [gameState, imagesLoaded])

  return (
    <div css={[gameStyles, {minHeight: canvasHeight, minWidth: canvasWidth}]}>
      <audio ref={bgAudioRef} src={BgAudioFile} loop />
      <audio ref={audioRef} src={AudioFile}/>
      <div ref={containerRef}
        css={{width: '100%', minHeight: canvasHeight, background: GRADIENTS.dark, borderRadius: 8}}>
        <canvas className="bg-canvas" ref={bgCanvasRef}/>
        <canvas ref={canvasRef}/>
        <canvas ref={textCanvasRef}/>
        <canvas ref={dotsCanvasRef}/>

        <canvas style={{display: gameState === 'WAITING' ? 'block' : 'none'}} ref={waitingCanvasRef}/>
        <div style={{height: canvasHeight, width: canvasWidth}}></div>
      </div>
    </div>


  )
}
