// src/OnboardingScreen.js
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Animated } from 'react-native';

import Slides from './Slides';
import OnboardingItem from './OnboardingItem';

const OnboardingScreen = () => {
  const [currentIndex, setCurrentIndex] =useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.container}>
      <FlatList 
        data={Slides} 
        renderItem={({ item }) => <OnboardingItem item={item} />}
        horizontal
        pagingEnabled
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator
        bounces={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: {x: scrollX } } }], {
          useNativeDriver:false,
        })}
      />
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#fff',
  },
});

export default OnboardingScreen;
