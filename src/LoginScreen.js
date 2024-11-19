// src/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, useWindowDimensions } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { firebase_auth } from './firebaseConfig';
import Input from './components/Input'; 
import DefaultButton from './components/DefaultButton'; 
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { saveData } from './utils/storage'; 
import { useFocusEffect } from '@react-navigation/native';

const LoginScreen = ({ navigation, onLoginStateChange  }) => {
  const auth = firebase_auth;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { width } = useWindowDimensions();

  const handleLogin = async () => {
    try {
      console.log('Login triggered');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
  
      // Save user info
      await saveData('user', { uid, email });
      console.log('User authenticated and data saved:', { uid, email });
  
      // Trigger login state update in App.js
      onLoginStateChange();
  
      // Navigate to the Home screen
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      }, 100); // Small delay to allow state updates
    } catch (error) {
      console.error('Error logging in:', error.message);
      // Optionally, display error feedback to the user
    }
  };
  
  
  
  useFocusEffect(
    React.useCallback(() => {
      console.log('LoginScreen gained focus');
      onLoginStateChange(); // Ensure the login state is updated dynamically
    }, [])
  );
  

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container} enableOnAndroid={true}>
      <Image source={require('../assets/loginScreenImages/LoginImage_01.png')} style={[styles.image, {width, resizeMode:'contain'}]} />
      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subtitle}>Log in to continue your style journey.</Text>
      
      <Input label="Email" placeholder="E.g. user123@mail.com" value={email} onChangeText={setEmail} />
      <Input label="Password" placeholder="E.g. User123*" value={password} onChangeText={setPassword} secureTextEntry />
      
      {error && <Text style={styles.error}>{error}</Text>}
      
      <View style={styles.buttonRow}>
        <DefaultButton title="Login" onPress={handleLogin} />
        <DefaultButton title="Sign up" onPress={() => navigation.navigate('GetStarted')} />
      </View>

      <Text style={styles.orText}>Or login with</Text>
      
      <View style={styles.socialIconsContainer}>
        <TouchableOpacity style={styles.socialIcon}><Text>F</Text></TouchableOpacity>
        <TouchableOpacity style={styles.socialIcon}><Text>G</Text></TouchableOpacity>
        <TouchableOpacity style={styles.socialIcon}><Text>A</Text></TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Text style={styles.skipText}>Skip for now</Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  image: {
    height: '30%',
    marginVertical: 20,
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 28,
    fontWeight: '800',
    color: '#493d8a',
    marginBottom: 10,
    textAlign:'center',
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
    width: '80%',
    marginBottom: 20,
  },
});

export default LoginScreen;


