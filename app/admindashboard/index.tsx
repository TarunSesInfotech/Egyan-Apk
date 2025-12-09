import WelcomeHeader from '@/components/WelcomeHeader';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
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
  const [showChangelog, setShowChangelog] = useState(false);

  const changelogData = [
    {
      date: 'Nov 25, 2023',
      version: 'Version 0.0',
      improvements: ['Added a new page with a changelog'],
      bugfixes: [
        'Fixed AI operation in some cases',
        'Fixed technical problems that led to failures',
      ],
      gradient: ['#2b2d42', '#1e3c72'],
    },
    {
      date: 'Nov 6, 2025',
      version: 'Version 0.0.1',
      improvements: ['Fix bugs on manage book'],
      bugfixes: ['Reduced data loading and updating time'],
      gradient: ['#3a1c71', '#d76d77'],
    },
  ];

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
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 20,
            marginBottom: 20,
          }}
        >
          <Text style={styles.sectionTitle}>Dashboard Overview</Text>

          <TouchableOpacity
            onPress={() => console.log('Button Pressed')}
            style={{
              backgroundColor: '#42a5f5',
              paddingVertical: 6,
              paddingHorizontal: 14,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>
              Upload Credentails
            </Text>
          </TouchableOpacity>
        </View>

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

        <View>
          <Text style={styles.releaseTitle}>Latest Release</Text>

          <View style={styles.releaseBox}>
            <View>
              <Text style={styles.releaseAppName}>eGyan</Text>
              <Text style={styles.releaseVersion}>
                Version: <Text style={{ color: '#43FF9BFF' }}>v0.0.0</Text>
              </Text>
              <Text style={styles.releaseUpdated}>
                Last Updated:{' '}
                <Text style={{ color: '#66bb6a' }}>12 November 2025</Text>
              </Text>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
              <TouchableOpacity
                style={styles.releaseButton}
                onPress={() => setShowChangelog(true)}
              >
                <Text style={styles.releaseButtonText}>🚀 Latest Release</Text>
              </TouchableOpacity>
              <Text style={styles.releaseDeveloper}>
                Developed by{' '}
                <Text style={styles.releaseDevName}>SEST INFOTECH PVT LTD</Text>
              </Text>
              <Text style={styles.releaseRights}>
                © 2025 All rights reserved
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showChangelog}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowChangelog(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            {/* Banner */}
            <View style={styles.banner}>
              <Text style={styles.bannerIcon}>🚀</Text>
              <Text style={styles.bannerTitle}>What's New?</Text>
              <Text style={styles.bannerSubtitle}>
                A changelog of the latest feature releases, product updates, and
                bug fixes.
              </Text>
            </View>

            {/* Timeline Start */}
            <ScrollView showsVerticalScrollIndicator={false}>
              {changelogData.map((item, index) => (
                <View key={index}>
                  {/* Timeline Row */}
                  <View style={styles.timelineRow}>
                    <View style={styles.dot}></View>
                    <Text style={styles.dateText}>{item.date}</Text>
                  </View>

                  {/* Card */}
                  <View style={[styles.changelogCard]}>
                    <Text style={styles.versionTitle}>{item.version}</Text>

                    <Text style={styles.changelogHeading}>
                      Improvements & Changes
                    </Text>
                    {item.improvements.map((imp, i) => (
                      <Text key={i} style={styles.bullet}>
                        • {imp}
                      </Text>
                    ))}

                    <Text style={styles.changelogHeadingBug}>Bugfixes</Text>
                    {item.bugfixes.map((bug, i) => (
                      <Text key={i} style={styles.bullet}>
                        • {bug}
                      </Text>
                    ))}
                  </View>
                </View>
              ))}

              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setShowChangelog(false)}
              >
                <Text style={styles.closeBtnText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  releaseTitle: {
    color: '#43FF9BFF',
    fontSize: 26,
    marginBottom: 15,
    textAlign: 'center',
  },
  releaseBox: {
    backgroundColor: '#1e1e2d',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 80,
  },
  releaseAppName: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 5,
    fontWeight: '600',
  },
  releaseVersion: {
    color: '#ccc',
    fontSize: 20,
    marginBottom: 5,
  },
  releaseUpdated: {
    color: '#ccc',
    fontSize: 20,
    marginBottom: 10,
  },
  releaseButton: {
    backgroundColor: '#42a5f5',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    marginBottom: 10,
  },
  releaseButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  releaseDeveloper: {
    color: '#ccc',
    fontSize: 18,
  },
  releaseDevName: {
    color: '#42a5f5',
    fontWeight: 'bold',
  },
  releaseRights: {
    color: '#777',
    fontSize: 18,
    marginTop: 4,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#121212',
    borderRadius: 20,
    padding: 15,
    maxHeight: '90%',
  },
  banner: {
    backgroundColor: '#1d8cf8',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  bannerIcon: {
    fontSize: 30,
    textAlign: 'center',
  },
  bannerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#e0e0e0',
    textAlign: 'center',
    marginTop: 4,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  dot: {
    width: 14,
    height: 14,
    backgroundColor: '#1d8cf8',
    borderRadius: 7,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#0f1a2b',
  },
  dateText: {
    color: '#fff',
    fontSize: 14,
  },
  changelogCard: {
    backgroundColor: '#1e1e2d',
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#2b2b40',
  },
  versionTitle: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  changelogHeading: {
    fontSize: 18,
    color: '#8ab4ff',
    marginBottom: 8,
    marginTop: 10,
  },
  changelogHeadingBug: {
    fontSize: 18,
    color: '#ff6ab4',
    marginBottom: 8,
    marginTop: 10,
  },
  bullet: {
    color: '#e0e0e0',
    fontSize: 15,
    marginBottom: 6,
  },
  closeBtn: {
    backgroundColor: '#1d8cf8',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  closeBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
