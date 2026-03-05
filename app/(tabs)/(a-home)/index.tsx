// app/(tabs)/(a-home)/index.tsx

import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AppButton from "../../../components/AppButton";
import OnboardingModal from "../../../components/OnboardingModal";
import { Spacing } from "../../../constants/colors";
import { useBootstrap } from "../../../hooks/useBootstrap";
import { supabase } from "../../../lib/supabase";
import { useNotificationStore } from "../../../store/NotificationStore";
import { CARD_COLORS } from "@/types/colors.type";

interface Service {
  id: string;
  slug: string;
  label: string;
  icon: string;
  description: string;
  starting_price: number;
  is_active: boolean;
  sort_order: number;
}

function ServiceCard({
  service,
  colorPair,
  selected,
  onSelect,
}: {
  service: Service;
  colorPair: string[];
  selected: boolean;
  onSelect: (slug: string) => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.94,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
    onSelect(service.slug);
  };

  return (
    <Animated.View style={{ transform: [{ scale }], width: "48%" }}>
      <TouchableOpacity
        style={[
          styles.serviceCard,
          { backgroundColor: colorPair[0] },
          selected && styles.serviceCardSelected,
          selected && { borderColor: colorPair[1] },
        ]}
        onPress={handlePress}
        activeOpacity={1}
      >
        {/* Selected check */}
        {selected && (
          <View style={[styles.checkBadge, { backgroundColor: colorPair[1] }]}>
            <Text style={styles.checkBadgeText}>✓</Text>
          </View>
        )}

        {/* Icon circle */}
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: selected ? colorPair[1] + "22" : "#fff" },
          ]}
        >
          <Text style={styles.serviceEmoji}>{service.icon}</Text>
        </View>

        {/* Label + subtitle */}
        <Text
          style={[styles.serviceLabel, selected && { color: colorPair[1] }]}
        >
          {service.label}
        </Text>
        {service.description ? (
          <Text style={styles.serviceDesc} numberOfLines={2}>
            {service.description}
          </Text>
        ) : null}

        {/* Price pill */}
        <View
          style={[
            styles.pricePill,
            { backgroundColor: selected ? colorPair[1] : "#fff" },
          ]}
        >
          <Text
            style={[
              styles.priceText,
              { color: selected ? "#fff" : colorPair[1] },
            ]}
          >
            from ₹{service.starting_price}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

function ComingSoonCard({
  service,
  colorPair,
}: {
  service: Service;
  colorPair: string[];
}) {
  return (
    <View style={[styles.comingSoonCard, { backgroundColor: colorPair[0] }]}>
      <View style={styles.soonBanner}>
        <Text style={styles.soonBannerText}>SOON</Text>
      </View>
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: "rgba(255,255,255,0.6)" },
        ]}
      >
        <Text style={[styles.serviceEmoji, { opacity: 0.45 }]}>
          {service.icon}
        </Text>
      </View>
      <Text style={styles.comingSoonLabel}>{service.label}</Text>
      {service.description ? (
        <Text style={styles.comingSoonDesc} numberOfLines={2}>
          {service.description}
        </Text>
      ) : null}
    </View>
  );
}

