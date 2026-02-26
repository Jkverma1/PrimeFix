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
        styles.wrapperShadow,
        selected && styles.selectedShadow,
        pressed && !disabled && styles.pressed,
        disabled && styles.cardDisabled,
      ]}
    >
      <LinearGradient
        // unselected (active but not chosen) cards are plain white
        colors={
          disabled
            ? ["#f7f7f7", "#e2e2e2"]
            : selected
              ? [Colors.success, Colors.primary]
              : ["#ffffff", "#ffffff"]
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
            disabled
              ? styles.labelDisabled
              : selected
                ? styles.labelWhite
                : styles.labelPrimary,
          ]}
        >
          {service.label}
        </Text>
        <Text
          style={[
            styles.desc,
            selected && styles.descSelected,
            disabled && { color: Colors.text.primary },
            !selected && !disabled && styles.descInactive,
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
  // outer container holds the shadow; gradients inside are not reliable
  wrapperShadow: {
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  selectedShadow: {
    // stronger lift when card is selected
    shadowColor: Colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
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
    // slightly stronger shadow so unselected cards lift off the page
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
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
  labelPrimary: {
    color: Colors.text.primary,
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
  descInactive: {
    color: Colors.text.primary,
  },
  coming: {
    marginTop: Spacing.sm,
    fontSize: Typography.sizes.xs,
    color: Colors.warning,
    fontWeight: Typography.weights.semibold,
  },
  cardDisabled: {
    opacity: 0.5,
    // add a similar shadow so coming‑soon cards still feel like a card
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
});
