import {useEffect, useRef, useState} from "react";

export const audioSprite = {
  flyAway: [2000, 3000],
  start: [5000, 2000]
} as const;

export const useAudio = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const bgAudioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const playSegment = (segmentName: keyof typeof audioSprite) => {
    const [startTime, duration] = audioSprite[segmentName];
    if (!hasInteracted) return;
    if (!audioRef.current) return;
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

  useEffect(() => {
    if (hasInteracted && bgAudioRef.current) {
      bgAudioRef.current.play().catch((e) => {
        throw Error(e);
      });
      bgAudioRef.current.volume = 0.5;
      setHasInteracted(true);
    }
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


  return {audioRef, playSegment, isPlaying, bgAudioRef};
};
