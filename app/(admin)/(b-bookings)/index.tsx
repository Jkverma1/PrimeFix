// app/(admin)/(b-bookings)/index.tsx

import { Booking } from "@/types/customer.type";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../../../lib/supabase";
import { STATUS_BG, STATUS_COLOR } from "../../../types/colors.type";

const STATUSES = [
  "all",
  "pending",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
] as const;

function toObj<T>(val: T | T[] | null): T | null {
  if (!val) return null;
  return Array.isArray(val) ? (val[0] ?? null) : val;
}

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function AdminBookings() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<(typeof STATUSES)[number]>("all");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const { data } = await supabase
        .from("bookings")
        .select("*, services(label, icon)")
        .order("created_at", { ascending: false });
      setBookings((data as unknown as Booking[]) ?? []);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, []);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load();
  }, []);

  const filtered = bookings.filter((b) => {
    const matchStatus = filter === "all" || b.status === filter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      b.customer_name.toLowerCase().includes(q) ||
      b.customer_phone.includes(q);
    return matchStatus && matchSearch;
  });

  return (
    <View style={styles.root}>
      <LinearGradient colors={["#0B0F1A", "#1a2744"]} style={styles.header}>
        <SafeAreaView>
          <Text style={styles.headerLabel}>ADMIN PANEL</Text>
          <Text style={styles.headerTitle}>All Bookings</Text>
          <View style={styles.searchRow}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name or phone..."
              placeholderTextColor="rgba(255,255,255,0.35)"
              value={search}
              onChangeText={setSearch}
            />
            {search ? (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>
                  ✕
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Filter tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {STATUSES.map((s) => {
          const count =
            s === "all"
              ? bookings.length
              : bookings.filter((b) => b.status === s).length;
          return (
            <TouchableOpacity
              key={s}
              style={[
                styles.filterPill,
                filter === s && styles.filterPillActive,
                filter === s &&
                  s !== "all" && { backgroundColor: STATUS_BG[s] },
              ]}
              onPress={() => setFilter(s)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === s && styles.filterTextActive,
                  filter === s && s !== "all" && { color: STATUS_COLOR[s] },
                ]}
              >
                {s === "all" ? "All" : s.replace("_", " ")}
              </Text>
              <View
                style={[
                  styles.filterBadge,
                  filter === s && { backgroundColor: "rgba(0,0,0,0.08)" },
                ]}
              >
                <Text
                  style={[
                    styles.filterBadgeText,
                    filter === s && s !== "all" && { color: STATUS_COLOR[s] },
                  ]}
                >
                  {count}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {isLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#1DB8A0" />
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
              <Text style={styles.emptyText}>No bookings found</Text>
            </View>
          ) : (
            filtered.map((b) => (
              <TouchableOpacity
                key={b.id}
                style={styles.card}
                onPress={() =>
                  router.push({
                    pathname: "/(admin)/(b-bookings)/[id]",
                    params: { id: b.id },
                  })
                }
                activeOpacity={0.8}
              >
                <View style={styles.cardTop}>
                  <View style={styles.cardIconWrap}>
                    <Text style={{ fontSize: 22 }}>
                      {toObj(b.services)?.icon ?? "🔧"}
                    </Text>
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardName}>{b.customer_name}</Text>
                    <Text style={styles.cardSub}>
                      {toObj(b.services)?.label} · {b.customer_phone}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: STATUS_BG[b.status] },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: STATUS_COLOR[b.status] },
                      ]}
                    >
                      {b.status.replace("_", " ")}
                    </Text>
                  </View>
                </View>
                <Text style={styles.cardAddress} numberOfLines={1}>
                  📍 {b.address}
                </Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.cardTime}>{timeAgo(b.created_at)}</Text>
                  {(b.quoted_price || b.final_price) && (
                    <Text style={styles.cardPrice}>
                      ₹{b.final_price ?? b.quoted_price}
                    </Text>
                  )}
                  <Text style={styles.cardArrow}>→</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
          <View style={{ height: 24 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F4F6FA" },
  loadingWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: { paddingHorizontal: 24, paddingBottom: 20, paddingTop: 8 },
  headerLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "rgba(255,255,255,0.4)",
    letterSpacing: 2,
    marginTop: 8,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -0.5,
    marginBottom: 14,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },
  searchIcon: { fontSize: 14 },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    padding: 0,
  },
  filterScroll: {
    maxHeight: 52,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  filterContent: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#F4F6FA",
  },
  filterPillActive: { backgroundColor: "#F0FBF8" },
  filterText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9CA3AF",
    textTransform: "capitalize",
  },
  filterTextActive: { color: "#1DB8A0" },
  filterBadge: {
    backgroundColor: "#EAECF0",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  filterBadgeText: { fontSize: 10, fontWeight: "700", color: "#6B7280" },
  body: { flex: 1 },
  bodyContent: { padding: 16 },
  emptyWrap: { alignItems: "center", paddingVertical: 60, gap: 12 },
  emptyEmoji: { fontSize: 48 },
  emptyText: { fontSize: 16, fontWeight: "700", color: "#9CA3AF" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  cardIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F0FBF8",
    alignItems: "center",
    justifyContent: "center",
  },
  cardInfo: { flex: 1 },
  cardName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0B0F1A",
    marginBottom: 2,
  },
  cardSub: { fontSize: 12, color: "#9CA3AF", fontWeight: "500" },
  statusBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 11, fontWeight: "700", textTransform: "capitalize" },
  cardAddress: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 10,
  },
  cardTime: { fontSize: 11, color: "#C0C8D8", fontWeight: "600", flex: 1 },
  cardPrice: { fontSize: 14, fontWeight: "800", color: "#10B981" },
  cardArrow: { fontSize: 14, color: "#C0C8D8", fontWeight: "700" },
});
