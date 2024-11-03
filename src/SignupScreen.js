// src/SignupScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { firebase_auth } from './firebaseConfig';
import Input from './components/Input'; 
import DefaultButton from './components/DefaultButton'; 

const SignupScreen = ({ navigation }) => {
  const auth = firebase_auth;

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Sign up success. Welcome, " + username + "!");
      navigation.navigate('Home');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/SignupScreenImage/SignupImage_01.png')} style={styles.image} />
      <Text style={styles.title}>Register using your email, Google, or Facebook.</Text>
      
      <Input label="Username" placeholder="E.g. user123" value={username} onChangeText={setUsername} />
      <Input label="Email" placeholder="E.g. user123@mail.com" value={email} onChangeText={setEmail} />
      <Input label="Password" placeholder="E.g. User123*" value={password} onChangeText={setPassword} secureTextEntry />
      
      {error && <Text style={styles.error}>{error}</Text>}
      
      <Text style={styles.passwordHint}>* Password must be 8+ characters with one uppercase, one lowercase, and one special character.</Text>
      
      <DefaultButton title="Sign up" onPress={handleSignUp} />

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
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
    width: '100%',
    height: 250,
    resizeMode: 'contain',
    marginVertical: 20,
  },
  title: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
  passwordHint: {
    fontSize: 12,
    color: '#666',
    textAlign: 'left',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  skipText: {
    fontSize: 16,
    color: '#333',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
});

export default SignupScreen;
