import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function QuizzesList() {
  const [quizzes, setQuizzes] = useState<any[]>([]);

  useEffect(() => {
    setQuizzes([
      { id: 1, title: "Quiz on Algebra" },
      { id: 2, title: "Quiz on World History" },
      { id: 3, title: "Quiz on Environment" },
    ]);
  }, []);

  return (
    <View style={styles.examCard}>
      <View style={styles.examHeader}>
        <Ionicons name="trophy" size={32} color="#FF5C8A" />
        <Text style={styles.examTitle}>Quizzes</Text>
      </View>

      {quizzes.length > 0 ? (
        quizzes.map((item) => (
          <View key={item.id} style={styles.examRow}>
            <Text style={styles.examText}>{item.title}</Text>
            <Pressable
              style={[styles.examBtn, { backgroundColor: "#2ECC71" }]}
              //   onPress={() => console.log("Take Quiz", item.id)}
            >
              <Text style={styles.examBtnText}>Take Quiz</Text>
            </Pressable>
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>No quizzes available</Text>
      )}
    </View>
  );
}

{/* ===================== STYLES ===================== */}
const styles = StyleSheet.create({
  examCard: {
    backgroundColor: "#1E1E2E",
    borderRadius: 16,
    padding: 16,
    marginVertical: 20,
  },
  examHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  examTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 6,
  },
  examRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  examText: {
    color: "#fff",
    fontSize: 17,
    flex: 1,
  },
  examBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  examBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  emptyText: {
    color: "#AAA",
    textAlign: "center"
  },
});
