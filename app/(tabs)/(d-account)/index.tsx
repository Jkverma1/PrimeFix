// app/(tabs)/(d-account)/index.tsx

import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Spacing } from "../../../constants/colors";
import { CONTACT } from "../../../constants/services";
import { useAuthStore } from "../../../store/AuthStore";
import { useBookingStore } from "../../../store/BookingStore";
import { useReferralStore } from "../../../store/ReferralStore";
import { useUserStore } from "../../../store/UserStore";

function MenuItem({
  emoji,
  label,
  sub,
  onPress,
  danger,
  isLast,
}: {
  emoji: string;
  label: string;
  sub?: string;
  onPress: () => void;
  danger?: boolean;
  isLast?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.menuItem, isLast && styles.menuItemLast]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.menuIcon, danger && styles.menuIconDanger]}>
        <Text style={styles.menuEmoji}>{emoji}</Text>
      </View>
      <View style={styles.menuText}>
        <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>
          {label}
        </Text>
        {sub ? <Text style={styles.menuSub}>{sub}</Text> : null}
      </View>
      <Text style={[styles.menuArrow, danger && { color: "#FCA5A5" }]}>›</Text>
    </TouchableOpacity>
  );
}

function MenuSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

export default function AccountScreen() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const { profile } = useUserStore();
  const { bookings } = useBookingStore();
  const { summary } = useReferralStore();

  const completedCount = bookings.filter(
    (b) => b.status === "completed",
  ).length;
  const totalEarned = summary?.total_earned ?? 0;

  const handleCall = () =>
    Linking.openURL(`tel:${CONTACT.phone}`).catch(() =>
      Alert.alert("Error", "Could not open dialer."),
    );

  const handleWhatsApp = () => {
    const msg = encodeURIComponent("Hi! I need help with PrimeFix.");
    Linking.openURL(`https://wa.me/${CONTACT.whatsapp}?text=${msg}`).catch(() =>
      Alert.alert("Error", "WhatsApp not installed."),
    );
  };

  const handleEmail = () =>
    Linking.openURL(`mailto:${CONTACT.email}`).catch(() =>
      Alert.alert("Error", "Could not open mail app."),
    );

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log Out", style: "destructive", onPress: () => logout() },
    ]);
  };

  const displayName = profile?.full_name ?? "Welcome!";
  const displayPhone = profile?.phone
    ? `+91 ${profile.phone.replace("+91", "").slice(-10)}`
    : "Manage your account & bookings";

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#1DB8A0", "#1A6FD4"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <SafeAreaView>
          {/* Profile row — tappable to edit profile */}
          <TouchableOpacity
            style={styles.profileRow}
            onPress={() => router.push("./profile")}
            activeOpacity={0.8}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {profile?.full_name
                  ? profile.full_name.charAt(0).toUpperCase()
                  : "👤"}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{displayName}</Text>
              <Text style={styles.profileSub}>{displayPhone}</Text>
            </View>
            <View style={styles.editBadge}>
              <Text style={styles.editBadgeText}>Edit ›</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{bookings.length}</Text>
              <Text style={styles.statLabel}>Bookings</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{completedCount}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>
                ₹{totalEarned > 0 ? totalEarned : 75}
              </Text>
              <Text style={styles.statLabel}>Refer Reward</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        <MenuSection title="My Activity">
          <MenuItem
            emoji="📋"
            label="My Bookings"
            sub="View all your service requests"
            onPress={() => router.push("../(b-bookings)")}
          />
          <MenuItem
            emoji="🗺️"
            label="Saved Addresses"
            sub="Manage your saved locations"
            onPress={() => router.push("./addresses")}
          />
          <MenuItem
            emoji="🎁"
            label="Refer & Earn"
            sub="Invite friends, earn ₹75 per referral"
            onPress={() => router.push("../(c-refer)")}
            isLast
          />
        </MenuSection>

        <MenuSection title="Account">
          <MenuItem
            emoji="👤"
            label="Edit Profile"
            sub="Update your name and details"
            onPress={() => router.push("./profile")}
            isLast
          />
        </MenuSection>

        <MenuSection title="Support">
          <MenuItem
            emoji="💬"
            label="WhatsApp Support"
            sub="Chat with us — fastest response"
            onPress={handleWhatsApp}
          />
          <MenuItem
            emoji="📞"
            label="Call Us"
            sub={CONTACT.phone}
            onPress={handleCall}
          />
          <MenuItem
            emoji="✉️"
            label="Email Support"
            sub={CONTACT.email}
            onPress={handleEmail}
            isLast
          />
        </MenuSection>

        <MenuSection title="Legal">
          <MenuItem
            emoji="🔔"
            label="Notifications"
            sub="View your alerts & updates"
            onPress={() => router.push("/(shared)/notifications")}
          />
          <MenuItem
            emoji="🔒"
            label="Privacy Policy"
            sub="How we handle your data"
            onPress={() => router.push("./privacy")}
          />
          <MenuItem
            emoji="🙋"
            label="Help & Support"
            sub="FAQs and contact options"
            onPress={() => router.push("./support")}
            isLast
          />
        </MenuSection>

        <MenuSection title="Session">
          <MenuItem
            emoji="🚪"
            label="Log Out"
            sub="You'll need to verify your number again"
            onPress={handleLogout}
            danger
            isLast
          />
        </MenuSection>

        <View style={styles.appInfo}>
          <LinearGradient
            colors={["#1DB8A0", "#1A6FD4"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.appInfoIcon}
          >
            <Text style={styles.appInfoP}>P</Text>
          </LinearGradient>
          <View>
            <Text style={styles.appInfoName}>
              <Text style={{ color: "#0B0F1A" }}>Prime</Text>
              <Text style={{ color: "#1DB8A0" }}>Fix</Text>
            </Text>
            <Text style={styles.appInfoVersion}>Version 1.0.0</Text>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F4F6FA" },
  header: { paddingHorizontal: Spacing.xl, paddingBottom: 24, paddingTop: 8 },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 8,
    marginBottom: 20,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
  },
  avatarText: { fontSize: 24, fontWeight: "800", color: "#fff" },
  profileInfo: { flex: 1 },
  profileName: {
    fontSize: 22,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -0.5,
  },
  profileSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "500",
    marginTop: 2,
  },
  editBadge: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  editBadgeText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  statsRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 16,
    padding: 16,
  },
  statItem: { flex: 1, alignItems: "center" },
  statNum: { fontSize: 20, fontWeight: "900", color: "#fff" },
  statLabel: {
    fontSize: 10,
    color: "rgba(255,255,255,0.65)",
    fontWeight: "600",
    marginTop: 2,
    textAlign: "center",
  },
  statDivider: { width: 1, backgroundColor: "rgba(255,255,255,0.2)" },
  body: { flex: 1 },
  bodyContent: { padding: Spacing.xl },
  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#9CA3AF",
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  menuItemLast: { borderBottomWidth: 0 },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F4F6FA",
    alignItems: "center",
    justifyContent: "center",
  },
  menuIconDanger: { backgroundColor: "#FEF2F2" },
  menuEmoji: { fontSize: 20 },
  menuText: { flex: 1 },
  menuLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0B0F1A",
    letterSpacing: -0.2,
  },
  menuLabelDanger: { color: "#EF4444" },
  menuSub: { fontSize: 12, color: "#9CA3AF", fontWeight: "500", marginTop: 2 },
  menuArrow: { fontSize: 20, color: "#D1D5DB" },
  appInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 24,
  },
  appInfoIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  appInfoP: { fontSize: 20, fontWeight: "900", color: "#fff" },
  appInfoName: { fontSize: 20, fontWeight: "800", letterSpacing: -0.5 },
  appInfoVersion: { fontSize: 11, color: "#9CA3AF", fontWeight: "500" },
});
