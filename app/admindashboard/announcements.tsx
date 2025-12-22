import {
  addAnnoucements,
  Adminannoucements,
  DeleteAnnouncement,
  UpdateAnnouncement,
} from '@/app/api/adminapi/adminAnnouncements';
import Announcementmodel from '@/components/Announcementmodel';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  ScrollView,
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

export default function Announcementview() {
  const [announcements, setAnnouncements] = useState([]);

  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [editText, setEditText] = useState('');
  const [editId, setEditId] = useState(null);

  const fetchannoucements = async () => {
    try {
      const response = await Adminannoucements();
      if (response.success) {
        setAnnouncements(response.data);
      } else {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Error fetching annoucements',
          textBody: response.message,
          button: 'Try Again',
        });
      }
    } catch (error: any) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Upload Failed',
        textBody: error.message,
        button: 'Try Again',
      });
    }
  };

  useEffect(() => {
    fetchannoucements();
  }, []);

  const handleAddAnnouncement = async () => {
    if (!newAnnouncement.trim()) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: 'Empty announcement',
        textBody: 'Please write something first.',
        button: 'OK',
      });
      return;
    }
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await addAnnoucements({
        text: newAnnouncement,
        token,
      });

      if (response.success) {
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Success',
          textBody: 'Announcement added successfully',
          button: 'OK',
        });

        setNewAnnouncement('');
        fetchannoucements();
      } else {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Failed',
          textBody: response.message,
          button: 'OK',
        });
      }
    } catch (error) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody:
          error instanceof Error ? error.message : 'An unknown error occurred',
        button: 'OK',
      });
    }
  };

  const handleDelete = async (announcementId: Number) => {
    Dialog.show({
      type: ALERT_TYPE.WARNING,
      title: 'Confirm Delete',
      textBody: 'Are you sure you want to delete this annoucements?',
      button: 'Delete',
      onHide: async () => {
        const token = await AsyncStorage.getItem('token');
        const response = await DeleteAnnouncement(announcementId, token);
        if (response.success) {
          Dialog.show({
            type: ALERT_TYPE.SUCCESS,
            title: 'Deleted',
            textBody: 'Annoucements item deleted successfully!',
            button: 'OK',
            onHide: fetchannoucements,
          });
        } else {
          Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: 'Error',
            textBody: response.message || 'Delete failed.',
            button: 'Close',
          });
        }
      },
    });
  };

  const handleUpdateAnnouncement = async () => {
    if (!editText.trim()) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: 'Empty text',
        textBody: 'Announcement text cannot be empty.',
        button: 'OK',
      });
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');

      const response = await UpdateAnnouncement(editId, token, editText);

      if (response.success) {
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Updated',
          textBody: 'Announcement updated successfully',
          button: 'OK',
          onHide: () => {
            setModalVisible(false);
            setEditId(null);
            setEditText('');
            fetchannoucements();
          },
        });
      } else {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Update failed',
          textBody: response.message,
          button: 'OK',
        });
      }
    } catch (error: any) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: error.message,
        button: 'OK',
      });
    }
  };

  return (
    <AlertNotificationRoot>
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
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddAnnouncement}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cardContainer}>
          {announcements.map((item: any) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardText}>{item.text}</Text>
              </View>

              <View style={styles.cardFooter}>
                <View style={styles.dateRow}>
                  <MaterialIcons
                    name="calendar-today"
                    size={20}
                    color="#9ca3af"
                  />
                  <Text style={styles.dateText}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </Text>
                </View>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => {
                      setEditId(item.id);
                      setEditText(item.text);
                      setModalVisible(true);
                    }}
                  >
                    <Text style={styles.editText}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => {
                      handleDelete(item.id);
                    }}
                  >
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
        <Announcementmodel
          visible={isModalVisible}
          editText={editText}
          setEditText={setEditText}
          onClose={() => setModalVisible(false)}
          onUpdate={() => handleUpdateAnnouncement()}
        />
      </ScrollView>
    </AlertNotificationRoot>
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
    justifyContent: 'space-between',
    gap: 15,
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    padding: 15,
    width: '49%',
    height: 140,
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
});
