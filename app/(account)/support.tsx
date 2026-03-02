// app/(account)/support.tsx

import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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
import { Spacing } from "../../constants/colors";
import { CONTACT } from "../../constants/services";

const FAQS = [
  {
    q: "How do I book a service?",
    a: "Go to the Home tab, select the service you need, fill in your name, phone and address, then tap Submit Request. We'll assign a professional within minutes.",
  },
  {
    q: "What areas do you cover?",
    a: "We are currently expanding our coverage across major cities. Contact us to check if your area is served.",
  },
  {
    q: "How are professionals verified?",
    a: "All professionals are background-checked, ID-verified, and reviewed by our team before being listed on the platform.",
  },
  {
    q: "How do I cancel or reschedule?",
    a: "Contact us via WhatsApp or call us as soon as possible and we'll help you cancel or reschedule your booking at no charge.",
  },
  {
    q: "How is pricing determined?",
    a: "Each service has a starting price shown in the app. Final pricing depends on the job complexity and will be confirmed before work begins. No hidden charges.",
  },
  {
    q: "How does Refer & Earn work?",
    a: "Share your referral code from the Refer tab. When a friend uses your code and completes their first booking, you both get rewarded — ₹75 for you, ₹50 off for them.",
  },
  {
    q: "Is my data safe?",
    a: "Yes. We use industry-standard encryption and never sell your data. Read our Privacy Policy in the Account section for full details.",
  },
];

export default function SupportScreen() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleWhatsApp = () => {
    const msg = encodeURIComponent("Hi! I need help with PrimeFix.");
    Linking.openURL(`https://wa.me/${CONTACT.whatsapp}?text=${msg}`).catch(() =>
      Alert.alert("Error", "WhatsApp not installed."),
    );
  };

  const handleCall = () =>
    Linking.openURL(`tel:${CONTACT.phone}`).catch(() =>
      Alert.alert("Error", "Could not open dialer."),
    );

  const handleEmail = () =>
    Linking.openURL(`mailto:${CONTACT.email}`).catch(() =>
      Alert.alert("Error", "Could not open mail app."),
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
            <Text style={styles.headerTitle}>Help & Support</Text>
            <View style={{ width: 36 }} />
          </View>
          <Text style={styles.headerSub}>
            We're here 7 days a week to help you
          </Text>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── CONTACT OPTIONS ── */}
        <Text style={styles.sectionLabel}>Contact Us</Text>
        <View style={styles.contactGrid}>
          <TouchableOpacity
            style={styles.contactCard}
            onPress={handleWhatsApp}
            activeOpacity={0.8}
          >
            <View
              style={[styles.contactIconWrap, { backgroundColor: "#DCFCE7" }]}
            >
              <Text style={styles.contactEmoji}>💬</Text>
            </View>
            <Text style={styles.contactTitle}>WhatsApp</Text>
            <Text style={styles.contactSub}>Fastest response</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactCard}
            onPress={handleCall}
            activeOpacity={0.8}
          >
            <View
              style={[styles.contactIconWrap, { backgroundColor: "#EEF4FF" }]}
            >
              <Text style={styles.contactEmoji}>📞</Text>
            </View>
            <Text style={styles.contactTitle}>Call Us</Text>
            <Text style={styles.contactSub}>{CONTACT.phone}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactCard}
            onPress={handleEmail}
            activeOpacity={0.8}
          >
            <View
              style={[styles.contactIconWrap, { backgroundColor: "#FFF7ED" }]}
            >
              <Text style={styles.contactEmoji}>✉️</Text>
            </View>
            <Text style={styles.contactTitle}>Email</Text>
            <Text style={styles.contactSub}>Within 24hrs</Text>
          </TouchableOpacity>
        </View>

        {/* ── FAQ ── */}
        <Text style={styles.sectionLabel}>Frequently Asked Questions</Text>
        <View style={styles.faqList}>
          {FAQS.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <TouchableOpacity
                key={i}
                style={[
                  styles.faqItem,
                  isOpen && styles.faqItemOpen,
                  i === FAQS.length - 1 && styles.faqItemLast,
                ]}
                onPress={() => setOpenFaq(isOpen ? null : i)}
                activeOpacity={0.75}
              >
                <View style={styles.faqRow}>
                  <Text style={[styles.faqQ, isOpen && styles.faqQOpen]}>
                    {faq.q}
                  </Text>
                  <Text
                    style={[styles.faqChevron, isOpen && styles.faqChevronOpen]}
                  >
                    ›
                  </Text>
                </View>
                {isOpen && <Text style={styles.faqA}>{faq.a}</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── STILL NEED HELP ── */}
        <TouchableOpacity
          style={styles.helpBanner}
          onPress={handleWhatsApp}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={["#0d1a3a", "#1a3a6e"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.helpBannerGrad}
          >
            <View style={styles.helpBannerLeft}>
              <Text style={styles.helpBannerTitle}>Still need help?</Text>
              <Text style={styles.helpBannerSub}>
                Chat with us on WhatsApp right now →
              </Text>
            </View>
            <Text style={styles.helpBannerEmoji}>💬</Text>
          </LinearGradient>
        </TouchableOpacity>

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

  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#9CA3AF",
    marginBottom: 12,
    marginLeft: 4,
  },

  /* Contact grid */
  contactGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  contactCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  contactIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  contactEmoji: { fontSize: 24 },
  contactTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0B0F1A",
    textAlign: "center",
  },
  contactSub: {
    fontSize: 11,
    color: "#9CA3AF",
    fontWeight: "500",
    textAlign: "center",
  },

  /* FAQ */
  faqList: {
    backgroundColor: "#fff",
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  faqItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  faqItemOpen: { backgroundColor: "#F8FFFE" },
  faqItemLast: { borderBottomWidth: 0 },
  faqRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  faqQ: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0B0F1A",
    flex: 1,
    paddingRight: 8,
  },
  faqQOpen: { color: "#1DB8A0" },
  faqChevron: { fontSize: 22, color: "#D1D5DB", fontWeight: "300" },
  faqChevronOpen: { transform: [{ rotate: "90deg" }], color: "#1DB8A0" },
  faqA: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
    lineHeight: 20,
    marginTop: 10,
  },

  /* Banner */
  helpBanner: { borderRadius: 18, overflow: "hidden" },
  helpBannerGrad: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  helpBannerLeft: { flex: 1 },
  helpBannerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
  },
  helpBannerSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.65)",
    fontWeight: "500",
  },
  helpBannerEmoji: { fontSize: 32 },
});
