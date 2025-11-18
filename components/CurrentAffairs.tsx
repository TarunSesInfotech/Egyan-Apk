import { studentCurrentAffairsApi } from '@/app/api/studentapi/progressActiivityApi';
import { CurrentAffairsDetails } from '@/components/CurrentAffairsDetails';
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export const CurrentAffairs = ({ onBack }: any) => {
  const [currentaffairs, setCurrentAffairs] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const [search, setSearch] = useState('');

  const fetchCurrentAffairs = async () => {
    try {
      const response = await studentCurrentAffairsApi();
      if (response.success) setCurrentAffairs(response.data);
      else console.log('Error fetching API :', response.message);
    } catch (error: any) {
      console.log('Error fetching API :', error?.message);
    }
  };

  useEffect(() => {
    fetchCurrentAffairs();
  }, []);

  const filteredData = currentaffairs.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('/s/')) {
      return `${url}/download`;
    }
    return url;
  };

  if (selectedItem) {
    return (
      <CurrentAffairsDetails
        data={selectedItem}
        onBack={() => setSelectedItem(null)}
      />
    );
  }

  const renderCard = ({ item }: any) => (
    <View style={styles.card}>
      <Image
        source={{ uri: getImageUrl(item?.imageUrl) }}
        style={styles.cardImage}
      />
      <View style={styles.cardContent}>
        <Text style={styles.categoryTag}>Daily Current Affairs</Text>
        <Text style={styles.cardTitle}>{item?.title}</Text>
        <Text numberOfLines={2} style={styles.cardDesc}>
          {item?.description}
        </Text>

        <TouchableOpacity
          style={styles.readMoreBtn}
          onPress={() => setSelectedItem(item)}
        >
          <Text style={{ color: '#7FA4FF', fontSize: 20, fontWeight: '600' }}>
            Keep Reading →
          </Text>
        </TouchableOpacity>

        <View style={styles.dateView}>
          <MaterialCommunityIcons name="calendar" size={24} color="#7FA4FF" />
          <Text style={styles.dateText}>{item?.date}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={35} color="#fff" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <FontAwesome5 name="newspaper" size={34} color="#43FF9B" />
        <Text style={styles.headerText}>Daily Current Affairs</Text>
      </View>

      <TextInput
        placeholder="Search current affairs..."
        placeholderTextColor="#B4B7C8"
        style={styles.searchInput}
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.filters}>
        <TouchableOpacity style={styles.filterBtn}>
          <Text style={styles.filterText}>Topics</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterBtn}>
          <Text style={styles.filterText}>Month</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderCard}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1123',
    padding: 15,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  headerText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginLeft: 8,
  },
  searchInput: {
    backgroundColor: '#1B1D32',
    color: '#fff',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  filters: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  filterBtn: {
    backgroundColor: '#183153',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginRight: 10,
  },
  filterText: {
    color: '#00C6FF',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#1B1D32',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 16,
  },
  cardImage: {
    height: 400,
    width: '100%',
  },
  cardContent: {
    padding: 12,
  },
  categoryTag: {
    backgroundColor: '#24446B',
    padding: 10,
    borderRadius: 20,
    fontSize: 16,
    color: '#79D2FF',
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  cardDesc: {
    color: '#B4B7C8',
    fontSize: 18,
    marginTop: 4,
  },
  readMoreBtn: {
    marginTop: 5,
  },
  dateView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  dateText: {
    color: '#7FA4FF',
    fontSize: 18,
    marginLeft: 6,
  },
});
