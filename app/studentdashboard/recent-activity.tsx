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
import { studentRecentActivity } from '../api/studentapi/recentActivityApi';

export default function RecentActivity() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecentActivity = async () => {
    try {
      const response = await studentRecentActivity();

      if (response.success) {
        const formattedBooks = response.data.map((item: any) => ({
          id: item.id,
          title: item.bookName,
          subject: item.subject,
          type: item.type,
          progress: Math.floor(Math.random() * 100),
          lastAccessed: new Date(item.lastAccessed).toLocaleString(),
        }));
        setBooks(formattedBooks);
      } else {
        console.error('Error fetching recent-books:', response.message);
      }
    } catch (error: any) {
      console.error('Error fetching recent-books:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const truncateText = (text: string, wordLimit: number) => {
    if (!text) return '';
    const words = text.trim().split(/\s+/);
    if (words.length <= wordLimit) {
      return text;
    }
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.mainContent}>
        <WelcomeHeader />
        <View style={styles.sectionHeader}>
          <Ionicons name="book" size={40} color="#43B0FF" />
          <Text style={styles.sectionTitle}>Recently Read Books</Text>
        </View>
        <Text style={styles.subTitle}>
          View your recently accessed digital books with reading progress.
        </Text>

        <View style={styles.grid}>
          {loading ? (
            <Text style={{ color: '#aaa', fontSize: 18 }}>Loading...</Text>
          ) : books.length === 0 ? (
            <Text style={{ color: '#aaa', fontSize: 18 }}>
              No recent activity found.
            </Text>
          ) : (
            books.map((book) => (
              <View key={book.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{book.title}</Text>
                  <Text style={styles.cardSubject}>
                    {truncateText(book.subject, 1)}
                  </Text>
                </View>
                <Text style={styles.progressText}>Progress</Text>
                <View style={styles.progressBarBackground}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${book.progress}%` },
                    ]}
                  />
                </View>
                <Text style={styles.progressPercent}>{book.progress}%</Text>
                <Text style={styles.lastAccessed}>
                  Last Accessed: {book.lastAccessed}
                </Text>
                <TouchableOpacity style={styles.button}>
                  <MaterialIcons name="menu-book" size={28} color="#fff" />
                  <Text style={styles.buttonText}>Continue Reading</Text>
                  <Ionicons
                    name="arrow-forward"
                    size={30}
                    color="#fff"
                    style={styles.icon}
                  />
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
    marginTop: 26,
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#43B0FF',
    fontSize: 28,
    fontWeight: 'bold',
    marginLeft: 10,
    marginBottom: 8,
  },
  subTitle: {
    color: '#aaa',
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
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
    fontSize: 30,
    fontWeight: 'bold',
  },
  cardSubject: {
    color: '#ccc',
    fontSize: 22,
  },
  progressText: {
    color: '#ccc',
    marginTop: 10,
    fontSize: 18,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#333',
    borderRadius: 5,
    marginTop: 5,
  },
  progressBarFill: {
    height: 8,
    backgroundColor: '#43FF9B',
    borderRadius: 5,
  },
  progressPercent: {
    color: '#ccc',
    fontSize: 18,
    marginTop: 3,
  },
  lastAccessed: {
    color: '#aaa',
    fontSize: 18,
    marginTop: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2979FF',
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
    marginHorizontal: 8,
    fontWeight: '600',
  },
  icon: {
    marginTop: 5,
  },
});
