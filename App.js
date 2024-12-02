import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts, Poppins_700Bold, Poppins_600SemiBold, Poppins_500Medium } from '@expo-google-fonts/poppins';
import { Nunito_400Regular, Nunito_800ExtraBold, Nunito_300Light } from '@expo-google-fonts/nunito';
import AppLoading from 'expo-app-loading';

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
import DetailedOutfitScreen from './src/screens/DetailedOutfitScreen';
import NavigationScreen from './src/screens/Navigation'; // Import the new Navigation screen
import ProfileScreen from './src/screens/Profile';


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

  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_600SemiBold,
    Poppins_500Medium,
    Nunito_400Regular,
    Nunito_800ExtraBold,
    Nunito_300Light,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }
  

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn ? (
          <>
            {/* <Stack.Screen
              name="Home"
              options={{ headerShown: false }}
            >
              {(props) => <HomeScreen {...props} onLoginStateChange={checkLoginStatus} />}
            </Stack.Screen> */}
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="OutfitCreation"
              component={OutfitCreationScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="DetailedOutfit"
              component={DetailedOutfitScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Navigation"
              component={NavigationScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Profile"
              options={{ headerShown: false }}
            >
              {(props) => <ProfileScreen {...props} onLoginStateChange={checkLoginStatus} />}
            </Stack.Screen>
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
