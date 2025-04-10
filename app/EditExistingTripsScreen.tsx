// EditExistingTripsScreen.tsx
import { ScrollView, Image, StyleSheet, TouchableOpacity, Text, View, Modal, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useState, useEffect } from "react";
import { getData, storeData, fillLocal } from '../scripts/localStore';
import { deleteTrip, updateTrip } from '../scripts/databaseInteraction.js';
import Toast from 'react-native-toast-message';

const EditExistingTripsScreen = () => {
    const router = useRouter();

    // State to store the trips
    const [trips, setTrips] = useState<any[]>([]);
    const [selectedTripId, setSelectedTripId] = useState<any | null>(null);

    const [isModalVisible, setModalVisible] = useState(false);
    const [isRenamingVisible, setRenamingVisible] = useState(false);

    const [originalTripName, setOriginalTripName] = useState("");
    const [renameTripName, setRenameTripName] = useState("");
    const [getTrip, setRenameTrip] = useState<any | null>(null);

    // For anyone viewing this in the future, the 'error' in logs is because you're on Windows. These assets are being called correctly and do work.
    const tripImages = [
        require("../assets/images/editlocations/Africa.jpg"),
        require("../assets/images/editlocations/Alaska.jpg"),
        require("../assets/images/editlocations/Arkansas.jpg"),
        require("../assets/images/editlocations/China.jpg"),
        require("../assets/images/editlocations/Egypt.jpg"),
        require("../assets/images/editlocations/Egypt2.jpg"),
        require("../assets/images/editlocations/Florida.jpg"),
        require("../assets/images/editlocations/Georgia.jpg"),
        require("../assets/images/editlocations/Georgia2.jpg"),
        require("../assets/images/editlocations/India.jpg"),
        require("../assets/images/editlocations/India2.jpg"),
        require("../assets/images/editlocations/India3.jpg"),
        require("../assets/images/editlocations/Israel.jpg"),
        require("../assets/images/editlocations/Italy.jpg"),
        require("../assets/images/editlocations/Italy2.jpg"),
        require("../assets/images/editlocations/Jamaica.jpg"),
        require("../assets/images/editlocations/Japan.jpg"),
        require("../assets/images/editlocations/Kansas.jpg"),
        require("../assets/images/editlocations/LosAngles.jpg"),
        require("../assets/images/editlocations/Mexico.jpg"),
        require("../assets/images/editlocations/Mexico2.jpg"),
        require("../assets/images/editlocations/Mexico3.jpg"),
        require("../assets/images/editlocations/Michigan.jpg"),
        require("../assets/images/editlocations/Missouori.jpg"),
        require("../assets/images/editlocations/Montenegro.jpg"),
        require("../assets/images/editlocations/Netherlands.jpg"),
        require("../assets/images/editlocations/NewZealand.jpg"),
        require("../assets/images/editlocations/NorthCarolina.jpg"),
        require("../assets/images/editlocations/Paris.jpg"),
        require("../assets/images/editlocations/Paris2.jpg"),
        require("../assets/images/editlocations/Philippines.jpg"),
        require("../assets/images/editlocations/Philippines2.jpg"),
        require("../assets/images/editlocations/Russia.jpg"),
        require("../assets/images/editlocations/Santorini.jpg"),
        require("../assets/images/editlocations/Vietnam.jpg"),
        require("../assets/images/editlocations/Vietnam2.jpg"),
        require("../assets/images/editlocations/Vietnam3.jpg"),
    ];
      

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

                const reverseLoadTrips = loadedTrips.reverse();
                // Update the state with the loaded trips
                setTrips(reverseLoadTrips);
            } else {
                console.log("No trips available in local storage.");
            }
        };
        loadTrips();
    }, []);

    const showToast = (tripName: string) => {
        Toast.show({
            type: "success",
            text1: "Successfully deleted trip: " + tripName,
            text1Style: {
                fontSize: 12,
            }
        });
    }

    const editTrip = async (tripId: string) => {
        //set current trip before going to edit
        await storeData("currentTrip", tripId);
        router.push("/AddEditDestinations");
    }

    const budgetManagerScreen = async () => {
        setModalVisible(false);
        await storeData("currentTrip", selectedTripId);
        router.push("/BudgetManagerScreen");
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

    const getTripName = () => {
        const selectedTrip = trips.find(trip => trip.id === selectedTripId); // Find the selected trip by ID

        if (selectedTrip) {
            const tripName = selectedTrip.details.tripName ? selectedTrip.details.tripName : "Unnamed Trip";
            setOriginalTripName(tripName);
            setRenameTrip(selectedTrip)
        }

        setModalVisible(false);
        setRenamingVisible(true);
    }

    const renameTrip = async () => {

        const tripIndex = trips.findIndex((trip) => trip.id === getTrip.id);

        if (tripIndex === -1) {
            console.log("Trip not found");
            return;
        }

        const updatedTrip = {
            ...trips[tripIndex],
            details: {
                ...trips[tripIndex].details,
                tripName: renameTripName,
            },
        };

        const updateSuccess = await updateTrip(getTrip.id, updatedTrip.details);

        if (updateSuccess) {
            const updatedTrips = [...trips];
            updatedTrips[tripIndex] = updatedTrip;
            setTrips(updatedTrips);
            await storeData(getTrip.id, updatedTrip.details);
        }

        setRenamingVisible(false);
    }

    const deleteATrip = async (index: number, tripName: string) => {
        const deleteSuccess = await deleteTrip(index)
        if (deleteSuccess) {
            setTrips(prevTrips => prevTrips.filter(trips => trips.id !== index));
            setModalVisible(false)
        }

        showToast(tripName);
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
                            {/* Make this dynamic to take in trip.origin*/}
                            <Image
                                style={styles.backgroundImage}
                                source={tripImages[trip.id % tripImages.length]}
                            />
                            <View style={styles.darkOverlay} />
                            <View style={{ flexDirection: "row", justifyContent: "flex-end", position: "absolute", marginTop: 30, right: 0 }}>
                                <TouchableOpacity style={{ padding: 15, zIndex: 10 }} onPress={() => { setModalVisible(true); setSelectedTripId(trip.id) }}>
                                    <Ionicons name={"ellipsis-horizontal-circle-outline"} color={"white"} size={30} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.screenContainer}>
                                <View style={{ marginTop: 180, paddingHorizontal: 10 }}>
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

                {/* Renaming trips modal */}
                <Modal
                    visible={isRenamingVisible}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setRenamingVisible(false)}
                >
                    <View style={[styles.modalOverlay, { justifyContent: "center" }]}>
                        <View style={{ width: "90%", height: 150, backgroundColor: "#F4F4F4", padding: 20, borderRadius: 10 }}>
                            <Text style={{ fontSize: 15 }}>Enter new trip name for "{originalTripName}":</Text>
                            <TextInput style={styles.renameTextInput} onChangeText={setRenameTripName} />
                            <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 15, gap: 30 }}>
                                <TouchableOpacity onPress={() => setRenamingVisible(false)} style={{
                                    backgroundColor: "red",
                                    height: 35,
                                    width: 70,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    shadowColor: "#333333",
                                    shadowOffset: { width: 1, height: 2 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 3,
                                    borderRadius: 10
                                }}>
                                    <Text style={{ fontSize: 12, color: "white", fontWeight: "700" }}>CANCEL</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={renameTrip} style={{
                                    backgroundColor: "green",
                                    height: 35,
                                    width: 70,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    shadowColor: "#333333",
                                    shadowOffset: { width: 1, height: 2 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 3,
                                    borderRadius: 10
                                }}>
                                    <Text style={{ fontSize: 12, color: "white", fontWeight: "700" }}>OK</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                </Modal>

                {/* Menu options for each trip */}
                <Modal
                    visible={isModalVisible}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <TouchableOpacity style={{ height: "80%", width: "100%" }} onPress={() => setModalVisible(false)}></TouchableOpacity>
                        <View style={{ flexDirection: "column", width: "100%", height: "30%", backgroundColor: "white", borderTopRightRadius: 10, borderTopLeftRadius: 10, padding: 5 }}>

                            {/* Budget Manager */}
                            <TouchableOpacity style={styles.menuItem} onPress={budgetManagerScreen}>
                                <MaterialCommunityIcons name={"cash-marker"} color={"#24a6ad"} size={18} />
                                <Text style={{ fontSize: 18 }}>Budget Manager</Text>
                            </TouchableOpacity>

                            <View style={styles.divider}></View>

                            {/* Rename trip */}
                            <TouchableOpacity style={styles.menuItem} onPress={getTripName}>
                                <Ionicons name={"pencil"} color={"#24a6ad"} size={18} />
                                <Text style={{ fontSize: 18 }}>Rename Trip</Text>
                            </TouchableOpacity>

                            <View style={styles.divider}></View>

                            {/* Delete trip */}
                            <TouchableOpacity style={styles.menuItem} onPress={() => {
                                const selectedTrip = trips.find(trip => trip.id === selectedTripId); // Find the selected trip by ID

                                if (selectedTrip) {
                                    const tripName = selectedTrip.details.tripName ? selectedTrip.details.tripName : "Unnamed Trip";
                                    deleteATrip(selectedTripId, tripName)
                                }
                            }
                            }
                            >
                                <Ionicons name={"trash"} color={"red"} size={18} />
                                <Text style={{ fontSize: 18 }}>Delete Trip</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

            </ScrollView>

            <Toast />

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
    },

    divider: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 10,
        width: "100%"
    },

    renameTextInput: {
        height: 40,
        width: "100%",
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "lightgray",
        borderRadius: 10,
        padding: 5,
        fontSize: 18,
        marginTop: 10
    }

});

export default EditExistingTripsScreen;