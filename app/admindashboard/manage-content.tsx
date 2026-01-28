import EditBookModal from "@/components/EditBookModal";
import ManageBookChaptersModal from "@/components/ManageBookChaptersModal";
import UploadBookModal from "@/components/UploadBookModal";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { WebView } from "react-native-webview";
import { getChapterDeleteApi } from "../api/adminapi/uploadadminbookapi";
import {
  StudentBookApi,
  studentStudyMaterialApi,
} from "../api/studentapi/studyMaterialApi";

interface Book {
  category: any;
  language: any;
  id: number;
  bookName: string;
  subject: string;
  educationLevel: string;
  thumbnail: string;
  thumbnailProxyUrl: string;
}

export default function ManageContent() {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [studyMaterialData, setStudyMaterialData] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);

  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editBook, setEditBook] = useState<Book | null>(null);

  const [isChapterModalVisible, setChapterModalVisible] = useState(false);

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isPdfModalVisible, setPdfModalVisible] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchStudyMaterial = async () => {
    try {
      const response = await studentStudyMaterialApi();
      if (response.success) {
        setStudyMaterialData(response.data);
        setFilteredBooks(response.data);
      } else {
        console.error("Error fetching study-material:", response.message);
      }
    } catch (error: any) {
      console.error("Error fetching study-material:", error.message);
    }
  };

  useEffect(() => {
    if (selectedClass) {
      const filtered = studyMaterialData.filter(
        (book) => book.educationLevel === selectedClass,
      );
      setFilteredBooks(filtered);
      setCurrentPage(1);
    } else {
      setFilteredBooks(studyMaterialData);
    }
  }, [selectedClass, studyMaterialData]);

  useEffect(() => {
    fetchStudyMaterial();
  }, []);

  const getImageUrl = (url: string) => {
    if (url.includes("index.php/s/") && !url.endsWith("/download")) {
      return `${url}/download`;
    }
    return url;
  };

  const getPdfUrl = (url: string) => {
    if (!url || typeof url !== "string") return "";
    if (url.endsWith("/download")) {
      return url.replace("/download", "");
    }

    return url;
  };

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBooks = filteredBooks.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleOpenBook = async (bookId: number) => {
    try {
      const response = await StudentBookApi(bookId);
      if (!response.success) {
        alert("Failed to load book chapters");
        return;
      }
      const chapters = response.data;
      const pdfChapters = chapters.filter(
        (ch: any) => ch.resourceType === "pdf",
      );
      if (pdfChapters.length === 0) {
        alert("No PDF chapters available");
        return;
      }
      const pdfLink = pdfChapters[0].fileUrl;
      if (!pdfLink) {
        alert("PDF URL missing in chapter");
        return;
      }
      const finalPdfUrl = getPdfUrl(pdfLink);
      setPdfUrl(finalPdfUrl);
      setPdfModalVisible(true);
    } catch (error) {
      console.error("Error opening book:", error);
    }
  };

  const handleDeleteBook = (bookId: number) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this book?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const response = await getChapterDeleteApi(bookId);

              if (response.success) {
                alert("Book deleted successfully!");

                const updatedList = studyMaterialData.filter(
                  (item) => item.id !== bookId,
                );
                setStudyMaterialData(updatedList);
                setFilteredBooks(updatedList);
              } else {
                alert("Failed to delete the book");
              }
            } catch (error) {
              console.error("Delete Error:", error);
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  const closePdfModal = () => {
    setPdfUrl("");
    setPdfModalVisible(false);
  };

  const renderBook = ({ item }: { item: Book }) => (
    <View style={styles.card}>
      <View style={styles.imagePlaceholder}>
        <Image
          source={{ uri: getImageUrl(item.thumbnail) }}
          style={styles.bookImage}
        />
        <TouchableOpacity style={styles.cornerViewBtn}>
          <Ionicons name="document-text-outline" size={22} color="#fff" />
          <Text style={styles.cornerViewText}>View</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.bookName}>{item.bookName}</Text>
      <Text style={styles.subject}>{item.subject}</Text>
      <Text style={styles.classText}>{item.educationLevel}</Text>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => {
            setEditBook(item);
            setEditModalVisible(true);
          }}
        >
          <Ionicons name="create-outline" size={22} color="#facc15" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => {
            setSelectedBookId(item.id);
            setChapterModalVisible(true);
          }}
        >
          <Ionicons name="book" size={22} color="#facc15" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => handleDeleteBook(item.id)}
        >
          <Ionicons name="trash-outline" size={22} color="#f87171" />
        </TouchableOpacity>
      </View>
      <View
        style={{
          borderBottomColor: "#ccc",
          borderBottomWidth: 1,
          marginVertical: 10,
        }}
      />
      <TouchableOpacity
        style={styles.viewBtn}
        onPress={() => handleOpenBook(item.id)}
      >
        <Ionicons name="document-text-outline" size={24} color="#3b82f6" />
        <Text style={styles.viewText}>View</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={24} color="#aaa" />
          <TextInput
            placeholder="Search Books..."
            placeholderTextColor="#888"
            style={styles.searchInput}
          />
        </View>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="cloud-upload-outline" size={24} color="#fff" />
          <Text style={styles.uploadText}>Upload Content</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.classHeader}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons
            name="book"
            size={26}
            style={{ marginRight: 6, color: "white" }}
          />
          <Text style={styles.sectionTitle}>Manage Books</Text>
        </View>
        <View style={styles.dropdownContainer}>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={[
              { label: "All Class", value: null },
              ...Array.from(
                new Set(studyMaterialData.map((item) => item.educationLevel)),
              ).map((level) => ({
                label: level,
                value: level,
              })),
            ]}
            maxHeight={400}
            labelField="label"
            valueField="value"
            placeholder="All Class"
            value={selectedClass}
            onChange={(item) => setSelectedClass(item.value)}
            renderRightIcon={() => (
              <Ionicons name="chevron-down" size={22} color="#aaa" />
            )}
          />
        </View>
        {/* <View style={styles.dropdownContainer}>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={[
              { label: "All Category", value: null },
              ...Array.from(
                new Set(studyMaterialData.map((item) => item.educationLevel)),
              ).map((level) => ({
                label: level,
                value: level,
              })),
            ]}
            maxHeight={400}
            labelField="label"
            valueField="value"
            placeholder="All Class"
            value={selectedClass}
            onChange={(item) => setSelectedClass(item.value)}
            renderRightIcon={() => (
              <Ionicons name="chevron-down" size={22} color="#aaa" />
            )}
          />
        </View> */}
      </View>

      {/* 📚 Book List */}
      <FlatList
        data={currentBooks}
        renderItem={renderBook}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.gridContainer}
      />

      {/* 📄 Pagination Controls */}
      {totalPages > 1 && (
        <View style={styles.paginationContainer}>
          <TouchableOpacity
            disabled={currentPage === 1}
            onPress={() => setCurrentPage(currentPage - 1)}
            style={[
              styles.pageButton,
              currentPage === 1 && styles.disabledButton,
            ]}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
            <Text style={styles.pageText}>Prev</Text>
          </TouchableOpacity>
          <Text style={styles.pageNumber}>
            Page {currentPage} of {totalPages}
          </Text>
          <TouchableOpacity
            disabled={currentPage === totalPages}
            onPress={() => setCurrentPage(currentPage + 1)}
            style={[
              styles.pageButton,
              currentPage === totalPages && styles.disabledButton,
            ]}
          >
            <Text style={styles.pageText}>Next</Text>
            <Ionicons name="chevron-forward" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      {/* 📘 Upload Modal */}
      <UploadBookModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onUploadSuccess={(bookId) => {
          setModalVisible(false);
          setSelectedBookId(bookId);
          setChapterModalVisible(true);
        }}
      />

      {/* edit model here */}
      <EditBookModal
        isVisible={isEditModalVisible}
        editBook={editBook}
        setEditBook={setEditBook}
        onClose={() => setEditModalVisible(false)}
        onUpdate={(updatedBook) => {
          setEditModalVisible(false);
        }}
      />

      {/* book open model here */}
      {selectedBookId && (
        <ManageBookChaptersModal
          isVisible={isChapterModalVisible}
          onClose={() => setChapterModalVisible(false)}
          bookId={selectedBookId}
        />
      )}

      <Modal visible={isPdfModalVisible} animationType="slide">
        <View style={styles.pdfHeader}>
          <TouchableOpacity onPress={closePdfModal}>
            <Ionicons name="close-circle" size={48} color="#333" />
          </TouchableOpacity>
          <Text style={styles.pdfHeaderText}>PDF Viewer</Text>
        </View>
        {pdfUrl ? (
          <WebView source={{ uri: pdfUrl }} style={{ flex: 1 }} />
        ) : (
          <Text>Loading PDF...</Text>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
  },
  sectionTitle: {
    color: "#aaa",
    fontSize: 24,
    marginBottom: 5,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e1e2d",
    borderRadius: 10,
    paddingHorizontal: 12,
    flex: 1,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    marginLeft: 8,
    fontSize: 20,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3b82f6",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  uploadText: {
    color: "#fff",
    marginLeft: 6,
    fontSize: 18,
    fontWeight: "600",
  },
  classHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 20,
  },
  dropdownContainer: {
    width: 160,
  },
  dropdown: {
    height: 50,
    backgroundColor: "#1e1e2d",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  placeholderStyle: {
    color: "#aaa",
    fontSize: 18,
  },
  selectedTextStyle: {
    color: "#fff",
    fontSize: 18,
  },
  gridContainer: {
    paddingBottom: 100,
  },
  row: {
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#1e1e2d",
    borderRadius: 12,
    width: "48%",
    padding: 15,
    marginBottom: 15,
  },
  imagePlaceholder: {
    height: 350,
    backgroundColor: "#2a2a3d",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  bookImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  bookName: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  subject: {
    color: "#aaa",
    textAlign: "center",
    fontSize: 18,
  },
  classText: {
    color: "#888",
    textAlign: "center",
    fontSize: 16,
    marginBottom: 8,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  actionBtn: {
    marginHorizontal: 8,
  },
  viewBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  viewText: {
    color: "#3b82f6",
    marginLeft: 4,
    fontSize: 20,
    fontWeight: "600",
  },
  cornerViewBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  cornerViewText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 3,
  },
  label: {
    color: "#aaa",
    fontSize: 20,
    marginBottom: 4,
    marginTop: 8,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingVertical: 10,
  },
  pageButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3b82f6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  pageText: {
    color: "#fff",
    fontSize: 20,
    marginHorizontal: 4,
  },
  disabledButton: {
    backgroundColor: "#555",
  },
  pageNumber: {
    color: "#fff",
    fontSize: 20,
  },
  pdfHeader: {
    padding: 15,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    elevation: 4,
  },
  pdfHeaderText: {
    fontSize: 24,
    fontWeight: "600",
  },
});
