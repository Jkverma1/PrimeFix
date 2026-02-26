// app/request.tsx

import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AppButton from "../components/AppButton";
import AppInput from "../components/AppInput";
import Colors, { Spacing, Typography } from "../constants/colors";
import { SERVICES } from "../constants/services";
import { useServiceRequest } from "../hooks/useServiceRequest";
import { ServiceType } from "../types";

export default function RequestScreen() {
  const router = useRouter();
  const { serviceType } = useLocalSearchParams<{ serviceType: ServiceType }>();

  const service = SERVICES.find((s) => s.id === serviceType);
  const serviceName = service?.label ?? serviceType;
  const serviceIcon = service?.icon ?? "🔧";
  const serviceDesc = service?.description ?? "";
  const servicePrice = service?.startingPrice ?? 0;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [issue, setIssue] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { submit, isLoading, error: submitError } = useServiceRequest();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!phone.trim() || phone.length < 10)
      e.phone = "Enter a valid 10-digit number";
    if (!address.trim()) e.address = "Address is required";
    if (!issue.trim()) e.issue = "Please describe the issue";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      const result = await submit({ name, phone, address, issue, serviceType });
      router.replace({
        pathname: "/success",
        params: { requestId: result.requestId, serviceType },
      });
    } catch (e: any) {
      Alert.alert(
        "Error",
        submitError ||
          e?.message ||
          "Could not send your request. Please try again.",
      );
    }
  };

  return (
    <View style={styles.root}>
      {/* ── GRADIENT HEADER ── */}
      <LinearGradient
        colors={["#1DB8A0", "#1A6FD4"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <SafeAreaView>
          {/* Back button row */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backText}>Services</Text>
          </TouchableOpacity>

          {/* Service info row */}
          <View style={styles.serviceRow}>
            <View style={styles.serviceIconWrap}>
              <Text style={styles.serviceIcon}>{serviceIcon}</Text>
            </View>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceTitle}>{serviceName} Request</Text>
              <Text style={styles.serviceDesc}>{serviceDesc}</Text>
            </View>
            {/* Price badge */}
            <View style={styles.priceBadge}>
              <Text style={styles.priceFrom}>from</Text>
              <Text style={styles.priceAmt}>₹{servicePrice}</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* ── FORM BODY ── */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Steps indicator */}
          <View style={styles.stepsRow}>
            <View style={styles.step}>
              <View style={styles.stepDot}>
                <Text style={styles.stepNum}>1</Text>
              </View>
              <Text style={styles.stepLabel}>Service</Text>
            </View>
            <View style={styles.stepLine} />
            <View style={styles.step}>
              <View style={styles.stepDot}>
                <Text style={styles.stepNum}>2</Text>
              </View>
              <Text style={styles.stepLabel}>Details</Text>
            </View>
            <View style={styles.stepLine} />
            <View style={styles.step}>
              <View style={[styles.stepDot, styles.stepDotInactive]}>
                <Text style={[styles.stepNum, styles.stepNumInactive]}>3</Text>
              </View>
              <Text style={[styles.stepLabel, styles.stepLabelInactive]}>
                Submit
              </Text>
            </View>
          </View>

          {submitError ? (
            <Text style={styles.submitError}>{submitError}</Text>
          ) : null}

          {/* Form card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Tell us about yourself</Text>
            <Text style={styles.cardSub}>
              We'll use this to contact you and assign the right professional.
            </Text>

            <AppInput
              label="Your Name"
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
              error={errors.name}
              autoCapitalize="words"
            />
            <AppInput
              label="Phone Number"
              placeholder="10-digit mobile number"
              value={phone}
              onChangeText={setPhone}
              error={errors.phone}
              keyboardType="phone-pad"
              maxLength={10}
            />
            <AppInput
              label="Address"
              placeholder="House no., street, area, city"
              value={address}
              onChangeText={setAddress}
              error={errors.address}
              autoCapitalize="sentences"
            />
            <AppInput
              label="Describe the Issue"
              placeholder="E.g. leaking pipe under kitchen sink..."
              value={issue}
              onChangeText={setIssue}
              error={errors.issue}
              multiline
              numberOfLines={4}
              style={styles.textarea}
            />
          </View>

          {/* Trust badges */}
          <View style={styles.trustRow}>
            <View style={styles.trustItem}>
              <Text style={styles.trustIcon}>✓</Text>
              <Text style={styles.trustText}>Verified Pros</Text>
            </View>
            <View style={styles.trustDot} />
            <View style={styles.trustItem}>
              <Text style={styles.trustIcon}>🛡</Text>
              <Text style={styles.trustText}>Insured Work</Text>
            </View>
            <View style={styles.trustDot} />
            <View style={styles.trustItem}>
              <Text style={styles.trustIcon}>⚡</Text>
              <Text style={styles.trustText}>Fast Response</Text>
            </View>
          </View>

          <View style={{ height: 16 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── FOOTER ── */}
      <View style={styles.footer}>
        <AppButton
          title="Submit Request"
          onPress={handleSubmit}
          loading={isLoading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F4F6FA" },

  /* ── HEADER ── */
  header: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 24,
    paddingTop: 8,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 20,
    marginTop: 8,
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  backArrow: { color: "#fff", fontSize: 16, fontWeight: "700" },
  backText: { color: "#fff", fontSize: 13, fontWeight: "600" },

  serviceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  serviceIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  serviceIcon: { fontSize: 26 },
  serviceInfo: { flex: 1 },
  serviceTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  serviceDesc: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    fontWeight: "500",
  },
  priceBadge: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "center",
  },
  priceFrom: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 9,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  priceAmt: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.5,
  },

  /* ── BODY ── */
  body: { flex: 1, marginTop: -12 },
  scroll: { paddingHorizontal: Spacing.xl, paddingTop: 0 },

  /* Steps */
  stepsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    marginTop: 8,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  step: { alignItems: "center", gap: 4, justifyContent: "center" },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#1DB8A0",
    alignItems: "center",
    justifyContent: "center",
  },
  stepDotInactive: { backgroundColor: "#F0F2F8" },
  stepNum: { color: "#fff", fontSize: 12, fontWeight: "800" },
  stepNumInactive: { color: "#C0C8D8" },
  stepLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#1DB8A0",
    letterSpacing: 0.3,
  },
  stepLabelInactive: { color: "#C0C8D8" },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: "#F0F2F8",
    marginHorizontal: 6,
    // keep the line vertically centered with the dots/labels
    alignSelf: "center",
  },

  /* Form card */
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: Spacing.xl,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0B0F1A",
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  cardSub: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
    marginBottom: 20,
    lineHeight: 17,
  },
  textarea: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: Spacing.md,
  },

  /* Trust badges */
  trustRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 4,
  },
  trustItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  trustIcon: { fontSize: 12 },
  trustText: { fontSize: 11, color: "#9CA3AF", fontWeight: "600" },
  trustDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#D1D5DB",
  },

  submitError: {
    color: Colors.error,
    textAlign: "center",
    marginBottom: Spacing.lg,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
  },

  /* Footer */
  footer: {
    padding: Spacing.lg,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    elevation: 4,
  },
});
