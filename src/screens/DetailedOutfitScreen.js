import React, { useEffect, useState } from 'react';
import { View, Text, Image, TextInput, Alert, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import CustomStatusBar from '../components/CustomStatusBar';

import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const DetailedOutfitScreen = ({ route }) => {
    const { outfitId, userId } = route.params; // Destructure the outfitId and userId from route params
    const [outfit, setOutfit] = useState(null);
    
    //navigation stuff
    const navigation = useNavigation(); 

    useEffect(() => {
        const fetchOutfit = async () => {
            try {
              //the query: find the exact outfit in the firestore database using the passed user id and outfit id
              const outfitRef = doc(db, 'users', userId, 'outfits', outfitId);
          
              // Fetch the outfit document
              const outfitDoc = await getDoc(outfitRef);
          
              if (outfitDoc.exists()) {
                console.log("Outfit found:", outfitDoc.data()); // Log the outfit data
                setOutfit(outfitDoc.data());
              } else {
                console.log("Outfit not found!");
                return null;
              }
            } catch (error) {
              console.error("Error fetching outfit:", error);
              return null;
            }
          };

        fetchOutfit();
    }, [outfitId, userId]);

    if (!outfit) {
        return (
            <View style={styles.container}>
                <Text>Outfit not found</Text>
            </View>
        );
    }

    return (
        <SafeAreaProvider style={styles.bigContainer}>
            <CustomStatusBar backgroundColor="white" />

            {/* ----------------------------header------------------------------*/}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                <Pressable onPress={() => navigation.navigate('Home')}>
                    <Image source={require('../../assets/outfitCreationImages/back button.png')} />
                </Pressable>
                <Text style={styles.h1}>{outfit.name}</Text>
                </View>
            </View>

            <Text style={styles.outfitName}>{outfit.description}</Text>
            <Text style={styles.outfitName}>{outfit.bodyType}</Text>
            <Text style={styles.outfitName}>{outfit.category}</Text>
            <Text style={styles.outfitName}>{outfit.height}</Text>
            <Text style={styles.outfitName}>{outfit.season}</Text>
        </SafeAreaProvider>
        
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#FFFFFF',
        paddingTop: 20,
        paddingBottom: 20,
        paddingHorizontal: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      //left side (arrow + "create outfit")
      headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      // outfit name at the top
      h1: {
        fontSize: 24,
        color: '#666363',
      },
});

export default DetailedOutfitScreen;