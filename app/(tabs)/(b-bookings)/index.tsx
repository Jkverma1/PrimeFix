// app/(tabs)/(bookings)/index.tsx

import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Spacing } from "../../../constants/colors";
import { SERVICES } from "../../../constants/services";
import { useBookingStore } from "../../../store/BookingStore";

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  pending: { label: "Pending", color: "#F59E0B", bg: "#FFF7ED" },
  confirmed: { label: "Confirmed", color: "#1DB8A0", bg: "#F0FBF8" },
  in_progress: { label: "In Progress", color: "#8B5CF6", bg: "#F5F3FF" },
  completed: { label: "Completed", color: "#1A6FD4", bg: "#EEF4FF" },
  cancelled: { label: "Cancelled", color: "#EF4444", bg: "#FEF2F2" },
};

type FilterType = "all" | "pending" | "completed" | "cancelled";

export default function BookingsScreen() {
  const router = useRouter();
  const { bookings, isLoading, fetchBookings, cancelBooking } =
    useBookingStore();
  const [filter, setFilter] = useState<FilterType>("all");
  const [refreshing, setRefreshing] = useState(false);

  const filtered =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchBookings(true); // force refresh
    setRefreshing(false);
  }, []);

  const handleCancel = async (id: string) => {
    try {
      await cancelBooking(id);
    } catch {
      // error already in store
    }
  };

  return (
    <View style={styles.root}>
      {/* ── HEADER ── */}
      <LinearGradient
        colors={["#1DB8A0", "#1A6FD4"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <SafeAreaView>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerTitle}>My Bookings</Text>
              <Text style={styles.headerSub}>
                Track all your service requests
              </Text>
            </View>
            <View style={styles.countBadge}>
              <Text style={styles.countNum}>{bookings.length}</Text>
              <Text style={styles.countLabel}>Total</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* ── FILTER PILLS ── */}
      <View style={styles.filterWrap}>
        {(["all", "pending", "completed", "cancelled"] as FilterType[]).map(
          (f) => (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterPill,
                filter === f && styles.filterPillActive,
              ]}
              onPress={() => setFilter(f)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === f && styles.filterTextActive,
                ]}
              >
                {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ),
        )}
      </View>

      {isLoading && bookings.length === 0 ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#1DB8A0" />
          <Text style={styles.loadingText}>Loading bookings...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.bodyContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#1DB8A0"
            />
          }
        >
          {filtered.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyEmoji}>📋</Text>
              <Text style={styles.emptyTitle}>
                {filter === "all" ? "No bookings yet" : `No ${filter} bookings`}
              </Text>
              <Text style={styles.emptySub}>
                {filter === "all"
                  ? "Your service requests will appear here once you book."
                  : "Try a different filter to see other bookings."}
              </Text>
              {filter === "all" && (
                <TouchableOpacity
                  style={styles.emptyBtn}
                  onPress={() => router.push("../(a-home)")}
                  activeOpacity={0.8}
                >
                  <Text style={styles.emptyBtnText}>Book a Service</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            filtered.map((booking) => {
              const service = SERVICES.find(
                (s) => s.id === booking.services?.slug,
              );
              const status =
                STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.pending;
              const date = new Date(booking.created_at).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                },
              );

              return (
                <View key={booking.id} style={styles.card}>
                  <View style={styles.cardTop}>
                    <View style={styles.cardIconWrap}>
                      <Text style={styles.cardIcon}>
                        {booking.services?.icon ?? service?.icon ?? "🔧"}
                      </Text>
                    </View>
                    <View style={styles.cardInfo}>
                      <Text style={styles.cardService}>
                        {booking.services?.label ?? service?.label ?? "Service"}
                      </Text>
                      <Text style={styles.cardDate}>{date}</Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: status.bg },
                      ]}
                    >
                      <Text
                        style={[styles.statusText, { color: status.color }]}
                      >
                        {status.label}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.cardDivider} />

                  <View style={styles.cardBottom}>
                    <View style={styles.cardMeta}>
                      <Text style={styles.cardMetaIcon}>📍</Text>
                      <Text style={styles.cardMetaText} numberOfLines={1}>
                        {booking.address}
                      </Text>
                    </View>
                    {booking.final_price || booking.quoted_price ? (
                      <Text style={styles.cardPrice}>
                        ₹{booking.final_price ?? booking.quoted_price}
                      </Text>
                    ) : null}
                  </View>

                  <Text style={styles.cardId}>
                    Booking ID: #{booking.id.slice(0, 8).toUpperCase()}
                  </Text>

                  {/* Cancel button — only for pending bookings */}
                  {booking.status === "pending" && (
                    <TouchableOpacity
                      style={styles.cancelBtn}
                      onPress={() => handleCancel(booking.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.cancelBtnText}>Cancel Booking</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })
          )}

          {filtered.length > 0 && (
            <TouchableOpacity
              style={styles.newBookingBtn}
              onPress={() => router.push("../(a-home)")}
              activeOpacity={0.8}
            >
              <Text style={styles.newBookingText}>+ Book Another Service</Text>
            </TouchableOpacity>
          )}

          <View style={{ height: 20 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F4F6FA" },

  header: { paddingHorizontal: Spacing.xl, paddingBottom: 24, paddingTop: 8 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "500",
    marginTop: 2,
  },
  countBadge: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: "center",
  },
  countNum: { fontSize: 22, fontWeight: "900", color: "#fff" },
  countLabel: {
    fontSize: 9,
    fontWeight: "600",
    color: "rgba(255,255,255,0.65)",
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  filterWrap: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F2F8",
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#F4F6FA",
  },
  filterPillActive: { backgroundColor: "rgba(29,184,160,0.12)" },
  filterText: { fontSize: 12, fontWeight: "600", color: "#9CA3AF" },
  filterTextActive: { color: "#1DB8A0", fontWeight: "700" },

  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: { color: "#9CA3AF", fontSize: 14, fontWeight: "500" },

  body: { flex: 1 },
  bodyContent: { padding: Spacing.xl },

  emptyWrap: { alignItems: "center", paddingTop: 60, paddingBottom: 40 },
  emptyEmoji: { fontSize: 56, marginBottom: 20 },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0B0F1A",
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  emptySub: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 28,
    fontWeight: "500",
  },
  emptyBtn: {
    backgroundColor: "#1DB8A0",
    borderRadius: 14,
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  emptyBtnText: { color: "#fff", fontSize: 15, fontWeight: "800" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTop: { flexDirection: "row", alignItems: "center", gap: 12 },
  cardIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#F0FBF8",
    alignItems: "center",
    justifyContent: "center",
  },
  cardIcon: { fontSize: 24 },
  cardInfo: { flex: 1 },
  cardService: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0B0F1A",
    letterSpacing: -0.2,
  },
  cardDate: { fontSize: 12, color: "#9CA3AF", fontWeight: "500", marginTop: 2 },
  statusBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 11, fontWeight: "700" },
  cardDivider: { height: 1, backgroundColor: "#F3F4F6", marginVertical: 14 },
  cardBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardMeta: { flexDirection: "row", alignItems: "center", gap: 6, flex: 1 },
  cardMetaIcon: { fontSize: 12 },
  cardMetaText: { fontSize: 12, color: "#6B7280", fontWeight: "500", flex: 1 },
  cardPrice: { fontSize: 16, fontWeight: "900", color: "#1A6FD4" },
  cardId: {
    fontSize: 10,
    color: "#C0C8D8",
    fontWeight: "600",
    marginTop: 10,
    letterSpacing: 0.3,
  },
  cancelBtn: {
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#FCA5A5",
    alignItems: "center",
  },
  cancelBtnText: { color: "#EF4444", fontSize: 13, fontWeight: "700" },

  newBookingBtn: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#1DB8A0",
    marginTop: 4,
  },
  newBookingText: { color: "#1DB8A0", fontSize: 15, fontWeight: "800" },
});
