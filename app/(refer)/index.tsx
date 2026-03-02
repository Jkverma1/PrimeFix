// app/(tabs)/refer.tsx
// Refer & Earn screen

import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Alert,
  Clipboard,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Spacing } from "../../constants/colors";

const REFERRAL_CODE = "PRIMEFIX-JT27";

const HOW_IT_WORKS = [
  {
    emoji: "📤",
    title: "Share your code",
    desc: "Send your unique referral code to friends & family.",
  },
  {
    emoji: "📲",
    title: "Friend books a service",
    desc: "They use your code when booking their first service.",
  },
  {
    emoji: "💰",
    title: "Both of you earn",
    desc: "You get ₹75 credit, they get ₹50 off their first booking.",
  },
];

const REFERRALS = [
  { name: "Rahul S.", status: "completed", earned: 75, date: "Feb 20, 2025" },
  { name: "Priya M.", status: "pending", earned: 0, date: "Mar 1, 2025" },
];

export default function ReferScreen() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    Clipboard.setString(REFERRAL_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Hey! Book home services with PrimeFix and get ₹50 off your first booking. Use my code: ${REFERRAL_CODE}\n\nDownload: https://primefix.netlify.app`,
        title: "PrimeFix — Home Services",
      });
    } catch (e) {
      Alert.alert("Error", "Could not open share sheet.");
    }
  };

  const totalEarned = REFERRALS.filter((r) => r.status === "completed").reduce(
    (s, r) => s + r.earned,
    0,
  );
  const totalReferred = REFERRALS.length;

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
              <Text style={styles.headerTitle}>Refer & Earn</Text>
              <Text style={styles.headerSub}>Invite friends, earn rewards</Text>
            </View>
            <Text style={styles.headerEmoji}>🎉</Text>
          </View>

          {/* Stats row inside header */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>₹{totalEarned}</Text>
              <Text style={styles.statLabel}>Total Earned</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{totalReferred}</Text>
              <Text style={styles.statLabel}>Friends Referred</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>₹75</Text>
              <Text style={styles.statLabel}>Per Referral</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── REFERRAL CODE CARD ── */}
        <View style={styles.codeCard}>
          <Text style={styles.codeCardTitle}>Your Referral Code</Text>
          <Text style={styles.codeCardSub}>
            Share this code with friends to earn rewards
          </Text>

          <View style={styles.codeBox}>
            <Text style={styles.codeText}>{REFERRAL_CODE}</Text>
            <TouchableOpacity
              style={[styles.copyBtn, copied && styles.copyBtnDone]}
              onPress={handleCopy}
              activeOpacity={0.8}
            >
              <Text style={styles.copyBtnText}>
                {copied ? "✓ Copied!" : "Copy"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Share button */}
          <TouchableOpacity
            style={styles.shareBtn}
            onPress={handleShare}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={["#1DB8A0", "#1A6FD4"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.shareBtnGrad}
            >
              <Text style={styles.shareBtnText}>📤 Share with Friends</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* ── HOW IT WORKS ── */}
        <Text style={styles.sectionTitle}>How it works</Text>
        <View style={styles.howCard}>
          {HOW_IT_WORKS.map((step, i) => (
            <View key={i} style={styles.howRow}>
              <View style={styles.howIconWrap}>
                <Text style={styles.howEmoji}>{step.emoji}</Text>
              </View>
              <View style={styles.howText}>
                <Text style={styles.howTitle}>{step.title}</Text>
                <Text style={styles.howDesc}>{step.desc}</Text>
              </View>
              {/* Connector line */}
              {i < HOW_IT_WORKS.length - 1 && <View style={styles.connector} />}
            </View>
          ))}
        </View>

        {/* ── YOUR REFERRALS ── */}
        <Text style={styles.sectionTitle}>Your referrals</Text>

        {REFERRALS.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>👥</Text>
            <Text style={styles.emptyText}>
              No referrals yet. Share your code to get started!
            </Text>
          </View>
        ) : (
          <View style={styles.referralsList}>
            {REFERRALS.map((ref, i) => (
              <View key={i} style={styles.referralRow}>
                <View style={styles.referralAvatar}>
                  <Text style={styles.referralAvatarText}>
                    {ref.name.charAt(0)}
                  </Text>
                </View>
                <View style={styles.referralInfo}>
                  <Text style={styles.referralName}>{ref.name}</Text>
                  <Text style={styles.referralDate}>{ref.date}</Text>
                </View>
                <View style={styles.referralRight}>
                  {ref.status === "completed" ? (
                    <Text style={styles.referralEarned}>+₹{ref.earned}</Text>
                  ) : (
                    <View style={styles.pendingBadge}>
                      <Text style={styles.pendingText}>Pending</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ── TERMS ── */}
        <View style={styles.termsCard}>
          <Text style={styles.termsTitle}>Terms & Conditions</Text>
          <Text style={styles.termsText}>
            • Referral credit is applied after the referred friend completes
            their first booking.{"\n"}• Credits can be used on any future
            booking.{"\n"}• Maximum 10 referrals per account per month.{"\n"}•
            PrimeFix reserves the right to modify this program at any time.
          </Text>
        </View>

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
    alignItems: "center",
    marginTop: 8,
    marginBottom: 20,
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
  headerEmoji: { fontSize: 36 },

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
    letterSpacing: 0.3,
  },
  statDivider: { width: 1, backgroundColor: "rgba(255,255,255,0.2)" },

  /* Body */
  body: { flex: 1 },
  bodyContent: { padding: Spacing.xl },

  /* Code card */
  codeCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 22,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  codeCardTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0B0F1A",
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  codeCardSub: {
    fontSize: 13,
    color: "#9CA3AF",
    fontWeight: "500",
    marginBottom: 18,
    lineHeight: 18,
  },

  codeBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F6FA",
    borderRadius: 14,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#D1D5DB",
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    gap: 12,
  },
  codeText: {
    flex: 1,
    fontSize: 18,
    fontWeight: "900",
    color: "#0B0F1A",
    letterSpacing: 2,
  },
  copyBtn: {
    backgroundColor: "#1DB8A0",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  copyBtnDone: { backgroundColor: "#10B981" },
  copyBtnText: { color: "#fff", fontSize: 13, fontWeight: "800" },

  shareBtn: { borderRadius: 14, overflow: "hidden" },
  shareBtnGrad: { paddingVertical: 16, alignItems: "center" },
  shareBtnText: { color: "#fff", fontSize: 16, fontWeight: "800" },

  /* Section titles */
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0B0F1A",
    marginBottom: 12,
    letterSpacing: -0.2,
  },

  /* How it works */
  howCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  howRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    paddingBottom: 20,
    position: "relative",
  },
  howIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F0FBF8",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  howEmoji: { fontSize: 22 },
  howText: { flex: 1, paddingTop: 4 },
  howTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0B0F1A",
    marginBottom: 3,
  },
  howDesc: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
    lineHeight: 18,
  },
  connector: {
    position: "absolute",
    left: 21,
    top: 48,
    width: 2,
    height: 18,
    backgroundColor: "#E5E7EB",
    borderRadius: 1,
  },

  /* Referrals list */
  referralsList: {
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  referralRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  referralAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    background: "linear-gradient(135deg, #1DB8A0, #1A6FD4)",
    backgroundColor: "#1DB8A0",
    alignItems: "center",
    justifyContent: "center",
  },
  referralAvatarText: { fontSize: 18, fontWeight: "800", color: "#fff" },
  referralInfo: { flex: 1 },
  referralName: { fontSize: 15, fontWeight: "700", color: "#0B0F1A" },
  referralDate: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
    marginTop: 2,
  },
  referralRight: { alignItems: "flex-end" },
  referralEarned: { fontSize: 16, fontWeight: "900", color: "#1DB8A0" },
  pendingBadge: {
    backgroundColor: "#FFF7ED",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pendingText: { fontSize: 11, fontWeight: "700", color: "#F59E0B" },

  /* Empty state */
  emptyCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    marginBottom: 20,
  },
  emptyEmoji: { fontSize: 40, marginBottom: 12 },
  emptyText: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 20,
  },

  /* Terms */
  termsCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#1DB8A0",
  },
  termsTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0B0F1A",
    marginBottom: 10,
  },
  termsText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
    lineHeight: 20,
  },
});
