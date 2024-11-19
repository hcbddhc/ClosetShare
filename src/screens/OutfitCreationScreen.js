import React, { useState } from 'react';
import { View, Text, Image, TextInput, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';  // Import the hook

import { Dropdown } from 'react-native-element-dropdown';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

//firebase stuff
import { doc, collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { uploadToImgur, deleteImageFromImgur } from '../imgur';


const OutfitCreationScreen = () => {
  const navigation = useNavigation();  // Use the hook to get the navigation object

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

  const requestPermissions = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (cameraPermission.status !== 'granted' || mediaPermission.status !== 'granted') {
      alert('Permission to access camera and gallery is required!');
      return false;
    }
    return true;
  };

  //function for camera integration
  const pickImage = async (imageIndex) => {
    const permissionGranted = await requestPermissions();
    if (!permissionGranted) return;
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 1024 } }], // Resize to whatever you need
        { compress: 0.4, format: ImageManipulator.SaveFormat.JPEG } // 40% quality
      );

      // Update the state with the manipulated image as a Blob (instead of URI)
      setOutfitImages((prevImages) => {
        const updatedImages = [...prevImages];
        updatedImages[imageIndex] = { uri: manipulatedImage.uri}; //stores uri
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
    console.log(outfitImages[0]?.uri);  // Ensure there are images before proceeding
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
    if (!outfitImages || outfitImages.length === 0 || outfitImages.every(img => img === null)) {
      console.error("No outfit images provided");
      return; // Exit early if no images
    }

    try {
      // Map through the outfit images and upload them to Imgur
      const imgurData = await Promise.all(
        outfitImages.map(async (image) => {
          if (!image?.uri) return null; // Skip if no image URI

          try {
            // Upload image to Imgur and get the response with both link and deleteHash
            const imgurResponse = await uploadToImgur(image.uri);

            // Check if the response contains both link and deleteHash
            if (imgurResponse && imgurResponse.link && imgurResponse.deleteHash) {
              const imgurLink = imgurResponse.link;
              const deleteHash = imgurResponse.deleteHash;

              console.log(`Image uploaded to Imgur: ${imgurLink}`);
              return { imageUrl: imgurLink, deleteHash };  // Store image URL and delete hash
            } else {
              console.error("Imgur response is missing link or deleteHash", imgurResponse);
              return null;  // Return null if response is invalid
            }
          } catch (error) {
            console.error('Error uploading image to Imgur:', error);
            return null;  // Return null if upload fails
          }
        })
      );

      // Filter out any failed uploads (null values)
      outfit.images = imgurData.filter((data) => data !== null);

      if (outfit.images.length === 0) {
        console.error("No images uploaded to Imgur.");
        return;  // Exit if no images were successfully uploaded
      }

      // Save the outfit data to Firestore with image links and delete hashes
      const userOutfitsRef = collection(doc(db, "users", uid), "outfits");
      await addDoc(userOutfitsRef, outfit);
      console.log("Outfit added successfully!");
      navigation.navigate('Home');
    } catch (error) {
      console.error("Error during outfit posting: ", error);
    }
  };

  const testtuff = async () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.bigContainer}>
      {/* ----------------------------header------------------------------*/}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => navigation.navigate('Home')}>
            <Image source={require('../../assets/outfitCreationImages/back button.png')} />
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
            <View key={piece.id} style={styles.outfitPiece}>

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
    </View>
  );
};

const styles = StyleSheet.create({
  bigContainer: {
    flex: 1,
  },
  scrollContainer: {
    backgroundColor: '#F0F0F0',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingBottom: 25,
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postButton: {
    backgroundColor: '#9D4ECC',
    paddingHorizontal: 15,
    paddingVertical: 5,
    alignContent: 'center',
    justifycontent: 'center',
    borderRadius: 10,
  },
  postButtonText: {
    color: 'white',
    fontSize: 18,
  },
  h1: {
    fontSize: 24,
    color: '#666363',
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
    paddingHorizontal: '2%',
  },
  imageFrame: { //for the pressable that contains the images
    marginHorizontal: 10,
    width: 339,
    height: 281,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outfitImage: { // For actual image
    width: 339,
    height: 281,
  },
  content: {
    marginHorizontal: 30,
    paddingBottom: 50,
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
  addPiece: {
    width: "83%",
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