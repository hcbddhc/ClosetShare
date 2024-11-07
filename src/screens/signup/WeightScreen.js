// src/screens/signup/WeightScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Input from '../../components/Input';
import DefaultButton from '../../components/DefaultButton';

const WeightScreen = ({ navigation, route }) => {

    const [weight, setWeight] = useState('');
    const { gender, height } = route.params;

    const handleNext = () => {
        if (weight) {
            navigation.navigate('Signup', { gender, height, weight });
        } else {
            alert("Please enter your weight.");
        }
    };

    return (
    <View style={styles.container}>
        <Text style={styles.title}>What’s your Weight?</Text>
        <Text style={styles.description}>
        Enter your weight to personalize size recommendations.
        </Text>

        <Input
        label=""
        placeholder="Enter weight in kg or lbs"
        value={weight}
        onChangeText={setWeight}
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

export default WeightScreen;



