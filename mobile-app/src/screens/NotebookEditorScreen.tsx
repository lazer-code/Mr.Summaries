import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../styles/ThemeContext';
import { createThemedStyles, spacing } from '../styles/theme';

type NotebookEditorRouteProp = RouteProp<RootStackParamList, 'NotebookEditor'>;

const NotebookEditorScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<NotebookEditorRouteProp>();
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
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
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
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Notebook Editor</Text>
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>✏️ Notebook editor coming soon</Text>
      </View>
    </View>
  );
};

export default NotebookEditorScreen;
