import { Student } from '@/app/admindashboard/manage-students';
import React from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  student: Student | null;
};

export default function StudentModal({ visible, onClose, student }: Props) {
  if (!student) return null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>{student.name}</Text>

            <Text style={styles.label}>Average Progress:</Text>
            <Text style={styles.value}>{student.avg}%</Text>

            <Text style={styles.label}>Book-wise Progress</Text>

            {student.books.map((book, index) => (
              <View key={index} style={{ marginBottom: 10 }}>
                <View style={styles.row}>
                  <Text style={styles.bookName}>{book.name}</Text>
                  <Text style={styles.bookPercent}>{book.progress}%</Text>
                </View>

                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${book.progress}%`,
                        backgroundColor: book.color,
                      },
                    ]}
                  />
                </View>
              </View>
            ))}

            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '85%',
    maxHeight: '60%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  label: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  value: {
    fontSize: 15,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bookName: {
    fontSize: 15,
    fontWeight: '500',
  },
  bookPercent: {
    fontSize: 15,
    fontWeight: '500',
  },
  progressTrack: {
    width: '100%',
    backgroundColor: '#ddd',
    height: 8,
    borderRadius: 10,
    marginTop: 4,
  },
  progressFill: {
    height: 8,
    borderRadius: 10,
  },
  closeBtn: {
    marginTop: 20,
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 8,
  },
  closeText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});
