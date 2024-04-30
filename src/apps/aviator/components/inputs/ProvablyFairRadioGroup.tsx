import { ChangeEvent, FC, useState } from "react";
import { rowStyles } from "../../styles/common.ts";
import { css } from "@emotion/react";
import {
  BLACK_COLOR,
  BORDER_SUCCESS_COLOR,
  DARK_GRAY_COLOR,
  SUCCESS_COLOR,
  WHITE_COLOR,
} from "../../styles/colors.ts";

const container = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  gap: 4,
});

const seedContainer = css({
  width: "100%",
  background: DARK_GRAY_COLOR,
  borderRadius: 8,
  paddingInline: 16,
  paddingBlock: 12,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  gap: 8,
  button: {
    color: WHITE_COLOR,
    backgroundColor: SUCCESS_COLOR,
    paddingInline: 16,
    paddingBlock: 8,
    maxWidth: 110,
    marginInline: "auto",
    borderRadius: 16,
    fontSize: 14,
    fontWeight: 600,
    textTransform: "uppercase",
    transition: "background-color 0.2s ease-in-out",
    border: `1px solid ${BORDER_SUCCESS_COLOR}`,
    ":disabled": {
      opacity: 0.4,
    },
  },
});

const radioInputStyles = css({
  appearance: "none",
  width: 16,
  height: 16,
  border: `1px solid ${SUCCESS_COLOR}`,
  borderRadius: "50%",
  background: "transparent",
  transition: "all 0.2s ease-in-out",
  "&:before": {
    content: "''",
    display: "block",
    width: "60%",
    height: "60%",
    borderRadius: "50%",
    margin: "20% auto",
    transition: "all 0.2s ease-in-out",
  },
  "&:checked": {
    "&:before": {
      background: SUCCESS_COLOR,
    },
  },
});

const selectContainer = css({
  width: "100%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: BLACK_COLOR,
  fontSize: 14,
  paddingBlock: 12,
  paddingInline: 16,
  marginBlock: 4,
  borderRadius: 32,
  fontWeight: 500,
  gap: 4,
  overflow: "hidden",
  "&.disabled": {
    opacity: 0.4,
  },
  span: {
    opacity: 0.6,
    fontSize: 13,
  },
  input: {
    width: "80%",
    overflow: "hidden",
    border: "none",
    background: "transparent",
    ":focus-visible": {
      border: "none",
      outline: "none",
    },
  },
});

type RadioProps = {
  label: string;
  radioValue: string;
  checked: boolean;
  onSeedChange: (value: string) => void;
  onRadioChange: (value: boolean) => void;
  seedValue: string;
  isEditable: boolean;
  name: string;
};

const ProvablyFairRadio: FC<RadioProps> = ({
  label,
  radioValue,
  checked,
  onSeedChange,
  onRadioChange,
  isEditable,
  name,
  seedValue,
}) => {
  const [seedInputValue, setSeedInputValue] = useState(seedValue);
  const onSeedInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSeedInputValue(event.target.value);
  };
  const onRadioButtonChange = (event: ChangeEvent<HTMLInputElement>) => {
    onRadioChange(event.target.checked);
  };
  const onSubmitSeedValue = () => {
    onSeedChange(seedInputValue);
  };

  return (
    <div css={container}>
      <div css={seedContainer}>
        <div css={rowStyles}>
          <input
            type="radio"
            onChange={onRadioButtonChange}
            name={name}
            value={radioValue}
            checked={checked}
            css={radioInputStyles}
          />
          <p>{label}</p>
        </div>
        <div className={!checked ? "disabled" : ""} css={selectContainer}>
          <span>Current:</span>
          <input
            disabled={!isEditable || !checked}
            type={"text"}
            value={seedValue}
            onChange={onSeedInputChange}
          />
        </div>
        {isEditable && (
          <button onClick={onSubmitSeedValue} disabled={!checked}>
            Change
          </button>
        )}
      </div>
    </div>
  );
};

export const ProvablyFairRadioGroup: FC = () => {
  const [seed, setSeed] = useState("zgln5ZYqcyShXUGF8OKdgfhjkhgf");
  const [isSeedRandom, setIsSeedRandom] = useState(false);

  const onSeedValueChange = (value: string) => {
    if (isSeedRandom) return;
    setSeed(value);
  };

  return (
    <div css={container}>
      <ProvablyFairRadio
        name={"seed"}
        seedValue={seed}
        label={"Random on every new game"}
        radioValue={"random"}
        checked={isSeedRandom}
        onSeedChange={onSeedValueChange}
        onRadioChange={() => setIsSeedRandom(true)}
        isEditable={false}
      />
      <ProvablyFairRadio
        name={"seed"}
        seedValue={seed}
        label={"Enter Manually"}
        radioValue={"manual"}
        checked={!isSeedRandom}
        onSeedChange={onSeedValueChange}
        onRadioChange={() => setIsSeedRandom(false)}
        isEditable={true}
      />
    </div>
  );
};
