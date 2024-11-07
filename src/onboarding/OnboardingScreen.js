// src/OnboardingScreen.js
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Animated } from 'react-native';

import Slides from './Slides';
import OnboardingItem from './OnboardingItem';
import Paginator from '../components/Paginator';
import DefaultButton from '../components/DefaultButton';

const OnboardingScreen = ({navigation}) => {
  const [currentIndex, setCurrentIndex] =useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollToNext = () => {
    if (currentIndex < Slides.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.navigate('Login'); // Navigate to LoginScreen when on the last slide
    }
  };

  return (
    <View style={styles.container}>
      <View style={{flex: 3}}>
        <FlatList 
          data={Slides} 
          renderItem={({ item }) => <OnboardingItem item={item} />}
          horizontal
          pagingEnabled
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          bounces={false}
          scrollEnabled
          onScroll={Animated.event([{ nativeEvent: { contentOffset: {x: scrollX } } }], {
            useNativeDriver:false,
          })}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
        />
      </View>

      <DefaultButton 
        title={currentIndex === Slides.length - 1 ? "Get Started" : "Next"} // it will changed the text to Get Started when reached to the last slide.
        onPress={scrollToNext} 
        style={styles.customButton} 
      />
      <Paginator data={Slides} scrollX={scrollX}/>
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
  customButton: {
    width: 250,  // Custom width for the button
  },
});

export default OnboardingScreen;
