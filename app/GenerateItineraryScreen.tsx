// GenerateItineraryScreen.tsx
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import MapMarker from '../components/MapMarker';
import RouteMap from '../components/RouteMap';
import { Dimensions } from "react-native";
import { useState } from "react";

const { height } = Dimensions.get('window');

const GenerateItineraryScreen = () => {
    const router = useRouter();

    const destinations = {
        akihabara: { name: "Akihabara Electric Town", coords: { latitude: 35.7100, longitude: 139.8107 }, image: require("../assets/images/AkihabaraElectricTown.jpg") },
        skytree: { name: "Tokyo Skytree", coords: { latitude: 35.7023, longitude: 139.7745 }, image: require("../assets/images/tokyoskytree.jpg") },
        pokemon: { name: "Pokemon Center", coords: { latitude: 35.6620, longitude: 139.6984 }, image: require("../assets/images/PokemonCenterShibuya.png") },
        meiji: { name: "Meiji Jingu", coords: { latitude: 35.6764, longitude: 139.6993 }, image: require("../assets/images/MeijiJingu.jpg") },
        palace: { name: "Imperial Palace", coords: { latitude: 35.6852, longitude: 139.7528 }, image: require("../assets/images/ImperialPalace.jpg") },
    };

    const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
    const [transportationText, setTransportationText] = useState("driving");
    const selectedCoordinates = {
        // Default coordinates (e.g., Tokyo Station)
        latitude: 35.652832,
        longitude: 139.839478,
    };

    // Determine the route based on the selected destination
    const getRouteDestination = (destination: string) => {
        switch (destination) {
            case "akihabara":
                return destinations.skytree;
            case "skytree":
                return destinations.pokemon;
            case "pokemon":
                return destinations.meiji;
            case "meiji":
                return destinations.palace;
            default:
                return destinations.skytree; // TODO: Change default?
        }
        };

    const handlePress = (destination : string) => {
        setSelectedDestination(prev => prev === destination ? null : destination);
    };

    const handleModeChange = (text : any) => {
        // Update the transportation text when a mode button is pressed
        setTransportationText(text);
    };

    const getRouteText = () => {
        if (!selectedDestination) return "";
        const routeDestination = getRouteDestination(selectedDestination);
        return `${transportationText} instructions to ${routeDestination.name}.`;
    };

    const reviewItinerary = () => {
        router.push("/ReviewItineraryScreen");
    }

    return (
        <View style={styles.container}>
            <RouteMap
                origin={selectedCoordinates}
                destination={selectedDestination ? destinations[selectedDestination].coords : selectedCoordinates}
                style={styles.map}
                onModeChange={handleModeChange}
            />

            <ScrollView contentContainerStyle={styles.scrollViewContainer} style={styles.scrollView}>
                <View style={styles.dateHeader}>
                    <Text style={styles.dateText}>Sat, Jul. 12   v</Text>
                </View>

                {Object.keys(destinations).map((destinationKey) => (
                    <View key={destinationKey}>
                        <TouchableOpacity style={styles.destinationElement} onPress={() => handlePress(destinationKey)}>
                            {/* Background with opacity */}
                            <View style={styles.backgroundContainer}>
                                <View style={styles.backgroundOverlay}></View>
                            </View>

                            <View style={styles.destinationContainer}>
                                <Image style={styles.destinationImage} source={destinations[destinationKey].image} />
                                <View style={styles.destinationLabel}>
                                    <Text style={styles.destinationName}>{destinations[destinationKey].name}</Text>
                                    <Text style={styles.destinationDetails}>Duration: {destinationKey === 'akihabara' ? '6 hrs' : '2 hrs'} | Priority: {destinationKey === 'akihabara' ? 1 : 2}</Text> // TODO: Make this generic for different priority and stuff
                                </View>
                            </View>
                        </TouchableOpacity>

                        {selectedDestination === destinationKey && (
                            <View style={styles.additionalInfo}>
                                <Text style={styles.additionalText}>{getRouteText()}</Text>
                            </View>
                        )}
                    </View>
                ))}
            </ScrollView>

            {/* "Review Itinerary" button */}
            <TouchableOpacity style={styles.reviewItineraryButton} onPress={reviewItinerary}>
                <Text style={styles.buttonText}>Review Itinerary</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: '#fff',
    },

    map: {
        width: "100%",
        height: 350,
        marginBottom: 0,
    },

    // ==== DESTINATION ELEMENT ==== //
    destinationElement: {
        width: "100%",
        height: 75,
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center",
        padding: 5,
        position: "relative",
    },

    destinationImage: {
        height: 70,
        width: 70,
        borderRadius: 10,
    },

    destinationContainer: {
        flexDirection: "row",
        justifyContent: "center",
    },

    destinationLabel: {
        flexDirection: "column",
        marginLeft: 10,
        justifyContent: "center",
    },

    destinationName: {
        color: "white",
        fontSize: 22,
        fontWeight: "bold",
    },

    destinationDetails: {
        color: "white",
        fontSize: 18,
    },

    backgroundContainer: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 10,
        overflow: "hidden",
    },

    backgroundOverlay: {
        flex: 1,
        backgroundColor: "#24a6ad",
        borderRadius: 10,
    },

    // ==== SCROLL WINDOW FOR DESTINATIONS ==== //
    scrollViewContainer: {
        flexGrow: 1,
        alignItems: "center",
        paddingLeft: 10,
        paddingRight: 10,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: "white",
    },

    scrollView: {
        maxHeight: height * 0.4,
        borderRadius: 10,
        overflow: "hidden",
        marginBottom: 10,
    },

    // ==== GENERATE PLAN BUTTON ==== //
    reviewItineraryButton: {
        backgroundColor: "#24a6ad",
        paddingVertical: 10,
        paddingHorizontal: 40,
        borderRadius: 15,
        marginTop: 20,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        alignSelf: "center",
        marginBottom: 10,
    },

    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 20,
        marginRight: 20,
    },


    dateHeader: {
        flexDirection: "row",
        marginTop: 10,
        backgroundColor: "gray",
        color: "white",
        width: "100%",
    },

    dateText: {
        color: "white",
        marginLeft: 20,
        marginTop: 10,
        marginBottom: 10,
        fontSize: 18,
    },

    additionalInfo: {
        marginTop: 10,
        backgroundColor: "#f0f0f0",
        padding: 10,
        borderRadius: 5,
    },

    additionalText: {
        fontSize: 16,
        color: "#333",
    },
});

export default GenerateItineraryScreen;
