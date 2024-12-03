import React, { useState } from 'react';
import { View, Text, Image, TextInput, Alert, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';  // Import the hook
import {SafeAreaProvider} from 'react-native-safe-area-context';
import CustomStatusBar from '../components/CustomStatusBar';

import { Dropdown } from 'react-native-element-dropdown';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

//firebase stuff
import { doc, collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { uploadToImgur, deleteImageFromImgur } from '../imgur';
import { getData } from '../utils/storage'; 


const OutfitCreationScreen = () => {
  //navigation stuff
  const navigation = useNavigation(); 

  // variables, save these to the outfit object later on
  const [outfitName, setOutfitName] = useState(null);
  const [outfitDescription, setOutfitDescription] = useState(null);
  const [outfitHeight, setOutfitHeight] = useState(null);
  const [outfitImages, setOutfitImages] = useState([null, null, null]);  //3 for now
  const [outfitCategory, setOutfitCategory] = useState(null);
  const [outfitBodyType, setOutfitBodyType] = useState(null);
  const [outfitSeason, setOutfitSeason] = useState(null);
  const [outfitPieces, setOutfitPieces] = useState([
    { id: 1, title: '', location: '', image: null },
  ]);

  //choices for the 4 drop down menu selections
  const categorySelection = [
    { label: 'Men', value: 'men' },
    { label: 'Women', value: 'women' },
    { label: 'Unisex/Gender Neutral', value: 'unisex' },
  ];
  const bodyTypeSelection = [
    { label: "Curvy", value: "curvy" },
    { label: "Slim", value: "slim" },
    { label: "Athletic", value: "athletic" },
    { label: "Petite", value: "petite" },
    { label: "Plus-size", value: "plus-size" },
  ];
  const seasonSelection = [
    { label: 'Spring', value: 'spring' },
    { label: 'Summer', value: 'summer' },
    { label: 'Fall', value: 'fall' },
    { label: 'Winter', value: 'winter' },
    { label: 'Year-round', value: 'year-round' },
  ];
  const heightSelection = [
    { label: '155-159 cm', value: '155-159' },
    { label: '160-164 cm', value: '160-164' },
    { label: '165-169 cm', value: '165-169' },
    { label: '170-174 cm', value: '170-174' },
    { label: '175-179 cm', value: '175-179' },
    { label: '180-184 cm', value: '180-184' },
    { label: 'none', value: 'none' },
  ];

  //ask for permission when doing image stuff
  const requestPermissions = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (cameraPermission.status !== 'granted' || mediaPermission.status !== 'granted') {
      alert('give us permmision plzzzzzzz');
      return false;
    }
    return true;
  };

  //function for camera integration
  // Function to handle camera or image library selection
const pickImage = async (uploadOption, imageIndex) => {
  //uploadOption is a boolean to determine (for image picker) wheter the image is being saved as outfit image or piece image
  //0: outfit image
  //1: piece image

  const permissionGranted = await requestPermissions();
  if (!permissionGranted) return;

  // pop up to ask how user want to upload stuff
  Alert.alert(
    'Select Source',
    'Where do you want to upload image from?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Camera',
        onPress: async () => {
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            allowsEditing: true,
            aspect: [4, 3],
          });
          handleImageResult(result, uploadOption, imageIndex);
        },
      },
      {
        text: 'Image Library',
        onPress: async () => {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            allowsEditing: true,
            aspect: [4, 3],
          });
          handleImageResult(result, uploadOption, imageIndex);
        },
      },
    ]
  );
};

