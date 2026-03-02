// app/(account)/privacy.tsx

import { CONTACT } from "@/constants/services";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Spacing } from "../../constants/colors";

const SECTIONS = [
  {
    title: "1. Information We Collect",
    content:
      "When you use PrimeFix, we collect your name, phone number, and address when you submit a service request. We also collect basic usage data and device information to improve the app experience.",
  },
  {
    title: "2. How We Use Your Information",
    content:
      "We use your information to process and fulfill service requests, contact you about your booking status, assign the right professional to your request, and respond to your support queries.",
  },
  {
    title: "3. How We Share Your Information",
    content:
      "We do not sell your personal information. Your name, phone, and address are shared only with the assigned service professional to complete your booking. We never share your data with advertisers.",
  },
  {
    title: "4. Data Storage & Security",
    content:
      "Your data is stored securely using industry-standard encryption. We retain your information only as long as needed to provide our services or as required by law.",
  },
  {
    title: "5. Your Rights",
    content:
      "You have the right to access, correct, or delete your personal data at any time. To exercise these rights, contact us at the email below.",
  },
  {
    title: "6. Children's Privacy",
    content:
      "PrimeFix is not directed at children under 13. We do not knowingly collect personal information from children.",
  },
  {
    title: "7. Changes to This Policy",
    content:
      "We may update this Privacy Policy from time to time. Continued use of the app after changes constitutes acceptance of the updated policy.",
  },
  {
    title: "8. Contact Us",
    content:
      "For any privacy-related questions, contact us at sonijatin9227@gmail.com or via WhatsApp at +91-9999999999.",
  },
];

export default function PrivacyScreen() {
  const router = useRouter();

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
            <Text style={styles.headerTitle}>Privacy Policy</Text>
            <View style={{ width: 36 }} />
          </View>
          <Text style={styles.headerSub}>Last updated: January 1, 2025</Text>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Intro card */}
        <View style={styles.introCard}>
          <Text style={styles.introEmoji}>🔒</Text>
          <Text style={styles.introText}>
            Your privacy matters to us. This policy explains how PrimeFix
            collects, uses, and protects your information when you use our app.
          </Text>
        </View>

        {/* Policy sections */}
        {SECTIONS.map((s, i) => (
          <View key={i} style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>{s.title}</Text>
            <Text style={styles.sectionContent}>{s.content}</Text>
          </View>
        ))}

        {/* Contact box */}
        <View style={styles.contactBox}>
          <Text style={styles.contactTitle}>Questions about privacy?</Text>
          <Text style={styles.contactText}>📧 {CONTACT.email}</Text>
          <Text style={styles.contactText}>💬 {CONTACT.phone}</Text>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F4F6FA" },

  header: { paddingHorizontal: Spacing.xl, paddingBottom: 20, paddingTop: 8 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 8,
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.65)",
    fontWeight: "500",
  },

  body: { flex: 1 },
  bodyContent: { padding: Spacing.xl },

  introCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#1DB8A0",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  introEmoji: { fontSize: 24 },
  introText: {
    flex: 1,
    fontSize: 14,
    color: "#4B5563",
    fontWeight: "500",
    lineHeight: 22,
  },

  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0B0F1A",
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  sectionContent: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
    lineHeight: 22,
  },

  contactBox: {
    backgroundColor: "#F0FBF8",
    borderRadius: 16,
    padding: 18,
    marginTop: 6,
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(29,184,160,0.2)",
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0B0F1A",
    marginBottom: 6,
  },
  contactText: { fontSize: 14, color: "#1DB8A0", fontWeight: "600" },
});
