import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

function TabIcon({
  emoji,
  label,
  focused,
}: {
  emoji: string;
  label: string;
  focused: boolean;
}) {
  return (
    <View style={styles.tabItem}>
      <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      <Text style={[styles.label, focused && styles.labelActive]}>{label}</Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#1DB8A0",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tabs.Screen
        name="(a-home)"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🏠" label="Home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="(b-bookings)"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📋" label="Book" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="(c-refer)"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🎁" label="Refer" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="(d-account)"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="👤" label="Me" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const TAB_HEIGHT = Platform.OS === "ios" ? 88 : 68;

const styles = StyleSheet.create({
  tabBar: {
    height: TAB_HEIGHT,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#F0F2F8",
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -4 },
    paddingTop: 0,
    paddingBottom: 0,
  },
  tabBarItem: {
    height: TAB_HEIGHT,
    paddingTop: Platform.OS === "ios" ? 10 : 8,
    paddingBottom: Platform.OS === "ios" ? 26 : 8,
    justifyContent: "center",
    alignItems: "center",
  },
  tabItem: { alignItems: "center", justifyContent: "center", gap: 3 },
  iconWrap: {
    width: 44,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  iconWrapActive: { backgroundColor: "rgba(29,184,160,0.12)" },
  emoji: { fontSize: 20 },
  label: {
    fontSize: 10,
    fontWeight: "600",
    color: "#9CA3AF",
    textAlign: "center",
  },
  labelActive: { color: "#1DB8A0", fontWeight: "700" },
});
