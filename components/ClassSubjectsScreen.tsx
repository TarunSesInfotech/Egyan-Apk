import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import BooksScreen from './BooksScreen';

export const ClassSubjectsScreen = ({ data, onBack }: any) => {
  const [eduState, setEduState] = useState<any[]>([]);
  const [levels, setLevels] = useState<string[]>([]);
  const [subjectLevel, setSubjectLevel] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      setEduState(data);
    }
  }, [data]);

  useEffect(() => {
    if (eduState.length > 0) {
      const uniqueLevels = [
        ...new Set(eduState.map((item) => item.educationLevel)),
      ];
      const uniqueSubject = [...new Set(eduState.map((item) => item.subject))];
      setLevels(uniqueLevels);
      setSubjectLevel(uniqueSubject);
    }
  }, [eduState]);

  if (selectedSubject && selectedLevel) {
    const filteredBooks = data.filter(
      (item: any) =>
        item.subject === selectedSubject &&
        item.educationLevel === selectedLevel
    );

    return (
      <BooksScreen
        onBack={() => {
          setSelectedSubject(null);
          setSelectedLevel(null);
        }}
        data={filteredBooks}
      />
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={40} color="#fff" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      <View style={styles.titleWrapper}>
        <Ionicons
          name="book"
          size={40}
          color="#FFD700"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.title}>Subjects in {levels}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.cardsWrapper}>
        <ScrollView contentContainerStyle={styles.cardsWrapper}>
          {subjectLevel.map((subj, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => {
                setSelectedSubject(subj);
                setSelectedLevel(levels[0]);
              }}
            >
              <Ionicons name="book" size={40} color="#FFD700" />
              <Text style={styles.cardText}>{subj}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1b26',
    padding: 16,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#2e2f3e',
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  backText: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 7,
  },
  cardsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '47%',
    backgroundColor: '#2e2f3e',
    borderRadius: 12,
    padding: 50,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  cardText: {
    fontSize: 24,
    color: '#fff',
    marginTop: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
});
