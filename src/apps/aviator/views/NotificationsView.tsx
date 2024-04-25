import { FC, useCallback, useEffect } from "react";
import { css, keyframes } from "@emotion/react";
import { ERROR_COLOR, SUCCESS_COLOR, WHITE_COLOR } from "../styles/colors.ts";
import iconClose from "../assets/icons/close.svg";
import { useNotificationStore } from "../store/notifications.store.ts";
import {
  ERROR,
  NOTIFICATION_VISIBILITY,
  TNotificationState,
} from "../common/constants.ts";

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
  message: string;
  type: TNotificationState;
  onClose: () => void;
  header: string;
};

const NotificationItem: FC<NotificationProps> = ({
  header,
  message,
  type,
  onClose,
}) => {
  useEffect(() => {
    setTimeout(() => {
      onClose();
    }, NOTIFICATION_VISIBILITY);
  }, [onClose]);

  return (
    <div
      style={{ backgroundColor: type === ERROR ? ERROR_COLOR : SUCCESS_COLOR }}
      css={notificationsStyles}
    >
      <div>
        <h1>{header}</h1>
        <p>{message}</p>
      </div>
      <button type="button" onClick={onClose}>
        <img src={iconClose} alt="close" />
      </button>
    </div>
  );
};

export const NotificationsView: FC = () => {
  const myNotifications = useNotificationStore(
    (state) => state.notifications,
  ).filter((n) => !n.viewed);

  const handleCloseNotification = useCallback(
    (index: number) => {
      myNotifications[index].viewed = true;
      useNotificationStore.setState({
        notifications: myNotifications,
      });
    },
    [myNotifications],
  );
  return (
    <div
      style={{ display: myNotifications.length === 0 ? "none" : "flex" }}
      css={containerStyles}
    >
      {myNotifications.map((notification, index) => (
        <NotificationItem
          key={index}
          message={notification.message}
          type={notification.type}
          onClose={() => {
            handleCloseNotification(index);
          }}
          header={notification.header}
        />
      ))}
    </div>
  );
};
