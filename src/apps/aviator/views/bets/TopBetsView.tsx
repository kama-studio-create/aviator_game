import { FC, useEffect, useState } from "react";
import { css } from "@emotion/react";
import { Tab, Tabs } from "../../components/tabs/Tabs.tsx";
import { rowStyles } from "../../styles/common.ts";
import { DEFAULT_CURRENCY } from "../../common/constants.ts";
import { DARK_GRAY_COLOR, LIGHT_GRAY_COLOR } from "../../styles/colors.ts";
import { censor } from "../../utils/censor.ts";
import {
  BIGGEST_WINS,
  DAY,
  HUGE_WINS,
  MONTH,
  MULTIPLIERS,
  TDateFilter,
  TWinTypeFilter,
  YEAR,
} from "../../data/types/types.ts";
import { useAtom } from "../../data/store/lib/atoms.ts";
import { loadingTopWinsAtom, topWinsAtom } from "../../data/store/atoms.ts";
import { assignAvatar } from "../../utils/assignAvatar.ts";
import { generateTopWins } from "../../utils/generators.ts";
import { PillButton } from "../../components/buttons/PillButton.tsx";
import { Loader } from "../../components/loader/Loader.tsx";
import { getDayAgo, getMonthAgo, getYearAgo } from "../../utils/date.ts";

const containerStyles = css({
  display: "flex",
  flexDirection: "column",
  paddingBlock: 8,

  h1: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: 400,
  },
});

const cardStyles = css([
  rowStyles,
  {
    justifyContent: "space-around",
    fontSize: 12,
    backgroundColor: DARK_GRAY_COLOR,
    borderRadius: 4,
    padding: 8,
    "& .avatar": {
      width: 40,
      height: 40,
      borderRadius: "50%",
      backgroundColor: "white",
      img: {
        width: 40,
        height: 40,
        borderRadius: "50%",
        backgroundColor: "white",
      },
    },
  },
]);
const cardFooterStyles = css([
  rowStyles,
  {
    justifyContent: "space-between",
    gap: 4,
    background: "black",
    paddingInline: 8,
    paddingBlock: 4,
    fontSize: 12,
    p: {
      opacity: 0.7,
      "&.multiplier": {
        opacity: 1,
        fontWeight: 600,
      },
    },
    "& .pill": {
      paddingInline: 16,
      borderRadius: 8,
      background: DARK_GRAY_COLOR,
      border: `1px solid ${LIGHT_GRAY_COLOR}`,
      height: "100%",
      color: DARK_GRAY_COLOR,
    },
  },
]);

const betDetails = css({
  textAlign: "center",
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  justifyContent: "space-around",
  fontSize: 12,
  fontWeight: 400,
  gap: 4,
  "& .title": {
    textAlign: "right",
    opacity: 0.5,
  },
  "& .value": {
    textAlign: "left",
    fontWeight: 600,
  },
  "& .multiplier": {
    paddingInline: 8,
    background: "black",
    color: "purple",
    fontSize: 12,
    textAlign: "center",
    borderRadius: 8,
    fontWeight: 900,
  },
});
const typeContainer = css({
  display: "flex",
  justifyContent: "center",
  gap: 4,
  marginBottom: 8,
});

type TSlipProps = {
  duration: TDateFilter;
  type: TWinTypeFilter;
};

const TopBetSlips: FC<TSlipProps> = ({ duration, type }) => {
  const topBets = useAtom(topWinsAtom);
  const loading = useAtom(loadingTopWinsAtom);

  useEffect(() => {
    const toDate = new Date();
    let fromDate = getDayAgo();
    switch (duration) {
      case DAY:
        fromDate = getDayAgo();
        break;
      case MONTH:
        fromDate = getMonthAgo();
        break;
      case YEAR:
        fromDate = getYearAgo();
        break;
      default:
        fromDate = getDayAgo();
        break;
    }
    generateTopWins(40, { from: fromDate, to: toDate });
  }, [duration, type]);

  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <>
          {topBets.map((item) => (
            <div key={item.user_id} css={containerStyles}>
              <div css={cardStyles}>
                <div style={{ display: "grid", placeContent: "center" }}>
                  <div className="avatar">
                    <img src={assignAvatar(item.username)} alt="bet" />
                  </div>
                  <p style={{ opacity: 0.7, textAlign: "center" }}>
                    {censor("daniel")}
                  </p>
                </div>
                <div css={betDetails}>
                  <p className="title">Bet {item.currency}: </p>
                  <p className="value">{item.bet.toFixed(2)}</p>
                  <p className="title">Cashed out: </p>
                  <p className="value multiplier">{item.crash.toFixed(2)}x</p>
                  <p className="title">Win {DEFAULT_CURRENCY}: </p>
                  <p className="value">{(item.bet * item.crash).toFixed(2)}</p>
                </div>
                <div></div>
              </div>
              <div css={cardFooterStyles}>
                <div css={rowStyles}>
                  <p>11 Apr</p>
                  <div
                    style={{ justifyContent: "left", gap: 4 }}
                    css={rowStyles}
                  >
                    <p>Round: </p>
                    <p className="multiplier">2098989.5x</p>
                  </div>
                </div>
                <div className="pill">test</div>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
};

export const TopBetsView: FC = () => {
  const [winType, setWinType] = useState<TWinTypeFilter>(HUGE_WINS);

  const tabs: Tab[] = [
    {
      label: "Day",
      component: <TopBetSlips type={winType} duration={DAY} />,
    },
    {
      label: "Month",
      component: <TopBetSlips type={winType} duration={MONTH} />,
    },
    {
      label: "Year",
      component: <TopBetSlips type={winType} duration={YEAR} />,
    },
  ];

  return (
    <div css={containerStyles}>
      <div css={typeContainer}>
        <PillButton
          onClick={() => setWinType(HUGE_WINS)}
          active={winType === HUGE_WINS}
          size="sm"
          variant="transparent"
        >
          HUGE WINS
        </PillButton>
        <PillButton
          onClick={() => setWinType(BIGGEST_WINS)}
          active={winType === BIGGEST_WINS}
          size="sm"
          variant="transparent"
        >
          BIGGEST WIN
        </PillButton>
        <PillButton
          onClick={() => setWinType(MULTIPLIERS)}
          active={winType === MULTIPLIERS}
          size="sm"
          variant="transparent"
        >
          MULTIPLIERS
        </PillButton>
      </div>
      <Tabs tabs={tabs} />
    </div>
  );
};
