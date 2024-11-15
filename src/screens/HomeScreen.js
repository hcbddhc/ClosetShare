// src/HomeScreen.js
import React from 'react';
import Footer from '../components/Footer';
import { View, Text, Image, TextInput, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useFonts, Poppins_700Bold } from '@expo-google-fonts/poppins';


const HomeScreen = (navigation) => {
  // Load Poppins font
  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
  });
  if (!fontsLoaded) {
    return null;
  }

  //placeholder outfits, remove once cloud integration is implemented.
  const outfits = [
    {
      id: '1',
      outfitName: 'Casual Day Out',
      username: 'user123',
      creationDate: '2024-11-01',
      image: require('../../assets/HomeScreenImages/OutfitTemplate.png'),
    },
    {
      id: '2',
      outfitName: 'Office Chic',
      username: 'user456',
      creationDate: '2024-11-02',
      image: require('../../assets/HomeScreenImages/OutfitTemplate.png'),  // Placeholder image URL
    },
    {
      id: '3',
      outfitName: 'Night Out Glam',
      username: 'user789',
      creationDate: '2024-11-03',
      image: require('../../assets/HomeScreenImages/OutfitTemplate.png'),
    },
    {
      id: '4',
      outfitName: 'Sporty Look',
      username: 'user321',
      creationDate: '2024-11-04',
      image: require('../../assets/HomeScreenImages/OutfitTemplate.png'),
    }
  ];

   // renders outfit, for now it just renders the templates above.
   const renderOutfitCards = () => {
    return outfits.map((outfit) => (
      <View key={outfit.id} style={styles.outfitCard}>
        <Image source={outfit.image} style={styles.outfitImage} />
        <View style={styles.outfitContent}>
          <Text style={styles.outfitName}>{outfit.outfitName}</Text>
          <Text style={styles.outfitUserName}>{outfit.username}</Text>
          <Text style={styles.outfitDate}>{outfit.creationDate}</Text>
        </View>
      </View>
    ));
  };

  return (
    <View style={styles.container}>

       {/* ------------------------------------------Header------------------------------------------------------- */}
      <View style= {styles.header}>
        {/* Logo */}
        <Text style={styles.logo}>CLOSET SHARE.</Text>

        {/* Search Bar */}
        <View style = {styles.search}>
          <Image style={styles.searchIcon} source={require('../../assets/HomeScreenImages/Search Icon.png')} />
          <TextInput style={styles.caption} placeholder="search......"/>
        </View>

        {/* Filter bar */}
        <View style = {styles.filter}>
          <Pressable style={styles.filterIcon}><Image source={require('../../assets/HomeScreenImages/Filter Icon.png')}/></Pressable>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterOptionsContainer}>
            <Pressable style={styles.filterOption}>
              <Text style={styles.filterText}>Gender</Text>
              <Image source={require('../../assets/HomeScreenImages/DropdownIcon.png')} style={styles.dropdownIcon} />
            </Pressable>
            <Pressable style={styles.filterOption}>
              <Text style={styles.filterText}>Height</Text>
              <Image source={require('../../assets/HomeScreenImages/DropdownIcon.png')} style={styles.dropdownIcon} />
            </Pressable>
            <Pressable style={styles.filterOption}>
              <Text style={styles.filterText}>Season</Text>
              <Image source={require('../../assets/HomeScreenImages/DropdownIcon.png')} style={styles.dropdownIcon} />
            </Pressable>
            <Pressable style={styles.filterOption}>
              <Text style={styles.filterText}>Body Type</Text>
              <Image source={require('../../assets/HomeScreenImages/DropdownIcon.png')} style={styles.dropdownIcon} />
            </Pressable>
          </ScrollView>
        </View>
      </View>
      
      {/* ------------------------------------------Content------------------------------------------------------- */}
      <View style= {styles.content}>
        {/* Navigation Options */}
        <View style={styles.contentSelectionContainer}>
          <Pressable style={styles.contentOption}>
            <Text style={styles.contentOptionText}>Explore</Text>
          </Pressable>
          <Pressable style={styles.contentOption}>
            <Text style={styles.contentOptionText}>Favorites</Text>
          </Pressable>
          <Pressable style={styles.contentOption}>
            <Text style={styles.contentOptionText}>Nearby</Text>
          </Pressable>
        </View>

         {/* Outfits */}
         <ScrollView contentContainerStyle={styles.outfitContainer}>
          {renderOutfitCards()}
        </ScrollView>

      </View>

      {/* ------------------------------------------Footer------------------------------------------------------- */}
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },


  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 56,
    paddingBottom: 10,
    paddingLeft: 22,
  },
  logo: { 
    fontFamily: 'Poppins_700Bold',
    fontSize: 20,
    color: '#9D4EDD', 
    marginBottom: 16,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    marginRight: 22,
    padding: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  filter :{
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  filterIcon: {
    marginRight: 10,
  },
  filterText: {
    color: '#666363',
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECCBFF',
    marginRight: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  dropdownIcon: {
    height: 15,
    width: 15,
    marginLeft: 5,
  },


  content: {
    flex: 1
  },
  contentSelectionContainer: {
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingBottom: 10,
  },
  contentOption: {
    marginHorizontal: '6%',
  },
  contentOptionText: {
    fontSize: 16,
  },
  outfitContainer: {
    flexGrow: 1, // Ensures the content can grow and overflow
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingTop: 10,
    marginHorizontal: 22,
  },
  outfitCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    width: '46%',
    marginBottom: 20,
  },
  outfitImage: {
    width: '100%',
  },
  outfitContent: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  outfitName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  outfitUserName: {
    color: '#9D4EDD',
    marginBottom: 20,
  },
  outfitDate: {
    color: '#666363',
  },
});

export default HomeScreen;
