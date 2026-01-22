import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../styles/ThemeContext';
import { createThemedStyles, spacing } from '../../styles/theme';
import { Summary } from '../../types/summary';
import { formatTimeAgo } from '../../lib/utils';

interface SummaryCardProps {
  summary: Summary;
  onPress: () => void;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ summary, onPress }) => {
  const { isDark } = useTheme();
  const { theme, commonStyles } = createThemedStyles(isDark);

  const styles = StyleSheet.create({
    card: {
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: spacing.md,
      borderWidth: 2,
      borderColor: theme.border,
    },
    courseInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.sm,
      gap: spacing.sm,
    },
    courseNumber: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.primary,
      backgroundColor: isDark ? theme.primaryDark : '#dbeafe',
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: 6,
    },
    courseName: {
      fontSize: 12,
      color: theme.textSecondary,
      flex: 1,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text,
      marginBottom: spacing.sm,
    },
    preview: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: spacing.sm,
      lineHeight: 20,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    author: {
      fontSize: 12,
      color: theme.textTertiary,
    },
    uploadDate: {
      fontSize: 12,
      color: theme.textTertiary,
    },
  });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.courseInfo}>
        <Text style={styles.courseNumber}>{summary.courseNumber}</Text>
        <Text style={styles.courseName} numberOfLines={1}>
          {summary.courseName}
        </Text>
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {summary.title}
      </Text>
      <Text style={styles.preview} numberOfLines={3}>
        {summary.preview}
      </Text>
      <View style={styles.footer}>
        <Text style={styles.author}>By {summary.author}</Text>
        <Text style={styles.uploadDate}>{formatTimeAgo(summary.uploadDate)}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default SummaryCard;
