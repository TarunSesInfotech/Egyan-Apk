import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { View } from 'react-native';
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
} from 'react-native-alert-notification';
// ==================== Custom Drawer ====================
function CustomDrawerContent(props: DrawerContentComponentProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Logged Out',
        textBody: 'You have been successfully logged out.',
        button: 'OK',
        onHide: async () => {
          await AsyncStorage.removeItem('token');
          router.replace('/');
        },
      });
    } catch (error) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Logged Out',
        textBody: 'Invalid username or password.',
        button: 'Try Again',
      });
    }
  };
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flex: 1, backgroundColor: '#1c1c2e' }}
    >
      <View style={{ flex: 1 }}>
        <DrawerItemList {...props} />
      </View>

      <DrawerItem
        label="Logout"
        labelStyle={{ color: '#fff', fontSize: 24 }}
        icon={() => <Ionicons name="log-out" size={30} color={'#fff'} />}
        onPress={handleLogout}
        style={{
          marginBottom: 16,
          backgroundColor: '#d32f2f',
          borderRadius: 12,
          height: 70,
          justifyContent: 'center',
        }}
      />
    </DrawerContentScrollView>
  );
}

// ==================== Drawer Layout ====================
export default function AdminDrawerLayout() {
  return (
    <AlertNotificationRoot>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerStyle: { backgroundColor: '#1c1c2e' },
          headerTintColor: '#fff',
          drawerStyle: {
            backgroundColor: '#1c1c2e',
            width: 350,
            paddingTop: 10,
          },
          drawerLabelStyle: { color: '#fff', fontSize: 24 },
          drawerInactiveTintColor: '#fff',
          drawerActiveTintColor: '#00aced',
          headerTitleAlign: 'center',
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: 'Dashboard',
            title: 'Admin Dashboard',
            drawerIcon: ({ color }) => (
              <Ionicons name="home" size={30} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="school-overview"
          options={{
            drawerLabel: 'School Overview',
            title: 'School Overview',
            drawerIcon: ({ color }) => (
              <Ionicons name="school" size={30} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Repository"
          options={{
            drawerLabel: 'Repository',
            title: 'Repository',
            drawerIcon: ({ color }) => (
              <Ionicons name="library" size={30} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="manage-content"
          options={{
            drawerLabel: 'Manage Content',
            title: 'Manage Content',
            drawerIcon: ({ color }) => (
              <Ionicons name="book" size={30} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="manage-students"
          options={{
            drawerLabel: 'Manage Students',
            title: 'Manage Students',
            drawerIcon: ({ color }) => (
              <Ionicons name="school-outline" size={30} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="announcements"
          options={{
            drawerLabel: 'Announcements',
            title: 'Announcements',
            drawerIcon: ({ color }) => (
              <Ionicons name="megaphone-outline" size={30} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="reports"
          options={{
            drawerLabel: 'Reports',
            title: 'Reports',
            drawerIcon: ({ color }) => (
              <Ionicons name="document-text-outline" size={30} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="role-management"
          options={{
            drawerLabel: 'Role Management',
            title: 'Role Management',
            drawerIcon: ({ color }) => (
              <Ionicons name="shield-checkmark" size={30} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="book-manage"
          options={{
            drawerLabel: 'Book Manage',
            title: 'Book Manage',
            drawerIcon: ({ color }) => (
              <Ionicons name="book" size={30} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="upload-content"
          options={{
            drawerLabel: 'Upload Content',
            title: 'Upload Content',
            drawerIcon: ({ color }) => (
              <Ionicons name="cloud-upload-outline" size={30} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="notifications"
          options={{
            drawerLabel: 'Notifications',
            title: 'Notifications',
            drawerLabelStyle: {
              color: '#fff',
              fontSize: 24,
            },
            drawerItemStyle: {
              marginTop: 380,
              backgroundColor: '#3572ef',
              borderRadius: 12,
              height: 70,
              justifyContent: 'center',
            },
            drawerIcon: () => (
              <Ionicons name="notifications" size={30} color="#fff" />
            ),
          }}
        />
        <Drawer.Screen
          name="profile-settings"
          options={{
            drawerLabel: 'Profile Settings',
            title: 'Profile Settings',
            drawerLabelStyle: {
              color: '#fff',
              fontSize: 24,
            },
            drawerItemStyle: {
              marginTop: 12,
              backgroundColor: '#3572ef',
              borderRadius: 12,
              height: 70,
              justifyContent: 'center',
            },
            drawerIcon: ({ color }) => (
              <Ionicons name="person-circle" size={30} color={color} />
            ),
          }}
        />
      </Drawer>
    </AlertNotificationRoot>
  );
}
