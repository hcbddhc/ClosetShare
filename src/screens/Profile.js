import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Pressable, Image } from 'react-native';
import Footer from '../components/Footer';
import OutfitCard from '../components/OutfitCard';
import DefaultButton from '../components/DefaultButton';
import { getData, removeData } from '../utils/storage';
import CustomStatusBar from '../components/CustomStatusBar';
import { collection, getDocs, getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import {SafeAreaProvider, withSafeAreaInsets} from 'react-native-safe-area-context';

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
        username: '',
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
                    username: userDoc.data().username || '',
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
    <SafeAreaProvider style={styles.bigContainer}>
        <CustomStatusBar backgroundColor="white" />
        <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
            <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                <Image
                source={require('../../assets/outfitCreationImages/back button.png')}
                style={styles.backButtonImage}
                />
            </Pressable>
            <View style={styles.profileInfo}>
            <Image
                source={require('../../assets/ProfileScreenImages/maleProfile.png')} //Profile Image
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
            <ScrollView style={styles.profileContent}>
                {!editingState ? (
                <>
                    <View style={styles.readOnlyField}>
                        <Text style={styles.readOnlyLabel}>Username:</Text>
                        <Text style={styles.readOnlyValue}>{editingProfile.username || 'N/A'}</Text>
                    </View>
                    <View style={styles.readOnlyField}>
                        <Text style={styles.readOnlyLabel}>Weight:</Text>
                        <Text style={styles.readOnlyValue}>{editingProfile.weight || 'N/A'}</Text>
                    </View>
                    <View style={styles.readOnlyField}>
                        <Text style={styles.readOnlyLabel}>Height:</Text>
                        <Text style={styles.readOnlyValue}>{editingProfile.height || 'N/A'}</Text>
                    </View>
                    <View style={styles.readOnlyField}>
                        <Text style={styles.readOnlyLabel}>Gender:</Text>
                        <Text style={styles.readOnlyValue}>{editingProfile.gender || 'N/A'}</Text>
                    </View>
                </>
                ) : (
                <>
                    <View style={styles.inputRow}>
                    <Text style={styles.labelText}>Username:</Text>
                    <TextInput
                        style={styles.textInput}
                        value={editingProfile.username}
                        onChangeText={(text) =>
                        setEditingProfile((prev) => ({ ...prev, username: text }))
                        }
                    />
                    </View>

                    <View style={styles.inputRow}>
                        <Text style={styles.labelText}>Weight:</Text>
                        <Dropdown
                            style={styles.dropdown}
                            data={weightOptions}
                            labelField="label"
                            valueField="value"
                            value={editingProfile.weight}
                            placeholder="Select Weight"
                            onChange={(item) =>
                            setEditingProfile((prev) => ({ ...prev, weight: item.value }))
                            }
                        />
                        </View>

                        <View style={styles.inputRow}>
                            <Text style={styles.labelText}>Height:</Text>
                            <Dropdown
                                style={styles.dropdown}
                                data={heightOptions}
                                labelField="label"
                                valueField="value"
                                value={editingProfile.height}
                                placeholder="Select Height"
                                onChange={(item) =>
                                setEditingProfile((prev) => ({ ...prev, height: item.value }))
                                }
                            />
                        </View>

                        <View style={styles.inputRow}>
                            <Text style={styles.labelText}>Gender:</Text>
                            <Dropdown
                                style={styles.dropdown}
                                data={genderOptions}
                                labelField="label"
                                valueField="value"
                                value={editingProfile.gender}
                                placeholder="Select Gender"
                                onChange={(item) =>
                                setEditingProfile((prev) => ({ ...prev, gender: item.value }))
                                }
                            />
                        </View>
                </>
                )}


                {!editingState ? (
                    <DefaultButton
                        title="Edit Profile"
                        onPress={() => setEditingState(true)} // Switch to editing mode
                        style={styles.editingButton}
                    />
                ) : (
                <View style={styles.buttonContainer}>
                    <DefaultButton
                        title="Save"
                        onPress={() => {
                            handleSaveProfile();
                            setEditingState(false); // Exit editing mode after saving
                        }}
                        style={styles.saveButton}
                    />
                    <DefaultButton
                        title="Cancel"
                        onPress={() => {
                            setEditingState(false); // Exit editing mode without saving
                        }}
                        style={styles.cancelButton}
                    />
                </View>
                )}
                <View style={styles.logoutContainer}>
                    <DefaultButton
                    title="Logout"
                    onPress={handleLogout}
                    style={styles.logoutButton}
                    />
                </View>
            </ScrollView>
        )}

        {/* Footer */}
        <Footer activeTab="Profile" />
        </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F0F0',
    },
    header: {
        backgroundColor: '#FFFFFF',
        shadowOffset: { width: 0, height: 4 },
        shadowColor: 'black',
        shadowOpacity: 0.1,
        elevation: 2,
    },
    cancelButton: {
        backgroundColor: 'grey',
        // marginHorizontal: 30,
        width:'100%',
        marginRight: 10,
    },
    saveButton: { 
        // marginHorizontal: 35,
        width:'105%',
        marginRight: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
    },
    editingButton: {
        width: '100%', 
        paddingHorizontal: 125,
    },
    logoutButton: {
        width: '100%', 
        backgroundColor: '#e0163f', 
        alignSelf: 'center', 
        paddingVertical: 12, 
        paddingHorizontal: 140,
        borderRadius: 8, 
        alignItems: 'center', 
    },
    logoutContainer: {
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    backButton: {
        top: 10,
        left: 20,
        zIndex: 10,
    },
    backButtonImage: {
        width: 30,
        height: 30,
    },
    profileInfo: {
        alignItems: 'center',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 8,
        marginTop: 10,
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
    },
    dropdown: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        height: 40,
        marginLeft: 25,
    },
    readOnlyField: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10,
        width: '80%',
        alignSelf: 'center',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
    readOnlyLabel: {
        fontSize: 16,
        color: '#666',
        fontWeight: 'bold',
    },
    readOnlyValue: {
        fontSize: 16,
        color: '#333',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        marginHorizontal: 40,
    },
    labelText: {
        fontSize: 16,
        color: '#666363',
        marginRight: 10, 
        textAlign: 'right', 
    },
    textInput: {
        flex: 1,
        borderWidth: 1,
        fontSize: 16,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        height: 40,
    },
    bigContainer: {
        flex: 1,            // Take up the full screen
        backgroundColor: '#fff',  // Set background color
    },
      
});

export default ProfileScreen;
