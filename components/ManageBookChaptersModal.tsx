import {
  getInnerChapterDeleteApi,
  repositoryOverview,
} from '@/app/api/adminapi/adminDashboard';
import {
  adminChapteruploadapi,
  getChapterApi,
} from '@/app/api/adminapi/uploadadminbookapi';
import AddPartModal from '@/components/AddPartModal';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
interface Chapter {
  id: number;
  chapterNumber: number;
  parts: string[];
  thumbnail?: string;
  resourceType?: string;
}
interface ManageBookChaptersModalProps {
  isVisible: boolean;
  onClose: () => void;
  bookId: number;
}
export default function ManageBookChaptersModal({
  isVisible,
  onClose,
  bookId,
}: ManageBookChaptersModalProps) {
  const [chapterNumber, setChapterNumber] = useState('');
  const [resourceType, setResourceType] = useState<string | null>(null);
  const [file, setFile] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [thumbnailName, setThumbnailName] = useState<string | null>(null);
  const [categories, setCategories] = useState<
    { label: string; value: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [fetching, setFetching] = useState(false);
  const [partModalVisible, setPartModalVisible] = useState(false);
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(
    null
  );
  const [openChapterId, setOpenChapterId] = useState<number | null>(null);

  /* ------------------ FETCH REPOSITORY ------------------ */
  const fetchRepository = async () => {
    try {
      const response = await repositoryOverview();
      if (response?.success && Array.isArray(response.data)) {
        const mergedTypes = Array.from(
          new Set(
            response.data
              .flatMap((item: any) =>
                (item?.ResourceTypes || '').toString().split(',')
              )
              .map((x: string) => x.trim())
              .filter(Boolean)
          )
        );
        setCategories([
          { label: 'Select Resource Type', value: '' },
          ...mergedTypes.map((type) => ({ label: type, value: type })),
        ]);
      }
    } catch (error: any) {
      console.error('Repository fetch error:', error?.message ?? error);
    }
  };

  useEffect(() => {
    fetchRepository();
  }, []);

  /* ------------------ FETCH CHAPTERS ------------------ */
  useEffect(() => {
    if (isVisible && bookId) fetchChapters();
  }, [isVisible, bookId]);

  const fetchChapters = async () => {
    setFetching(true);
    try {
      const response = await getChapterApi(bookId);
      if (response?.success && Array.isArray(response.data)) {
        setChapters(response.data);
      } else {
        setChapters([]);
      }
    } catch (err) {
      setChapters([]);
    } finally {
      setFetching(false);
    }
  };

  /* ------------------ DELETE CHAPTER ------------------ */
  const handleDeleteBook = (bookId: number) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this book?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              const response = await getInnerChapterDeleteApi(bookId);

              if (response.success) {
                alert('Book deleted successfully!');
                fetchChapters();
              } else {
                alert('Failed to delete the book');
              }
            } catch (error) {
              console.error('Delete Error:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  /* ------------------ FIX IMAGE URL ------------------ */
  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('index.php/s/') && !url.endsWith('/download')) {
      return `${url}/download`;
    }
    return url;
  };

  /* ------------------ FILE PICKER LOGIC ------------------ */

  const pickResourceFile = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type:
          resourceType === 'PDF'
            ? 'application/pdf'
            : resourceType === 'AUDIO'
            ? 'audio/*'
            : '*/*',
        copyToCacheDirectory: true,
      });
      console.log('📂 File Picker Response:', res);
      if (res.canceled) return;

      const file = res.assets?.[0];
      if (!file) return;

      console.log('📄 Selected File:', {
        uri: file.uri,
        name: file.name,
        mimeType: file.mimeType,
        size: file.size,
      });
      setFile(file.uri);
      setFileName(file.name);
    } catch (e) {
      alert('File selection failed');
    }
  };

  // THUMBNAIL PICKER (DocumentPicker, JPG/PNG)
  const pickThumbnail = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ['image/*'],
        copyToCacheDirectory: true,
      });
      console.log('🖼 Thumbnail Picker Response:', res);
      if (res.canceled) return;

      const file = res.assets?.[0];
      if (!file) return;

      console.log('🖼 Selected Thumbnail:', {
        uri: file.uri,
        name: file.name,
        mime: file.mimeType,
        size: file.size,
      });

      setThumbnail(file.uri);
      setThumbnailName(file.name);
    } catch (e) {
      alert('Thumbnail selection failed');
    }
  };

  /* ------------------ UPLOAD CHAPTER ------------------ */
  const handleUploadChapter = async () => {
    if (!chapterNumber) return alert('Enter chapter number');
    if (!resourceType) return alert('Select resource type');

    const formData = new FormData();

    formData.append('chapterNumber', chapterNumber);
    formData.append('resourceType', resourceType);

    // For PDF and AUDIO → must upload file
    if (resourceType === 'PDF' || resourceType === 'AUDIO') {
      if (!file) return alert('Please select a file');

      const mime = resourceType === 'PDF' ? 'application/pdf' : 'audio/*';

      formData.append('file', {
        uri: file,
        name: fileName || 'upload',
        type: mime,
      } as any);
    }

    // For VIDEO or MUSIC → use resource link
    if (resourceType === 'VIDEO' || resourceType === 'MUSIC') {
      if (!file) return alert('Enter valid URL');
      formData.append('resourceLink', file);
    }

    // Thumbnail
    if (thumbnail) {
      formData.append('thumbnail', {
        uri: thumbnail,
        name: thumbnailName || 'thumbnail.jpg',
        type: 'image/jpeg',
      } as any);
    }

    console.log('🚀 Uploading Chapter with formData:', {
      chapterNumber,
      resourceType,
      file,
      fileName,
      thumbnail,
    });

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('token');
      const response = await adminChapteruploadapi(formData, token, bookId);
      console.log('response :>> ', response);

      if (!response.success) {
        alert('Upload failed');
        return;
      }

      alert('Upload success');
      fetchChapters();

      setChapterNumber('');
      setResourceType(null);
      setFile(null);
      setFileName(null);
      setThumbnail(null);
    } catch (e) {
      alert('Network upload failed');
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ UI ------------------ */
  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <View style={styles.headerRow}>
            <Text style={styles.headerText}>📚 Manage Book Chapters</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            <Text style={styles.label}>Chapter Number</Text>
            <TextInput
              placeholder="Enter Chapter Number"
              placeholderTextColor="#888"
              style={styles.input}
              value={chapterNumber}
              onChangeText={(text) =>
                setChapterNumber(text.replace(/[^0-9]/g, ''))
              }
              keyboardType="numeric"
            />
            <Text style={styles.label}>Resource Type</Text>
            <View style={styles.dropdownWrapper}>
              <Dropdown
                style={styles.dropdownInput}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={categories}
                labelField="label"
                valueField="value"
                placeholder="Select Type"
                value={resourceType}
                onChange={(item: any) => {
                  setResourceType(item?.value ?? null);
                  setFile(null);
                  setFileName(null);
                }}
                renderRightIcon={() => (
                  <Ionicons name="chevron-down" size={22} color="#aaa" />
                )}
              />
            </View>
            {resourceType &&
              (resourceType === 'PDF' || resourceType === 'AUDIO' ? (
                <>
                  <Text style={styles.label}>Upload {resourceType} File</Text>
                  <TouchableOpacity
                    style={styles.uploadBtn}
                    onPress={pickResourceFile}
                  >
                    <Text style={{ color: '#fff' }}>
                      {file ? fileName ?? 'File Selected' : 'Choose File'}
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.label}>Enter Resource Link</Text>
                  <TextInput
                    placeholder="Paste URL starting with http/https"
                    placeholderTextColor="#888"
                    style={styles.input}
                    value={file ?? ''}
                    onChangeText={(txt) => setFile(txt)}
                    autoCapitalize="none"
                  />
                </>
              ))}

            <Text style={styles.label}>Thumbnail (optional)</Text>
            <TouchableOpacity style={styles.uploadBtn} onPress={pickThumbnail}>
              <Text style={{ color: '#fff' }}>
                {thumbnail ? thumbnailName ?? 'Selected' : 'Choose Thumbnail'}
              </Text>
            </TouchableOpacity>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#ef4444' }]}
                onPress={onClose}
              >
                <Ionicons name="close" color="#fff" size={22} />
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalBtn,
                  { backgroundColor: loading ? '#94d3a2' : '#22c55e' },
                ]}
                disabled={loading}
                onPress={handleUploadChapter}
              >
                {loading ? (
                  <ActivityIndicator
                    size="small"
                    color="#fff"
                    style={{ marginRight: 8 }}
                  />
                ) : (
                  <Ionicons name="checkmark" color="#fff" size={22} />
                )}
                <Text style={styles.modalBtnText}>
                  {loading ? 'Uploading...' : 'Upload'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 12 }}>
              {fetching ? (
                <Text style={{ color: '#fff' }}>Loading chapters...</Text>
              ) : chapters.length === 0 ? (
                <Text style={{ color: '#bbb' }}>No chapters found.</Text>
              ) : (
                chapters.map((chapter) => (
                  <View key={chapter.id} style={styles.chapterCard}>
                    <Image
                      source={{
                        uri: getImageUrl(
                          chapter.thumbnail ||
                            'https://cdn-icons-png.flaticon.com/512/2232/2232688.png'
                        ),
                      }}
                      style={styles.chapterImg}
                    />
                    <View style={{ flex: 1 }}>
                      <TouchableOpacity
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                        onPress={() =>
                          setOpenChapterId(
                            openChapterId === chapter.id ? null : chapter.id
                          )
                        }
                      >
                        <Text style={styles.chapterTitle}>
                          Chapter {chapter.chapterNumber}
                        </Text>
                        <Ionicons
                          name={
                            openChapterId === chapter.id
                              ? 'chevron-up'
                              : 'chevron-down'
                          }
                          size={24}
                          color="#ccc"
                          style={{ marginLeft: 6 }}
                        />
                      </TouchableOpacity>
                      {openChapterId === chapter.id && (
                        <View style={styles.dropdownContainer}>
                          <Text style={styles.dropItem}>
                            Resource Type: {chapter.resourceType}
                          </Text>
                          <Text style={styles.dropItem}>
                            Overview: No overview available
                          </Text>
                          <TouchableOpacity
                            style={styles.deleteBtn}
                            onPress={() => handleDeleteBook(chapter.id)}
                          >
                            <Text
                              style={{
                                color: '#fff',
                                fontWeight: '600',
                                fontSize: 18,
                              }}
                            >
                              Delete
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                    <TouchableOpacity
                      style={styles.addPartBtn}
                      onPress={() => {
                        setSelectedChapterId(chapter.id);
                        setPartModalVisible(true);
                      }}
                    >
                      <Text style={styles.addPartText}>+ Add Part</Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>
            <AddPartModal
              isVisible={partModalVisible}
              onClose={() => setPartModalVisible(false)}
              onUpload={() => {
                // Add your upload logic here
                // console.log('Upload triggered');
              }}
              resourceTypes={categories}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

/* -------------------------------------------------------------- */
/* STYLES */
/* -------------------------------------------------------------- */
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#1e1e2d',
    borderRadius: 16,
    width: '90%',
    maxHeight: '90%',
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  label: {
    color: '#fff',
    marginBottom: 6,
    marginTop: 5,
  },
  input: {
    backgroundColor: '#2a2a3d',
    borderRadius: 8,
    color: '#fff',
    padding: 10,
    marginBottom: 10,
  },
  dropdownWrapper: {
    backgroundColor: '#2a2a3d',
    borderRadius: 8,
    marginBottom: 10,
  },
  dropdownInput: {
    width: '100%',
    height: 50,
    paddingHorizontal: 10,
  },
  placeholderStyle: {
    color: '#888',
  },
  selectedTextStyle: {
    color: '#fff',
  },
  uploadBtn: {
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
  },
  modalBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    marginLeft: 5,
  },
  chapterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a3d',
    borderRadius: 10,
    padding: 6,
    marginTop: 14,
    textAlign: 'center',
  },
  chapterImg: {
    width: 50,
    height: 50,
    borderRadius: 6,
    marginRight: 10,
  },
  chapterTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  partText: {
    color: '#aaa',
    marginLeft: 8,
  },
  addPartBtn: {
    backgroundColor: '#22c55e',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  addPartText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
  },
  dropdownContainer: {
    width: 300,
    backgroundColor: '#1f1f2e',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  dropItem: {
    color: '#ccc',
    marginBottom: 6,
    fontSize: 18,
  },
  deleteBtn: {
    backgroundColor: '#ef4444',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
});
