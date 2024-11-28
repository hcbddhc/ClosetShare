// src/screens/signup/WeightScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DefaultButton from '../../components/DefaultButton';

const WeightScreen = ({ navigation, route }) => {
    const [selectedBodySize, setSelectedBodySize] = useState('');
    const { gender, height } = route.params;

    const weight = ['Curvy', 'Slim', 'Athletic', 'Petite', 'Plus-size'];

    const handleNext = () => {
        if (selectedBodySize) {
            navigation.navigate('LocationPermission', { gender, height, weight: selectedBodySize });
        } else {
            alert('Please select your body size.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>What’s your Body Size?</Text>
            <Text style={styles.description}>
                Select your body size to personalize size recommendations.
            </Text>

            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={selectedBodySize}
                    onValueChange={(itemValue) => setSelectedBodySize(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Select your body size" value="" />
                    {weight.map((size, index) => (
                        <Picker.Item key={index} label={size} value={size} />
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
        marginVertical: 20,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        overflow: 'hidden',
        marginTop: 50,
        marginBottom: 25,
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

export default WeightScreen;
