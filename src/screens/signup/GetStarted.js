// src/screens/signup/GetStarted.js
import React from 'react';
import { View, Text, StyleSheet, Image, useWindowDimensions } from 'react-native';
import DefaultButton from '../../components/DefaultButton';

const GetStarted = ({ navigation }) => {
    const { width } = useWindowDimensions();

    return (
    <View style={styles.container}>
        <Image
            source={require('../../../assets/signupScreenImages/SignupImage_02.png')}
            style={[styles.image, {width, resizeMode:'contain'}]}
        />
        <Text style={styles.title}>Let’s Personalize Your Experience.</Text>
        <Text style={styles.description}>
        Answer a few quick questions so we can tailor ClosetShare to your unique style.
        </Text>

        <DefaultButton
            title="Get Started"
            onPress={() => navigation.navigate('Gender')}
            style={styles.getStartedButton}
        />
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
    image: {
        flex: 0.7,
        width: '100%', 
        height: '100%',
        justifyContent:'center',
        aspectRatio: 1,
    },
    title: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 28,
        fontWeight: '800',
        color: '#493d8a',
        marginBottom: 10,
        textAlign:'center',
        paddingHorizontal: 64,
    },
    description: {
        fontWeight:'600',
        color: '#62656b',
        textAlign: 'center',
        paddingHorizontal: 64,
    },
    getStartedButton: {
        marginTop: 70,
        width: '80%',
    },
});

export default GetStarted;

