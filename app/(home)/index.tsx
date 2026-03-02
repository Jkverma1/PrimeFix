import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AppButton from "../../components/AppButton";
import ServiceCard from "../../components/ServiceCard";
import { Spacing } from "../../constants/colors";
import { SERVICES } from "../../constants/services";
import { ServiceType } from "../../types";

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
      {/* ── GRADIENT HEADER ── */}
      <LinearGradient
        colors={["#1DB8A0", "#1A6FD4"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <SafeAreaView>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.appName}>PrimeFix</Text>
              <Text style={styles.appTagline}>Home Services · Done Right</Text>
            </View>
            <TouchableOpacity style={styles.bellBtn} activeOpacity={0.8}>
              <Text style={styles.bellIcon}>🔔</Text>
            </TouchableOpacity>
          </View>
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

      {/* ── BODY — NO negative marginTop so banner is always visible ── */}
      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── BANNER ── */}
        <LinearGradient
          colors={["#0d1a3a", "#1a3a6e"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.banner}
        >
          <View style={styles.bannerLeft}>
            <View style={styles.bannerSteps}>
              <View style={styles.bannerStep}>
                <Text style={styles.bannerStepNum}>1</Text>
                <Text style={styles.bannerStepText}>Pick</Text>
              </View>
              <View style={styles.bannerStepArrow}>
                <Text style={styles.bannerArrowText}>›</Text>
              </View>
              <View style={styles.bannerStep}>
                <Text style={styles.bannerStepNum}>2</Text>
                <Text style={styles.bannerStepText}>Book</Text>
              </View>
              <View style={styles.bannerStepArrow}>
                <Text style={styles.bannerArrowText}>›</Text>
              </View>
              <View style={styles.bannerStep}>
                <Text style={styles.bannerStepNum}>3</Text>
                <Text style={styles.bannerStepText}>Relax</Text>
              </View>
            </View>
            <Text style={styles.bannerHeadline}>
              Book in 60 seconds,{"\n"}we come to you.
            </Text>
            <Text style={styles.bannerSub}>
              Available 7 days · All areas covered
            </Text>
          </View>
          <View style={styles.bannerRight}>
            <Text style={styles.bannerEmoji}>🏠</Text>
            <Text style={styles.bannerEmojiSmall}>⚡</Text>
          </View>
        </LinearGradient>

        {/* ── SECTION TITLE ── */}
        <Text style={styles.sectionTitle}>Explore all services</Text>

        {/* ── SERVICE CARDS ── */}
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

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* ── FOOTER ── */}
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

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F4F6FA" },

  header: { paddingHorizontal: Spacing.xl, paddingBottom: 24, paddingTop: 8 },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    marginTop: 8,
  },
  appName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  appTagline: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "500",
    marginTop: 2,
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

  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    shadowColor: "#000",
    shadowOpacity: 0.1,
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

  // No negative marginTop — banner always starts visible
  body: { flex: 1, backgroundColor: "#F4F6FA" },
  bodyContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: 16,
    paddingBottom: 8,
  },

  banner: {
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 24,
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
  bannerSteps: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 2,
  },
  bannerStep: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 4,
  },
  bannerStepNum: { fontSize: 10, fontWeight: "900", color: "#1DB8A0" },
  bannerStepText: {
    fontSize: 10,
    fontWeight: "600",
    color: "rgba(255,255,255,0.7)",
  },
  bannerStepArrow: { paddingHorizontal: 2 },
  bannerArrowText: { color: "rgba(255,255,255,0.3)", fontSize: 14 },
  bannerHeadline: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "800",
    lineHeight: 25,
    marginBottom: 5,
    letterSpacing: -0.3,
  },
  bannerSub: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 11,
    fontWeight: "500",
  },
  bannerRight: {
    alignItems: "center",
    justifyContent: "center",
    width: 64,
    gap: 2,
  },
  bannerEmoji: { fontSize: 38 },
  bannerEmojiSmall: { fontSize: 18 },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1A1A2E",
    marginBottom: 14,
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
    marginTop: 14,
    fontWeight: "500",
  },
  hintBold: { fontWeight: "700", color: "#1A6FD4" },

  footer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: 12,
    paddingBottom: 8,
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
