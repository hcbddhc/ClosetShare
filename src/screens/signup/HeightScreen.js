// src/screens/signup/HeightScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DefaultButton from '../../components/DefaultButton';

const HeightScreen = ({ navigation, route }) => {
    const [selectedHeight, setSelectedHeight] = useState('');
    const { gender } = route.params;

    const heightRanges = [
        '155-159', '160-164', '165-169', '170-174', '175-179', '180-184'
    ]; 

    const handleNext = () => {
        if (selectedHeight) {
            navigation.navigate('Weight', { gender, height: selectedHeight });
        } else {
            alert('Please select your height.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>What’s your Height?</Text>
            <Text style={styles.description}>
                Select your height range to help us find the right fit for you.
            </Text>

            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={selectedHeight}
                    onValueChange={(itemValue) => setSelectedHeight(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Select your height range (cm)" value="" />
                    {heightRanges.map((range, index) => (
                        <Picker.Item key={index} label={range} value={range} />
                    ))}
                </Picker>
            </View>

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
        textAlign: 'center',
    },
    description: {
        fontWeight: '600',
        color: '#62656b',
        textAlign: 'center',
        paddingHorizontal: 64,
    },
    pickerContainer: {
        width: '80%',
        marginTop: 50,
        marginBottom: 25,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
        width: '100%',
    },
    nextButton: {
        marginTop: 20,
        width: 250,
    },
});

export default HeightScreen;
