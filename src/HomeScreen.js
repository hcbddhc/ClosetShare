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

       {/* Header */}
      <View style= {styles.header}>
        <Text style={styles.logo}>CLOSET SHARE.</Text>
        <View style = {styles.search}>

          <TextInput style={styles.caption} placeholder="search......"/>
        </View>
      </View>{/* Header */}
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 56,
    paddingBottom: 10,
  },

  logo: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 14,
    color: '#9D4EDD', 
  },
  search: {
    marginLeft: 22,
    marginRight: 22,
    padding: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 15,

  }
});

export default HomeScreen;
