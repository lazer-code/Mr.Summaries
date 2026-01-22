import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../styles/ThemeContext';
import { createThemedStyles, spacing } from '../styles/theme';
import { getSummaryById } from '../lib/mock-data';

type SummaryDetailRouteProp = RouteProp<RootStackParamList, 'SummaryDetail'>;

const SummaryDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<SummaryDetailRouteProp>();
  const { isDark } = useTheme();
  const { theme } = createThemedStyles(isDark);
  
  const summary = getSummaryById(route.params.summaryId);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      padding: spacing.md,
      paddingTop: spacing.xxl,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      backgroundColor: theme.card,
    },
    backButton: {
      marginBottom: spacing.md,
    },
    backText: {
      color: theme.primary,
      fontSize: 16,
    },
    courseInfo: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginBottom: spacing.sm,
    },
    courseNumber: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.primary,
      backgroundColor: isDark ? theme.primaryDark : '#dbeafe',
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: 6,
    },
    courseName: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: spacing.sm,
    },
    meta: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    metaText: {
      fontSize: 12,
      color: theme.textTertiary,
    },
    content: {
      padding: spacing.md,
    },
    contentText: {
      fontSize: 16,
      color: theme.text,
      lineHeight: 24,
    },
  });

  if (!summary) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: theme.text }}>Summary not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.courseInfo}>
          <Text style={styles.courseNumber}>{summary.courseNumber}</Text>
          <Text style={styles.courseName}>{summary.courseName}</Text>
        </View>
        <Text style={styles.title}>{summary.title}</Text>
        <View style={styles.meta}>
          <Text style={styles.metaText}>By {summary.author}</Text>
          <Text style={styles.metaText}>•</Text>
          <Text style={styles.metaText}>
            {summary.uploadDate.toLocaleDateString()}
          </Text>
        </View>
      </View>
      <ScrollView>
        <View style={styles.content}>
          <Text style={styles.contentText}>{summary.content}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default SummaryDetailScreen;
