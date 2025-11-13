import WelcomeHeader from '@/components/WelcomeHeader';
import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  announcementsApi,
  studentMetrices,
} from '../api/studentapi/studentDashboardApi';

export default function StudentDashboard() {
  const [metrics, setMetrics] = useState<any>('');
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    try {
      const response = await studentMetrices();
      if (response.success) {
        setMetrics(response.data);
      } else {
        console.error('Error fetching metrics:', response.message);
      }
    } catch (error: any) {
      console.error('Error fetching metrics:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await announcementsApi();
      if (response.success) {
        setAnnouncements(response.data);
      } else {
        console.error('Error fetching announcements:', response.message);
      }
    } catch (error: any) {
      console.error('Error fetching announcements:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    fetchAnnouncements();
  }, []);

  const formatTime = (totalSeconds: number) => {
    const safe = Math.max(0, Math.floor(Number(totalSeconds) || 0));
    const hours = Math.floor(safe / 3600);
    const minutes = Math.floor((safe % 3600) / 60);
    return `${hours}h ${String(minutes).padStart(2, '0')}m`;
  };

  const stats = metrics
    ? [
        {
          title: 'Total Time Spent',
          value: formatTime(metrics.totalTimeSpent),
          color: '#FF6B00',
          icon: <Ionicons name="time" size={40} color="#FF6B00" />,
        },
        {
          title: 'Books Completed',
          value: metrics.booksCompleted,
          color: '#43B0FF',
          icon: <FontAwesome5 name="book" size={40} color="#43B0FF" />,
        },
        {
          title: 'Recent Activity',
          value: metrics.recentActivityCount,
          color: '#43FF9B',
          icon: <Ionicons name="book-outline" size={40} color="#43FF9B" />,
        },
        {
          title: 'Favorites',
          value: metrics.favoriteBooksCount,
          color: '#FFB800',
          icon: <Ionicons name="heart" size={28} color="#FFB800" />,
        },
      ]
    : [];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.mainContent}>
        <WelcomeHeader />
        <Text style={styles.sectionTitle}>Dashboard Overview</Text>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#43FF9B"
            style={{ marginVertical: 20 }}
          />
        ) : (
          <View style={styles.statsContainer}>
            {stats.map((item, index) => (
              <View key={index} style={styles.statCard}>
                <View style={styles.iconContainer}>{item.icon}</View>
                <Text style={[styles.statValue, { color: item.color }]}>
                  {item.value}
                </Text>
                <Text style={styles.statTitle}>{item.title}</Text>
              </View>
            ))}
          </View>
        )}
        <Text style={styles.announcementTitle}>📌 Announcements</Text>
        {announcements.length > 0 ? (
          announcements.map((a) => (
            <View key={a.id} style={styles.announcementCard}>
              <MaterialIcons
                name="campaign"
                size={40}
                color="#FFD700"
                style={{ marginRight: 8 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.announcementText}>{a.message}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={{ color: '#aaa', fontSize: 18 }}>
            No announcements available.
          </Text>
        )}
      </ScrollView>
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
  sectionTitle: {
    textAlign: 'center',
    color: '#43FF9B',
    fontSize: 28,
    marginTop: 20,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#1E1E2E',
    borderRadius: 12,
    width: '48%',
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 10,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  statTitle: {
    color: '#ddd',
    fontSize: 18,
    marginTop: 5,
    textAlign: 'center',
  },
  announcementTitle: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#FF5C8A',
    marginTop: 20,
    marginBottom: 20,
  },
  announcementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E2E',
    padding: 12,
    borderRadius: 8,
    marginBottom: 26,
  },
  announcementText: {
    color: '#ccc',
    fontSize: 20,
    flex: 1,
    marginTop: 7,
  },
});
