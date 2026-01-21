import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type Props = {
  visible: boolean;
  editText: string;
  setEditText: (text: string) => void;
  onClose: () => void;
  onUpdate: () => void;
};

const Announcementmodel = ({
  visible,
  editText,
  setEditText,
  onClose,
  onUpdate,
}: Props) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <Text style={styles.modalTitle}>Edit Announcement</Text>

          <TextInput
            style={styles.modalInput}
            multiline
            value={editText}
            onChangeText={setEditText}
          />

          <View style={styles.modalButtonRow}>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={onClose}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalUpdateButton}
              onPress={onUpdate}
            >
              <Text style={styles.modalUpdateText}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default Announcementmodel;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalBox: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    height: 100,
    marginBottom: 10,
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#000',
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  modalCancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#000',
  },
  modalCancelText: {
    fontSize: 16,
    color: '#000',
  },
  modalUpdateButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  modalUpdateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
