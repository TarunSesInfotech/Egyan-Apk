import { CurrentAffairs } from '@/components/CurrentAffairs';
import { SchoolEducation } from '@/components/SchoolEducation';
import { Simulation } from '@/components/Simulation';
import { FontAwesome5 } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  studentStudyMaterialApi,
  studentStudyMaterialcategoryApi,
} from '../api/studentapi/studyMaterialApi';

export default function StudyMaterial() {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [studyMaterialData, setStudyMaterialData] = useState<any[]>([]);

  const iconMapping: any = {
    'School Education': (
      <FontAwesome5 name="book-reader" size={40} color="#43FF9B" />
    ),
    'Current Affairs': (
      <FontAwesome5 name="newspaper" size={40} color="#43FF9B" />
    ),
    Simulation: <FontAwesome5 name="tools" size={40} color="#43FF9B" />,
  };

  const fetchStudyMaterial = async () => {
    try {
      const response = await studentStudyMaterialApi();
      if (response.success) {
        setStudyMaterialData(response.data);
      } else {
        console.error('Error fetching study-material:', response.message);
      }
    } catch (error: any) {
      console.error('Error fetching study-material:', error.message);
    }
  };

  const fetchRepositoryApi = async () => {
    try {
      const response = await studentStudyMaterialcategoryApi();
      if (response.success) {
        const formattedCategories = response.data.map((item: any) => ({
          id: item.id,
          title: item.text,
          icon: iconMapping[item.text] || (
            <FontAwesome5 name="book" size={40} color="#aaa" />
          ),
        }));

        setCategories(formattedCategories);
      }
    } catch (error: any) {
      console.error('Error fetching repository:', error.message);
    }
  };

  useEffect(() => {
    fetchStudyMaterial();
    fetchRepositoryApi();
  }, []);

  return (
    <View style={styles.container}>
      {selectedCategory === 'School Education' ? (
        <SchoolEducation
          data={studyMaterialData}
          onBack={() => setSelectedCategory(null)}
        />
      ) : selectedCategory === 'Simulation' ? (
        <Simulation onBack={() => setSelectedCategory(null)} />
      ) : selectedCategory === 'Current Affairs' ? (
        <CurrentAffairs onBack={() => setSelectedCategory(null)} />
      ) : (
        <ScrollView style={styles.mainContent}>
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
                  if (cat.title === 'Current Affairs') {
                    setSelectedCategory('Current Affairs');
                  }
                  if (cat.title === 'Simulation') {
                    setSelectedCategory('Simulation');
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
