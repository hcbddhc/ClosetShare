import React, { useEffect, useCallback, useState } from 'react';
import { collection, query, where, doc, getDocs, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Footer from '../components/Footer';
import CustomStatusBar from '../components/CustomStatusBar';
import OutfitCard from '../components/OutfitCard';
import { View, Text, Image, TextInput, ScrollView, Pressable, StyleSheet } from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import { getData } from '../utils/storage'; 


const HomeScreen = () => {
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

  //variable for method of navigation (explore, favorites, and nearby)
  //1: explore
  //2: favorites
  //3: nearby <-- can't finish, delete
  const [navigationMode, setNavigationMode] = useState(1);
  
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

  const [filterHeight, setFilterHeight] = useState(null);
  const heightSelection = [
    { label: '155-159 cm', value: '155-159' },
    { label: '160-164 cm', value: '160-164' },
    { label: '165-169 cm', value: '165-169' },
    { label: '170-174 cm', value: '170-174' },
    { label: '175-179 cm', value: '175-179' },
    { label: '180-184 cm', value: '180-184' },
    { label: 'none', value: 'none' },
  ];

  //variable for the search bar input
  const [searchText, setSearchText] = useState('');

  //refresh list of outfits on load
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          let fetchedData = [];
  
          // Fetch all users from database
          const usersList = await getDocs(collection(db, 'users'));
  
          //-------------------- navigation Mode is EXPLORE---------------------------
          if (navigationMode === 1 || navigationMode === 3) {
            for (const userDoc of usersList.docs) {
              let outfitsQuery = collection(db, `users/${userDoc.id}/outfits`);
  
              // Apply filters based on the selected criteria
              if (filterSeason) outfitsQuery = query(outfitsQuery, where("season", "==", filterSeason));
              if (filterCategory) outfitsQuery = query(outfitsQuery, where("category", "==", filterCategory));
              if (filterHeight) outfitsQuery = query(outfitsQuery, where("height", "==", filterHeight));
              if (filterBodyType) outfitsQuery = query(outfitsQuery, where("bodyType", "==", filterBodyType));
  
              // Apply the search result if there is one
              if (searchText) {
                outfitsQuery = query(outfitsQuery, 
                  where("name", ">=", searchText),
                  where("name", "<=", searchText + "\uf8ff")
                );
              }
              
              //Now do the query
              const outfitsList = await getDocs(outfitsQuery);
  
              // Process each outfit document
              outfitsList.forEach((outfitDoc) => {
                fetchedData.push({
                  id: outfitDoc.id,
                  userID: userDoc.id,
                  outfitName: outfitDoc.data().name,
                  username: userDoc.data().username || "Anonymous", 
                  creationDate: outfitDoc.data().creationDate || "Unknown",
                  image: outfitDoc.data().images?.[0]?.imageUrl,
                });
              });
            }

          //-------------------- navigation Mode is FAVORITES---------------------------
          } else if (navigationMode === 2) {
            const user = await getData('user');
            const uid = user?.uid;
  
            if (!uid) {
              console.log("User is not logged in");
              setOutfits([]); 
              return;
            }
  
            const userDoc = await getDoc(doc(db, 'users', uid));
            const favoriteOutfits = userDoc.data().favoriteOutfits || [];
  
            // If no liked outfits, return empty
            if (favoriteOutfits.length === 0) {
              setOutfits([]); 
              return;
            }
  
            // Loop through users and check their outfits for liked outfits
            for (const userDoc of usersList.docs) {
              const outfitsRef = collection(db, `users/${userDoc.id}/outfits`);
              const outfitsSnapshot = await getDocs(outfitsRef);
              const userOutfits = outfitsSnapshot.docs.map(doc => doc.id); 
  
              // Loop through each outfit and check if it's liked by the current user
              for (const outfit of userOutfits) {
                if (favoriteOutfits.includes(outfit)) {
                  const outfitDoc = await getDoc(doc(db, `users/${userDoc.id}/outfits/${outfit}`));
                  if (outfitDoc.exists()) {
                    fetchedData.push({
                      id: outfitDoc.id,
                      userID: userDoc.id,
                      outfitName: outfitDoc.data().name,
                      username: userDoc.data().username || "Anonymous", 
                      creationDate: outfitDoc.data().creationDate || "Unknown",
                      image: outfitDoc.data().images?.[0]?.imageUrl,
                    });
                  }
                }
              }
            }
          }
  
          // SETTING OUTFIT AFTER 1 2 OR 3
          setOutfits(fetchedData);
  
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
    }, [navigationMode, filterSeason, filterCategory, filterHeight, filterBodyType, searchText])
  );

   // function for rendering outfit
  const renderOutfitCards = () => {
    return outfits.map((outfits) => (
      <OutfitCard key={outfits.id} outfits={outfits} />
    ));
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <CustomStatusBar backgroundColor="white" />
       {/* ------------------------------------------Header------------------------------------------------------- */}
      <View style= {styles.header}>
        {/* Logo */}
        <View style ={styles.flexIcon}>
          {/* Logo */}
          <Text style={styles.logo}>CLOSETSHARE.</Text>
        </View>
        

        {/* Search Bar */}
        <View style = {styles.search}>
          <Image style={styles.searchIcon} source={require('../../assets/HomeScreenImages/Search Icon.png')} />
          <TextInput style={styles.caption} placeholder="search......" onChangeText={(text) => setSearchText(text)}/>
        </View>

        {/* Filter bar */}
        <View style = {styles.filter}>
          <Pressable><Image style={styles.filterIcon} source={require('../../assets/HomeScreenImages/Filter Icon.png')}/></Pressable>
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
            <Dropdown
                {...dropdownProps}
                data={heightSelection}
                value={filterHeight}
                onChange={item => setFilterHeight(item.value)}
                placeholder="Height"
            />
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
            navigationMode === 1 && styles.selectedOption]}
            onPress = {() => setNavigationMode(1)}
          >
            <Text style={[styles.contentOptionText, navigationMode === 1 && styles.selectedOptionText]}>Explore</Text>
          </Pressable>

          <Pressable style={[
            styles.contentOption, 
            navigationMode === 2 && styles.selectedOption]}
            onPress = {() => setNavigationMode(2)}
          >
            <Text style={[styles.contentOptionText, navigationMode === 2 && styles.selectedOptionText]}>Favorites</Text>
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
      <Footer activeTab={"Home"} />
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flexIcon: {
    flexDirection:'row',
    justifyContent:'space-between',
    marginRight: 20,
  },
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
  logoutButton: {
    marginLeft: 10,
  },
  logoutButtonImage:{
    height:35,
    width:35,
  },
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
    width: 20,
    height: 20,
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
    width: 25,
    height: 25,
    marginRight: 10,
  },
  filterText: {
    color: '#666363',
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
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
    fontFamily: 'Poppins_600SemiBold',
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
    flexDirection: 'row',
    flexWrap: 'wrap', // Allow wrapping
    justifyContent: 'space-between',
    paddingTop: 10,
    marginHorizontal: 22,
  },
});

export default HomeScreen;
