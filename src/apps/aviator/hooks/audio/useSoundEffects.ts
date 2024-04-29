import { useEffect, useRef, useState } from "react";
import { AUDIO_FLY_AWAY, AUDIO_START } from "../../common/constants.ts";
import {
  GAME_STATE_ENDED,
  GAME_STATE_IN_PROGRESS,
  GameState,
} from "../../data/types/types.ts";
import { useAtom } from "../../data/store/lib/atoms.ts";
import { preferencesAtom } from "../../data/store/atoms.ts";

export const audioSprite = {
  flyAway: [2000, 3000],
  start: [5000, 2000],
} as const;

type UseAudioProps = {
  gameState: GameState;
};

export const useSoundEffects = ({ gameState }: UseAudioProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const bgAudioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const { isSoundEnabled, isMusicEnabled } = useAtom(preferencesAtom);

  useEffect(() => {
    const playSegment = (segmentName: keyof typeof audioSprite) => {
      const [startTime, duration] = audioSprite[segmentName];
      if (!hasInteracted || !audioRef.current || !isSoundEnabled) return;
      audioRef.current.currentTime = startTime / 1000;
      audioRef.current.play().catch((e) => {
        throw Error(e);
      });

      setIsPlaying(true);

      setTimeout(() => {
        if (!audioRef.current) return;
        audioRef.current.pause();
        audioRef.current;
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
      }, duration);
    };

    if (gameState === GAME_STATE_IN_PROGRESS) playSegment(AUDIO_START);
    if (gameState === GAME_STATE_ENDED) playSegment(AUDIO_FLY_AWAY);
  }, [gameState, hasInteracted, isSoundEnabled]);

  useEffect(() => {
    const bgAudio = bgAudioRef.current;
    if (!hasInteracted || !bgAudio) return;
    if (isMusicEnabled) {
      bgAudio
        .play()
        .then(() => {
          bgAudio.volume = 0.5;
        })
        .catch(() => {});
    } else {
      bgAudio.pause();
      bgAudio.currentTime = 0;
    }
  }, [hasInteracted, isMusicEnabled]);

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

  return { audioRef, isPlaying, bgAudioRef };
};
