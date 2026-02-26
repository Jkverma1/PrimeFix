// components/ServiceCard.tsx

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Colors from '../constants/colors';
import { Service } from '../types';

interface Props {
  service: Service;
  selected: boolean;
  onSelect: (id: Service['id']) => void;
}

export default function ServiceCard({ service, selected, onSelect }: Props) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected]}
      onPress={() => onSelect(service.id)}
      activeOpacity={0.75}
    >
      <Text style={styles.icon}>{service.icon}</Text>
      <Text style={[styles.label, selected && styles.labelSelected]}>{service.label}</Text>
      <Text style={styles.desc}>{service.description}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.bg.secondary,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    marginHorizontal: 6,
  },
  cardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  icon: { fontSize: 40, marginBottom: 10 },
  label: { fontSize: 15, fontWeight: '700', color: Colors.text.secondary, marginBottom: 4 },
  labelSelected: { color: Colors.primary },
  desc: { fontSize: 12, color: Colors.text.light, textAlign: 'center' },
});
