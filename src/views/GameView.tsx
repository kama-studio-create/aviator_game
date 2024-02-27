import {useRef, useEffect, FC} from 'react';
import PlaneImage from '../assets/plane.svg';
import BgImage from '../assets/canvas-bg.svg';
import {GRADIENTS} from "../styles/colors.ts";


const GameView: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const lineRef = useRef<HTMLCanvasElement>(null);
  // create a canvas image source
  const imageRef = useRef<HTMLImageElement>(new Image());
  const backgroundRef = useRef<HTMLImageElement>(new Image());
  imageRef.current.src = PlaneImage;
  backgroundRef.current.src = BgImage;
  backgroundRef.current.style.zIndex = '-1';

  useEffect(() => {
    if (containerRef.current && canvasRef.current && bgCanvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      const bgCtx = bgCanvasRef.current.getContext('2d');
      const lineCtx = lineRef.current?.getContext('2d');

      if (ctx) {
        ctx.canvas.width = containerRef.current.offsetWidth;
        ctx.canvas.height = containerRef.current.offsetWidth;
        ctx.canvas.style.zIndex = '2';
      }
      if(bgCtx) {
        bgCtx.canvas.width = containerRef.current.offsetWidth;
        bgCtx.canvas.height = containerRef.current.offsetWidth;
      }
      if(lineCtx) {
        lineCtx.canvas.width = containerRef.current.offsetWidth;
        lineCtx.canvas.height = containerRef.current.offsetWidth;
      }
      drawBackground();
      drawPlane();
      animatePlaneForward();
    }
  }, [containerRef, canvasRef]);

  // draw background canvas and animate to spin
  const drawBackground = () => {
    let angle = 0;
    const animate = () => {
      if (bgCanvasRef.current) {
        const ctx = bgCanvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          ctx.save();
          ctx.canvas.style.opacity = '0.2';
          ctx.translate(0, ctx.canvas.height)
          ctx.rotate(angle);
          ctx.scale(1, -1)
          ctx.drawImage(
            backgroundRef.current,
            -Math.floor(ctx.canvas.width * 2),
            -Math.floor(ctx.canvas.width * 2),
            ctx.canvas.width * 4,
            ctx.canvas.height * 4,
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
        ctx.drawImage(imageRef.current, 10, ctx.canvas.height * 0.8, 75, 37);
      }
    }
  };

  // animate plane from bottom to top right corner of the canvas
  const animatePlaneForward = () => {
    let yPos = canvasRef.current ? canvasRef.current.height * 0.8 : 0;
    let xPos = 0;
    let progress = 100;
    const color = 'red';
    const width = 3;
    const startX = 100;
    const startY = canvasRef.current ? canvasRef.current.height : 0;
    const endX =  canvasRef.current ? canvasRef.current.width : 0;
    const endY = 0;


    const radius = canvasRef.current ? canvasRef.current.width : 0;
    const animate = () => {
      if (canvasRef.current && imageRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          ctx.drawImage(imageRef.current, xPos, yPos, 75, 37);
          ctx.beginPath();
          ctx.moveTo(0, ctx.canvas.height);
          ctx.lineTo(xPos, yPos + 37);
          // ctx.arcTo(xPos + radius, yPos + 37, xPos + radius, yPos, radius);
          ctx.lineTo(xPos, ctx.canvas.height);
          ctx.closePath()
          ctx.stroke();
          ctx.fillStyle = 'rgba(241,4,4,0.5)';
          ctx.fill();
          if(xPos > canvasRef.current.width * 0.85) {
            yPos += yPos * 0.1

          } else {
            yPos = ctx.canvas.height - (xPos * ctx.canvas.height / ctx.canvas.width);
            xPos += 1.5;
          }

        }

        //animate only until the plane reaches the top of the canvas
        if(yPos > 10 && xPos < canvasRef.current.width * 0.85) {
          requestAnimationFrame(animate);
        }
      }
    };
    // Define the function that draws the partial line
    const drawLine = ()=> {
      const ctx = lineRef.current?.getContext('2d');
      const canvas = lineRef.current;
      if(!ctx || !canvas) {
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Set the stroke style
      ctx.strokeStyle = color;
      ctx.lineWidth = width;

      // Begin the path
      ctx.beginPath();

      // Move to the start point
      ctx.moveTo(startX, startY);

      // Calculate the current point based on the progress
      // Draw the arc using the arcTo method
      ctx.arcTo(
        startX + radius,
        startY,
        xPos,
        yPos - radius,
        radius
      );


      // Line to the current point
      // ctx.lineTo(currentX, currentY);

      // Stroke the path
      ctx.stroke();
      ctx.save();

      // Decrease the progress by 0.01
      progress -= 0.01; // Changed to negative

      // Check if the progress is greater than or equal to zero
      if (progress >= 0) { // Changed to zero
        // Request the next frame
        requestAnimationFrame(drawLine);
      }
    };
    // drawLine();
    animate();
  };



  return (
    <div ref={containerRef} css={{ width: '100%', background: GRADIENTS.dark}}>
      <canvas
        ref={canvasRef}
        style={{ border: '1px solid black', zIndex: 200, borderRadius: 4 }}
      >
          Your browser does not support the HTML5 canvas tag.
      </canvas>
      <canvas ref={lineRef} style={{  position: 'absolute', left: 0, top: 0, zIndex: 1, borderRadius: 12 }}></canvas>
      <canvas ref={bgCanvasRef} style={{  position: 'absolute', left: 0, top: 0, zIndex: 1, borderRadius: 12 }}></canvas>
    </div>

  );
};

export default GameView;
