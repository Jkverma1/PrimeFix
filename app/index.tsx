// app/index.tsx

import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AppButton from "../components/AppButton";
import ServiceCard from "../components/ServiceCard";
import { Spacing } from "../constants/colors";
import { SERVICES } from "../constants/services";
import { ServiceType } from "../types";

export default function HomeScreen() {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState<ServiceType | null>(
    null,
  );
  const [query, setQuery] = useState("");

  const filtered = SERVICES.filter((s) =>
    s.label.toLowerCase().includes(query.toLowerCase()),
  );

  React.useEffect(() => {
    if (selectedService && !filtered.find((s) => s.id === selectedService)) {
      setSelectedService(null);
    }
  }, [query]);

  const handleContinue = () => {
    if (!selectedService) {
      Alert.alert(
        "Select a Service",
        "Please choose a service before continuing.",
      );
      return;
    }
    router.push({
      pathname: "/request",
      params: { serviceType: selectedService },
    });
  };

  return (
    <View style={styles.root}>
      {/* ── COLORED HEADER (teal→blue gradient, like UC's purple) ── */}
      <LinearGradient
        colors={["#1DB8A0", "#1A6FD4"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <SafeAreaView>
          {/* Top row: title + notification bell placeholder */}
          <View style={styles.headerTop}>
            <View style={styles.logoAndTitle}>
              <Image
                source={require("../assets/images/app_logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.appName}>PrimeFix</Text>
            </View>
            {/* Bell icon — simple placeholder, swap with vector icon later */}
            <TouchableOpacity style={styles.bellBtn} activeOpacity={0.8}>
              <Text style={styles.bellIcon}>🔔</Text>
            </TouchableOpacity>
          </View>

          {/* Search bar — white pill, inside header */}
          <View style={styles.searchWrap}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for 'Plumber', 'Electrician'..."
              placeholderTextColor="rgba(0,0,0,0.35)"
              value={query}
              onChangeText={setQuery}
              returnKeyType="search"
            />
            {query.length > 0 && (
              <TouchableOpacity
                onPress={() => setQuery("")}
                style={styles.clearBtn}
              >
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* ── WHITE BODY ── */}
      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Promo banner — overlaps header slightly */}
        <LinearGradient
          colors={["#0d1a3a", "#1a3a6e"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.banner}
        >
          <View style={styles.bannerLeft}>
            <View style={styles.bannerBadge}>
              <Text style={styles.bannerBadgeText}>LIMITED OFFER</Text>
            </View>
            <Text style={styles.bannerHeadline}>
              First booking at{"\n"}₹99 only →
            </Text>
            <Text style={styles.bannerSub}>* Valid for new customers</Text>
          </View>
          {/* Decorative right side — placeholder for illustration later */}
          <View style={styles.bannerRight}>
            <Text style={styles.bannerEmoji}>🔧</Text>
          </View>
        </LinearGradient>

        {/* Section title */}
        <Text style={styles.sectionTitle}>Explore all services</Text>

        {/* Service cards grid */}
        {filtered.length > 0 ? (
          <View style={styles.cardsGrid}>
            {filtered.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                selected={selectedService === service.id}
                onSelect={setSelectedService}
              />
            ))}
          </View>
        ) : (
          <Text style={styles.noResults}>No services found for "{query}"</Text>
        )}

        {selectedService && (
          <Text style={styles.hint}>
            Selected:{" "}
            <Text style={styles.hintBold}>
              {SERVICES.find((s) => s.id === selectedService)?.label}
            </Text>
          </Text>
        )}

        {/* Bottom padding so content clears the footer */}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* ── STICKY FOOTER BUTTON ── */}
      <View style={styles.footer}>
        <AppButton
          title="Request Service"
          onPress={handleContinue}
          disabled={!selectedService}
        />
      </View>
    </View>
  );
}

const HEADER_GRADIENT_H = 180; // height of the colored header section

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F4F6FA",
  },

  /* ── HEADER ── */
  header: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 28,
    paddingTop: 8,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 8,
  },
  logoAndTitle: {
    alignItems: "center",
    flexDirection: "row",
    width: 110,
    gap: 8,
    height: 50,
  },
  appName: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  appTagline: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "500",
    marginTop: 2,
    letterSpacing: 0.3,
  },
  logoContainer: {
    width: 50,
    height: 50,
  },
  logo: {
    width: 50,
    height: "100%",
  },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  bellIcon: { fontSize: 18 },

  /* ── SEARCH BAR ── */
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#1A1A2E",
    fontWeight: "500",
    padding: 0,
  },
  clearBtn: { padding: 4 },
  clearIcon: { fontSize: 12, color: "#9CA3AF" },

  /* ── BODY ── */
  body: {
    flex: 1,
    marginTop: -16, // pull body up to overlap header bottom edge
  },
  bodyContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: 0,
  },

  /* ── PROMO BANNER ── */
  banner: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 28,
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  bannerLeft: { flex: 1 },
  bannerBadge: {
    backgroundColor: "#1DB8A0",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    marginBottom: 10,
  },
  bannerBadgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  bannerHeadline: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    lineHeight: 28,
    marginBottom: 6,
  },
  bannerSub: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 11,
    fontWeight: "500",
  },
  bannerRight: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 40,
  },
  bannerEmoji: { fontSize: 40 },

  /* ── SERVICES ── */
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A2E",
    marginBottom: 16,
    letterSpacing: -0.2,
  },
  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  noResults: {
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 14,
    marginVertical: 32,
  },
  hint: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 13,
    marginTop: 16,
    fontWeight: "500",
  },
  hintBold: { fontWeight: "700", color: "#1A6FD4" },

  /* ── FOOTER ── */
  footer: {
    padding: Spacing.lg,
    paddingBottom: 32,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    elevation: 4,
  },
});
