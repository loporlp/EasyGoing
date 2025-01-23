// AddEditDestinations.tsx
import { useState, useLayoutEffect } from 'react';
import { View, Image, StyleSheet, TextInput, Text, TouchableOpacity, ScrollView, Dimensions, Modal, ImageBackground, Button } from "react-native";
import { useRouter } from "expo-router";
import AutocompleteTextBox from '../components/AutoCompleteTextBox';
import { storeData, getData } from '../scripts/localStore.js';
import DynamicImage from '../components/DynamicImage';
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

//stores destination object in local storage with key 'destination'
async function storeDestination(key: string, destination: any) {
    await storeData(key, destination);
    console.log(`New Destination stored as ${key} with values: 
        Name - ${destination.name}, 
        Address - ${destination.address}, 
        Image - ${destination.image}, 
        Duration - ${destination.duration}, 
        Priority - ${destination.priority}, 
        Route - ${destination.route}, 
        Notes - ${destination.notes}`);
}

//retrieves destination object in local storage with key provided
async function retrieveDestination(key: string) {
    try {
        const destination = await getData(key);
        console.log(`Retrieved ${key} with values: 
            Name - ${destination.name}, 
            Address - ${destination.address}, 
            Image - ${destination.image}, 
            Duration - ${destination.duration}, 
            Priority - ${destination.priority}, 
            Route - ${destination.route}, 
            Notes - ${destination.notes}`);
        return destination; // Return the destination object as it was stored originally
    } catch (e) {
        console.error(`Error retrieving ${key}:`, e);
        return null;
    }
}

const { height } = Dimensions.get('window');

const AddEditDestinations = () => {
    const router = useRouter();
    const navigation = useNavigation();
    // Modal (Pop-up)
    const [visible, setVisible] = useState(false);
    const show = () => setVisible(true);
    const hide = () => setVisible(false);

    const addLocation = () => {
        // If missing a required field
        let errorMessage = "";
        if (!locationAddress) {
            errorMessage += "Address is required.\n";
        }
        if (!duration) {
            errorMessage += "Duration is required.\n";
        }
        if (errorMessage) {
            alert(errorMessage.trim());
            return;
        }

        // Set default priority to -1 (as an integer) if it's empty or invalid
        const priorityValue = priority.trim() === "" || isNaN(Number(priority)) ? -1 : parseInt(priority);

        // If no location is provided, extract the name from the address (before the first comma)
        const name = location || (locationAddress?.description && typeof locationAddress.description === 'string'
            ? locationAddress.description.split(",")[0]?.trim()
            : 'Unnamed Location');
        //console.log("Extracted name:", name);

        const newDestination = {
            name: name,
            address: locationAddress,
            image: name,
            duration: duration,
            priority: priorityValue,
            route: "",
            notes: typedNotes
        };

        setDestinations(prevDestinations => [...prevDestinations, newDestination]);

        console.log(destinations);

        // Store the new destination in AsyncStorage
        storeDestination("destination", newDestination);
        retrieveDestination("destination");

        // Clear the input fields after adding
        setLocation("");
        setLocationAddress("");
        setDuration("");
        setPriority("");
        setNotes("");

        // Re-hides input screen
        hide();
    };

    const deleteLocation = (index: number) => {
        setDestinations(prevDestinations => prevDestinations.filter((_, i) => i !== index));
    };

    const [destinations, setDestinations] = useState([
        {
            name: "Tokyo Skytree",
            address: "",
            image: "Tokyo Skytree",
            duration: "2 hrs",
            priority: 2,
            route: "/HomeScreen_API_Test",
            notes: ""
        },
        {
            name: "Akihabara Electric Town",
            address: "",
            image: "Akihabara Electric Town",
            duration: "6 hrs",
            priority: 1,
            route: "",
            notes: ""
        },
        {
            name: "Pokemon Center",
            address: "",
            image: "Pokemon Center",
            duration: "1.5 hrs",
            priority: 3,
            route: "",
            notes: ""
        },
        {
            name: "Meiji Jingu",
            address: "",
            image: "Meiji Jingu",
            duration: "2 hrs",
            priority: 3,
            route: "",
            notes: ""
        },
        {
            name: "Imperial Palace",
            address: "",
            image: "Imperial Palace",
            duration: "2 hrs",
            priority: 4,
            route: "",
            notes: ""
        }
    ]);

    const [location, setLocation] = useState("");
    const [locationAddress, setLocationAddress] = useState("");
    const [duration, setDuration] = useState("");
    const [priority, setPriority] = useState("");
    const [typedNotes, setNotes] = useState("");

    return (
        <View style={styles.container}>

            {/* Background image + TextInputs */}
            <DynamicImage placeName="New York City" containerStyle={styles.backgroundImage} imageStyle={styles.backgroundImage} />
            <View style={styles.darkOverlay}></View>

            <View style={{ flex: 1, flexDirection: "column", marginHorizontal: 20, position: "absolute", marginTop: 50 }}>
                <TouchableOpacity onPress={() => { navigation.goBack() }}>
                    <Ionicons name="arrow-back-outline" size={30} color={"white"} />
                </TouchableOpacity>

                {/* Group of text fields for travelers and budget */}
                <View style={{marginTop: 15}}>
                    <TextInput placeholder="New York City, USA" placeholderTextColor="black" style={styles.input} />
                    <TextInput placeholder="Fri, Jul. 11 - Tue, Jul. 15" placeholderTextColor="black" style={styles.input} />
                    <View style={styles.travelersAndBudgetTextField}>
                        <TextInput placeholder="1 traveler" placeholderTextColor="black" keyboardType="numeric" style={styles.travelerInput} />
                        <TextInput placeholder="$1,700" placeholderTextColor="black" keyboardType="numeric" style={styles.budgetInput} />
                    </View>
                </View>

                <View style={styles.destinationScreen}>

                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: "#F4F4F4"
    },

    backgroundImage: {
        width: "100%",
        borderRadius: 0,
        position: "absolute",
        resizeMode: "cover",
        left: 0,
        top: 0
    },

    darkOverlay: {
        position: "relative",
        top: 0,
        left: 0,
        width: "100%",
        height: 300,
        resizeMode: "cover",
        backgroundColor: "rgba(0, 0, 0, 0.4)"
    },

    travelerInput: {
        height: 40,
        flex: 1,
        borderColor: '#999',
        borderBottomWidth: 1,
        marginRight: 10,
        fontSize: 16,
        backgroundColor: "white",
        paddingLeft: 20,
        borderRadius: 10,
        paddingTop: 5,
        paddingBottom: 5,
        shadowColor: "#333333",
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3
    },

    budgetInput: {
        height: 40,
        width: "50%",
        borderColor: '#999',
        borderBottomWidth: 1,
        fontSize: 16,
        backgroundColor: "white",
        paddingLeft: 20,
        borderRadius: 10,
        paddingTop: 5,
        paddingBottom: 5,
        shadowColor: "#333333",
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3
    },

    travelersAndBudgetTextField: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 10,
    },

    input: {
        height: 40,
        width: "100%",
        borderColor: '#999',
        borderBottomWidth: 1,
        marginBottom: 10,
        fontSize: 16,
        backgroundColor: "white",
        borderRadius: 10,
        paddingLeft: 20,
        paddingTop: 5,
        paddingBottom: 5,
        shadowColor: "#333333",
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3
    },

    // ==== BOTTOM SCREEN ==== //
    destinationScreen: {
        backgroundColor: "#F4F4F4",
        height: "100%",
        marginHorizontal: -20,
        marginTop: 20,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    }
});

export default AddEditDestinations;