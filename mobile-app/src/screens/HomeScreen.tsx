import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../styles/ThemeContext';
import { createThemedStyles, spacing } from '../styles/theme';
import PlatformCard from '../components/home/PlatformCard';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { isDark } = useTheme();
  const { theme, commonStyles } = createThemedStyles(isDark);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: spacing.md,
      paddingTop: spacing.xxl,
    },
    header: {
      marginBottom: spacing.xl,
      alignItems: 'center',
    },
    title: {
      fontSize: 48,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: spacing.sm,
    },
    subtitle: {
      fontSize: 20,
      color: theme.textSecondary,
      marginBottom: spacing.xs,
    },
    description: {
      fontSize: 16,
      color: theme.textTertiary,
    },
    cardsContainer: {
      gap: spacing.lg,
    },
    footer: {
      marginTop: spacing.xl,
      alignItems: 'center',
      paddingVertical: spacing.lg,
    },
    footerText: {
      fontSize: 14,
      color: theme.textTertiary,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Mr.Summaries</Text>
            <Text style={styles.subtitle}>Your Academic Knowledge Platform</Text>
            <Text style={styles.description}>Access and share knowledge seamlessly</Text>
          </View>

          {/* Platform Cards */}
          <View style={styles.cardsContainer}>
            <PlatformCard
              title="Notebooks"
              description="Digital note-taking in a notebook form with stylus support and rich formatting"
              iconName="book-open"
              onPress={() => navigation.navigate('Notebooks')}
            />
            <PlatformCard
              title="Summaries"
              description="Browse and share course summaries with LaTeX support and rich content"
              iconName="file-text"
              onPress={() => navigation.navigate('Summaries')}
            />
            <PlatformCard
              title="Calendar & Tasks"
              description="Manage your schedule and tasks with an integrated calendar view"
              iconName="calendar"
              onPress={() => navigation.navigate('Calendar')}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Built for students, by students</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
