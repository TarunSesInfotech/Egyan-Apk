import BookDetailScreen from "@/components/BookDetailScreen";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
} from "react-native-alert-notification";
import {
  studentfavoriteApi,
  studentfavoritetoggleApi,
} from "../api/studentapi/favoriteApi";

export default function Favorites() {
  const [favoriteBooks, setFavoriteBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<any>(null);

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
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "Error",
          textBody: response.message || "Failed to submit concern",
          button: "OK",
        });
      }
    } catch (error: any) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: error.message || "Failed to submit concern",
        button: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (bookId: any) => {
    try {
      const response = await studentfavoritetoggleApi(bookId);
      if (response.success) {
        setFavoriteBooks((prev) => prev.filter((book) => book.id !== bookId));
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Success",
          textBody: "Removed from favorites",
          button: "OK",
        });
      } else {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "Error",
          textBody: response.message || "Failed to toggle favorite",
          button: "OK",
        });
      }
    } catch (error: any) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: error.message || "Something went wrong",
        button: "OK",
      });
    }
  };

  useEffect(() => {
    fetchfavorite();
  }, []);

  if (selectedBook) {
    const bookData = favoriteBooks.find((b) => b.id === selectedBook);
    return (
      <BookDetailScreen data={bookData} onBack={() => setSelectedBook(false)} />
    );
  }

  return (
    <AlertNotificationRoot>
      <View style={styles.container}>
        <ScrollView style={styles.mainContent}>
          <View style={{ flexDirection: "row" }}>
            <Ionicons name="heart" size={40} color="pink" />
            <Text style={styles.sectionTitle}>Favorite Books</Text>
          </View>
          <Text style={styles.subTitle}>
            All the learning materials you’ve marked as favorite.
          </Text>
          <View style={styles.grid}>
            {loading ? (
              <Text style={{ color: "#aaa", fontSize: 18 }}>Loading...</Text>
            ) : favoriteBooks.length === 0 ? (
              <Text style={{ color: "#aaa", fontSize: 18 }}>
                No favorite books found.
              </Text>
            ) : (
              favoriteBooks.map((book) => (
                <View key={book.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{book.title}</Text>
                    <TouchableOpacity onPress={() => toggleFavorite(book.id)}>
                      <Ionicons
                        name="heart"
                        size={40}
                        color="pink"
                        style={styles.Icon}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.cardBody}>
                    <Text style={styles.cardSubject}>{book.subject}</Text>
                    <Ionicons
                      name="book"
                      size={40}
                      color="#ccc"
                      style={styles.Icon}
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => setSelectedBook(book.id)}
                  >
                    <MaterialIcons name="menu-book" size={30} color="#fff" />
                    <Text style={styles.buttonText}>Continue</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </AlertNotificationRoot>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  mainContent: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    color: "#43B0FF",
    fontSize: 26,
    fontWeight: "bold",
    marginLeft: 10,
  },
  subTitle: {
    color: "#aaa",
    fontSize: 22,
    marginTop: 5,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
  },
  card: {
    backgroundColor: "#1E1E2E",
    borderRadius: 12,
    width: "49%",
    padding: 14,
    marginBottom: 15,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  cardBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginLeft: 5,
  },
  cardSubject: {
    color: "#ccc",
    fontSize: 20,
  },
  Icon: {
    backgroundColor: "#2A2A3C",
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2979FF",
    borderRadius: 8,
    paddingVertical: 8,
    marginTop: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 24,
    marginLeft: 6,
    fontWeight: "600",
  },
});
