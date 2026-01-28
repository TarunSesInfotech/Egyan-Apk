import { Student } from "@/app/admindashboard/manage-students";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  student: Student | null;
};

export default function StudentModal({ visible, onClose, student }: Props) {
  if (!student) return null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <View style={styles.header}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {student.name.charAt(0).toLowerCase()}
              </Text>
            </View>
            <Text style={styles.studentName}>{student.name}</Text>
            <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
              <Text style={{ fontSize: 18 }}>✕ close</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.hr} />
          <View style={styles.body}>
            {/* Left Section */}
            <View style={styles.leftBox}>
              <View style={styles.card}>
                <Text style={styles.cardLabel}>Average Progress</Text>
                <Text style={styles.bigValue}>{student.avg}%</Text>
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${student.avg}%`, backgroundColor: "#ef4444" },
                    ]}
                  />
                </View>
              </View>
              <View style={styles.card}>
                <Text style={styles.cardLabel}>Total Books:</Text>
                <Text style={styles.totalBooks}>{student.books.length}</Text>
              </View>
            </View>

            {/* Right Section */}
            <View style={styles.rightBox}>
              <Text style={styles.sectionTitle}>Book-wise Progress</Text>
              <ScrollView showsVerticalScrollIndicator={false}>
                {student.books.map((book, index) => (
                  <View key={index} style={styles.bookCard}>
                    <View style={styles.row}>
                      <Text style={styles.bookName}>{book.name}</Text>
                      <Text style={styles.bookPercent}>{book.progress}%</Text>
                    </View>
                    <View style={styles.progressTrack}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${book.progress}%`,
                            backgroundColor: book.color,
                          },
                        ]}
                      />
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  hr: {
    width: "100%",
    height: 1,
    backgroundColor: "#e5e7eb", // light gray like <hr>
    marginVertical: 10,
  },
  label: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "600",
  },
  value: {
    fontSize: 18,
  },
  closeBtn: {
    marginTop: 20,
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    borderRadius: 8,
  },
  closeText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  modalBox: {
    width: "90%",
    height: "30%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#9333ea",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  studentName: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: "600",
  },
  closeIcon: {
    marginLeft: "auto",
    padding: 6,
    backgroundColor: "#f3f4f6",
    borderRadius: 6,
  },
  body: {
    flex: 1,
    flexDirection: "row",
    gap: 12,
  },
  leftBox: {
    width: "35%",
    gap: 12,
  },
  rightBox: {
    width: "65%",
  },
  card: {
    backgroundColor: "#D2D5D5",
    padding: 12,
    borderRadius: 12,
  },
  cardLabel: {
    fontSize: 16,
    color: "#6b7280",
  },
  bigValue: {
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 6,
  },
  totalBooks: {
    fontSize: 18,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  bookCard: {
    backgroundColor: "#C8C9CB",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bookName: {
    fontSize: 18,
    fontWeight: "500",
  },
  bookPercent: {
    fontSize: 16,
    fontWeight: "600",
  },
  progressTrack: {
    width: "100%",
    backgroundColor: "#e5e7eb",
    height: 8,
    borderRadius: 20,
    marginTop: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 20,
  },
});
