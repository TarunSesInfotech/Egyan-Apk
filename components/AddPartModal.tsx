import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Ionicons } from '@expo/vector-icons';

interface AddPartModalProps {
  isVisible: boolean;
  onClose: () => void;
  onUpload: () => void;
  resourceTypes: { label: string; value: string }[];
}

export default function AddPartModal({ isVisible, onClose, resourceTypes }: AddPartModalProps) {
  const [resourceType, setResourceType] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [filePath, setFilePath] = useState('');

  return (
    <Modal visible={isVisible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.box}>
          <View style={styles.headerRow}>
            <Text style={styles.headerText}>Add Part to Chapter</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={26} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Select Resource Type</Text>
          <View style={styles.dropdownWrapper}>
            <Dropdown
              style={styles.dropdownInput}
              data={resourceTypes}
              labelField="label"
              valueField="value"
              placeholder="Select Resource Type"
              value={resourceType}
              onChange={(item) => setResourceType(item.value)}
            />
          </View>

          {resourceType && (resourceType === 'PDF' || resourceType === 'AUDIO') ? (
            <>
              <Text style={styles.label}>Choose File</Text>
              <TouchableOpacity style={styles.uploadBtn}>
                <Text style={{ color: '#fff' }}>{fileName || 'No file chosen'}</Text>
              </TouchableOpacity>
            </>
          ) : resourceType ? (
            <>
              <Text style={styles.label}>Resource Link</Text>
              <TextInput
                placeholder="Paste URL"
                placeholderTextColor="#888"
                style={styles.input}
                value={filePath || ''}
                onChangeText={setFilePath}
              />
            </>
          ) : null}

          <TouchableOpacity style={styles.uploadPartBtn}>
            <Text style={{ color: '#fff', fontWeight: '600' }}>Upload Part</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    backgroundColor: '#1e1e2d',
    width: '90%',
    padding: 16,
    borderRadius: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  label: {
    color: '#fff',
    marginBottom: 6,
    marginTop: 10,
  },
  dropdownWrapper: {
    backgroundColor: '#2a2a3d',
    borderRadius: 8,
  },
  dropdownInput: {
    height: 50,
    paddingHorizontal: 10,
  },
  input: {
    backgroundColor: '#2a2a3d',
    padding: 10,
    borderRadius: 8,
    color: '#fff',
    marginBottom: 10,
  },
  uploadBtn: {
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  uploadPartBtn: {
    backgroundColor: '#22c55e',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
});
