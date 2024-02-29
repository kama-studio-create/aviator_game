import {useRef, useEffect, RefObject} from 'react';

interface UseClearCanvasProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
}

function useClearCanvas({ canvasRef }: UseClearCanvasProps): () => void {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  const clearCanvas = () => {
    if (isMounted.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  return clearCanvas;
}

export default useClearCanvas;
