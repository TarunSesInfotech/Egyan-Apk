import { Ionicons } from '@expo/vector-icons';
import CheckBox from 'expo-checkbox';
import { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function Announcementview() {
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      text: 'Welcome to the new academic year!',
      date: '2025-09-23',
      important: true,
    },
    {
      id: 2,
      text: 'Library will remain closed on 25th Dec.',
      date: '2025-09-20',
      important: false,
    },
    {
      id: 3,
      text: 'New courses have been added to the curriculum.',
      date: '2025-09-22',
      important: true,
    },
  ]);

  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [editText, setEditText] = useState('');
  const [editImportant, setEditImportant] = useState(false);
  const [editId, setEditId] = useState(null);

  const handleAdd = () => {
    if (!newAnnouncement.trim()) return;
    const newItem = {
      id: Date.now(),
      text: newAnnouncement,
      date: new Date().toISOString().split('T')[0],
      important: isImportant,
    };
    setAnnouncements([newItem, ...announcements]);
    setNewAnnouncement('');
    setIsImportant(false);
  };

  const handleDelete = (id: Number) => {
    setAnnouncements(announcements.filter((a) => a.id !== id));
  };
  const openEditModal = (item: any) => {
    setEditId(item.id);
    setEditText(item.text);
    setEditImportant(item.important);
    setModalVisible(true);
  };
  const handleUpdate = () => {
    setAnnouncements(
      announcements.map((a) =>
        a.id === editId ? { ...a, text: editText, important: editImportant } : a
      )
    );
    setModalVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Announcements</Text>
      <Text style={styles.subtitle}>
        Manage all library announcements here.
      </Text>
      <View style={styles.topRow}>
        <TextInput
          style={styles.input}
          placeholder="Write a new announcement..."
          placeholderTextColor="#9ca3af"
          value={newAnnouncement}
          onChangeText={setNewAnnouncement}
        />

        <View style={styles.checkboxContainer}>
          <CheckBox
            value={isImportant}
            onValueChange={setIsImportant}
            color={isImportant ? '#3b82f6' : undefined}
          />
          <Text style={styles.checkboxLabel}>Important</Text>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cardContainer}>
        {announcements.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardText}>{item.text}</Text>
              {item.important && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>IMPORTANT</Text>
                </View>
              )}
            </View>
            <View style={styles.cardFooter}>
              <View style={styles.dateRow}>
                <Ionicons name="calendar-outline" size={16} color="#9ca3af" />
                <Text style={styles.dateText}>{item.date}</Text>
              </View>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => openEditModal(item)}
                >
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item.id)}
                >
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>
      <Modal transparent visible={isModalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Edit Announcement</Text>

            <TextInput
              style={styles.modalInput}
              multiline
              value={editText}
              onChangeText={setEditText}
            />

            <View style={styles.modalCheckboxRow}>
              <CheckBox
                value={editImportant}
                onValueChange={setEditImportant}
                color={editImportant ? '#3b82f6' : undefined}
              />
              <Text style={styles.modalCheckboxLabel}>Important</Text>
            </View>

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalUpdateButton}
                onPress={handleUpdate}
              >
                <Text style={styles.modalUpdateText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#9ca3af',
    fontSize: 18,
    marginBottom: 20,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    color: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 18,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxLabel: {
    color: '#9ca3af',
    marginLeft: 4,
    fontSize: 18,
  },
  addButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    padding: 15,
    width: '100%',
    height: 150,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardText: {
    color: '#fff',
    fontSize: 20,
    flexShrink: 1,
  },
  badge: {
    backgroundColor: '#3b82f6',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardFooter: {
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    color: '#9ca3af',
    fontSize: 18,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    backgroundColor: '#f59e0b',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  editText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },

  //model css
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },

  modalBox: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000',
  },

  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    height: 100,
    marginBottom: 10,
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#000',
  },

  modalCheckboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  modalCheckboxLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: '#000',
  },

  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },

  modalCancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#000',
  },

  modalCancelText: {
    fontSize: 16,
    color: '#000',
  },

  modalUpdateButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  modalUpdateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
