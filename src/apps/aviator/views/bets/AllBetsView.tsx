import { CSSProperties, FC, useEffect, useState } from "react";
import { css } from "@emotion/react";
import { PillButton } from "../../components/buttons/PillButton.tsx";
import {
  BUTTON_BG_COLOR,
  ERROR_COLOR,
  LIGHT_GRAY_COLOR,
  SUCCESS_COLOR,
  SUCCESS_COLOR_LIGHT,
  TRANSPARENT_RED_COLOR,
  WHITE_COLOR,
} from "../../styles/colors.ts";
import { fadeInAnimation, rowStyles } from "../../styles/common.ts";
import { DEFAULT_CURRENCY } from "../../common/constants.ts";
import historyIcon from "../../assets/icons/history.svg";
import iconClose from "../../assets/icons/close.svg";
import { censor } from "../../utils/censor.ts";
import { MultiplierBadge } from "../../components/badges/MultiplierBadge.tsx";
import { assignAvatar } from "../../utils/assignAvatar.ts";
import { useAtom } from "../../data/store/lib/atoms.ts";
import { allBetsAtom, loadingBetsAtom } from "../../data/store/atoms.ts";
import { Loader } from "../../components/loader/Loader.tsx";
import { generateAllBets, getRandomNumber } from "../../utils/generators.ts";

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
  img: {
    opacity: 0.5,
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
  const allBets = useAtom(allBetsAtom);
  const loading = useAtom(loadingBetsAtom);
  const [isPreviousHandActive, setIsPreviousHandActive] = useState(false);
  const styles: CSSProperties = {
    borderColor: isPreviousHandActive ? ERROR_COLOR : LIGHT_GRAY_COLOR,
    backgroundColor: isPreviousHandActive? TRANSPARENT_RED_COLOR : BUTTON_BG_COLOR,
    color: isPreviousHandActive? WHITE_COLOR : LIGHT_GRAY_COLOR,
    opacity: isPreviousHandActive? 0.7 : 1,
  }

  useEffect(() => {
    generateAllBets(getRandomNumber(30, 400));
  }, [isPreviousHandActive]);

  return (
    <div css={containerStyles}>
      <div css={headerStyles}>
        <div>
          <h1>All Bets</h1>
          <h1>{allBets.length}</h1>
        </div>
        <div>
          <PillButton
            onClick={() => setIsPreviousHandActive(!isPreviousHandActive)}
            size="xs"
            variant="secondary"
            style={styles}
          >
            <img
              className="icon"
              width={16}
              height={16}
              src={isPreviousHandActive ? iconClose : historyIcon}
              alt="history"
            />
            Previous hand
          </PillButton>
        </div>
      </div>
      {loading && <Loader />}
      {!loading && (
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
                  backgroundColor: betSlip.stopped_at
                    ? SUCCESS_COLOR_LIGHT
                    : "black",
                  border: betSlip.stopped_at ? `1px solid ${SUCCESS_COLOR}` : "none",
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
                      opacity: betSlip.stopped_at ? 1 : 0.5,
                    }}
                  >
                    {betSlip.bet.toFixed(2)}
                  </p>
                  <MultiplierBadge onClick={() => {}} multiplier={2.5} />
                </td>
                <td style={{ justifyContent: "end" }} css={rowStyles}>
                  <p
                    style={{
                      textAlign: "right",
                      opacity: betSlip.stopped_at ? 1 : 0.5,
                    }}
                  >
                    {betSlip.stopped_at && "2590.99"}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
