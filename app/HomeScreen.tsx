// HomeScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, TouchableOpacity, Text, Image, } from 'react-native';
import { useRouter } from "expo-router";
import { getAuth } from 'firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HomeScreen = () => {

  // Sets up navigations
  const router = useRouter();

  /**
   * Will navigate to the "Account" screen after link is pressed.
   */
  const navigateToAccount = () => {
    router.push("/Account")
  }

  /**
   * Navigates to the "Create New Trip" page
   */
  const createNewTrip = () => {
    console.log("Going to 'Create New Trip'...")
    router.push("/CreateNewTrip")
  }

  // Gets the username
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user && user.email) {
      const email = user.email;
      const extractedUsername = email.split('@')[0];
      setUsername(extractedUsername);
    }
  }, []);

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image style={styles.backgroundImage} source={require("../assets/images/landscape.jpg")} />
      <View style={styles.darkOverlay} />

      {/* Account Button in the Top Right */}
      <TouchableOpacity style={styles.accountButton} onPress={navigateToAccount}>
        <Icon name="account-circle" size={50} color="lightgray" />
      </TouchableOpacity>

      <View style={styles.screenContainer}>
        <Text style={styles.greetingText}>Hello, {username}!</Text>

        {/* Two Buttons in the Middle */}
        <View style={styles.tripRow}>
       
          <TouchableOpacity onPress={createNewTrip} style={styles.tripButton}>
            <Text style={styles.tripText}>New Trip</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { }} style={styles.tripButton}>
            <Text style={styles.tripText}>Edit Existing Trip</Text>
          </TouchableOpacity>

        </View>
      </View>

      <View style={styles.bottomScreen}>
        <Text >Insert stuff here</Text>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60, // For status bar space
    backgroundColor: '#fff',
  },

  backgroundImage: {
    width: "100%",
    height: 300,
    position: "absolute",
    resizeMode: "cover",
  },

  darkOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: 300,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },

  screenContainer: {
    flex: 1,
    flexDirection: "column",
    marginLeft: 20,
    marginRight: 20,
  },

  greetingText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 25,
    marginTop: 20,
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

  tripRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingTop: 50,
  },

  tripText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  },

  tripButton: {
    width: 140,
    height: 80,
    backgroundColor: "#24a6ad",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    borderColor: "#24a6ad",
    borderWidth: 3,

  },

  bottomScreen: {
    position: "absolute",
    backgroundColor: "white",
    top: 270,
    left: 0,
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },

  buttonContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
});

export default HomeScreen;