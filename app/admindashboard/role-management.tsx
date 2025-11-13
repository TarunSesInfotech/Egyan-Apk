import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Modal from 'react-native-modal';
import { userRoleOverview } from '../api/adminapi/adminDashboard';

export default function RoleManagement() {
  const [userroleData, setUserRoleData] = useState<any[]>([]);
  const [roleFilter, setRoleFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newRole, setNewRole] = useState('');
  const itemsPerPage = 16;

  // Fetch all roles
  const fetchUserRole = async () => {
    try {
      const response = await userRoleOverview();
      if (response.success && Array.isArray(response.data)) {
        setUserRoleData(response.data);
      } else if (Array.isArray(response)) {
        setUserRoleData(response);
      } else {
        console.error('Unexpected API format:', response);
      }
    } catch (error: any) {
      console.error('Error fetching UserRole data:', error.message);
    }
  };

  useEffect(() => {
    fetchUserRole();
  }, []);

  // Format users for the table
  const formattedUsers = userroleData.map((u) => ({
    id: u.id,
    name: u.username,
    email: u.email,
    role: u.role ? u.role.charAt(0).toUpperCase() + u.role.slice(1) : 'N/A',
    status: u.isActive ? 'Active' : 'Inactive',
  }));

  // Filtering and pagination
  const filteredUsers = formattedUsers.filter(
    (u) =>
      (roleFilter === 'all' ||
        u.role.toLowerCase() === roleFilter.toLowerCase()) &&
      (u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredUsers.length);
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const toggleModal = (user?: any) => {
    if (user) {
      setSelectedUser(user);
      setNewRole(user.role.toLowerCase());
    }
    setModalVisible(!isModalVisible);
  };

  const roleOptions = [
    { label: 'All Roles', value: 'all' },
    { label: 'Admin', value: 'admin' },
    { label: 'Student', value: 'student' },
    { label: 'Teacher', value: 'teacher' },
    { label: 'Principal', value: 'principal' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.mainContent}>
        <Text style={styles.welcomeText}>Hi, Welcome Mr. Admin</Text>
        <Text style={styles.sectionTitle}>Manage Role</Text>

        {/* Search and Filter Row */}
        <View style={styles.searchFilterRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or email"
            placeholderTextColor="#999"
            value={search}
            onChangeText={(text) => {
              setSearch(text);
              setCurrentPage(1);
            }}
          />
          <Dropdown
            style={styles.dropdown}
            data={roleOptions}
            labelField="label"
            valueField="value"
            placeholder="Select Role"
            placeholderStyle={{ color: '#999', fontSize: 20 }}
            selectedTextStyle={{ color: '#fff', fontSize: 20 }}
            itemTextStyle={{ color: '#000' }}
            value={roleFilter}
            onChange={(item) => {
              setRoleFilter(item.value);
              setCurrentPage(1);
            }}
            containerStyle={styles.dropdownContainer}
          />
        </View>

        {/* Table Section */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ minWidth: 800 }}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.colName]}>Name</Text>
              <Text style={[styles.tableHeaderText, styles.colEmail]}>
                Email
              </Text>
              <Text style={[styles.tableHeaderText, styles.colRole]}>Role</Text>
              <Text style={[styles.tableHeaderText, styles.colStatus]}>
                Status
              </Text>
              <Text style={[styles.tableHeaderText, styles.colActions]}>
                Actions
              </Text>
            </View>

            {currentUsers.map((user) => (
              <View key={user.id} style={styles.tableRow}>
                <Text
                  style={[styles.tableCell, styles.colName]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {user.name}
                </Text>
                <Text
                  style={[styles.tableCell, styles.colEmail]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {user.email}
                </Text>
                <Text style={[styles.tableCell, styles.colRole]}>
                  {user.role}
                </Text>
                <View style={[styles.statusContainer, styles.colStatus]}>
                  <Text
                    style={[
                      styles.activeStatus,
                      {
                        backgroundColor:
                          user.status === 'Active' ? '#00c853' : '#ff4d4d',
                      },
                    ]}
                  >
                    {user.status}
                  </Text>
                </View>
                <View style={[styles.actionsContainer, styles.colActions]}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => toggleModal(user)}
                  >
                    <Ionicons name="create-outline" size={20} color="#4da3ff" />
                    <Text style={styles.changeRoleText}>Change</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="trash-outline" size={20} color="#ff4d4d" />
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Pagination */}
        {filteredUsers.length > itemsPerPage && (
          <View style={styles.paginationRow}>
            <Text style={styles.paginationInfo}>
              Showing {endIndex} of {filteredUsers.length} users
            </Text>

            <View style={styles.paginationContainer}>
              <TouchableOpacity
                onPress={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={[
                  styles.pageButton,
                  currentPage === 1 && styles.disabledButton,
                ]}
              >
                <Text style={styles.pageButtonText}>Prev</Text>
              </TouchableOpacity>

              {[...Array(totalPages)].map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handlePageChange(index + 1)}
                  style={[
                    styles.pageNumber,
                    currentPage === index + 1 && styles.activePage,
                  ]}
                >
                  <Text style={styles.pageNumberText}>{index + 1}</Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                onPress={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={[
                  styles.pageButton,
                  currentPage === totalPages && styles.disabledButton,
                ]}
              >
                <Text style={styles.pageButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* MODAL for updating user role */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Update Role</Text>

          {selectedUser && (
            <>
              {/* Name Field */}
              <Text style={styles.modalLabel}>Name</Text>
              <TextInput
                style={[
                  styles.modalInput,
                  { backgroundColor: '#3a3a46', color: '#ccc' },
                ]}
                value={selectedUser.name}
                editable={false}
              />

              {/* Select Role */}
              <Text style={styles.modalLabel}>Select Role</Text>
              <Dropdown
                style={styles.modalDropdown}
                data={roleOptions.filter((r) => r.value !== 'all')}
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

              {/* Status */}
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

              {/* Buttons */}
              <View style={styles.modalButtonRow}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Ionicons
                    name="close-circle-outline"
                    size={24}
                    color="#fff"
                  />
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={() => {
                    console.log(
                      `Updated ${selectedUser.name}: role=${newRole}, status=${selectedUser.status}`
                    );
                    setModalVisible(false);
                  }}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a24',
  },
  mainContent: {
    flex: 1,
    padding: 20,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: '#aaa',
    fontSize: 24,
    marginTop: 20,
    marginBottom: 15,
  },
  searchFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#2b2b36',
    color: '#fff',
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 50,
    marginRight: 10,
    fontSize: 20,
  },
  dropdown: {
    backgroundColor: '#2b2b36',
    borderRadius: 6,
    height: 50,
    width: 150,
    paddingHorizontal: 8,
  },
  dropdownContainer: {
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e2e5ea',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  tableHeaderText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 18,
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#2b2b36',
    marginTop: 5,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  tableCell: {
    color: '#fff',
    fontSize: 16,
  },
  statusContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  activeStatus: {
    color: '#fff',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 5,
    fontSize: 14,
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  changeRoleText: {
    color: '#4da3ff',
    fontSize: 16,
    marginLeft: 4,
  },
  deleteText: {
    color: '#ff4d4d',
    fontSize: 16,
    marginLeft: 4,
  },
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 30,
  },
  paginationInfo: {
    color: '#fff',
    fontSize: 16,
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pageButton: {
    backgroundColor: '#4da3ff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginHorizontal: 5,
  },
  disabledButton: {
    backgroundColor: '#2b2b36',
    opacity: 0.5,
  },
  pageButtonText: {
    color: '#fff',
    fontSize: 15,
  },
  pageNumber: {
    backgroundColor: '#2b2b36',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginHorizontal: 3,
  },
  activePage: {
    backgroundColor: '#4da3ff',
  },
  pageNumberText: {
    color: '#fff',
    fontSize: 15,
  },
  colName: { flex: 2, minWidth: 100 },
  colEmail: { flex: 3, minWidth: 160 },
  colRole: { flex: 1, minWidth: 80 },
  colStatus: { flex: 1.2, minWidth: 100 },
  colActions: { flex: 2, minWidth: 180 },

  // MODAL STYLES
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
});
