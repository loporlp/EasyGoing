// EditExistingTripsScreen.tsx
import { ScrollView, Image, StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from "react";
import { getData, storeData, fillLocal } from '../scripts/localStore';

const EditExistingTripsScreen = () => {
    const router = useRouter();

    // State to store the trips
    const [trips, setTrips] = useState<any[]>([]);

    // Load trips when the component mounts
    useEffect(() => {
        const loadTrips = async () => {
            // First, ensure local storage is filled with trips if necessary
            await fillLocal();
            // Get the list of trip IDs from local storage
            const tripIDs = await getData("tripIDs");
            if (tripIDs && tripIDs.length > 0) {
                const loadedTrips = [];
                // Loop through each trip ID and fetch the trip details from local storage
                for (const tripID of tripIDs) {
                    const tripDetails = await getData(tripID);
                    if (tripDetails) {
                        loadedTrips.push({ id: tripID, details: tripDetails });
                    }
                }
                // Update the state with the loaded trips
                setTrips(loadedTrips);
            } else {
                console.log("No trips available in local storage.");
            }
        };
        loadTrips();
    }, []);


    const editTrip = () => {
        router.push("/AddEditDestinations");
    }

    const homeScreen = () => {
        router.replace("/HomeScreen")
    }

    const searchScreen = () => {
        router.replace("/SearchScreen")
    }

    const accountScreen = () => {
        router.replace("/Account")
    }

    const createNewTrip = () => {
        console.log("Going to 'Create New Trip'...")
        router.push("/CreateNewTrip")
    }

    return (
        <View style={{ flex: 1, flexDirection: "column" }}>
            <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
                <View style={{flexDirection: "row", justifyContent:"space-between", alignItems: "center", marginTop: 50 }}>
                    <Text style={{ fontSize: 22, fontWeight: "700" }}>My Trips</Text>
                    <TouchableOpacity onPress={createNewTrip}>
                        <Ionicons name="add-circle" size={30} color="#24a6ad" />
                    </TouchableOpacity>
                </View>


                {/* Map through the trips and dynamically display them */}
                {trips.length > 0 ? (
                    trips.map((trip) => (
                        <TouchableOpacity style={styles.tripButtonTokyo} onPress={editTrip}>
                            <Image style={styles.backgroundImage} source={require("../assets/images/newyorkcity.jpg")} /> {/*TODO: make this a picture from trip itself */}
                            <View style={styles.darkOverlay} />
                            <View style={styles.screenContainer}>
                                <Text style={styles.upcoming}>UPCOMING TRIP</Text>
                                <Text style={styles.destinationName}>{trip.tripName}</Text>
                                <Text style={styles.dates}>{trip.tripStartDate} - {trip.tripEndDate}</Text>
                            </View>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={{ textAlign: 'center', fontSize: 16 }}>No trips available. Please create a new one.</Text>
                )}
                { /* New York City trip */}
                <TouchableOpacity style={styles.tripButtonTokyo} onPress={editTrip}>
                    <Image style={styles.backgroundImage} source={require("../assets/images/newyorkcity.jpg")} />
                    <View style={styles.darkOverlay} />
                    <View style={styles.screenContainer}>
                        <Text style={styles.upcoming}>UPCOMING TRIP</Text>
                        <Text style={styles.destinationName}>New York City, USA</Text>
                        <Text style={styles.dates}>Sat. Jul 13 - Sun. Jul 14</Text>
                    </View>
                </TouchableOpacity>
                
            </ScrollView>
            <View style={styles.navBar}>
                <TouchableOpacity style={{ padding: 10, marginLeft: 20 }} onPress={homeScreen}>
                    <Ionicons name="home" size={30} color={"lightgray"} />
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 10 }} onPress={searchScreen}>
                    <Ionicons name="search" size={30} color={"lightgray"} />
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 10 }}>
                    <Ionicons name="calendar" size={30} color={"#24a6ad"} />
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 10, marginRight: 20 }} onPress={accountScreen}>
                    <Ionicons name="person" size={30} color={"lightgray"} />
                </TouchableOpacity>
            </View>
        </View>



    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1, // Allows ScrollView to grow and be scrollable
        backgroundColor: '#fff',
        height: "100%",
        paddingLeft: 25,
        paddingRight: 25,
    },

    darkOverlay: {
        position: "absolute",
        top: 30,
        left: 0,
        width: "100%",
        height: 250,
        borderRadius: 10,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },

    darkOverlayPastTrip: {
        position: "absolute",
        top: 30,
        left: 0,
        width: "100%",
        height: 250,
        borderRadius: 10,
        backgroundColor: "rgba(255, 255, 255, 0.5)",
    },

    tripButtonTokyo: {
        width: "100%",
        height: 250,
        marginBottom: 10,
    },

    backgroundImage: {
        resizeMode: "cover",
        marginTop: 30,
        height: 250,
        width: "100%",
        borderRadius: 10,
    },

    screenContainer: {
        position: "absolute",
        top: 200, // Positioning text below the image
        left: 20,
        right: 20,
        zIndex: 1, // Ensures text is above the overlay
        flexDirection: "column",
    },

    upcoming: {
        color: "lightgray",
    },

    destinationName: {
        color: "white",
        fontSize: 25,
        fontWeight: "bold",
    },

    dates: {
        color: "white",
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
    }

});

export default EditExistingTripsScreen;