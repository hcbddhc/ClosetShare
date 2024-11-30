import React, { useState, useEffect } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

//firebase stuff
import { doc, collection, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { getData } from '../utils/storage'; 

const OutfitCard = ({ outfits }) => {
    //navigation stuff
  const navigation = useNavigation(); 

    const [likedStatus, setLikedStatus] = useState(0);

    useEffect(() => {
        const fetchFavoriteStatus = async () => {
            try {
                // Retrieve the logged-in user's uid from AsyncStorage
                const user = await AsyncStorage.getItem('user');
                const uid = JSON.parse(user)?.uid;
                if (!uid) {
                    console.error("User not logged in bye bye");
                    return;
                }

                // Reference to the user's Firestore document
                const userDocRef = doc(db, "users", uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const favoriteOutfits = userDoc.data().favoriteOutfits || [];
                    setLikedStatus(favoriteOutfits.includes(outfits.id) ? 1 : 0);
                }
            } catch (error) {
                console.error("Error fetching favorite status: ", error);
            }
        };

        fetchFavoriteStatus();
    }, [outfits.id]);

     //function for when the user presses on the card
     const cardPress = (outfitID) => {
        console.log("outfit card pressed", outfitID.id, 'by ', outfitID.userID);
        // Pass both the outfit ID and the user ID to the next screen
        navigation.navigate('DetailedOutfit', {
            outfitId: outfitID.id,
            userId: outfitID.userID,
            userName: outfits.username
        });
    };

    //function for when the user pressed on the like icon
    const likePress = async (outfitID) => {
        try {
            // Retrieve the logged-in user's uid from AsyncStorage
            const user = await getData('user');
            const uid = user?.uid;

            if (!uid) {
                console.error("User is not logged in. UID not found.");
                return;
              }
            
            //creating a reference to the current logged in user's document in firebase
            const userDocRef = doc(db, "users", uid);

            //handle actual press activity
            if (likedStatus === 0) {
                await updateDoc(userDocRef, {
                    favoriteOutfits: arrayUnion(outfitID),
                });
                setLikedStatus(1);
                console.log("outfit " + outfitID + "saved to user " + uid + "'s favorite list");
            } else {
                await updateDoc(userDocRef, {
                    favoriteOutfits: arrayRemove(outfitID),
                });
                setLikedStatus(0);
                console.log("outfit " + outfitID + "removed from user " + uid + "'s favorite list");
            }
        }catch (error) {
            console.error("Error during liking or unliking outfits: ", error);
          }

    }

    return (
        <Pressable
            style={styles.outfitCard}
            onPress={(event) => {
                event.stopPropagation(); 
                cardPress(outfits); // Pass the full outfit object instead of just the ID
            }}
         >
        <Image source={{ uri: outfits.image }} style={styles.outfitImage} />
        <View style={styles.outfitContent}>
          <Text style={styles.outfitName}>{outfits.outfitName}</Text>
          <Text style={styles.outfitUserName}>{outfits.username}</Text>
          <View style={styles.outfitCardBottom}>
            <Text style={styles.outfitDate}>{outfits.creationDate}</Text>
            <Pressable
                style={styles.outfitLikeButton}
                onPress={(event) => {
                event.stopPropagation(); 
                likePress(outfits.id);
                }}
            >
                <Image
                    style={styles.outfitLikeButtonImage}
                    source={
                        likedStatus === 0
                        ? require('../../assets/HomeScreenImages/Like Icon(unpressed).png')
                        : require('../../assets/HomeScreenImages/Like Icon(Pressed).png')
                    }
                />
            </Pressable>
          </View>
        </View>
      </Pressable>
    );
  };

const styles = StyleSheet.create({
    outfitCard: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        width: '48%', // Adjust the width to fit two items per row (slightly less than half the screen width)
        marginBottom: 15,
        shadowOffset: { width: 0, height: 1 },  
        shadowColor: 'black',  
        shadowOpacity: 0.2,  
        elevation: 3, 
      },
      outfitImage: {
        width: '100%',
        height: 172,
        borderTopLeftRadius: 8,  // Apply radius to the top-left corner
        borderTopRightRadius: 8, // Apply radius to the top-right corner
      },
      outfitContent: {
        flex: 1,
        padding: 10,
      },
      outfitName: {
        fontSize: 16,
        fontFamily: 'Nunito_800ExtraBold',
      },
      outfitUserName: {
        color: '#9D4EDD',
        marginBottom: 20,
        fontFamily: 'Nunito_300Light',
      },
      outfitCardBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      outfitLikeButton: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
      },
      outfitLikeButtonImage: {
        resizeMode: 'contain',
        width: 25,
        marginBottom: 5,
      },
      outfitDate: {
        color: '#666363',
        fontFamily: 'Nunito_300Light',
      },
});

export default OutfitCard;

