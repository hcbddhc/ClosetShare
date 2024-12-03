import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Alert, Text, Linking, Pressable, Image, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { getOutfitID } from '../utils/storage';

const NavigationScreen = ({ route, navigation }) => {
  const { pieceLocation } = route.params;
  const [currentLocation, setCurrentLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [region, setRegion] = useState(null); // Dynamic map region
  const destinationInitialized = useRef(false);
  const [renderKey, setRenderKey] = useState(0); 
  const googleAPIKey = "AIzaSyBRHAnCIutuztVCDbTZTCUvs0NiQc8vruY";

  const openGoogleMaps = () => {
    if (destination) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${destination.latitude},${destination.longitude}&travelmode=driving`;
      Linking.openURL(url).catch((err) =>
        Alert.alert('Error', 'Failed to open Google Maps.')
      );
    }
  };

  const fetchNearbyPlace = async (coords, radius) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coords.latitude},${coords.longitude}&radius=${radius}&keyword=${encodeURIComponent(pieceLocation)}&key=${googleAPIKey}`
      );
      const data = await response.json();
      return data.results && data.results.length > 0 ? data.results[0] : null;
    } catch (error) {
      console.error('Error fetching nearby place:', error);
      return null;
    }
  };

  const progressiveRadiusSearch = async (coords) => {
    setLoading(true); // Start loading
    let radius = 1000; // Initial radius, 1000 = 1km
    const maxRadius = 50000; 
    let nearestPlace = null;

    while (radius <= maxRadius && !nearestPlace) {
      console.log(`Searching with radius: ${radius}`);
      nearestPlace = await fetchNearbyPlace(coords, radius);
      if (!nearestPlace) radius += 5000; // Increase the radius if no place found
    }

    setLoading(false); // Stop loading
    return nearestPlace;
  };

  const fetchDirections = async (origin, destination) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${googleAPIKey}`
      );

      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const points = decodePolyline(data.routes[0].overview_polyline.points);
        setRouteCoordinates(points);
        setRenderKey((prevKey) => prevKey + 1); // Increment renderKey for re-render
      } else {
        Alert.alert('Error', 'No route found.');
      }
    } catch (error) {
      console.error('Error fetching directions:', error);
      Alert.alert('Error', 'Failed to fetch directions.');
    }
  };

  const decodePolyline = (encoded) => {
    let points = [];
    let index = 0;
    let lat = 0;
    let lng = 0;

    while (index < encoded.length) {
      let b, shift = 0, result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const deltaLat = (result & 1) !== 0 ? ~(result >> 1) : (result >> 1);
      lat += deltaLat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const deltaLng = (result & 1) !== 0 ? ~(result >> 1) : (result >> 1);
      lng += deltaLng;

      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }

    return points;
  };

  useEffect(() => {
    const initializeLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Location access is required!');
          navigation.goBack();
          return;
        }

        const userLocation = await Location.getCurrentPositionAsync({});
        const coords = {
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
        };

        setCurrentLocation(coords);
        setRegion({
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        });

        if (!destinationInitialized.current) {
          const nearestPlace = await progressiveRadiusSearch(coords);

          if (nearestPlace) {
            const { lat, lng } = nearestPlace.geometry.location;
            const destCoords = { latitude: lat, longitude: lng };
            setDestination(destCoords);

            await fetchDirections(coords, destCoords);
            destinationInitialized.current = true;
          } else {
            Alert.alert('Error', 'No nearby places found within maximum radius.');
          }
        }
      } catch (error) {
        console.error('Error initializing location:', error);
        Alert.alert('Error', 'Something went wrong while initializing location.');
      }
    };

    initializeLocation();
  }, [pieceLocation]);

  const handleBackPress = async () => {
    const outfitID = await getOutfitID();
    const userId = route.params.userId;

    if (outfitID && userId) {
      navigation.navigate('DetailedOutfit', { outfitId: outfitID, userId });
    } else {
      Alert.alert('Error', 'Missing data to navigate back.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Searching for the nearest destination...</Text>
      </View>
    );
  }

  if (!currentLocation || !destination) {
    return (
      <View style={styles.container}>
        <Text>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={handleBackPress} style={styles.backButton}>
        <Image
          source={require('../../assets/outfitCreationImages/back button.png')}
          style={styles.backButtonImage}
        />
      </Pressable>
      <MapView
        key={renderKey}
        provider={MapView.PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
      >
        <Marker coordinate={currentLocation} title="Your Location" />
        <Marker
          coordinate={destination}
          title={pieceLocation}
          description="Tap to navigate in Google Maps"
          onPress={openGoogleMaps}
        />
        {routeCoordinates.length > 0 && (
          <Polyline coordinates={routeCoordinates} strokeWidth={4} strokeColor="blue" />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    zIndex: 10,
  },
  backButtonImage: {
    width: 30,
    height: 30,
  },
});

export default NavigationScreen;
