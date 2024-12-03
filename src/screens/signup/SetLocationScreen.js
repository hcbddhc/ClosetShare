// src/screens/signup/SetLocationScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import DefaultButton from '../../components/DefaultButton';

const SetLocationScreen = ({ navigation, route }) => {
  const { gender, height, weight } = route.params;
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location access is required!');
        navigation.navigate('Signup', { gender, height, weight });
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setLocation({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
      });
    })();
  }, []);

  const handleConfirm = () => {
    navigation.navigate('Signup', {
      gender,
      height,
      weight,
      location,
    });
  };

  return (
    <View style={styles.container}>
      {region && (
        <MapView
          provider={MapView.PROVIDER_GOOGLE} // Force Google Maps on iOS
          style={styles.map}
          initialRegion={region}
          onPress={(e) => setLocation(e.nativeEvent.coordinate)}
        >
          {location && <Marker coordinate={location} draggable />}
        </MapView>
      )}
      
      <View style={styles.buttonContainer} pointerEvents="box-none">
        <DefaultButton title="Confirm" onPress={handleConfirm} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  yesButton: {
    position: 'absolute',  
    bottom: 30,            
    width: 250,
    alignSelf: 'center', 
  },
});

export default SetLocationScreen;
