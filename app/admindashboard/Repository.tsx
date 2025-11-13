import WelcomeHeader from '@/components/WelcomeHeader';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { repositoryOverview } from '../api/adminapi/adminDashboard';

export default function Repository() {
  const [repositoryData, setRepositoryData] = useState<any[]>([]);
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});

  const fetchRepository = async () => {
    try {
      const response = await repositoryOverview();
      if (response.success && Array.isArray(response.data)) {
        setRepositoryData(response.data);
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

  const handleAdd = (sectionKey: string) => {
    const value = inputValues[sectionKey]?.trim();
    if (!value) return;
    alert(`Added "${value}" to ${sectionKey}`);
    setInputValues((prev) => ({ ...prev, [sectionKey]: '' }));
  };

  const renderSection = (title: string, items: string[], color: string) => (
    <View key={title} style={[styles.card, { borderLeftColor: color }]}>
      <Text style={styles.cardTitle}>{title}</Text>

      {items.map((item, i) => (
        <Text key={i} style={styles.cardItem}>
          • {item}
        </Text>
      ))}

      <View style={styles.inputRow}>
        <TextInput
          placeholder={`Add new ${title.toLowerCase().slice(0, -1)}`}
          placeholderTextColor="#888"
          style={styles.input}
          value={inputValues[title] || ''}
          onChangeText={(text) => handleInputChange(title, text)}
        />
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: color }]}
          onPress={() => handleAdd(title)}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const colorMap: { [key: string]: string } = {
    ResourceTypes: '#3b82f6',
    Subjects: '#22c55e',
    EducationLevels: '#f97316',
    Languages: '#eab308',
    Categories: '#a855f7',
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.mainContent}>
        <WelcomeHeader />
        <Text style={styles.sectionTitle}>Repository Management</Text>

        {repositoryData.length > 0 ? (
          repositoryData.map((repo, index) => (
            <React.Fragment key={index}>
              {Object.entries(repo as Record<string, unknown>).map(
                ([key, value]) => {
                  if (key === 'id') return null;
                  let items: string[] = [];
                  if (typeof value === 'string') {
                    items = value.split(',').map((i) => i.trim());
                  } else if (Array.isArray(value)) {
                    items = value.map((v) => String(v).trim());
                  } else if (value == null) {
                    items = [];
                  } else {
                    items = [String(value).trim()];
                  }
                  return renderSection(key, items, colorMap[key] || '#555');
                }
              )}
            </React.Fragment>
          ))
        ) : (
          <Text style={{ color: '#aaa', fontSize: 18, textAlign: 'center' }}>
            Loading repository data...
          </Text>
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
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 28,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#1e1e2d',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 14,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  cardItem: {
    color: '#aaa',
    fontSize: 20,
    marginLeft: 6,
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#2c2c3a',
    borderRadius: 8,
    paddingHorizontal: 10,
    color: '#fff',
    marginRight: 8,
    fontSize: 20,
  },
  addButton: {
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
});
