import { Ionicons } from '@expo/vector-icons';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Modal from 'react-native-modal';

export default function UpdateRoleModal({
  isVisible,
  onClose,
  selectedUser,
  newRole,
  setNewRole,
  setSelectedUser,
  roleOptions,
  onUpdate,
}: any) {
  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Update Role</Text>

        {selectedUser && (
          <>
            <Text style={styles.modalLabel}>Name</Text>
            <TextInput
              style={[
                styles.modalInput,
                { backgroundColor: '#3a3a46', color: '#ccc' },
              ]}
              value={selectedUser.name}
              editable={false}
            />
            <Text style={styles.modalLabel}>Select Role</Text>
            <Dropdown
              style={styles.modalDropdown}
              data={roleOptions.filter((r: any) => r.value !== 'all')}
              labelField="label"
              valueField="value"
              value={newRole}
              onChange={(item) => setNewRole(item.value)}
              placeholder="Select Role"
              placeholderStyle={{ color: '#999' }}
              selectedTextStyle={{ color: '#fff' }}
              itemTextStyle={{ color: '#000' }}
              containerStyle={styles.dropdownContainer}
            />
            <Text style={styles.modalLabel}>Status</Text>
            <Dropdown
              style={styles.modalDropdown}
              data={[
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
              ]}
              labelField="label"
              valueField="value"
              value={selectedUser.status.toLowerCase()}
              onChange={(item) =>
                setSelectedUser({ ...selectedUser, status: item.label })
              }
              placeholder="Select Status"
              placeholderStyle={{ color: '#999' }}
              selectedTextStyle={{ color: '#fff' }}
              itemTextStyle={{ color: '#000' }}
              containerStyle={styles.dropdownContainer}
            />
            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={onClose}
              >
                <Ionicons name="close-circle-outline" size={24} color="#fff" />
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={onUpdate}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={24}
                  color="#fff"
                />
                <Text style={styles.modalButtonText}>Update</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: '#2b2b36',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalLabel: {
    color: '#ddd',
    fontSize: 16,
    marginBottom: 6,
  },
  modalInput: {
    backgroundColor: '#1a1a24',
    borderRadius: 6,
    height: 45,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  modalDropdown: {
    backgroundColor: '#1a1a24',
    borderRadius: 6,
    height: 50,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  saveButton: {
    backgroundColor: '#007bff',
  },
  cancelButton: {
    backgroundColor: '#ff4d4d',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderRadius: 6,
  },
});
