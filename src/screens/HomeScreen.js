// src/HomeScreen.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Footer from '../components/Footer';
import { View, Text, Image, TextInput, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useFonts, Poppins_700Bold } from '@expo-google-fonts/poppins';


const HomeScreen = (navigation) => {
  //placeholder outfits, remove once cloud integration is implemented.
  const [outfits, setOutfits] = useState([]);
  const outfitsTest = [
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersList = await getDocs(collection(db, 'users'));
        let fetchedData = [];
  
        // Loop through each user document
        for (const userDoc of usersList.docs) {
          // Get all outfits for the current user
          const outfitsList = await getDocs(
            collection(db, `users/${userDoc.id}/outfits`)
          );
  
          // Process each outfit document
          outfitsList.forEach((outfitDoc) => {
            fetchedData.push({
              id: outfitDoc.id,
              outfitName: outfitDoc.data().name,
              username: userDoc.data().username || 'Anonymous', // Fallback
              creationDate: outfitDoc.data().creationDate || 'Unknown',
              image: outfitDoc.data().images?.[0]?.imageUrl,
            });
            //console.log(outfitDoc.data().images?.[0]?.imageUrl);
          });
        }
  
        // Once all data is fetched, update the state
        setOutfits(fetchedData); // Set the outfits state after all data is processed
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);

  // Load Poppins font
  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
  });
  if (!fontsLoaded) {
    return null;
  }

  

   // renders outfit, for now it just renders the templates above.
   const renderOutfitCards = () => {
    return outfits.map((outfit) => (
      <View key={outfit.id} style={styles.outfitCard}>
        <Image source={{uri: outfit.image}} style={styles.outfitImage}/>
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
    flexWrap: 'wrap', // Allow wrapping
    justifyContent: 'space-between', // Space out items
    paddingTop: 10,
    marginHorizontal: 22,
  },
  outfitCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    width: '48%', // Adjust the width to fit two items per row (slightly less than half the screen width)
    height: 264,
    marginBottom: 15, // Add spacing between rows
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
  outfitDate: {
    color: '#666363',
  },
});

export default HomeScreen;