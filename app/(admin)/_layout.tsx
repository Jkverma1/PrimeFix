// app/(admin)/_layout.tsx

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
      <Text
        style={[styles.label, focused && styles.labelActive]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

export default function AdminLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#1DB8A0",
        tabBarInactiveTintColor: "rgba(255,255,255,0.4)",
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tabs.Screen
        name="(a-dashboard)"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📊" label="Dashboard" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="(b-bookings)"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📋" label="Bookings" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="(c-customers)"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="👥" label="Customers" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="(d-services)"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="⚙️" label="Services" focused={focused} />
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
    backgroundColor: "#0B0F1A",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
    elevation: 16,
    shadowColor: "#000",
    shadowOpacity: 0.3,
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
    flex: 1,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    flex: 1,
    width: 52,
  },
  iconWrap: {
    width: 36,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  iconWrapActive: { backgroundColor: "rgba(29,184,160,0.15)" },
  emoji: { fontSize: 19 },
  label: {
    fontSize: 9,
    fontWeight: "600",
    color: "rgba(255,255,255,0.35)",
    textAlign: "center",
    width: "100%",
  },
  labelActive: { color: "#1DB8A0", fontWeight: "700" },
});
