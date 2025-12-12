import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function UploadModalCredentails({
  visible,
  onClose,
  file,
  onFilePick,
  onUpload,
}: any) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalBackdrop}>
        <View style={styles.uploadModalBox}>
          <Text style={styles.uploadTitle}>Upload Your Files</Text>
          <TouchableOpacity style={styles.fileSelectBtn} onPress={onFilePick}>
            <Text style={styles.fileSelectText}>Select File</Text>
          </TouchableOpacity>
          {file && <Text style={styles.fileName}>📄 {file.name}</Text>}
          <View style={styles.uploadActions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.uploadBtn} onPress={onUpload}>
              <Text style={styles.uploadText}>Upload</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  uploadModalBox: {
    backgroundColor: '#1e1e2d',
    padding: 20,
    borderRadius: 15,
  },
  uploadTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  fileSelectBtn: {
    backgroundColor: '#42a5f5',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  fileSelectText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  fileName: {
    color: '#ccc',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  uploadActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 25,
  },
  cancelBtn: {
    backgroundColor: '#555',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelText: {
    color: '#fff',
    fontSize: 16,
  },
  uploadBtn: {
    backgroundColor: '#66bb6a',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  uploadText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
