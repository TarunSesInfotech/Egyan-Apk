/* eslint-disable react-hooks/exhaustive-deps */
import { StudentBookApi } from '@/app/api/studentapi/studyMaterialApi';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';

const BookDetailScreen = ({data, onBack }: any) => {
  const [chapters, setChapters] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('');

  const fetchStudyMaterial = async () => {
    try {
      const response = await StudentBookApi(data.id);
      if (response.success) {
        setChapters(response.data);
        if (response.data.length > 0) {
          setActiveTab(response.data[0].resourceType);
          setSelectedFile(response.data[0].fileUrl);
        }
      } else {
        console.error('Error fetching chapters:', response.message);
      }
    } catch (error: any) {
      console.error('Error fetching chapters:', error.message);
    }
  };

  useEffect(() => {
    if (data?.id) fetchStudyMaterial();
  }, [data]);

  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('cloud.ptgn.in')) {
      return `${url}/download`;
    }
    return url;
  };

  const tabs = Array.from(new Set(chapters.map((item) => item.resourceType)));

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={40} color="#fff" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.bookPreview}>
          {selectedFile ? (
            <WebView
              source={{ uri: `${selectedFile}` }}
              style={{ flex: 1 }}
              originWhitelist={['*']}
            />
          ) : (
            <Text>Loading PDF...</Text>
          )}
        </View>
        <View style={styles.sidebar}>
          <View style={styles.tabContainer}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tabButton,
                  activeTab === tab && styles.activeTabButton,
                ]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <FlatList
            data={chapters.filter((item) => item.resourceType === activeTab)}
            keyExtractor={(item, index) =>
              item.id?.toString() || index.toString()
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.chapterItem}
                onPress={() => setSelectedFile(item.fileUrl)}
              >
                <Text style={styles.chapterText1}>{item.chapterNumber}.</Text>
                <Image
                  source={{ uri: getImageUrl(item.thumbnail) }}
                  style={styles.thumbnail}
                />
                <Text style={styles.chapterText2}>
                  Chapter {item.chapterNumber}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </View>
  );
};

export default BookDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  topBar: {
    height: 50,
    backgroundColor: 'black',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 28,
    color: '#fff',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  bookPreview: {
    flex: 1,
    padding: 12,
  },
  sidebar: {
    width: '35%',
    backgroundColor: '#fff',
    borderLeftWidth: 1,
    borderColor: '#ddd',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 8,
  },
  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  activeTabButton: {
    backgroundColor: '#007bff',
  },
  tabText: {
    fontSize: 16,
    color: '#333',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  chapterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  thumbnail: {
    width: 100,
    height: 120,
    borderRadius: 4,
    marginRight: 8,
  },
  chapterText1: {
    fontSize: 22,
    color: '#333',
  },
  chapterText2: {
    fontSize: 24,
    color: '#333',
  },
});
