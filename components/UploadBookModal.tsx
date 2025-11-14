import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import * as DocumentPicker from 'expo-document-picker';
import { Dropdown } from 'react-native-element-dropdown';
import Modal from 'react-native-modal';
import { adminBookuploadapi } from '../app/api/adminapi/uploadadminbookapi';

interface UploadBookModalProps {
  isVisible: boolean;
  onClose: () => void;
  studyMaterialData: any[];

  selectedClass: string | null;
  setSelectedClass: (value: string | null) => void;
}

export default function UploadBookModal({
  isVisible,
  onClose,
  studyMaterialData,
  selectedClass,
  setSelectedClass,
}: UploadBookModalProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    null
  );
  const [selectedLanguage, setSelectedLanguage] = React.useState<string | null>(
    null
  );

  const [bookName, setBookName] = React.useState('');
  const [subject, setSubject] = React.useState('');

  const [thumbnail, setThumbnail] = React.useState<{
    uri: string;
    name?: string;
    mimeType?: string;
  } | null>(null);
  const [bookFile, setBookFile] =
    React.useState<DocumentPicker.DocumentPickerAsset | null>(null);

  // PICK THUMBNAIL
  const pickThumbnail = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['image/*'],
    });
    if (result.canceled) return;
    setThumbnail(result.assets[0]);
  };

  // PICK PDF
  const pickBookFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
    });
    if (result.canceled) return;
    setBookFile(result.assets[0]);
  };

  // VALIDATION + SUBMIT HANDLER
  const handleUpload = async () => {
    const missingFields = [];

    if (!bookName) missingFields.push('Book Name');
    if (!selectedCategory) missingFields.push('Category');
    if (!subject) missingFields.push('Subject');
    if (!selectedClass) missingFields.push('Education Level');
    if (!selectedLanguage) missingFields.push('Language');
    if (!thumbnail) missingFields.push('Thumbnail Image');
    if (!bookFile) missingFields.push('Book File (PDF)');

    if (missingFields.length > 0) {
      Alert.alert(
        'Missing Fields',
        'Please fill the following fields:\n\n' + missingFields.join('\n')
      );
      return;
    }

    const formData = new FormData();

    formData.append('bookName', bookName);
    formData.append('category', selectedCategory || '');
    formData.append('SchoolEducation', 'true');
    formData.append('subject', subject);
    formData.append('educationLevel', selectedClass || '');
    formData.append('language', selectedLanguage || '');

    formData.append('thumbnail', {
      uri: thumbnail?.uri || '',
      name: thumbnail?.name || 'thumbnail.jpg',
      type: thumbnail?.mimeType || 'image/jpeg',
    } as any);

    formData.append('file', {
      uri: bookFile?.uri || '',
      type: 'application/pdf',
      name: bookFile?.name || 'book.pdf',
    } as any);

    const result = await adminBookuploadapi(formData);

    if (result.success) {
      Alert.alert('Success', 'Book uploaded successfully!');
      onClose();
    } else {
      Alert.alert('Upload Failed', result.message || 'Something went wrong');
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropOpacity={0.5}
    >
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>
          <Ionicons name="book-outline" size={30} color="#3b82f6" /> Upload Book
        </Text>

        {/* CATEGORY */}
        <Text style={styles.label}>Category</Text>
        <Dropdown
          style={styles.dropdownInput}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={[
            { label: 'Select Category', value: null },
            ...Array.from(
              new Set(studyMaterialData.map((item) => item.category))
            ).map((level) => ({
              label: level,
              value: level,
            })),
          ]}
          maxHeight={400}
          labelField="label"
          valueField="value"
          placeholder="Select Category"
          value={selectedCategory}
          onChange={(item) => setSelectedCategory(item.value)}
          renderRightIcon={() => (
            <Ionicons name="chevron-down" size={22} color="#aaa" />
          )}
        />

        {!!selectedCategory && (
          <>
            <TextInput
              placeholder="Book Name"
              placeholderTextColor="#888"
              style={styles.input}
              value={bookName}
              onChangeText={setBookName}
            />

            <TextInput
              placeholder="Subject"
              placeholderTextColor="#888"
              style={styles.input}
              value={subject}
              onChangeText={setSubject}
            />

            <Text style={styles.label}>Education Level</Text>
            <Dropdown
              style={styles.dropdownInput}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={[
                { label: 'Select classes', value: null },
                ...Array.from(
                  new Set(studyMaterialData.map((item) => item.educationLevel))
                ).map((level) => ({
                  label: level,
                  value: level,
                })),
              ]}
              maxHeight={400}
              labelField="label"
              valueField="value"
              placeholder="Select classes"
              value={selectedClass}
              onChange={(item) => setSelectedClass(item.value)}
              renderRightIcon={() => (
                <Ionicons name="chevron-down" size={22} color="#aaa" />
              )}
            />

            <Text style={styles.label}>Language</Text>
            <Dropdown
              style={styles.dropdownInput}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={[
                { label: 'Select Language', value: null },
                ...Array.from(
                  new Set(studyMaterialData.map((item) => item.language))
                ).map((level) => ({
                  label: level,
                  value: level,
                })),
              ]}
              maxHeight={400}
              labelField="label"
              valueField="value"
              placeholder="Select Language"
              value={selectedLanguage}
              onChange={(item) => setSelectedLanguage(item.value)}
              renderRightIcon={() => (
                <Ionicons name="chevron-down" size={22} color="#aaa" />
              )}
            />

            <Text style={styles.label}>Thumbnail Image</Text>
            <TouchableOpacity style={styles.fileButton} onPress={pickThumbnail}>
              <Ionicons name="image-outline" size={22} color="#fff" />
              <Text style={styles.fileButtonText}>
                {thumbnail ? thumbnail.name : 'Choose Image'}
              </Text>
            </TouchableOpacity>
            <Text style={styles.label}>Book File (PDF)</Text>
            <TouchableOpacity style={styles.fileButton} onPress={pickBookFile}>
              <Ionicons name="image-outline" size={22} color="#fff" />
              <Text style={styles.fileButtonText}>
                {bookFile ? bookFile.name : 'Choose PDF'}
              </Text>
            </TouchableOpacity>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#ef4444' }]}
                onPress={onClose}
              >
                <Ionicons name="close" size={22} color="#fff" />
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#22c55e' }]}
                onPress={handleUpload}
              >
                <Ionicons name="checkmark" size={22} color="#fff" />
                <Text style={styles.modalBtnText}>Upload</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: '#1e1e2d',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#2a2a3d',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 22,
    marginTop: 20,
  },
  label: {
    color: '#aaa',
    fontSize: 20,
    marginBottom: 4,
    marginTop: 8,
  },
  dropdownInput: {
    height: 50,
    backgroundColor: '#2a2a3d',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  placeholderStyle: {
    color: '#aaa',
    fontSize: 18,
  },
  selectedTextStyle: {
    color: '#fff',
    fontSize: 18,
  },
  fileButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  fileButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    flex: 1,
    marginHorizontal: 4,
  },
  modalBtnText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 4,
  },
});