// Function to shrink the image from pickimage
const handleImageResult = async (result, uploadOption, imageIndex) => {
  if (!result.canceled) {
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      result.assets[0].uri,
      [{ resize: { width: 1024 } }], // make sure image is not too big, limit the size
      { compress: 0.4, format: ImageManipulator.SaveFormat.JPEG } // same thing here, compress
    );
    
    //for outfit image
    if (uploadOption === 0) {  // If it's an outfit image
      setOutfitImages((prevImages) => {
        const updatedImages = [...prevImages];
        updatedImages[imageIndex] = { uri: manipulatedImage.uri }; 
        return updatedImages;
      });
    } else if (uploadOption === 1) {  // If it's a piece image
      setOutfitPieces((prevOutfitPieces) => {
        const updatedOutfitPieces = [...prevOutfitPieces];
        updatedOutfitPieces[imageIndex] = {
          ...updatedOutfitPieces[imageIndex],  // keep other properties
          image: { uri: manipulatedImage.uri },  // only update the image
        };
        return updatedOutfitPieces;
      });
    }
    
  }
};

  //function to add outfit piece to the array
  const addPiece = () => {
    const newPiece = {
      id: outfitPieces.length + 1,
      title: '',
      location: '',
      image: null,
    };
    setOutfitPieces([...outfitPieces, newPiece]);
  };

  //function to remove outfit piece from the array
  const deletePiece = (id) => {
    const updatedPieces = outfitPieces.filter(piece => piece.id !== id);
    setOutfitPieces(updatedPieces);
  };

  //function that uploads an image to imgur, and returns a uri and delete hash.
  const uploadImageToImgur = async (image) => {
    if (!image?.uri) {
      console.error("No image URI provided");
      return null;
    }
  
    try {
      const imgurResponse = await uploadToImgur(image.uri);
  
      if (imgurResponse && imgurResponse.link && imgurResponse.deleteHash) {
        console.log(`Image uploaded to Imgur: ${imgurResponse.link}`);
        return { imageUrl: imgurResponse.link, deleteHash: imgurResponse.deleteHash };
      } else {
        console.error("Imgur response is missing link or deleteHash", imgurResponse);
        return null;
      }
    } catch (error) {
      console.error("Error uploading image to Imgur:", error);
      return null;
    }
  };

  //run when post button is pressed, 
  //compile the outfit object from user selection and inputs, and send to database
  const postOutfit = async () => {
    try {
      // Retrieve the logged-in user's uid from AsyncStorage
      const user = await getData('user');
      const uid = user?.uid;
      if (!uid) {
        console.error("User is not logged in. UID not found.");
        return;
      }

      // check image
      if (!outfitImages || outfitImages.length === 0 || outfitImages.every(img => img === null)) {
        console.error("No outfit images provided");
        return; // if no images it just ends
      }

      //start processing outfit images (outfitImages)
      const processedOutfitImages = await Promise.all(
        outfitImages.map(async (image) => {
          // Check if the image is null or has no URI
          if (!image || !image.uri) {
            return null; // Skip processing if image is null or invalid
          }
          try {
            const result = await uploadImageToImgur(image);
            return result; // result will be null if upload fails or the image is invalid
          } catch (error) {
            console.error("Error uploading image to Imgur:", error);
            return null;
          }
        })
      );
      //remove all the null pictures in case users left that empty
      const validProcessedOutfitImages = processedOutfitImages.filter((image) => image !== null);

      // Process outfit pieces images
      const processedOutfitPieces = await Promise.all(
        outfitPieces.map(async (piece) => {
          if (!piece.image || !piece.image.uri) {
            return null; // Skip processing if image is null or invalid
          }
          try {
            const imageResult = await uploadImageToImgur(piece.image);
            if (imageResult) {
              return {
                title: piece.title, // Retain the title
                location: piece.location, // Retain the location
                image: imageResult, // Add the image data
              };
            } else {
              return null; // Return null if upload fails
            }
          } catch (error) {
            console.error("Error uploading piece image to Imgur:", error);
            return null;
          }
        })
      );
      

      // Save the outfit data to Firestore with the user's UID yay
      //outfit is the object that will be send to firebase
      const outfit = {
        name: outfitName,
        description: outfitDescription,
        height: outfitHeight,
        category: outfitCategory,
        bodyType: outfitBodyType,
        season: outfitSeason,
        images: validProcessedOutfitImages,
        pieces: processedOutfitPieces,
        creationDate: new Date().toISOString().split('T')[0]
      };

      console.log("outfit uploaded: " + JSON.stringify(outfit));
      
      const userOutfitsRef = collection(doc(db, "users", uid), "outfits");
      await addDoc(userOutfitsRef, outfit);
  
      console.log("Outfit added successfully!");
      navigation.navigate('Home');
      
    } catch (error) {
      console.error("Error during outfit posting: ", error);
    }
  };

  const testtuff = async () => {
  };

  return (
    <SafeAreaProvider style={styles.bigContainer}>
      <CustomStatusBar backgroundColor="white" />
      {/* ----------------------------header------------------------------*/}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
              <Image
              source={require('../../assets/outfitCreationImages/back button.png')}
              style={styles.backButtonImage}
              />
          </Pressable>
          <Text style={styles.h1}>Create Outfit</Text>
        </View>
        <Pressable onPress={postOutfit} style={styles.postButton}>
          <Text style={styles.postButtonText}>Post</Text>
        </Pressable>
      </View>

      {/* ----------------------------outfit Image------------------------------*/}
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.imageView}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScrollContainer}>

            {outfitImages.map((image, index) => (
              <Pressable
                key={index}
                style={styles.imageFrame}
                onPress={() => pickImage(0, index)} // Pass the index to the pickImage function
              >
                {image ? (
                  <Image style={styles.outfitImage} source={{ uri: image.uri }} />
                ) : (
                  <Image style={styles.outfitImage} source={require('../../assets/outfitCreationImages/Add Outfit.png')} />
                )}
              </Pressable>
            ))}

          </ScrollView>
        </View>

        {/* ----------------------------content------------------------------*/}
        <View style={styles.content}>
          {/* --------Outfit Name Field----------*/}
          <View style={styles.inputRow}>
            <Text style={styles.captionText}>Outfit Name</Text>
            <TextInput
              style={styles.inputText}
              placeholder="Pick a name for this outfit......"
              value={outfitName}
              onChangeText={setOutfitName}
            />
          </View>

          {/* --------Description Field----------*/}
          <View style={styles.inputRow}>
            <Text style={styles.captionText}>Description</Text>
            <TextInput
              style={styles.inputText}
              placeholder="Write a Description Here......"
              value={outfitDescription}
              onChangeText={setOutfitDescription}
            />
          </View>

          {/* --------Height + Category Field---------- */}
          <View style={[styles.inputRow, styles.flexRow]}>
            {/* Height Dropdown */}
            <View style={styles.rowItem}>
              <Text style={styles.captionText}>Height</Text>
              <Dropdown
                style={styles.inputText}
                iconColor="#9D4EDD"
                data={heightSelection}
                labelField="label"
                valueField="value"
                value={outfitHeight}
                onChange={(item) => setOutfitHeight(item.value)}
                placeholder="Add Height"
              />
            </View>
            <View style={styles.rowItem}>
              <Text style={styles.captionText}>Category</Text>
              <Dropdown
                style={styles.inputText}
                iconColor="#9D4EDD"
                data={categorySelection}
                labelField="label"
                valueField="value"
                value={outfitCategory}
                onChange={(item) => setOutfitCategory(item.value)}
                placeholder="Add Category"
              />
            </View>
          </View>

          {/* --------Body Type + Outfit Season Field----------*/}
          <View style={[styles.inputRow, styles.flexRow]}>
            <View style={styles.rowItem}>
              <Text style={styles.captionText}>Body Type</Text>
              <Dropdown
                style={styles.inputText}
                iconColor="#9D4EDD"
                data={bodyTypeSelection}
                labelField="label"
                valueField="value"
                value={outfitBodyType}
                onChange={item => setOutfitBodyType(item.value)}
                placeholder="Add Body Type"
              />
            </View>
            <View style={styles.rowItem}>
              <Text style={styles.captionText}>Outfit Season</Text>
              <Dropdown
                style={styles.inputText}
                iconColor="#9D4EDD"
                data={seasonSelection}
                labelField="label"
                valueField="value"
                value={outfitSeason}
                onChange={item => setOutfitSeason(item.value)}
                placeholder="Add Season"
              />
            </View>
          </View>

          {/* ----------------------------outfit pieces------------------------------*/}
          <Text style={styles.captionText}>Piece Title</Text>
          {outfitPieces.map((piece, index) => (
            <View key={piece.id} style={styles.outfitPiece}>

              <Pressable
                key={piece.id-1}
                style={styles.pieceLeft}
                onPress={() => pickImage(1, piece.id-1)} // Pass the index to the pickImage function
              >
                {outfitPieces[piece.id-1].image ? (
                  <Image style={styles.pieceImage} source={{ uri: outfitPieces[piece.id-1].image.uri }} />
                ) : (
                  <Image style={styles.pieceImage} source={require('../../assets/outfitCreationImages/Add Outfit.png')} />
                )}
              </Pressable>

              <View style={styles.pieceRight}>
                <TextInput
                  style={styles.pieceText}
                  placeholder="Piece Title......"
                  value={piece.title}
                  onChangeText={(text) => {
                    const updatedPieces = [...outfitPieces];
                    updatedPieces[index].title = text;
                    setOutfitPieces(updatedPieces);
                  }}
                />
                <TextInput
                  style={styles.pieceText}
                  placeholder="Where did you got it?"
                  value={piece.location}
                  onChangeText={(text) => {
                    const updatedPieces = [...outfitPieces];
                    updatedPieces[index].location = text;
                    setOutfitPieces(updatedPieces);
                  }}
                />
              </View>
              <Pressable style={styles.deletePiece} onPress={() => deletePiece(piece.id)}>
                <Image source={require('../../assets/outfitCreationImages/delete button.png')} />
              </Pressable>
            </View>
          ))}

          <Pressable style={styles.addPiece} onPress={addPiece}>
            <Image style={styles.addPieceImage} source={require('../../assets/outfitCreationImages/Add Outfit Piece Button.png')} />
          </Pressable>

          {/* ----------------------------end of outfit pieces------------------------------*/}
        </View>
        {/* ----------------------------end of content------------------------------*/}
      </ScrollView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  bigContainer: {
    flex: 1,
  },

