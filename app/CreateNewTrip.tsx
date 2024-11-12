// CreateNewTrip.tsx
import React, { useEffect, useState } from 'react';
import { View, Button, StyleSheet, TouchableOpacity, Text, Image, TextInput } from 'react-native';
import { useRouter } from "expo-router";

export const head = () => ({
    title: "Create New Trip"
});

const CreateNewTrip = () => {

    // Sets up navigations
    const router = useRouter();

    return (
        <View style={styles.container}>

            {/* Background Image */}
            <Image style={styles.backgroundImage} source={require("../assets/images/createTripImage.jpg")} />

            {/* Adds a dark overlay on the screen */}
            <View style={styles.darkOverlay} />

            {/* Other UI elements on the screen */}
            <View style={styles.createTripContainer}>
                <Text style={styles.createTripLabel}>Where are we{" "}
                    <Text style={styles.highlightText}>going</Text>, Traveler?</Text>
                <TextInput placeholder="Destination" placeholderTextColor="lightgray" style={styles.input} />
                <TextInput placeholder="Dates" placeholderTextColor="lightgray" style={styles.input} />
                <View style={styles.travelersAndBudgetTextField}>
                    <TextInput placeholder="Travelers" placeholderTextColor="lightgray" keyboardType="numeric" style={styles.travelerInput} />
                    <TextInput placeholder="Budget" placeholderTextColor="lightgray" keyboardType="numeric" style={styles.budgetInput} />
                </View>
                <TouchableOpacity style={styles.createPlanButton} onPress={() => {}}>
                    <Text style={styles.startPlanningButtonText}>Start Planning!</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
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
        fontSize: 25,
        marginTop: 60,
        marginBottom: 40,
    },
    highlightText: {
        color: "#24a6ad",
        fontSize: 25,
    },
    createTripContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 80,
        marginLeft: 10,
        marginRight: 10,
    },
    textFields: {
        flex: 1,
        flexDirection: "column",
        alignContent: "center",
    },
    input: {
        height: 40,
        width: "80%",
        borderColor: '#999',
        borderBottomWidth: 1,
        marginBottom: 20,
        fontSize: 16,
        backgroundColor: "white",
        paddingLeft: 20,
      },
    
    travelerInput: {
        height: 40,
        flex: 1,                             // Take up the remaining space
        borderColor: '#999',
        borderBottomWidth: 1,
        marginRight: 10,                     // Space between inputs
        fontSize: 16,
        backgroundColor: "white",
        paddingLeft: 20,
    },

    budgetInput: {
        height: 40,
        width: "50%",                       // Budget input has a fixed width
        borderColor: '#999',
        borderBottomWidth: 1,
        fontSize: 16,
        backgroundColor: "white",
        paddingLeft: 20,
    },

    travelersAndBudgetTextField: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        width: "80%",
        marginLeft: 10,
        marginRight: 10,
      },
    createPlanButton: {
        backgroundColor: "#24a6ad",  // Button background color
        paddingVertical: 15,          // Vertical padding
        paddingHorizontal: 40,        // Horizontal padding
        borderRadius: 25,             // Rounded corners
        marginTop: 20,                // Space between inputs and button
        justifyContent: "center",     // Center text horizontally
        alignItems: "center",         // Center text vertically
        elevation: 5,                 // Shadow for Android
        shadowColor: "#000",          // Shadow for iOS
        shadowOffset: { width: 0, height: 4 },  // Shadow offset for iOS
        shadowOpacity: 0.1,           // Shadow opacity for iOS
        shadowRadius: 5,   
        marginBottom: 60,

    },
    startPlanningButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 40,
        marginRight: 40,
    },
  });

  export default CreateNewTrip;