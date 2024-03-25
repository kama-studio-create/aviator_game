import {useEffect, useRef, useState} from "react";
import {AUDIO_FLY_AWAY, AUDIO_START, ENDED, IGameState, PLAYING} from "../../common/constants.ts";

export const audioSprite = {
  flyAway: [2000, 3000],
  start: [5000, 2000]
} as const;

type UseAudioProps = {
  gameState: IGameState,
}

export const useAudio = ({gameState}: UseAudioProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const bgAudioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  useEffect(() => {
    const playSegment = (segmentName: keyof typeof audioSprite) => {
      const [startTime, duration] = audioSprite[segmentName];
      if (!hasInteracted || !audioRef.current) return;
      audioRef.current.currentTime = startTime / 1000;
      audioRef.current.play().catch((e) => {
        throw Error(e);
      });

      setIsPlaying(true);

      setTimeout(() => {
        if (!audioRef.current) return;
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
      }, duration);
    };

    if(gameState === PLAYING) playSegment(AUDIO_START);
    if(gameState === ENDED) playSegment(AUDIO_FLY_AWAY);
    
    
  }, [gameState, hasInteracted])

  

  useEffect(() => {
    const bgAudio = bgAudioRef.current;
    if (!hasInteracted || !bgAudio) return;
    if(!bgAudio) return;
    bgAudio.play().catch((e) => {
      throw Error(e);
    });
    bgAudio.volume = 0.5;
  }, [hasInteracted]);

  useEffect(() => {
    const handlePlayBgAudio = () => {
      setHasInteracted(true);
    };

    window.addEventListener("click", handlePlayBgAudio);
    window.addEventListener("touchstart", handlePlayBgAudio);
    window.addEventListener("keydown", handlePlayBgAudio);

    return () => {
      window.removeEventListener("click", handlePlayBgAudio);
      window.removeEventListener("touchstart", handlePlayBgAudio);
      window.removeEventListener("keydown", handlePlayBgAudio);
    };
  }, []);


  return {audioRef, isPlaying, bgAudioRef};
};
