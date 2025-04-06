// SearchScreen.tsx
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Image, TouchableWithoutFeedback } from 'react-native';
import { useRouter } from 'expo-router'
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import DynamicImage from '../components/DynamicImage';
import { useEffect, useState } from 'react';
import { getData } from '../scripts/localStore';
import SavedDestinations from '../components/SavedDestinations';

const SavedDestinationsScreen = () => {
    const router = useRouter();

    // Get the saved destinations
    useEffect(() => {
        const fetchData = async () => {
            let accountInfo = await getData("savedDestinations");
            let savedDestinations = accountInfo[0].destinations;
            if (savedDestinations.length) {
                setDestinations(savedDestinations);  // Set the destinations in the state
            }
            else {
                // Default
                setDestinations(static_destinations);
            }
        };

        fetchData();
    }, []);

    // Example data
    const static_destinations = [
        {
            "destination": "Empire State Builing",
            "time": "3h",
            "review": "4.7(105k)",
            "price": "$25"
        },

        {
            "destination": "Tokyo Skytree",
            "time": "3h",
            "review": "4.4(95k)",
            "price": "$13"
        }
    ]

    const [destinations, setDestinations] = useState([]);

    /**
     * Goes to the Home Screen
     */
    const homeScreen = () => {
        router.replace("/HomeScreen")
    }

    /**
     * Goes to the Edit Existing Trips screen
     */
    const viewTrips = () => {
        router.replace("/EditExistingTripsScreen")
    }

    /**
     * Goes to the Account/Profile screen
     */
    const settingsScreen = () => {
        router.replace("/Settings")
    }

    const searchScreen = () => {
        router.replace("/SearchScreen")
    }

    // Swipable List components
    const [swipeStatus, setSwipeStatus] = useState<{ [key: string]: boolean }>({});

    //deletes location from both local storage and the destinations UI element
    const deleteLocation = (index: number) => {
        // Check if tripId is valid before proceeding

    };

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

    const renderHiddenItem = ({ item, index }: { item: any; index: number }) => (
        <View style={[styles.hiddenItem, { height: 100 }]}>
            <TouchableOpacity onPress={() => { }} style={[styles.deleteButton, { width: Math.abs(rightOpenValue) }]} onPressIn={() => deleteLocation(index)}>
                <Ionicons name="trash-bin" size={25} color={"white"} />
            </TouchableOpacity>
        </View>
    );

    const renderItem = ({ item }: any) => {
        const isSwiped = swipeStatus[item.key];
        return (
            <TouchableOpacity style={[styles.destination, { flexDirection: "row", alignItems: "center", borderRadius: isSwiped ? 0 : 10 }]} activeOpacity={1}>

                <DynamicImage placeName={item.name} containerStyle={styles.destinationImage} imageStyle={styles.destinationImage} />

                <View style={{ flexDirection: "column", justifyContent: "flex-start", gap: 5, marginLeft: 10, paddingRight: 140 }}>
                    <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                        <Ionicons name="location" size={20} color={"#24a6ad"} />
                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 20, fontWeight: "700", marginLeft: 5 }}>{item.name}</Text>
                    </View>

                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginRight: 5, gap: 5, width: "100%" }}>
                        <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                            <Ionicons name="time" size={18} color={"#24a6ad"} />
                            <Text style={{ marginLeft: 5 }}>{item.duration}</Text>
                        </View>

                        <View style={{ flexDirection: "row", alignItems: "center"}}>
                            <Ionicons name="star" size={18} color={"gold"} />
                            <Text>{item.review}</Text>
                        </View>

                        <View style={{ flex: 1, flexDirection: "row", alignItems: "center"}}>
                            <Text>{item.price}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    const rightOpenValue = -75;

    return (

        <View style={{ flex: 1, flexDirection: "column" }}>
            <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 50 }}>
                    <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 10 }}>Saved Destinations</Text>
                </View>

                {destinations.length === 0 ? (
                    <Text style={styles.text}>No saved destinations available.</Text>
                ) : (
                    <SavedDestinations
                        SavedDestinations={destinations}
                        handlePress={function (destination: any): void { } }
                        deleteLocation={function (index: number): void {
                            deleteLocation(index);
                        } } />
                )}

            </ScrollView>

            <View style={styles.navBar}>
                <TouchableOpacity style={{ padding: 10, marginLeft: 20 }} onPress={homeScreen}>
                    <Ionicons name="home" size={30} color={"lightgray"} />
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 10 }}>
                    <Ionicons name="bookmark" size={30} color={"#24a6ad"} />
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 10 }} onPress={searchScreen}>
                    <Ionicons name="search" size={30} color={"lightgray"} />
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 10 }} onPress={viewTrips}>
                    <Ionicons name="calendar" size={30} color={"lightgray"} />
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 10, marginRight: 20 }} onPress={settingsScreen}>
                    <Ionicons name="person" size={30} color={"lightgray"} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1, // Allows ScrollView to grow and be scrollable
        backgroundColor: '#f4f4f4',
        height: "100%",
        paddingHorizontal: 20
    },

    searchSection: {
        flexDirection: "row",
        marginVertical: 20,
        marginTop: 60,
        paddingHorizontal: 20,
        shadowColor: "#333333",
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },

    searchBar: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 10,
        paddingHorizontal: 5
    },

    navBar: {
        position: "absolute",
        bottom: 0,
        width: "100%",
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

    destinationInput: {
        height: 30,
        width: "80%",
        borderColor: '#999',
        marginBottom: 20,
        fontSize: 16,
        borderRadius: 10,
        paddingVertical: 5,
        alignSelf: 'center',
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
    },

    text: {
        color: "black",
        fontSize: 20,
        marginTop: 14,
    },
});

export default SavedDestinationsScreen;