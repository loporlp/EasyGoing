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
        <View style={styles.container}>

            {/* Background Image */}
            <Image style={styles.backgroundImage} source={require("../assets/images/createTripImage.jpg")} />

            {/* Adds a dark overlay on the screen */}
            <View style={styles.darkOverlay} />

            {/* Other UI elements on the screen */}
            <View style={styles.createTripContainer}>
            <Text style={styles.createTripLabel}>Where are we{" "}
                <Text style={styles.highlightText}>going</Text>, Jason?</Text>
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
        height: undefined,
        position: "absolute",
        resizeMode: "cover",
        aspectRatio: 9 / 18,
    },
    darkOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: undefined,
        aspectRatio: 9 / 18,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
    createTripLabel: {
        fontWeight: "bold",
        color: "white",
        fontSize: 20,
    },
    highlightText: {
        color: "#24a6ad",
        fontSize: 20,
    },
    createTripContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 60,
    },
  });

  export default CreateNewTrip;