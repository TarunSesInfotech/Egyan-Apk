import { SchoolEducation } from '@/components/SchoolEducation';
import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { studentStudyMaterialApi } from '../api/studentapi/studyMaterialApi';

export default function StudyMaterial() {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [studyMaterialData, setStudyMaterialData] = useState<any[]>([]);

  const iconMapping: any = {
    'School Education': (
      <FontAwesome5 name="book-reader" size={40} color="#43FF9B" />
    ),
    'Higher Education': <Ionicons name="school" size={42} color="#4DA6FF" />,
    'Competitive Exams': (
      <MaterialIcons name="emoji-events" size={42} color="#FFB800" />
    ),
    'Skill Development': (
      <FontAwesome5 name="laptop-code" size={38} color="#FF5C8A" />
    ),
    'Language Learning': <Ionicons name="language" size={40} color="#00CED1" />,
    'Professional Courses': (
      <MaterialIcons name="work" size={42} color="#8A2BE2" />
    ),
    'Research Material': (
      <FontAwesome5 name="microscope" size={38} color="#FF6347" />
    ),
    'General Knowledge': <Ionicons name="earth" size={42} color="#32CD32" />,
  };

  const fetchStudyMaterial = async () => {
    try {
      const response = await studentStudyMaterialApi();
      if (response.success) {
        setStudyMaterialData(response.data);
        const uniqueCategories = Array.from(
          new Set(response.data.map((item: any) => item.category))
        ) as string[];
        const formattedCategories = uniqueCategories.map(
          (cat: string, index: number) => ({
            id: index + 1,
            title: cat,
            icon: iconMapping[cat] || (
              <FontAwesome5 name="book" size={40} color="#aaa" />
            ),
          })
        );
        setCategories(formattedCategories);
      } else {
        console.error('Error fetching study-material:', response.message);
      }
    } catch (error: any) {
      console.error('Error fetching study-material:', error.message);
    }
  };

  useEffect(() => {
    fetchStudyMaterial();
  }, []);
  return (
    <View style={styles.container}>
      {selectedCategory === 'School Education' ? (
        <SchoolEducation
          data={studyMaterialData}
          onBack={() => setSelectedCategory(null)}
        />
      ) : (
        <ScrollView style={styles.mainContent}>
          <Text style={styles.welcomeText}>Hi, Welcome Mr. Student</Text>
          <Text style={styles.sectionTitle}>📚 Study Material Category</Text>

          <View style={styles.categoriesContainer}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={styles.categoryCard}
                onPress={() => {
                  if (cat.title === 'School Education') {
                    setSelectedCategory('School Education');
                  }
                }}
              >
                <View style={styles.iconContainer}>{cat.icon}</View>
                <Text style={styles.categoryTitle}>{cat.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
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
  welcomeText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  sectionTitle: {
    textAlign: 'center',
    color: '#43FF9B',
    fontSize: 28,
    marginTop: 20,
    marginBottom: 20,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    backgroundColor: '#1E1E2E',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#aaa',
    width: '48%',
    height: 200,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  iconContainer: {
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});
