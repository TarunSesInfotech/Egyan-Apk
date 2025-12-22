import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
} from 'react-native-alert-notification';
import { currentUserApi } from '../api/studentapi/studentDashboardApi';

export default function ProfileSettingsScreen() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const response = await currentUserApi();
      if (response.success) {
        setCurrentUser(response.data);
      }
    };
    fetchCurrentUser();
  }, []);

  const handleLogout = async () => {
    try {
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Logged Out',
        textBody: 'You have been successfully logged out.',
        button: 'OK',
        onHide: async () => {
          await AsyncStorage.removeItem('token');
          router.replace('/');
        },
      });
    } catch (error) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Logged Out',
        textBody: 'Invalid username or password.',
        button: 'Try Again',
      });
    }
  };

  return (
    <AlertNotificationRoot>
      <View style={styles.container}>
        <View style={styles.card}>
          {/* Avatar */}
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={54} color="#fff" />
            </View>
          </View>

          {/* Email */}
          <View style={styles.row}>
            <Ionicons name="mail" size={34} color="#3b82f6" />
            <View style={styles.rowText}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{currentUser?.profile?.email}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Role */}
          <View style={styles.row}>
            <Ionicons name="person-circle" size={34} color="#3b82f6" />
            <View style={styles.rowText}>
              <Text style={styles.label}>Role</Text>
              <Text style={styles.value}>{currentUser?.profile?.role}</Text>
            </View>
          </View>
          <View style={styles.divider} />

          <View style={styles.row}>
            <Ionicons name="person-circle" size={34} color="#3b82f6" />
            <View style={styles.rowText}>
              <Text style={styles.label}>UserName</Text>
              <Text style={styles.value}>{currentUser?.profile?.username}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.deviceBox}>
            <View style={styles.deviceHeader}>
              <Ionicons name="lock-closed" size={28} color="#3b82f6" />
              <Text style={styles.deviceTitle}> Logged-in Devices</Text>
            </View>
            <Text style={styles.deviceText}>No active sessions</Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.replace('/admindashboard')}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
              <Text style={styles.buttonText}> Go to Dashboard</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={24} color="#fff" />
              <Text style={styles.buttonText}> Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </AlertNotificationRoot>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12121c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '92%',
    backgroundColor: '#2a2a3d',
    borderRadius: 20,
    padding: 24,
  },
  avatarWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  rowText: {
    marginLeft: 12,
  },
  label: {
    color: '#9ca3af',
    fontSize: 18,
  },
  value: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#3f3f5e',
    marginVertical: 8,
  },
  deviceBox: {
    backgroundColor: '#24243a',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  deviceTitle: {
    color: '#3b82f6',
    fontSize: 20,
    fontWeight: '600',
  },
  deviceText: {
    color: '#9ca3af',
    fontSize: 18,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1d4ed8',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
