
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { firebase_auth } from '../../firebaseConfig';
import Input from '../../components/Input';
import DefaultButton from '../../components/DefaultButton';
import { db } from '../../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { saveData } from '../../utils/storage';
import { useFocusEffect } from '@react-navigation/native';


const SignupScreen = ({ onLoginStateChange, navigation, route }) => {

  const { gender, height, weight, location } = route.params;
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(firebase_auth, email, password);
      const uid = userCredential.user.uid;

      onLoginStateChange();

      // Save user data to Firestore
      await setDoc(doc(db, 'users', uid), {
        username,
        email,
        gender,
        height,
        weight,
        location, // Save location data
      });

      // Save user login info to AsyncStorage
      await saveData('user', { uid, username, email });

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
      console.log('SignupScreen gained focus');
      onLoginStateChange(); // Ensure the login state is updated dynamically
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete Your Signup</Text>

      <Input label="Username" placeholder="E.g. user123" value={username} onChangeText={setUsername} />
      <Input label="Email" placeholder="E.g. user123@mail.com" value={email} onChangeText={setEmail} />
      <Input label="Password" placeholder="E.g. User123*" value={password} onChangeText={setPassword} secureTextEntry />

      {error && <Text style={styles.error}>{error}</Text>}

      <DefaultButton title="Complete Signup" onPress={handleSignUp} style={styles.nextButton}/>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
    },
    title: {
      fontFamily: 'Poppins_700Bold',
      fontSize: 28,
      fontWeight: '800',
      color: '#493d8a',
      marginBottom: 10,
      textAlign:'center',
    },
    error: {
      color: 'red',
      marginVertical: 10,
    },
    nextButton: {
      marginTop: 20,
      width: 250,
    },
});

export default SignupScreen;




