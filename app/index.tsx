// app/index.tsx  ← This is your Home Screen in Expo Router

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '../constants/colors';
import { SERVICES } from '../constants/services';
import { ServiceType } from '../types';
import ServiceCard from '../components/ServiceCard';
import AppButton from '../components/AppButton';

export default function HomeScreen() {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);

  const handleContinue = () => {
    if (!selectedService) {
      Alert.alert('Select a Service', 'Please choose a service before continuing.');
      return;
    }
    // Pass serviceType as a query param
    router.push({ pathname: '/request', params: { serviceType: selectedService } });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Book a Service</Text>
          <Text style={styles.subtitle}>Choose a service below.</Text>
        </View>

        <View style={styles.cardsRow}>
          {SERVICES.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              selected={selectedService === service.id}
              onSelect={setSelectedService}
            />
          ))}
        </View>

        {selectedService && (
          <Text style={styles.hint}>
            Selected:{' '}
            <Text style={styles.hintBold}>
              {SERVICES.find((s) => s.id === selectedService)?.label}
            </Text>
          </Text>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <AppButton
          title="Request Service"
          onPress={handleContinue}
          disabled={!selectedService}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg.primary },
  scroll: { padding: 24, flexGrow: 1 },
  header: { alignItems: 'center', marginBottom: 32, marginTop: 12 },
  title: { fontSize: 26, fontWeight: '800', color: Colors.text.primary, marginBottom: 6 },
  subtitle: { fontSize: 15, color: Colors.text.secondary },
  cardsRow: { flexDirection: 'row', marginBottom: 16 },
  hint: { textAlign: 'center', color: Colors.text.secondary, fontSize: 14, marginTop: 8 },
  hintBold: { fontWeight: '700', color: Colors.primary },
  footer: {
    padding: 20,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.bg.primary,
  },
});
