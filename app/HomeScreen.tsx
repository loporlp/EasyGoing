// HomeScreen.tsx
import React from 'react';
import { View, Button, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useRouter } from "expo-router";
import {getIdToken} from '../scripts/getFirebaseID'

const HomeScreen = () => {

  // Sets up navigations
  const router = useRouter();

  /**
   * Will navigate to the "Account" screen after link is pressed.
   */
  const navigateToAccount = () => {
    router.push("/Account")
  }

  return (
    <View style={styles.container}>
      {/* Account Button in the Top Right */}
      <TouchableOpacity style={styles.accountButton} onPress={navigateToAccount}>
        <Text style={styles.accountButtonText}>Account</Text>
      </TouchableOpacity>


      {/* Two Buttons in the Middle */}
      <View style={styles.buttonContainer}>
        <Button title="Button 1" onPress={fetchData} />
        <View style={{ height: 20 }} />
        <Button title="Button 2" onPress={callProtectedApi} />
      </View>
    </View>
  );
};

const fetchData = async () => {
  try {
    // We should put this ip into a global constant
    const response = await fetch('http://ezgoing.app/api/serverstatus');
    const data = await response.json();
    console.log(data.message); // This should log "Hello from the server!"
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const callProtectedApi = async () => {
  try {
    // Retrieve the ID token
    const idToken = await getIdToken(auth);

    const searchTerm = "McDona"
    // Define the API endpoint
    const apiUrl = `http://ezgoing.app/api/autocomplete?input=${searchTerm}`; // Search term is the user inputted that we are auto completeing

    // Make the API call
    const response = await fetch(apiUrl, {
      method: "GET", // Or "POST", "PUT", etc.
      headers: {
        Authorization: `Bearer ${idToken}`, // Include the ID token in the header
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("API Response:", data); // Handle the response
  } catch (error) {
    console.error("Error calling API:", error);
  }
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60, // For status bar space
    backgroundColor: '#fff',
  },
  accountButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  accountButtonText: {
    fontSize: 16,
    color: 'blue',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});

export default HomeScreen;