import SubjectWiseProgress from "@/components/studentcomponents/SubjectWiseProgress";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
} from "react-native-alert-notification";
import { studentProgressApi } from "../api/studentapi/progressActiivityApi";

interface Recentfile {
  id: number;
  name: string;
  date: string;
  bookClass: string;
}

export default function MyProgress() {
  const [progress, setProgress] = useState<any>("");
  const [loading, setLoading] = useState(true);

  const fetchProgress = async () => {
    try {
      const response = await studentProgressApi();
      if (response.success) {
        setProgress(response.data);
      } else {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "Error",
          textBody: response.message || "Failed to submit concern",
          button: "OK",
        });
      }
    } catch (error: any) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: error.message || "Failed to submit concern",
        button: "OK",
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProgress();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "#fff", textAlign: "center", marginTop: 50 }}>
          Loading...
        </Text>
      </View>
    );
  }
  const stats = progress
    ? [
        {
          id: 1,
          title: "Books In Progress",
          value: String(progress.booksInProgress),
          icon: { lib: "MaterialIcons", name: "menu-book", color: "#43FF9B" },
        },
        {
          id: 2,
          title: "Avg. Session Time",
          value: progress.avgSessionTime,
          icon: { lib: "Ionicons", name: "timer", color: "#B266FF" },
        },
        {
          id: 3,
          title: "Last Activity",
          value: new Date(progress.lastActivity).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "2-digit",
          }),
          icon: { lib: "Ionicons", name: "time", color: "#FF6584" },
        },
      ]
    : [];

  const progressData = progress
    ? Object.entries(progress.subjectWiseProgress).map(
        ([subject, data]: any) => ({
          subject,
          percent: data.percentage,
          books: data.books,
        })
      )
    : [];
  const recentFiles = progress
    ? progress.recentActivity.map((item: any, idx: number) => ({
        id: idx + 1,
        name: item.title,
        date: new Date(item.time).toLocaleString("en-IN", {
          day: "2-digit",
          month: "numeric",
          year: "numeric",
        }),
        bookClass: item.bookClass,
      }))
    : [];

  return (
    <AlertNotificationRoot>
      <View style={styles.container}>
        <ScrollView style={styles.mainContent}>
          <Text style={styles.sectionTitle}>📊 My Progress</Text>
          <Text style={styles.subTitle}>
            Track your study activity and performance over time.
          </Text>
          <View style={styles.statsContainer}>
            {stats.map((s) => (
              <View key={s.id} style={styles.statCard}>
                <View style={styles.iconWrapper}>
                  {s.icon.lib === "MaterialIcons" ? (
                    <MaterialIcons
                      name={s.icon.name as any}
                      size={32}
                      color={s.icon.color}
                    />
                  ) : (
                    <Ionicons
                      name={s.icon.name as any}
                      size={32}
                      color={s.icon.color}
                    />
                  )}
                </View>

                <View style={styles.statTextContainer}>
                  <Text style={styles.statTitle}>{s.title}</Text>
                  <Text style={styles.statValue}>{s.value}</Text>
                </View>
              </View>
            ))}
          </View>

          <SubjectWiseProgress data={progressData} />

          <View style={styles.recentSection}>
            <View style={styles.recentHeader}>
              <Ionicons name="time-outline" size={28} color="#fff" />
              <Text style={styles.recentTitle}>Recently Accessed</Text>
            </View>

            {recentFiles.map((file: Recentfile) => (
              <View key={file.id} style={styles.recentCard}>
                <Text style={styles.recentBookName}>
                  <Text style={{ fontWeight: "bold" }}>PDF:</Text> {file.name}
                </Text>
                <Text style={styles.recentMeta}>
                  {file.bookClass} : {file.date}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </AlertNotificationRoot>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  mainContent: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    color: "#43FF9B",
    fontSize: 28,
  },
  subTitle: {
    color: "#aaa",
    fontSize: 24,
    marginTop: 5,
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#1C1C2E",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    paddingLeft: 8,
    paddingVertical: 12,
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#2A2A3D",
    justifyContent: "center",
    alignItems: "center",
  },
  statValue: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  statTextContainer: {
    flex: 1,
  },
  statTitle: {
    color: "#A0A0B2",
    fontSize: 18,
    marginTop: 5,
    textAlign: "center",
  },
  recentSection: {
    marginTop: 10,
    padding: 18,
    backgroundColor: "#2A2A3A",
    borderRadius: 16,
    marginBottom: 60,
  },

  recentHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },

  recentTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },

  recentCard: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#3A3A4D",
  },

  recentBookName: {
    color: "#fff",
    fontSize: 18,
  },

  recentMeta: {
    color: "#9CA3AF",
    fontSize: 16,
    textAlign: "right",
  },
});
