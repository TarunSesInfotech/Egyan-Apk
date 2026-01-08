import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

export default function ReportsOverview() {
  type FilterKey = 'class' | 'subject' | 'language' | 'level';

  const [filters, setFilters] = useState<Record<FilterKey, string>>({
    class: 'All Classes',
    subject: 'All Subjects',
    language: 'All Languages',
    level: 'All Levels',
  });
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const filterOptions = {
    class: [
      'All Classes',
      'Class 1',
      'Class 2',
      'Class 3',
      'Class 4',
      'Class 5',
      'Class 6',
      'Class 7',
      'Class 8',
      'Class 9',
      'Class 10',
      'Class 11',
      'Class 12',
    ],
    subject: ['All Subjects', 'Mathematics', 'Science', 'English'],
    language: ['All Languages', 'English', 'Hindi'],
    level: ['All Levels', 'Beginner', 'Intermediate', 'Advanced'],
  };

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
      <Text style={styles.title}>📊 E-Gyan School Reports</Text>
      <Text style={styles.subtitle}>
        Analyze student reading activity, book completion, and engagement
        metrics.
      </Text>

      <View style={styles.exportContainer}>
        <TouchableOpacity
          style={[styles.exportButton, { backgroundColor: '#2ecc71' }]}
        >
          <Ionicons name="document-text-outline" size={24} color="#fff" />
          <Text style={styles.exportText}>Export CSV</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.exportButton, { backgroundColor: '#e74c3c' }]}
        >
          <Ionicons name="document-text-outline" size={24} color="#fff" />
          <Text style={styles.exportText}>Export PDF</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.exportButton, { backgroundColor: '#f1c40f' }]}
        >
          <Ionicons name="print-outline" size={24} color="#000" />
          <Text style={[styles.exportText, { color: '#000' }]}>Print</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        {(Object.keys(filterOptions) as (keyof typeof filterOptions)[]).map(
          (key) => (
            <Dropdown
              key={key}
              style={styles.dropdown}
              containerStyle={styles.dropdownMenu}
              placeholderStyle={styles.dropdownText}
              selectedTextStyle={styles.dropdownText}
              itemTextStyle={{ color: '#fff' }}
              data={filterOptions[key].map((v) => ({ label: v, value: v }))}
              labelField="label"
              valueField="value"
              value={filters[key]}
              placeholder={filters[key]}
              onChange={(item) => {
                setFilters({ ...filters, [key]: item.value });
              }}
            />
          )
        )}

        <TouchableOpacity
          style={styles.datePicker}
          onPress={() => setShowFromPicker(true)}
        >
          <Ionicons name="calendar-outline" size={24} color="#fff" />
          <Text style={styles.dateText}>
            {fromDate ? fromDate.toDateString() : 'From Date'}
          </Text>
        </TouchableOpacity>

        {/* TO DATE */}
        <TouchableOpacity
          style={styles.datePicker}
          onPress={() => setShowToPicker(true)}
        >
          <Ionicons name="calendar-outline" size={24} color="#fff" />
          <Text style={styles.dateText}>
            {toDate ? toDate.toDateString() : 'To Date'}
          </Text>
        </TouchableOpacity>

        {/* DATE PICKERS */}
        {showFromPicker && (
          <DateTimePicker
            value={fromDate || new Date()}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowFromPicker(false);
              if (date) setFromDate(date);
            }}
          />
        )}

        {showToPicker && (
          <DateTimePicker
            value={toDate || new Date()}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowToPicker(false);
              if (date) setToDate(date);
            }}
          />
        )}
      </View>

      <View style={styles.cardsContainer}>
        <LinearGradient
          colors={['#7F00FF', '#A24DFE']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <Ionicons name="book-outline" size={28} color="#fff" />
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
          <Ionicons name="people-outline" size={28} color="#fff" />
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
          <Ionicons name="time-outline" size={28} color="#fff" />
          <View>
            <Text style={styles.cardLabel}>Pending Reviews</Text>
            <Text style={styles.cardValue}>36</Text>
          </View>
        </LinearGradient>
      </View>

      {/* Detailed Class & Student Report */}
      <View style={styles.tableContainer}>
        <Text style={styles.tableTitle}>Detailed Class & Student Report</Text>

        {/* TABLE HEADER */}
        <View style={styles.tableHeader}>
          <Text style={[styles.headerText, styles.colClass]}>Class</Text>
          <Text style={[styles.headerText, styles.colStudent]}>Student</Text>
          <Text style={[styles.headerText, styles.colBooks]}>
            Books Completed
          </Text>
          <Text style={[styles.headerText, styles.colHours]}>
            Reading Hours
          </Text>
          <Text style={[styles.headerText, styles.colActivity]}>
            Last Activity
          </Text>
          <Text style={[styles.headerText, styles.colStatus]}>Status</Text>
        </View>

        {/* TABLE ROWS */}
        {tableData.map((row, index) => (
          <View
            key={index}
            style={[
              styles.tableRow,
              { backgroundColor: index % 2 === 0 ? '#1e1e1e' : '#151515' },
            ]}
          >
            <Text style={[styles.cellText, styles.colClass]}>{row.class}</Text>

            <Text style={[styles.cellText, styles.colStudent]}>
              {row.student}
            </Text>

            <Text style={[styles.cellText, styles.colBooks]}>{row.books}</Text>

            <Text style={[styles.cellText, styles.colHours]}>{row.hours}</Text>

            <Text style={[styles.cellText, styles.colActivity]}>
              {row.lastActivity}
            </Text>

            <View
              style={[
                styles.statusBadge,
                row.status === 'Active' ? styles.active : styles.inactive,
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
    fontSize: 20,
    marginTop: 8,
    marginBottom: 20,
  },
  exportContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
    fontSize: 18,
    fontWeight: '600',
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 25,
  },
  dropdown: {
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: '49%',
  },
  dropdownText: {
    color: '#fff',
    fontSize: 18,
  },
  cardsContainer: {
    marginTop: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    gap: 10,
    minWidth: '30%',
  },
  cardLabel: {
    color: '#fff',
    fontSize: 18,
  },
  cardValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  tableContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 12,
    marginTop: 14,
  },
  tableTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  /* HEADER */
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 10,
    backgroundColor: '#222',
    borderRadius: 8,
    marginBottom: 8,
  },
  headerText: {
    color: '#ccc',
    fontSize: 16,
    fontWeight: 'bold',
  },

  /* ROW */
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },
  cellText: {
    color: '#fff',
    fontSize: 16,
  },

  colClass: {
    width: 60,
  },
  colStudent: {
    width: 150,
  },
  colBooks: {
    width: 160,
  },
  colHours: {
    width: 160,
  },
  colActivity: {
    width: 120,
  },
  colStatus: {
    width: 80,
    textAlign: 'center',
  },
  statusBadge: {
    width: 80,
    borderRadius: 6,
    paddingVertical: 4,
    alignItems: 'center',
  },
  statusText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  active: {
    backgroundColor: '#2ecc71',
  },
  inactive: {
    backgroundColor: '#e74c3c',
  },
  dropdownMenu: {
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
  },

  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },
  datePicker: {
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    width: '49%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  dateText: {
    color: '#fff',
    fontSize: 18,
  },
});
