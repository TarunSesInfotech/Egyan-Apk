import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { schoolOverview } from '../api/adminapi/adminDashboard';

export default function SchoolOverview() {
  const [overview, setOverview] = useState<any>('');

  const fetchSSchool = async () => {
    try {
      const response = await schoolOverview();
      if (response.success) {
        setOverview(response.data);
      } else {
        console.error('Error fetching setSchoolOverview:', response.message);
      }
    } catch (error: any) {
      console.error('Error fetching setSchoolOverview:', error.message);
    }
  };

  useEffect(() => {
    fetchSSchool();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>School Overview</Text>
      <Text style={styles.subtitle}>
        Track your school's usage and digital library sync.
      </Text>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, { borderColor: '#ff7043' }]}>
          <Text style={styles.statTitle}>Total Teachers</Text>
          <Text style={styles.statValue}>{overview?.totalTeachers}</Text>
        </View>
        <View style={[styles.statCard, { borderColor: '#42a5f5' }]}>
          <Text style={styles.statTitle}>Total Students</Text>
          <Text style={styles.statValue}>{overview?.totalStudents}</Text>
        </View>
      </View>
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { borderColor: '#66bb6a' }]}>
          <Text style={styles.statTitle}>Total Classes</Text>
          <Text style={styles.statValue}>{overview?.totalClasses}</Text>
        </View>
        <View style={[styles.statCard, { borderColor: '#fdd835' }]}>
          <Text style={styles.statTitle}>Total Books</Text>
          <Text style={styles.statValue}>{overview?.totalBooks}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sync Status</Text>
        <View style={styles.syncRow}>
          <View style={styles.syncBox}>
            <Text style={styles.syncLabel}>Last Sync</Text>
            <Text style={styles.syncValue}>Loading...</Text>
          </View>
          <View style={styles.syncBox}>
            <Text style={styles.syncLabel}>Pending Uploads</Text>
            <Text style={[styles.syncValue, { color: '#fdd835' }]}>
              0 files
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.syncButton}>
          <Ionicons name="sync" size={40} color="#fff" />
          <Text style={styles.syncButtonText}>Sync Now</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>School Info</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>School Code:</Text>
          <Text style={styles.infoValue}>SCH-1023</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Connected Devices:</Text>
          <Text style={styles.infoValue}>0</Text>
        </View>
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
    fontSize: 30,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#fff',
    fontSize: 24,
    marginTop: 4,
    marginBottom: 26,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1e1e2d',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 14,
    marginRight: 8,
  },
  statTitle: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 6,
  },
  statValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#1e1e2d',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 16,
    fontWeight: 'bold',
  },
  syncRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  syncBox: {
    flex: 1,
    backgroundColor: '#2c2c3c',
    padding: 12,
    borderRadius: 8,
    marginRight: 4,
  },
  syncLabel: {
    color: '#fff',
    fontSize: 22,
    marginBottom: 4,
  },
  syncValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 8,
  },
  syncButtonText: {
    color: '#fff',
    fontSize: 24,
    marginLeft: 6,
    fontWeight: 'bold',
  },
  infoBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  infoLabel: {
    color: '#fff',
    fontSize: 22,
  },
  infoValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
