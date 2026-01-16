import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

interface Book {
  title: string;
  class: string;
  percentage: number;
}

interface SubjectProgress {
  subject: string;
  percent: number;
  books: Book[];
}

export default function SubjectWiseProgress({
  data,
}: {
  data: SubjectProgress[];
}) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <View style={styles.progressSection}>
      <Text style={styles.progressTitle}>📚 Subject-wise Progress</Text>
      <ScrollView style={styles.ProgressScroll} showsVerticalScrollIndicator={true}>
        {data.map((item, idx) => {
          const expanded = expandedIndex === idx;

          return (
            <View key={idx} style={styles.subjectCard}>
              <TouchableOpacity
                style={styles.subjectHeader}
                onPress={() => setExpandedIndex(expanded ? null : idx)}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.progressLabel}>{item.subject}</Text>

                  <View style={styles.progressBarBackground}>
                    <View
                      style={[
                        styles.progressBarFill,
                        { width: `${item.percent}%` },
                      ]}
                    />
                  </View>
                </View>

                <Text style={styles.progressPercent}>{item.percent}%</Text>

                <Ionicons
                  name={expanded ? "chevron-up" : "chevron-down"}
                  size={26}
                  color="#fff"
                />
              </TouchableOpacity>
              {expanded && (
                <View style={styles.dropdownContent}>
                  <ScrollView
                    style={styles.bookScroll}
                    showsVerticalScrollIndicator={true}
                  >
                    {item.books && item.books.length > 0 ? (
                      item.books.map((book, i) => (
                        <View key={i} style={styles.bookCard}>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.bookTitle}>{book.title}</Text>
                            <Text style={styles.bookClass}>
                              Class {book.class}
                            </Text>
                          </View>

                          <View style={styles.bookRight}>
                            <Text style={styles.bookPercent}>
                              {book.percentage}%
                            </Text>
                          </View>
                        </View>
                      ))
                    ) : (
                      <Text style={styles.dropdownText}>
                        No books available
                      </Text>
                    )}
                  </ScrollView>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  ProgressScroll: {
    maxHeight: 810,
  },
  progressSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#1E1E2E",
    borderRadius: 12,
  },
  progressTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#43FF9B",
    marginBottom: 15,
  },
  subjectCard: {
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  subjectHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  progressLabel: {
    color: "#fff",
    fontSize: 18,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: "#333",
    borderRadius: 5,
    marginTop: 6,
  },
  progressBarFill: {
    height: 8,
    backgroundColor: "#43FF9B",
    borderRadius: 5,
  },
  progressPercent: {
    color: "#ccc",
    width: 40,
    textAlign: "right",
    fontSize: 18,
  },
  dropdownContent: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  dropdownText: {
    color: "#ccc",
    fontSize: 16,
    marginBottom: 6,
  },
  bookScroll: {
    maxHeight: 248,
  },

  bookCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A3C",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },

  bookTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  bookClass: {
    color: "#aaa",
    fontSize: 16,
    marginTop: 2,
  },

  bookRight: {
    backgroundColor: "#1E1E2E",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },

  bookPercent: {
    color: "#43FF9B",
    fontSize: 20,
    fontWeight: "bold",
  },
});
