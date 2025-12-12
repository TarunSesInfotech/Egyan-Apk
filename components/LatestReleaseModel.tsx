import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function LatestReleaseModel({ visible, onClose }: any) {
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
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalBackdrop}>
        <View style={styles.modalContainer}>
          <View style={styles.banner}>
            <Text style={styles.bannerIcon}>🚀</Text>
            <Text style={styles.bannerTitle}>What's New?</Text>
            <Text style={styles.bannerSubtitle}>
              Latest updates, improvements, and bug fixes.
            </Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {changelogData.map((item: any, index: number) => (
              <View key={index}>
                <View style={styles.timelineRow}>
                  <View style={styles.dot} />
                  <Text style={styles.dateText}>{item.date}</Text>
                </View>

                <View style={styles.card}>
                  <Text style={styles.versionTitle}>{item.version}</Text>

                  <Text style={styles.sectionHeading}>Improvements</Text>
                  {item.improvements.map((v: string, i: number) => (
                    <Text key={i} style={styles.bullet}>
                      • {v}
                    </Text>
                  ))}

                  <Text style={styles.sectionHeadingBug}>Bug Fixes</Text>
                  {item.bugfixes.map((v: string, i: number) => (
                    <Text key={i} style={styles.bullet}>
                      • {v}
                    </Text>
                  ))}
                </View>
              </View>
            ))}

            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
    padding: 20,
    borderRadius: 16,
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
  },
  bannerSubtitle: {
    color: '#e0e0e0',
    textAlign: 'center',
    marginTop: 4,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  dot: {
    width: 14,
    height: 14,
    backgroundColor: '#1d8cf8',
    borderRadius: 7,
  },
  dateText: {
    color: '#fff',
    marginLeft: 10,
  },
  card: {
    backgroundColor: '#1e1e2d',
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#333',
  },
  versionTitle: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionHeading: {
    color: '#8ab4ff',
    fontSize: 18,
    marginTop: 10,
  },
  sectionHeadingBug: {
    color: '#ff6ab4',
    fontSize: 18,
    marginTop: 10,
  },
  bullet: {
    color: '#ddd',
    marginTop: 6,
  },
  closeBtn: {
    backgroundColor: '#1d8cf8',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  closeBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
