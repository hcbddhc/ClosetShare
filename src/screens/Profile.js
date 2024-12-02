import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Image } from 'react-native';
import Footer from '../components/Footer';
import OutfitCard from '../components/OutfitCard';
import DefaultButton from '../components/DefaultButton';
import { getData, removeData } from '../utils/storage';
import { collection, getDocs, getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';

const ProfileScreen = ({ navigation, onLoginStateChange }) => {
  const [outfits, setOutfits] = useState([]);
  const [navigationMode, setNavigationMode] = useState(1); // 1: My Posts, 2: Profile
  const [username, setUsername] = useState('Anonymous');
  const [editingState, setEditingState] = useState(false); // false = viewing, true = editing

  const [editingProfile, setEditingProfile] = useState({
    weight: '',
    height: '',
    gender: '',
    location: '',
    password: '',
  });

  // Dropdown data
  const weightOptions = [
    { label: 'Slim', value: 'Slim' },
    { label: 'Athletic', value: 'Athletic' },
    { label: 'Average', value: 'Average' },
    { label: 'Curvy', value: 'Curvy' },
  ];
  const heightOptions = [
    { label: '150-154 cm', value: '150-154 cm' },
    { label: '155-159 cm', value: '155-159 cm' },
    { label: '160-164 cm', value: '160-164 cm' },
    { label: '165-169 cm', value: '165-169 cm' },
    { label: '170-174 cm', value: '170-174 cm' },
    { label: '175-179 cm', value: '175-179 cm' },
    { label: '180+ cm', value: '180+ cm' },
  ];
  const genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Non-binary', value: 'Non-binary' },
    { label: 'Prefer not to say', value: 'Prefer not to say' },
  ];

  // Handle logout
  const handleLogout = async () => {
    console.log('Logout triggered');
    await removeData('user');
    onLoginStateChange();

    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }, 150);
  };

  // Save updated profile data
  const handleSaveProfile = async () => {
    try {
      const user = await getData('user');
      const uid = user?.uid;
  
      if (!uid) {
        console.error('User is not logged in');
        return;
      }
  
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, { ...editingProfile });
  
      alert('Profile saved successfully!');
      setEditingState(false); // Switch back to viewing mode
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  

  // Fetch user data and outfits when the screen gains focus
  useFocusEffect(
    useCallback(() => {
      const fetchUserData = async () => {
        try {
          const user = await getData('user');
          const uid = user?.uid;

          if (!uid) {
            console.log('User is not logged in');
            setOutfits([]);
            return;
          }

          const userDocRef = doc(db, 'users', uid);
          const userDoc = await getDoc(userDocRef);

          if (!userDoc.exists()) {
            console.error('User document does not exist');
            setOutfits([]);
            return;
          }

          const fetchedUsername = userDoc.data().username || 'Anonymous';
          setUsername(fetchedUsername);

          setEditingProfile({
            weight: userDoc.data().weight || '',
            height: userDoc.data().height || '',
            gender: userDoc.data().gender || '',
            location: userDoc.data().location || '',
            password: userDoc.data().password || '',
          });

          // Fetch the user's outfits
          const outfitsRef = collection(db, `users/${uid}/outfits`);
          const outfitsSnapshot = await getDocs(outfitsRef);

          const fetchedData = outfitsSnapshot.docs.map((outfitDoc) => ({
            id: outfitDoc.id,
            userID: userDoc.id,
            outfitName: outfitDoc.data().name,
            username: userDoc.data().username || 'Anonymous', // Fallback
            creationDate: outfitDoc.data().creationDate || 'Unknown',
            image: outfitDoc.data().images?.[0]?.imageUrl,
          }));

          setOutfits(fetchedData);
        } catch (error) {
          console.error('Error fetching user outfits:', error);
        }
      };

      fetchUserData();
    }, [])
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <Image
            source={{ uri: 'https://via.placeholder.com/150' }} // Replace with user's profile image URL if available
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>{username}</Text>
        </View>
        {/* Navigation Tabs */}
        <View style={styles.contentSelectionContainer}>
          <Pressable
            style={[
              styles.contentOption,
              navigationMode === 1 && styles.selectedOption,
            ]}
            onPress={() => setNavigationMode(1)}
          >
            <Text
              style={[
                styles.contentOptionText,
                navigationMode === 1 && styles.selectedOptionText,
              ]}
            >
              My Posts
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.contentOption,
              navigationMode === 2 && styles.selectedOption,
            ]}
            onPress={() => setNavigationMode(2)}
          >
            <Text
              style={[
                styles.contentOptionText,
                navigationMode === 2 && styles.selectedOptionText,
              ]}
            >
              Profile
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Content */}
      {navigationMode === 1 ? (
        <ScrollView contentContainerStyle={styles.outfitContainer}>
          {outfits.length > 0
            ? outfits.map((outfit) => (
                <OutfitCard
                  key={outfit.id}
                  outfits={outfit}
                  navigation={navigation}
                />
              ))
            : <Text style={styles.emptyText}>No posts yet.</Text>}
        </ScrollView>
      ) : (
        <View style={styles.profileContent}>
            {editingState ? (
            // Render dropdowns and input fields for editing
            <>
                <Dropdown
                style={styles.dropdown}
                data={weightOptions}
                labelField="label"
                valueField="value"
                placeholder="Select Weight"
                value={editingProfile.weight}
                onChange={(item) => setEditingProfile((prev) => ({ ...prev, weight: item.value }))}
                />
                <Dropdown
                style={styles.dropdown}
                data={heightOptions}
                labelField="label"
                valueField="value"
                placeholder="Select Height"
                value={editingProfile.height}
                onChange={(item) => setEditingProfile((prev) => ({ ...prev, height: item.value }))}
                />
                <Dropdown
                style={styles.dropdown}
                data={genderOptions}
                labelField="label"
                valueField="value"
                placeholder="Select Gender"
                value={editingProfile.gender}
                onChange={(item) => setEditingProfile((prev) => ({ ...prev, gender: item.value }))}
                />
            </>
            ) : (
            // Render profile data for viewing
            <>
                <Text style={styles.profileInfoText}>Weight: {editingProfile.weight || 'N/A'}</Text>
                <Text style={styles.profileInfoText}>Height: {editingProfile.height || 'N/A'}</Text>
                <Text style={styles.profileInfoText}>Gender: {editingProfile.gender || 'N/A'}</Text>
            </>
            )}

            {!editingState ? (
            <DefaultButton
                title="Edit Profile"
                onPress={() => setEditingState(true)} // Switch to editing mode
            />
            ) : (
            <View style={styles.buttonContainer}>
                <DefaultButton
                title="Save"
                onPress={() => {
                    handleSaveProfile();
                    setEditingState(false); // Exit editing mode after saving
                }}
                />
                <DefaultButton
                title="Cancel"
                onPress={() => {
                    setEditingState(false); // Exit editing mode without saving
                }}
                />
            </View>
            )}

          <DefaultButton title="Logout" onPress={handleLogout} />
        </View>
      )}

      {/* Footer */}
      <Footer activeTab="Profile" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowColor: 'black',
    shadowOpacity: 0.1,
    elevation: 2,
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileData: {
    alignItems: 'center',
    marginTop: 20,
  },
  profileText: {
    fontSize: 16,
    marginVertical: 5,
  },
  contentSelectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
    marginHorizontal: '10%',
  },
  contentOption: {
    marginHorizontal: '6%',
  },
  contentOptionText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    paddingBottom: 15,
  },
  selectedOption: {
    borderBottomWidth: 2,
    borderBottomColor: '#9D4EDD',
  },
  selectedOptionText: {
    color: '#9D4EDD',
  },
  outfitContainer: {
    flexGrow: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingTop: 10,
    marginHorizontal: 22,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
  },
  profileContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    marginVertical: 10,
    width: '80%',
    alignSelf: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginTop: 20,
  },
});

export default ProfileScreen;
