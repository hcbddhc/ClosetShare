// src/OnboardingItem.js
import React from 'react';
import { View, Text, StyleSheet, Image, useWindowDimensions} from 'react-native';

const OnboardingItem = ({item}) => {
    const { width } = useWindowDimensions();

    return(
        <View style={[styles.container, {width}]}>
            <Image source ={item.image} style={[styles.image, {width, resizeMode:'contain'}]}/>

            <View style={{flex: 0.3}}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    flex: 0.7,
    justifyContent:'center',
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 28,
    fontWeight: '800',
    color: '#493d8a',
    marginBottom: 10,
    textAlign:'center',
  },
  description: {
    fontWeight:'600',
    color: '#62656b',
    textAlign: 'center',
    paddingHorizontal: 64,
  },
});

export default OnboardingItem;
