// components/AppButton.tsx

import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import Colors from '../constants/colors';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'success';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export default function AppButton({ title, onPress, variant = 'primary', loading, disabled, style }: Props) {
  return (
    <TouchableOpacity
      style={[styles.btn, styles[variant], (disabled || loading) && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading
        ? <ActivityIndicator color="#fff" />
        : <Text style={styles.text}>{title}</Text>
      }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: Colors.primary },
  success: { backgroundColor: Colors.success },
  disabled: { opacity: 0.6 },
  text: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
