import CircularChart from '@/components/CircularChart';
import LatestReleaseModel from '@/components/LatestReleaseModel';
import UploadModalCredentails from '@/components/UploadModalCredentails';
import WelcomeHeader from '@/components/WelcomeHeader';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
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
import { AdminStats } from '../api/adminapi/adminDashboard';
import { UploadCredentails } from '../api/adminapi/adminUploadCredentails';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showChangelog, setShowChangelog] = useState(false);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [file, setFile] = useState<any>(null);

  const onFilePick = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
      ],
      copyToCacheDirectory: true,
    });
    if (result.canceled) return;

    setFile(result.assets[0]);
  };

  const fetchStats = async () => {
    try {
      const response = await AdminStats();

      if (response.success) {
        setStats(response.data);
      } else {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Error fetching Stats',
          textBody: response.message,
          button: 'Try Again',
        });
      }
    } catch (error: any) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Upload Failed',
        textBody: error.message,
        button: 'Try Again',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const onUpload = async () => {
    if (!file) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: 'No File Selected',
        textBody: 'Please select a PDF or Excel file.',
        button: 'OK',
      });
      return;
    }

    const token = await AsyncStorage.getItem('token');

    const formData = new FormData();
    formData.append('credentialFile', {
      uri: file.uri,
      type:
        file.mimeType ||
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      name: file.name,
    } as any);
    const result = await UploadCredentails(token, formData);
    if (result?.message) {
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Upload Complete',
        textBody: 'Your file has been uploaded successfully.',
        button: 'OK',
        onHide: () => {
          setShowUploadModal(false);
          setFile(null);
        },
      });
    } else {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Upload Failed',
        textBody: result.message,
        button: 'Try Again',
      });
    }
  };

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
        <Text style={{ color: '#fff' }}>
          Login user token has expire please again login{' '}
        </Text>
      </View>
    );
  }

  return (
    <AlertNotificationRoot>
      <View style={styles.container}>
        <ScrollView style={styles.mainContent}>
          <WelcomeHeader />
          <View style={styles.headerRow}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <TouchableOpacity
              onPress={() => setShowUploadModal(true)}
              style={styles.uploadBtnMain}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.uploadBtnMainText}>Upload Credentails</Text>
                <Ionicons
                  name="add"
                  size={24}
                  style={{ color: 'white', marginLeft: 2 }}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { borderColor: '#ff7043' }]}>
              <Text style={styles.statTitle}>Books</Text>
              <Text style={styles.statValue}>{stats.totalBooks} items</Text>
            </View>
            <View style={[styles.statCard, { borderColor: '#42a5f5' }]}>
              <Text style={styles.statTitle}>PDFs</Text>
              <Text style={styles.statValue}>{stats.totalPdf} items</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { borderColor: '#66bb6a' }]}>
              <Text style={styles.statTitle}>Audios</Text>
              <Text style={styles.statValue}>{stats.totalAudio} items</Text>
            </View>
            <View style={[styles.statCard, { borderColor: '#ffa726' }]}>
              <Text style={styles.statTitle}>Videos</Text>
              <Text style={styles.statValue}>{stats.totalVideos} items</Text>
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
                  <Text style={{ color: '#66bb6a' }}>09 November 2026</Text>
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <TouchableOpacity
                  style={styles.releaseButton}
                  onPress={() => setShowChangelog(true)}
                >
                  <Text style={styles.releaseButtonText}>
                    🚀 Latest Release
                  </Text>
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.releaseDeveloper}>⚙️ Developed by </Text>

                  <TouchableOpacity
                    onPress={() => Linking.openURL('https://sestinfotech.com/')}
                  >
                    <Text style={styles.releaseDevName}>
                      SEST INFOTECH PVT LTD
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.releaseRights}>
                  © 2026 All rights reserved
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <UploadModalCredentails
          visible={showUploadModal}
          file={file}
          onFilePick={onFilePick}
          onClose={() => setShowUploadModal(false)}
          onUpload={onUpload}
        />
        <LatestReleaseModel
          visible={showChangelog}
          onClose={() => setShowChangelog(false)}
        />
      </View>
    </AlertNotificationRoot>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
  },
  uploadBtnMain: {
    backgroundColor: '#42a5f5',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  uploadBtnMainText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionTitle: {
    textAlign: 'center',
    color: '#43FF9BFF',
    fontSize: 24,
    marginTop: 10,
    marginBottom: 10,
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
    fontSize: 18,
    textAlign: 'center',
  },
  releaseRights: {
    color: '#777',
    fontSize: 18,
    marginTop: 4,
  },
});
