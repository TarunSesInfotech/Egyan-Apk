import AnnouncementsSection from "@/components/studentcomponents/AnnouncementsSection";
import AssessmentsList from "@/components/studentcomponents/AssessmentsList";
import QuickActions from "@/components/studentcomponents/QuickActions";
import QuizzesList from "@/components/studentcomponents/QuizzesList";
import WelcomeHeader from "@/components/WelcomeHeader";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import {
  studentMetrices
} from "../api/studentapi/studentDashboardApi";

export default function StudentDashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    try {
      const response = await studentMetrices();
      if (response.success) {
        setMetrics(response.data);
      }
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const formatTime = (totalSeconds: number) => {
    const safe = Math.max(0, Math.floor(Number(totalSeconds) || 0));
    const hours = Math.floor(safe / 3600);
    const minutes = Math.floor((safe % 3600) / 60);
    return `${hours}h ${String(minutes).padStart(2, "0")}m`;
  };

  const stats = metrics
    ? [
        {
          title: "Total Time Spent",
          value: formatTime(metrics.totalTimeSpent),
          color: "#FF6B00",
          icon: <Ionicons name="time" size={32} color="#FF6B00" />,
        },
        {
          title: "Books Completed",
          value: metrics.booksCompleted,
          color: "#43B0FF",
          icon: <FontAwesome5 name="book" size={30} color="#43B0FF" />,
        },
        {
          title: "Recent Activity",
          value: metrics.recentActivityCount,
          color: "#43FF9B",
          icon: <Ionicons name="book-outline" size={32} color="#43FF9B" />,
        },
        {
          title: "Favorites",
          value: metrics.favoriteBooksCount,
          color: "#FFB800",
          icon: <Ionicons name="heart" size={32} color="#FFB800" />,
        },
      ]
    : [];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.mainContent}
        showsVerticalScrollIndicator={false}
      >
         {/* Welcome Header */}
        <WelcomeHeader />
        <Text style={styles.sectionTitle}>Dashboard Overview</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#43FF9B" />
        ) : (
          <View style={styles.statsContainer}>
            {stats.map((item, index) => (
              <View key={index} style={styles.dashboardCard}>
                <View
                  style={[
                    styles.dashboardIconWrapper,
                    { backgroundColor: `${item.color}20` },
                  ]}
                >
                  {item.icon}
                </View>

                <View style={styles.dashboardTextWrapper}>
                  <Text style={styles.dashboardTitle}>{item.title}</Text>
                  <Text style={styles.dashboardValue}>{item.value}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* QuickActions */}
        <QuickActions />

        {/* ===== ANNOUNCEMENTS ===== */}
        <AnnouncementsSection />

        {/* ===== ASSESSMENTS ===== */}
        <AssessmentsList />

         {/* ===== QUIZZES ===== */}
        <QuizzesList />

      </ScrollView>
    </View>
  );
}

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 15,
  },
  mainContent: {
    padding: 15,
  },
  sectionTitle: {
    color: "#43FF9B",
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 5,
  },

  /* ===== DASHBOARD STATS ===== */
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  dashboardCard: {
    width: "48%",
    backgroundColor: "#1C1F2E",
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  dashboardIconWrapper: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  dashboardTextWrapper: {
    flex: 1,
  },
  dashboardTitle: {
    color: "#CFCFCF",
    fontSize: 18,
    marginBottom: 6,
  },
  dashboardValue: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
});
