import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

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

export default function StudentCard({
  student,
  openModal,
}: {
  student: Student;
  openModal: (s: Student) => void;
}) {
  const [expanded, setExpanded] = useState(false);

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

        <TouchableOpacity
          onPress={() => setExpanded(!expanded)}
          style={styles.expandButton}
        >
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={22}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      {expanded && (
        <View style={styles.scrollContainer}>
          <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {student.books.map((book, index) => (
              <View key={index} style={{ marginBottom: 12 }}>
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
    marginRight: 10,
  },
  avgText: {
    color: '#fff',
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
  viewBtn: {
    backgroundColor: '#333',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 5,
  },
  viewText: {
    color: '#C9CCD1FF',
    fontSize: 16,
    fontWeight: '600',
  },
  expandButton: {
    paddingHorizontal: 8,
  },

  scrollContainer: {
    marginTop: 12,
    height: 180,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bookName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#fff',
  },
  bookPercent: {
    fontSize: 15,
    fontWeight: '500',
    color: '#fff',
  },
  progressTrack: {
    width: '100%',
    backgroundColor: '#fff',
    height: 8,
    borderRadius: 10,
    marginTop: 4,
  },
  progressFill: {
    height: 8,
    borderRadius: 10,
  },
});
