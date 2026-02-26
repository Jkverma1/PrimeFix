// components/AppButton.tsx

import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import Colors, { BorderRadius, Spacing, Typography } from "../constants/colors";

interface Props {
  title: string;
  onPress: () => void;
  variant?: "primary" | "success" | "outline";
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export default function AppButton({
  title,
  onPress,
  variant = "primary",
  loading,
  disabled,
  style,
}: Props) {
  return (
    <TouchableOpacity
      style={[styles.btn, (disabled || loading) && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
    >
      <LinearGradient
        colors={
          variant === "success"
            ? [Colors.success, Colors.primary]
            : variant === "primary"
              ? [Colors.primaryDark, Colors.primary]
              : ["transparent", "transparent"]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[StyleSheet.absoluteFill, styles.gradient]}
      />
      {loading ? (
        <ActivityIndicator
          color={variant === "outline" ? Colors.primary : "#fff"}
        />
      ) : (
        <Text
          style={[
            styles.text,
            variant === "outline" && styles.textOutline,
            disabled && styles.textDisabled,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  primary: {
    backgroundColor: Colors.primary,
  },
  success: {
    backgroundColor: Colors.success,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: Colors.primary,
    shadowOpacity: 0,
    elevation: 0,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: "#fff",
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.3,
  },
  textOutline: {
    color: Colors.primary,
  },
  textDisabled: {
    color: Colors.text.light,
  },
  gradient: {
    borderRadius: BorderRadius.lg,
  },
});
