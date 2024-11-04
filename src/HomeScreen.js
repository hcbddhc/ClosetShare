// src/HomeScreen.js
import React from 'react';
import Footer from './components/Footer';
import { View, Text, Image, TextInput, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useFonts, Poppins_700Bold } from '@expo-google-fonts/poppins';


const HomeScreen = () => {
  // Load Poppins font
  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
  });
  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>

       {/* ------------------------------------------Header------------------------------------------------------- */}
      <View style= {styles.header}>
        {/* Logo */}
        <Text style={styles.logo}>CLOSET SHARE.</Text>

        {/* Search Bar */}
        <View style = {styles.search}>
          <Image style={styles.searchIcon} source={require('../assets/HomeScreenImages/Search Icon.png')} />
          <TextInput style={styles.caption} placeholder="search......"/>
        </View>

        {/* Filter bar */}
        <View style = {styles.filter}>
          <Pressable style={styles.filterIcon}><Image source={require('../assets/HomeScreenImages/Filter Icon.png')}/></Pressable>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterOptionsContainer}>
            <Pressable style={styles.filterOption}>
              <Text style={styles.filterText}>Gender</Text>
              <Image source={require('../assets/HomeScreenImages/DropdownIcon.png')} style={styles.dropdownIcon} />
            </Pressable>
            <Pressable style={styles.filterOption}>
              <Text style={styles.filterText}>Height</Text>
              <Image source={require('../assets/HomeScreenImages/DropdownIcon.png')} style={styles.dropdownIcon} />
            </Pressable>
            <Pressable style={styles.filterOption}>
              <Text style={styles.filterText}>Season</Text>
              <Image source={require('../assets/HomeScreenImages/DropdownIcon.png')} style={styles.dropdownIcon} />
            </Pressable>
            <Pressable style={styles.filterOption}>
              <Text style={styles.filterText}>Body Type</Text>
              <Image source={require('../assets/HomeScreenImages/DropdownIcon.png')} style={styles.dropdownIcon} />
            </Pressable>
          </ScrollView>
        </View>
      </View>
      
      {/* ------------------------------------------Content------------------------------------------------------- */}
      <View style= {styles.content}></View>

      {/* ------------------------------------------Footer------------------------------------------------------- */}
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },


  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 56,
    paddingBottom: 10,
    paddingLeft: 22,
  },
  logo: { 
    fontFamily: 'Poppins_700Bold',
    fontSize: 20,
    color: '#9D4EDD', 
    marginBottom: 16,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    marginRight: 22,
    padding: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  filter :{
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  filterIcon: {
    marginRight: 10,
  },
  filterText: {
    color: '#666363',
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECCBFF',
    marginRight: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  dropdownIcon: {
    height: 15,
    width: 15,
    marginLeft: 5,
  },


  content: {
    flex: 1
  },

});

export default HomeScreen;
