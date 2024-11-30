import React, { useState } from 'react';
import { Platform, View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Footer = () => {
  const [selectedTab, setSelectedTab] = useState('Home');  // Track selected tab
  const navigation = useNavigation();

  const handlePress = (tab) => {
    setSelectedTab(tab);  // Set selected tab when pressed
    if (tab === 'Home') {
      navigation.navigate('Home');  // Navigate to Home screen
    } else if (tab === 'Post') {
      navigation.navigate('OutfitCreation');  // Navigate to Post screen
    } else {
      navigation.navigate('Profile');  // Navigate to Profile screen
    }
  };

  return (
    <View style={styles.footer}>
      <Pressable 
        style={styles.footerOption} 
        onPress={() => handlePress('Home')}
      >
        <Image 
          source={
            selectedTab === 'Home' 
            ? require('../../assets/HomeScreenImages/Home Icon Active.png') 
            : require('../../assets/HomeScreenImages/Home Icon.png')
          }
          style={styles.footerIcon}
        />
        <Text 
          style={[
            styles.footerText, 
            selectedTab === 'Home' && styles.activeText
          ]}
        >
          Home
        </Text>
      </Pressable>
      <Pressable 
        style={styles.footerOption} 
        onPress={() => handlePress('Post')}
      >
        <Image 
          source={require('../../assets/HomeScreenImages/Post Icon.png')} 
          style={styles.footerIcon}
        />
        <Text style={styles.footerText}>Post</Text>
      </Pressable>
      <Pressable 
        style={styles.footerOption} 
        onPress={() => handlePress('Profile')}
      >
        <Image 
          source={
            selectedTab === 'Profile' 
            ? require('../../assets/HomeScreenImages/Profile Icon Active.png') 
            : require('../../assets/HomeScreenImages/Profile Icon.png')
          }
          style={styles.footerIcon}
        />
        <Text 
          style={[
            styles.footerText, 
            selectedTab === 'Profile' && styles.activeText
          ]}
        >
          Profile
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: '17%',
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    shadowOffset: { width: 0, height: -4 },
    shadowColor: 'black',
    shadowOpacity: 0.1,
    elevation: 3,
  },
  footerOption: {
    alignItems: 'center',
  },
  footerIcon: {
    width: 24,
    height: 24,
    marginBottom: 2,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Nunito_300Light',
    color: '#666363',
  },
  activeText: {
    color: 'purple',  // Set active text color to purple
  },
});

export default Footer;