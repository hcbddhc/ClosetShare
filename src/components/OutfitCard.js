import React, { useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';

const OutfitCard = ({ outfits }) => {
    const [likedStatus, setLikedStatus] = useState(0);

    //function for when the user pressed on the card
    const cardPress = () => {
        console.log("outfit card pressed");
    }

    //function for when the user pressed on the like icon
    const likePress = (outfitID) => {
        if(likedStatus === 0){
            setLikedStatus(1);
        }else{
            setLikedStatus(0);
        }
        console.log("like icon pressed! outfitID: " + outfitID);
    }

    return (
      <Pressable onPress= {cardPress} style={styles.outfitCard}>
        <Image source={{ uri: outfits.image }} style={styles.outfitImage} />
        <View style={styles.outfitContent}>
          <Text style={styles.outfitName}>{outfits.outfitName}</Text>
          <Text style={styles.outfitUserName}>{outfits.username}</Text>
          <View style={styles.outfitCardBottom}>
            <Text style={styles.outfitDate}>{outfits.creationDate}</Text>
            <Pressable
                style={styles.outfitLikeButton}
                onPress={(event) => {
                event.stopPropagation(); // Prevent parent Pressable from being triggered
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
        height: 270,
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
        fontSize: 14,
        fontWeight: 'bold',
      },
      outfitUserName: {
        color: '#9D4EDD',
        marginBottom: 20,
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
      },
});

export default OutfitCard;

