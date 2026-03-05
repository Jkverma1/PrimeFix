// app/(admin)/(c-customers)/index.tsx

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
import { supabase } from "@/lib/supabase";
import { Customer } from "@/types/customer.type";

function timeAgo(d: string) {
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

export default function AdminCustomers() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      // Get all profiles
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, phone, full_name, referral_code, created_at")
        .order("created_at", { ascending: false });

      if (!profiles) return;

      // Get booking counts per user
      const { data: bookings } = await supabase
        .from("bookings")
        .select("user_id");

      const countMap: Record<string, number> = {};
      (bookings ?? []).forEach((b: any) => {
        countMap[b.user_id] = (countMap[b.user_id] ?? 0) + 1;
      });

      setCustomers(
        profiles.map((p: any) => ({
          ...p,
          booking_count: countMap[p.id] ?? 0,
        })),
      );
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

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    return (
      !q || (c.full_name ?? "").toLowerCase().includes(q) || c.phone.includes(q)
    );
  });

  return (
    <View style={styles.root}>
      <LinearGradient colors={["#0B0F1A", "#1a2744"]} style={styles.header}>
        <SafeAreaView>
          <Text style={styles.headerLabel}>ADMIN PANEL</Text>
          <Text style={styles.headerTitle}>Customers</Text>
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

      {/* Summary strip */}
      <View style={styles.summaryStrip}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{customers.length}</Text>
          <Text style={styles.summaryLabel}>Total Users</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>
            {customers.filter((c) => c.booking_count! > 0).length}
          </Text>
          <Text style={styles.summaryLabel}>With Bookings</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>
            {
              customers.filter((c) => {
                const days =
                  (Date.now() - new Date(c.created_at).getTime()) / 86400000;
                return days <= 7;
              }).length
            }
          </Text>
          <Text style={styles.summaryLabel}>New This Week</Text>
        </View>
      </View>

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
              <Text style={styles.emptyEmoji}>👥</Text>
              <Text style={styles.emptyText}>No customers found</Text>
            </View>
          ) : (
            <View style={styles.list}>
              {filtered.map((c, i) => (
                <TouchableOpacity
                  key={c.id}
                  style={[
                    styles.customerRow,
                    i === filtered.length - 1 && { borderBottomWidth: 0 },
                  ]}
                  onPress={() =>
                    router.push({
                      pathname: "/(admin)/(c-customers)/[id]",
                      params: { id: c.id },
                    })
                  }
                  activeOpacity={0.75}
                >
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {(
                        c.full_name?.[0] ?? c.phone[c.phone.length - 1]
                      ).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.customerInfo}>
                    <Text style={styles.customerName}>
                      {c.full_name ?? "—"}
                    </Text>
                    <Text style={styles.customerPhone}>{c.phone}</Text>
                  </View>
                  <View style={styles.customerMeta}>
                    <View style={styles.bookingCountBadge}>
                      <Text style={styles.bookingCountText}>
                        {c.booking_count} bookings
                      </Text>
                    </View>
                    <Text style={styles.joinedText}>
                      {timeAgo(c.created_at)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
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
  summaryStrip: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  summaryItem: { flex: 1, alignItems: "center" },
  summaryValue: { fontSize: 22, fontWeight: "900", color: "#0B0F1A" },
  summaryLabel: {
    fontSize: 11,
    color: "#9CA3AF",
    fontWeight: "600",
    marginTop: 2,
  },
  summaryDivider: { width: 1, backgroundColor: "#F3F4F6" },
  body: { flex: 1 },
  bodyContent: { padding: 16 },
  emptyWrap: { alignItems: "center", paddingVertical: 60, gap: 12 },
  emptyEmoji: { fontSize: 48 },
  emptyText: { fontSize: 16, fontWeight: "700", color: "#9CA3AF" },
  list: {
    backgroundColor: "#fff",
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  customerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1DB8A0",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontSize: 18, fontWeight: "800" },
  customerInfo: { flex: 1 },
  customerName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0B0F1A",
    marginBottom: 2,
  },
  customerPhone: { fontSize: 12, color: "#9CA3AF", fontWeight: "500" },
  customerMeta: { alignItems: "flex-end", gap: 4 },
  bookingCountBadge: {
    backgroundColor: "#F0FBF8",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  bookingCountText: { fontSize: 11, color: "#1DB8A0", fontWeight: "700" },
  joinedText: { fontSize: 10, color: "#C0C8D8", fontWeight: "600" },
});
