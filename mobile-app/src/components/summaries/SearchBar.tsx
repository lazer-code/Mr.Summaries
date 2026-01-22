import React from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { useTheme } from '../../styles/ThemeContext';
import { createThemedStyles, spacing } from '../../styles/theme';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search by course, title, or author...',
}) => {
  const { isDark } = useTheme();
  const { theme, commonStyles } = createThemedStyles(isDark);

  const styles = StyleSheet.create({
    container: {
      position: 'relative',
    },
    iconContainer: {
      position: 'absolute',
      left: spacing.md,
      top: 0,
      bottom: 0,
      justifyContent: 'center',
      zIndex: 1,
    },
    icon: {
      fontSize: 20,
    },
    input: {
      backgroundColor: theme.backgroundSecondary,
      borderWidth: 2,
      borderColor: theme.border,
      borderRadius: 12,
      paddingLeft: spacing.xxl + spacing.md,
      paddingRight: spacing.md,
      paddingVertical: spacing.md,
      fontSize: 16,
      color: theme.text,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>🔍</Text>
      </View>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={theme.textTertiary}
      />
    </View>
  );
};

export default SearchBar;
