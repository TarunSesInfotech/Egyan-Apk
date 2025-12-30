import { notificationsRequests } from '@/app/api/adminapi/adminNotifications';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

type RequestItem = {
  id: number;
  user: string;
  message: string;
  status: string;
};

export default function NotificationsScreen() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotificationsRequests = async () => {
      try {
        const response = await notificationsRequests();
        const formattedRequests: RequestItem[] = response.data.map(
          (item: any, index: number) => ({
            id: index + 1,
            user: item.user.username,
            message: item.message,
            status: item.status.charAt(0).toUpperCase() + item.status.slice(1),
          })
        );
        setRequests(formattedRequests);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotificationsRequests();
  }, []);

  const updateStatus = (id: number, value: string) => {
    setRequests((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: value } : item))
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Student Concerns</Text>
        <View style={styles.tableHeader}>
          <Text style={[styles.th, styles.col20]}>STUDENT</Text>
          <Text style={[styles.th, styles.col20]}>SUBJECT</Text>
          <Text style={[styles.th, styles.col15]}>PRIORITY</Text>
          <Text style={[styles.th, styles.col15]}>STATUS</Text>
          <Text style={[styles.th, styles.col15]}>DATE</Text>
          <Text style={[styles.th, styles.col15]}>ACTION</Text>
        </View>
        <Text style={styles.emptyText}>No concerns found.</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>User Requests</Text>
        <View style={styles.tableHeader}>
          <Text style={[styles.th, styles.colUser]}>USER NAME</Text>
          <Text style={[styles.th, styles.colMsg]}>MESSAGE</Text>
          <Text style={[styles.th, styles.colStatus]}>STATUS</Text>
          <Text style={[styles.th, styles.colAction, styles.thAction]}>
            ACTION
          </Text>
        </View>
        {loading && <Text style={styles.emptyText}>Loading requests...</Text>}
        {!loading && requests.length === 0 && (
          <Text style={styles.emptyText}>No requests found.</Text>
        )}
        {!loading &&
          requests.map((item) => (
            <View key={item.id} style={styles.row}>
              <Text style={[styles.td, styles.colUser]}>{item.user}</Text>
              <Text style={[styles.td, styles.colMsg]} numberOfLines={2}>
                {item.message}
              </Text>
              <View style={styles.colStatus}>
                <Picker
                  selectedValue={item.status}
                  onValueChange={(value) => updateStatus(item.id, value)}
                  style={styles.picker}
                  dropdownIconColor="#fff"
                >
                  <Picker.Item label="Pending" value="Pending" />
                  <Picker.Item label="Resolved" value="Resolved" />
                </Picker>
              </View>
              <View style={[styles.colAction, styles.actionBox]}>
                <Text style={styles.view}>View</Text>
                <Ionicons name="trash" size={26} color="#ff6b6b" />
              </View>
            </View>
          ))}
      </View>
    </ScrollView>
  );
}
/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141625',
    padding: 16,
  },
  card: {
    backgroundColor: '#1f2235',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#2a2d42',
    paddingVertical: 10,
    borderRadius: 6,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2f324a',
    alignItems: 'center',
  },
  th: {
    color: '#cbd5f5',
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: 6,
  },
  td: {
    color: '#fff',
    fontSize: 18,
    paddingHorizontal: 6,
  },
  thAction: {
    textAlign: 'right',
    paddingRight: 50,
  },
  colUser: {
    width: '18%',
  },
  colMsg: {
    width: '30%',
  },
  colStatus: {
    width: '32%',
  },
  colAction: {
    width: '20%',
  },
  col20: {
    width: '20%',
  },
  col15: {
    width: '15%',
  },
  picker: {
    width: '100%',
    height: 40,
    backgroundColor: '#374151',
    color: '#fff',
  },
  actionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  view: {
    color: '#3b82f6',
    fontWeight: '600',
    fontSize: 18,
  },
  emptyText: {
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
  },
});
