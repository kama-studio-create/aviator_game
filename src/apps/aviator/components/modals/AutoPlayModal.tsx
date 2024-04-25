import { FC, useState } from "react";
import { css } from "@emotion/react";
import {
  DARK_GRAY_COLOR,
  GRAY_COLOR,
  LIGHT_COLOR,
  LIGHT_GRAY_COLOR,
  PRIMARY_COLOR,
  SUCCESS_COLOR,
  WHITE_COLOR,
} from "../../styles/colors.ts";
import iconClose from "../../assets/icons/close.svg";
import { PillButton } from "../buttons/PillButton.tsx";
import {
  STOP_IF_CASH_DECREASES,
  STOP_IF_CASH_INCREASES,
  STOP_IF_SINGLE_WIN_EXCEEDS,
} from "../../common/constants.ts";
import { ModalToggleCard } from "../cards/ModalToggleCard.tsx";
import { TAutoPlaySettings } from "../../views/bets/BetCard.tsx";

type ModalProps = {
  isOpen: boolean;
  onClose: (i: boolean) => void;
  onStart: (bet: TAutoPlaySettings) => void;
};

const overlay = css({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  width: "100%",
  height: "100%",
  zIndex: 100,
  display: "flex",
  flexDirection: "column",
  justifyItems: "center",
  alignItems: "start",
  padding: 16,
  transition: "all 0.3s ease-in-out",
});
const row = css({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 16,
});
const container = css({
  backgroundColor: "#2c2d30",
  borderRadius: 8,
  maxWidth: 500,
  width: "100%",
  marginInline: "auto",
});
const header = css({
  paddingInline: 16,
  paddingBlock: 8,
  display: "flex",
  flexDirection: "row",
  gap: 16,
  justifyContent: "space-between",
  h1: {
    fontWeight: 600,
    fontSize: 16,
  },
});
const closeButton = css({
  fontSize: 12,
  cursor: "pointer",
  padding: 0,
  background: "none",
  border: "none",
  ":hover": {
    color: LIGHT_COLOR,
  },
  img: {
    width: 20,
    height: 20,
  },
});
const body = css({
  paddingInline: 8,
  paddingBlock: 8,
  display: "flex",
  flexDirection: "column",
  gap: 4,
  backgroundColor: GRAY_COLOR,
});
const bodyCard = css({
  padding: 16,
  display: "flex",
  flexDirection: "column",
  gap: 8,
  backgroundColor: "#2c2d30",
  borderRadius: 8,
  h2: {
    fontWeight: 600,
    fontSize: 14,
    textAlign: "center",
  },
});
const footer = css({
  paddingInline: 16,
  paddingBlock: 8,
  display: "flex",
  flexDirection: "row",
  gap: 16,
  justifyContent: "center",
  alignItems: "center",
});

const roundOptions = [
  { name: "10", value: 10 },
  { name: "20", value: 20 },
  { name: "50", value: 50 },
  { name: "100", value: 100 },
];

export const AutoPlayModal: FC<ModalProps> = ({ isOpen, onClose, onStart }) => {
  const [numberOfRounds, setNumberOfRounds] = useState(0);

  const [stopIfCashDecreases, setStopIfCashDecreases] = useState(false);
  const [stopIfCashIncreases, setStopIfCashIncreases] = useState(false);
  const [stopIfWinExceeds, setStopIfWinExceeds] = useState(false);
  const [cashDecreaseLimit, setCashDecreaseLimit] = useState(10);
  const [cashIncreaseLimit, setCashIncreaseLimit] = useState(10);
  const [winExceedsLimit, setWinExceedsLimit] = useState(10);

  const closeModal = () => {
    onClose(false);
  };

  const handleReset = () => {
    setStopIfCashDecreases(false);
    setStopIfCashIncreases(false);
    setStopIfWinExceeds(false);
    setCashDecreaseLimit(10);
    setCashIncreaseLimit(10);
    setWinExceedsLimit(10);
  };

  const handleStart = () => {
    const autoplaySettings: TAutoPlaySettings = {
      rounds: numberOfRounds,
      winAmountLimit: stopIfCashIncreases ? cashIncreaseLimit : undefined,
      lossAmountLimit: stopIfCashDecreases ? cashDecreaseLimit : undefined,
      singleWinLimit: stopIfWinExceeds ? winExceedsLimit : undefined,
    };
    onStart(autoplaySettings);
    closeModal();
  };

  return (
    <>
      {isOpen && (
        <div css={overlay}>
          <div css={container}>
            <div css={header}>
              <h1>Auto play Options</h1>
              <button css={closeButton} onClick={closeModal}>
                <img src={iconClose} alt="close" />
              </button>
            </div>
            <div css={body}>
              <div css={bodyCard}>
                <h2>Number of Rounds:</h2>
                <div style={{ width: "70%", marginInline: "auto" }} css={row}>
                  {roundOptions.map((option) => (
                    <PillButton
                      style={{
                        paddingInline: 16,
                        fontSize: 12,
                        paddingBlock: 8,
                        backgroundColor:
                          numberOfRounds === option.value
                            ? LIGHT_GRAY_COLOR
                            : DARK_GRAY_COLOR,
                        fontWeight: 400,
                        color:
                          numberOfRounds === option.value
                            ? WHITE_COLOR
                            : LIGHT_GRAY_COLOR,
                        border: `1px solid ${numberOfRounds === option.value ? SUCCESS_COLOR : LIGHT_GRAY_COLOR}`,
                      }}
                      key={option.value}
                      variant="success"
                      size="sm"
                      onClick={() => {
                        setNumberOfRounds(option.value);
                      }}
                    >
                      {option.name}
                    </PillButton>
                  ))}
                </div>
              </div>
              <ModalToggleCard
                handleSwitchChange={setStopIfCashDecreases}
                handleInputChange={setCashDecreaseLimit}
                title={STOP_IF_CASH_DECREASES}
                inputValue={cashDecreaseLimit}
                switchValue={stopIfCashDecreases}
              />
              <ModalToggleCard
                handleSwitchChange={setStopIfCashIncreases}
                handleInputChange={setCashIncreaseLimit}
                title={STOP_IF_CASH_INCREASES}
                inputValue={cashIncreaseLimit}
                switchValue={stopIfCashIncreases}
              />
              <ModalToggleCard
                handleSwitchChange={setStopIfWinExceeds}
                handleInputChange={setWinExceedsLimit}
                title={STOP_IF_SINGLE_WIN_EXCEEDS}
                inputValue={winExceedsLimit}
                switchValue={stopIfWinExceeds}
              />
            </div>
            <div css={footer}>
              <PillButton
                style={{
                  paddingInline: 16,
                  fontSize: 10,
                  paddingBlock: 8,
                  fontWeight: 400,
                  background: PRIMARY_COLOR,
                }}
                variant="error"
                size="sm"
                onClick={handleReset}
              >
                Reset
              </PillButton>
              <PillButton
                style={{ fontWeight: 500, backgroundColor: SUCCESS_COLOR }}
                variant="success"
                size="sm"
                onClick={handleStart}
              >
                START
              </PillButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
