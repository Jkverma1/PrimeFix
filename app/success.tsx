// app/success.tsx

import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Alert,
  Animated,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Spacing } from "../constants/colors";
import { CONTACT, SERVICES } from "../constants/services";

export default function SuccessScreen() {
  const router = useRouter();
  const { requestId, serviceType } = useLocalSearchParams<{
    requestId: string;
    serviceType: string;
  }>();

  const service = SERVICES.find((s) => s.id === serviceType);
  const serviceName = service?.label ?? "Service";
  const serviceIcon = service?.icon ?? "🔧";

  // Animations
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.sequence([
      // checkmark pops in
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 60,
        friction: 7,
        useNativeDriver: true,
      }),
      // content fades + slides up
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const handleCall = () => {
    Linking.openURL(`tel:${CONTACT.phone}`).catch(() =>
      Alert.alert("Error", "Could not open the dialer."),
    );
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `Hi! I just submitted a ${serviceName} request on PrimeFix. Request ID: ${requestId}`,
    );
    Linking.openURL(`https://wa.me/${CONTACT.whatsapp}?text=${msg}`).catch(() =>
      Alert.alert("Error", "WhatsApp is not installed."),
    );
  };

  return (
    <View style={styles.root}>
      {/* ── GRADIENT HEADER — same as other screens ── */}
      <LinearGradient
        colors={["#1DB8A0", "#1A6FD4"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <SafeAreaView>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Booking Confirmed</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* ── BODY ── */}
      <View style={styles.body}>
        {/* Checkmark card — overlaps header */}
        <Animated.View
          style={[styles.checkCard, { transform: [{ scale: scaleAnim }] }]}
        >
          <LinearGradient
            colors={["#1DB8A0", "#1A6FD4"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.checkCircle}
          >
            <Text style={styles.checkMark}>✓</Text>
          </LinearGradient>
        </Animated.View>

        <Animated.View
          style={[
            styles.contentWrap,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Title */}
          <Text style={styles.title}>Request Sent!</Text>
          <Text style={styles.subtitle}>
            Your <Text style={styles.subtitleBold}>{serviceName}</Text> request
            has been received.{"\n"}
            We'll contact you shortly.
          </Text>

          {/* Service + ID card */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryIconWrap}>
                <Text style={styles.summaryIcon}>{serviceIcon}</Text>
              </View>
              <View style={styles.summaryText}>
                <Text style={styles.summaryService}>{serviceName}</Text>
                <Text style={styles.summaryLabel}>Service Requested</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Pending</Text>
              </View>
            </View>

            {requestId ? (
              <>
                <View style={styles.divider} />
                <View style={styles.idRow}>
                  <Text style={styles.idLabel}>Booking ID</Text>
                  <Text style={styles.idValue}>#{requestId}</Text>
                </View>
              </>
            ) : null}
          </View>

          {/* What happens next */}
          <View style={styles.nextCard}>
            <Text style={styles.nextTitle}>What happens next?</Text>
            <View style={styles.nextStep}>
              <View style={styles.nextDot} />
              <Text style={styles.nextText}>
                We review your request within minutes
              </Text>
            </View>
            <View style={styles.nextStep}>
              <View style={styles.nextDot} />
              <Text style={styles.nextText}>
                A verified professional is assigned
              </Text>
            </View>
            <View style={styles.nextStep}>
              <View style={[styles.nextDot, { backgroundColor: "#E5E7EB" }]} />
              <Text style={[styles.nextText, { color: "#C0C8D8" }]}>
                You'll be contacted to confirm the slot
              </Text>
            </View>
          </View>

          {/* Action buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.btnCall}
              onPress={handleCall}
              activeOpacity={0.8}
            >
              <Text style={styles.btnCallText}>📞 Call Us</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnWA}
              onPress={handleWhatsApp}
              activeOpacity={0.8}
            >
              <Text style={styles.btnWAText}>💬 WhatsApp</Text>
            </TouchableOpacity>
          </View>

          {/* Back home */}
          <TouchableOpacity
            style={styles.homeBtn}
            onPress={() => router.replace("/")}
            activeOpacity={0.7}
          >
            <Text style={styles.homeBtnText}>← Back to Home</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F4F6FA" },

  /* ── HEADER ── */
  header: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 48, // extra padding so card can overlap
    paddingTop: 8,
  },
  headerRow: {
    alignItems: "center",
    marginTop: 16,
    marginBottom: 4,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.3,
  },

  /* ── BODY ── */
  body: {
    flex: 1,
    marginTop: -36,
    paddingHorizontal: Spacing.xl,
  },

  /* Animated check card */
  checkCard: {
    alignItems: "center",
    marginBottom: 20,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1DB8A0",
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
    borderWidth: 3,
    borderColor: "#fff",
  },
  checkMark: {
    fontSize: 38,
    color: "#fff",
    fontWeight: "900",
  },

  contentWrap: {
    flex: 1,
  },

  /* Title */
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#0B0F1A",
    textAlign: "center",
    letterSpacing: -0.8,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
    fontWeight: "500",
  },
  subtitleBold: {
    color: "#1DB8A0",
    fontWeight: "700",
  },

  /* Summary card */
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  summaryIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#F0FBF8",
    alignItems: "center",
    justifyContent: "center",
  },
  summaryIcon: { fontSize: 24 },
  summaryText: { flex: 1 },
  summaryService: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0B0F1A",
    letterSpacing: -0.3,
  },
  summaryLabel: {
    fontSize: 11,
    color: "#9CA3AF",
    fontWeight: "500",
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: "#FFF7ED",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#F59E0B",
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 14,
  },
  idRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  idLabel: { fontSize: 12, color: "#9CA3AF", fontWeight: "600" },
  idValue: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1A6FD4",
    letterSpacing: 0.5,
  },

  /* What's next card */
  nextCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  nextTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0B0F1A",
    marginBottom: 14,
    letterSpacing: 0.2,
  },
  nextStep: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  nextDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#1DB8A0",
  },
  nextText: {
    fontSize: 13,
    color: "#4B5563",
    fontWeight: "500",
    flex: 1,
  },

  /* Buttons */
  actions: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  btnCall: {
    flex: 1,
    backgroundColor: "#0B0F1A",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  btnCallText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  btnWA: {
    flex: 1,
    backgroundColor: "#25D366",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  btnWAText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },

  /* Home button */
  homeBtn: {
    alignItems: "center",
    paddingVertical: 8,
  },
  homeBtnText: {
    color: "#1A6FD4",
    fontSize: 14,
    fontWeight: "700",
  },
});
