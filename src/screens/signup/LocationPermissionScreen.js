// src/screens/signup/LocationPermissionScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DefaultButton from '../../components/DefaultButton';

const LocationPermissionScreen = ({ navigation, route }) => {
  const { gender, height, weight } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Share Your Location</Text>
      <Text style={styles.description}>
        Would you like to share your location for personalized recommendations?
      </Text>
      <DefaultButton
        title="Yes"
        onPress={() =>
          navigation.navigate('SetLocation', { gender, height, weight })
        }
      />
      <DefaultButton
        title="No"
        onPress={() =>
          navigation.navigate('Signup', { gender, height, weight })
        }
        style={styles.noButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    textAlign: 'center',
    marginBottom: 20,
  },
  noButton: {
    marginTop: 10,
  },
});

export default LocationPermissionScreen;
