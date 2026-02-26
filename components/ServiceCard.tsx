// components/ServiceCard.tsx

import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "../constants/colors";
import { Service } from "../types";

const CARD_WIDTH = (Dimensions.get("window").width - 48 - 12) / 2;

interface Props {
  service: Service;
  selected: boolean;
  onSelect: (id: Service["id"]) => void;
}

export default function ServiceCard({ service, selected, onSelect }: Props) {
  const isComingSoon = service.comingSoon;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        selected && styles.cardSelected,
        isComingSoon && styles.cardDim,
      ]}
      onPress={() => !isComingSoon && onSelect(service.id)}
      activeOpacity={isComingSoon ? 1 : 0.75}
    >
      {/* Selected checkmark — top right */}
      {selected && (
        <View style={styles.checkBadge}>
          <Text style={styles.checkText}>✓</Text>
        </View>
      )}

      {/* Icon */}
      <View style={[styles.iconWrap, selected && styles.iconWrapSelected]}>
        <Text style={[styles.icon, isComingSoon && styles.iconDim]}>
          {service.icon}
        </Text>
      </View>

      {/* Label */}
      <Text
        style={[
          styles.label,
          selected && styles.labelSelected,
          isComingSoon && styles.dimText,
        ]}
        numberOfLines={1}
      >
        {service.label}
      </Text>

      {/* Description */}
      <Text
        style={[styles.desc, isComingSoon && styles.dimText]}
        numberOfLines={2}
      >
        {service.description}
      </Text>

      {/* Price OR Coming Soon */}
      {isComingSoon ? (
        <View style={styles.comingSoonBadge}>
          <Text style={styles.comingSoonText}>Coming Soon</Text>
        </View>
      ) : (
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Starts at </Text>
          <Text
            style={[styles.priceValue, selected && styles.priceValueSelected]}
          >
            ₹{service.startingPrice}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#F0F0F5",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    position: "relative",
  },
  cardSelected: {
    borderColor: Colors.primary,
    backgroundColor: "#F0FAFE",
    shadowColor: Colors.primary,
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  cardDim: {
    opacity: 0.6,
  },

  /* Icon */
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F4F6FA",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    marginTop: 4,
  },
  iconWrapSelected: {
    backgroundColor: "#DDEFFA",
  },
  icon: { fontSize: 32 },
  iconDim: { opacity: 0.45 },

  /* Text */
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A2E",
    marginBottom: 3,
    textAlign: "center",
  },
  labelSelected: { color: Colors.primary },
  desc: {
    fontSize: 11,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 16,
    marginBottom: 10,
  },
  dimText: { color: "#C8CDD8" },

  /* Price row */
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    backgroundColor: "#F0FBF8",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 2,
  },
  priceLabel: {
    fontSize: 10,
    color: "#6B7280",
    fontWeight: "500",
  },
  priceValue: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1DB8A0", // teal — matches app gradient start
  },
  priceValueSelected: {
    color: Colors.primary,
  },

  /* Coming soon badge */
  comingSoonBadge: {
    backgroundColor: "#FFF7ED",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 2,
  },
  comingSoonText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#F59E0B",
    letterSpacing: 0.3,
  },

  /* Selected check */
  checkBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  checkText: { color: "#fff", fontSize: 11, fontWeight: "800" },
});
