// src/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { firebase_auth } from './firebaseConfig';
import Input from './components/Input'; 
import DefaultButton from './components/DefaultButton'; 

const LoginScreen = ({ navigation }) => {
  const auth = firebase_auth;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Log in success. User: " + email + " logged in.");
      navigation.navigate('Home');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/loginScreenImages/LoginImage_01.png')} style={styles.image} />
      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subtitle}>Log in to continue your style journey.</Text>
      
      <Input label="Email" placeholder="E.g. user123@mail.com" value={email} onChangeText={setEmail} />
      <Input label="Password" placeholder="E.g. User123*" value={password} onChangeText={setPassword} secureTextEntry />
      
      {error && <Text style={styles.error}>{error}</Text>}
      
      <View style={styles.buttonRow}>
        <DefaultButton title="Login" onPress={handleLogin} />
        <DefaultButton title="Sign up" onPress={() => navigation.navigate('Signup')} />
      </View>

      <Text style={styles.orText}>Or login with</Text>
      
      <View style={styles.socialIconsContainer}>
        {/* Placeholder for social login buttons */}
        <TouchableOpacity style={styles.socialIcon}><Text>F</Text></TouchableOpacity>
        <TouchableOpacity style={styles.socialIcon}><Text>G</Text></TouchableOpacity>
        <TouchableOpacity style={styles.socialIcon}><Text>A</Text></TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Text style={styles.skipText}>Skip for now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
  orText: {
    fontSize: 16,
    color: '#666',
    marginVertical: 20,
    textAlign: 'center',
  },
  socialIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
    marginBottom: 20,
  },
  socialIcon: {
    width: 50,
    height: 50,
    backgroundColor: '#eee',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipText: {
    fontSize: 16,
    color: '#333',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%', // Adjust width as needed
    marginBottom: 20,
  },
});

export default LoginScreen;


