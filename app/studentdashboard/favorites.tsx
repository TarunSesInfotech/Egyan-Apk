import WelcomeHeader from '@/components/WelcomeHeader';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { studentfavoriteApi } from '../api/studentapi/favoriteApi';

export default function Favorites() {
  const [favoriteBooks, setFavoriteBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchfavorite = async () => {
    try {
      const response = await studentfavoriteApi();
      if (response.success) {
        const formattedBooks = response.data.map((item: any) => ({
          id: item.id,
          title: item.title,
          subject: item.subject,
          type: item.type,
        }));
        setFavoriteBooks(formattedBooks);
      } else {
        console.error('Error fetching favorites:', response.message);
      }
    } catch (error: any) {
      console.error('Error fetching favorites:', error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchfavorite();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.mainContent}>
        <WelcomeHeader />
        <View style={styles.sectionHeader}>
          <Ionicons name="heart" size={40} color="pink" />
          <Text style={styles.sectionTitle}>Favorite Books</Text>
        </View>
        <Text style={styles.subTitle}>
          All the learning materials you’ve marked as favorite.
        </Text>
        <View style={styles.grid}>
          {loading ? (
            <Text style={{ color: '#aaa', fontSize: 18 }}>Loading...</Text>
          ) : favoriteBooks.length === 0 ? (
            <Text style={{ color: '#aaa', fontSize: 18 }}>
              No favorite books found.
            </Text>
          ) : (
            favoriteBooks.map((book) => (
              <View key={book.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{book.title}</Text>
                  <Ionicons name="heart" size={40} color="pink" />
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.cardSubject}>{book.subject}</Text>
                  <Ionicons name="book" size={40} color="#ccc" />
                </View>
                <TouchableOpacity style={styles.button}>
                  <MaterialIcons name="menu-book" size={30} color="#fff" />
                  <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  sectionTitle: {
    color: '#43B0FF',
    fontSize: 28,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  subTitle: {
    color: '#aaa',
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#1E1E2E',
    borderRadius: 12,
    width: '48%',
    padding: 15,
    marginBottom: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 12,
  },
  cardSubject: {
    color: '#ccc',
    fontSize: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2979FF',
    borderRadius: 8,
    paddingVertical: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
    marginLeft: 6,
    fontWeight: '600',
  },
});
