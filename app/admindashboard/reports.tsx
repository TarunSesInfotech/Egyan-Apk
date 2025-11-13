import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ReportsOverview() {
  const tableData = [
    {
      class: '10',
      student: 'Ravi Kumar',
      books: 12,
      hours: '5 hrs',
      lastActivity: 'Today',
      status: 'Active',
    },
    {
      class: '9',
      student: 'Sita Sharma',
      books: 8,
      hours: '3 hrs',
      lastActivity: 'Yesterday',
      status: 'Inactive',
    },
    {
      class: '8',
      student: 'Aman Verma',
      books: 15,
      hours: '7 hrs',
      lastActivity: '2 days ago',
      status: 'Active',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Reports Overview</Text>
      <Text style={styles.subtitle}>
        Analyze student reading activity, book completion, and engagement
        metrics.
      </Text>

      {/* Export Buttons */}
      <View style={styles.exportContainer}>
        <TouchableOpacity
          style={[styles.exportButton, { backgroundColor: '#2ecc71' }]}
        >
          <Ionicons name="document-text-outline" size={18} color="#fff" />
          <Text style={styles.exportText}>Export CSV</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.exportButton, { backgroundColor: '#e74c3c' }]}
        >
          <Ionicons name="document-text-outline" size={18} color="#fff" />
          <Text style={styles.exportText}>Export PDF</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.exportButton, { backgroundColor: '#f1c40f' }]}
        >
          <Ionicons name="print-outline" size={18} color="#000" />
          <Text style={[styles.exportText, { color: '#000' }]}>Print</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Section */}
      <View style={styles.filterContainer}>
        {[
          'All Classes',
          'All Subjects',
          'All Languages',
          'All Levels',
          'dd-mm-yyyy',
          'dd-mm-yyyy',
        ].map((item, index) => (
          <TouchableOpacity style={styles.dropdown} key={index}>
            <Text style={styles.dropdownText}>{item}</Text>
            <Ionicons
              name={
                item.includes('dd')
                  ? 'calendar-outline'
                  : 'chevron-down-outline'
              }
              size={18}
              color="#aaa"
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Summary Cards */}
      <View style={styles.cardsContainer}>
        <LinearGradient
          colors={['#7F00FF', '#A24DFE']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <Ionicons name="book-outline" size={24} color="#fff" />
          <View>
            <Text style={styles.cardLabel}>Total Books Completed</Text>
            <Text style={styles.cardValue}>0</Text>
          </View>
        </LinearGradient>

        <LinearGradient
          colors={['#2ecc71', '#1abc9c']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <Ionicons name="people-outline" size={24} color="#fff" />
          <View>
            <Text style={styles.cardLabel}>Active Students</Text>
            <Text style={styles.cardValue}>47</Text>
          </View>
        </LinearGradient>

        <LinearGradient
          colors={['#f1c40f', '#f39c12']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <Ionicons name="time-outline" size={24} color="#fff" />
          <View>
            <Text style={styles.cardLabel}>Pending Reviews</Text>
            <Text style={styles.cardValue}>36</Text>
          </View>
        </LinearGradient>
      </View>

      {/* Detailed Class & Student Report */}
      <View style={styles.tableContainer}>
        <Text style={styles.tableTitle}>Detailed Class & Student Report</Text>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          {[
            'Class',
            'Student',
            'Books Completed',
            'Reading Hours',
            'Last Activity',
            'Status',
          ].map((header, index) => (
            <Text key={index} style={styles.headerText}>
              {header}
            </Text>
          ))}
        </View>

        {/* Table Rows */}
        {tableData.map((row, index) => (
          <View
            key={index}
            style={[
              styles.tableRow,
              { backgroundColor: index % 2 === 0 ? '#1e1e1e' : '#151515' },
            ]}
          >
            <Text style={styles.cellText}>{row.class}</Text>
            <Text style={styles.cellText}>{row.student}</Text>
            <Text style={styles.cellText}>{row.books}</Text>
            <Text style={styles.cellText}>{row.hours}</Text>
            <Text style={styles.cellText}>{row.lastActivity}</Text>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    row.status === 'Active' ? '#2ecc71' : '#e74c3c',
                },
              ]}
            >
              <Text style={styles.statusText}>{row.status}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#fff',
    fontSize: 18,
    marginTop: 10,
    marginBottom: 20,
  },
  exportContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    gap: 10,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  exportText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
    marginTop: 25,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minWidth: '47%',
    marginBottom: 10,
  },
  dropdownText: {
    color: '#fff',
    fontSize: 14,
  },
  cardsContainer: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    gap: 10,
    minWidth: '30%',
  },
  cardLabel: {
    color: '#fff',
    fontSize: 13,
  },
  cardValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tableContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 15,
    marginTop: 30,
  },
  tableTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#0d0d0d',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  headerText: {
    color: '#ccc',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 0.3,
    borderBottomColor: '#333',
  },
  cellText: {
    color: '#fff',
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
  },
  statusBadge: {
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    alignSelf: 'center',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});
