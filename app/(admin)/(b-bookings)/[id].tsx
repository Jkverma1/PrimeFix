// app/(admin)/(b-bookings)/[id].tsx

import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../../../lib/supabase";
import { STATUS_COLOR, STATUS_LABEL } from "../../../types/colors.type";

const STATUSES = [
  "pending",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
] as const;
type BookingStatus = (typeof STATUSES)[number];
import { BookingDetail } from "@/types/customer.type";

export default function BookingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Editable fields
  const [status, setStatus] = useState<BookingStatus>("pending");
  const [quotedPrice, setQuotedPrice] = useState("");
  const [finalPrice, setFinalPrice] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("bookings")
        .select("*, services(label, icon), profiles(phone, full_name)")
        .eq("id", id)
        .single();
      if (data) {
        const b = data as BookingDetail;
        setBooking(b);
        setStatus(b.status);
        setQuotedPrice(b.quoted_price?.toString() ?? "");
        setFinalPrice(b.final_price?.toString() ?? "");
        setAdminNotes(b.admin_notes ?? "");
        setScheduledAt(
          b.scheduled_at
            ? new Date(b.scheduled_at).toLocaleString("en-IN")
            : "",
        );
      }
      setIsLoading(false);
    };
    load();
  }, [id]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("bookings")
        .update({
          status,
          quoted_price: quotedPrice ? parseFloat(quotedPrice) : null,
          final_price: finalPrice ? parseFloat(finalPrice) : null,
          admin_notes: adminNotes || null,
        })
        .eq("id", id);

      if (error) throw error;
      Alert.alert("Saved", "Booking updated successfully.");
      router.back();
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !booking) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color="#1DB8A0" />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <LinearGradient colors={["#0B0F1A", "#1a2744"]} style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle}>
                {booking.services?.icon} {booking.services?.label}
              </Text>
              <Text style={styles.headerSub}>
                #{id?.slice(0, 8).toUpperCase()}
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.bodyContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Customer info */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Customer Info</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.infoValue}>{booking.customer_name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={[styles.infoValue, { color: "#1A6FD4" }]}>
                {booking.customer_phone}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoValue}>{booking.address}</Text>
            </View>
            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.infoLabel}>Issue</Text>
              <Text style={styles.infoValue}>{booking.issue}</Text>
            </View>
          </View>

          {/* Status selector */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Update Status</Text>
            <View style={styles.statusGrid}>
              {STATUSES.map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.statusOption,
                    status === s && {
                      borderColor: STATUS_COLOR[s],
                      backgroundColor: STATUS_COLOR[s] + "18",
                    },
                  ]}
                  onPress={() => setStatus(s)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.statusOptionText,
                      status === s && {
                        color: STATUS_COLOR[s],
                        fontWeight: "800",
                      },
                    ]}
                  >
                    {STATUS_LABEL[s]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Pricing */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Pricing</Text>
            <Text style={styles.fieldLabel}>Quoted Price (₹)</Text>
            <TextInput
              style={styles.input}
              value={quotedPrice}
              onChangeText={setQuotedPrice}
              placeholder="e.g. 499"
              placeholderTextColor="#B0B8C8"
              keyboardType="numeric"
            />
            <Text style={styles.fieldLabel}>Final Price (₹)</Text>
            <TextInput
              style={styles.input}
              value={finalPrice}
              onChangeText={setFinalPrice}
              placeholder="e.g. 599"
              placeholderTextColor="#B0B8C8"
              keyboardType="numeric"
            />
          </View>

          {/* Admin notes */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Admin Notes</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              value={adminNotes}
              onChangeText={setAdminNotes}
              placeholder="Internal notes, pro assignment, etc..."
              placeholderTextColor="#B0B8C8"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Save button */}
          <TouchableOpacity
            style={[styles.saveBtn, isSaving && { opacity: 0.7 }]}
            onPress={handleSave}
            disabled={isSaving}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={["#1DB8A0", "#1A6FD4"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.saveBtnGrad}
            >
              {isSaving ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.saveBtnText}>Save Changes</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View style={{ height: 24 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F4F6FA" },
  loadingWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: { paddingHorizontal: 24, paddingBottom: 20, paddingTop: 8 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: { color: "#fff", fontSize: 18, fontWeight: "700" },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.45)",
    fontWeight: "600",
    marginTop: 2,
  },
  body: { flex: 1 },
  bodyContent: { padding: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0B0F1A",
    marginBottom: 14,
    letterSpacing: 0.2,
  },
  infoRow: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  infoLabel: { width: 70, fontSize: 12, fontWeight: "700", color: "#9CA3AF" },
  infoValue: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: "#0B0F1A",
    lineHeight: 18,
  },
  statusGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  statusOption: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#EAECF0",
    backgroundColor: "#F8F9FB",
  },
  statusOptionText: { fontSize: 13, fontWeight: "600", color: "#9CA3AF" },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: 8,
    marginTop: 4,
  },
  input: {
    backgroundColor: "#F8F9FB",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#EAECF0",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#0B0F1A",
    fontWeight: "500",
    marginBottom: 12,
  },
  textarea: { height: 100, textAlignVertical: "top" },
  saveBtn: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#1DB8A0",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  saveBtnGrad: { paddingVertical: 17, alignItems: "center" },
  saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "800" },
});
