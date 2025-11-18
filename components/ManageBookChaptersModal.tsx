import { repositoryOverview } from '@/app/api/adminapi/adminDashboard';
import { getChapterApi } from '@/app/api/adminapi/uploadadminbookapi';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
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
}

interface ManageBookChaptersModalProps {
  isVisible: boolean;
  onClose: () => void;
  bookId: string | number;
}

export default function ManageBookChaptersModal({
  isVisible,
  onClose,
  bookId,
}: ManageBookChaptersModalProps) {
  const [chapterNumber, setChapterNumber] = useState('');
  const [resourceType, setResourceType] = useState<string | null>(null);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [categories, setCategories] = useState<
    { label: string; value: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [fetching, setFetching] = useState(false);

  // Fetch Dropdown Data
  const fetchRepository = async () => {
    try {
      const response = await repositoryOverview();
      if (response.success && Array.isArray(response.data)) {
        const mergedTypes = Array.from(
          new Set(
            response.data
              .flatMap((item: any) => item.ResourceTypes.split(','))
              .map((x: string) => x.trim())
          )
        );

        setCategories([
          { label: 'Select Resource Type', value: '' },
          ...mergedTypes.map((type) => ({ label: type, value: type })),
        ]);
      }
    } catch (error: any) {
      console.error('Repository fetch error:', error.message);
    }
  };

  useEffect(() => {
    fetchRepository();
  }, []);

  useEffect(() => {
    if (isVisible && bookId) fetchChapters();
  }, [isVisible, bookId]);

  const fetchChapters = async () => {
    setFetching(true);

    const response = await getChapterApi(bookId);

    if (response.success && Array.isArray(response.data)) {
      setChapters(response.data);
    } else {
      console.error('Error fetching chapters:', response.message);
    }
    setFetching(false);
  };

  const getImageUrl = (url: string) => {
    if (url.includes('index.php/s/') && !url.endsWith('/download')) {
      return `${url}/download`;
    }
    return url;
  };

  // File Upload Handler
  const handleFileUpload = () => {
    alert(`Upload ${resourceType} file here`);
    setFilePath('dummy/path/selected.file');
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={styles.headerText}>📚 Manage Book Chapters</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Chapter Number */}
            <Text style={styles.label}>Enter Chapter Number</Text>
            <TextInput
              placeholder="Enter Chapter Number"
              placeholderTextColor="#888"
              style={styles.input}
              value={chapterNumber}
              onChangeText={setChapterNumber}
            />

            {/* Resource Type Dropdown */}
            <Text style={styles.label}>Select Resource Type</Text>
            <View style={styles.dropdownWrapper}>
              <Dropdown
                style={styles.dropdownInput}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={categories}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Select Type"
                value={resourceType}
                onChange={(item: any) => setResourceType(item.value)}
                renderRightIcon={() => (
                  <Ionicons name="chevron-down" size={22} color="#aaa" />
                )}
              />
            </View>

            {/* Conditional File or Link UI */}
            {resourceType && resourceType !== '' && (
              <View>
                {resourceType === 'PDF' || resourceType === 'AUDIO' ? (
                  <>
                    <Text style={styles.label}>Upload {resourceType} File</Text>
                    <TouchableOpacity
                      style={styles.uploadBtn}
                      onPress={handleFileUpload}
                    >
                      <Text style={{ color: '#fff' }}>Choose File</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Text style={styles.label}>Enter Resource Link</Text>
                    <TextInput
                      placeholder="Paste URL Link Here"
                      placeholderTextColor="#888"
                      style={styles.input}
                      value={filePath ?? ''}
                      onChangeText={setFilePath}
                    />
                  </>
                )}
              </View>
            )}

            {/* Thumbnail Upload */}
            <Text style={styles.label}>Thumbnail Image</Text>
            <TouchableOpacity style={styles.uploadBtn}>
              <Text style={{ color: '#fff' }}>Choose Thumbnail</Text>
            </TouchableOpacity>

            {thumbnail && (
              <Image source={{ uri: thumbnail }} style={styles.previewImg} />
            )}

            {/* Action Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#ef4444' }]}
                onPress={onClose}
              >
                <Ionicons name="close" size={22} color="#fff" />
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#22c55e' }]}
                disabled={loading}
              >
                <Ionicons name="checkmark" size={22} color="#fff" />
                <Text style={styles.modalBtnText}>
                  {loading ? 'Uploading...' : 'Upload'}
                </Text>
              </TouchableOpacity>
            </View>

            {fetching ? (
              <Text style={{ color: '#fff', marginTop: 8 }}>
                Loading chapters...
              </Text>
            ) : chapters.length === 0 ? (
              <Text style={{ color: '#bbb', marginTop: 10 }}>
                No chapters found.
              </Text>
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
                    <Text style={styles.chapterTitle}>
                      Chapter {chapter.chapterNumber}
                    </Text>
                    {chapter.parts?.map((part, index) => (
                      <Text key={index} style={styles.partText}>
                        • {part}
                      </Text>
                    ))}
                  </View>

                  <TouchableOpacity style={styles.addPartBtn}>
                    <Text style={styles.addPartText}>+ Add Part</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
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
    alignItems: 'center',
    marginBottom: 12,
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
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  previewImg: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#555',
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
    paddingVertical: 10,
    flex: 1,
    marginHorizontal: 4,
  },
  modalBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 4,
  },
  chapterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a3d',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  chapterImg: { width: 50, height: 50, borderRadius: 6, marginRight: 10 },
  chapterTitle: { color: '#fff', fontSize: 16, fontWeight: '600' },
  partText: { color: '#aaa', marginLeft: 10 },
  addPartBtn: {
    backgroundColor: '#22c55e',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  addPartText: { color: '#fff', fontWeight: '600' },
});
