// components/ServiceCard.tsx

import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
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
    <TouchableOpacity
      style={[
        styles.card,
        selected && styles.cardSelected,
        disabled && styles.cardDisabled,
      ]}
      onPress={() => !disabled && onSelect(service.id)}
      activeOpacity={disabled ? 1 : 0.7}
    >
      <Text style={styles.icon}>{service.icon}</Text>
      <Text style={[styles.label, selected && styles.labelSelected]}>
        {service.label}
      </Text>
      <Text style={styles.desc}>{service.description}</Text>
      {disabled && <Text style={styles.coming}>Coming Soon</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: Colors.bg.secondary,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    marginBottom: Spacing.md,
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
  },
  label: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  labelSelected: {
    color: Colors.primary,
  },
  desc: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.tertiary,
    textAlign: "center",
    lineHeight: 16,
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
});
