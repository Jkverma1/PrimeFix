// app/(tabs)/(d-account)/profile.tsx

import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import { Spacing } from "../../../constants/colors";
import { useUserStore } from "../../../store/UserStore";

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, isLoading, updateProfile } = useUserStore();
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile?.full_name) setName(profile.full_name);
  }, [profile]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Required", "Please enter your name.");
      return;
    }
    setIsSaving(true);
    try {
      await updateProfile({ full_name: name.trim() });
      Alert.alert("Saved!", "Your profile has been updated.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert("Error", "Could not save profile. Please try again.");
    } finally {
      setIsSaving(false);
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
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Profile</Text>
            <View style={{ width: 36 }} />
          </View>

          {/* Avatar */}
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {name ? name.charAt(0).toUpperCase() : "👤"}
              </Text>
            </View>
            <Text style={styles.avatarHint}>Tap fields below to update</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.bodyContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Personal Information</Text>
            <Text style={styles.cardSub}>
              This name will be shown on your bookings.
            </Text>

            {/* Name field */}
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
                placeholderTextColor="#B0B8C8"
                autoCapitalize="words"
                returnKeyType="done"
              />
            </View>

            {/* Phone — read only */}
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Phone Number</Text>
              <View style={styles.inputReadOnly}>
                <Text style={styles.inputReadOnlyText}>
                  {profile?.phone
                    ? `+91 ${profile.phone.replace("+91", "").slice(-10)}`
                    : "Loading..."}
                </Text>
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>✓ Verified</Text>
                </View>
              </View>
              <Text style={styles.fieldHint}>
                Phone number cannot be changed.
              </Text>
            </View>

            {/* Referral code — read only */}
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Your Referral Code</Text>
              <View style={styles.inputReadOnly}>
                <Text
                  style={[
                    styles.inputReadOnlyText,
                    { letterSpacing: 2, fontWeight: "900" },
                  ]}
                >
                  {profile?.referral_code ?? "Loading..."}
                </Text>
              </View>
              <Text style={styles.fieldHint}>
                Share this code to earn ₹75 per referral.
              </Text>
            </View>
          </View>

          {/* Save button */}
          <TouchableOpacity
            style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]}
            onPress={handleSave}
            activeOpacity={0.85}
            disabled={isSaving}
          >
            <LinearGradient
              colors={
                isSaving ? ["#9CA3AF", "#9CA3AF"] : ["#1DB8A0", "#1A6FD4"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.saveBtnGrad}
            >
              {isSaving ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.saveBtnText}>Save Changes</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View style={{ height: 20 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F4F6FA" },
  header: { paddingHorizontal: Spacing.xl, paddingBottom: 24, paddingTop: 8 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 20,
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
  avatarWrap: { alignItems: "center", paddingBottom: 8 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.5)",
    marginBottom: 10,
  },
  avatarText: { fontSize: 32, fontWeight: "800", color: "#fff" },
  avatarHint: {
    fontSize: 12,
    color: "rgba(255,255,255,0.65)",
    fontWeight: "500",
  },
  body: { flex: 1 },
  bodyContent: { padding: Spacing.xl },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: Spacing.xl,
    marginBottom: 20,
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
    fontSize: 13,
    color: "#9CA3AF",
    fontWeight: "500",
    marginBottom: 22,
    lineHeight: 18,
  },
  fieldWrap: { marginBottom: 18 },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: 8,
    letterSpacing: 0.5,
    textTransform: "uppercase",
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
  inputReadOnly: {
    backgroundColor: "#F4F6FA",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#EAECF0",
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputReadOnlyText: { fontSize: 15, color: "#6B7280", fontWeight: "600" },
  verifiedBadge: {
    backgroundColor: "#F0FBF8",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  verifiedText: { fontSize: 11, color: "#1DB8A0", fontWeight: "700" },
  fieldHint: {
    fontSize: 11,
    color: "#C0C8D8",
    fontWeight: "500",
    marginTop: 6,
    marginLeft: 2,
  },
  saveBtn: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#1DB8A0",
    shadowOpacity: 0.4,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  saveBtnDisabled: { shadowOpacity: 0, elevation: 0 },
  saveBtnGrad: {
    paddingVertical: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
});
