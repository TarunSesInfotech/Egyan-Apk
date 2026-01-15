import WelcomeHeader from "@/components/WelcomeHeader";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { studentProgressApi } from "../api/studentapi/progressActiivityApi";

export default function MyProgress() {
  const [progress, setProgress] = useState<any>("");
  const [loading, setLoading] = useState(true);

  const fetchProgress = async () => {
    try {
      const response = await studentProgressApi();
      if (response.success) {
        setProgress(response.data);
      } else {
        console.error("Error fetching Progress:", response.message);
      }
    } catch (error: any) {
      console.error("Error fetching Progress:", error.message);
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
          value: new Date(progress.lastActivity).toLocaleString(),
          icon: { lib: "Ionicons", name: "time", color: "#FF6584" },
        },
      ]
    : [];

  const progressData = progress
    ? Object.entries(progress.subjectWiseProgress).map(
        ([subject, data]: any) => ({
          subject,
          percent: data.percentage,
        })
      )
    : [];

  const recentFiles = progress
    ? progress.recentActivity.map((item: any, idx: number) => ({
        id: idx + 1,
        name: item.title,
        date: new Date(item.time).toLocaleString(),
      }))
    : [];
  return (
    <View style={styles.container}>
      <ScrollView style={styles.mainContent}>
        <WelcomeHeader />
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

        <View style={styles.progressSection}>
          <Text style={styles.progressTitle}>📚 Subject-wise Progress</Text>
          {progressData.map((item, idx) => (
            <View key={idx} style={styles.progressItem}>
              <Text style={styles.progressLabel}>{item.subject}</Text>
              <View style={styles.progressBarBackground}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${item.percent}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressPercent}>{item.percent}%</Text>
            </View>
          ))}
        </View>
        <View style={styles.recentSection}>
          <Text style={styles.recentTitle}>🕒 Recently Accessed</Text>
          {recentFiles.map(
            (file: { id: number; name: string; date: string }) => (
              <Text key={file.id} style={styles.recentItem}>
                <Text style={{ color: "#43B0FF", fontWeight: "bold" }}>
                  PDF:
                </Text>{" "}
                {file.name} ({file.date})
              </Text>
            )
          )}
        </View>
      </ScrollView>
    </View>
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
    marginTop: 20,
  },
  subTitle: {
    color: "#aaa",
    fontSize: 24,
    marginTop: 5,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 4,
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
  progressSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#1E1E2E",
    borderRadius: 12,
  },
  progressTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#43FF9B",
    marginBottom: 15,
  },
  progressItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  progressLabel: {
    color: "#fff",
    flex: 1,
    fontSize: 18,
  },
  progressBarBackground: {
    flex: 4,
    height: 8,
    backgroundColor: "#333",
    borderRadius: 5,
    marginHorizontal: 10,
  },
  progressBarFill: {
    height: 8,
    backgroundColor: "#43FF9B",
    borderRadius: 5,
  },
  progressPercent: {
    color: "#ccc",
    width: 40,
    textAlign: "right",
    fontSize: 18,
  },
  recentSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#1E1E2E",
    borderRadius: 12,
  },
  recentTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FF5C8A",
    marginBottom: 10,
  },
  recentItem: {
    color: "#ccc",
    fontSize: 24,
    marginBottom: 16,
  },
});
