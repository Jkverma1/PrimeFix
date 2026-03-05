// app/(admin)/(c-customers)/[id].tsx

import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../../../lib/supabase";
import { STATUS_COLOR, STATUS_BG } from "../../../types/colors.type";

function toObj<T>(val: T | T[] | null): T | null {
  if (!val) return null;
  return Array.isArray(val) ? (val[0] ?? null) : val;
}

export default function CustomerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [{ data: p }, { data: b }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", id).single(),
        supabase
          .from("bookings")
          .select("*, services(label, icon)")
          .eq("user_id", id)
          .order("created_at", { ascending: false }),
      ]);
      setProfile(p);
      setBookings(b ?? []);
      setIsLoading(false);
    };
    load();
  }, [id]);

  if (isLoading || !profile) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color="#1DB8A0" />
      </View>
    );
  }

  const completed = bookings.filter((b) => b.status === "completed").length;
  const revenue = bookings
    .filter((b) => b.status === "completed")
    .reduce((sum, b) => sum + (b.final_price ?? b.quoted_price ?? 0), 0);

  return (
    <View style={styles.root}>
      <LinearGradient colors={["#0B0F1A", "#1a2744"]} style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(
                  profile.full_name?.[0] ??
                  profile.phone[profile.phone.length - 1]
                ).toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle}>
                {profile.full_name ?? "No name"}
              </Text>
              <Text style={styles.headerSub}>{profile.phone}</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { label: "Bookings", value: bookings.length, color: "#1A6FD4" },
            { label: "Completed", value: completed, color: "#10B981" },
            { label: "Revenue", value: `₹${revenue}`, color: "#F59E0B" },
          ].map((s) => (
            <View key={s.label} style={styles.statCard}>
              <Text style={[styles.statValue, { color: s.color }]}>
                {s.value}
              </Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Profile info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account Details</Text>
          {[
            ["Referral Code", profile.referral_code],
            [
              "Joined",
              new Date(profile.created_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }),
            ],
            ["Admin", profile.is_admin ? "Yes 🔑" : "No"],
          ].map(([label, value]) => (
            <View key={label} style={styles.infoRow}>
              <Text style={styles.infoLabel}>{label}</Text>
              <Text style={styles.infoValue}>{value}</Text>
            </View>
          ))}
        </View>

        {/* Booking history */}
        <Text style={styles.sectionTitle}>
          Booking History ({bookings.length})
        </Text>
        {bookings.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>No bookings yet</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {bookings.map((b, i) => (
              <TouchableOpacity
                key={b.id}
                style={[
                  styles.bookingRow,
                  i === bookings.length - 1 && { borderBottomWidth: 0 },
                ]}
                onPress={() =>
                  router.push({
                    pathname: "/(admin)/(b-bookings)/[id]",
                    params: { id: b.id },
                  })
                }
                activeOpacity={0.75}
              >
                <View style={styles.bookingIconWrap}>
                  <Text style={{ fontSize: 18 }}>
                    {toObj(b.services)?.icon ?? "🔧"}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.bookingService}>
                    {toObj(b.services)?.label ?? "Service"}
                  </Text>
                  <Text style={styles.bookingDate}>
                    {new Date(b.created_at).toLocaleDateString("en-IN")}
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
              </TouchableOpacity>
            ))}
          </View>
        )}
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F4F6FA" },
  loadingWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: { paddingHorizontal: 24, paddingBottom: 20, paddingTop: 8 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: { color: "#fff", fontSize: 18, fontWeight: "700" },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1DB8A0",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontSize: 20, fontWeight: "800" },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#fff" },
  headerSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    fontWeight: "500",
    marginTop: 2,
  },
  body: { flex: 1 },
  bodyContent: { padding: 16 },
  statsRow: { flexDirection: "row", gap: 10, marginBottom: 14 },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statValue: { fontSize: 22, fontWeight: "900", marginBottom: 2 },
  statLabel: { fontSize: 11, color: "#9CA3AF", fontWeight: "600" },
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
  cardTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0B0F1A",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  infoLabel: { width: 100, fontSize: 12, fontWeight: "700", color: "#9CA3AF" },
  infoValue: { flex: 1, fontSize: 13, fontWeight: "600", color: "#0B0F1A" },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0B0F1A",
    marginBottom: 10,
  },
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
  bookingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  bookingIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#F0FBF8",
    alignItems: "center",
    justifyContent: "center",
  },
  bookingService: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0B0F1A",
    marginBottom: 2,
  },
  bookingDate: { fontSize: 11, color: "#9CA3AF", fontWeight: "500" },
  statusBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 11, fontWeight: "700", textTransform: "capitalize" },
  emptyWrap: { alignItems: "center", paddingVertical: 30 },
  emptyText: { fontSize: 14, color: "#9CA3AF", fontWeight: "600" },
});
