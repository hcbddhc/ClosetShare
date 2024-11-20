
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { firebase_auth } from '../../firebaseConfig';
import Input from '../../components/Input';
import DefaultButton from '../../components/DefaultButton';
import { db } from '../../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { saveData } from '../../utils/storage';


const SignupScreen = ({ navigation, route }) => {

  const { gender, height, weight, location } = route.params;
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(firebase_auth, email, password);
      const uid = userCredential.user.uid;

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

      alert("Sign up successful! Welcome, " + username);
      navigation.navigate('Home');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete Your Signup</Text>

      <Input label="Username" placeholder="E.g. user123" value={username} onChangeText={setUsername} />
      <Input label="Email" placeholder="E.g. user123@mail.com" value={email} onChangeText={setEmail} />
      <Input label="Password" placeholder="E.g. User123*" value={password} onChangeText={setPassword} secureTextEntry />

      {error && <Text style={styles.error}>{error}</Text>}

      <DefaultButton title="Complete Signup" onPress={handleSignUp} />
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
});

export default SignupScreen;




