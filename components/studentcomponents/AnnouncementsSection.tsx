import { announcementsApi } from "@/app/api/studentapi/studentDashboardApi";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function AnnouncementsSection() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* ===================== Announcement Api calling ===================== */
  const fetchAnnouncements = async () => {
    try {
      const response = await announcementsApi();
      if (response.success) {
        setAnnouncements(response.data);
      }
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <>
      {/* ===== ANNOUNCEMENTS HEADER ===== */}
      <View style={styles.announcementHeader}>
        <MaterialIcons name="campaign" size={34} color="#FFD700" />
        <Text style={styles.announcementTitle}>Announcements</Text>
      </View>

      {/* ===== ANNOUNCEMENTS LIST ===== */}
      {loading ? (
        <Text style={styles.noAnnouncement}>Loading announcements...</Text>
      ) : announcements.length > 0 ? (
        announcements.map((a) => (
          <View key={a.id} style={styles.announcementCard}>
            <View style={styles.announcementIconWrapper}>
              <MaterialIcons name="campaign" size={32} color="#FFD700" />
            </View>

            <View style={styles.announcementContent}>
              <Text style={styles.announcementText}>{a.message}</Text>
              {a.createdAt && (
                <View style={styles.announcementDateRow}>
                  <MaterialIcons
                    name="calendar-today"
                    size={20}
                    color="#fff"
                  />
                  <Text style={styles.announcementDate}>
                    {new Date(a.createdAt).toDateString()}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.announcementImageWrapper}>
              <Ionicons name="book" size={28} color="#43B0FF" />
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.noAnnouncement}>No announcements available.</Text>
      )}
    </>
  );
}

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  announcementHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  announcementTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FF5C8A",
    marginHorizontal: 10,
  },
  announcementCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E2E",
    padding: 14,
    borderRadius: 14,
    marginBottom: 14,
    elevation: 4,
  },
  announcementIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFD70020",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  announcementContent: {
    flex: 1,
  },
  announcementText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 6,
  },
  announcementDateRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  announcementDate: {
    color: "#AAA",
    fontSize: 18,
    marginLeft: 6,
  },
  announcementImageWrapper: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#43B0FF20",
    alignItems: "center",
    justifyContent: "center",
  },
  noAnnouncement: {
    color: "#AAA",
    fontSize: 18,
    textAlign: "center",
    marginTop: 10,
  },
});
