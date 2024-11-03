// src/components/DefaultButton.js
import React, { useRef } from 'react';
import { Pressable, Text, StyleSheet, Animated } from 'react-native';

const DefaultButton = ({ title, onPress }) => {
  const animatedOpacity = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(animatedOpacity, {
      toValue: 0.6,
      duration: 200, // Adjust duration to control the speed
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(animatedOpacity, {
      toValue: 1,
      duration: 200, 
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[styles.button, { opacity: animatedOpacity }]}>
        <Text style={styles.buttonText}>{title}</Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#493d8a',
    paddingVertical: 12,
    paddingHorizontal: 48,
    borderRadius: 8,
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DefaultButton;




