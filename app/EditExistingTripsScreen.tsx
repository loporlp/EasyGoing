// EditExistingTripsScreen.tsx
import { ScrollView, Image, StyleSheet, TouchableOpacity, Text, View, Modal } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useState, useEffect } from "react";
import { getData, storeData, fillLocal } from '../scripts/localStore';

const EditExistingTripsScreen = () => {
    const router = useRouter();

    // State to store the trips
    const [trips, setTrips] = useState<any[]>([]);

    const [isModalVisible, setModalVisible] = useState(false);

    // Load trips when the component mounts
    useEffect(() => {
        const loadTrips = async () => {
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

    const editTrip = async (tripId: string) => {
        //set current trip before going to edit
        await storeData("currentTrip", tripId);
        router.push("/AddEditDestinations");
    }

    const homeScreen = () => {
        router.replace("/HomeScreen")
    }

    const searchScreen = () => {
        router.replace("/SearchScreen")
    }

    const settingsScreen = () => {
        router.replace("/Settings")
    }

    const createNewTrip = () => {
        console.log("Going to 'Create New Trip'...")
        router.push("/CreateNewTrip")
    }

    const savedDestinations = () => {
        router.replace("/SavedDestinationsScreen")
    }

    return (
        <View style={{ flex: 1, flexDirection: "column" }}>
            <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 50 }}>
                    <Text style={{ fontSize: 22, fontWeight: "700" }}>My Trips</Text>
                    <TouchableOpacity onPress={createNewTrip}>
                        <Ionicons name="add-circle" size={30} color="#24a6ad" />
                    </TouchableOpacity>
                </View>



                {trips.length > 0 ? (
                    trips.map((trip) => (
                        <TouchableOpacity
                            key={trip.id}
                            style={styles.tripButton}
                            onPress={() => editTrip(trip.id)}
                        >
                            <Image
                                style={styles.backgroundImage}
                                source={require("../assets/images/newyorkcity.jpg")}
                            />
                            <View style={styles.darkOverlay} />

                            <View style={styles.screenContainer}>
                                <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                                    <TouchableOpacity style={{ padding: 10 }} onPress={() => setModalVisible(true)}>
                                        <Ionicons name={"ellipsis-horizontal-circle-outline"} color={"white"} size={30} />
                                    </TouchableOpacity>
                                </View>

                                <View style={{ marginTop: 120, paddingHorizontal: 10 }}>
                                    <Text style={styles.upcoming}>UPCOMING TRIP</Text>
                                    <Text style={styles.destinationName}>{trip.details?.tripName ? String(trip.details.tripName) : "Unnamed Trip"}</Text>
                                    <Text numberOfLines={1} style={styles.dates}>{trip.details?.tripStartDate && trip.details?.tripEndDate
                                        ? `${String(trip.details.tripStartDate)} - ${String(trip.details.tripEndDate)}`
                                        : "Dates Unavailable"}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={{ textAlign: 'center', fontSize: 16 }}>No trips available. Please create a new one.</Text>
                )}

                <Modal
                    visible={isModalVisible}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={{ flexDirection: "column", width: "100%", height: "20%", backgroundColor: "white", borderTopRightRadius: 10, borderTopLeftRadius: 10, padding: 5 }}>
                            <TouchableOpacity style={styles.menuItem} onPress={() => setModalVisible(false)}>
                                <MaterialIcons name={"cancel"} color={"#24a6ad"} size={18} />
                                <Text style={{ fontSize: 18 }}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.menuItem}>
                                <Ionicons name={"pencil"} color={"#24a6ad"} size={18} />
                                <Text style={{ fontSize: 18 }}>Rename Trip</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.menuItem}>
                                <Ionicons name={"trash"} color={"red"} size={18} />
                                <Text style={{ fontSize: 18 }}>Delete Trip</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

            </ScrollView>
            <View style={styles.navBar}>
                <TouchableOpacity style={{ padding: 10, marginLeft: 20 }} onPress={homeScreen}>
                    <Ionicons name="home" size={30} color={"lightgray"} />
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 10 }} onPress={savedDestinations}>
                    <Ionicons name="bookmark" size={30} color={"lightgray"} />
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 10 }} onPress={searchScreen}>
                    <Ionicons name="search" size={30} color={"lightgray"} />
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 10 }}>
                    <Ionicons name="calendar" size={30} color={"#24a6ad"} />
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 10, marginRight: 20 }} onPress={settingsScreen}>
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
        paddingHorizontal: 20
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

    tripButton: {
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
        marginTop: 30,
        zIndex: 1, // Ensures text is above the overlay
        flexDirection: "column"
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
    },

    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },

    menuItem: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 10,
        marginLeft: 5,
        padding: 10
    }

});

export default EditExistingTripsScreen;