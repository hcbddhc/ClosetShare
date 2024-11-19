// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import OnboardingScreen from './src/onboarding/OnboardingScreen';
import OutfitCreationScreen from './src/screens/OutfitCreationScreen';


// Import signup screens
import GetStarted from './src/screens/signup/GetStarted';
import HeightScreen from './src/screens/signup/HeightScreen';
import WeightScreen from './src/screens/signup/WeightScreen';
import SignupScreen from './src/screens/signup/SignupScreen';
import GenderScreen from './src/screens/signup/GenderScreen';
import LocationPermissionScreen from './src/screens/signup/LocationPermissionScreen';
import SetLocationScreen from './src/screens/signup/SetLocationScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboarding">
        <Stack.Screen
          name="Onboarding"
          options={{ headerShown: false }}
          component={OnboardingScreen}
        />
        <Stack.Screen
          name="Login"
          options={{ headerShown: false }}
          component={LoginScreen}
        />
        {/* Signup Flow Screens */}
        <Stack.Screen
          name="GetStarted"
          options={{ headerShown: false }}
          component={GetStarted}
        />
        <Stack.Screen
          name="Gender"
          options={{ headerShown: false }}
          component={GenderScreen}
        />
        <Stack.Screen
          name="Height"
          options={{ headerShown: false }}
          component={HeightScreen}
        />
        <Stack.Screen
          name="Weight"
          options={{ headerShown: false }}
          component={WeightScreen}
        />
        <Stack.Screen
          name="LocationPermission"
          options={{ headerShown: false }}
          component={LocationPermissionScreen}
        />
        <Stack.Screen
          name="SetLocation"
          options={{ headerShown: false }}
          component={SetLocationScreen}
        />
        <Stack.Screen
          name="Signup"
          options={{ headerShown: false }}
          component={SignupScreen}
        />
        <Stack.Screen
          name="Home"
          options={{ headerShown: false }}
          component={HomeScreen}
        />
         <Stack.Screen
          name="OutfitCreation"
          options={{ headerShown: false }}
          component={OutfitCreationScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
