import { FC } from "react";
import { Modal } from "../Modal.tsx";
import { GAME_RULES } from "../../../common/constants.ts";
import { css } from "@emotion/react";
import { ERROR_COLOR, WHITE_COLOR } from "../../../styles/colors.ts";

type props = {
  isOpen: boolean;
  handleClose: () => void;
};

const rulesContainer = css({
  padding: 16,
  display: "flex",
  flexDirection: "column",
  gap: 16,
  "& .intro": {
    color: WHITE_COLOR,
    opacity: 0.8,
  },
  "& .error": {
    color: ERROR_COLOR,
  },
  h1: {
    color: WHITE_COLOR,
    fontSize: 16,
    opacity: 0.8,
  },
});

const mediaContainer = css({
  width: "100%",
  height: "100%",
  iframe: {
    width: "100%",
    height: "100%",
  },
});

const descriptionContainer = css({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  gap: 16,
  "& .error": {
    color: ERROR_COLOR,
  },
  h1: {
    color: WHITE_COLOR,
    fontSize: 16,
    opacity: 0.8,
  },
  "& .rules": {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    padding: 16,
    justifyContent: "center",
    "& .rule": {
      color: WHITE_COLOR,
      width: "60%",
      h2: {
        fontSize: 24,
        fontWeight: 700,
        color: WHITE_COLOR,
      },
    },
  },
});

export const GameRulesModal: FC<props> = ({ isOpen, handleClose }) => {
  return (
    <Modal
      title={GAME_RULES}
      isOpen={isOpen}
      handleClose={handleClose}
      style={{
        position: "fixed",
        width: "98vw",
        marginInline: "1vw",
      }}
      hasCloseButton={true}
    >
      <div css={rulesContainer}>
        <div className="intro">
          Aviator is a new generation of iGaming entertainment. You can win many
          times more, in seconds! Aviator is built on a provably fair system,
          which is currently the only real guarantee of honesty in the gambling
          industry.
        </div>
        <div className="error">Read more about provably fair system</div>
        <h1>HOW TO PLAY</h1>
        <div css={mediaContainer}>
          <iframe
            _ngcontent-ggc-c37=""
            frameBorder="0"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
            className="embed-responsive-item"
            src="https://www.youtube.com/embed/PZejs3XDCSY?playsinline=1"
          ></iframe>
        </div>
        <div css={descriptionContainer}>
          <h1> Aviator is as easy to play as 1-2-3: </h1>
          <div className="rules">
            <div className="rule">
              <h2>01</h2>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
