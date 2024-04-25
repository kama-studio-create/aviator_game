import { ComponentProps, FC } from "react";
import { css } from "@emotion/react";
import SwitchInput from "../inputs/SwitchInput.tsx";
import { DEFAULT_CURRENCY } from "../../common/constants.ts";
import { NumberInputWithButtons } from "../inputs/NumberInputWithButtons.tsx";
import { rowStyles } from "../../styles/common.ts";

const styles = css({
  padding: 8,
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#2c2d30",
  borderRadius: 8,
  h2: {
    fontWeight: 600,
    fontSize: 12,
    textAlign: "left",
  },
});

type props = {
  handleSwitchChange: (value: boolean) => void;
  handleInputChange: (value: number) => void;
  title: string;
  inputValue: number;
  switchValue: boolean;
} & ComponentProps<"div">;

export const ModalToggleCard: FC<props> = ({
  handleSwitchChange,
  handleInputChange,
  title,
  inputValue,
  switchValue,
}) => {
  return (
    <div css={styles}>
      <div style={{ justifyContent: "space-between" }} css={rowStyles}>
        <div css={rowStyles}>
          <SwitchInput checked={switchValue} onChange={handleSwitchChange} />
          <h2>{title} </h2>
        </div>
        <div style={{ justifyContent: "flex-end" }} css={rowStyles}>
          <h2>{DEFAULT_CURRENCY}</h2>
          <NumberInputWithButtons
            style={{ maxWidth: 90 }}
            disabled={!switchValue}
            value={inputValue}
            onValueChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );
};
