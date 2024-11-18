import React, { useState} from 'react';
import { View, Text, Image, TextInput, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

//firebase stuff
import { doc, collection, addDoc } from 'firebase/firestore';
import { db, storage } from '../firebaseConfig'; 
import {ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as FileSystem from 'expo-file-system';


const OutfitCreationScreen = () => {
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

  //choices for the 3 drop down menu selections
  const categorySelection = [
    { label: 'Men', value: 'men' },
    { label: 'Women', value: 'women' },
    { label: 'Unisex/Gender Neutral', value: 'unisex'},
  ];
  const bodyTypeSelection = [
    { label: 'Men', value: 'men' },
    { label: 'Women', value: 'women' },
    { label: 'Unisex/Gender Neutral', value: 'unisex'},
  ];
  const seasonSelection = [
    { label: 'Men', value: 'men' },
    { label: 'Women', value: 'women' },
    { label: 'Unisex/Gender Neutral', value: 'unisex'},
  ];

  //function for camera integration
  const pickImage = async (imageIndex) => {
    const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
  
    if (!mediaPermission.granted || !cameraPermission.granted) {
      alert("Permission to access the camera roll is required!");
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 1024 } }], // Resize to whatever you need
        { compress: 0.4, format: ImageManipulator.SaveFormat.JPEG } // 40% quality
      );
  
      // Fetch the image file directly and convert to Blob
      const response = await fetch(manipulatedImage.uri);
      const blob = await response.blob();
  
      // Update the state with the manipulated image as a Blob (instead of URI)
      setOutfitImages((prevImages) => {
        const updatedImages = [...prevImages];
        updatedImages[imageIndex] = { uri: manipulatedImage.uri, blob }; // Store both URI and Blob for later use
        return updatedImages;
      });
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

  //run when post button is pressed, 
  //compile the outfit object from user selection and inputs, and send to database
  const postOutfit = async () => {
  const uid = 'qqFTdco7K4Ofob5i0wJaBr5cEoQ2'; // TEMPORARY, change to current user UID later

  const outfit = {
    name: outfitName,
    description: outfitDescription,
    height: outfitHeight,
    category: outfitCategory,
    bodyType: outfitBodyType,
    season: outfitSeason,
    pieces: outfitPieces,
  };

  // Ensure valid outfitImages
  if (!outfitImages || outfitImages.length === 0) {
    console.error("No outfit images provided");
    return; // Exit early if no images
  }

  try {
    const imageUrls = await Promise.all(
      outfitImages.map(async (image, index) => {
        if (!image?.blob) return null; // Skip if no image blob

        // Generate a unique name for the image
        const uniqueName = `${Date.now()}_${Math.floor(Math.random() * 1000)}_${index}.jpg`;
        const path = `users/${uid}/outfits/${uniqueName}`;
        const imageRef = ref(storage, path);

        try {
          // Upload the Blob to Firebase Storage
          await uploadBytes(imageRef, image.blob);
  
          // Get the download URL
          const url = await getDownloadURL(imageRef);
          console.log(`Image ${index} uploaded: ${url}`);
          return url;
        } catch (error) {
          // Detailed error logging
          console.error(`Error uploading image ${index}: `, error);
  
          if (error.code) {
            console.log('Error code:', error.code); // Firebase-specific error code
          }
          if (error.message) {
            console.log('Error message:', error.message); // The error message from Firebase
          }
          if (error.details) {
            console.log('Error details:', error.details); // Additional details, if available
          }
  
          return null; // Return null in case of an error
        }
      })
    );

    // Filter out null values (failed uploads) and add the image URLs to the outfit data
    outfit.images = imageUrls.filter((url) => url !== null);

    // Save the outfit data to Firestore
    const userOutfitsRef = collection(doc(db, "users", uid), "outfits");
    await addDoc(userOutfitsRef, outfit);
    console.log("Outfit added successfully!");
  } catch (error) {
    console.error("Error during outfit posting: ", error);
  }
};

  return (
    <ScrollView style={styles.container}>

{/* ----------------------------header------------------------------*/}
      <View style={styles.header}>
        <Pressable>
          <Image source={require('../../assets/outfitCreationImages/back button.png')}/>
        </Pressable>
        <Text style={styles.h1}>Create Outfit</Text>
        <Pressable onPress = {postOutfit} style={styles.postButton}>
          <Text style={styles.postButtonText}>Post</Text>
        </Pressable>
      </View>

{/* ----------------------------outfit Image------------------------------*/}
      <View style={styles.imageView}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScrollContainer}>

        {outfitImages.map((image, index) => (
          <Pressable
            key={index}
            style={styles.imageFrame}
            onPress={() => pickImage(index)} // Pass the index to the pickImage function
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

        {/* --------Height + Category Field----------*/}
        <View style={[styles.inputRow, styles.flexRow]} >
          <View style={styles.rowItem}>
            <Text style={styles.captionText}>Height</Text>
            <TextInput
              style={styles.inputText}
              placeholder="Add Height......"
              value={outfitHeight} 
              onChangeText={setOutfitHeight} 
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
              onChange={item => setOutfitCategory(item.value)}
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
          <View key={outfitPieces.id} style={styles.outfitPiece}>

            <Pressable style={styles.pieceLeft}>
              <Image
                style={styles.pieceImage}
                source={
                  piece.image
                    ? { uri: piece.image } 
                    : require('../../assets/outfitCreationImages/outfit piece upload.png') 
                }
              />
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
              <Image source={require('../../assets/outfitCreationImages/delete button.png')}/>
            </Pressable>
          </View>
        ))}

        <Pressable style={styles.addPiece} onPress={addPiece}>
          <Image source={require('../../assets/outfitCreationImages/Add Outfit Piece Button.png')}/>
        </Pressable>

        {/* ----------------------------end of outfit pieces------------------------------*/}
      </View>
      {/* ----------------------------end of content------------------------------*/}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#F0F0F0',
    },
    header: {
        backgroundColor: '#FFFFFF',
        paddingTop: 56,
        paddingBottom: 10,
        paddingLeft: 22,
        flexDirection: 'row',
      },
    h1: {
      fontSize: 24,
    },
    imageView: { //View that contains the whole image section
      flexDirection: 'row',
      alignContent: 'center',
      marginBottom: 20,
    },  
    imageScrollContainer: { //for the scrollView that contains all the images
      flexDireciton: 'row',
      alignContent: 'center',
    },
    imageFrame: { //for the pressable that contains the images
      marginHorizontal: 10,
      width: 339, 
      height: 281,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1, //for testing, remove later
      borderColor: 'gray',
    },
    outfitImage: { // For actual image
      width: 339, 
      height: 281, 
    },
    postButton: {
      backgroundColor: '#9D4ECC',
      paddingHorizontal: 10,
      paddingVertical: 5,
      alignContent: 'center',
      justifycontent: 'center',
    },
    postButtonText: {
      color: 'white',
      fontSize: 20,
    },
    content: {
      marginHorizontal: 30,
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
      color: '#9D4EDD',
      marginBottom: 10,
    },
    inputText: {
      color: '#666363',
      paddingBottom: 5,
      fontSize: 14,
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
      width: '100%',
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
});

export default OutfitCreationScreen;