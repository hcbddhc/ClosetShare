import React, { useEffect, useState } from 'react';
import { View, Text, Image, TextInput, Alert, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {SafeAreaProvider, withSafeAreaInsets} from 'react-native-safe-area-context';
import CustomStatusBar from '../components/CustomStatusBar';
import { saveOutfitID } from '../utils/storage';

import { collection, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const DetailedOutfitScreen = ({ route }) => {
    const { outfitId, userId, userName} = route.params; 
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
              const outfitDoc = await getDoc(outfitRef);
          
              if (outfitDoc.exists()) {
                console.log("Outfit found:", outfitDoc.data()); 
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

    //function that handles deletion
    const deleteOutfit = async () => {
      try {
        const outfitRef = doc(db, 'users', userId, 'outfits', outfitId);
        await deleteDoc(outfitRef);
    
        // Delete outfit images from Imgur
        if (outfit.images && Array.isArray(outfit.images)) {
          for (const image of outfit.images) {
            if (image?.deletehash) {
              await deleteImageFromImgur(image.deletehash); 
            }
          }
        }
    
        // Delete piece images from Imgur
        if (outfit.pieces && Array.isArray(outfit.pieces)) {
          for (const piece of outfit.pieces) {
            if (piece?.image?.deletehash) { 
              await deleteImageFromImgur(piece.image.deletehash); 
            }
          }
        }
    
        Alert.alert("Success", "Outfit deleted successfully!");
        navigation.goBack(); 
      } catch (error) {
        console.error("Error deleting outfit:", error);
        Alert.alert("Error", "Failed to delete the outfit. Please try again.");
      }
  };

    return (
        <SafeAreaProvider style={styles.bigContainer}>
            <CustomStatusBar backgroundColor="white" />

            {/* ----------------------------header------------------------------*/}
            <View style={styles.header}>
              <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                <Image
                source={require('../../assets/outfitCreationImages/back button.png')}
                style={styles.backButtonImage}
                />
              </Pressable>
              <Pressable onPress={deleteOutfit} style={styles.backButton}>
                <Image
                source={require('../../assets/OutfitDetailScreenImages/trash can.png')}
                style={styles.trashcan}
                />
              </Pressable>
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
                    key={piece?.id || `piece-${index}`} 
                    style={styles.outfitPiece}
                    onPress={() => {
                      if (!piece || !piece.location || piece.location === "Unknown Location") {
                        Alert.alert("Invalid Location", "This outfit piece does not have a valid location.");
                      } else {
                        saveOutfitID(outfitId); 
                        navigation.navigate('Navigation', { pieceLocation: piece.location, userId, outfitId });
                      }
                    }}
                  >
                    <View style={styles.pieceLeft}>
                      {piece?.image?.imageUrl ? (
                        <Image
                          style={styles.pieceImage}
                          source={{ uri: piece.image.imageUrl }}
                        />
                      ) : (
                        <Text style={styles.noImageText}>No image provided</Text>
                      )}
                    </View>
                    <View style={styles.pieceRight}>
                      <View>
                        <Text style={styles.pieceTitle}>{piece?.title || "Untitled Piece"}</Text>
                        <Text style={styles.pieceLocation}>From: {piece?.location || "Unknown Location"}</Text>
                      </View>
                      <Image
                        source={require('../../assets/OutfitDetailScreenImages/map icon.png')}
                        style={styles.mapIcon}
                      />
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
      // outfit name at the top
      h1: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 24,
      },
      backButton: {
        left: -10,
        zIndex: 10,
      },
      backButtonImage: {
        width: 30,
        height: 30,
      },
      trashcan: {
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
    height: 330,
    marginBottom: 10,
  },
  imageScrollContainer: { //for the scrollView that contains all the images
    height: '100%',
    flexDireciton: 'row',
    marginLeft: 10,
    marginRight: 10,
  },
  imageFrame: { //for the pressable that contains the images
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outfitImage: { // For actual image
    height: '100%',
    width: 360,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '62%',
    paddingRight: 20,
    paddingVertical: 10,
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
  mapIcon: {
    width: 25,
    height: 25,
  },
  noImageText: {
    fontSize: 12,
    color: '#9D4EDD',
    fontFamily: 'Nunito_400Regular',
    paddingLeft: 10,
  }
});

export default DetailedOutfitScreen;