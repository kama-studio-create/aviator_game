import { FC } from "react";
import { Modal } from "../../Modal.tsx";
import { GAME_RULES } from "../../../../common/constants.ts";
import { css } from "@emotion/react";
import {
  ERROR_COLOR,
  LIGHT_GRAY_COLOR,
  WHITE_COLOR,
} from "../../../../styles/colors.ts";
import imageRule1 from "../../../../assets/rules/rules-step-1.png";
import imageRule2 from "../../../../assets/rules/rules-step-2.png";
import imageRule3 from "../../../../assets/rules/rules-step-3.png";
import iconBet from "../../../../assets/icons/bet.svg";
import iconProvablyFair from "../../../../assets/icons/icon-provabyfair.svg";
import { rowStyles } from "../../../../styles/common.ts";
import { ListItem } from "./ListItem.tsx";

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
    minHeight: 250,
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

  p: {
    color: WHITE_COLOR,
    opacity: 0.8,
    fontSize: 14,
  },
  "& .rules": {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    padding: 16,
    justifyContent: "center",
    maxWidth: "60vw",
    marginInline: "auto",
    "& .rule": {
      color: WHITE_COLOR,
      marginInline: "auto",
      img: {
        border: `1px solid ${LIGHT_GRAY_COLOR}`,
        borderRadius: 16,
      },
      h2: {
        fontSize: 24,
        fontWeight: 700,
        color: WHITE_COLOR,
      },
      "& .description": {
        display: "flex",
        gap: 8,
        marginBlock: 8,
        alignItems: "center",
        color: WHITE_COLOR,
        fontWeight: 700,
        fontSize: 14,
        span: {
          color: ERROR_COLOR,
          display: "inline",
        },
        img: {
          width: 36,
          height: 36,
          border: "none",
        },
      },
    },
  },
  "& .list": {
    h2: {
      fontSize: 14,
      color: WHITE_COLOR,
      opacity: 0.8,
      fontWeight: 600,
      marginBottom: 16,
    },
    div: {
      paddingInline: 16,
      marginTop: 8,
      "& .provably-icon": {
        marginRight: 8,
        img: {
          marginTop: 4,
          width: 16,
          height: 16,
        },
      },
      "& .error": {
        color: ERROR_COLOR,
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
              <img src={imageRule1} alt="" />
              <div className="description">
                <img src={iconBet} alt="" />
                <div>
                  <p>
                    <span>BET</span> before take-off
                  </p>
                </div>
              </div>
            </div>
            <div className="rule">
              <h2>02</h2>
              <img src={imageRule2} alt="" />
              <div className="description">
                <img src={iconBet} alt="" />
                <div css={rowStyles}>
                  <p>
                    <span>WATCH</span> as your Lucky Plane takes off and your
                    winnings increase.{" "}
                  </p>
                </div>
              </div>
            </div>
            <div className="rule">
              <h2>03</h2>
              <img src={imageRule3} alt="" />
              <div className="description">
                <img src={iconBet} alt="" />
                <div css={rowStyles}>
                  <p>
                    <span>CASH OUT </span> before the plane disappears and wins
                    X times more!
                  </p>
                </div>
              </div>
            </div>
          </div>
          <p>
            {" "}
            But remember, if you did not have time to Cash Out before the Lucky
            Plane flies away, your bet will be lost. Aviator is pure excitement!
            Risk and win. It’s all in your hands!{" "}
          </p>
        </div>
        <div css={descriptionContainer}>
          <div className="list">
            <h2>More details</h2>
            <div>
              <ListItem>
                The win multiplier starts at 1x and grows more and more as the
                Lucky Plane takes off.
              </ListItem>
              <ListItem>
                Your winnings are calculated at the multiplier at which you made
                a Cash Out, multiplied by your bet.
              </ListItem>
              <ListItem>
                Before the start of each round, our provably fair random number
                generator generates the multiplier at which the Lucky Plane will
                fly away. You can check the honesty of this generation by
                clicking on
                <span className="provably-icon">
                  <img src={iconProvablyFair} alt="provably" />
                </span>
                icon, opposite the result, in the History tab
              </ListItem>
            </div>
          </div>
        </div>
        <div css={descriptionContainer}>
          <h1>GAME FUNCTIONS</h1>
          <div className="list">
            <h2>Bet & Cashout</h2>
            <ListItem>
              Select an amount and press the “Bet” button to make a bet.
            </ListItem>
            <ListItem>
              You can cancel the bet by pressing the "Cancel" button if the
              round has not yet started.
            </ListItem>
            <ListItem>
              Adjust the bet size using the "+" and "-" buttons to change the
              bet amount. Alternatively, you can select the bet size using the
              preset values or enter a value manually.
            </ListItem>
            <ListItem>
              You can make two bets simultaneously, by adding a second bet
              panel. To add a second bet panel, press the plus icon, which is
              located on the top right corner of the first bet panel.
            </ListItem>
            <ListItem>
              Press the “Cash Out” button to cash out your winnings. Your win is
              your bet multiplied by the Cash Out multiplier.
            </ListItem>
            <ListItem>
              Your bet is lost, if you didn’t cash out before the plane flies
              away.
            </ListItem>
          </div>
          <div className="list">
            <h2>Autoplay & Auto Cash Out</h2>
            <ListItem>
              Before starting Auto Play, select the bet size you want to play
              with. How to do this is described in the Bet & cash out section.
            </ListItem>
            <ListItem>
              Auto Play is activated from the “Auto” tab on the Bet Panel, by
              pressing the “Auto Play” button.
            </ListItem>
            <ListItem>
              When configuring Auto Play, choose the number of rounds from the
              provided options, and one or more stop conditions such as "Stop if
              balance decreases by", "Stop if balance increases by", "Stop if
              single win exceeds".
            </ListItem>
            <ListItem>
              In the Auto Play Panel, the “Stop if cash decreases by” option
              stops Auto Play, if the balance is decreased by the selected
              amount.
            </ListItem>
            <ListItem>
              In the Auto Play Panel, the “Stop if cash increases by” option
              stops Auto Play, if the balance is increased by the selected
              amount.
            </ListItem>
            <ListItem>
              In the Auto Play Panel, the “Stop if single win exceeds” option
              stops Auto Play, if a single win exceeds the selected amount.
            </ListItem>
            <ListItem>
              Auto Cash Out is available from the “Auto” tab on the Bet panel.
              After activation, your bet will be automatically cashed out when
              it reaches the multiplier entered
            </ListItem>
            <ListItem>
              You can stop Auto Play by pressing the Stop button.
            </ListItem>
          </div>
          <div className="list">
            <h2> Live Bets & Statistics </h2>
            <ListItem>
              On the left side of the game interface (or under the Bet Panel on
              mobile), is located the Live Bets panel. Here you can see all bets
              that are being made in the current round.
            </ListItem>
            <ListItem>
              In the “My Bets” panel you can see all of your bets and Cash Out
              information.
            </ListItem>
            <ListItem>
              In the “Top” panel, game statistics are located. You can browse
              wins by amount, or Cash Out multiplier, and see the biggest round
              multipliers.
            </ListItem>
          </div>
          <div className="list">
            <h2> Rain Feature </h2>
            <ListItem>
              The Rain Feature drops an amount of Free Bets into the Chat. You
              can claim Free Bets by pressing the “Claim” button. Free Bets are
              awarded by the operator, or from other players. You can also drop
              an amount of Free Bets for other players from the “Rain” panel, by
              pressing the “Rain” Button on the bottom side of the Chat.
            </ListItem>
          </div>
          <div className="list">
            <h2> Randomisation </h2>
            <ListItem>
              The multiplier for each round is generated by a “Provably Fair”
              algorithm and is completely transparent, and 100% fair.
              <span className="error">
                {" "}
                Read more about provably fair system{" "}
              </span>
            </ListItem>
            <ListItem>
              You can check and modify the Provably Fair settings from the Game
              menu {">"} Provably Fair settings.
            </ListItem>
            <ListItem>
              You can check the fairness of each round by pressing
              <span className="provably-icon">
                <img src={iconProvablyFair} alt="provably" />
              </span>
              icon, opposite the results in the “My Bets” or inside “Top” tabs.
            </ListItem>
          </div>
          <div className="list">
            <h2> Return to Player </h2>
            <ListItem>
              The overall theoretical return to player is 97%. This means that
              on average, for every 100 rounds, every 3 rounds end with the
              Lucky Plane flying away at the very beginning of the round.
            </ListItem>
          </div>
          <div className="list">
            <h2> Game Menu </h2>
            <ListItem>
              Access the game menu by tapping the menu button in the top right
              corner of the screen.
            </ListItem>
            <ListItem>
              Toggle the "Sound" switch to turn the game sounds on or off.
            </ListItem>
            <ListItem>
              Toggle the "Music" switch to turn the background music on or off.
            </ListItem>
            <ListItem>
              Toggle the "Animation" switch to turn the airplane animation on or
              off.
            </ListItem>
            <ListItem>
              Press the "My Bets History" button to view the history of your
              bets
            </ListItem>
            <ListItem>
              Open "Game Rules" to read detailed rules of the game
            </ListItem>
          </div>
          <div className="list">
            <h2>Other</h2>
            <ListItem>
              If the internet connection is interrupted when the bet is active,
              the game will auto cash out with the current multiplier, and the
              winning amount will be added to your balance.
            </ListItem>
            <ListItem>
              In the event of a malfunction of the gaming hardware/software, all
              affected game bets and payouts are rendered void and all affected
              bets are refunded.
            </ListItem>
          </div>
        </div>
      </div>
    </Modal>
  );
};
