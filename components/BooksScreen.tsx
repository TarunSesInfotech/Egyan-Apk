import { StudentToggleFavorite } from '@/app/api/studentapi/studyMaterialApi';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import BookDetailScreen from './BookDetailScreen';

const BooksScreen = ({ data, onBack }: any) => {
  const [books, setBooks] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
  const [selectedBook, setSelectedBook] = useState<any>(null);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setBooks(data);

      const favInit: { [key: string]: boolean } = {};
      data.forEach((book) => {
        favInit[book.id] = book.isFavorite || false;
      });
      setFavorites(favInit);
    }
  }, [data]);

  if (selectedBook) {
    return (
      <BookDetailScreen
        onBack={() => {
          setSelectedBook(null);
        }}
        data={selectedBook}
      />
    );
  }

  const toggleFavorite = (bookId: string) => {
    StudentToggleFavorite(bookId);
    setFavorites((prev) => ({
      ...prev,
      [bookId]: !prev[bookId],
    }));
  };

  const titleText =
    books.length > 0
      ? `Books for ${books[0].subject} (${books[0].educationLevel})`
      : 'Books';

  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('/s/')) {
      return `${url}/download`;
    }
    return url;
  };

  const truncateText = (text: string, wordLimit: number) => {
    if (!text) return '';
    const words = text.trim().split(/\s+/);
    if (words.length <= wordLimit) {
      return text;
    }
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={40} color="#fff" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.titleRow}>
        <Ionicons
          name="book"
          size={40}
          color="#fff"
          style={{ marginRight: 6 }}
        />
        <Text style={styles.title}>{titleText}</Text>
      </View>

      <View style={styles.grid}>
        {books.map((book) => {
          const isFav = favorites[book.id] || false;
          return (
            <TouchableOpacity
              key={book.id}
              style={styles.card}
              onPress={() => setSelectedBook(book)}
            >
              <Image
                source={{ uri: getImageUrl(book.thumbnail) }}
                style={styles.image}
              />
              <View style={styles.cardFooter}>
                <Text style={styles.backText}>
                  {truncateText(book.bookName, 3)}
                </Text>
                <TouchableOpacity onPress={() => toggleFavorite(book.id)}>
                  <Ionicons
                    name={isFav ? 'heart' : 'heart-outline'}
                    size={40}
                    color={isFav ? 'red' : '#fff'}
                  />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default BooksScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e2f',
    padding: 15,
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#2c2c3c',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#fff',
    width: '49%',
  },
  image: {
    width: '100%',
    height: 250,
  },
  cardFooter: {
    padding: 10,
    backgroundColor: '#3a3a4d',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
