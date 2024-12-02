import React, { useEffect } from 'react';
import { Platform, View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Footer = ({ activeTab }) => {
  const navigation = useNavigation();

  const handlePress = (tab) => {
    if (tab === 'Home') {
      navigation.navigate('Home'); // Navigate to Home screen
    } else if (tab === 'Post') {
      navigation.navigate('OutfitCreation', {
        onReturn: () => navigation.navigate('Home'), // Return to Home after posting
      });
    } else if (tab === 'Profile') {
      navigation.navigate('Profile'); // Navigate to Profile screen
    }
  };

  return (
    <View style={styles.footer}>
      {/* Home Tab */}
      <Pressable
        style={styles.footerOption}
        onPress={() => handlePress('Home')}
      >
        <Image
          source={
            activeTab === 'Home'
              ? require('../../assets/HomeScreenImages/Home Icon Active.png')
              : require('../../assets/HomeScreenImages/Home Icon.png')
          }
          style={styles.footerIcon}
        />
        <Text
          style={[
            styles.footerText,
            activeTab === 'Home' && styles.activeText,
          ]}
        >
          Home
        </Text>
      </Pressable>

      {/* Post Tab */}
      <Pressable
        style={styles.footerOption}
        onPress={() => handlePress('Post')}
      >
        <Image
          source={require('../../assets/HomeScreenImages/Post Icon.png')} 
          style={styles.footerIcon}
        />
        <Text
          style={[
            styles.footerText,
            activeTab === 'Post' && styles.activeText,
          ]}
        >
          Post
        </Text>
      </Pressable>

      {/* Profile Tab */}
      <Pressable
        style={styles.footerOption}
        onPress={() => handlePress('Profile')}
      >
        <Image
          source={
            activeTab === 'Profile'
              ? require('../../assets/HomeScreenImages/Profile Icon Active.png')
              : require('../../assets/HomeScreenImages/Profile Icon.png')
          }
          style={styles.footerIcon}
        />
        <Text
          style={[
            styles.footerText,
            activeTab === 'Profile' && styles.activeText,
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
    color: 'purple', // Active tab text color
    fontWeight: 'bold',
  },
});

export default Footer;
