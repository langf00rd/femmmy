import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme, Alert } from 'react-native';
import { useCycles } from '@/context/CycleContext';
import { Colors } from '@/constants/theme';

export default function SettingsScreen() {
  const { cycles, clearAllData } = useCycles();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to delete all your cycle data? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Data</Text>
          <View style={[styles.card, { backgroundColor: colors.background }]}>
            <View style={styles.row}>
              <Text style={[styles.label, { color: colors.text }]}>Logged Cycles</Text>
              <Text style={[styles.value, { color: colors.icon }]}>{cycles.length}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Danger Zone</Text>
          <TouchableOpacity
            style={[styles.dangerButton, { borderColor: colors.danger }]}
            onPress={handleClearData}
          >
            <Text style={[styles.dangerButtonText, { color: colors.danger }]}>
              Clear All Data
            </Text>
          </TouchableOpacity>
          <Text style={[styles.warningText, { color: colors.icon }]}>
            This will permanently delete all your cycle history and predictions.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.icon }]}>Femmmy v1.0.0</Text>
          <Text style={[styles.footerSubtext, { color: colors.icon }]}>
            Your data stays on your device
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  card: {
    borderRadius: 12,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
  },
  value: {
    fontSize: 16,
  },
  dangerButton: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  warningText: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
  },
  footerSubtext: {
    fontSize: 12,
    marginTop: 4,
  },
});