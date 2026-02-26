// app/index.tsx  ← This is your Home Screen in Expo Router

import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AppButton from "../components/AppButton";
import ServiceCard from "../components/ServiceCard";
import Colors, { Spacing, Typography } from "../constants/colors";
import { SERVICES } from "../constants/services";
import { ServiceType } from "../types";

export default function HomeScreen() {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState<ServiceType | null>(
    null,
  );

  const handleContinue = () => {
    if (!selectedService) {
      Alert.alert(
        "Select a Service",
        "Please choose a service before continuing.",
      );
      return;
    }
    // Pass serviceType as a query param
    router.push({
      pathname: "/request",
      params: { serviceType: selectedService },
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <MaskedView
            maskElement={
              <Text style={[styles.title, { backgroundColor: "transparent" }]}>
                Book a Service
              </Text>
            }
          >
            <LinearGradient
              colors={[Colors.primary, Colors.success]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={[styles.title, { opacity: 0 }]}>Book a Service</Text>
            </LinearGradient>
          </MaskedView>
          <Text style={styles.subtitle}>Choose a service below.</Text>
        </View>

        <View style={styles.cardsRow}>
          {SERVICES.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              selected={selectedService === service.id}
              onSelect={setSelectedService}
            />
          ))}
        </View>

        {selectedService && (
          <Text style={styles.hint}>
            Selected:{" "}
            <Text style={styles.hintBold}>
              {SERVICES.find((s) => s.id === selectedService)?.label}
            </Text>
          </Text>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <AppButton
          title="Request Service"
          onPress={handleContinue}
          disabled={!selectedService}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg.primary },
  scroll: { padding: Spacing.xl, paddingTop: Spacing.lg, flexGrow: 1 },
  header: {
    alignItems: "center",
    marginBottom: Spacing["3xl"],
    marginTop: Spacing.md,
  },
  title: {
    fontSize: Typography.sizes["3xl"],
    fontWeight: Typography.weights.extrabold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
    letterSpacing: -0.5,
    // baseline for masked gradient
  },
  subtitle: {
    fontSize: Typography.sizes.base,
    color: Colors.text.secondary,
    fontWeight: Typography.weights.medium,
  },
  cardsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  hint: {
    textAlign: "center",
    color: Colors.text.secondary,
    fontSize: Typography.sizes.sm,
    marginTop: Spacing.lg,
    fontWeight: Typography.weights.medium,
  },
  hintBold: { fontWeight: Typography.weights.bold, color: Colors.primary },
  footer: {
    padding: Spacing.lg,
    paddingBottom: Spacing["2xl"],
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
