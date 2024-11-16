import React, { useState} from 'react';
import { View, Text, Image, TextInput, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';



const OutfitCreationScreen = () => {

  const [selectedCategory, setSelectedCategory] = useState(null);
  const categorySelection = [
    { label: 'Men', value: 'men' },
    { label: 'Women', value: 'women' },
    { label: 'Unisex/Gender Neutral', value: 'unisex'},
  ];

  const [selectedBodyType, setSelectedBodyType] = useState(null);
  const bodyTypeSelection = [
    { label: 'Men', value: 'men' },
    { label: 'Women', value: 'women' },
    { label: 'Unisex/Gender Neutral', value: 'unisex'},
  ];

  const [selectedSeason, setSelectedSeason] = useState(null);
  const seasonSelection = [
    { label: 'Men', value: 'men' },
    { label: 'Women', value: 'women' },
    { label: 'Unisex/Gender Neutral', value: 'unisex'},
  ];

  const [pieces, setPieces] = useState([
    { id: 1, title: '', location: '', image: null }, 
  ]);

  const addPiece = () => {
    const newPiece = {
      id: pieces.length + 1,
      title: '',
      location: '',
      image: null,
    };
    setPieces([...pieces, newPiece]);
  };

  const deletePiece = (id) => {
    const updatedPieces = pieces.filter(piece => piece.id !== id);
    setPieces(updatedPieces);
  };

  return (
    <ScrollView style={styles.container}>

{/* ----------------------------header------------------------------*/}
      <View style={styles.header}>
        <Pressable>
          <Image source={require('../../assets/outfitCreationImages/back button.png')}/>
        </Pressable>
        <Text style={styles.h1}>Create Outfit</Text>
      </View>

{/* ----------------------------outfit Image------------------------------*/}
      <ScrollView style={styles.outfitImageView}>
        <View style={styles.imageContainer}>
          <View style={styles.outfitImage}>
            <Pressable>
              <Image source={require('../../assets/outfitCreationImages/Add Outfit.png')}/>
            </Pressable>
          </View>
          <View style={styles.outfitImage}>
            <Pressable>
              <Image source={require('../../assets/outfitCreationImages/Add Outfit.png')}/>
            </Pressable>
          </View>
        </View>
      </ScrollView>

{/* ----------------------------content------------------------------*/}
      <View style={styles.content}>
        {/* --------Outfit Name Field----------*/}
        <View style={styles.inputRow}>
          <Text style={styles.captionText}>Outfit Name</Text>
          <TextInput style={styles.inputText} placeholder="Pick a name for this outfit......"></TextInput>
        </View>

        {/* --------Description Field----------*/}
        <View style={styles.inputRow}>
          <Text style={styles.captionText}>Description</Text> 
          <TextInput style={styles.inputText} placeholder="Write a Description Here"></TextInput>
        </View>

        {/* --------Height + Category Field----------*/}
        <View style={[styles.inputRow, styles.flexRow]} >
          <View style={styles.rowItem}>
            <Text style={styles.captionText}>Height</Text>
            <TextInput style={styles.inputText} placeholder="Add Height......"></TextInput>
          </View>
          <View style={styles.rowItem}>
            <Text style={styles.captionText}>Category</Text>
            <Dropdown
              style={styles.inputText}
              iconColor="#9D4EDD"
              data={categorySelection}
              labelField="label"
              valueField="value"
              value={selectedCategory}
              onChange={item => setSelectedCategory(item.value)}
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
              value={selectedBodyType}
              onChange={item => setSelectedBodyType(item.value)}
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
              value={selectedSeason}
              onChange={item => setSelectedSeason(item.value)}
              placeholder="Add Season"
            />
          </View>
        </View>

      {/* ----------------------------outfit pieces------------------------------*/}
        <Text style={styles.captionText}>Piece Title</Text>
        {pieces.map((piece, index) => (
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
                  const updatedPieces = [...pieces];
                  updatedPieces[index].title = text;
                  setPieces(updatedPieces);
                }}
              />
              <TextInput
                style={styles.pieceText}
                placeholder="Where did you got it?"
                value={piece.location}
                onChangeText={(text) => {
                  const updatedPieces = [...pieces];
                  updatedPieces[index].location = text;
                  setPieces(updatedPieces);
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
    outfitImageView: {
      flexDirection: 'row',
      marginBottom: 20, 
    },  
    imageContainer: {
      flexDirection: 'row',
    },
    outfitImage: {
      marginRight: 10,  
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