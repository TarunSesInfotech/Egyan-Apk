import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
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
import { Dropdown } from 'react-native-element-dropdown';
import {
  addRepository,
  DeleteRepository,
  repositoryOverview,
  UpdateRepository,
} from '../api/adminapi/adminDashboard';

export default function Repository() {
  const [repositoryData, setRepositoryData] = useState<{
    category?: any[];
    resource?: any[];
    language?: any[];
    level?: any[];
    subject?: any[];
  }>({});
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
  const [selectedValues, setSelectedValues] = useState<{ [key: string]: any }>(
    {}
  );
  const [editData, setEditData] = useState<{
    type?: string;
    id?: number | null;
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
          title: 'Login Failed',
          textBody: response.message || 'Unexpected API format.',
          button: 'Try Again',
        });
      }
    } catch (error: any) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Login Failed',
        textBody: error.message || 'Error fetching repository data.',
        button: 'Try Again',
      });
    }
  };

  useEffect(() => {
    fetchRepository();
  }, []);

  const handleInputChange = (sectionKey: string, value: string) => {
    setInputValues((prev) => ({
      ...prev,
      [sectionKey]: value,
    }));
  };

  const handleAdd = async (type: string) => {
    const newValue = inputValues[type];

    if (!newValue) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Missing Fields',
        textBody: `Input Required , Please enter a value for ${type}`,
        button: 'Close',
      });
      return;
    }

    const token = await AsyncStorage.getItem('token');

    const response = await addRepository({
      type: type,
      text: newValue,
      token,
    });

    if (response.success) {
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Success',
        textBody: 'Repository updated!',
        button: 'OK',
        onHide: async () => {
          await fetchRepository();
          setInputValues((prev) => ({ ...prev, [type]: '' }));
        },
      });
    } else {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: response.message || 'Something went wrong',
        button: 'Try Again',
      });
    }
  };

  const handleUpdate = async (type: string) => {
    const updatedValue = inputValues[type];

    if (!updatedValue || !editData.id) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Missing Fields',
        textBody: 'Please enter value before updating.',
        button: 'Close',
      });
      return;
    }
    const token = await AsyncStorage.getItem('token');
    const response = await UpdateRepository({
      updateId: editData.id,
      value: updatedValue,
      token,
    });

    if (response.success) {
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Updated',
        textBody: 'Updated Successfully!',
        button: 'OK',
        onHide: async () => {
          await fetchRepository();
          setInputValues((prev) => ({ ...prev, [type]: '' }));
          setEditData({});
        },
      });
    }
  };

  const handleDelete = async (repoId: Number) => {
    Dialog.show({
      type: ALERT_TYPE.WARNING,
      title: 'Confirm Delete',
      textBody: 'Are you sure you want to delete this item?',
      button: 'Delete',
      onHide: async () => {
        const token = await AsyncStorage.getItem('token');
        const response = await DeleteRepository(repoId, token);

        if (response.success) {
          Dialog.show({
            type: ALERT_TYPE.SUCCESS,
            title: 'Deleted',
            textBody: 'Repository item deleted successfully!',
            button: 'OK',
            onHide: fetchRepository,
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

  const GradientBox = ({ children }: any) => (
    <LinearGradient
      colors={['#8B4DFF', '#5B2BE3']}
      style={styles.gradientDropdown}
    >
      {children}
    </LinearGradient>
  );

  const renderSection = (title: string, items: any[]) => {
    if (!items) return null;

    return (
      <View key={title} style={styles.sectionWrapper}>
        <Text style={styles.label}>{title}</Text>
        <GradientBox>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={items}
            labelField="label"
            valueField="value"
            placeholder={`Select ${title}`}
            renderRightIcon={() => (
              <Ionicons name="chevron-down" size={28} color="#fff" />
            )}
            value={selectedValues[title] || null}
            onChange={(item) => {
              setSelectedValues((prev) => ({
                ...prev,
                [title]: item.value,
              }));
            }}
            renderItem={(item) => (
              <View style={styles.dropdownItem}>
                <Text style={styles.dropdownItemText}>{item.label}</Text>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity
                    style={styles.iconBtn}
                    onPress={() => {
                      setInputValues((prev) => ({
                        ...prev,
                        [title]: item.label,
                      }));

                      setEditData({
                        type: title,
                        id: item.value,
                      });
                    }}
                  >
                    <Ionicons name="create-outline" size={20} color="#FFD700" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.iconBtn}
                    onPress={() => handleDelete(item.value)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#FF4C4C" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </GradientBox>
        <View style={{ padding: 10, backgroundColor: '#1B1B28' }}>
          <View style={styles.inputRow}>
            <TextInput
              placeholder={`Add new ${title}`}
              placeholderTextColor="#999"
              style={styles.input}
              value={inputValues[title] || ''}
              onChangeText={(text) => handleInputChange(title, text)}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={() =>
                editData.type === title ? handleUpdate(title) : handleAdd(title)
              }
            >
              <Text style={styles.addButtonText}>
                {editData.type === title ? 'Update' : 'Add'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <AlertNotificationRoot>
      <View style={styles.container}>
        <ScrollView style={styles.mainContent}>
          <Text style={styles.sectionTitle}>Create Repository</Text>

          {renderSection('category', repositoryData.category || [])}

          {selectedValues['category'] &&
            renderSection('level', repositoryData.level || [])}

          {selectedValues['level'] &&
            renderSection('subject', repositoryData.subject || [])}

          {renderSection('resource', repositoryData.resource || [])}

          {renderSection('language', repositoryData.language || [])}
        </ScrollView>
      </View>
    </AlertNotificationRoot>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  mainContent: {
    padding: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 28,
    marginTop: 10,
    marginBottom: 20,
  },
  sectionWrapper: {
    marginBottom: 22,
  },
  label: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 8,
    fontWeight: '600',
  },
  gradientDropdown: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  dropdown: {
    height: 45,
  },
  placeholderStyle: {
    color: '#fff',
    fontSize: 16,
  },
  selectedTextStyle: {
    color: '#fff',
    fontSize: 16,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#1B1B28',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  dropdownItemText: {
    color: '#fff',
    fontSize: 16,
  },
  iconBtn: {
    marginLeft: 10,
    padding: 4,
  },
  inputRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#1F1F2E',
    borderRadius: 8,
    paddingHorizontal: 10,
    color: '#fff',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#0fba17',
    paddingHorizontal: 14,
    justifyContent: 'center',
    marginLeft: 6,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
