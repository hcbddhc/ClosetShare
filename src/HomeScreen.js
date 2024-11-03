// src/HomeScreen.js
import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useFonts, Poppins_700Bold } from '@expo-google-fonts/poppins';


const HomeScreen = () => {
  // Load the Poppins font
  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
  });

  // If fonts haven't loaded yet, return null to render nothing
  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style= {styles.header}>
        <Text style={styles.logo}>CLOSET SHARE.</Text>
        <Text style={styles.caption}>search......</Text>
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
  },
  logo: {
    fontFamily: 'Poppins_700Bold', // Apply the loaded font here
    fontSize: 14,
    color: '#8A2BE2', // Adjust the color as needed
  },
});

export default HomeScreen;
