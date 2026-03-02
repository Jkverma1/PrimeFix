// app/(account)/notifications.tsx

import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Spacing } from "../../constants/colors";

const NOTIFICATIONS = [
  {
    id: "1",
    emoji: "✅",
    title: "Booking Confirmed",
    desc: "Your Plumber booking has been confirmed.",
    time: "2 hours ago",
    read: false,
    type: "booking",
  },
  {
    id: "2",
    emoji: "👷",
    title: "Professional Assigned",
    desc: "Ramesh Kumar has been assigned to your request #PF-2024-001.",
    time: "1 hour ago",
    read: false,
    type: "booking",
  },
  {
    id: "3",
    emoji: "⭐",
    title: "Rate Your Experience",
    desc: "How was your Plumber service? Tap to leave a review.",
    time: "Yesterday",
    read: true,
    type: "review",
  },
  {
    id: "4",
    emoji: "🎁",
    title: "Referral Reward Earned",
    desc: "Rahul S. completed a booking using your code. ₹75 credit added!",
    time: "Feb 24",
    read: true,
    type: "refer",
  },
  {
    id: "5",
    emoji: "📢",
    title: "New Services Coming Soon",
    desc: "Carpenter and Painter services are launching next month!",
    time: "Feb 20",
    read: true,
    type: "promo",
  },
];

const PREFS = [
  {
    key: "booking",
    label: "Booking Updates",
    sub: "Confirmations, assignments & status",
  },
  {
    key: "refer",
    label: "Referral Rewards",
    sub: "When friends complete bookings",
  },
  {
    key: "review",
    label: "Review Reminders",
    sub: "Rate your service experience",
  },
  {
    key: "promo",
    label: "News & Announcements",
    sub: "New services and app updates",
  },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    booking: true,
    refer: true,
    review: true,
    promo: false,
  });
  const [tab, setTab] = useState<"all" | "settings">("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const markRead = (id: string) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );

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
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>Notifications</Text>
              {unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadBadgeText}>{unreadCount} new</Text>
                </View>
              )}
            </View>
            {unreadCount > 0 ? (
              <TouchableOpacity onPress={markAllRead} activeOpacity={0.7}>
                <Text style={styles.markAllText}>Mark all read</Text>
              </TouchableOpacity>
            ) : (
              <View style={{ width: 72 }} />
            )}
          </View>

          {/* Tab toggle */}
          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tabPill, tab === "all" && styles.tabPillActive]}
              onPress={() => setTab("all")}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabPillText,
                  tab === "all" && styles.tabPillTextActive,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabPill,
                tab === "settings" && styles.tabPillActive,
              ]}
              onPress={() => setTab("settings")}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabPillText,
                  tab === "settings" && styles.tabPillTextActive,
                ]}
              >
                Settings
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        {tab === "all" ? (
          <>
            {notifications.length === 0 ? (
              <View style={styles.emptyWrap}>
                <Text style={styles.emptyEmoji}>🔔</Text>
                <Text style={styles.emptyTitle}>No notifications yet</Text>
                <Text style={styles.emptySub}>
                  You'll see booking updates and alerts here.
                </Text>
              </View>
            ) : (
              <View style={styles.list}>
                {notifications.map((n, i) => (
                  <TouchableOpacity
                    key={n.id}
                    style={[
                      styles.notifCard,
                      !n.read && styles.notifCardUnread,
                      i === notifications.length - 1 && styles.notifCardLast,
                    ]}
                    onPress={() => markRead(n.id)}
                    activeOpacity={0.75}
                  >
                    <View style={styles.notifIconWrap}>
                      <Text style={styles.notifEmoji}>{n.emoji}</Text>
                    </View>
                    <View style={styles.notifContent}>
                      <View style={styles.notifTitleRow}>
                        <Text style={styles.notifTitle}>{n.title}</Text>
                        {!n.read && <View style={styles.dotUnread} />}
                      </View>
                      <Text style={styles.notifDesc}>{n.desc}</Text>
                      <Text style={styles.notifTime}>{n.time}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        ) : (
          <>
            <Text style={styles.settingsLabel}>Notification Preferences</Text>
            <View style={styles.prefCard}>
              {PREFS.map((p, i) => (
                <View
                  key={p.key}
                  style={[
                    styles.prefRow,
                    i === PREFS.length - 1 && styles.prefRowLast,
                  ]}
                >
                  <View style={styles.prefText}>
                    <Text style={styles.prefLabel}>{p.label}</Text>
                    <Text style={styles.prefSub}>{p.sub}</Text>
                  </View>
                  <Switch
                    value={prefs[p.key]}
                    onValueChange={(v) =>
                      setPrefs((prev) => ({ ...prev, [p.key]: v }))
                    }
                    trackColor={{ false: "#E5E7EB", true: "#1DB8A0" }}
                    thumbColor="#ffffff"
                  />
                </View>
              ))}
            </View>
          </>
        )}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F4F6FA" },

  header: { paddingHorizontal: Spacing.xl, paddingBottom: 16, paddingTop: 8 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 16,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: { color: "#fff", fontSize: 18, fontWeight: "700" },
  headerCenter: { flexDirection: "row", alignItems: "center", gap: 8 },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.3,
  },
  unreadBadge: {
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  unreadBadgeText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  markAllText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    fontWeight: "600",
  },

  tabRow: { flexDirection: "row", gap: 8 },
  tabPill: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  tabPillActive: { backgroundColor: "rgba(255,255,255,0.95)" },
  tabPillText: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255,255,255,0.7)",
  },
  tabPillTextActive: { color: "#1DB8A0", fontWeight: "700" },

  body: { flex: 1 },
  bodyContent: { padding: Spacing.xl },

  list: {
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  notifCard: {
    flexDirection: "row",
    gap: 14,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  notifCardUnread: { backgroundColor: "#F8FFFE" },
  notifCardLast: { borderBottomWidth: 0 },
  notifIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F0FBF8",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  notifEmoji: { fontSize: 22 },
  notifContent: { flex: 1 },
  notifTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 3,
  },
  notifTitle: { fontSize: 14, fontWeight: "700", color: "#0B0F1A", flex: 1 },
  dotUnread: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#1DB8A0",
  },
  notifDesc: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
    lineHeight: 18,
    marginBottom: 4,
  },
  notifTime: { fontSize: 11, color: "#C0C8D8", fontWeight: "600" },

  emptyWrap: { alignItems: "center", paddingVertical: 60 },
  emptyEmoji: { fontSize: 52, marginBottom: 16 },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0B0F1A",
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: "500",
    textAlign: "center",
  },

  settingsLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#9CA3AF",
    marginBottom: 8,
    marginLeft: 4,
  },
  prefCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  prefRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  prefRowLast: { borderBottomWidth: 0 },
  prefText: { flex: 1, marginRight: 12 },
  prefLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0B0F1A",
    marginBottom: 2,
  },
  prefSub: { fontSize: 12, color: "#9CA3AF", fontWeight: "500" },
});
