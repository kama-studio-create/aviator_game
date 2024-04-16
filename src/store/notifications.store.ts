import {create} from "zustand";
import {TNotificationState} from "../common/constants.ts";

type TNotification = {
  type: TNotificationState;
  message: string;
  header: string;
  gameId?: string;
}

type TNotificationStore = {
  notifications: TNotification[];
}

export const useNotificationStore = create<TNotificationStore>(() => ({
  notifications: [],
}));