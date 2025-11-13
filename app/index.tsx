import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { loginUser } from '../app/api/userLoginApi';

export default function Home() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-30)).current;

  const runAnimation = () => {
    fadeAnim.setValue(0);
    slideAnim.setValue(-30);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();

    Animated.spring(slideAnim, {
      toValue: 0,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    runAnimation();
    const interval = setInterval(runAnimation, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    setLoading(true);
    const result = await loginUser(username, password);
    setLoading(false);
    if (result.success) {
      await AsyncStorage.setItem('token', result.token);
      await AsyncStorage.setItem('role', result.role);
      Alert.alert('Login Successful');
      if (result.role === 'admin') {
        router.replace('/admindashboard');
      } else if (result.role === 'student') {
        router.replace('/studentdashboard');
      } else {
        router.replace('/');
      }
    } else {
      Alert.alert('Login Failed', result.message || 'Invalid credentials');
    }
  };

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const role = await AsyncStorage.getItem('role');

        if (token) {
          if (role === 'admin') {
            router.replace('/admindashboard');
          } else if (role === 'student') {
            router.replace('/studentdashboard');
          } else {
            router.replace('/');
          }
        }
      } catch (error) {
        console.log('Error checking token: ', error);
      }
    };

    checkLogin();
  }, []);

  return (
    <ImageBackground
      source={require('../assets/images/signup3.jpg')}
      style={styles.background}
    >
      <Animated.Text
        style={[
          styles.mainHeading,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        Welcome to E-Gyan Libarary Management System
      </Animated.Text>

      <View style={styles.card}>
        <Text style={styles.heading}>Unlock Knowledge.</Text>
        <Text style={styles.subHeading}>Log In.</Text>

        <TextInput
          style={styles.input}
          placeholder="username"
          placeholderTextColor="#aaa"
          value={username}
          onChangeText={setUsername}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor="#aaa"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Ionicons
              name={passwordVisible ? 'eye' : 'eye-off'}
              size={22}
              color="#aaa"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Logging in...' : 'Log In'}
          </Text>
        </TouchableOpacity>

        <View style={styles.links}>
          <Text style={styles.linkText}>Start learning—Log In?</Text>
          <Text style={styles.linkText}>Forgot Password</Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  mainHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 80,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 10,
  },
  card: {
    backgroundColor: 'rgba(0,0,0,0.85)',
    padding: 30,
    borderRadius: 25,
    width: '90%',
    minHeight: 500,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 8,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4da6ff',
    marginBottom: 5,
  },
  subHeading: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 25,
  },
  input: {
    backgroundColor: '#1e1e2d',
    width: '100%',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    color: '#fff',
    fontSize: 18,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e2d',
    width: '100%',
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 20,
    color: '#fff',
    fontSize: 18,
  },
  button: {
    backgroundColor: '#3572ef',
    paddingVertical: 20,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#3572ef',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
  links: {
    marginTop: 18,
    alignItems: 'center',
  },
  linkText: {
    color: '#aaa',
    fontSize: 20,
    marginTop: 24,
  },
});
