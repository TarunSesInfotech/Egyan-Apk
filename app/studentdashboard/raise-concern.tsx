import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  raiseConcernApi,
  raiseConcernPostApi,
} from '../api/studentapi/raiseConcernApi';

export default function RaiseConcern() {
  const [subject, setSubject] = useState('');
  const [issueType, setIssueType] = useState('');
  const [priority, setPriority] = useState('');
  const [message, setMessage] = useState('');
  const [attachment, setAttachment] =
    useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [previousConcerns, setPreviousConcerns] = useState<any[]>([]);

  const fetchRaiseConncern = async () => {
    try {
      const response = await raiseConcernApi();

      if (response.success) {
        setPreviousConcerns(response.data);
      } else {
        console.error('Error fetching  raise-Concern:', response.message);
      }
    } catch (error: any) {
      console.error('Error fetching  raise-Concern:', error.message);
    }
  };

  useEffect(() => {
    fetchRaiseConncern();
  }, []);

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
    });

    if (result.assets && result.assets.length > 0) {
      setAttachment(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!subject || !issueType || !priority || !message) {
      Alert.alert('Validation Error', 'Please fill all required fields.');
      return;
    }

    const concernData = {
      subject,
      issueType,
      priority,
      message,
    };

    const response = await raiseConcernPostApi(concernData, attachment);
    if (response.success) {
      Alert.alert('Success', 'Concern submitted successfully!');
      setSubject('');
      setIssueType('');
      setPriority('');
      setMessage('');
      setAttachment(null);
      fetchRaiseConncern();
    } else {
      Alert.alert('Error', response.message || 'Failed to submit concern');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.mainContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <MaterialIcons name="error-outline" size={40} color="#FF4B4B" />
          <Text style={styles.headerTitle}>Raise a Concern</Text>
        </View>
        <Text style={styles.headerSub}>
          If you're facing issues with content or system access, report it
          below.
        </Text>
        <Text style={styles.label}>Subject</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. History video not playing"
          placeholderTextColor="#888"
          value={subject}
          onChangeText={setSubject}
        />
        <Text style={styles.label}>Issue Type</Text>
        <View style={styles.dropdown}>
          <Picker
            selectedValue={issueType}
            onValueChange={(itemValue: string) => setIssueType(itemValue)}
            style={styles.picker}
            dropdownIconColor="#fff"
          >
            <Picker.Item label="Select Type" value="" />
            <Picker.Item label="Content Issue" value="content" />
            <Picker.Item label="Access Problem" value="access" />
            <Picker.Item label="Performance Issue" value="performance" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </View>
        <Text style={styles.label}>Priority</Text>
        <View style={styles.dropdown}>
          <Picker
            selectedValue={priority}
            onValueChange={(itemValue: string) => setPriority(itemValue)}
            style={styles.picker}
            dropdownIconColor="#fff"
          >
            <Picker.Item label="Select Priority" value="" />
            <Picker.Item label="Low" value="low" />
            <Picker.Item label="Medium" value="medium" />
            <Picker.Item label="High" value="high" />
          </Picker>
        </View>
        <Text style={styles.label}>Message</Text>
        <TextInput
          style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
          placeholder="Describe the issue you're facing..."
          placeholderTextColor="#888"
          multiline
          value={message}
          onChangeText={setMessage}
        />
        <Text style={styles.label}>Attach Screenshot (optional)</Text>
        <TouchableOpacity style={styles.uploadBtn} onPress={pickFile}>
          <Text style={styles.uploadText}>
            📎 {attachment ? attachment.name : 'Attach File'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit Concern</Text>
        </TouchableOpacity>

        <View style={styles.previousContainer}>
          <Text style={styles.previousTitle}>My Previous Concerns</Text>

          {previousConcerns.length === 0 ? (
            <Text style={styles.previousItem}>No concerns raised yet.</Text>
          ) : (
            <>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, { flex: 2 }]}>
                  Subject
                </Text>
                <Text style={styles.tableHeaderText}>Type</Text>
                <Text style={styles.tableHeaderText}>Priority</Text>
                <Text style={styles.tableHeaderText}>Status</Text>
              </View>
              {previousConcerns.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { flex: 2 }]}>
                    {item.subject}
                  </Text>
                  <Text style={styles.tableCell}>{item.issueType}</Text>
                  <Text style={styles.tableCell}>{item.priority}</Text>
                  <View
                    style={[styles.tableCell, { alignItems: 'flex-start' }]}
                  >
                    <TouchableOpacity
                      style={[
                        styles.statusBtn,
                        item.status === 'Resolved'
                          ? styles.resolved
                          : item.status === 'Pending'
                          ? styles.pending
                          : styles.rejected,
                      ]}
                    >
                      <Text style={styles.statusText}>{item.status}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  mainContent: {
    flex: 1,
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  headerSub: {
    fontSize: 20,
    color: '#aaa',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    borderRadius: 8,
    padding: 18,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#2c2c2c',
    fontSize: 18,
  },
  label: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 6,
    marginTop: 10,
  },
  dropdown: {
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#2c2c2c',
  },
  picker: { color: '#fff' },
  uploadBtn: {
    padding: 18,
    borderRadius: 8,
    backgroundColor: '#1e1e1e',
    borderWidth: 1,
    borderColor: '#2c2c2c',
    marginBottom: 20,
  },
  uploadText: {
    color: '#aaa',
    fontSize: 18,
  },
  submitBtn: {
    backgroundColor: '#2979FF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 25,
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 24,
  },
  previousContainer: {
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    padding: 15,
    marginTop: 30,
  },
  previousTitle: {
    fontSize: 28,
    color: '#fff',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  previousItem: {
    fontSize: 14,
    color: '#aaa',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#444',
    paddingVertical: 6,
  },
  tableHeaderText: {
    flex: 1,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 22,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#2c2c2c',
    alignItems: 'center',
  },
  tableCell: {
    flex: 1,
    color: '#aaa',
    fontSize: 18,
  },
  statusBtn: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  resolved: {
    backgroundColor: '#4CAF50',
  },
  pending: {
    backgroundColor: '#FFC107',
  },
  rejected: {
    backgroundColor: '#F44336',
  },
});
