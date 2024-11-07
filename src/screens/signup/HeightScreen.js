// src/screens/signup/HeightScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Input from '../../components/Input';
import DefaultButton from '../../components/DefaultButton';

const HeightScreen = ({ navigation, route }) => {

    const [height, setHeight] = useState('');
    const { gender } = route.params;


    const handleNext = () => {
        if (height) {
        navigation.navigate('Weight', { gender, height });
        } else {
        alert("Please enter your height.");
        }
    };

    return (
        <View style={styles.container}>
        <Text style={styles.title}>What’s your Height?</Text>
        <Text style={styles.description}>
            Enter your height to help us find the right fit for you.
        </Text>

        <Input
            label=""
            placeholder="Enter height in cm or ft/in"
            value={height}
            onChangeText={setHeight}
        />

        <DefaultButton title="Next" onPress={handleNext} style={styles.nextButton} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#fff',
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
    nextButton: {
        marginTop: 20,
        width: '80%',
    },
});

export default HeightScreen;


