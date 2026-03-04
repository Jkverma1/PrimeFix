// app/(tabs)/(d-account)/addresses.tsx

import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Spacing } from "../../../constants/colors";
import { useUserStore } from "../../../store/UserStore";

const LABEL_OPTIONS = ["Home", "Office", "Other"];
const LABEL_EMOJIS: Record<string, string> = {
  Home: "🏠",
  Office: "🏢",
  Other: "📍",
};

export default function AddressesScreen() {
  const router = useRouter();
  const {
    addresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    isLoading,
  } = useUserStore();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [label, setLabel] = useState("Home");
  const [address, setAddress] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const resetForm = () => {
    setLabel("Home");
    setAddress("");
    setEditingId(null);
  };

  const openAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (a: { id: string; label: string; address: string }) => {
    setLabel(a.label);
    setAddress(a.address);
    setEditingId(a.id);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!address.trim()) {
      Alert.alert("Required", "Please enter an address.");
      return;
    }
    setIsSaving(true);
    try {
      if (editingId) {
        await updateAddress(editingId, { label, address: address.trim() });
      } else {
        await addAddress({ label, address: address.trim() });
      }
      setShowModal(false);
      resetForm();
    } catch {
      Alert.alert("Error", "Could not save address. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert("Delete Address", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteAddress(id);
          } catch {
            Alert.alert("Error", "Could not delete address.");
          }
        },
      },
    ]);
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultAddress(id);
    } catch {
      Alert.alert("Error", "Could not update default address.");
    }
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#1DB8A0", "#1A6FD4"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <SafeAreaView>
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Saved Addresses</Text>
            <TouchableOpacity
              onPress={openAdd}
              style={styles.addBtn}
              activeOpacity={0.8}
            >
              <Text style={styles.addBtnText}>+ Add</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.headerSub}>
            Auto-fill your booking form faster
          </Text>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        {addresses.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyEmoji}>🗺️</Text>
            <Text style={styles.emptyTitle}>No saved addresses</Text>
            <Text style={styles.emptySub}>
              Save your home, office or other locations for faster booking.
            </Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={openAdd}
              activeOpacity={0.8}
            >
              <Text style={styles.emptyBtnText}>+ Add Address</Text>
            </TouchableOpacity>
          </View>
        ) : (
          addresses.map((a) => (
            <View key={a.id} style={styles.card}>
              <View style={styles.cardLeft}>
                <View style={styles.cardIconWrap}>
                  <Text style={styles.cardIcon}>
                    {LABEL_EMOJIS[a.label] ?? "📍"}
                  </Text>
                </View>
                <View style={styles.cardInfo}>
                  <View style={styles.cardLabelRow}>
                    <Text style={styles.cardLabel}>{a.label}</Text>
                    {a.is_default && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultBadgeText}>Default</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.cardAddress} numberOfLines={2}>
                    {a.address}
                  </Text>
                </View>
              </View>
              <View style={styles.cardActions}>
                {!a.is_default && (
                  <TouchableOpacity
                    onPress={() => handleSetDefault(a.id)}
                    style={styles.actionBtn}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.actionBtnText}>Set Default</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => openEdit(a)}
                  style={styles.actionBtn}
                  activeOpacity={0.7}
                >
                  <Text style={styles.actionBtnText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(a.id)}
                  style={[styles.actionBtn, styles.actionBtnDanger]}
                  activeOpacity={0.7}
                >
                  <Text style={styles.actionBtnDangerText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <View style={styles.modal}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingId ? "Edit Address" : "Add Address"}
              </Text>
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              contentContainerStyle={styles.modalBody}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.modalFieldLabel}>Label</Text>
              <View style={styles.labelRow}>
                {LABEL_OPTIONS.map((l) => (
                  <TouchableOpacity
                    key={l}
                    style={[
                      styles.labelPill,
                      label === l && styles.labelPillActive,
                    ]}
                    onPress={() => setLabel(l)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.labelPillIcon}>{LABEL_EMOJIS[l]}</Text>
                    <Text
                      style={[
                        styles.labelPillText,
                        label === l && styles.labelPillTextActive,
                      ]}
                    >
                      {l}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.modalFieldLabel}>Full Address</Text>
              <TextInput
                style={styles.modalInput}
                value={address}
                onChangeText={setAddress}
                placeholder="House no., street, area, city, pincode"
                placeholderTextColor="#B0B8C8"
                multiline
                numberOfLines={3}
                autoCapitalize="sentences"
              />
              <TouchableOpacity
                style={[styles.modalSaveBtn, isSaving && { opacity: 0.7 }]}
                onPress={handleSave}
                activeOpacity={0.85}
                disabled={isSaving}
              >
                <LinearGradient
                  colors={["#1DB8A0", "#1A6FD4"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.modalSaveBtnGrad}
                >
                  {isSaving ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.modalSaveBtnText}>
                      {editingId ? "Save Changes" : "Add Address"}
                    </Text>
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

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F4F6FA" },
  header: { paddingHorizontal: Spacing.xl, paddingBottom: 20, paddingTop: 8 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
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
  addBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  addBtnText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  headerSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.65)",
    fontWeight: "500",
  },
  body: { flex: 1 },
  bodyContent: { padding: Spacing.xl },
  emptyWrap: { alignItems: "center", paddingTop: 60 },
  emptyEmoji: { fontSize: 56, marginBottom: 20 },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0B0F1A",
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 28,
    fontWeight: "500",
    paddingHorizontal: 20,
  },
  emptyBtn: {
    backgroundColor: "#1DB8A0",
    borderRadius: 14,
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  emptyBtnText: { color: "#fff", fontSize: 15, fontWeight: "800" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardLeft: { flexDirection: "row", gap: 12, marginBottom: 12 },
  cardIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#F0FBF8",
    alignItems: "center",
    justifyContent: "center",
  },
  cardIcon: { fontSize: 22 },
  cardInfo: { flex: 1 },
  cardLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  cardLabel: { fontSize: 15, fontWeight: "800", color: "#0B0F1A" },
  defaultBadge: {
    backgroundColor: "#F0FBF8",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  defaultBadgeText: { fontSize: 10, color: "#1DB8A0", fontWeight: "700" },
  cardAddress: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
    lineHeight: 18,
  },
  cardActions: {
    flexDirection: "row",
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 12,
  },
  actionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#F4F6FA",
  },
  actionBtnText: { fontSize: 12, color: "#1A6FD4", fontWeight: "700" },
  actionBtnDanger: { backgroundColor: "#FEF2F2" },
  actionBtnDangerText: { fontSize: 12, color: "#EF4444", fontWeight: "700" },
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
    paddingHorizontal: Spacing.xl,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalTitle: { fontSize: 18, fontWeight: "800", color: "#0B0F1A" },
  modalClose: { fontSize: 18, color: "#9CA3AF", fontWeight: "700" },
  modalBody: { padding: Spacing.xl },
  modalFieldLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: 10,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  labelRow: { flexDirection: "row", gap: 10, marginBottom: 22 },
  labelPill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "#F4F6FA",
    borderWidth: 1.5,
    borderColor: "#EAECF0",
  },
  labelPillActive: { backgroundColor: "#F0FBF8", borderColor: "#1DB8A0" },
  labelPillIcon: { fontSize: 16 },
  labelPillText: { fontSize: 13, fontWeight: "700", color: "#9CA3AF" },
  labelPillTextActive: { color: "#1DB8A0" },
  modalInput: {
    backgroundColor: "#F8F9FB",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#EAECF0",
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#0B0F1A",
    fontWeight: "500",
    minHeight: 90,
    textAlignVertical: "top",
    marginBottom: 24,
  },
  modalSaveBtn: { borderRadius: 16, overflow: "hidden" },
  modalSaveBtnGrad: { paddingVertical: 17, alignItems: "center" },
  modalSaveBtnText: { color: "#fff", fontSize: 16, fontWeight: "800" },
});
