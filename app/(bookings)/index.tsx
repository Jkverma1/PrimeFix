// app/(tabs)/bookings.tsx
// My Bookings — shows booking history, empty state for new users

import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Spacing } from "../../constants/colors";
import { SERVICES } from "../../constants/services";

// ── Mock booking data — replace with real API later ──────────
const MOCK_BOOKINGS = [
  {
    id: "PF-2024-001",
    serviceId: "plumber",
    status: "completed",
    date: "Feb 24, 2025",
    price: 349,
    address: "Block 4, Sector 12, Delhi",
  },
  {
    id: "PF-2024-002",
    serviceId: "electrician",
    status: "pending",
    date: "Mar 2, 2025",
    price: 249,
    address: "123 MG Road, Bangalore",
  },
];

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  pending: { label: "Pending", color: "#F59E0B", bg: "#FFF7ED" },
  confirmed: { label: "Confirmed", color: "#1DB8A0", bg: "#F0FBF8" },
  completed: { label: "Completed", color: "#1A6FD4", bg: "#EEF4FF" },
  cancelled: { label: "Cancelled", color: "#EF4444", bg: "#FEF2F2" },
};

type FilterType = "all" | "pending" | "completed";

export default function BookingsScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>("all");

  const filtered =
    filter === "all"
      ? MOCK_BOOKINGS
      : MOCK_BOOKINGS.filter((b) => b.status === filter);

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
              <Text style={styles.countNum}>{MOCK_BOOKINGS.length}</Text>
              <Text style={styles.countLabel}>Total</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* ── FILTER PILLS ── */}
      <View style={styles.filterWrap}>
        {(["all", "pending", "completed"] as FilterType[]).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterPill, filter === f && styles.filterPillActive]}
            onPress={() => setFilter(f)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterText,
                filter === f && styles.filterTextActive,
              ]}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          /* ── EMPTY STATE ── */
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyEmoji}>📋</Text>
            <Text style={styles.emptyTitle}>No bookings yet</Text>
            <Text style={styles.emptySub}>
              Your service requests will appear here once you book.
            </Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => router.push("/")}
              activeOpacity={0.8}
            >
              <Text style={styles.emptyBtnText}>Book a Service</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filtered.map((booking) => {
            const service = SERVICES.find((s) => s.id === booking.serviceId);
            const status =
              STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.pending;

            return (
              <View key={booking.id} style={styles.card}>
                {/* Top row */}
                <View style={styles.cardTop}>
                  <View style={styles.cardIconWrap}>
                    <Text style={styles.cardIcon}>{service?.icon ?? "🔧"}</Text>
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardService}>
                      {service?.label ?? booking.serviceId}
                    </Text>
                    <Text style={styles.cardDate}>{booking.date}</Text>
                  </View>
                  <View
                    style={[styles.statusBadge, { backgroundColor: status.bg }]}
                  >
                    <Text style={[styles.statusText, { color: status.color }]}>
                      {status.label}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardDivider} />

                {/* Bottom row */}
                <View style={styles.cardBottom}>
                  <View style={styles.cardMeta}>
                    <Text style={styles.cardMetaIcon}>📍</Text>
                    <Text style={styles.cardMetaText} numberOfLines={1}>
                      {booking.address}
                    </Text>
                  </View>
                  <View style={styles.cardPriceWrap}>
                    <Text style={styles.cardPrice}>₹{booking.price}</Text>
                  </View>
                </View>

                <Text style={styles.cardId}>Booking ID: #{booking.id}</Text>
              </View>
            );
          })
        )}

        {/* New booking CTA */}
        {filtered.length > 0 && (
          <TouchableOpacity
            style={styles.newBookingBtn}
            onPress={() => router.push("/")}
            activeOpacity={0.8}
          >
            <Text style={styles.newBookingText}>+ Book Another Service</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F4F6FA" },

  /* Header */
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

  /* Filter */
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
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#F4F6FA",
  },
  filterPillActive: { backgroundColor: "rgba(29,184,160,0.12)" },
  filterText: { fontSize: 13, fontWeight: "600", color: "#9CA3AF" },
  filterTextActive: { color: "#1DB8A0", fontWeight: "700" },

  /* Body */
  body: { flex: 1 },
  bodyContent: { padding: Spacing.xl },

  /* Empty state */
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

  /* Booking card */
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
  cardPriceWrap: {},
  cardPrice: { fontSize: 16, fontWeight: "900", color: "#1A6FD4" },
  cardId: {
    fontSize: 10,
    color: "#C0C8D8",
    fontWeight: "600",
    marginTop: 10,
    letterSpacing: 0.3,
  },

  /* New booking btn */
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
