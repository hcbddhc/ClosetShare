import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
import LoginScreen from './src/LoginScreen';  
import SignupScreen from './src/SignupScreen';  // Import SignupScreen
import HomeScreen from './src/HomeScreen';    
import OnboardingScreen from './src/OnboardingFolder/OnboardingScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboarding">
        <Stack.Screen name="Onboarding" options={{ headerShown: false }} component={OnboardingScreen} />
        <Stack.Screen name="Login" options={{ headerShown: false }} component={LoginScreen} />
        <Stack.Screen name="Signup" options={{ headerShown: false }} component={SignupScreen} /> 
        <Stack.Screen name="Home" options={{ headerShown: false }} component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


