import { repositoryOverview } from "@/app/api/adminapi/adminDashboard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
} from "react-native-alert-notification";
import { Dropdown } from "react-native-element-dropdown";
import Modal from "react-native-modal";
import { adminBookuploadapi } from "../app/api/adminapi/uploadadminbookapi";

interface UploadBookModalProps {
  isVisible: boolean;
  onClose: () => void;
  onUploadSuccess: (bookId: number) => void;
}

export default function UploadBookModal({
  isVisible,
  onClose,
  onUploadSuccess,
}: UploadBookModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [bookName, setBookName] = useState("");
  const [subject, setSubject] = useState("");

  const [simulationTitle, setSimulationTitle] = useState("");
  const [simulationDesc, setSimulationDesc] = useState("");
  const [grade, setGrade] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [topics, setTopics] = useState("");
  const [prerequisites, setPrerequisites] = useState("");

  const [simulationFile, setSimulationFile] = useState<any>(null);
  const [thumbnailFile, setThumbnailFile] = useState<any>(null);

  const [newsTitle, setNewsTitle] = useState("");
  const [newsCategoryType, setNewsCategoryType] = useState<string | null>(null);
  const [newsDate, setNewsDate] = useState("");
  const [newsDescription, setNewsDescription] = useState("");

  const [repositoryData, setRepositoryData] = useState<{
    category?: any[];
    language?: any[];
    level?: any[];
  }>({});

  const gradeOptions = [
    { label: "Class 6", value: "6" },
    { label: "Class 7", value: "7" },
    { label: "Class 8", value: "8" },
    { label: "Class 9", value: "9" },
    { label: "Class 10", value: "10" },
  ];

  const difficultyOptions = [
    { label: "Beginner", value: "Beginner" },
    { label: "Intermediate", value: "Intermediate" },
    { label: "Advanced", value: "Advanced" },
  ];

  const newsCategoryOptions = [
    { label: "National", value: "National" },
    { label: "International", value: "International" },
    { label: "Sports", value: "Sports" },
    { label: "Science", value: "Science" },
    { label: "Technology", value: "Technology" },
  ];

  const fetchRepository = async () => {
    try {
      const response = await repositoryOverview();

      if (response.success) {
        const grouped = response.data.reduce((acc: any, item: any) => {
          if (!acc[item.type]) acc[item.type] = [];
          acc[item.type].push({
            label: item.text,
            value: item.id,
          });
          return acc;
        }, {});
        setRepositoryData(grouped);
      } else {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "Error",
          textBody: response.message || "Fetching failed",
          button: "OK",
        });
      }
    } catch (err: any) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: err.message || "Fetching failed",
        button: "OK",
      });
    }
  };

  useEffect(() => {
    fetchRepository();
  }, []);

  const handleUpload = async () => {
    const missing = [];
    if (!bookName) missing.push("Book Name");
    if (!selectedCategory) missing.push("Category");
    if (!subject) missing.push("Subject");
    if (!selectedClass) missing.push("Education Level");
    if (!selectedLanguage) missing.push("Language");

    if (missing.length > 0) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Missing Fields",
        textBody: `Please fill the following fields:\n${missing.join("\n")}`,
        button: "Try Again",
      });
      return;
    }

    const formData = new FormData();

    formData.append("bookName", String(bookName));
    formData.append("category", String(selectedCategory));
    formData.append("subject", String(subject));
    formData.append("educationLevel", String(selectedClass));
    formData.append("language", String(selectedLanguage));

    const access_token = await AsyncStorage.getItem("token");
    try {
      const result = await adminBookuploadapi(formData, access_token);
      if (result.success) {
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Success",
          textBody: "Book uploaded successfully!",
          button: "OK",
          onHide: () => {
            setBookName("");
            setSelectedCategory(null);
            setSelectedLanguage(null);
            setSelectedClass(null);
            setSubject("");
            onUploadSuccess(result.result?.id);
          },
        });
      } else {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "Upload Failed",
          textBody: result.result?.message || "Upload failed",
          button: "Try Again",
        });
      }
    } catch (error: any) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Error",
        textBody: error.message || "Something went wrong",
        button: "OK",
      });
    }
  };

  return (
    <AlertNotificationRoot>
      <Modal isVisible={isVisible} onBackdropPress={onClose}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Upload Book</Text>
          <Text style={styles.label}>Select Category</Text>
          <Dropdown
            style={styles.dropdownInput}
            data={repositoryData.category || []}
            labelField="label"
            valueField="value"
            placeholder="Select Category"
            value={selectedCategory}
            onChange={(item) => setSelectedCategory(item.label)}
          />
          {selectedCategory === "School Education" && (
            <>
              <Text style={styles.label}>Education Level</Text>
              <Dropdown
                style={styles.dropdownInput}
                data={repositoryData.level || []}
                labelField="label"
                valueField="value"
                placeholder="Select Education Level"
                value={selectedClass}
                onChange={(item) => setSelectedClass(item.label)}
              />
              <TextInput
                placeholder="Subject"
                style={styles.input}
                value={subject}
                onChangeText={setSubject}
              />
              <TextInput
                placeholder="Book Name"
                style={styles.input}
                value={bookName}
                onChangeText={setBookName}
              />
              <Text style={styles.label}>Language</Text>
              <Dropdown
                style={styles.dropdownInput}
                data={repositoryData.language || []}
                labelField="label"
                valueField="value"
                placeholder="Select Language"
                value={selectedLanguage}
                onChange={(item) => setSelectedLanguage(item.label)}
              />
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: "#ef4444" }]}
                  onPress={onClose}
                >
                  <Text style={styles.modalBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: "#22c55e" }]}
                  onPress={handleUpload}
                >
                  <Text style={styles.modalBtnText}>Upload</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {selectedCategory === "Simulation" && (
            <>
              <Text style={styles.label}>Simulation Title</Text>
              <TextInput
                placeholder="Enter Simulation Title"
                style={styles.input}
                value={simulationTitle}
                onChangeText={setSimulationTitle}
              />

              <Text style={styles.label}>Simulation Description</Text>
              <TextInput
                placeholder="Enter Simulation Description"
                style={[styles.input, { height: 80 }]}
                multiline
                value={simulationDesc}
                onChangeText={setSimulationDesc}
              />

              <Text style={styles.label}>Select Grade</Text>
              <Dropdown
                style={styles.dropdownInput}
                data={gradeOptions}
                labelField="label"
                valueField="value"
                placeholder="Select Grade"
                value={grade}
                onChange={(item) => setGrade(item.value)}
              />

              <Text style={styles.label}>Select Difficulty</Text>
              <Dropdown
                style={styles.dropdownInput}
                data={difficultyOptions}
                labelField="label"
                valueField="value"
                placeholder="Select Difficulty"
                value={difficulty}
                onChange={(item) => setDifficulty(item.value)}
              />

              <Text style={styles.label}>Topics (comma separated)</Text>
              <TextInput
                placeholder="e.g. Motion, Force, Velocity"
                style={styles.input}
                value={topics}
                onChangeText={setTopics}
              />

              <TouchableOpacity style={styles.fileBtn}>
                <Text style={styles.fileBtnText}>
                  {simulationFile
                    ? "Simulation File Selected"
                    : "Choose Simulation File"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.fileBtn}>
                <Text style={styles.fileBtnText}>
                  {thumbnailFile
                    ? "Thumbnail Selected"
                    : "Choose Thumbnail File"}
                </Text>
              </TouchableOpacity>

              <Text style={styles.label}>Prerequisites</Text>
              <TextInput
                placeholder="Enter prerequisites"
                style={[styles.input, { height: 70 }]}
                multiline
                value={prerequisites}
                onChangeText={setPrerequisites}
              />

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: "#ef4444" }]}
                  onPress={onClose}
                >
                  <Text style={styles.modalBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: "#2563eb" }]}
                  onPress={handleUpload}
                >
                  <Text style={styles.modalBtnText}>Upload</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {selectedCategory === "Current Affairs" && (
            <>
              <Text style={styles.label}>Simulation Title</Text>
              <Text style={styles.label}>News Title</Text>
              <TextInput
                placeholder="Enter News Title"
                style={styles.input}
                value={newsTitle}
                onChangeText={setNewsTitle}
              />

              {/* News Description (like editor in image) */}
              <Text style={styles.label}>News Description</Text>
              <TextInput
                placeholder="Start writing..."
                style={[
                  styles.input,
                  { height: 120, textAlignVertical: "top" },
                ]}
                multiline
                value={newsDescription}
                onChangeText={setNewsDescription}
              />

              {/* Category Type */}
              <Text style={styles.label}>Category Type</Text>
              <Dropdown
                style={styles.dropdownInput}
                data={newsCategoryOptions}
                labelField="label"
                valueField="value"
                placeholder="Select Category"
                value={newsCategoryType}
                onChange={(item) => setNewsCategoryType(item.value)}
              />

              {/* Date */}
              <Text style={styles.label}>Date</Text>
              <TextInput
                placeholder="dd-mm-yyyy"
                style={styles.input}
                value={newsDate}
                onChangeText={setNewsDate}
              />

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: "#ef4444" }]}
                  onPress={onClose}
                >
                  <Text style={styles.modalBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: "#2563eb" }]}
                  onPress={handleUpload}
                >
                  <Text style={styles.modalBtnText}>Upload</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </Modal>
    </AlertNotificationRoot>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: "#CECED7FF",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    color: "#000",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  input: {
    backgroundColor: "#AEAEB5FF",
    color: "#000",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 18,
    marginTop: 15,
  },
  label: {
    color: "#000",
    fontSize: 18,
    marginBottom: 4,
    marginTop: 8,
  },
  dropdownInput: {
    height: 50,
    backgroundColor: "#AEAEB5FF",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-between",
  },
  modalBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 10,
    flex: 1,
    marginHorizontal: 4,
  },
  modalBtnText: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 4,
  },
  fileBtn: {
    backgroundColor: "#E5E7EB",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 12,
  },
  fileBtnText: {
    color: "#000",
    fontSize: 16,
  },
});
