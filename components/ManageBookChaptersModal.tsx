import { repositoryOverview } from '@/app/api/adminapi/adminDashboard';
import { getChapterApi } from '@/app/api/adminapi/uploadadminbookapi';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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
  bookId: number;
}

export default function ManageBookChaptersModal({
  isVisible,
  onClose,
  bookId,
}: ManageBookChaptersModalProps) {
  const [chapterNumber, setChapterNumber] = useState('');
  const [resourceType, setResourceType] = useState<string | null>(null);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [thumbnailName, setThumbnailName] = useState<string | null>(null);
  const [categories, setCategories] = useState<
    { label: string; value: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [fetching, setFetching] = useState(false);

  /* ------------------ repository types ------------------ */
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

  /* ------------------ fetch chapters ------------------ */
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

  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('index.php/s/') && !url.endsWith('/download')) {
      return `${url}/download`;
    }
    return url;
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
                  setFilePath(null);
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
                  <TouchableOpacity style={styles.uploadBtn}>
                    <Text style={{ color: '#fff' }}>
                      {filePath ? fileName ?? 'File Selected' : 'Choose File'}
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
                    value={filePath ?? ''}
                    onChangeText={(txt) => setFilePath(txt)}
                    autoCapitalize="none"
                  />
                </>
              ))}

            <Text style={styles.label}>Thumbnail (optional)</Text>
            <TouchableOpacity style={styles.uploadBtn}>
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
                      <Text style={styles.chapterTitle}>
                        Chapter {chapter.chapterNumber}
                      </Text>
                      {chapter.parts?.map((p, i) => (
                        <Text key={i} style={styles.partText}>
                          • {p}
                        </Text>
                      ))}
                    </View>

                    <TouchableOpacity style={styles.addPartBtn}>
                      <Text style={styles.addPartText}>+ Add Part</Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>
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
    alignItems: 'flex-start',
    backgroundColor: '#2a2a3d',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    marginTop: 14,
  },
  chapterImg: {
    width: 50,
    height: 50,
    borderRadius: 6,
    marginRight: 10,
  },
  chapterTitle: {
    color: '#fff',
    fontSize: 16,
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
  },
});
