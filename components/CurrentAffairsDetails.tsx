import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export const CurrentAffairsDetails = ({ data, onBack }: any) => {
  if (!data) return null;

  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('/s/')) {
      return `${url}/download`;
    }
    return url;
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <Image
          source={{
            uri: getImageUrl(data?.imageUrl),
          }}
          style={styles.image}
        />

        {/* Date + Category */}
        <View style={styles.topRow}>
          <View style={styles.row}>
            <Ionicons name="calendar-outline" size={16} color="#7FA4FF" />
            <Text style={styles.date}>{data?.date}</Text>
          </View>

          <View style={styles.tag}>
            <Text style={styles.tagText}>Daily Current Affairs</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>{data?.title}</Text>

        {/* Description */}
        <Text style={styles.desc}>{data?.description}</Text>
      </ScrollView>

      {/* Back Button */}
      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <Text style={styles.backBtnText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1123',
    paddingHorizontal: 15,
    paddingTop: 18,
  },
  image: {
    height: 260,
    width: '100%',
    borderRadius: 10,
    marginBottom: 14,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 32,
    marginVertical: 5,
  },
  date: {
    color: '#7FA4FF',
    fontSize: 14,
    marginLeft: 5,
  },
  desc: {
    color: '#B4B7C8',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 10,
    marginBottom: 20,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tag: {
    backgroundColor: '#1B2343',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  tagText: {
    color: '#7FA4FF',
    fontSize: 12,
    fontWeight: '500',
  },
  backBtn: {
    backgroundColor: '#1E3A5F',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  backBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
