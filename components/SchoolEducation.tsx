import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ClassSubjectsScreen } from './ClassSubjectsScreen';

export const SchoolEducation = ({ data, onBack }: any) => {
  const [selectedEducation, setSelectedEducation] = useState<any>(null);

  const uniqueData = useMemo(() => {
    const seen = new Set();
    return data.filter((item: any) => {
      if (seen.has(item.educationLevel)) {
        return false;
      }
      seen.add(item.educationLevel);
      return true;
    });
  }, [data]);

  if (selectedEducation) {
    return (
      <ClassSubjectsScreen
        data={data.filter(
          (item: any) =>
            item.educationLevel === selectedEducation.educationLevel
        )}
        onBack={() => setSelectedEducation(null)}
      />
    );
  }

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => setSelectedEducation(item)}
    >
      <Ionicons name="book-outline" size={44} color="#4da6ff" />
      <Text style={styles.cardText}>{item.educationLevel}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={40} color="#fff" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      <View style={styles.header}>
        <Ionicons name="school-outline" size={40} color="#4da6ff" />
        <Text style={styles.headerText}>School Education</Text>
      </View>
      <FlatList
        data={uniqueData}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1123',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backText: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    flex: 1,
    backgroundColor: '#1c1f35',
    borderRadius: 12,
    paddingVertical: 40,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#aaa',
  },
  cardText: {
    fontSize: 24,
    marginTop: 8,
    color: '#fff',
    fontWeight: '600',
  },
});
