// app/request.tsx  ← Service Request Screen

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
  View,
} from "react-native";
import AppButton from "../components/AppButton";
import AppInput from "../components/AppInput";
import Colors, { Typography, Spacing, BorderRadius } from "../constants/colors";
import { SERVICES } from "../constants/services";
import { useServiceRequest } from "../hooks/useServiceRequest";
import { ServiceType } from "../types";

export default function RequestScreen() {
  const router = useRouter();
  const { serviceType } = useLocalSearchParams<{ serviceType: ServiceType }>();
  const serviceName =
    SERVICES.find((s) => s.id === serviceType)?.label ?? serviceType;

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
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.tag}>{serviceName} Request</Text>

          {submitError ? (
            <Text style={styles.submitError}>{submitError}</Text>
          ) : null}
          <AppInput
            label="Your Name"
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
            error={errors.name}
            autoCapitalize="words"
          />
          <AppInput
            label="Phone Number"
            placeholder="Your phone number"
            value={phone}
            onChangeText={setPhone}
            error={errors.phone}
            keyboardType="phone-pad"
            maxLength={10}
          />
          <AppInput
            label="Address"
            placeholder="Your address"
            value={address}
            onChangeText={setAddress}
            error={errors.address}
          />
          <AppInput
            label="Describe the Issue"
            placeholder="Briefly describe the problem..."
            value={issue}
            onChangeText={setIssue}
            error={errors.issue}
            multiline
            numberOfLines={4}
            style={styles.textarea}
          />
        </ScrollView>

        <View style={styles.footer}>
          <AppButton
            title="Submit Request"
            onPress={handleSubmit}
            loading={isLoading}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg.primary },
  scroll: { padding: Spacing.xl, paddingBottom: Spacing.sm },
  tag: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
    backgroundColor: Colors.primaryLight,
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.xl,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  textarea: { height: 100, textAlignVertical: "top", paddingTop: Spacing.md },
  submitError: {
    color: Colors.error,
    textAlign: "center",
    marginBottom: Spacing.lg,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
  },
  footer: {
    padding: Spacing.lg,
    paddingBottom: Spacing['2xl'],
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.bg.primary,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    elevation: 4,
  },
});
