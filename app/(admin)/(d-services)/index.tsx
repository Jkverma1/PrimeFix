// app/(admin)/(d-services)/index.tsx

import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../../../lib/supabase";
import { Service } from "@/types/customer.type";

const COMMON_EMOJIS = [
  "⚡",
  "🔧",
  "🪚",
  "🛠️",
  "❄️",
  "🎨",
  "🧹",
  "🐜",
  "🏠",
  "🛋️",
  "📐",
  "🧰",
  "📱",
  "🚿",
  "🔌",
  "🪣",
  "🏗️",
  "🌿",
];

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Add form state
  const [newLabel, setNewLabel] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newIcon, setNewIcon] = useState("🔧");
  const [newPrice, setNewPrice] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("services")
      .select("*")
      .order("sort_order");
    setServices((data as Service[]) ?? []);
    setIsLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    load();
  }, []);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load();
  }, []);

  const toggleActive = async (service: Service) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === service.id ? { ...s, is_active: !s.is_active } : s,
      ),
    );
    const { error } = await supabase
      .from("services")
      .update({ is_active: !service.is_active })
      .eq("id", service.id);
    if (error) {
      setServices((prev) =>
        prev.map((s) =>
          s.id === service.id ? { ...s, is_active: service.is_active } : s,
        ),
      );
      Alert.alert("Error", "Could not update service.");
    }
  };

  const savePrice = async (service: Service) => {
    const price = parseFloat(editPrice);
    if (isNaN(price) || price < 0) {
      Alert.alert("Invalid", "Enter a valid price.");
      return;
    }
    setSavingId(service.id);
    const { error } = await supabase
      .from("services")
      .update({ starting_price: price })
      .eq("id", service.id);
    if (error) {
      Alert.alert("Error", "Could not update price.");
    } else {
      setServices((prev) =>
        prev.map((s) =>
          s.id === service.id ? { ...s, starting_price: price } : s,
        ),
      );
      setEditingPriceId(null);
    }
    setSavingId(null);
  };

  const handleDelete = (service: Service) => {
    Alert.alert(
      "Delete Service",
      `Are you sure you want to permanently delete "${service.label}"? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase
              .from("services")
              .delete()
              .eq("id", service.id);
            if (error) {
              Alert.alert(
                "Error",
                "Could not delete. Make sure no bookings reference this service.",
              );
            } else {
              setServices((prev) => prev.filter((s) => s.id !== service.id));
            }
          },
        },
      ],
    );
  };

  const resetAddForm = () => {
    setNewLabel("");
    setNewSlug("");
    setNewDesc("");
    setNewIcon("🔧");
    setNewPrice("");
  };

  const handleAdd = async () => {
    if (!newLabel.trim()) {
      Alert.alert("Required", "Service name is required.");
      return;
    }
    if (!newPrice.trim() || isNaN(parseFloat(newPrice))) {
      Alert.alert("Required", "Enter a valid starting price.");
      return;
    }

    const slug =
      newSlug.trim() ||
      newLabel
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_]/g, "");
    const maxOrder = Math.max(...services.map((s) => s.sort_order), 0);

    setIsAdding(true);
    const { data, error } = await supabase
      .from("services")
      .insert({
        slug,
        label: newLabel.trim(),
        description: newDesc.trim() || null,
        icon: newIcon,
        starting_price: parseFloat(newPrice),
        is_active: false, // starts as Coming Soon — admin enables when ready
        sort_order: maxOrder + 1,
      })
      .select()
      .single();

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      setServices((prev) => [...prev, data as Service]);
      setShowAddModal(false);
      resetAddForm();
    }
    setIsAdding(false);
  };

  const activeCount = services.filter((s) => s.is_active).length;
  const inactiveCount = services.filter((s) => !s.is_active).length;

  if (isLoading) {
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
            <View>
              <Text style={styles.headerLabel}>ADMIN PANEL</Text>
              <Text style={styles.headerTitle}>Services</Text>
            </View>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => setShowAddModal(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.addBtnText}>+ Add</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.headerStats}>
            <View style={styles.headerStat}>
              <Text style={styles.headerStatValue}>{activeCount}</Text>
              <Text style={styles.headerStatLabel}>Active</Text>
            </View>
            <View style={styles.headerStatDivider} />
            <View style={styles.headerStat}>
              <Text style={styles.headerStatValue}>{inactiveCount}</Text>
              <Text style={styles.headerStatLabel}>Coming Soon</Text>
            </View>
            <View style={styles.headerStatDivider} />
            <View style={styles.headerStat}>
              <Text style={styles.headerStatValue}>{services.length}</Text>
              <Text style={styles.headerStatLabel}>Total</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

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
        <Text style={styles.hint}>
          Toggle = Active / Coming Soon · Tap price to edit
        </Text>

        {/* Active services */}
        {services.filter((s) => s.is_active).length > 0 && (
          <>
            <Text style={styles.groupLabel}>🟢 Active Services</Text>
            {services
              .filter((s) => s.is_active)
              .map((s) => (
                <ServiceRow
                  key={s.id}
                  service={s}
                  editingPriceId={editingPriceId}
                  editPrice={editPrice}
                  savingId={savingId}
                  onToggle={toggleActive}
                  onEditPrice={(id, price) => {
                    setEditingPriceId(id);
                    setEditPrice(price);
                  }}
                  onSavePrice={savePrice}
                  onCancelPrice={() => setEditingPriceId(null)}
                  onEditPriceChange={setEditPrice}
                  onDelete={handleDelete}
                />
              ))}
          </>
        )}

        {/* Coming soon services */}
        {services.filter((s) => !s.is_active).length > 0 && (
          <>
            <Text style={[styles.groupLabel, { marginTop: 8 }]}>
              🟡 Coming Soon
            </Text>
            {services
              .filter((s) => !s.is_active)
              .map((s) => (
                <ServiceRow
                  key={s.id}
                  service={s}
                  editingPriceId={editingPriceId}
                  editPrice={editPrice}
                  savingId={savingId}
                  onToggle={toggleActive}
                  onEditPrice={(id, price) => {
                    setEditingPriceId(id);
                    setEditPrice(price);
                  }}
                  onSavePrice={savePrice}
                  onCancelPrice={() => setEditingPriceId(null)}
                  onEditPriceChange={setEditPrice}
                  onDelete={handleDelete}
                />
              ))}
          </>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* ── ADD SERVICE MODAL ── */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <View style={styles.modal}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Service</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowAddModal(false);
                  resetAddForm();
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={styles.modalBody}
              keyboardShouldPersistTaps="handled"
            >
              {/* Icon picker */}
              <Text style={styles.fieldLabel}>Icon</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.emojiScroll}
              >
                {COMMON_EMOJIS.map((e) => (
                  <TouchableOpacity
                    key={e}
                    style={[
                      styles.emojiOption,
                      newIcon === e && styles.emojiOptionSelected,
                    ]}
                    onPress={() => setNewIcon(e)}
                    activeOpacity={0.8}
                  >
                    <Text style={{ fontSize: 24 }}>{e}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.fieldLabel}>Service Name *</Text>
              <TextInput
                style={styles.input}
                value={newLabel}
                onChangeText={(t) => {
                  setNewLabel(t);
                  setNewSlug(
                    t
                      .toLowerCase()
                      .replace(/\s+/g, "_")
                      .replace(/[^a-z0-9_]/g, ""),
                  );
                }}
                placeholder="e.g. Electrician"
                placeholderTextColor="#B0B8C8"
                autoCapitalize="words"
              />

              <Text style={styles.fieldLabel}>Description</Text>
              <TextInput
                style={styles.input}
                value={newDesc}
                onChangeText={setNewDesc}
                placeholder="e.g. Wiring, switches & repairs"
                placeholderTextColor="#B0B8C8"
                autoCapitalize="sentences"
              />

              <Text style={styles.fieldLabel}>Starting Price (₹) *</Text>
              <TextInput
                style={styles.input}
                value={newPrice}
                onChangeText={setNewPrice}
                placeholder="e.g. 199"
                placeholderTextColor="#B0B8C8"
                keyboardType="numeric"
              />

              <View style={styles.addNoteBox}>
                <Text style={styles.addNoteText}>
                  💡 New services start as "Coming Soon". Enable them from the
                  toggle when ready to go live.
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.saveBtn, isAdding && { opacity: 0.7 }]}
                onPress={handleAdd}
                disabled={isAdding}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={["#1DB8A0", "#1A6FD4"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.saveBtnGrad}
                >
                  {isAdding ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.saveBtnText}>Add Service</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

// ── Extracted ServiceRow component ──────────────────────────
function ServiceRow({
  service,
  editingPriceId,
  editPrice,
  savingId,
  onToggle,
  onEditPrice,
  onSavePrice,
  onCancelPrice,
  onEditPriceChange,
  onDelete,
}: {
  service: Service;
  editingPriceId: string | null;
  editPrice: string;
  savingId: string | null;
  onToggle: (s: Service) => void;
  onEditPrice: (id: string, price: string) => void;
  onSavePrice: (s: Service) => void;
  onCancelPrice: () => void;
  onEditPriceChange: (v: string) => void;
  onDelete: (s: Service) => void;
}) {
  return (
    <View style={[styles.card, !service.is_active && styles.cardInactive]}>
      <View style={styles.cardTop}>
        <View
          style={[
            styles.iconWrap,
            !service.is_active && styles.iconWrapInactive,
          ]}
        >
          <Text style={{ fontSize: 24 }}>{service.icon}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text
            style={[
              styles.cardLabel,
              !service.is_active && styles.cardLabelInactive,
            ]}
          >
            {service.label}
          </Text>
          <Text style={styles.cardDesc} numberOfLines={1}>
            {service.description}
          </Text>
        </View>
        <Switch
          value={service.is_active}
          onValueChange={() => onToggle(service)}
          trackColor={{ false: "#E5E7EB", true: "#1DB8A0" }}
          thumbColor="#fff"
        />
      </View>

      <View style={styles.cardFooterRow}>
        {/* Price */}
        {editingPriceId === service.id ? (
          <View style={styles.priceEditRow}>
            <Text style={styles.priceRupee}>₹</Text>
            <TextInput
              style={styles.priceInput}
              value={editPrice}
              onChangeText={onEditPriceChange}
              keyboardType="numeric"
              autoFocus
              selectTextOnFocus
            />
            <TouchableOpacity
              style={styles.savePriceBtn}
              onPress={() => onSavePrice(service)}
              disabled={savingId === service.id}
              activeOpacity={0.8}
            >
              {savingId === service.id ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.savePriceBtnText}>Save</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelPriceBtn}
              onPress={onCancelPrice}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelPriceBtnText}>✕</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.priceValue}
            onPress={() =>
              onEditPrice(service.id, service.starting_price.toString())
            }
            activeOpacity={0.7}
          >
            <Text style={styles.priceValueText}>₹{service.starting_price}</Text>
            <Text style={{ fontSize: 11 }}>✏️</Text>
          </TouchableOpacity>
        )}

        {/* Delete */}
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => onDelete(service)}
          activeOpacity={0.7}
        >
          <Text style={styles.deleteBtnText}>🗑 Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F4F6FA" },
  loadingWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: { paddingHorizontal: 24, paddingBottom: 20, paddingTop: 8 },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 14,
  },
  headerLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "rgba(255,255,255,0.4)",
    letterSpacing: 2,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -0.5,
  },
  addBtn: {
    backgroundColor: "rgba(29,184,160,0.25)",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(29,184,160,0.5)",
    marginTop: 8,
  },
  addBtnText: { color: "#1DB8A0", fontSize: 14, fontWeight: "800" },
  headerStats: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: 14,
  },
  headerStat: { flex: 1, alignItems: "center" },
  headerStatValue: { fontSize: 22, fontWeight: "900", color: "#fff" },
  headerStatLabel: {
    fontSize: 10,
    color: "rgba(255,255,255,0.5)",
    fontWeight: "600",
    marginTop: 2,
  },
  headerStatDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginVertical: 4,
  },
  body: { flex: 1 },
  bodyContent: { padding: 16 },
  hint: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 14,
  },
  groupLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#6B7280",
    letterSpacing: 0.5,
    marginBottom: 10,
    marginLeft: 2,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardInactive: { opacity: 0.7 },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  iconWrap: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: "#F0FBF8",
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapInactive: { backgroundColor: "#F4F6FA" },
  cardInfo: { flex: 1 },
  cardLabel: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0B0F1A",
    marginBottom: 2,
  },
  cardLabelInactive: { color: "#9CA3AF" },
  cardDesc: { fontSize: 12, color: "#9CA3AF", fontWeight: "500" },
  cardFooterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 12,
  },
  priceValue: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F0FBF8",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  priceValueText: { fontSize: 16, fontWeight: "800", color: "#1DB8A0" },
  priceEditRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  priceRupee: { fontSize: 16, fontWeight: "700", color: "#0B0F1A" },
  priceInput: {
    width: 80,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#1DB8A0",
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 15,
    fontWeight: "700",
    color: "#0B0F1A",
    textAlign: "center",
  },
  savePriceBtn: {
    backgroundColor: "#1DB8A0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  savePriceBtnText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  cancelPriceBtn: { padding: 6 },
  cancelPriceBtnText: { fontSize: 14, color: "#9CA3AF", fontWeight: "700" },
  deleteBtn: {
    backgroundColor: "#FEF2F2",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  deleteBtnText: { fontSize: 12, color: "#EF4444", fontWeight: "700" },
  // Modal
  modal: { flex: 1, backgroundColor: "#fff" },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E5E7EB",
    alignSelf: "center",
    marginTop: 12,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalTitle: { fontSize: 18, fontWeight: "800", color: "#0B0F1A" },
  modalClose: { fontSize: 18, color: "#9CA3AF", fontWeight: "700" },
  modalBody: { padding: 24 },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: 8,
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: "#F8F9FB",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#EAECF0",
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: "#0B0F1A",
    fontWeight: "500",
    marginBottom: 16,
  },
  emojiScroll: { marginBottom: 16 },
  emojiOption: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#F4F6FA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  emojiOptionSelected: { borderColor: "#1DB8A0", backgroundColor: "#F0FBF8" },
  addNoteBox: {
    backgroundColor: "#FFF7ED",
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  addNoteText: {
    fontSize: 13,
    color: "#92400E",
    fontWeight: "500",
    lineHeight: 19,
  },
  saveBtn: { borderRadius: 16, overflow: "hidden" },
  saveBtnGrad: { paddingVertical: 17, alignItems: "center" },
  saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "800" },
});
