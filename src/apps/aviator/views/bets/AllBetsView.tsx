import { FC } from "react";
import { css } from "@emotion/react";
import { PillButton } from "../../components/buttons/PillButton.tsx";
import {
  LIGHT_GRAY_COLOR,
  SUCCESS_COLOR,
  SUCCESS_COLOR_LIGHT,
  WHITE_COLOR,
} from "../../styles/colors.ts";
import { fadeInAnimation, rowStyles } from "../../styles/common.ts";
import { DEFAULT_CURRENCY } from "../../common/constants.ts";
import historyIcon from "../../assets/icons/history.svg";
import { censor } from "../../utils/censor.ts";
import { useBetSlipStore } from "../../data/store/zustanf/bets.store.ts";
import { MultiplierBadge } from "../../components/badges/MultiplierBadge.tsx";
import { assignAvatar } from "../../utils/assignAvatar.ts";

const containerStyles = css({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: 8,
  animation: `${fadeInAnimation} 0.3s ease-in-out`,
});

const headerStyles = css({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingBlock: 8,
  flexDirection: "row",
  h1: {
    fontSize: 14,
    fontWeight: 400,
  },
  "& .button": {
    fontWeight: 500,
    fontSize: 12,
    background: "transparent",
    border: `1px solid ${LIGHT_GRAY_COLOR}`,
    color: LIGHT_GRAY_COLOR,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingInline: 8,
    paddingBlock: 2,
    gap: 8,
    img: {
      opacity: 0.5,
    },
  },
});

const tableItem = css({
  width: "100%",
  fontSize: 14,
  fontWeight: 400,
  color: WHITE_COLOR,
  backgroundColor: "black",
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  alignItems: "center",
  justifyContent: "space-between",
  paddingBlock: 2,
  padding: 8,
  borderRadius: 8,
  fontFamily: "Inter, sans-serif",
  p: {
    opacity: 0.7,
  },
  "& .avatar": {
    width: 30,
    height: 30,
    background: "white",
    borderRadius: "50%",
    border: `1px solid ${LIGHT_GRAY_COLOR}`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    img: {
      width: 30,
      height: 30,
      borderRadius: "50%",
    },
  },
  "& .name": {
    fontSize: 14,
    fontWeight: 400,
    color: WHITE_COLOR,
    opacity: 0.5,
  },
});

export const AllBetsView: FC = () => {

  const allBets = useBetSlipStore((state) => state.allBetSlips);

  return (
    <div css={containerStyles}>
      <div css={headerStyles}>
        <div>
          <h1>All Bets</h1>
          <h1>4590</h1>
        </div>
        <div>
          <PillButton className="button" variant="success">
            <img width={16} height={16} src={historyIcon} alt="history" />
            Previous hand
          </PillButton>
        </div>
      </div>
      <table style={{ width: "100%", fontSize: 12, fontWeight: 400 }}>
        <thead>
          <tr
            style={{ justifyContent: "space-between", paddingInline: 4 }}
            css={rowStyles}
          >
            <th css={rowStyles}>User</th>
            <th style={{ justifyContent: "start" }} css={rowStyles}>
              <div>Bet {DEFAULT_CURRENCY}</div>
              <div>X</div>
            </th>
            <th css={rowStyles}>Cash Out {DEFAULT_CURRENCY}</th>
          </tr>
        </thead>
        <tbody
          style={{
            justifyContent: "space-between",
            gap: 4,
            flexDirection: "column",
            maxHeight: "50vh",
            overflowY: "scroll",
          }}
          css={rowStyles}
        >
          {allBets.map((betSlip) => (
            <tr
              key={betSlip.username}
              style={{
                backgroundColor: betSlip.exitTime
                  ? SUCCESS_COLOR_LIGHT
                  : "black",
                border: betSlip.exitTime
                  ? `1px solid ${SUCCESS_COLOR}`
                  : "none",
              }}
              css={tableItem}
            >
              <td css={rowStyles}>
                <div className="avatar">
                  {betSlip.username && (
                    <img alt="bet" src={assignAvatar(betSlip.username)} />
                  )}
                </div>
                {betSlip.username && (
                  <p className="name">{censor(betSlip.username)}</p>
                )}
              </td>
              <td style={{ justifyContent: "center" }} css={rowStyles}>
                <p
                  style={{
                    textAlign: "right",
                    opacity: betSlip.exitTime ? 1 : 0.5,
                  }}
                >
                  {betSlip.amount.toFixed(2)}
                </p>
                <MultiplierBadge onClick={() => {}} multiplier={2.5} />
              </td>
              <td style={{ justifyContent: "end" }} css={rowStyles}>
                <p
                  style={{
                    textAlign: "right",
                    opacity: betSlip.exitTime ? 1 : 0.5,
                  }}
                >
                  2500
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
