import { currentUserApi } from '@/app/api/studentapi/studentDashboardApi';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

export default function WelcomeHeader() {
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const response = await currentUserApi();
      if (response.success) {
        setCurrentUser(response.data);
      }
    };
    fetchCurrentUser();
  }, []);

  return (
    <Text style={styles.welcomeText}>
      Hi, Welcome Mr.{currentUser?.profile?.username}
    </Text>
  );
}

const styles = StyleSheet.create({
  welcomeText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
  },
});
