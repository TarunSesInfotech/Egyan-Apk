import WelcomeHeader from '@/components/WelcomeHeader';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { TextInput } from 'react-native-gesture-handler';
import {
  addRepository,
  repositoryOverview,
} from '../api/adminapi/adminDashboard';

export default function Repository() {
  const [repositoryData, setRepositoryData] = useState<any[]>([]);
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
  const [selectedValues, setSelectedValues] = useState<{ [key: string]: any }>(
    {}
  );

  const apiKeyMapping: Record<string, string> = {
    ResourceTypes: 'ResourceTypes',
    Subjects: 'Subjects',
    EducationLevels: 'EducationLevels',
    Languages: 'Languages',
    Categories: 'Categories',
  };

  const normalizeRepoItem = (item: any) => {
    const safeSplit = (val: string) =>
      typeof val === 'string' && val.length > 0 ? val.split(',') : [];

    return {
      ...item,
      ResourceTypes: safeSplit(item.ResourceTypes),
      Subjects: safeSplit(item.Subjects),
      EducationLevels: safeSplit(item.EducationLevels),
      Languages: safeSplit(item.Languages),
      Categories: safeSplit(item.Categories),
    };
  };

  const fetchRepository = async () => {
    try {
      const response = await repositoryOverview();
      if (response.success) {
        const data = Array.isArray(response.data)
          ? response.data.map(normalizeRepoItem)
          : [normalizeRepoItem(response.data)];
        setRepositoryData(data);
      } else {
        console.error('Unexpected API format:', response);
      }
    } catch (error: any) {
      console.error('Error fetching repository data:', error.message);
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

  const handleAdd = async (sectionKey: string) => {
    const newValue = inputValues[sectionKey];

    if (!newValue) {
      Alert.alert('Input Required', `Please enter a value for ${sectionKey}`);
      return;
    }

    const token = await AsyncStorage.getItem('token');
    const backendKey = apiKeyMapping[sectionKey];
    const response = await addRepository({
      type: backendKey,
      value: newValue,
      token,
    });

    if (response.success) {
      Alert.alert('Success', 'Repository updated!');
      await fetchRepository();
      setInputValues((prev) => ({ ...prev, [sectionKey]: '' }));
    } else {
      Alert.alert('Error', response.message);
    }
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
    const safeItems = Array.isArray(items) ? items : [];

    return (
      <View key={title} style={styles.sectionWrapper}>
        <Text style={styles.label}>{title.replace(/([A-Z])/g, ' $1')}</Text>
        <GradientBox>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={safeItems.map((i) => ({ label: i, value: i }))}
            labelField="label"
            valueField="value"
            placeholder={`Select ${title}`}
            renderRightIcon={() => (
              <Ionicons name="chevron-down" size={20} color="#fff" />
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
                  <TouchableOpacity style={styles.iconBtn}>
                    <Ionicons name="create-outline" size={20} color="#FFD700" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.iconBtn}
                    // onPress={(i) => console.log(' :>> ', i)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#FF4C4C" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </GradientBox>
        <View style={styles.inputRow}>
          <TextInput
            placeholder={`Add new ${title}`}
            placeholderTextColor="#999"
            style={styles.input}
            value={inputValues[title] || ''}
            onChangeText={(text) => handleInputChange(title, text)}
          />
          <TouchableOpacity
            style={[styles.addButton]}
            onPress={() => handleAdd(title)}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.mainContent}>
        <WelcomeHeader />
        <Text style={styles.sectionTitle}>Create Repository</Text>
        {repositoryData.length > 0 ? (
          repositoryData.map((repo, index) => {
            return (
              <React.Fragment key={index}>
                <View style={styles.gridRow}>
                  {renderSection('ResourceTypes', repo.ResourceTypes)}
                  {renderSection('Subjects', repo.Subjects)}
                </View>

                <View style={styles.gridRow}>
                  {renderSection('EducationLevels', repo.EducationLevels)}
                  {renderSection('Languages', repo.Languages)}
                </View>

                {renderSection('Categories', repo.Categories)}
              </React.Fragment>
            );
          })
        ) : (
          <Text style={styles.loadingText}>Loading repository data...</Text>
        )}
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
    padding: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 28,
    marginTop: 10,
    marginBottom: 20,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionWrapper: {
    width: '48%',
    marginBottom: 22,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
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
  loadingText: {
    color: '#aaa',
    fontSize: 18,
    textAlign: 'center',
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
});
