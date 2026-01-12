import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function AssessmentsList() {
  const [assessments, setAssessments] = useState<any[]>([]);

  useEffect(() => {
    setAssessments([
      { id: 1, title: "Math Assessment 1" },
      { id: 2, title: "Science Assessment 2" },
      { id: 3, title: "English Assessment" },
    ]);
  }, []);

  return (
    <View style={styles.examCard}>
      <View style={styles.examHeader}>
        <Ionicons name="document-text" size={32} color="#fff" />
        <Text style={styles.examTitle}>Assessments</Text>
      </View>

      {assessments.length > 0 ? (
        assessments.map((item) => (
          <View key={item.id} style={styles.examRow}>
            <Text style={styles.examText}>{item.title}</Text>
            <Pressable
              style={[styles.examBtn, { backgroundColor: "#2979FF" }]}
              //   onPress={() => console.log("Take Quiz", item.id)}
            >
              <Text style={styles.examBtnText}>Start</Text>
            </Pressable>
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>No assessments available</Text>
      )}
    </View>
  );
}

/* ===================== STYLES ===================== */

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
    textAlign: "center",
  },
});
