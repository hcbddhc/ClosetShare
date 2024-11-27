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

            {/* ----------------------------ScrollView for images------------------------------*/}
            <ScrollView style={styles.scrollContainer}>
              <View style={styles.imageView}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScrollContainer}>
                  {outfit.images && outfit.images.length > 0 && outfit.images.map((image, index) => (
                      <View key={index} style={styles.imageFrame}>
                        <Image style={styles.outfitImage} source={{ uri: image.imageUrl }} />
                      </View>
                  ))}
                  </ScrollView>
              </View>

              {/* ----------------------------content------------------------------*/}
              <View style={styles.content}>
                {/* --------Description Field----------*/}
                <View style={styles.outputRow}>
                  <Text style={styles.captionText}>Description</Text>
                  <Text style={styles.outputText}>{outfit.description}</Text>
                </View>

                {/* --------Height + Category Field----------*/}
                <View style={[styles.outputRow, styles.flexRow]} >
                  <View style={styles.rowItem}>
                    <Text style={styles.captionText}>Height</Text>
                    <Text style={styles.outputText}>{outfit.height}</Text>
                  </View>
                  <View style={styles.rowItem}>
                    <Text style={styles.captionText}>Category</Text>
                    <Text style={styles.outputText}>{outfit.category}</Text>
                  </View>
                </View>

                {/* --------Body Type + Outfit Season Field----------*/}
                <View style={[styles.outputRow, styles.flexRow]}>
                  <View style={styles.rowItem}>
                    <Text style={styles.captionText}>Body Type</Text>
                    <Text style={styles.outputText}>{outfit.bodyType}</Text>
                  </View>
                  <View style={styles.rowItem}>
                    <Text style={styles.captionText}>Outfit Season</Text>
                    <Text style={styles.outputText}>{outfit.season}</Text>
                  </View>
                </View>

                {/* ----------------------------outfit pieces------------------------------*/}
                <View style={styles.imageView}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScrollContainer}>
                  {outfit.pieces && outfit.pieces.length > 0 && outfit.pieces.map((piece, pieceIndex) => (
                    piece.image && piece.image.length > 0 && piece.image.map((image, index) => (
                      <View key={`${pieceIndex}-${index}`} style={styles.imageFrame}>
                        <Image style={styles.outfitImage} source={{ uri: image.imageUrl }} />
                      </View>
                    ))
                  ))}
                </ScrollView>
                </View>

              </View>

            </ScrollView>
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

      //--------------------------add image section (where user add outfit image)-----------------------------
  scrollContainer: {
    backgroundColor: '#F0F0F0',
  },
  imageView: { //View that contains the whole image section
    flexDirection: 'row',
    alignContent: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  imageScrollContainer: { //for the scrollView that contains all the images
    flexDireciton: 'row',
    alignContent: 'center',
  },
  imageFrame: { //for the pressable that contains the images
    width: 339,
    height: 281,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  outfitImage: { // For actual image
    width: 339,
    height: 281,
    resizeMode: 'contain',
    
  },
  //-----------------------------content section-----------------------------
  content: {
    marginHorizontal: 22,
    marginBottom: 20,
  },
  outputRow: {
    marginBottom: 20,
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  captionText: {
    fontSize: 12,
    color: '#9D4EDD',
    marginBottom: 10,
  },
  outputText: {
    color: '#666363',
    paddingBottom: 5,
    fontSize: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#666363',
  },
});

export default DetailedOutfitScreen;