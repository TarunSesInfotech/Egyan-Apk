import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { userStudentProgress } from '../api/adminapi/adminDashboard';

export default function ManageStudents() {
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchStudentProgress = async () => {
    try {
      const response = await userStudentProgress();

      const formatted = response.data.map(
        (s: {
          id: number;
          username: string;
          averageProgress?: number;
          progressByBook: { bookName?: string; progress?: number }[];
        }) => ({
          id: s.id,
          name: s.username,
          avg: s.averageProgress ?? 0,
          books: s.progressByBook.map((b, index) => ({
            name: b.bookName || `Book ${index + 1}`,
            progress: b.progress || 0,
            color: index % 2 === 0 ? '#22c55e' : '#eab308',
          })),
        })
      );

      setStudents(formatted);
    } catch (err) {
      console.log('err :>> ', err);
    }
  };

  useEffect(() => {
    fetchStudentProgress();
  }, []);

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 500;

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * studentsPerPage,
    currentPage * studentsPerPage
  );

  const openModal = (student: Student) => {
    setSelectedStudent(student);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedStudent(null);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.mainContent}>
        <Text style={styles.welcomeText}>Hi, Welcome Mr. Admin</Text>
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>Students Progress</Text>

          <View style={styles.rightControls}>
            <TouchableOpacity style={styles.exportButton}>
              <Ionicons name="download-outline" size={24} color="#fff" />
              <Text style={styles.exportText}>Export CSV</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.controlsRow}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={18} color="#bbb" />
            <TextInput
              placeholder="Search name or Username..."
              placeholderTextColor="#999"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <View style={styles.dropdownRow}>
            <TouchableOpacity style={styles.dropdown}>
              <Text style={styles.dropdownText}>Name A → Z ▼</Text>
            </TouchableOpacity>
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
            Showing {studentsPerPage} students — page {currentPage} /{' '}
            {totalPages}
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

      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={modalStyles.overlay}>
          <View style={modalStyles.modalBox}>
            {selectedStudent && (
              <>
                <Text style={modalStyles.title}>{selectedStudent.name}</Text>

                <Text style={modalStyles.label}>Average Progress:</Text>
                <Text style={modalStyles.value}>{selectedStudent.avg}%</Text>

                <Text style={modalStyles.label}>Book-wise Progress</Text>

                {selectedStudent.books.map((book, index) => (
                  <View key={index} style={{ marginBottom: 10 }}>
                    <View style={modalStyles.row}>
                      <Text style={modalStyles.bookName}>{book.name}</Text>
                      <Text style={modalStyles.bookPercent}>
                        {book.progress}%
                      </Text>
                    </View>

                    <View style={modalStyles.progressTrack}>
                      <View
                        style={[
                          modalStyles.progressFill,
                          {
                            width: `${book.progress}%`,
                            backgroundColor: book.color,
                          },
                        ]}
                      />
                    </View>
                  </View>
                ))}

                <TouchableOpacity
                  style={modalStyles.closeBtn}
                  onPress={closeModal}
                >
                  <Text style={modalStyles.closeText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

interface StudentBook {
  name: string;
  progress: number;
  color: string;
}

interface Student {
  id: number;
  name: string;
  avg: number;
  books: StudentBook[];
}

function StudentCard({
  student,
  openModal,
}: {
  student: Student;
  openModal: any;
}) {
  const [expanded, setExpanded] = useState(false);
  const animatedHeight = useState(new Animated.Value(0))[0];

  const toggleExpand = () => {
    setExpanded(!expanded);
    Animated.timing(animatedHeight, {
      toValue: expanded ? 0 : 100,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.studentCard}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{student.name.charAt(0)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.studentName}>{student.name}</Text>
        </View>

        <View style={styles.avgContainer}>
          <Text style={styles.avgText}>Avg {student.avg}%</Text>
          <View style={styles.avgBarBackground}>
            <View style={[styles.avgBarFill, { width: `${student.avg}%` }]} />
          </View>
        </View>

        <TouchableOpacity
          style={styles.viewBtn}
          onPress={() => openModal(student)}
        >
          <Text style={styles.viewText}>View</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleExpand} style={styles.expandButton}>
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={22}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      <Animated.View
        style={[
          styles.cardContent,
          { height: animatedHeight, overflow: 'hidden' },
        ]}
      >
        {student.books.map((book, idx) => {
          return (
            <View key={idx} style={styles.progressContainer}>
              <Text style={styles.bookTitle}>{book.name}</Text>
              <View style={styles.progressBarBackground}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${book.progress}%`, backgroundColor: book.color },
                  ]}
                />
              </View>
              <Text style={styles.progressPercent}>{book.progress}%</Text>
              <View style={styles.progressBarBackground}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${book.progress}%`, backgroundColor: book.color },
                  ]}
                />
              </View>
              <Text style={styles.progressPercent}>{book.progress}%</Text>
            </View>
          );
        })}
      </Animated.View>
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
    fontSize: 24,
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: '#aaa',
    fontSize: 23,
    marginTop: 20,
    marginBottom: 15,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    flex: 1,
    minWidth: 200,
  },
  searchInput: {
    color: '#fff',
    marginLeft: 6,
    flex: 1,
  },
  dropdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dropdown: {
    backgroundColor: '#1e1e1e',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  dropdownText: {
    color: '#ddd',
    fontSize: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 15,
  },
  rightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  exportButton: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  exportText: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 16,
    fontWeight: '600',
  },
  studentCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  studentName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  avgContainer: {
    alignItems: 'flex-end',
  },
  avgText: {
    color: '#ccc',
    fontSize: 13,
    marginBottom: 4,
  },
  avgBarBackground: {
    width: 70,
    height: 8,
    backgroundColor: '#333',
    borderRadius: 5,
  },
  avgBarFill: {
    height: 8,
    backgroundColor: '#22c55e',
    borderRadius: 5,
  },
  expandButton: {
    marginLeft: 10,
  },
  cardContent: {
    marginTop: 10,
  },
  progressContainer: {
    marginBottom: 12,
  },
  bookTitle: {
    color: '#fff',
    marginBottom: 6,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#333',
    borderRadius: 5,
  },
  progressBarFill: {
    height: 8,
    borderRadius: 5,
  },
  progressPercent: {
    color: '#aaa',
    marginTop: 4,
    fontSize: 13,
    textAlign: 'right',
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333',
    width: 60,
    borderRadius: 5,
  },
  viewText: {
    color: '#C9CCD1FF',
    margin: 4,
    fontSize: 16,
    fontWeight: '600',
  },
  paginationContainer: {
    flexDirection: 'row',
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  paginationText: {
    color: '#aaa',
    marginBottom: 12,
    fontSize: 14,
    textAlign: 'center',
  },
  paginationButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 10,
  },
  pageButton: {
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },
  disabledButton: {
    opacity: 0.5,
  },
  pageButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  pageIndicator: {
    backgroundColor: '#1e1e1e',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },
  pageNumber: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  label: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  value: {
    fontSize: 15,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bookName: {
    fontSize: 15,
    fontWeight: '500',
  },
  bookPercent: {
    fontSize: 15,
    fontWeight: '500',
  },
  progressTrack: {
    width: '100%',
    backgroundColor: '#ddd',
    height: 8,
    borderRadius: 10,
    marginTop: 4,
  },
  progressFill: {
    height: 8,
    borderRadius: 10,
  },
  closeBtn: {
    marginTop: 20,
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 8,
  },
  closeText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});
