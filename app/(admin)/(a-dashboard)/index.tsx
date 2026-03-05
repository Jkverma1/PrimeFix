// app/(admin)/(a-dashboard)/index.tsx

import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../../../lib/supabase";
import { logoutAllStores } from "../../../store";
import { Stats, RecentBooking } from "@/types/customer.type";
import { STATUS_COLOR, STATUS_BG } from "@/types/colors.type";

function toObj<T>(val: T | T[] | null): T | null {
  if (!val) return null;
  return Array.isArray(val) ? (val[0] ?? null) : val;
}

export default function AdminDashboard() {
  const router = useRouter();
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await supabase.auth.signOut();
          logoutAllStores();
          router.replace("/(auth)");
        },
      },
    ]);
  };
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<RecentBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      // All bookings for stats
      const { data: bookings } = await supabase
        .from("bookings")
        .select("status, final_price, quoted_price, created_at");

      if (bookings) {
        const today = new Date().toDateString();
        setStats({
          total: bookings.length,
          pending: bookings.filter((b) => b.status === "pending").length,
          confirmed: bookings.filter((b) => b.status === "confirmed").length,
          in_progress: bookings.filter((b) => b.status === "in_progress")
            .length,
          completed: bookings.filter((b) => b.status === "completed").length,
          cancelled: bookings.filter((b) => b.status === "cancelled").length,
          today: bookings.filter(
            (b) => new Date(b.created_at).toDateString() === today,
          ).length,
          revenue: bookings
            .filter((b) => b.status === "completed")
            .reduce(
              (sum, b) => sum + (b.final_price ?? b.quoted_price ?? 0),
              0,
            ),
        });
      }

      // Recent 5 bookings
      const { data: recentData } = await supabase
        .from("bookings")
        .select(
          "id, customer_name, customer_phone, status, created_at, services(label, icon)",
        )
        .order("created_at", { ascending: false })
        .limit(5);

      setRecent((recentData as unknown as RecentBooking[]) ?? []);
    } catch (e) {
      console.warn(e);
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

  if (isLoading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color="#1DB8A0" />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <LinearGradient colors={["#0B0F1A", "#1a2744"]} style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerLabel}>ADMIN PANEL</Text>
              <Text style={styles.headerTitle}>Dashboard</Text>
            </View>
            <View style={styles.headerActions}>
              <View style={styles.adminBadge}>
                <Text style={styles.adminBadgeText}>🔑 Admin</Text>
              </View>
              <TouchableOpacity
                style={styles.logoutBtn}
                onPress={handleLogout}
                activeOpacity={0.8}
              >
                <Text style={styles.logoutBtnText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

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
        {/* Today strip */}
        <LinearGradient
          colors={["#1DB8A0", "#1A6FD4"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.todayStrip}
        >
          <Text style={styles.todayLabel}>Today's Bookings</Text>
          <Text style={styles.todayCount}>{stats?.today ?? 0}</Text>
        </LinearGradient>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          {[
            {
              label: "Total",
              value: stats?.total,
              color: "#1A6FD4",
              bg: "#EFF6FF",
              emoji: "📦",
            },
            {
              label: "Pending",
              value: stats?.pending,
              color: "#F59E0B",
              bg: "#FFF7ED",
              emoji: "⏳",
            },
            {
              label: "Confirmed",
              value: stats?.confirmed,
              color: "#3B82F6",
              bg: "#EFF6FF",
              emoji: "✅",
            },
            {
              label: "In Progress",
              value: stats?.in_progress,
              color: "#8B5CF6",
              bg: "#F5F3FF",
              emoji: "🔧",
            },
            {
              label: "Completed",
              value: stats?.completed,
              color: "#10B981",
              bg: "#ECFDF5",
              emoji: "🎉",
            },
            {
              label: "Cancelled",
              value: stats?.cancelled,
              color: "#EF4444",
              bg: "#FEF2F2",
              emoji: "❌",
            },
          ].map((s) => (
            <View
              key={s.label}
              style={[styles.statCard, { backgroundColor: s.bg }]}
            >
              <Text style={styles.statEmoji}>{s.emoji}</Text>
              <Text style={[styles.statValue, { color: s.color }]}>
                {s.value ?? 0}
              </Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Revenue */}
        <View style={styles.revenueCard}>
          <View>
            <Text style={styles.revenueLabel}>Total Revenue</Text>
            <Text style={styles.revenueValue}>
              ₹{(stats?.revenue ?? 0).toLocaleString("en-IN")}
            </Text>
            <Text style={styles.revenueSub}>
              From {stats?.completed ?? 0} completed bookings
            </Text>
          </View>
          <Text style={styles.revenueEmoji}>💰</Text>
        </View>

        {/* Recent bookings */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Bookings</Text>
          <TouchableOpacity
            onPress={() => router.push("/(admin)/(b-bookings)")}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionLink}>View all →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.recentList}>
          {recent.map((b, i) => (
            <TouchableOpacity
              key={b.id}
              style={[
                styles.recentCard,
                i === recent.length - 1 && styles.recentCardLast,
              ]}
              onPress={() =>
                router.push({
                  pathname: "/(admin)/(b-bookings)/[id]",
                  params: { id: b.id },
                })
              }
              activeOpacity={0.75}
            >
              <View style={styles.recentIconWrap}>
                <Text style={{ fontSize: 20 }}>
                  {toObj(b.services)?.icon ?? "🔧"}
                </Text>
              </View>
              <View style={styles.recentInfo}>
                <Text style={styles.recentName}>{b.customer_name}</Text>
                <Text style={styles.recentService}>
                  {toObj(b.services)?.label ?? "Service"} · {b.customer_phone}
                </Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: STATUS_BG[b.status] },
                ]}
              >
                <Text
                  style={[styles.statusText, { color: STATUS_COLOR[b.status] }]}
                >
                  {b.status.replace("_", " ")}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F4F6FA" },
  loadingWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: { paddingHorizontal: 24, paddingBottom: 24, paddingTop: 8 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  headerLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "rgba(255,255,255,0.4)",
    letterSpacing: 2,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -0.5,
  },
  headerActions: { alignItems: "flex-end", gap: 8 },
  adminBadge: {
    backgroundColor: "rgba(29,184,160,0.2)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: "rgba(29,184,160,0.4)",
  },
  adminBadgeText: { color: "#1DB8A0", fontSize: 13, fontWeight: "700" },
  logoutBtn: {
    backgroundColor: "rgba(239,68,68,0.15)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.3)",
  },
  logoutBtnText: { color: "#EF4444", fontSize: 12, fontWeight: "700" },
  body: { flex: 1 },
  bodyContent: { padding: 20 },
  todayStrip: {
    borderRadius: 18,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  todayLabel: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 15,
    fontWeight: "700",
  },
  todayCount: { color: "#fff", fontSize: 36, fontWeight: "900" },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    width: "30.5%",
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    gap: 4,
  },
  statEmoji: { fontSize: 20 },
  statValue: { fontSize: 24, fontWeight: "900" },
  statLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#6B7280",
    textAlign: "center",
  },
  revenueCard: {
    backgroundColor: "#0B0F1A",
    borderRadius: 18,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  revenueLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(255,255,255,0.5)",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  revenueValue: {
    fontSize: 32,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  revenueSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.4)",
    fontWeight: "500",
  },
  revenueEmoji: { fontSize: 44 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: "#0B0F1A" },
  sectionLink: { fontSize: 13, fontWeight: "700", color: "#1A6FD4" },
  recentList: {
    backgroundColor: "#fff",
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  recentCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  recentCardLast: { borderBottomWidth: 0 },
  recentIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#F0FBF8",
    alignItems: "center",
    justifyContent: "center",
  },
  recentInfo: { flex: 1 },
  recentName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0B0F1A",
    marginBottom: 2,
  },
  recentService: { fontSize: 12, color: "#9CA3AF", fontWeight: "500" },
  statusBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 11, fontWeight: "700", textTransform: "capitalize" },
});
