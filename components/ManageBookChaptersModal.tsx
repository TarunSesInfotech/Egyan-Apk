import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface Chapter {
  id: number;
  title: string;
  parts: string[];
}

interface ManageBookChaptersModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function ManageBookChaptersModal({
  isVisible,
  onClose,
}: ManageBookChaptersModalProps) {
  const [chapterNumber, setChapterNumber] = useState('');
  const [resourceType, setResourceType] = useState('');
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([
    { id: 1, title: 'Chapter 1', parts: [] },
    { id: 2, title: 'Chapter 2', parts: [] },
    { id: 3, title: 'Chapter 3', parts: [] },
  ]);

  const addPart = (chapterId: number) => {
    setChapters((prev) =>
      prev.map((ch) =>
        ch.id === chapterId
          ? { ...ch, parts: [...ch.parts, `Part ${ch.parts.length + 1}`] }
          : ch
      )
    );
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.8)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            backgroundColor: '#1e1e2d',
            borderRadius: 16,
            width: '90%',
            maxHeight: '90%',
            padding: 16,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>
              📚 Manage Book Chapters
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView>
            {/* Input fields */}
            <TextInput
              placeholder="Enter Chapter Number"
              placeholderTextColor="#888"
              style={{
                backgroundColor: '#2a2a3d',
                borderRadius: 8,
                color: '#fff',
                padding: 10,
                marginBottom: 10,
              }}
              value={chapterNumber}
              onChangeText={setChapterNumber}
            />

            <TextInput
              placeholder="Select Resource Type"
              placeholderTextColor="#888"
              style={{
                backgroundColor: '#2a2a3d',
                borderRadius: 8,
                color: '#fff',
                padding: 10,
                marginBottom: 10,
              }}
              value={resourceType}
              onChangeText={setResourceType}
            />

            <TouchableOpacity
              style={{
                backgroundColor: '#3b82f6',
                padding: 10,
                borderRadius: 8,
                marginBottom: 10,
                alignItems: 'center',
              }}
              onPress={() => alert('Upload Thumbnail Coming Soon')}
            >
              <Text style={{ color: '#fff' }}>Upload Thumbnail</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: '#ef4444',
                padding: 10,
                borderRadius: 8,
                marginBottom: 10,
                alignItems: 'center',
              }}
              onPress={() => {
                setChapterNumber('');
                setResourceType('');
              }}
            >
              <Text style={{ color: '#fff' }}>Clear</Text>
            </TouchableOpacity>

            {/* Chapters List */}
            {chapters.map((chapter) => (
              <View
                key={chapter.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#2a2a3d',
                  borderRadius: 10,
                  padding: 10,
                  marginBottom: 8,
                }}
              >
                <Image
                  source={{
                    uri:
                      thumbnail ||
                      'https://cdn-icons-png.flaticon.com/512/2232/2232688.png',
                  }}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 6,
                    marginRight: 10,
                  }}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}
                  >
                    {chapter.title}
                  </Text>
                  {chapter.parts.map((part, index) => (
                    <Text key={index} style={{ color: '#aaa', marginLeft: 10 }}>
                      • {part}
                    </Text>
                  ))}
                </View>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#22c55e',
                    paddingVertical: 6,
                    paddingHorizontal: 10,
                    borderRadius: 8,
                  }}
                  onPress={() => addPart(chapter.id)}
                >
                  <Text style={{ color: '#fff', fontWeight: '600' }}>
                    + Add Part
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
