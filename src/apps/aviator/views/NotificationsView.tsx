import { FC, useEffect } from "react";
import { css, keyframes } from "@emotion/react";
import { ERROR_COLOR, SUCCESS_COLOR, WHITE_COLOR } from "../styles/colors.ts";
import iconClose from "../assets/icons/close.svg";
import { removeNotification } from "../data/store/notifications.store.ts";
import { ERROR, NOTIFICATION_VISIBILITY } from "../common/constants.ts";
import { useAtom } from "../data/store/lib/atoms.ts";
import { notificationsAtom } from "../data/store/atoms.ts";
import { TNotification } from "../data/types/types.ts";

const containerStyles = css({
  display: "flex",
  flexDirection: "column",
  position: "absolute",
  top: 48,
  left: 0,
  width: "100%",
  padding: 16,
  justifyContent: "center",
  alignContent: "start",
  gap: 8,
  opacity: 0.85,
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
  padding: 12,
  fontSize: 14,
  color: WHITE_COLOR,
  justifyContent: "space-between",
  marginInline: "auto",
  borderRadius: 8,
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
    img: {
      width: 20,
      height: 20,
    },
  },
});

type NotificationProps = {
  notification: TNotification;
  onClose: (notification: TNotification) => void;
};

const NotificationItem: FC<NotificationProps> = ({ notification, onClose }) => {
  const { type, header, message } = notification;

  useEffect(() => {
    setTimeout(() => {
      onClose(notification);
    }, NOTIFICATION_VISIBILITY);
  }, [notification, onClose]);

  return (
    <div
      style={{ backgroundColor: type === ERROR ? ERROR_COLOR : SUCCESS_COLOR }}
      css={notificationsStyles}
    >
      <div>
        <h1>{header}</h1>
        <p>{message}</p>
      </div>
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
