import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function QuickActions() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.quickActionsContainer}>
      <View style={styles.quickActionRow}>

        {/* ===================== Pressable Button for Study Material ===================== */}
        <Pressable
          style={[styles.quickActionCard, { borderColor: "#4D8DFF" }]}
          onPress={() => navigation.navigate("study-material")}
        >
          <View
            style={[
              styles.quickActionIconWrapper,
              { backgroundColor: "#4D8DFF20" },
            ]}
          >
            <FontAwesome5 name="layer-group" size={28} color="#4D8DFF" />
          </View>
          <Text style={styles.quickActionText}>Study Material</Text>
        </Pressable>

        {/* ===================== Pressable Button for My Progress ===================== */}
        <Pressable
          style={[styles.quickActionCard, { borderColor: "#43FF9B" }]}
          onPress={() => navigation.navigate("my-progress")}
        >
          <View
            style={[
              styles.quickActionIconWrapper,
              { backgroundColor: "#43FF9B20" },
            ]}
          >
            <Ionicons name="stats-chart" size={28} color="#43FF9B" />
          </View>
          <Text style={styles.quickActionText}>My Progress</Text>
        </Pressable>
      </View>
      <View style={styles.quickActionRow}>

        {/* ===================== Pressable Button for Recent Activity ===================== */}
        <Pressable
          style={[styles.quickActionCard, { borderColor: "#FFD000" }]}
          onPress={() => navigation.navigate("recent-activity")}
        >
          <View
            style={[
              styles.quickActionIconWrapper,
              { backgroundColor: "#FFD00020" },
            ]}
          >
            <Ionicons name="time-outline" size={28} color="#FFD000" />
          </View>
          <Text style={styles.quickActionText}>Recent Activity</Text>
        </Pressable>

        {/* ===================== Pressable Button for Favorites ===================== */}
        <Pressable
          style={[styles.quickActionCard, { borderColor: "#FF5C8A" }]}
          onPress={() => navigation.navigate("favorites")}
        >
          <View
            style={[
              styles.quickActionIconWrapper,
              { backgroundColor: "#FF5C8A20" },
            ]}
          >
            <Ionicons name="heart" size={28} color="#FF5C8A" />
          </View>
          <Text style={styles.quickActionText}>Favorites</Text>
        </Pressable>
      </View>
    </View>
  );
}

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  quickActionsContainer: {
    marginTop: 10,
  },
  quickActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  quickActionCard: {
    width: "48%",
    height: 72,
    borderRadius: 14,
    borderWidth: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  quickActionIconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  quickActionText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 8,
  },
});
