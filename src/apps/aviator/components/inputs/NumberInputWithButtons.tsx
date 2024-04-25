import { ComponentProps, FC } from "react";
import { css } from "@emotion/react";
import { MINIMUM_BET } from "../../common/constants.ts";
import IconMinus from "../../assets/icons/minus.svg";
import { NumberInput } from "./NumberInput.tsx";
import IconPlus from "../../assets/icons/plus.svg";

const smallBtn = css({
  width: 10,
  height: 10,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  backgroundColor: "transparent",
  fontSize: 12,
  border: "none",
  transition: "all 0.3s ease-in-out",
  opacity: 0.6,
  "&:hover": {
    backgroundColor: "#1b1c1d",
  },
  "&:disabled": {
    opacity: 0.4,
  },
});

const row = css({
  display: "flex",
  flexDirection: "row",
  gap: 8,
  position: "relative",
  alignItems: "center",
  background: "black",
  borderRadius: 16,
  paddingInline: 8,
});

type props = {
  value: number;
  onValueChange: (value: number) => void;
  disabled: boolean;
} & ComponentProps<"div">;

export const NumberInputWithButtons: FC<props> = ({
  value,
  onValueChange,
  disabled,
  ...props
}) => {
  const decreaseAmount = () => {
    if (value > MINIMUM_BET) {
      onValueChange(value - 1);
      return;
    }
  };

  const increaseAmount = () => {
    onValueChange(value + 1);
    return;
  };

  return (
    <div css={row} {...props}>
      <button disabled={disabled} onClick={decreaseAmount} css={smallBtn}>
        <img src={IconMinus} width={20} height={20} alt="minus" />
      </button>
      <NumberInput
        disabled={disabled}
        value={value}
        name="amount"
        handleChange={onValueChange}
      />
      <button disabled={disabled} onClick={increaseAmount} css={smallBtn}>
        <img src={IconPlus} width={20} height={20} alt="plus" />
      </button>
    </div>
  );
};
