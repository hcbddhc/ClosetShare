import React, { useEffect, useCallback, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Footer from '../components/Footer';
import { View, Text, Image, TextInput, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useFonts, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { useFocusEffect } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';


const HomeScreen = (navigation) => {

  //outfits that will be rendered on the home screen
  const [outfits, setOutfits] = useState([]);

  //for drop down styling, save space
  const dropdownProps = {
    style: styles.filterOption,
    placeholderStyle: styles.filterText,
    selectedTextStyle: styles.filterText,
    iconColor: "#666363",
    labelField: "label",
    valueField: "value",
  };
  
  //variable for filter options, and choices for the drop down menu selections
  const [filterCategory, setFilterCategory] = useState(null);
  const categorySelection = [
    { label: "Remove Filter", value: null },
    { label: 'Men', value: 'men' },
    { label: 'Women', value: 'women' },
    { label: 'Unisex/Gender Neutral', value: 'unisex' },
  ];
  const [filterBodyType, setFilterBodyType] = useState(null);
  const bodyTypeSelection = [
    { label: "Remove Filter", value: null },
    { label: "Curvy", value: "curvy" },
    { label: "Slim", value: "slim" },
    { label: "Athletic", value: "athletic" },
    { label: "Petite", value: "petite" },
    { label: "Plus-size", value: "plus-size" },
  ];
  const [filterSeason, setFilterSeason] = useState(null);
  const seasonSelection = [
    { label: "Remove Filter", value: null },
    { label: 'Spring', value: 'spring' },
    { label: 'Summer', value: 'summer' },
    { label: 'Fall', value: 'fall' },
    { label: 'Winter', value: 'winter' },
    { label: 'Year-round', value: 'year-round' },
  ];


  //refresh list of outfits on load
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const usersList = await getDocs(collection(db, 'users'));
          let fetchedData = [];
    
          // Loop through each user document
          for (const userDoc of usersList.docs) {
            //retrive all the outfits first (maybe not efficient idk)
            let outfitsQuery = collection(db, `users/${userDoc.id}/outfits`);

            // then check for filters later
            if (filterSeason) {
              outfitsQuery = query(outfitsQuery, where("season", "==", filterSeason));
            }
            if (filterCategory) {
              outfitsQuery = query(outfitsQuery, where("category", "==", filterCategory));
            }
            if (filterBodyType) {
              outfitsQuery = query(outfitsQuery, where("bodyType", "==", filterBodyType));
            }

            const outfitsList = await getDocs(outfitsQuery); //put everything from finalized query to an array object
    
            // Process each outfit document
            outfitsList.forEach((outfitDoc) => {
              fetchedData.push({
                id: outfitDoc.id,
                outfitName: outfitDoc.data().name,
                username: userDoc.data().username || "Anonymous", // Fallback
                creationDate: outfitDoc.data().creationDate || "Unknown",
                image: outfitDoc.data().images?.[0]?.imageUrl,
              });
            });
          }
    
         //set data as this code's outfit ojbect
          setOutfits(fetchedData); 
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
    }, [filterSeason, filterCategory, filterBodyType]) 
  );

  // Load Poppins font
  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
  });
  if (!fontsLoaded) {
    return null;
  }

   // function for rendering outfit
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
            <Dropdown
                {...dropdownProps}
                data={categorySelection}
                value={filterCategory}
                onChange={item => setFilterCategory(item.value)}
                placeholder="Category"
            />
            <Dropdown
                {...dropdownProps}
                data={bodyTypeSelection}
                value={filterBodyType}
                onChange={item => setFilterBodyType(item.value)}
                placeholder="Body Type"
            />
            <Pressable style={styles.filterOption}>
              <Text style={styles.filterText}>Height</Text>
            </Pressable>
            <Dropdown
                {...dropdownProps}
                data={seasonSelection}
                value={filterSeason}
                onChange={item => setFilterSeason(item.value)}
                placeholder="Season"
            />
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
    fontSize: 14,
  },
  filterOption: {
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
