// app/(auth)/index.tsx

import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { sendOtp, verifyOtp } from "../../services/auth.api";
import { useAuthStore } from "../../store/AuthStore";

type Step = "phone" | "otp";

export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [error, setError] = useState("");

  const otpRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 55,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 55,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 6,
        duration: 55,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -6,
        duration: 55,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 55,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSendOtp = async () => {
    setError("");
    if (!phone.trim() || phone.length < 10) {
      setError("Enter a valid 10-digit mobile number");
      shake();
      return;
    }
    setIsLoading(true);
    try {
      await sendOtp(phone);
      setStep("otp");
      setResendTimer(30);
      setTimeout(() => otpRefs[0].current?.focus(), 350);
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Could not send OTP. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtpWithCode = async (code: string) => {
    setError("");
    setIsLoading(true);
    try {
      const result = await verifyOtp(phone, code);
      login(result.token, result.userId);

      // Small delay to ensure Supabase session is committed
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Now fetch profile safely
      const { useUserStore } = await import("../../store/UserStore");
      await useUserStore.getState().fetchProfile();
      const profile = useUserStore.getState().profile;

      if (profile?.is_admin) {
        router.replace("/(admin)/(a-dashboard)");
      } else {
        router.replace("/(tabs)/(a-home)");
      }
    } catch {
      setError("Invalid OTP. Please try again.");
      shake();
      setOtp(["", "", "", "", "", ""]);
      otpRefs[0].current?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    const code = otp.join("");
    if (code.length < 6) {
      setError("Enter the 6-digit OTP");
      shake();
      return;
    }
    handleVerifyOtpWithCode(code);
  };

  // ── KEY FIX: handles both SMS autofill/paste AND normal single-digit entry ──
  const handleOtpChange = (val: string, idx: number) => {
    // Strip non-digits
    const digits = val.replace(/\D/g, "");

    // Autofill or paste — iOS delivers full 6-digit string to first focused box
    if (digits.length > 1) {
      const chars = digits.slice(0, 6).split("");
      const next = Array(6)
        .fill("")
        .map((_, i) => chars[i] ?? "");
      setOtp(next);
      setError("");
      // Focus last filled box so keyboard stays up naturally
      const lastIdx = Math.min(chars.length - 1, 5);
      otpRefs[lastIdx].current?.focus();
      // Auto-submit once all 6 filled
      if (chars.length >= 6) {
        setTimeout(() => handleVerifyOtpWithCode(next.join("")), 100);
      }
      return;
    }

    // Normal single-digit typing
    const next = [...otp];
    next[idx] = digits;
    setOtp(next);
    setError("");
    if (digits && idx < 5) otpRefs[idx + 1].current?.focus();
    if (next.every((d) => d !== "") && idx === 5) {
      setTimeout(() => handleVerifyOtpWithCode(next.join("")), 100);
    }
  };

  const handleOtpKeyPress = (e: any, idx: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[idx] && idx > 0) {
      otpRefs[idx - 1].current?.focus();
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setOtp(["", "", "", "", "", ""]);
    setError("");
    setIsLoading(true);
    try {
      await sendOtp(phone);
      setResendTimer(30);
      otpRefs[0].current?.focus();
    } catch {
      Alert.alert("Error", "Could not resend OTP. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#1DB8A0", "#1A6FD4"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <SafeAreaView>
          <View style={styles.headerContent}>
            {step === "phone" ? (
              <>
                <Text style={styles.heroTitle}>Get started</Text>
                <Text style={styles.heroSub}>
                  Enter your mobile number to continue
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.heroTitle}>Verify</Text>
                <Text style={styles.heroSub}>OTP sent to +91 {phone}</Text>
              </>
            )}
            <View style={styles.howStrip}>
              <View style={styles.howItem}>
                <Text style={styles.howNum}>1</Text>
                <Text style={styles.howLabel}>Pick</Text>
              </View>
              <View style={styles.howArrow}>
                <Text style={styles.howArrowText}>›</Text>
              </View>
              <View style={styles.howItem}>
                <Text style={styles.howNum}>2</Text>
                <Text style={styles.howLabel}>Book</Text>
              </View>
              <View style={styles.howArrow}>
                <Text style={styles.howArrowText}>›</Text>
              </View>
              <View style={styles.howItem}>
                <Text style={styles.howNum}>3</Text>
                <Text style={styles.howLabel}>Relax</Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.kav}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <Animated.View
            style={[styles.card, { transform: [{ translateX: shakeAnim }] }]}
          >
            {step === "phone" ? (
              <>
                <Text style={styles.cardTitle}>Enter Mobile Number</Text>
                <Text style={styles.cardSub}>
                  We'll send a one-time password to this number
                </Text>

                <View style={styles.fieldWrap}>
                  <View
                    style={[styles.inputRow, error ? styles.inputError : null]}
                  >
                    <View style={styles.countryCode}>
                      <Text style={styles.flag}>🇮🇳</Text>
                      <Text style={styles.dialCode}>+91</Text>
                    </View>
                    <View style={styles.dividerV} />
                    <TextInput
                      style={styles.input}
                      placeholder="10-digit mobile number"
                      placeholderTextColor="#B0B8C8"
                      value={phone}
                      onChangeText={(t) => {
                        setPhone(t);
                        setError("");
                      }}
                      keyboardType="phone-pad"
                      maxLength={10}
                      returnKeyType="done"
                      onSubmitEditing={handleSendOtp}
                    />
                  </View>
                  {error ? <Text style={styles.errorText}>{error}</Text> : null}
                </View>

                <TouchableOpacity
                  style={[
                    styles.actionBtn,
                    isLoading && styles.actionBtnDisabled,
                  ]}
                  onPress={handleSendOtp}
                  activeOpacity={0.85}
                  disabled={isLoading}
                >
                  <LinearGradient
                    colors={
                      isLoading
                        ? ["#9CA3AF", "#9CA3AF"]
                        : ["#1DB8A0", "#1A6FD4"]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.actionBtnGradient}
                  >
                    <Text style={styles.actionBtnText}>
                      {isLoading ? "Sending OTP..." : "Send OTP →"}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <Text style={styles.disclaimer}>
                  By continuing, you agree to our{" "}
                  <Text style={styles.link}>Terms</Text> &{" "}
                  <Text style={styles.link}>Privacy Policy</Text>
                </Text>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.backRow}
                  onPress={() => {
                    setStep("phone");
                    setOtp(["", "", "", "", "", ""]);
                    setError("");
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.backArrow}>←</Text>
                  <Text style={styles.backText}>Change number</Text>
                </TouchableOpacity>

                <Text style={styles.cardTitle}>Enter OTP</Text>
                <Text style={styles.cardSub}>
                  6-digit code sent to +91 {phone}
                </Text>

                <View style={styles.otpRow}>
                  {otp.map((digit, idx) => (
                    <TextInput
                      key={idx}
                      ref={otpRefs[idx]}
                      style={[
                        styles.otpBox,
                        digit ? styles.otpBoxFilled : null,
                        error ? styles.otpBoxError : null,
                      ]}
                      value={digit}
                      onChangeText={(v) => handleOtpChange(v, idx)}
                      onKeyPress={(e) => handleOtpKeyPress(e, idx)}
                      keyboardType="number-pad"
                      // ── FIX 1: first box allows 6 chars so autofill/paste works ──
                      maxLength={idx === 0 ? 6 : 1}
                      textAlign="center"
                      selectTextOnFocus
                      // ── FIX 2: tells iOS this is an OTP field → shows autofill bar ──
                      textContentType="oneTimeCode"
                      autoComplete={idx === 0 ? "one-time-code" : "off"}
                    />
                  ))}
                </View>
                {error ? (
                  <Text
                    style={[
                      styles.errorText,
                      { textAlign: "center", marginBottom: 8 },
                    ]}
                  >
                    {error}
                  </Text>
                ) : null}

                <View style={styles.resendRow}>
                  <Text style={styles.resendLabel}>Didn't receive it? </Text>
                  <TouchableOpacity
                    onPress={handleResend}
                    disabled={resendTimer > 0}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.resendBtn,
                        resendTimer > 0 && styles.resendBtnDisabled,
                      ]}
                    >
                      {resendTimer > 0
                        ? `Resend in ${resendTimer}s`
                        : "Resend OTP"}
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[
                    styles.actionBtn,
                    isLoading && styles.actionBtnDisabled,
                  ]}
                  onPress={handleVerifyOtp}
                  activeOpacity={0.85}
                  disabled={isLoading}
                >
                  <LinearGradient
                    colors={
                      isLoading
                        ? ["#9CA3AF", "#9CA3AF"]
                        : ["#1DB8A0", "#1A6FD4"]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.actionBtnGradient}
                  >
                    <Text style={styles.actionBtnText}>
                      {isLoading ? "Verifying..." : "Verify & Continue →"}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}

            <View style={styles.trustRow}>
              <View style={styles.trustItem}>
                <Text style={styles.trustIcon}>🔐</Text>
                <Text style={styles.trustText}>Secure</Text>
              </View>
              <View style={styles.trustDot} />
              <View style={styles.trustItem}>
                <Text style={styles.trustIcon}>✓</Text>
                <Text style={styles.trustText}>Verified Pros</Text>
              </View>
              <View style={styles.trustDot} />
              <View style={styles.trustItem}>
                <Text style={styles.trustIcon}>⚡</Text>
                <Text style={styles.trustText}>Fast Response</Text>
              </View>
            </View>
          </Animated.View>

          <View style={{ height: 24 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F4F6FA" },
  header: { paddingHorizontal: 24, paddingBottom: 48, paddingTop: 0 },
  headerContent: { paddingTop: 12 },
  heroTitle: {
    fontSize: 36,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -1,
    lineHeight: 42,
    marginBottom: 6,
  },
  heroSub: {
    fontSize: 14,
    color: "rgba(255,255,255,0.72)",
    fontWeight: "500",
    marginBottom: 20,
  },
  howStrip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.13)",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 4,
  },
  howItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  howNum: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#1DB8A0",
    color: "#fff",
    fontSize: 10,
    fontWeight: "900",
    textAlign: "center",
    lineHeight: 18,
  },
  howLabel: { fontSize: 12, fontWeight: "600", color: "rgba(255,255,255,0.8)" },
  howArrow: { paddingHorizontal: 2 },
  howArrowText: { color: "rgba(255,255,255,0.3)", fontSize: 18 },
  kav: { flex: 1, marginTop: -24 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 16, paddingTop: 0 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0B0F1A",
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  cardSub: {
    fontSize: 13,
    color: "#9CA3AF",
    fontWeight: "500",
    marginBottom: 22,
    lineHeight: 19,
  },
  fieldWrap: { marginBottom: 20 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FB",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#EAECF0",
    overflow: "hidden",
  },
  inputError: { borderColor: "#EF4444", backgroundColor: "#FFF5F5" },
  countryCode: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  flag: { fontSize: 18 },
  dialCode: { fontSize: 15, fontWeight: "700", color: "#0B0F1A" },
  dividerV: { width: 1, height: 24, backgroundColor: "#E5E7EB" },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#0B0F1A",
    fontWeight: "500",
    padding: 0,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    fontWeight: "500",
    marginTop: 7,
    marginLeft: 2,
  },
  otpRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
    justifyContent: "center",
  },
  otpBox: {
    width: 46,
    height: 56,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#EAECF0",
    backgroundColor: "#F8F9FB",
    fontSize: 22,
    fontWeight: "800",
    color: "#0B0F1A",
    textAlign: "center",
  },
  otpBoxFilled: { borderColor: "#1DB8A0", backgroundColor: "#F0FBF8" },
  otpBoxError: { borderColor: "#EF4444", backgroundColor: "#FFF5F5" },
  resendRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 4,
  },
  resendLabel: { fontSize: 13, color: "#9CA3AF", fontWeight: "500" },
  resendBtn: { fontSize: 13, color: "#1A6FD4", fontWeight: "700" },
  resendBtnDisabled: { color: "#C0C8D8" },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
    alignSelf: "flex-start",
    backgroundColor: "#F4F6FA",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  backArrow: { color: "#1A6FD4", fontSize: 15, fontWeight: "700" },
  backText: { color: "#1A6FD4", fontSize: 13, fontWeight: "600" },
  actionBtn: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#1DB8A0",
    shadowOpacity: 0.4,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
    marginBottom: 20,
  },
  actionBtnDisabled: { shadowOpacity: 0, elevation: 0 },
  actionBtnGradient: {
    paddingVertical: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  disclaimer: {
    fontSize: 11,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 17,
    marginBottom: 20,
    fontWeight: "500",
  },
  link: { color: "#1A6FD4", fontWeight: "600" },
  trustRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingTop: 4,
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
});
