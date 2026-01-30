import { singleSchoolOverview } from "@/app/api/adminapi/adminSchoolOverview";
import { useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import { BarChart, LineChart, PieChart } from "react-native-chart-kit";

export default function SchoolAnalytics() {
  const [overview, setOverview] = useState<any>(null);

  const fetchsingleSchoolOverview = async () => {
    try {
      const response = await singleSchoolOverview();
      if (response.success) {
        setOverview(response.data);
      } else {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "Error fetching setSchoolOverview",
          textBody: response.message,
          button: "Try Again",
        });
      }
    } catch (error: any) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error fetching setSchoolOverview",
        textBody: error.message,
        button: "Try Again",
      });
    }
  };

  useEffect(() => {
    fetchsingleSchoolOverview();
  }, []);

  const screenWidth = Dimensions.get("window").width;

  const chartConfig = {
    backgroundGradientFrom: "#1e1e2d",
    backgroundGradientTo: "#1e1e2d",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 229, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: { borderRadius: 12 },
  };

  const yellowChartConfig = {
    ...chartConfig,
    color: (opacity = 1) => `rgba(253, 216, 53, ${opacity})`,
  };

  if (!overview) {
    return <Text style={{ color: "#fff" }}>Loading...</Text>;
  }

  /* ================== DATA BINDINGS ================== */

  // 2. Subject Engagement (subjectEngagement)
  const subjectEngagementData = {
    labels: overview.subjectEngagement.map((s: any) => s.name),
    datasets: [
      {
        data: overview.subjectEngagement.map((s: any) => s.value),
      },
    ],
  };

  // 3. Student Activity (activityStats)
  const activityPieData = overview.activityStats.map(
    (item: any, index: number) => ({
      name: item.name,
      population: item.value, // API wali real value
      color: index === 0 ? "#3f82ff" : index === 1 ? "#00e5ff" : "#2ecc71",
      legendFontColor: "#fff",
      legendFontSize: 14,
    }),
  );

  // 4. Study Time (studyTime)
  const performanceData = {
    labels: overview.performance.map((p: any) => p.month),
    datasets: [{ data: overview.performance.map((p: any) => p.value) }],
  };

  const studyTimeData = {
    labels: overview.studyTime.map((d: any) => d.day),
    datasets: [{ data: overview.studyTime.map((d: any) => d.time) }],
  };

  // 5. Leaderboard
  const leaderboardData = overview.leaderboard;

  return (
    <ScrollView>
      <Text style={styles.header}>School Analytics</Text>

      {/* Overall Performance */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Overall Performance</Text>
        <LineChart
          data={performanceData}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>

      {/* Subject Engagement */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Subject Engagement</Text>
        <BarChart
          data={subjectEngagementData}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
          fromZero
          showValuesOnTopOfBars // ye bar ke upar exact value dikhata hai
        />
      </View>

      {/* Student Activity */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Student Activity</Text>
        <PieChart
          data={activityPieData}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
        />
      </View>

      {/* Average Study Time */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Average Study Time</Text>
        <LineChart
          data={studyTimeData}
          width={screenWidth - 40}
          height={220}
          chartConfig={yellowChartConfig}
          bezier
          style={styles.chart}
        />
      </View>

      {/* Leaderboard */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Top Performing Students</Text>

        <View style={[styles.studentRow, { borderBottomWidth: 1 }]}>
          <Text style={[styles.studentName, { fontWeight: "bold" }]}>Name</Text>
          <Text style={[styles.studentScore, { fontWeight: "bold" }]}>
            Score
          </Text>
        </View>

        {leaderboardData.map((student: any, index: number) => (
          <View key={index} style={styles.studentRow}>
            <Text style={styles.studentName}>{student.name}</Text>
            <Text style={styles.studentScore}>{student.score}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#1e1e2d",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  cardTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  chart: {
    borderRadius: 12,
  },
  studentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: "#333",
  },
  studentName: {
    color: "#ffffff",
    fontSize: 18,
  },
  studentScore: {
    color: "#00e5ff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
