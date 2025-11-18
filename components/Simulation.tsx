import { studentSimulationsApi } from '@/app/api/studentapi/progressActiivityApi';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';

export const Simulation = ({ onBack }: any) => {
  const [simulationsData, setSimulationsData] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const fetchSimulations = async () => {
    try {
      const response = await studentSimulationsApi();

      if (response.success) {
        setSimulationsData(response.data);
      } else {
        console.error(
          'Error fetching student Simulations Api :',
          response.message
        );
      }
    } catch (error: any) {
      console.error('Error fetching student Simulations Api:', error.message);
    }
  };

  useEffect(() => {
    fetchSimulations();
  }, []);

  const chunkArray = (arr: any[]) => {
    const grouped: any[] = [];
    for (let i = 0; i < arr.length; i += 2) {
      grouped.push(arr.slice(i, i + 2));
    }
    return grouped;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={40} color="#fff" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <FontAwesome5 name="tools" size={40} color="#43FF9B" />
        <Text style={styles.headerText}>Simulation</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {chunkArray(simulationsData).map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((item: any) => (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                onPress={() => setSelectedItem(item)}
              >
                <Image source={{ uri: item.image }} style={styles.cardImage} />
                <Text style={styles.cardText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
      <Modal visible={!!selectedItem} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setSelectedItem(null)}
            >
              <Text style={styles.closeText}>✖</Text>
            </TouchableOpacity>

            {selectedItem?.link ? (
              <WebView
                source={{ uri: selectedItem.link }}
                style={{ flex: 1 }}
              />
            ) : (
              <Text style={{ color: '#fff', textAlign: 'center' }}>
                No Simulation Available
              </Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1123',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backText: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  card: {
    flex: 1,
    backgroundColor: '#1c1f35',
    borderRadius: 12,
    paddingVertical: 5,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#aaa',
    height: 280,
  },
  cardImage: {
    width: '100%',
    height: 200,
  },
  cardText: {
    fontSize: 18,
    marginTop: 10,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 6,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  modalContent: {
    backgroundColor: '#000',
    height: '80%',
    borderRadius: 14,
    overflow: 'hidden',
  },
  modalCloseBtn: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 10,
    backgroundColor: '#ff4444',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  closeText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
