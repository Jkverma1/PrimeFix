// components/ServiceCard.tsx

import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import Colors, { BorderRadius, Spacing, Typography } from "../constants/colors";
import { Service } from "../types";

interface Props {
  service: Service;
  selected: boolean;
  onSelect: (id: Service["id"]) => void;
}

export default function ServiceCard({ service, selected, onSelect }: Props) {
  const disabled = service.comingSoon;
  return (
    <Pressable
      onPress={() => !disabled && onSelect(service.id)}
      style={({ pressed }) => [
        styles.wrapper,
        pressed && !disabled && styles.pressed,
        disabled && styles.cardDisabled,
      ]}
    >
      <LinearGradient
        colors={
          disabled
            ? ["#f7f7f7", "#e2e2e2"]
            : selected
              ? [Colors.success, Colors.primary]
              : ["rgba(0,0,0,0.1)", "rgba(0,0,0,0.3)"]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.card,
          selected && styles.cardSelected,
          disabled && styles.cardDisabled,
        ]}
      >
        <Text style={[styles.icon, disabled && styles.iconDisabled]}>
          {" "}
          {service.icon}
        </Text>
        <Text
          style={[
            styles.label,
            disabled ? styles.labelDisabled : styles.labelWhite,
          ]}
        >
          {service.label}
        </Text>
        <Text
          style={[
            styles.desc,
            selected && styles.descSelected,
            disabled && { color: Colors.text.primary },
          ]}
        >
          {service.description}
        </Text>
        {disabled && <Text style={styles.coming}>Coming Soon</Text>}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "48%",
    marginBottom: Spacing.md,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.bg.secondary,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    minHeight: 140,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },

  cardSelected: {
    borderColor: Colors.primary,
    borderWidth: 2,
    backgroundColor: Colors.primaryLight,
    shadowColor: Colors.primary,
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  icon: {
    fontSize: 44,
    marginBottom: Spacing.md,
    color: Colors.text.white,
  },
  iconDisabled: {
    color: Colors.text.secondary,
  },
  label: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.sm,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.15)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  labelWhite: {
    color: Colors.text.white,
  },
  labelDisabled: {
    color: Colors.text.primary,
  },
  desc: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.white,
    textAlign: "center",
    lineHeight: 16,
  },
  descSelected: {
    color: Colors.text.white,
  },
  coming: {
    marginTop: Spacing.sm,
    fontSize: Typography.sizes.xs,
    color: Colors.warning,
    fontWeight: Typography.weights.semibold,
  },
  cardDisabled: {
    opacity: 0.5,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
});
