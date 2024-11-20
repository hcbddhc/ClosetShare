import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getData } from './src/utils/storage';
import LoginScreen from './src/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import OnboardingScreen from './src/onboarding/OnboardingScreen';
import GetStarted from './src/screens/signup/GetStarted';
import GenderScreen from './src/screens/signup/GenderScreen';
import HeightScreen from './src/screens/signup/HeightScreen';
import WeightScreen from './src/screens/signup/WeightScreen';
import LocationPermissionScreen from './src/screens/signup/LocationPermissionScreen';
import SetLocationScreen from './src/screens/signup/SetLocationScreen';
import SignupScreen from './src/screens/signup/SignupScreen';
import OutfitCreationScreen from './src/screens/OutfitCreationScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkLoginStatus = async () => {
    const user = await getData('user');
    setIsLoggedIn(!!user);
  };

  useEffect(() => {
    checkLoginStatus(); // Check login status on app load
  }, []);

  useEffect(() => {
    console.log('isLoggedIn state:', isLoggedIn);
  }, [isLoggedIn]);
  

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn ? (
          <>
            <Stack.Screen
              name="Home"
              options={{ headerShown: false }}
            >
              {(props) => <HomeScreen {...props} onLoginStateChange={checkLoginStatus} />}
            </Stack.Screen>
            <Stack.Screen
              name="OutfitCreation"
              component={OutfitCreationScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Onboarding"
              component={OnboardingScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              options={{ headerShown: false }}
            >
              {(props) => <LoginScreen {...props} onLoginStateChange={checkLoginStatus} />}
            </Stack.Screen>
            <Stack.Screen
              name="GetStarted"
              component={GetStarted}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Gender"
              component={GenderScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Height"
              component={HeightScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Weight"
              component={WeightScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="LocationPermission"
              component={LocationPermissionScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SetLocation"
              component={SetLocationScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Signup"
              options={{ headerShown: false }}>{(props) => <SignupScreen {...props} onLoginStateChange={checkLoginStatus} />}</Stack.Screen>
            
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