export default function HomeScreen() {
  useBootstrap();
  const router = useRouter();
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  const [services, setServices] = useState<Service[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchServices = async () => {
    const { data } = await supabase
      .from("services")
      .select("*")
      .order("sort_order");
    setServices(data ?? []);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Clear selection if filtered out
  useEffect(() => {
    if (selectedSlug && !activeServices.find((s) => s.slug === selectedSlug)) {
      setSelectedSlug(null);
    }
  }, [query]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchServices();
    setRefreshing(false);
  };

  const activeServices = services.filter(
    (s) => s.is_active && s.label.toLowerCase().includes(query.toLowerCase()),
  );
  const comingSoonServices = services.filter(
    (s) => !s.is_active && s.label.toLowerCase().includes(query.toLowerCase()),
  );

  const handleSelect = (slug: string) => {
    setSelectedSlug((prev) => (prev === slug ? null : slug));
  };

  const handleContinue = () => {
    if (!selectedSlug) {
      Alert.alert(
        "Select a Service",
        "Please choose a service before continuing.",
      );
      return;
    }
    router.push({
      pathname: "/request",
      params: { serviceType: selectedSlug },
    });
  };

  const selectedService = services.find((s) => s.slug === selectedSlug);

  return (
    <View style={styles.root}>
      <OnboardingModal />

      {/* ── HEADER ── */}
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
            <TouchableOpacity
              style={styles.bellBtn}
              onPress={() => router.push("../../(shared)/notifications")}
              activeOpacity={0.8}
            >
              <Text style={styles.bellIcon}>🔔</Text>
              {unreadCount > 0 && (
                <View style={styles.bellBadge}>
                  <Text style={styles.bellBadgeText}>
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Text>
                </View>
              )}
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

      {/* ── BODY ── */}
      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#1DB8A0"
          />
        }
      >
        {/* Banner */}
        <LinearGradient
          colors={["#0d1a3a", "#1a3a6e"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.banner}
        >
          <View style={styles.bannerLeft}>
            <View style={styles.bannerSteps}>
              {[
                ["1", "Pick"],
                ["2", "Book"],
                ["3", "Relax"],
              ].map(([num, label], i) => (
                <React.Fragment key={label}>
                  {i > 0 && (
                    <View style={styles.bannerStepArrow}>
                      <Text style={styles.bannerArrowText}>›</Text>
                    </View>
                  )}
                  <View style={styles.bannerStep}>
                    <Text style={styles.bannerStepNum}>{num}</Text>
                    <Text style={styles.bannerStepText}>{label}</Text>
                  </View>
                </React.Fragment>
              ))}
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

        {/* ── ACTIVE SERVICES ── */}
        {activeServices.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Our Services</Text>
            <View style={styles.cardsGrid}>
              {activeServices.map((service, idx) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  colorPair={CARD_COLORS[idx % CARD_COLORS.length]}
                  selected={selectedSlug === service.slug}
                  onSelect={handleSelect}
                />
              ))}
            </View>
          </>
        )}

        {/* ── COMING SOON ── */}
        {comingSoonServices.length > 0 && (
          <>
            <View style={styles.comingSoonHeader}>
              <Text style={styles.sectionTitle}>Coming Soon</Text>
              <View style={styles.soonChip}>
                <Text style={styles.soonChipText}>🚀 Launching soon</Text>
              </View>
            </View>
            <View style={styles.cardsGrid}>
              {comingSoonServices.map((service, idx) => (
                <ComingSoonCard
                  key={service.id}
                  service={service}
                  colorPair={
                    CARD_COLORS[
                      (activeServices.length + idx) % CARD_COLORS.length
                    ]
                  }
                />
              ))}
            </View>
          </>
        )}

        {activeServices.length === 0 && comingSoonServices.length === 0 && (
          <Text style={styles.noResults}>No services found for "{query}"</Text>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* ── FOOTER ── */}
      <View style={styles.footer}>
        <AppButton
          title={
            selectedService
              ? `Book ${selectedService.label}  →`
              : "Select a Service"
          }
          onPress={handleContinue}
          disabled={!selectedSlug}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F4F6FA" },

  // Header
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
  bellBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: "rgba(29,184,160,0.9)",
  },
  bellBadgeText: { color: "#fff", fontSize: 9, fontWeight: "900" },
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

  // Body
  body: { flex: 1, backgroundColor: "#F4F6FA" },
  bodyContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: 16,
    paddingBottom: 8,
  },

  // Banner
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

  // Section
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1A1A2E",
    marginBottom: 14,
    letterSpacing: -0.2,
  },
  noResults: {
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 14,
    marginVertical: 32,
  },
  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },

  // Active service card
  serviceCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    gap: 8,
  },
  serviceCardSelected: {
    borderWidth: 2,
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 6,
  },
  checkBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  checkBadgeText: { color: "#fff", fontSize: 12, fontWeight: "900" },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  serviceEmoji: { fontSize: 28 },
  serviceLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0B0F1A",
    letterSpacing: -0.2,
  },
  serviceDesc: {
    fontSize: 11,
    color: "#9CA3AF",
    fontWeight: "500",
    lineHeight: 15,
  },
  pricePill: {
    alignSelf: "flex-start",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 2,
  },
  priceText: { fontSize: 11, fontWeight: "700" },

  // Coming soon card
  comingSoonHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  soonChip: {
    backgroundColor: "#FFF7ED",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  soonChipText: { fontSize: 11, color: "#F59E0B", fontWeight: "700" },
  comingSoonCard: {
    width: "48%",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "rgba(0,0,0,0.05)",
    gap: 8,
    opacity: 0.6,
  },
  soonBanner: {
    position: "absolute",
    top: 12,
    right: -1,
    backgroundColor: "#F59E0B",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  soonBannerText: {
    fontSize: 9,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 1,
  },
  comingSoonLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: "#9CA3AF",
    letterSpacing: -0.2,
  },
  comingSoonDesc: {
    fontSize: 11,
    color: "#C0C8D8",
    fontWeight: "500",
    lineHeight: 15,
  },

  // Footer
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
