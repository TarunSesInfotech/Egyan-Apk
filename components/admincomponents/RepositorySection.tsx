import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

type Props = {
  title: string;
  items: any[];
  selectedValue: any;
  inputValue: string;
  editData: { type?: string; id?: number | null };
  onSelect: (value: any) => void;
  onInputChange: (text: string) => void;
  onAdd: () => void;
  onUpdate: () => void;
  onEdit: (label: string, id: number) => void;
  onDelete: (id: number) => void;
};

export default function RepositorySection({
  title,
  items,
  selectedValue,
  inputValue,
  editData,
  onSelect,
  onInputChange,
  onAdd,
  onUpdate,
  onEdit,
  onDelete,
}: Props) {
  if (!items) return null;

  return (
    <View style={styles.sectionWrapper}>
      <Text style={styles.label}>{title}</Text>

      <LinearGradient
        colors={["#8B4DFF", "#5B2BE3"]}
        style={styles.gradientDropdown}
      >
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={items}
          labelField="label"
          valueField="value"
          placeholder={`Select ${title}`}
          value={selectedValue || null}
          renderRightIcon={() => (
            <Ionicons name="chevron-down" size={28} color="#fff" />
          )}
          onChange={(item) => onSelect(item.value)}
          renderItem={(item) => (
            <View style={styles.dropdownItem}>
              <Text style={styles.dropdownItemText}>{item.label}</Text>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={() => onEdit(item.label, item.value)}
                >
                  <Ionicons name="create-outline" size={20} color="#FFD700" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={() => onDelete(item.value)}
                >
                  <Ionicons name="trash-outline" size={20} color="#FF4C4C" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </LinearGradient>

      <View style={{ padding: 10, backgroundColor: "#1B1B28" }}>
        <View style={styles.inputRow}>
          <TextInput
            placeholder={`Add new ${title}`}
            placeholderTextColor="#999"
            style={styles.input}
            value={inputValue}
            onChangeText={onInputChange}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={editData.type === title ? onUpdate : onAdd}
          >
            <Text style={styles.addButtonText}>
              {editData.type === title ? "Update" : "Add"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionWrapper: {
    marginBottom: 22,
  },
  label: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 8,
    fontWeight: "600",
  },
  gradientDropdown: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  dropdown: {
    height: 45,
  },
  placeholderStyle: {
    color: "#fff",
    fontSize: 16,
  },
  selectedTextStyle: {
    color: "#fff",
    fontSize: 16,
  },
  dropdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#1B1B28",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  dropdownItemText: {
    color: "#fff",
    fontSize: 16,
  },
  iconBtn: {
    marginLeft: 10,
    padding: 4,
  },
  inputRow: {
    flexDirection: "row",
    marginTop: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#1F1F2E",
    borderRadius: 8,
    paddingHorizontal: 10,
    color: "#fff",
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#0fba17",
    paddingHorizontal: 14,
    justifyContent: "center",
    marginLeft: 6,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
