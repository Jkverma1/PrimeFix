// hooks/useBootstrap.ts

import { useEffect } from "react";
import { useAuthStore } from "../store/AuthStore";
import { useBookingStore } from "../store/BookingStore";
import { useNotificationStore } from "../store/NotificationStore";
import { useReferralStore } from "../store/ReferralStore";
import { useUserStore } from "../store/UserStore";

export function useBootstrap() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const fetchProfile = useUserStore((s) => s.fetchProfile);
  const fetchAddresses = useUserStore((s) => s.fetchAddresses);
  const fetchBookings = useBookingStore((s) => s.fetchBookings);
  const fetchNotifications = useNotificationStore((s) => s.fetchNotifications);
  const fetchReferrals = useReferralStore((s) => s.fetchReferrals);

  useEffect(() => {
    if (!isLoggedIn) return;

    Promise.all([
      fetchProfile(),
      fetchAddresses(),
      fetchBookings(),
      fetchNotifications(),
      fetchReferrals(),
    ]).catch(console.warn);
  }, [isLoggedIn]);
}
