import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import DefaultButton from '../../components/DefaultButton';

const HeightScreen = ({ navigation, route }) => {
    const [selectedHeight, setSelectedHeight] = useState('');
    const { gender } = route.params;

    const heightRanges = [
        { label: '155-159 cm', value: '155-159' },
        { label: '160-164 cm', value: '160-164' },
        { label: '165-169 cm', value: '165-169' },
        { label: '170-174 cm', value: '170-174' },
        { label: '175-179 cm', value: '175-179' },
        { label: '180-184 cm', value: '180-184' },
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

            <Dropdown
                style={styles.dropdown}
                data={heightRanges}
                labelField="label"
                valueField="value"
                placeholder="Select your height range (cm)"
                value={selectedHeight}
                onChange={(item) => setSelectedHeight(item.value)}
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

export default HeightScreen;
