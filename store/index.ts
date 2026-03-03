import { useAuthStore } from "./AuthStore";
import { useBookingStore } from "./BookingStore";
import { useNotificationStore } from "./NotificationStore";
import { useReferralStore } from "./ReferralStore";
import { useUserStore } from "./UserStore";

export const logoutAllStores = async () => {
  useAuthStore.getState().logout();
  useUserStore.getState().clear();
  useBookingStore.getState().clear();
  useNotificationStore.getState().clear();
  useReferralStore.getState().clear();
};
