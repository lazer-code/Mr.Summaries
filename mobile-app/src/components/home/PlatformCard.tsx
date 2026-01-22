import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../styles/ThemeContext';
import { createThemedStyles, spacing } from '../../styles/theme';

type IconName = 'book-open' | 'file-text' | 'calendar';

interface PlatformCardProps {
  title: string;
  description: string;
  iconName: IconName;
  onPress: () => void;
  comingSoon?: boolean;
}

// Simple icon component using text
const Icon: React.FC<{ name: IconName; color: string }> = ({ name, color }) => {
  const iconMap: Record<IconName, string> = {
    'book-open': '📖',
    'file-text': '📄',
    'calendar': '📅',
  };
  
  return (
    <Text style={{ fontSize: 48 }}>
      {iconMap[name]}
    </Text>
  );
};

const PlatformCard: React.FC<PlatformCardProps> = ({
  title,
  description,
  iconName,
  onPress,
  comingSoon = false,
}) => {
  const { isDark } = useTheme();
  const { theme, commonStyles } = createThemedStyles(isDark);

  const styles = StyleSheet.create({
    card: {
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: spacing.lg,
      borderWidth: 2,
      borderColor: theme.border,
      position: 'relative',
    },
    cardPressed: {
      backgroundColor: theme.cardHover,
      borderColor: theme.primary,
    },
    cardDisabled: {
      opacity: 0.75,
    },
    comingSoonBadge: {
      position: 'absolute',
      top: spacing.md,
      right: spacing.md,
      backgroundColor: '#f59e0b',
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: 9999,
    },
    comingSoonText: {
      color: '#ffffff',
      fontSize: 10,
      fontWeight: '600',
    },
    content: {
      alignItems: 'center',
    },
    iconContainer: {
      backgroundColor: isDark ? theme.primaryDark : '#dbeafe',
      borderRadius: 9999,
      padding: spacing.lg,
      marginBottom: spacing.md,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: spacing.sm,
      textAlign: 'center',
    },
    description: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },
  });

  return (
    <TouchableOpacity
      onPress={comingSoon ? undefined : onPress}
      activeOpacity={0.7}
      disabled={comingSoon}
      style={[styles.card, comingSoon && styles.cardDisabled]}
    >
      {comingSoon && (
        <View style={styles.comingSoonBadge}>
          <Text style={styles.comingSoonText}>Coming Soon</Text>
        </View>
      )}
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon name={iconName} color={theme.primary} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default PlatformCard;
