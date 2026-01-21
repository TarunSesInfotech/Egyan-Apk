/* eslint-disable @typescript-eslint/no-unused-vars */
import StudentCard from "@/components/admincomponents/StudentCard";
import StudentModal from "@/components/admincomponents/StudentModal";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
} from "react-native-alert-notification";
import * as XLSX from "xlsx";
import { userStudentProgress } from "../api/adminapi/adminDashboard";

export type Student = {
  id: number;
  name: string;
  email?: string;
  avg: number;
  books: {
    name: string;
    progress: number;
    color: string;
  }[];
};

export default function ManageStudents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [sortVisible, setSortVisible] = useState(false);
  const [sortType, setSortType] = useState("Name A → Z");

  const fetchStudentProgress = async () => {
    try {
      const response = await userStudentProgress();

      const formatted = response.data.map(
        (s: {
          id: number;
          username: string;
          email: string;
          averageProgress?: number;
          progressByBook: { bookName?: string; progress?: number }[];
        }) => ({
          id: s.id,
          name: s.username,
          email: s.email ?? "",
          avg: s.averageProgress ?? 0,
          books: s.progressByBook.map((b, index) => ({
            name: b.bookName || `Book ${index + 1}`,
            progress: b.progress || 0,
            color: index % 2 === 0 ? "#22c55e" : "#eab308",
          })),
        }),
      );

      setStudents(formatted);
    } catch (err) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error fetching Manage-student",
        button: "Try Again",
      });
    }
  };

  useEffect(() => {
    fetchStudentProgress();
  }, []);

  const filteredStudents = students.filter((student) => {
    const q = searchQuery.toLowerCase();

    return (
      student.name.toLowerCase().includes(q) ||
      student.id.toString().includes(q) ||
      student.avg.toString().includes(q) ||
      student.books.some(
        (book) =>
          book.name.toLowerCase().includes(q) ||
          book.progress.toString().includes(q),
      )
    );
  });

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    switch (sortType) {
      case "Name A → Z":
        return a.name.localeCompare(b.name);
      case "Name Z → A":
        return b.name.localeCompare(a.name);
      case "Avg High → Low":
        return b.avg - a.avg;
      case "Avg Low → High":
        return a.avg - b.avg;
      default:
        return 0;
    }
  });

  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;
  const totalPages = Math.ceil(sortedStudents.length / studentsPerPage);

  const paginatedStudents = sortedStudents.slice(
    (currentPage - 1) * studentsPerPage,
    currentPage * studentsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortType]);

  const openModal = (student: Student) => {
    setSelectedStudent(student);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedStudent(null);
    setModalVisible(false);
  };

  const applySort = (type: string) => {
    setSortType(type);
    setSortVisible(false);
  };

  const exportToExcel = async () => {
    try {
      const excelData = students.map((s) => ({
        ID: s.id,
        Name: s.name,
        Email: s.email,
        AverageProgress: s.avg,
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

      const excelBase64 = XLSX.write(workbook, {
        type: "base64",
        bookType: "xlsx",
      });

      const fileUri = FileSystem.documentDirectory + "students.xlsx";

      await FileSystem.writeAsStringAsync(fileUri, excelBase64, {
        encoding: "base64",
      });

      await Sharing.shareAsync(fileUri);
    } catch (error) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Excel export error",
        button: "Try Again",
      });
    }
  };

  return (
    <AlertNotificationRoot>
      <View style={styles.container}>
        <ScrollView style={styles.mainContent}>
          <View style={styles.headerRow}>
            <Text style={styles.sectionTitle}>Students Progress</Text>

            <View style={styles.rightControls}>
              <TouchableOpacity
                style={styles.exportButton}
                onPress={exportToExcel}
              >
                <Ionicons name="download-outline" size={24} color="#fff" />
                <Text style={styles.exportText}>Export CSV</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.controlsRow}>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={28} color="#bbb" />
              <TextInput
                placeholder="Search name, id, or keywords..."
                placeholderTextColor="#999"
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <View style={styles.dropdownRow}>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setSortVisible(!sortVisible)}
              >
                <Text style={styles.dropdownText}>{sortType} ▼</Text>
              </TouchableOpacity>

              {sortVisible && (
                <View style={styles.dropdownMenu}>
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => applySort("Name A → Z")}
                  >
                    <Text style={styles.dropdownItemText}>Name A → Z</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => applySort("Name Z → A")}
                  >
                    <Text style={styles.dropdownItemText}>Name Z → A</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => applySort("Avg High → Low")}
                  >
                    <Text style={styles.dropdownItemText}>Avg High → Low</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => applySort("Avg Low → High")}
                  >
                    <Text style={styles.dropdownItemText}>Avg Low → High</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          {paginatedStudents.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              openModal={openModal}
            />
          ))}

          <View style={styles.paginationContainer}>
            <Text style={styles.paginationText}>
              Showing {paginatedStudents.length} students — page {currentPage}{" "}
              of {totalPages}
            </Text>

            <View style={styles.paginationButtons}>
              <TouchableOpacity
                style={[
                  styles.pageButton,
                  currentPage === 1 && styles.disabledButton,
                ]}
                disabled={currentPage === 1}
                onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                <Text style={styles.pageButtonText}>Prev</Text>
              </TouchableOpacity>

              <View style={styles.pageIndicator}>
                <Text style={styles.pageNumber}>{currentPage}</Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.pageButton,
                  currentPage === totalPages && styles.disabledButton,
                ]}
                disabled={currentPage === totalPages}
                onPress={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              >
                <Text style={styles.pageButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <StudentModal
          visible={modalVisible}
          onClose={closeModal}
          student={selectedStudent}
        />
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
  welcomeText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  sectionTitle: {
    color: "#aaa",
    fontSize: 23,
    marginTop: 20,
    marginBottom: 15,
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
    borderRadius: 8,
    paddingHorizontal: 14,
    height: 50,
    flex: 1,
    minWidth: 200,
  },
  searchInput: {
    color: "#fff",
    fontSize: 20,
    marginLeft: 6,
    flex: 1,
  },
  dropdownRow: {
    position: "relative",
    width: 170,
  },
  dropdown: {
    backgroundColor: "#1e1e1e",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  dropdownText: {
    color: "#ddd",
    fontSize: 20,
  },
  dropdownMenu: {
    position: "absolute",
    top: 45,
    right: 0,
    backgroundColor: "#1e1e1e",
    borderRadius: 8,
    width: 170,
    paddingVertical: 6,
    zIndex: 2,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  dropdownItemText: {
    color: "#eee",
    fontSize: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  rightControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
  },
  exportButton: {
    backgroundColor: "#2563eb",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  exportText: {
    color: "#fff",
    marginLeft: 6,
    fontSize: 16,
    fontWeight: "600",
  },
  paginationContainer: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 40,
  },
  paginationText: {
    color: "#aaa",
    fontSize: 20,
    textAlign: "center",
  },
  paginationButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 10,
  },
  pageButton: {
    backgroundColor: "#2a2a2a",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },
  disabledButton: {
    opacity: 0.5,
  },
  pageButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  pageIndicator: {
    backgroundColor: "#1e1e1e",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },
  pageNumber: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
});
