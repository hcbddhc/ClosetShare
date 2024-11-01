// src/LoginScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { firebase_auth } from './firebaseConfig'; 

const LoginScreen = ({ navigation }) => {

  // initialize authentication from firebase
  const auth = firebase_auth;

  // State variables to track email and password inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State variable for error messages
  const [error, setError] = useState(null);

//login function
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('login successful');
      alert("Log in success. User: " + email + " logged in.");
      navigation.navigate('Home'); // Navigate to Home screen on successful login
    } catch (err) {
      setError(err.message);
    }
  };

  //sign up function
  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword( auth, email, password);
      console.log('sign up successful');
      alert("Sign up success. User: " + email + " signed up.");
      navigation.navigate('Home'); // Navigate to Home screen on successful sign-up
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button title="Login" onPress={handleLogin} />
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  input: { marginBottom: 12, padding: 8, borderWidth: 1, borderColor: '#ddd' },
  error: { color: 'red', marginBottom: 12 },
});

export default LoginScreen;

