// app/request.tsx

import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AppButton from "../../../components/AppButton";
import AppInput from "../../../components/AppInput";
import Colors, { Spacing, Typography } from "../../../constants/colors";
import { SERVICES } from "../../../constants/services";
import { useServiceRequest } from "../../../hooks/useServiceRequest";
import { useUserStore } from "../../../store/UserStore";
import { ServiceType } from "../../../types";

const LABEL_EMOJIS: Record<string, string> = {
  Home: "🏠",
  Office: "🏢",
  Other: "📍",
};

export default function RequestScreen() {
  const router = useRouter();
  const { serviceType } = useLocalSearchParams<{ serviceType: ServiceType }>();
  const { addresses } = useUserStore();

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

  // Address picker state
  const [showAddressPicker, setShowAddressPicker] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );

  const { submit, isLoading, error: submitError } = useServiceRequest();

  // Pre-fill with default address on mount
  React.useEffect(() => {
    const defaultAddr = addresses.find((a) => a.is_default);
    if (defaultAddr && !address) {
      setAddress(defaultAddr.address);
      setSelectedAddressId(defaultAddr.id);
    }
  }, [addresses]);

  const handleSelectAddress = (saved: { id: string; address: string }) => {
    setAddress(saved.address);
    setSelectedAddressId(saved.id);
    setShowAddressPicker(false);
    // Clear address error if any
    setErrors((e) => ({ ...e, address: "" }));
  };

  const handleManualAddressChange = (text: string) => {
    setAddress(text);
    setSelectedAddressId(null); // detach from saved address
  };

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

  const selectedSaved = addresses.find((a) => a.id === selectedAddressId);

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
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backText}>Services</Text>
          </TouchableOpacity>
          <View style={styles.serviceRow}>
            <View style={styles.serviceIconWrap}>
              <Text style={styles.serviceIcon}>{serviceIcon}</Text>
            </View>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceTitle}>{serviceName} Request</Text>
              <Text style={styles.serviceDesc}>{serviceDesc}</Text>
            </View>
            <View style={styles.priceBadge}>
              <Text style={styles.priceFrom}>from</Text>
              <Text style={styles.priceAmt}>₹{servicePrice}</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* ── FORM ── */}
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
          {/* Steps */}
          <View style={styles.stepsRow}>
            {["Service", "Details", "Submit"].map((step, i) => (
              <React.Fragment key={step}>
                <View style={styles.step}>
                  <View
                    style={[styles.stepDot, i === 2 && styles.stepDotInactive]}
                  >
                    <Text
                      style={[
                        styles.stepNum,
                        i === 2 && styles.stepNumInactive,
                      ]}
                    >
                      {i + 1}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.stepLabel,
                      i === 2 && styles.stepLabelInactive,
                    ]}
                  >
                    {step}
                  </Text>
                </View>
                {i < 2 && <View style={styles.stepLine} />}
              </React.Fragment>
            ))}
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

            {/* ── ADDRESS FIELD with saved picker ── */}
            <View style={styles.addressSection}>
              <View style={styles.addressLabelRow}>
                <Text style={styles.addressFieldLabel}>Address</Text>
                {addresses.length > 0 && (
                  <TouchableOpacity
                    style={styles.savedAddressBtn}
                    onPress={() => setShowAddressPicker(true)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.savedAddressBtnText}>
                      📍 {selectedSaved ? selectedSaved.label : "Use Saved"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Show selected saved address chip */}
              {selectedSaved && (
                <View style={styles.selectedChip}>
                  <Text style={styles.selectedChipEmoji}>
                    {LABEL_EMOJIS[selectedSaved.label] ?? "📍"}
                  </Text>
                  <Text style={styles.selectedChipText} numberOfLines={1}>
                    {selectedSaved.label} — {selectedSaved.address}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedAddressId(null);
                      setAddress("");
                    }}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text style={styles.selectedChipClose}>✕</Text>
                  </TouchableOpacity>
                </View>
              )}

              <AppInput
                label=""
                placeholder="House no., street, area, city"
                value={address}
                onChangeText={handleManualAddressChange}
                error={errors.address}
                autoCapitalize="sentences"
              />
            </View>

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
            {[
              ["✓", "Verified Pros"],
              ["🛡", "Insured Work"],
              ["⚡", "Fast Response"],
            ].map(([icon, text], i) => (
              <React.Fragment key={text}>
                {i > 0 && <View style={styles.trustDot} />}
                <View style={styles.trustItem}>
                  <Text style={styles.trustIcon}>{icon}</Text>
                  <Text style={styles.trustText}>{text}</Text>
                </View>
              </React.Fragment>
            ))}
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

      {/* ── SAVED ADDRESS PICKER MODAL ── */}
      <Modal
        visible={showAddressPicker}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddressPicker(false)}
      >
        <View style={styles.modal}>
          <View style={styles.modalHandle} />
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Choose an Address</Text>
            <TouchableOpacity
              onPress={() => setShowAddressPicker(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalBody}>
            {addresses.map((a) => (
              <TouchableOpacity
                key={a.id}
                style={[
                  styles.addressOption,
                  selectedAddressId === a.id && styles.addressOptionSelected,
                ]}
                onPress={() => handleSelectAddress(a)}
                activeOpacity={0.8}
              >
                <View style={styles.addressOptionIcon}>
                  <Text style={{ fontSize: 20 }}>
                    {LABEL_EMOJIS[a.label] ?? "📍"}
                  </Text>
                </View>
                <View style={styles.addressOptionInfo}>
                  <View style={styles.addressOptionLabelRow}>
                    <Text style={styles.addressOptionLabel}>{a.label}</Text>
                    {a.is_default && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultBadgeText}>Default</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.addressOptionText} numberOfLines={2}>
                    {a.address}
                  </Text>
                </View>
                {selectedAddressId === a.id && (
                  <Text style={styles.addressOptionCheck}>✓</Text>
                )}
              </TouchableOpacity>
            ))}

            {/* Option to enter manually */}
            <TouchableOpacity
              style={styles.addressOptionManual}
              onPress={() => {
                setSelectedAddressId(null);
                setAddress("");
                setShowAddressPicker(false);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.addressOptionManualText}>
                ✏️ Enter a new address manually
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F4F6FA" },

  /* Header */
  header: { paddingHorizontal: Spacing.xl, paddingBottom: 24, paddingTop: 8 },
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
  serviceRow: { flexDirection: "row", alignItems: "center", gap: 14 },
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

  /* Body */
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
  step: { alignItems: "center", gap: 4 },
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
  textarea: { height: 100, textAlignVertical: "top", paddingTop: Spacing.md },

  /* Address field */
  addressSection: { marginBottom: 4 },
  addressLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  addressFieldLabel: { fontSize: 13, fontWeight: "700", color: "#374151" },
  savedAddressBtn: {
    backgroundColor: "#F0FBF8",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "rgba(29,184,160,0.3)",
  },
  savedAddressBtnText: { fontSize: 12, fontWeight: "700", color: "#1DB8A0" },

  selectedChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FBF8",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(29,184,160,0.25)",
  },
  selectedChipEmoji: { fontSize: 16 },
  selectedChipText: {
    flex: 1,
    fontSize: 13,
    color: "#0B0F1A",
    fontWeight: "600",
  },
  selectedChipClose: { fontSize: 12, color: "#9CA3AF", fontWeight: "700" },

  /* Trust */
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
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    elevation: 4,
    paddingHorizontal: Spacing.xl,
    paddingTop: 12,
  },

  /* Address picker modal */
  modal: { flex: 1, backgroundColor: "#fff" },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E5E7EB",
    alignSelf: "center",
    marginTop: 12,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.xl,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalTitle: { fontSize: 18, fontWeight: "800", color: "#0B0F1A" },
  modalClose: { fontSize: 18, color: "#9CA3AF", fontWeight: "700" },
  modalBody: { padding: Spacing.xl, gap: 10 },

  addressOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#F8F9FB",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  addressOptionSelected: { backgroundColor: "#F0FBF8", borderColor: "#1DB8A0" },
  addressOptionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  addressOptionInfo: { flex: 1 },
  addressOptionLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 3,
  },
  addressOptionLabel: { fontSize: 15, fontWeight: "800", color: "#0B0F1A" },
  defaultBadge: {
    backgroundColor: "#F0FBF8",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  defaultBadgeText: { fontSize: 10, color: "#1DB8A0", fontWeight: "700" },
  addressOptionText: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
    lineHeight: 18,
  },
  addressOptionCheck: { fontSize: 18, color: "#1DB8A0", fontWeight: "900" },

  addressOptionManual: {
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#D1D5DB",
    marginTop: 4,
  },
  addressOptionManualText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6B7280",
  },
});
