import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../styles/ThemeContext';
import { createThemedStyles, spacing } from '../styles/theme';

const CalendarScreen: React.FC = () => {
  const navigation = useNavigation();
  const { isDark } = useTheme();
  const { theme } = createThemedStyles(isDark);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding: spacing.md,
      paddingTop: spacing.xxl,
    },
    backButton: {
      marginBottom: spacing.md,
    },
    backText: {
      color: theme.primary,
      fontSize: 16,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: spacing.sm,
    },
    subtitle: {
      fontSize: 16,
      color: theme.textSecondary,
      marginBottom: spacing.xl,
    },
    placeholder: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    placeholderText: {
      fontSize: 18,
      color: theme.textSecondary,
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back to Home</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Calendar & Tasks</Text>
      <Text style={styles.subtitle}>Manage your schedule and tasks</Text>
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>📅 Calendar view coming soon</Text>
      </View>
    </View>
  );
};

export default CalendarScreen;
