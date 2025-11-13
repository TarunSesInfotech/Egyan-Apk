import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Switch } from 'react-native-switch';

export default function ManageStudents() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isVirtualized, setIsVirtualized] = useState(true);

  const students = [
    {
      id: 1,
      name: 'Student 1',
      email: 'student1@example.com',
      class: 'Class 1',
      subject: 'Mathematics',
      avg: 82,
      books: [
        { name: 'Book A - Class 1', progress: 100, color: '#22c55e' },
        { name: 'Book B - Class 1', progress: 63, color: '#eab308' },
      ],
    },
    {
      id: 2,
      name: 'Student 10',
      email: 'student10@example.com',
      class: 'Class 10',
      subject: 'Mathematics',
      avg: 60,
      books: [
        { name: 'Book A - Class 10', progress: 23, color: '#22c55e' },
        { name: 'Book B - Class 10', progress: 97, color: '#eab308' },
      ],
    },
    {
      id: 3,
      name: 'Student 100',
      email: 'student100@example.com',
      class: 'Class 4',
      subject: 'Mathematics',
      avg: 27,
      books: [
        { name: 'Book A - Class 4', progress: 14, color: '#22c55e' },
        { name: 'Book B - Class 4', progress: 40, color: '#eab308' },
      ],
    },
    {
      id: 4,
      name: 'Student 101',
      email: 'student101@example.com',
      class: 'Class 5',
      subject: 'Science',
      avg: 68,
      books: [
        { name: 'Book A - Class 5', progress: 50, color: '#22c55e' },
        { name: 'Book B - Class 5', progress: 85, color: '#eab308' },
      ],
    },
    {
      id: 5,
      name: 'Student 102',
      email: 'student102@example.com',
      class: 'Class 6',
      subject: 'English',
      avg: 80,
      books: [
        { name: 'Book A - Class 6', progress: 76, color: '#22c55e' },
        { name: 'Book B - Class 6', progress: 83, color: '#eab308' },
      ],
    },
    {
      id: 6,
      name: 'Student 103',
      email: 'student103@example.com',
      class: 'Class 7',
      subject: 'Mathematics',
      avg: 6,
      books: [
        { name: 'Book A - Class 7', progress: 11, color: '#22c55e' },
        { name: 'Book B - Class 7', progress: 1, color: '#eab308' },
      ],
    },
    {
      id: 7,
      name: 'Student 104',
      email: 'student104@example.com',
      class: 'Class 8',
      subject: 'Science',
      avg: 68,
      books: [
        { name: 'Book A - Class 8', progress: 75, color: '#22c55e' },
        { name: 'Book B - Class 8', progress: 60, color: '#eab308' },
      ],
    },
    {
      id: 8,
      name: 'Student 105',
      email: 'student105@example.com',
      class: 'Class 9',
      subject: 'English',
      avg: 18,
      books: [
        { name: 'Book A - Class 9', progress: 6, color: '#22c55e' },
        { name: 'Book B - Class 9', progress: 30, color: '#eab308' },
      ],
    },
    {
      id: 9,
      name: 'Student 106',
      email: 'student106@example.com',
      class: 'Class 10',
      subject: 'Mathematics',
      avg: 82,
      books: [
        { name: 'Book A - Class 10', progress: 86, color: '#22c55e' },
        { name: 'Book B - Class 10', progress: 77, color: '#eab308' },
      ],
    },
    {
      id: 10,
      name: 'Student 107',
      email: 'student107@example.com',
      class: 'Class 11',
      subject: 'Mathematics',
      avg: 50,
      books: [
        { name: 'Book A - Class 11', progress: 3, color: '#22c55e' },
        { name: 'Book B - Class 11', progress: 97, color: '#eab308' },
      ],
    },
  ];

  //  const [students, setStudents] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 500;

  // Simulate fetching all students (replace with API later)
  useEffect(() => {
    const tempStudents = Array.from({ length: 21000 }, (_, i) => ({
      id: i + 1,
      name: `Student ${i + 1}`,
      email: `student${i + 1}@school.com`,
      avatar: 'https://via.placeholder.com/60',
    }));
    // setStudents(tempStudents);
  }, []);

  const totalPages = Math.ceil(students.length / studentsPerPage);
  const paginatedStudents = students.slice(
    (currentPage - 1) * studentsPerPage,
    currentPage * studentsPerPage
  );

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
            <View style={styles.toggleContainer}>
              <Switch
                value={isVirtualized}
                onValueChange={setIsVirtualized}
                circleSize={36}
                barHeight={32}
                circleBorderWidth={3}
                backgroundActive="#1e3a8a"
                backgroundInactive="#333"
                circleActiveColor="#3b82f6"
                circleInActiveColor="#666"
              />
              <Text style={styles.toggleLabel}>Virtualize</Text>
            </View>
          </View>
        </View>

        <View style={styles.controlsRow}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={18} color="#bbb" />
            <TextInput
              placeholder="Search name or email..."
              placeholderTextColor="#999"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <View style={styles.dropdownRow}>
            <TouchableOpacity style={styles.dropdown}>
              <Text style={styles.dropdownText}>All Classes ▼</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dropdown}>
              <Text style={styles.dropdownText}>All Subjects ▼</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.dropdownRow}>
            <TouchableOpacity style={styles.dropdown}>
              <Text style={styles.dropdownText}>Name A → Z ▼</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dropdown}>
              <Text style={styles.dropdownText}>12 / page ▼</Text>
            </TouchableOpacity>
          </View>
        </View>

        {students.map((student) => (
          <StudentCard key={student.id} student={student} />
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
  email: string;
  class: string;
  subject: string;
  avg: number;
  books: StudentBook[];
}

function StudentCard({ student }: { student: Student }) {
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
          <Text style={styles.studentEmail}>{student.email}</Text>
          <Text style={styles.studentClass}>
            {student.class} • {student.subject}
          </Text>
        </View>

        <View style={styles.avgContainer}>
          <Text style={styles.avgText}>Avg {student.avg}%</Text>
          <View style={styles.avgBarBackground}>
            <View style={[styles.avgBarFill, { width: `${student.avg}%` }]} />
          </View>
        </View>

        <TouchableOpacity style={styles.viewBtn}>
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
        {student.books.map((book, idx) => (
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
          </View>
        ))}
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
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  toggleLabel: {
    color: '#ccc',
    fontSize: 20,
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
  studentEmail: {
    color: '#aaa',
    fontSize: 13,
  },
  studentClass: {
    color: '#bbb',
    fontSize: 13,
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
