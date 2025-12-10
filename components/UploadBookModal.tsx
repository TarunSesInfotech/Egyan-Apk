import { repositoryOverview } from '@/app/api/adminapi/adminDashboard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
} from 'react-native-alert-notification';
import { Dropdown } from 'react-native-element-dropdown';
import Modal from 'react-native-modal';
import { adminBookuploadapi } from '../app/api/adminapi/uploadadminbookapi';

interface UploadBookModalProps {
  isVisible: boolean;
  onClose: () => void;
  onUploadSuccess: (bookId: number) => void;
}

export default function UploadBookModal({
  isVisible,
  onClose,
  onUploadSuccess,
}: UploadBookModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [bookName, setBookName] = useState('');
  const [subject, setSubject] = useState('');

  const [repositoryData, setRepositoryData] = useState<{
    category?: any[];
    language?: any[];
    level?: any[];
  }>({});

  const fetchRepository = async () => {
    try {
      const response = await repositoryOverview();

      if (response.success) {
        const grouped = response.data.reduce((acc: any, item: any) => {
          if (!acc[item.type]) acc[item.type] = [];
          acc[item.type].push({
            label: item.text,
            value: item.id,
          });
          return acc;
        }, {});
        setRepositoryData(grouped);
      } else {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Error',
          textBody: response.message || 'Fetching failed',
          button: 'OK',
        });
      }
    } catch (err: any) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: err.message || 'Fetching failed',
        button: 'OK',
      });
    }
  };

  useEffect(() => {
    fetchRepository();
  }, []);

  const handleUpload = async () => {
    const missing = [];
    if (!bookName) missing.push('Book Name');
    if (!selectedCategory) missing.push('Category');
    if (!subject) missing.push('Subject');
    if (!selectedClass) missing.push('Education Level');
    if (!selectedLanguage) missing.push('Language');

    if (missing.length > 0) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Missing Fields',
        textBody: `Please fill the following fields:\n${missing.join('\n')}`,
        button: 'Try Again',
      });
      return;
    }

    const formData = new FormData();

    formData.append('bookName', String(bookName));
    formData.append('category', String(selectedCategory));
    formData.append('subject', String(subject));
    formData.append('educationLevel', String(selectedClass));
    formData.append('language', String(selectedLanguage));

    const access_token = await AsyncStorage.getItem('token');
    try {
      const result = await adminBookuploadapi(formData, access_token);
      if (result.success) {
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Success',
          textBody: 'Book uploaded successfully!',
          button: 'OK',
          onHide: () => {
            setBookName('');
            setSelectedCategory(null);
            setSelectedLanguage(null);
            setSelectedClass(null);
            setSubject('');
            onUploadSuccess(result.result?.id);
          },
        });
      } else {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Upload Failed',
          textBody: result.result?.message || 'Upload failed',
          button: 'Try Again',
        });
      }
    } catch (error: any) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: 'Error',
        textBody: error.message || 'Something went wrong',
        button: 'OK',
      });
    }
  };

  return (
    <AlertNotificationRoot>
      <Modal isVisible={isVisible} onBackdropPress={onClose}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Upload Book</Text>
          <Text style={styles.label}>Select Category</Text>
          <Dropdown
            style={styles.dropdownInput}
            data={repositoryData.category || []}
            labelField="label"
            valueField="value"
            placeholder="Select Category"
            value={selectedCategory}
            onChange={(item) => setSelectedCategory(item.label)}
          />
          {selectedCategory && (
            <>
              <Text style={styles.label}>Education Level</Text>
              <Dropdown
                style={styles.dropdownInput}
                data={repositoryData.level || []}
                labelField="label"
                valueField="value"
                placeholder="Select Education Level"
                value={selectedClass}
                onChange={(item) => setSelectedClass(item.label)}
              />
              <TextInput
                placeholder="Subject"
                style={styles.input}
                value={subject}
                onChangeText={setSubject}
              />
              <TextInput
                placeholder="Book Name"
                style={styles.input}
                value={bookName}
                onChangeText={setBookName}
              />
              <Text style={styles.label}>Language</Text>
              <Dropdown
                style={styles.dropdownInput}
                data={repositoryData.language || []}
                labelField="label"
                valueField="value"
                placeholder="Select Language"
                value={selectedLanguage}
                onChange={(item) => setSelectedLanguage(item.label)}
              />
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: '#ef4444' }]}
                  onPress={onClose}
                >
                  <Text style={styles.modalBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: '#22c55e' }]}
                  onPress={handleUpload}
                >
                  <Text style={styles.modalBtnText}>Upload</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </Modal>
    </AlertNotificationRoot>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: '#CECED7FF',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    color: '#000',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#AEAEB5FF',
    color: '#000',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 18,
    marginTop: 15,
  },
  label: {
    color: '#000',
    fontSize: 18,
    marginBottom: 4,
    marginTop: 8,
  },
  dropdownInput: {
    height: 50,
    backgroundColor: '#AEAEB5FF',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 20,
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
    fontSize: 18,
    marginLeft: 4,
  },
});
