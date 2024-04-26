import
import { TNotification } from "../types/types.ts";
import {notificationsAtom} from "./atoms.ts";
import {setAtom} from "./lib/atoms.ts";


// export const useNotificationStore = create<TNotificationStore>(() => ({
//   notifications: [],
// }));

export const addNotification = (notification: TNotification) => {
  const notifications = notificationsAtom.initial;
  notifications.push(notification);
  setAtom(notificationsAtom, notifications);
  return true;
}

export const removeNotification = (notification: TNotification) => {
  const notifications = notificationsAtom.initial;
  notifications[notifications.indexOf(notification)] = notifications[notifications.length - 1];;
  setAtom(notificationsAtom, notifications);
  return true;
}