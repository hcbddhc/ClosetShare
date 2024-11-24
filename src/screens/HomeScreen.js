import React, { useEffect, useCallback, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Footer from '../components/Footer';
import CustomStatusBar from '../components/CustomStatusBar';
import OutfitCard from '../components/OutfitCard';
import { View, Text, Image, TextInput, ScrollView, Pressable, StyleSheet } from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
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

//variable for navigation state (1 = explore, 2 = favorites, 3 = near me)
const [navigationType, setNavigationType] = useState(1);

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
    return outfits.map((outfits) => (
      <OutfitCard outfits={outfits} />
    ));
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <CustomStatusBar backgroundColor="white" />
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

         {/* Navigation Options */}
         <View style={styles.contentSelectionContainer}>
          <Pressable style={[
            styles.contentOption, 
            navigationType === 1 && styles.selectedOption]}
            onPress = {() => setNavigationType(1)}
          >
            <Text style={[styles.contentOptionText, navigationType === 1 && styles.selectedOptionText]}>Explore</Text>
          </Pressable>

          <Pressable style={[
            styles.contentOption, 
            navigationType === 2 && styles.selectedOption]}
            onPress = {() => setNavigationType(2)}
          >
            <Text style={[styles.contentOptionText, navigationType === 2 && styles.selectedOptionText]}>Favorites</Text>
          </Pressable>

          <Pressable style={[
            styles.contentOption, 
            navigationType === 3 && styles.selectedOption]}
            onPress = {() => setNavigationType(3)}
          >
            <Text style={[styles.contentOptionText, navigationType === 3 && styles.selectedOptionText]}>Nearby</Text>
          </Pressable>

        </View>
      </View>
      
      {/* ------------------------------------------Content------------------------------------------------------- */}
      <View style= {styles.content}>

         {/* Outfits */}
         <ScrollView contentContainerStyle={styles.outfitContainer}>
          {renderOutfitCards()}
        </ScrollView>

      </View>

      {/* ------------------------------------------Footer------------------------------------------------------- */}
      <Footer />
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
//-----------------------------beginning of header------------------------------
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 10,
    shadowOffset: { width: 0, height: 4 },  
    shadowColor: 'black',  
    shadowOpacity: 0.1,  
    elevation: 2,
  },
  logo: { 
    fontFamily: 'Poppins_700Bold',
    marginLeft: 22,
    fontSize: 20,
    color: '#9D4EDD', 
    marginBottom: 16,
  },

  //search bar
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 22,
    paddingLeft: 10,
    paddingRight: 10,
    marginRight: 22,
    backgroundColor: '#F0F0F0',
    borderRadius: 15,
    height: 40,
  },
  searchIcon: {
    marginRight: 10,
  },

  //filter bar
  filter :{
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 22,
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

  //For the 3 navigation options (explore, favorite, near by)
  contentSelectionContainer: { //container containing all 3 options (the bar)
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginHorizontal: '10%',
  },
  contentOption: { //general styling for each option
    marginHorizontal: '6%',
  },
  contentOptionText: { //text for each option
    fontSize: 16,
    paddingBottom: 15,
  },
  selectedOption: { //for selected navigation option
    borderBottomWidth: 2,
    borderBottomColor: '#9D4EDD',
  },
  selectedOptionText: {
    color: '#9D4EDD',
  },

  //-----------------------------beginning of content------------------------------
  content: {
    flex: 1
  },

  //styling for the outfit container
  outfitContainer: {
    flexGrow: 1, // Ensures the content can grow and overflow
    flexDirection: 'row',
    flexWrap: 'wrap', // Allow wrapping
    justifyContent: 'space-between', // Space out items
    paddingTop: 10,
    marginHorizontal: 22,
  },
});

export default HomeScreen;
