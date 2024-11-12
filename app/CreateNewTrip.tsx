// CreateNewTrip.tsx
import React, { useEffect, useState } from 'react';
import { View, Button, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { useRouter } from "expo-router";

const CreateNewTrip = () => {

    // Sets up navigations
    const router = useRouter();

    /**
    * Will navigate to the "Account" screen after link is pressed.
    */
    const navigateToAccount = () => {
        router.push("/Account")
    }

    return (
        <Image style={styles.backgroundImage} source={require("../assets/images/createTripImage.jpg")} />
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
        height: "100%",
        resizeMode: "cover",
    },
  });

  export default CreateNewTrip;