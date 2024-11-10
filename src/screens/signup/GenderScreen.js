// src/screens/signup/GenderScreen.js
import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import DefaultButton from '../../components/DefaultButton';

const GenderScreen = ({ navigation }) => {

    const handleGenderSelect = (gender) => {
        navigation.navigate('Height', { gender });
    };

    return (
        <View style={styles.container}>
        <Image
            source={require('../../../assets/signupScreenImages/SignupImage_03.png')} 
            style={styles.backgroundImage}
        />

            <View style={styles.content}>
                <Text style={styles.title}>What’s your gender?</Text>
                <Text style={styles.description}>
                    This will help us tailor outfit recommendations to your style.
                </Text>

            <View style={styles.buttonContainer}>      
                <DefaultButton title="Male" onPress={() => handleGenderSelect('Male')} style={styles.customButton} />
                <DefaultButton title="Female" onPress={() => handleGenderSelect('Female')} style={styles.customButton} />
                <DefaultButton title="Non-binary" onPress={() => handleGenderSelect('Non-binary')} style={styles.customButton} />
                <DefaultButton title="Prefer not to say" onPress={() => handleGenderSelect('Prefer not to say')} style={styles.customButton} />
            </View>
        </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    backgroundImage: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '50%', // Adjust this to control how much of the screen the image covers
        resizeMode: 'contain',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        transform: [{ translateY: -(Dimensions.get('window').height * 0.15) }], // Move content up by 15% of screen height
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
        marginBottom: 20,
    },
    customButton: {
        width: 250,  
        marginVertical: 15,
    },
    buttonContainer: {
        marginVertical: 15,
    }
});

export default GenderScreen;




