import { FC } from "react";
import { Modal } from "../Modal.tsx";
import { PROVABLY_FAIR_SETTINGS } from "../../../common/constants.ts";
import {
  BACKGROUND_COLOR,
  BLACK_COLOR,
  ERROR_COLOR,
  GRAY_COLOR,
  HEADER_COLOR,
  WHITE_COLOR,
} from "../../../styles/colors.ts";
import { css } from "@emotion/react";
import { rowStyles } from "../../../styles/common.ts";
import iconClient from "../../../assets/icons/client.svg";
import iconServer from "../../../assets/icons/server.svg";
import { ProvablyFairRadioGroup } from "../../inputs/ProvablyFairRadioGroup.tsx";
import iconQuestion from "../../../assets/icons/question.svg";

const bodyStyles = css({
  display: "flex",
  flexDirection: "column",
  gap: 4,
  padding: 16,
  borderBottom: `1px solid ${HEADER_COLOR}`,
  p: {
    opacity: 0.6,
    color: WHITE_COLOR,
    fontSize: 13,
  },
  "& .error": {
    color: ERROR_COLOR,
    opacity: 0.8,
    fontSize: 13,
    gap: 4,
    img: {
      width: 14,
      height: 14,
    },
  },
  h1: {
    fontSize: 15,
    lineHeight: 1,
    fontWeight: 400,
    textTransform: "capitalize",
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
  span: {
    opacity: 0.6,
  },
  div: {
    width: "80%",
    overflow: "hidden",
    border: "none",
  },
});

type Props = {
  isOpen: boolean;
  handleClose: () => void;
};

export const ProvablyFairModal: FC<Props> = ({ handleClose }) => {

  return (
    <Modal
      title={PROVABLY_FAIR_SETTINGS}
      isOpen={true}
      handleClose={handleClose}
      // style={{
      //   position: "fixed",
      // }}
      headerBackgroundColor={BACKGROUND_COLOR}
      bodyBackgroundColor={GRAY_COLOR}
      hasCloseButton={true}
      footer={<p>You can check fairness of each bet from bets history</p>}
    >
      <div css={bodyStyles}>
        <p>
          This game uses Provably Fair technology to determine game result. This
          tool gives you ability to change your seed and check fairness of the
          game.
        </p>
        <div className="error" css={rowStyles}>
          <img src={iconQuestion} alt="question" />
          What is Provably Fair
        </div>
      </div>
      <div css={bodyStyles}>
        <div css={rowStyles}>
          <img src={iconClient} alt="server" />
          <div>
            <h1>Client (Your)Seed:</h1>
          </div>
        </div>
        <p>
          Round result is determined form combination of server seed and first 3
          bets of the round.
        </p>
        <ProvablyFairRadioGroup />
      </div>
      <div style={{ border: "none" }} css={bodyStyles}>
        <div css={rowStyles}>
          <img src={iconServer} alt="server" />
          <div>
            <h1>Server Seed SHA256:</h1>
          </div>
        </div>
        <div css={selectContainer}>
          <div>zgln5ZYqcyShXUGF8OKzgln5ZYqcyShXUGF8OKzgln</div>
        </div>
      </div>
    </Modal>
  );
};
