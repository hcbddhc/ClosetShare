import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';  // Import the hook

const Footer = () => {
  const navigation = useNavigation();  // Use the hook to get the navigation object

  return (
    <View style={styles.footer}>
      <Pressable style={styles.footerOption}>
        <Image source={require('../../assets/HomeScreenImages/Home Icon.png')} style={styles.footerIcon} />
        <Text style={styles.footerText}>Home</Text>
      </Pressable>
      <Pressable style={styles.footerOption}>
        <Image source={require('../../assets/HomeScreenImages/Post Icon.png')} style={styles.footerIcon} />
        <Text style={styles.footerText}>Post</Text>
      </Pressable>
      <Pressable style={styles.footerOption} onPress={() => navigation.navigate('OutfitCreation')}>
        <Image source={require('../../assets/HomeScreenImages/Profile Icon.png')} style={styles.footerIcon} />
        <Text style={styles.footerText}>Profile</Text>
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
    paddingVertical: 10,
    borderTopWidth: 1, 
    borderTopColor: '#666363', 
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
    fontSize: 12,
    color: '#666363',
  }
});

export default Footer;