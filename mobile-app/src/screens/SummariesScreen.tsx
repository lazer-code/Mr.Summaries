import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../styles/ThemeContext';
import { createThemedStyles, spacing } from '../styles/theme';
import SearchBar from '../components/summaries/SearchBar';
import SummaryCard from '../components/summaries/SummaryCard';
import SummaryUploadForm from '../components/summaries/SummaryUploadForm';
import { Summary, SummaryFormData } from '../types/summary';
import { getSummaries } from '../lib/mock-data';

type SummariesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Summaries'>;

const SummariesScreen: React.FC = () => {
  const navigation = useNavigation<SummariesScreenNavigationProp>();
  const { isDark } = useTheme();
  const { theme, commonStyles } = createThemedStyles(isDark);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [summaries, setSummaries] = useState<Summary[]>(getSummaries());

  const filteredSummaries = getSummaries(searchTerm);

  const handleUpload = (data: SummaryFormData) => {
    const newSummary: Summary = {
      id: Date.now().toString(),
      courseNumber: data.courseNumber,
      courseName: data.courseName,
      title: data.title,
      author: data.author,
      content: data.content,
      uploadDate: new Date(),
      preview: data.content.substring(0, 150) + '...',
    };
    setSummaries([newSummary, ...summaries]);
    setShowUploadForm(false);
  };

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
      marginBottom: spacing.lg,
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    backText: {
      color: theme.primary,
      fontSize: 16,
      marginLeft: spacing.xs,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: spacing.xs,
    },
    subtitle: {
      fontSize: 16,
      color: theme.textSecondary,
    },
    searchSection: {
      marginBottom: spacing.lg,
      gap: spacing.md,
    },
    uploadButton: {
      backgroundColor: theme.primary,
      borderRadius: 12,
      padding: spacing.md,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: spacing.sm,
    },
    uploadButtonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
    },
    resultsCount: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: spacing.md,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: spacing.md,
    },
    summariesContainer: {
      gap: spacing.md,
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.xxl,
    },
    emptyText: {
      fontSize: 18,
      color: theme.textSecondary,
      marginBottom: spacing.sm,
    },
    emptySubtext: {
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
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backText}>← Back to Home</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Summaries</Text>
            <Text style={styles.subtitle}>Browse and search course summaries</Text>
          </View>

          {/* Search and Upload */}
          <View style={styles.searchSection}>
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => setShowUploadForm(true)}
            >
              <Text style={styles.uploadButtonText}>📤 Upload Summary</Text>
            </TouchableOpacity>
          </View>

          {/* Results Count */}
          {searchTerm && (
            <Text style={styles.resultsCount}>
              Found {filteredSummaries.length} result{filteredSummaries.length !== 1 ? 's' : ''}
            </Text>
          )}

          {/* Section Title */}
          <Text style={styles.sectionTitle}>
            {searchTerm ? 'Search Results' : 'Latest Summaries'}
          </Text>

          {/* Summaries List */}
          {filteredSummaries.length > 0 ? (
            <View style={styles.summariesContainer}>
              {filteredSummaries.map((summary) => (
                <SummaryCard
                  key={summary.id}
                  summary={summary}
                  onPress={() => navigation.navigate('SummaryDetail', { summaryId: summary.id })}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No summaries found</Text>
              <Text style={styles.emptySubtext}>
                Try a different search term or upload a new summary
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Upload Form Modal */}
      {showUploadForm && (
        <SummaryUploadForm
          onClose={() => setShowUploadForm(false)}
          onSubmit={handleUpload}
        />
      )}
    </View>
  );
};

export default SummariesScreen;
