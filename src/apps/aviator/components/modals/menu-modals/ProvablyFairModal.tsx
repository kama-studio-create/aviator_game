import { FC, useEffect } from "react";
import { Modal } from "../Modal.tsx";
import { PROVABLY_FAIR_SETTINGS } from "../../../common/constants.ts";
import {
  BACKGROUND_COLOR,
  BLACK_COLOR,
  DARK_GRAY_COLOR,
  ERROR_COLOR,
  GRAY_COLOR,
  HEADER_COLOR,
  SUCCESS_COLOR,
  WHITE_COLOR,
} from "../../../styles/colors.ts";
import { css } from "@emotion/react";
import { rowStyles } from "../../../styles/common.ts";
import iconClient from "../../../assets/icons/client.svg";
import iconServer from "../../../assets/icons/server.svg";

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
    opacity: 0.7,
  },
  h1: {
    fontSize: 15,
    lineHeight: 1,
    fontWeight: 400,
    textTransform: "capitalize",
  },
});

const seedContainer = css({
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
    border: `1px solid ${WHITE_COLOR}`,
  },
});

const selectContainer = css({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: BLACK_COLOR,
  fontSize: 14,
  padding: 12,
  marginBlock: 4,
  borderRadius: 32,
  fontWeight: 500,
  gap: 4,
  overflow: "hidden",
  span: {
    opacity: 0.6,
  },
});

type props = {
  isOpen: boolean;
  handleClose: () => void;
};

export const ProvablyFairModal: FC<props> = ({ isOpen, handleClose }) => {
  useEffect(() => {
    console.log(PROVABLY_FAIR_SETTINGS, isOpen);
  }, []);
  return (
    <Modal
      title={PROVABLY_FAIR_SETTINGS}
      isOpen={true}
      handleClose={handleClose}
      style={{
        position: "fixed",
        width: "98vw",
        marginInline: "1vw",
      }}
      headerBackgroundColor={BACKGROUND_COLOR}
      bodyBackgroundColor={GRAY_COLOR}
      hasCloseButton={true}
      footer={"You can check fairness of each bet from bets history"}
    >
      <div css={bodyStyles}>
        <p>
          This game uses Provably Fair technology to determine game result. This
          tool gives you ability to change your seed and check fairness of the
          game.
        </p>
        <div className="error" css={rowStyles}>
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
        <div css={seedContainer}>
          <p>Random on every new game</p>
          <div css={selectContainer}>
            <span>Current:</span> zgln5ZYqcyShXUGF8OK
          </div>
        </div>
        <div style={{ opacity: 0.3 }} css={seedContainer}>
          <p>Enter manually</p>
          <div css={selectContainer}>
            <span>Current:</span> zgln5ZYqcyShXUGF8OK
          </div>
          <button>Change</button>
        </div>
      </div>
      <div style={{ border: "none" }} css={bodyStyles}>
        <div css={rowStyles}>
          <img src={iconServer} alt="server" />
          <div>
            <h1>Server Seed SHA256:</h1>
          </div>
        </div>
        <div css={selectContainer}>
          zgln5ZYqcyShXUGF8OKzgln5ZYqcyShXUGF8OKzgln
        </div>
      </div>
    </Modal>
  );
};
