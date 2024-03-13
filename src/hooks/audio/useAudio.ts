import {useEffect, useRef, useState} from 'react';

interface AudioSprite {
  [segmentName: string]: number[];
}

export const audioSprite: AudioSprite = {
  flyAway: [2000, 3000],
  start: [5000, 2000]
}

export const useAudio = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const bgAudioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const handlePlayBgAudio = () => {
    if (!hasInteracted && bgAudioRef.current) {
      bgAudioRef.current.play().catch((e) => {
        throw Error(e);
      });
      bgAudioRef.current.volume = 0.5;
      setHasInteracted(true);
    }
  };

  const playSegment = (segmentName: string) => {
    const [startTime, duration] = audioSprite[segmentName];
    if(!hasInteracted) return;
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
    window.addEventListener('click', handlePlayBgAudio);
    window.addEventListener('touchstart', handlePlayBgAudio);
    window.addEventListener('keydown', handlePlayBgAudio);

    return () => {
      window.removeEventListener('click', handlePlayBgAudio);
      window.removeEventListener('touchstart', handlePlayBgAudio);
      window.removeEventListener('keydown', handlePlayBgAudio);
    };
  });


  return { audioRef, playSegment, isPlaying, bgAudioRef };
};