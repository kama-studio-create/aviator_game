import { FC, useCallback, useEffect, useState } from "react";
import { css, keyframes } from "@emotion/react";
import {
  BORDER_BLUE,
  COLOR_BLUE,
  LIGHT_GRAY_COLOR,
  WHITE_COLOR,
} from "../../styles/colors.ts";
import SwitchInput from "../../components/inputs/SwitchInput.tsx";
import { NumberInput } from "../../components/inputs/NumberInput.tsx";
import { AutoPlayModal } from "../../components/modals/AutoPlayModal.tsx";
import { TAutoPlaySettings } from "./BetCard.tsx";
import { getMultiplier } from "../../utils/getMultiplier.ts";
import {
  GAME_STATE_ENDED,
  GAME_STATE_IN_PROGRESS,
} from "../../data/types/types.ts";
import { useAtom } from "../../data/store/lib/atoms.ts";
import { gameStateAtom, startTimeAtom } from "../../data/store/atoms.ts";

const growAnimation = keyframes({
  "0%": {
    transform: "scaleY(0)",
  },
  "100%": {
    transform: "scaleY(1)",
  },
});

const controlStyles = {
  autoplayContainer: css({
    display: "flex",
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: "100%",
    paddingTop: 16,
    borderTop: "1px solid black",
    animation: `${growAnimation} 0.1s ease-in-out`,
    animationDirection: "alternate",
  }),
  autoplayButton: css({
    height: 22,
    paddingBlock: 4,
    paddingInline: 12,
    textAlign: "center",
    backgroundColor: COLOR_BLUE,
    border: `1px solid ${BORDER_BLUE}`,
    borderRadius: 16,
    fontSize: 12,
    textTransform: "uppercase",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    justifyContent: "center",
    alignItems: "center",
    color: WHITE_COLOR,
    transition: "background-color 0.2s ease-in-out",
  }),
  autoCashOutContainer: css({
    display: "flex",
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    color: LIGHT_GRAY_COLOR,
    fontWeight: 500,
  }),
};
type props = {
  now: number;
};

export const AutoPlayControls: FC<props> = ({ now }) => {
  const [isAutoPlayActive, setIsAutoPlayActive] = useState(false);
  const [isAutoPlayModalOpen, setIsAutoplayModalOpen] = useState(false);
  const [isAutoCashOut, setIsAutoCashOut] = useState(false);
  const [autoCashOutPoint, setAutoCashOutPoint] = useState(2.1);
  const [autoPlayConfig, setAutoPlayConfig] = useState<
    TAutoPlaySettings | undefined
  >(undefined);
  const [autoplayRounds, setAutoPlayRounds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const gameState = useAtom(gameStateAtom);
  const startTime = useAtom(startTimeAtom);

  useEffect(() => {
    if (!autoPlayConfig) return;
    setAutoPlayRounds(autoPlayConfig.rounds);
    setIsAutoPlayActive(true);
    console.log(isAutoPlayActive);
  }, [autoPlayConfig]);

  const onEndAutoPlaySession = useCallback(() => {
    setIsAutoPlayActive(false);
    setAutoPlayRounds(0);
    setIsAutoCashOut(false);
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    if (gameState === GAME_STATE_IN_PROGRESS && isAutoCashOut && isPlaying) {
      const multiplier = getMultiplier(startTime, now);
      if (multiplier >= autoCashOutPoint) {
        // setExitTime(now);
      }
    }
    if (gameState === GAME_STATE_ENDED && isAutoCashOut && isPlaying) {
      if (autoplayRounds === 0) {
        onEndAutoPlaySession();
      }
    }
  }, [
    autoCashOutPoint,
    autoplayRounds,
    gameState,
    isAutoCashOut,
    isPlaying,
    now,
    onEndAutoPlaySession,
    startTime,
  ]);

  return (
    <>
      <AutoPlayModal
        isOpen={isAutoPlayModalOpen}
        onClose={setIsAutoplayModalOpen}
        onStart={setAutoPlayConfig}
      />
      <div css={controlStyles.autoplayContainer}>
        <button
          onClick={() => {
            setIsAutoplayModalOpen(true);
          }}
          css={controlStyles.autoplayButton}
        >
          Autoplay
        </button>
        <div css={controlStyles.autoCashOutContainer}>
          <div>Auto Cash Out</div>
          <SwitchInput checked={isAutoCashOut} onChange={setIsAutoCashOut} />
          <NumberInput
            style={{ maxWidth: 80 }}
            disabled={!isAutoCashOut}
            handleChange={setAutoCashOutPoint}
            value={autoCashOutPoint}
          />
        </div>
      </div>
    </>
  );
};
