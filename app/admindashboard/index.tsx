import WelcomeHeader from '@/components/WelcomeHeader';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { AdminStats } from '../api/adminapi/adminDashboard';

type CircularChartProps = {
  value: number;
  total: number;
  label: string;
  color: string;
};

const CircularChart: React.FC<CircularChartProps> = ({
  value,
  total,
  label,
  color,
}) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  const radius = 60;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * percentage) / 100;

  return (
    <View style={styles.chartBox}>
      <Text style={styles.chartTitle}>{label}</Text>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Svg width={150} height={150}>
          <Circle
            stroke="#333"
            fill="none"
            cx="80"
            cy="80"
            r={radius}
            strokeWidth={strokeWidth}
          />
          <Circle
            stroke={color}
            fill="none"
            cx="80"
            cy="80"
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </Svg>
        <View style={styles.centerText}>
          <Text style={styles.centerValue}>{value}</Text>
          <Text style={styles.centerLabel}>{label}</Text>
        </View>
      </View>
    </View>
  );
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await AdminStats();

      if (response.success) {
        setStats(response.data);
      } else {
        console.error('Error fetching Stats:', response.message);
      }
    } catch (error: any) {
      console.error('Error fetching Stats:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator size="large" color="#42a5f5" />
      </View>
    );
  }

  if (!stats) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <Text style={{ color: '#fff' }}>Failed to load stats</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.mainContent}>
        <WelcomeHeader />
        <Text style={styles.sectionTitle}>Dashboard Overview</Text>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { borderColor: '#ff7043' }]}>
            <Text style={styles.statTitle}>Books</Text>
            <Text style={styles.statValue}>{stats.totalBooks}</Text>
          </View>
          <View style={[styles.statCard, { borderColor: '#42a5f5' }]}>
            <Text style={styles.statTitle}>PDFs</Text>
            <Text style={styles.statValue}>{stats.totalPdf}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { borderColor: '#66bb6a' }]}>
            <Text style={styles.statTitle}>Audios</Text>
            <Text style={styles.statValue}>{stats.totalAudio}</Text>
          </View>
          <View style={[styles.statCard, { borderColor: '#ffa726' }]}>
            <Text style={styles.statTitle}>Videos</Text>
            <Text style={styles.statValue}>{stats.totalVideos}</Text>
          </View>
        </View>

        <View style={styles.chartsRow}>
          <CircularChart
            value={stats.totalStudents}
            total={100} 
            label="Students"
            color="#42a5f5"
          />
          <CircularChart
            value={stats.totalBooks}
            total={300}
            label="Books"
            color="#66bb6a"
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#121212',
  },
  mainContent: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    textAlign: 'center',
    color: '#43FF9BFF',
    fontSize: 24,
    marginTop: 20,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1e1e2d',
    padding: 18,
    borderRadius: 12,
    borderLeftWidth: 6,
    marginHorizontal: 5,
  },
  statTitle: {
    color: '#3EB489',
    fontSize: 26,
    marginBottom: 8,
  },
  statValue: {
    color: '#F64A8A',
    fontSize: 20,
    fontWeight: 'bold',
  },
  chartsRow: {
    flexDirection: 'column',
    marginTop: 20,
  },
  chartBox: {
    width: '100%',
    backgroundColor: '#1e1e2d',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  chartTitle: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 15,
  },
  centerText: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerValue: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  centerLabel: {
    color: '#aaa',
    fontSize: 18,
  },
});
