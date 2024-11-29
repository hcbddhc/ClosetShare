import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import DefaultButton from '../../components/DefaultButton';

const WeightScreen = ({ navigation, route }) => {
    const [selectedBodySize, setSelectedBodySize] = useState('');
    const { gender, height } = route.params;

    const weightOptions = [
        { label: 'Curvy', value: 'Curvy' },
        { label: 'Slim', value: 'Slim' },
        { label: 'Athletic', value: 'Athletic' },
        { label: 'Petite', value: 'Petite' },
        { label: 'Plus-size', value: 'Plus-size' },
    ];

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

            <Dropdown
                style={styles.dropdown}
                data={weightOptions}
                labelField="label"
                valueField="value"
                placeholder="Select your body size"
                value={selectedBodySize}
                onChange={(item) => setSelectedBodySize(item.value)}
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
        textAlign: 'center',
    },
    description: {
        fontWeight: '600',
        color: '#62656b',
        textAlign: 'center',
        paddingHorizontal: 64,
    },
    dropdown: {
        width: '80%',
        marginTop: 20,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
    },
    nextButton: {
        marginTop: 20,
        width: 250,
    },
});

export default WeightScreen;
