import React, { useEffect, useState } from 'react';
import { View, Text, Image, TextInput, Alert, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {SafeAreaProvider, withSafeAreaInsets} from 'react-native-safe-area-context';
import CustomStatusBar from '../components/CustomStatusBar';
import { saveOutfitID } from '../utils/storage';

import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const DetailedOutfitScreen = ({ route }) => {
    const { outfitId, userId, userName} = route.params; // Destructure the outfitId and userId from route params
    const [outfit, setOutfit] = useState(null);
    
    //navigation stuff
    const navigation = useNavigation(); 

    useEffect(() => {
        const fetchOutfit = async () => {
            if (!outfitId || !userId) {
              console.error("Missing outfitId or userId. Cannot fetch outfit.");
              return;
            }
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
                <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Image style={styles.backButton} source={require('../../assets/outfitCreationImages/back button.png')} />
                </Pressable>
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
                <Text style={styles.h1}>{outfit.name}</Text>
                <View style={styles.usernameRow}>
                  <Image
                    source={require('../../assets/HomeScreenImages/Profile Icon.png')} 
                    style={styles.profileIcon}
                  />
                  <Text style={styles.usernameText}>{userName}</Text>
                </View>
                {/* --------Description Field----------*/}
                <View style={styles.outputRow}>
                  <Text style={styles.captionText}>Description</Text>
                  <Text style={styles.outputText}>{outfit.description}</Text>
                </View>

                {/* --------Other Fields----------*/}
                <View style={[styles.outputRow, styles.flexRow]} >
                  <View style={styles.rowItem}>
                    <Text style={styles.captionText}>Height</Text>
                    <Text style={styles.outputText}>{outfit.height}</Text>
                  </View>
                  <View style={styles.rowItem}>
                    <Text style={styles.captionText}>Category</Text>
                    <Text style={styles.outputText}>{outfit.category}</Text>
                  </View>
                  <View style={styles.rowItem}>
                    <Text style={styles.captionText}>Body Type</Text>
                    <Text style={styles.outputText}>{outfit.bodyType}</Text>
                  </View>
                  <View style={styles.rowItem}>
                    <Text style={styles.captionText}>Outfit Season</Text>
                    <Text style={styles.outputText}>{outfit.season}</Text>
                  </View>
                </View>

            
                {/* ----------------------------Outfit Pieces------------------------------ */}
                <View>
                  <Text style={styles.captionText}>Outfit Pieces</Text>
                  {outfit.pieces.map((piece, index) => (
                    <Pressable
                      key={piece.id || index}
                      style={styles.outfitPiece}
                      onPress={() => {
                        if (piece.location === "Unknown Location" || !piece.location) {
                          Alert.alert("Invalid Location", "This outfit piece does not have a valid location.");
                        } else {
                          saveOutfitID(outfitId); // Save outfitId temporarily
                          navigation.navigate('Navigation', { pieceLocation: piece.location, userId, outfitId });
                        }
                      }}                  
                      
                    >
                      <View style={styles.pieceLeft}>
                        {piece.image?.imageUrl ? (
                          <Image 
                            style={styles.pieceImage} 
                            source={{ uri: piece.image.imageUrl }} 
                          />
                        ) : (
                          <Image 
                            style={styles.pieceImage} 
                            source={require('../../assets/outfitCreationImages/Add Outfit.png')} 
                          />
                        )}
                      </View>
                      <View style={styles.pieceRight}>
                        <Text style={styles.pieceTitle}>{piece.title || "Untitled Piece"}</Text>
                        <Text style={styles.pieceLocation}>From: {piece.location || "Unknown Location"}</Text>
                      </View>
                    </Pressable>
                  ))}
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
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 24,
      },
      backButton: {
        width: 25,
        height: 25,
      },

      //--------------------------add image section (where user add outfit image)-----------------------------
  scrollContainer: {
    backgroundColor: '#F0F0F0',
  },
  imageView: { //View that contains the whole image section
    flexDirection: 'row',
    alignContent: 'center',
  },
  imageScrollContainer: { //for the scrollView that contains all the images
    flexDireciton: 'row',
    alignContent: 'center',
  },
  imageFrame: { //for the pressable that contains the images
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  outfitImage: { // For actual image
    width: 339,
    height: 281,
    resizeMode: 'contain',
  },
  //-----------------------------content section-----------------------------
  content: {
    marginHorizontal: 10,
    marginBottom: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    shadowOffset: { width: 0, height: 0.5 },  
    shadowColor: 'black',  
    shadowOpacity: 0.2,  
    elevation: 2, 
  },
  outputRow: {
    marginBottom: 20,
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: '10%', 
  },
  usernameRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  usernameText: {
    fontFamily: 'Poppins_600SemiBold',
    color: '#9D4EDD',
  },
  captionText: {
    fontSize: 12,
    color: '#9D4EDD',
    fontFamily: 'Nunito_400Regular',
    marginBottom: 5,
  },
  outputText: {
    fontFamily: 'Nunito_400Regular',
    paddingBottom: 5,
    fontSize: 14,
  },
  profileIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
   //-----------------------------outfit pieces-----------------------------
  outfitPiece: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    alignItems: 'center',
    borderRadius: 10,
    shadowOffset: { width: 0, height: 1 },  
    shadowColor: 'black',  
    shadowOpacity: 0.2,  
    elevation: 3, 
  },
  pieceLeft: {
    width: '35%',
  },
  pieceImage: {
    width: 110,
    height: 90,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  pieceRight: {
    width: '60%',
    paddingVertical: 10,
    paddingRight: 20,
  },
  pieceTitle: {
    color: '#9D4EDD',
    fontSize: 16,
    marginBottom: 10,
    fontFamily: 'Nunito_800ExtraBold',
  },
  pieceLocation: {
    paddingBottom: 5,
    fontSize: 14,
    color: '#666363',
  },
});

export default DetailedOutfitScreen;