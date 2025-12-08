import AsyncStorage from '@react-native-async-storage/async-storage';

export const loginUser = async (username, password) => {
  try {
    const response = await fetch(
      'https://e-gyan-9tky.onrender.com/auth/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      }
    );
    const data = await response.json();
    if (data) {
      await AsyncStorage.setItem('access_token', data.token);
      await AsyncStorage.setItem('role', data.role);
      return { success: true, token: data.token, role: data.role };
    } else {
      return { success: false, message: 'Login failed' };
    }
  } catch (error) {
    console.log('Login Exception:', error);
    return { success: false, message: error.message };
  }
};
