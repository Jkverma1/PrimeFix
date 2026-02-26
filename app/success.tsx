// app/success.tsx  ← Success Screen

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Linking, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Colors from '../constants/colors';
import AppButton from '../components/AppButton';
import { CONTACT } from '../constants/services';

export default function SuccessScreen() {
  const router = useRouter();
  const { requestId, serviceType } = useLocalSearchParams<{ requestId: string; serviceType: string }>();

  const handleCall = () => {
    Linking.openURL(`tel:${CONTACT.phone}`).catch(() =>
      Alert.alert('Error', 'Could not open the dialer.')
    );
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent('Hi! I just submitted a service request.');
    Linking.openURL(`https://wa.me/${CONTACT.whatsapp}?text=${msg}`).catch(() =>
      Alert.alert('Error', 'WhatsApp is not installed.')
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.circle}>
          <Text style={styles.check}>✓</Text>
        </View>

        <Text style={styles.title}>Request Sent!</Text>
        <Text style={styles.subtitle}>
          Your request has been received.{'\n'}We'll contact you shortly.
        </Text>
        {requestId ? (
          <Text style={styles.requestInfo}>ID: {requestId}</Text>
        ) : null}

        <View style={styles.actions}>
          <AppButton title="📞  Call Us" onPress={handleCall} variant="success" style={styles.btn} />
          <AppButton title="💬  Message on WhatsApp" onPress={handleWhatsApp} variant="success" style={styles.btn} />
        </View>

        <Text style={styles.backLink} onPress={() => router.replace('/')}>
          ← Back to Home
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg.primary },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  circle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: Colors.success,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 28,
    shadowColor: Colors.success, shadowOpacity: 0.35,
    shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 8,
  },
  check: { fontSize: 50, color: '#fff', fontWeight: '700' },
  title: { fontSize: 28, fontWeight: '800', color: Colors.text.primary, marginBottom: 12 },
  subtitle: { fontSize: 15, color: Colors.text.secondary, textAlign: 'center', lineHeight: 22, marginBottom: 40 },
  actions: { width: '100%', gap: 12 },
  btn: { width: '100%' },
  requestInfo: { fontSize: 13, color: Colors.text.secondary, marginTop: 8 },
  backLink: { marginTop: 32, fontSize: 15, color: Colors.primary, fontWeight: '600' },
});
