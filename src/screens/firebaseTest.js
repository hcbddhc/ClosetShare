import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { getAuth, createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { database } from "../firebaseConfig";
import { ref, set, remove } from "firebase/database";

const FirebaseCreateUserScreen = () => {
  const [user, setUser] = useState(null); // State to hold the current user

  // Function to create a new user
  const createUser = async () => {
    const auth = getAuth(); // Initialize Firebase Auth instance
    const email = "sampleuser@example.com"; // Sample email for the new user
    const password = "samplePassword"; // Sample password for the new user

    try {
      // Create the user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user; // User object with information like UID

      console.log("User created successfully:", newUser);
      setUser(newUser); // Save the user object to state

      // Store user data in Realtime Database under 'users' with UID as key
      await set(ref(database, "users/" + newUser.uid), {
        email: newUser.email,
        uid: newUser.uid,
      });

      console.log("User data saved to Realtime Database");
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  // Function to delete the user account
  const deleteUserAccount = async () => {
    const auth = getAuth(); // Get the current auth instance

    if (user) {
      try {
        // Delete user from Firebase Authentication
        await deleteUser(user); 
        console.log("User deleted from Authentication");

        // Remove user data from Realtime Database
        await remove(ref(database, "users/" + user.uid)); 
        console.log("User data deleted from Realtime Database");

        // Clear the user state
        setUser(null);
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    } else {
      console.log("No user to delete");
    }
  };

  return (
    <View style={styles.container}>
      <Text>Create a Firebase User</Text>
      <Button title="Create User" onPress={createUser} />
      {user && ( // Show delete button only if user exists
        <Button title="Delete User" onPress={deleteUserAccount} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
});

export default FirebaseCreateUserScreen;
