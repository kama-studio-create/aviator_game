import {RefObject, useEffect, useRef} from 'react';

interface UseClearCanvasProps {
  canvasRefs: RefObject<HTMLCanvasElement>[];
}

function useClearCanvas({ canvasRefs }: UseClearCanvasProps): () => void {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  const clearCanvas = () => {
    if (isMounted.current && canvasRefs.length > 0) {
      canvasRefs.forEach((ref) => {
        if (ref.current) {
          const ctx = ref.current.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, ref.current.width, ref.current.height);
          }
        }
      });
    }
  };

  return clearCanvas;
}

export default useClearCanvas;