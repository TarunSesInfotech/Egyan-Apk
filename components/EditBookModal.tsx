import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';

interface Book {
  category: any;
  language: any;
  id: number;
  bookName: string;
  subject: string;
  educationLevel: string;
  thumbnail: string;
  thumbnailProxyUrl: string;
}

interface EditBookModalProps {
  isVisible: boolean;
  editBook: Book | null;
  setEditBook: React.Dispatch<React.SetStateAction<Book | null>>;
  onClose: () => void;
  onUpdate: (book: Book | null) => void;
}

const EditBookModal: React.FC<EditBookModalProps> = ({
  isVisible,
  editBook,
  setEditBook,
  onClose,
  onUpdate,
}) => {
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
          <Ionicons name="create-outline" size={30} color="#facc15" /> Edit Book
        </Text>

        <TextInput
          placeholder="Book Name"
          placeholderTextColor="#888"
          style={styles.input}
          value={editBook?.bookName || ''}
          onChangeText={(text) =>
            setEditBook((prev) => (prev ? { ...prev, bookName: text } : null))
          }
        />

        <TextInput
          placeholder="Subject"
          placeholderTextColor="#888"
          style={styles.input}
          value={editBook?.subject || ''}
          onChangeText={(text) =>
            setEditBook((prev) => (prev ? { ...prev, subject: text } : null))
          }
        />

        <TextInput
          placeholder="Education Level"
          placeholderTextColor="#888"
          style={styles.input}
          value={editBook?.educationLevel || ''}
          onChangeText={(text) =>
            setEditBook((prev) =>
              prev ? { ...prev, educationLevel: text } : null
            )
          }
        />

        <Text style={styles.label}>Thumbnail Image</Text>
        <TouchableOpacity style={styles.fileButton}>
          <Ionicons name="image-outline" size={22} color="#fff" />
          <Text style={styles.fileButtonText}>Choose File</Text>
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
            onPress={() => onUpdate(editBook)}
          >
            <Ionicons name="checkmark" size={22} color="#fff" />
            <Text style={styles.modalBtnText}>Update</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default EditBookModal;

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
  fileButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
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
