import {
  notificationsConcerns,
  notificationsRequests,
} from '@/app/api/adminapi/adminNotifications';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

type RequestItem = {
  id: number;
  user: string;
  message: string;
  status: string;
};

type ConcernItem = {
  id: number;
  student: string;
  subject: string;
  priority: string;
  status: string;
  date: string;
};

export default function NotificationsScreen() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [concerns, setConcerns] = useState<ConcernItem[]>([]);

  const [loadingRequests, setLoadingRequests] = useState(true);
  const [loadingConcerns, setLoadingConcerns] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await notificationsRequests();
        const formatted: RequestItem[] = res.data.map(
          (item: any, index: number) => ({
            id: index + 1,
            user: item?.user?.username || 'Unknown',
            message: item?.message || '-',
            status:
              item?.status?.charAt(0).toUpperCase() + item?.status?.slice(1),
          })
        );
        setRequests(formatted);
      } catch (e) {
        console.error('Error requests:', e);
      } finally {
        setLoadingRequests(false);
      }
    };

    const fetchConcerns = async () => {
      try {
        const res = await notificationsConcerns();
        const formatted: ConcernItem[] = res.data.map(
          (item: any, index: number) => ({
            id: index + 1,
            student: item?.student?.username || 'Unknown',
            subject: item?.subject || '-',
            priority: item?.priority || '-',
            status:
              item?.status?.charAt(0).toUpperCase() + item?.status?.slice(1),
            date: item?.createdAt
              ? new Date(item.createdAt).toLocaleDateString()
              : '-',
          })
        );
        setConcerns(formatted);
      } catch (e) {
        console.error('Error concerns:', e);
      } finally {
        setLoadingConcerns(false);
      }
    };

    fetchRequests();
    fetchConcerns();
  }, []);

  const updateRequestStatus = (id: number, value: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: value } : r))
    );
  };

  const updateConcernStatus = (id: number, value: string) => {
    setConcerns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: value } : c))
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* ================= STUDENT CONCERNS ================= */}
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

        {loadingConcerns && (
          <Text style={styles.emptyText}>Loading concerns...</Text>
        )}

        {!loadingConcerns && concerns.length === 0 && (
          <Text style={styles.emptyText}>No concerns found.</Text>
        )}

        {!loadingConcerns &&
          concerns.map((item) => (
            <View key={item.id} style={styles.row}>
              <Text style={[styles.td, styles.col20]}>{item.student}</Text>
              <Text style={[styles.td, styles.col20]}>{item.subject}</Text>
              <Text style={[styles.td, styles.col15]}>{item.priority}</Text>

              <View style={styles.col15}>
                <Dropdown
                  style={styles.dropdown}
                  containerStyle={styles.dropdownContainer}
                  data={[
                    { label: 'Pending', value: 'Pending' },
                    { label: 'Resolved', value: 'Resolved' },
                  ]}
                  labelField="label"
                  valueField="value"
                  value={item.status}
                  onChange={(opt) => updateConcernStatus(item.id, opt.value)}
                />
              </View>

              <Text style={[styles.td, styles.col15]}>{item.date}</Text>

              <View style={[styles.col15, styles.actionBox]}>
                <Text style={styles.view}>View</Text>
                <Ionicons name="trash" size={26} color="#ff6b6b" />
              </View>
            </View>
          ))}
      </View>

      {/* ================= USER REQUESTS ================= */}
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

        {loadingRequests && (
          <Text style={styles.emptyText}>Loading requests...</Text>
        )}

        {!loadingRequests && requests.length === 0 && (
          <Text style={styles.emptyText}>No requests found.</Text>
        )}

        {!loadingRequests &&
          requests.map((item) => (
            <View key={item.id} style={styles.row}>
              <Text style={[styles.td, styles.colUser]}>{item.user}</Text>

              <Text style={[styles.td, styles.colMsg]} numberOfLines={2}>
                {item.message}
              </Text>

              <View style={styles.colStatus}>
                <Dropdown
                  style={styles.dropdown}
                  containerStyle={styles.dropdownContainer}
                  data={[
                    { label: 'Pending', value: 'Pending' },
                    { label: 'Resolved', value: 'Resolved' },
                  ]}
                  labelField="label"
                  valueField="value"
                  value={item.status}
                  onChange={(opt) => updateRequestStatus(item.id, opt.value)}
                />
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
  colUser: { width: '18%' },
  colMsg: { width: '30%' },
  colStatus: { width: '32%' },
  colAction: { width: '20%' },
  col20: { width: '20%' },
  col15: { width: '15%' },

  dropdown: {
    height: 40,
    backgroundColor: '#374151',
    borderRadius: 6,
    paddingHorizontal: 10,
  },
  dropdownContainer: {
    backgroundColor: '#1f2235',
    borderRadius: 8,
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