//-----------------------------header section-----------------------------
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  //left side (arrow + "create outfit")
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  //the post button
  postButton: {
    backgroundColor: '#9D4ECC',
    paddingHorizontal: 15,
    paddingVertical: 5,
    alignContent: 'center',
    justifycontent: 'center',
    borderRadius: 10,
  },
  //the post button text
  postButtonText: {
    color: 'white',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
  },
  // "create outfit" text
  h1: {
    fontSize: 24,
    fontFamily: 'Poppins_500Medium',
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
  inputRow: {
    marginBottom: 20,
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowItem: {
    width: '45%',
  },
  captionText: {
    fontSize: 12,
    fontFamily: 'Nunito_300Light',
    color: '#9D4EDD',
    marginBottom: 10,
  },
  inputText: {
    color: '#666363',
    paddingBottom: 5,
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    borderBottomWidth: 1,
    borderBottomColor: '#666363',
  },
  outfitPiece: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  pieceLeft: {
    width: '35%',
  },
  pieceImage: {
    width: 113,
    height: 94,
  },
  pieceRight: {
    width: '50%',
  },
  deletePiece: {
    width: '10%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieceText: {
    color: '#666363',
    paddingBottom: 5,
    marginBottom: 10,
    fontSize: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#666363',
  },
  addPiece: {
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  addPieceImage: {
    width: '100%',
    resizeMode: 'contain',
  },
  backButton: {
    top: -3,
    zIndex: 10,
  },
  backButtonImage: {
      width: 30,
      height: 30,
  },
});

export default OutfitCreationScreen;