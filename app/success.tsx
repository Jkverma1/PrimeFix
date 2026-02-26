// app/success.tsx  ← Success Screen

import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AppButton from "../components/AppButton";
import Colors, { Typography, Spacing, BorderRadius } from "../constants/colors";
import { CONTACT } from "../constants/services";

export default function SuccessScreen() {
  const router = useRouter();
  const { requestId, serviceType } = useLocalSearchParams<{
    requestId: string;
    serviceType: string;
  }>();

  const handleCall = () => {
    Linking.openURL(`tel:${CONTACT.phone}`).catch(() =>
      Alert.alert("Error", "Could not open the dialer."),
    );
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent("Hi! I just submitted a service request.");
    Linking.openURL(`https://wa.me/${CONTACT.whatsapp}?text=${msg}`).catch(() =>
      Alert.alert("Error", "WhatsApp is not installed."),
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.circle}>
          <Text style={styles.check}>✓</Text>
        </View>

        <Text style={styles.title}>Request Sent!</Text>
        <Text style={styles.subtitle}>
          Your request has been received.{"\n"}We'll contact you shortly.
        </Text>
        {requestId ? (
          <Text style={styles.requestInfo}>ID: {requestId}</Text>
        ) : null}

        <View style={styles.actions}>
          <AppButton
            title="📞  Call Us"
            onPress={handleCall}
            variant="success"
            style={styles.btn}
          />
          <AppButton
            title="💬  Message on WhatsApp"
            onPress={handleWhatsApp}
            variant="success"
            style={styles.btn}
          />
        </View>

        <Text style={styles.backLink} onPress={() => router.replace("/")}>
          ← Back to Home
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg.primary },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing['2xl'],
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.success,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing['2xl'],
    shadowColor: Colors.success,
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  check: {
    fontSize: 56,
    color: "#fff",
    fontWeight: Typography.weights.bold,
  },
  title: {
    fontSize: Typography.sizes['3xl'],
    fontWeight: Typography.weights.extrabold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: Typography.sizes.base,
    color: Colors.text.secondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: Spacing['2xl'],
    fontWeight: Typography.weights.medium,
  },
  requestInfo: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.tertiary,
    marginBottom: Spacing['2xl'],
    fontWeight: Typography.weights.medium,
  },
  actions: { width: "100%", gap: Spacing.md, marginBottom: Spacing.xl },
  btn: { width: "100%" },
  backLink: {
    marginTop: Spacing.xl,
    fontSize: Typography.sizes.base,
    color: Colors.primary,
    fontWeight: Typography.weights.semibold,
  },
});
