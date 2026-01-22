import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../../styles/ThemeContext';
import { createThemedStyles, spacing } from '../../styles/theme';
import { SummaryFormData } from '../../types/summary';

interface SummaryUploadFormProps {
  onClose: () => void;
  onSubmit: (data: SummaryFormData) => void;
}

const SummaryUploadForm: React.FC<SummaryUploadFormProps> = ({ onClose, onSubmit }) => {
  const { isDark } = useTheme();
  const { theme, commonStyles } = createThemedStyles(isDark);
  
  const [formData, setFormData] = useState<SummaryFormData>({
    courseNumber: '',
    courseName: '',
    title: '',
    author: '',
    content: '',
  });

  const handleSubmit = () => {
    if (!formData.courseNumber || !formData.courseName || !formData.title || !formData.author || !formData.content) {
      // TODO: Replace with proper toast notification or inline error message
      alert('Please fill in all fields');
      return;
    }
    onSubmit(formData);
  };

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: spacing.lg,
      width: '90%',
      maxHeight: '80%',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: spacing.lg,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
      marginBottom: spacing.xs,
    },
    input: {
      backgroundColor: theme.backgroundSecondary,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      padding: spacing.sm,
      fontSize: 16,
      color: theme.text,
      marginBottom: spacing.md,
    },
    textArea: {
      height: 150,
      textAlignVertical: 'top',
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: spacing.md,
      marginTop: spacing.md,
    },
    button: {
      flex: 1,
      padding: spacing.md,
      borderRadius: 8,
      alignItems: 'center',
    },
    submitButton: {
      backgroundColor: theme.primary,
    },
    cancelButton: {
      backgroundColor: theme.border,
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
    },
    cancelButtonText: {
      color: theme.text,
    },
  });

  return (
    <Modal transparent visible animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView>
            <Text style={styles.title}>Upload Summary</Text>
            
            <Text style={styles.label}>Course Number</Text>
            <TextInput
              style={styles.input}
              value={formData.courseNumber}
              onChangeText={(text) => setFormData({ ...formData, courseNumber: text })}
              placeholder="e.g., MATH 201"
              placeholderTextColor={theme.textTertiary}
            />

            <Text style={styles.label}>Course Name</Text>
            <TextInput
              style={styles.input}
              value={formData.courseName}
              onChangeText={(text) => setFormData({ ...formData, courseName: text })}
              placeholder="e.g., Calculus II"
              placeholderTextColor={theme.textTertiary}
            />

            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
              placeholder="Summary title"
              placeholderTextColor={theme.textTertiary}
            />

            <Text style={styles.label}>Author</Text>
            <TextInput
              style={styles.input}
              value={formData.author}
              onChangeText={(text) => setFormData({ ...formData, author: text })}
              placeholder="Your name"
              placeholderTextColor={theme.textTertiary}
            />

            <Text style={styles.label}>Content</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.content}
              onChangeText={(text) => setFormData({ ...formData, content: text })}
              placeholder="Enter your summary content here..."
              placeholderTextColor={theme.textTertiary}
              multiline
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
              >
                <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.submitButton]}
                onPress={handleSubmit}
              >
                <Text style={styles.buttonText}>Upload</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default SummaryUploadForm;
