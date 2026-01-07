import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
} from 'react-native-alert-notification';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';
import { schoolOverview } from '../api/adminapi/adminDashboard';

export default function SchoolOverview() {
  const [overview, setOverview] = useState<any>('');
  const [lastSync, setLastSync] = useState('Loading...');
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchSSchool = async () => {
    try {
      const response = await schoolOverview();
      if (response.success) {
        setOverview(response.data);
      } else {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Error fetching setSchoolOverview',
          textBody: response.message,
          button: 'Try Again',
        });
      }
    } catch (error: any) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error fetching setSchoolOverview',
        textBody: error.message,
        button: 'Try Again',
      });
    }
  };

  useEffect(() => {
    fetchSSchool();
  }, []);
  const screenWidth = Dimensions.get('window').width;

  const chartConfig = {
    backgroundGradientFrom: '#1e1e2d',
    backgroundGradientTo: '#1e1e2d',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 229, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: { borderRadius: 12 },
  };

  const yellowChartConfig = {
    ...chartConfig,
    color: (opacity = 1) => `rgba(253, 216, 53, ${opacity})`,
  };

  const handleSync = () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setLastSync('Syncing data...');
    setTimeout(() => {
      setIsSyncing(false);
      setLastSync('Just now');
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Upload Complete',
        textBody: 'Successfully synced & data added.',
        button: 'OK',
      });
    }, 20000);
  };

  return (
    <>
      <AlertNotificationRoot>
        <ScrollView style={styles.container}>
          <Text style={styles.title}>School Overview</Text>
          <Text style={styles.subtitle}>
            Track your school's usage and digital library sync.
          </Text>

          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: '#ff7043' }]}>
              <View style={styles.statContent}>
                <View style={styles.iconBox}>
                  <Ionicons name="person" size={30} color="#fff" />
                </View>

                <View>
                  <Text style={styles.statTitle}>Total Teachers</Text>
                  <Text style={styles.statValue}>
                    {overview?.totalTeachers}
                  </Text>
                </View>
              </View>
            </View>

            <View style={[styles.statCard, { backgroundColor: '#42a5f5' }]}>
              <View style={styles.statContent}>
                <View style={styles.iconBox}>
                  <Ionicons name="people" size={30} color="#fff" />
                </View>

                <View>
                  <Text style={styles.statTitle}>Total Students</Text>
                  <Text style={styles.statValue}>
                    {overview?.totalStudents}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: '#66bb6a' }]}>
              <View style={styles.statContent}>
                <View style={styles.iconBox}>
                  <Ionicons name="desktop-outline" size={30} color="#fff" />
                </View>

                <View>
                  <Text style={styles.statTitle}>Total Classes</Text>
                  <Text style={styles.statValue}>{overview?.totalClasses}</Text>
                </View>
              </View>
            </View>

            <View style={[styles.statCard, { backgroundColor: '#fdd835' }]}>
              <View style={styles.statContent}>
                <View style={styles.iconBox}>
                  <Ionicons name="book" size={30} color="#fff" />
                </View>

                <View>
                  <Text style={styles.statTitle}>Total Books</Text>
                  <Text style={styles.statValue}>{overview?.totalBooks}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sync Status</Text>
            <View style={styles.syncRow}>
              <View style={styles.syncBox}>
                <Text style={styles.syncLabel}>Last Sync</Text>
                <Text style={[styles.syncValue, { color: '#66bb6a' }]}>
                  {lastSync}
                </Text>
              </View>
              <View style={styles.syncBox}>
                <Text style={styles.syncLabel}>Pending Uploads</Text>
                <Text style={[styles.syncValue, { color: '#fdd835' }]}>
                  0 files
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.syncButton}
              disabled={isSyncing}
              onPress={handleSync}
            >
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

          <Text style={styles.header}>School Analytics</Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Overall Performance</Text>
            <LineChart
              data={{
                labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
                datasets: [{ data: [0, 200, 400, 600, 800, 1000] }],
              }}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Subject Engagement</Text>
            <BarChart
              data={{
                labels: ['Math', 'Science', 'English', 'History', 'Geography'],
                datasets: [{ data: [320, 280, 250, 180, 150] }],
              }}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
              yAxisLabel="$"
              yAxisSuffix="%"
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Student Activity</Text>
            <PieChart
              data={[
                {
                  name: 'Completed',
                  population: 40,
                  color: '#00e5ff',
                  legendFontColor: '#fff',
                  legendFontSize: 16,
                },
                {
                  name: 'Favorite',
                  population: 15,
                  color: '#2ecc71',
                  legendFontColor: '#fff',
                  legendFontSize: 16,
                },
                {
                  name: 'Opened',
                  population: 45,
                  color: '#3f82ff',
                  legendFontColor: '#fff',
                  legendFontSize: 16,
                },
              ]}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Average Study Time</Text>
            <LineChart
              data={{
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                datasets: [{ data: [45, 50, 62, 55, 40, 30] }],
              }}
              width={screenWidth - 40}
              height={220}
              chartConfig={yellowChartConfig}
              bezier
              style={styles.chart}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Top Performing Students</Text>
            <View style={[styles.studentRow, { borderBottomWidth: 1 }]}>
              <Text style={[styles.studentName, { fontWeight: 'bold' }]}>
                Name
              </Text>
              <Text style={[styles.studentScore, { fontWeight: 'bold' }]}>
                Score
              </Text>
            </View>

            {[
              { name: 'Aarav Mehta', score: '99%' },
              { name: 'Ishita Nair', score: '97%' },
              { name: 'Kabir Singh', score: '96%' },
              { name: 'Rhea Kapoor', score: '95%' },
            ].map((student, index) => (
              <View key={index} style={styles.studentRow}>
                <Text style={styles.studentName}>{student.name}</Text>
                <Text style={styles.studentScore}>{student.score}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </AlertNotificationRoot>
    </>
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
    fontSize: 22,
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
    padding: 16,
    borderRadius: 15,
    marginBottom: 12,
    marginRight: 8,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
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
  header: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#1e1e2d',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    overflow: 'hidden',
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  chart: {
    borderRadius: 12,
  },
  studentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: '#333',
  },
  studentName: {
    color: '#ffffff',
    fontSize: 18,
  },
  studentScore: {
    color: '#00e5ff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginRight: 14,
  },
});
