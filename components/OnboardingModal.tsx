// components/OnboardingModal.tsx

import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useReferralStore } from "../store/ReferralStore";
import { useUserStore } from "../store/UserStore";

export default function OnboardingModal() {
  const { profile, updateProfile } = useUserStore();
  const { applyReferralCode } = useReferralStore();

  const [name, setName] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [nameError, setNameError] = useState("");
  const [referralError, setReferralError] = useState("");
  const [referralSuccess, setReferralSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Show only for new users — profile loaded but no name yet
  const visible = !!profile && !profile.full_name;

  const handleSubmit = async () => {
    // Validate name
    if (!name.trim()) {
      setNameError("Please enter your name to continue.");
      return;
    }
    setNameError("");
    setIsSaving(true);

    try {
      // Run name update always
      const tasks: Promise<any>[] = [updateProfile({ full_name: name.trim() })];

      // Run referral only if code entered
      if (referralCode.trim()) {
        tasks.push(
          applyReferralCode(referralCode.trim()).catch((e: Error) => {
            // Referral errors are non-blocking — surface them but don't fail
            setReferralError(e.message);
            return null;
          }),
        );
      }

      await Promise.all(tasks);

      // If referral had no error, mark success
      if (referralCode.trim() && !referralError) {
        setReferralSuccess(true);
      }

      // Modal auto-dismisses because profile.full_name is now set
    } catch (e: any) {
      setNameError("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSkipReferral = async () => {
    if (!name.trim()) {
      setNameError("Please enter your name to continue.");
      return;
    }
    setNameError("");
    setIsSaving(true);
    try {
      await updateProfile({ full_name: name.trim() });
    } catch {
      setNameError("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <ScrollView
          contentContainerStyle={styles.scrollWrap}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.sheet}>
            {/* ── Header gradient strip ── */}
            <LinearGradient
              colors={["#1DB8A0", "#1A6FD4"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.headerStrip}
            >
              <Text style={styles.headerEmoji}>👋</Text>
              <Text style={styles.headerTitle}>Welcome to PrimeFix!</Text>
              <Text style={styles.headerSub}>
                Quick setup to personalise your experience
              </Text>
            </LinearGradient>

            <View style={styles.body}>
              {/* ── Name field ── */}
              <View style={styles.fieldWrap}>
                <Text style={styles.fieldLabel}>Your Name *</Text>
                <TextInput
                  style={[styles.input, nameError ? styles.inputError : null]}
                  value={name}
                  onChangeText={(t) => {
                    setName(t);
                    setNameError("");
                  }}
                  placeholder="Enter your full name"
                  placeholderTextColor="#B0B8C8"
                  autoCapitalize="words"
                  returnKeyType="next"
                  autoFocus
                />
                {nameError ? (
                  <Text style={styles.errorText}>{nameError}</Text>
                ) : null}
              </View>

              {/* ── Referral code field ── */}
              <View style={styles.fieldWrap}>
                <Text style={styles.fieldLabel}>
                  Referral Code{" "}
                  <Text style={styles.fieldLabelOptional}>(optional)</Text>
                </Text>
                <View style={styles.referralRow}>
                  <TextInput
                    style={[
                      styles.input,
                      styles.referralInput,
                      referralError ? styles.inputError : null,
                      referralSuccess ? styles.inputSuccess : null,
                    ]}
                    value={referralCode}
                    onChangeText={(t) => {
                      setReferralCode(t.toUpperCase());
                      setReferralError("");
                      setReferralSuccess(false);
                    }}
                    placeholder="E.g. AB12CD34"
                    placeholderTextColor="#B0B8C8"
                    autoCapitalize="characters"
                    returnKeyType="done"
                    maxLength={12}
                  />
                </View>
                {referralError ? (
                  <Text style={styles.errorText}>{referralError}</Text>
                ) : null}
                {referralSuccess ? (
                  <Text style={styles.successText}>
                    ✓ Referral code applied! You'll get ₹50 off your first
                    booking.
                  </Text>
                ) : null}
                {!referralError && !referralSuccess && (
                  <Text style={styles.fieldHint}>
                    Get ₹50 off your first booking with a friend's code.
                  </Text>
                )}
              </View>

              {/* ── Submit button ── */}
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleSubmit}
                activeOpacity={0.88}
                disabled={isSaving}
              >
                <LinearGradient
                  colors={["#1DB8A0", "#1A6FD4"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.submitBtnGrad}
                >
                  {isSaving ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.submitBtnText}>Let's Go 🚀</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* ── Skip referral link ── */}
              {!isSaving && (
                <TouchableOpacity
                  onPress={handleSkipReferral}
                  style={styles.skipBtn}
                  activeOpacity={0.7}
                >
                  <Text style={styles.skipText}>Skip referral code →</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  scrollWrap: {
    justifyContent: "flex-end",
    flexGrow: 1,
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: -6 },
    elevation: 16,
  },

  /* Header */
  headerStrip: {
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 28,
    alignItems: "center",
    gap: 8,
  },
  headerEmoji: { fontSize: 42, marginBottom: 4 },
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -0.5,
    textAlign: "center",
  },
  headerSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 19,
  },

  /* Body */
  body: { padding: 24, paddingBottom: 36 },

  fieldWrap: { marginBottom: 20 },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
  },
  fieldLabelOptional: {
    fontWeight: "500",
    color: "#9CA3AF",
    fontSize: 12,
  },
  fieldHint: {
    fontSize: 11,
    color: "#B0B8C8",
    fontWeight: "500",
    marginTop: 6,
    marginLeft: 2,
  },

  input: {
    backgroundColor: "#F8F9FB",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#EAECF0",
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#0B0F1A",
    fontWeight: "600",
  },
  inputError: { borderColor: "#FCA5A5", backgroundColor: "#FFF5F5" },
  inputSuccess: { borderColor: "#6EE7B7", backgroundColor: "#F0FBF8" },

  referralRow: { flexDirection: "row", gap: 10 },
  referralInput: { flex: 1, letterSpacing: 2 },

  errorText: {
    fontSize: 12,
    color: "#EF4444",
    fontWeight: "600",
    marginTop: 6,
    marginLeft: 2,
  },
  successText: {
    fontSize: 12,
    color: "#1DB8A0",
    fontWeight: "600",
    marginTop: 6,
    marginLeft: 2,
    lineHeight: 18,
  },

  /* Buttons */
  submitBtn: {
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 4,
    shadowColor: "#1DB8A0",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  submitBtnGrad: {
    paddingVertical: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
  },

  skipBtn: {
    alignItems: "center",
    paddingVertical: 14,
  },
  skipText: {
    fontSize: 13,
    color: "#9CA3AF",
    fontWeight: "600",
  },
});
