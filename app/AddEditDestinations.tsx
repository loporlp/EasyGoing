// AddEditDestinations.tsx
import { useState, useLayoutEffect } from 'react';
import { View, Image, StyleSheet, TextInput, Text, TouchableOpacity, ScrollView, Dimensions, Modal, ImageBackground, Button } from "react-native";
import { useRouter } from "expo-router";
import AutocompleteTextBox from '../components/AutoCompleteTextBox';
import { storeData, getData } from '../scripts/localStore.js';
import DynamicImage from '../components/DynamicImage';
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SwipeListView } from 'react-native-swipe-list-view';

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

    // Swipable List components
    const [swipeStatus, setSwipeStatus] = useState<{ [key: string]: boolean }>({});

    // Function to handle swipe state
    const handleSwipeChange = (swipeData: any) => {
        const { key, value } = swipeData;
        if (value !== 0) {
            // If swiping, remove border radius
            setSwipeStatus((prevState) => ({ ...prevState, [key]: true }));
        } else {
            // If swipe is reset, restore border radius
            setSwipeStatus((prevState) => ({ ...prevState, [key]: false }));
        }
    };

    const renderHiddenItem = ({ item, rowMap }: any) => (
        <View style={[styles.hiddenItem, { height: 100 }]}>
            <TouchableOpacity onPress={() => { }} style={[styles.editButton, { width: Math.abs(rightOpenValue / 2) }]}>
                <Ionicons name="pencil-sharp" size={25} color={"white"} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { }} style={[styles.deleteButton, { width: Math.abs(rightOpenValue / 2) }]}>
                <Ionicons name="trash-bin" size={25} color={"white"} />
            </TouchableOpacity>
        </View>
    );

    const renderItem = ({ item }: any) => {
        const isSwiped = swipeStatus[item.key];
        return (
            <View
                style={[
                    styles.destination,
                    { borderRadius: isSwiped ? 0 : 10 },
                ]}
            >
                <View style={{flex: 1, flexDirection: "row", justifyContent: "flex-start", alignItems: "center"}}>
                    <DynamicImage placeName={item.name} containerStyle={styles.destinationImage} imageStyle={styles.destinationImage} />
                    <Text style={{flex: 1}}>{item.name}</Text>
                </View>
            </View>
        );
    }

    const rightOpenValue = -150;

    return (
        <View style={styles.container}>
            {/* Background image */}
            <DynamicImage placeName="New York City" containerStyle={styles.backgroundImage} imageStyle={styles.backgroundImage} />
            <View style={styles.darkOverlay}></View>

            <View style={{ flex: 1, flexDirection: "column", marginHorizontal: 20, position: "absolute", marginTop: 50 }}>
                <TouchableOpacity onPress={() => { navigation.goBack() }}>
                    <Ionicons name="arrow-back-outline" size={30} color={"white"} />
                </TouchableOpacity>

                {/* Group of text fields */}
                <View style={{ marginTop: 15 }}>
                    <TouchableOpacity style={[styles.input, { flex: 1, flexDirection: "row", alignItems: 'center' }]}>
                        <Ionicons name="location" size={22} color={"#24a6ad"} />
                        <TextInput placeholder="New York City, USA" placeholderTextColor="black" style={{ fontSize: 16, marginLeft: 5 }} />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.input, { flex: 1, flexDirection: "row", alignItems: 'center' }]}>
                        <Ionicons name="calendar-sharp" size={22} color={"#24a6ad"} />
                        <TextInput placeholder="Fri, Jul. 11 - Tue, Jul. 15" placeholderTextColor="black" style={{ fontSize: 16, marginLeft: 5 }} />
                    </TouchableOpacity>

                    <View style={styles.travelersAndBudgetTextField}>
                        <TouchableOpacity style={[styles.travelerInput, { flex: 1, flexDirection: "row", alignItems: 'center' }]}>
                            <Ionicons name="people" size={22} color={"#24a6ad"} />
                            <TextInput placeholder="1 traveler" placeholderTextColor="black" keyboardType="numeric" style={{ fontSize: 16, marginLeft: 5 }} />
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.budgetInput, { flex: 1, flexDirection: "row", alignItems: 'center' }]}>
                            <Ionicons name="wallet" size={22} color={"#24a6ad"} />
                            <TextInput placeholder="$1,700" placeholderTextColor="black" keyboardType="numeric" style={{ fontSize: 16, marginLeft: 5 }} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Scrollable window that displays all the destinations added */}
            <View style={styles.destinationScreen}>
                <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 10, marginHorizontal: 20, marginTop: 10 }}>Destinations Selected <Text style={{color: "#24a6ad"}}>({destinations.length})</Text>:</Text>
                <SwipeListView
                    data={destinations.map((item, index) => ({ ...item, key: `${index}` }))}
                    renderItem={renderItem}
                    renderHiddenItem={renderHiddenItem}
                    leftOpenValue={rightOpenValue}
                    rightOpenValue={rightOpenValue}
                    friction={60}
                    tension={30}
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                    onSwipeValueChange={handleSwipeChange}>
                </SwipeListView>
            </View>

            <View style={styles.navBar}>
                <TouchableOpacity style={{ padding: 10, marginLeft: 20 }}>
                    <Ionicons name="add" size={30} color={"#24a6ad"} />
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 10 }}>
                    <MaterialCommunityIcons name="application-import" size={30} color={"#24a6ad"} />
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 10, marginRight: 20 }}>
                    <Ionicons name="arrow-forward-circle-sharp" size={30} color={"#24a6ad"} />
                </TouchableOpacity>
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
        backgroundColor: "white",
        paddingLeft: 10,
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
        paddingLeft: 10,
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
        maxWidth: "100%",
        overflow: "hidden",
        borderColor: '#999',
        borderBottomWidth: 1,
        marginBottom: 10,
        backgroundColor: "white",
        borderRadius: 10,
        paddingLeft: 10,
        paddingTop: 5,
        paddingBottom: 5,
        paddingRight: 25,
        shadowColor: "#333333",
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3
    },

    // ==== BOTTOM SCREEN ==== //
    destinationScreen: {
        backgroundColor: "#F4F4F4",
        flex: 1,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        marginTop: -40,
    },

    navBar: {
        flexDirection: "row",
        backgroundColor: "white",
        justifyContent: "space-between",
        alignItems: "center",
        height: "8%",
        shadowColor: "#333333",
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },

    destination: {
        backgroundColor: "white",
        width: "100%",
        height: 100,
        marginBottom: 10,
        borderRadius: 10,
        shadowColor: "#333333",
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },

    destinationImage: {
        width: 100,
        height: 100,
        resizeMode: "cover",
        overflow: "hidden",
        borderRadius: 10,
        marginLeft: -30
    },

    hiddenItem: {
        backgroundColor: "white",
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: 'center',
        borderRadius: 10,
        width: "100%",
        marginBottom: 10,
    },

    deleteButton: {
        backgroundColor: "red",
        height: "100%",
        paddingHorizontal: 15,
        justifyContent: "center",
        alignItems: "center",
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10
    },

    editButton: {
        backgroundColor: "#24a6ad",
        height: "100%",
        paddingHorizontal: 15,
        justifyContent: "center",
        alignItems: "center",
    }
});

export default AddEditDestinations;