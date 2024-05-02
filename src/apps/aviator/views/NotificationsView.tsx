import { FC, useEffect } from "react";
import { css, keyframes } from "@emotion/react";
import {
  ERROR_COLOR,
  SUCCESS_COLOR,
  SUCCESS_COLOR_DARK,
  TRANSPARENT_RED_COLOR,
  WHITE_COLOR,
} from "../styles/colors.ts";
import iconClose from "../assets/icons/close.svg";
import { removeNotification } from "../data/store/notifications.store.ts";
import { useAtom } from "../data/store/lib/atoms.ts";
import { notificationsAtom } from "../data/store/atoms.ts";
import { TNotification } from "../data/types/types.ts";
import { PillButton } from "../components/buttons/PillButton.tsx";
import { DEFAULT_CURRENCY, SUCCESS } from "../common/constants.ts";

const containerStyles = css({
  display: "flex",
  flexDirection: "column",
  position: "absolute",
  top: 8,
  left: 0,
  width: "100%",
  paddingInline: 32,
  justifyContent: "center",
  alignContent: "start",
  gap: 8,
  // opacity: 0.85,
});

const slideIn = keyframes({
  "0%": {
    opacity: 0,
    transform: "translateY(-100%)",
  },
  "100%": {
    opacity: 1,
    transform: "translateY(0)",
  },
});

const notificationsStyles = css({
  display: "flex",
  flexDirection: "row",
  width: "100%",
  maxWidth: 320,
  paddingBlock: 6,
  paddingInline: 8,
  fontSize: 14,
  color: WHITE_COLOR,
  justifyContent: "space-around",
  gap: 8,
  marginInline: "auto",
  borderRadius: 64,
  animation: `${slideIn} 0.3s ease-in-out`,
  h1: {
    fontSize: 20,
    opacity: 1,
  },
  span: {
    fontWeight: 600,
  },
  button: {
    color: WHITE_COLOR,
    background: "transparent",
    border: "none",
    cursor: "pointer",
    opacity: 0.7,
    img: {
      width: 20,
      height: 20,
    },
  },
  "&.error": {
    backgroundColor: TRANSPARENT_RED_COLOR,
    border: `1px solid ${ERROR_COLOR}`,
  },
  "&.success": {
    backgroundColor: SUCCESS_COLOR_DARK,
    border: `1px solid ${SUCCESS_COLOR}`,
  },
  "&.win-button": {
    display: "flex",
    flexDirection: "column",
  },
});

const win = css({
  flexDirection: "column",
  fontSize: 14,
  gap: 0,
  lineHeight: 0.5,
  fontWeight: 700,
});
const amountStyles = css({
  fontSize: 20,
  transform: "scale(1.05,1)",
});
const winMessage = css({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  textAlign: "center",
  p: {
    opacity: 0.7,
    fontSize: 12,
    lineHeight: 1,
  },
  h3: {
    fontSize: 20,
    lineHeight: 1.1,
    fontWeight: 400,
    transform: "scale(0.9,1)",
  },
});

type NotificationProps = {
  notification: TNotification;
  onClose: (notification: TNotification) => void;
};

const NotificationItem: FC<NotificationProps> = ({ notification, onClose }) => {
  const { type, message, multiplier, amount } = notification;

  useEffect(() => {
    // setTimeout(() => {
    //   onClose(notification);
    // }, NOTIFICATION_VISIBILITY);
  }, [notification, onClose]);

  return (
    <div className={type} css={notificationsStyles}>
      <div css={winMessage}>
        <p>{message}</p>
        {multiplier && <h3>{multiplier}x</h3>}
      </div>
      {type === SUCCESS && (
        <PillButton style={{ paddingInline: 4 }} variant={type} size="xl">
          <div css={win}>
            WIN {DEFAULT_CURRENCY}
            {amount && multiplier && (
              <div css={amountStyles}>{(amount * multiplier).toFixed(2)}</div>
            )}
          </div>
        </PillButton>
      )}
      <button type="button" onClick={() => onClose(notification)}>
        <img src={iconClose} alt="close" />
      </button>
    </div>
  );
};

export const NotificationsView: FC = () => {
  const myNotifications = useAtom(notificationsAtom);

  const handleCloseNotification = (notification: TNotification) => {
    removeNotification(notification);
  };

  return (
    <div
      style={{ display: myNotifications.length === 0 ? "none" : "flex" }}
      css={containerStyles}
    >
      {myNotifications.map((notification, index) => (
        <NotificationItem
          key={index}
          notification={notification}
          onClose={handleCloseNotification}
        />
      ))}
    </div>
  );
};
