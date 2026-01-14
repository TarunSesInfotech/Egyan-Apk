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

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const router = useRouter();

  {/* ===== Logout Function here ===== */}
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      router.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flex: 1, backgroundColor: '#1c1c2e' }}
    >
      <View style={{ flex: 1, marginTop: 10 }}>
        <DrawerItemList {...props} />
      </View>
      {/* <DrawerItem
        label="Notifications"
        labelStyle={{ color: '#fff', fontSize: 24 }}
        icon={() => <Ionicons name="notifications" size={30} color={'#fff'} />}
        onPress={() => {}}
        style={{
          marginBottom: 16,
          backgroundColor: '#3572ef',
          borderRadius: 12,
          height: 70,
          justifyContent: 'center',
        }}
      />
      <DrawerItem
        label="Profile Settings"
        labelStyle={{ color: '#fff', fontSize: 24 }}
        icon={() => <Ionicons name="person-circle" size={30} color={'#fff'} />}
        onPress={() => {}}
        style={{
          marginBottom: 16,
          backgroundColor: '#3572ef',
          borderRadius: 12,
          height: 70,
          justifyContent: 'center',
        }}
      /> */}
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

export default function StudentDrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: '#1c1c2e' },
        headerTintColor: '#fff',
        drawerStyle: { backgroundColor: '#1c1c2e', width: 350, paddingTop: 10 },
        drawerLabelStyle: { color: '#fff', fontSize: 24 },
        drawerInactiveTintColor: '#fff',
        drawerActiveTintColor: '#00aced',
        headerTitleAlign: 'center',
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: 'Student Dashboard',
          title: 'Student Dashboard',
          drawerIcon: ({ color }) => (
            <Ionicons name="home" size={30} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="study-material"
        options={{
          drawerLabel: 'Study Material',
          title: 'Study Material',
          drawerIcon: ({ color }) => (
            <Ionicons name="library" size={30} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="my-courses"
        options={{
          drawerLabel: 'My Courses',
          title: 'My Courses',
          drawerIcon: ({ color }) => (
            <Ionicons name="book" size={30} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="my-progress"
        options={{
          drawerLabel: 'My Progress',
          title: 'My Progress',
          drawerIcon: ({ color }) => (
            <Ionicons name="trending-up" size={30} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="recent-activity"
        options={{
          drawerLabel: 'Recent Activity',
          title: 'Recent Activity',
          drawerIcon: ({ color }) => (
            <Ionicons name="time" size={30} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="favorites"
        options={{
          drawerLabel: 'Favorites',
          title: 'Favorites',
          drawerIcon: ({ color }) => (
            <Ionicons name="heart" size={30} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="raise-concern"
        options={{
          drawerLabel: 'Raise Concern',
          title: 'Raise Concern',
          drawerIcon: ({ color }) => (
            <Ionicons name="help-circle" size={30} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}
