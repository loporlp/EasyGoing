// GenerateItineraryScreen.tsx
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Image, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import MapMarker from '../components/MapMarker';
import RouteMap from '../components/RouteMap';
import MultiRoutesMap from '../components/MultiRoutesMap';
import DynamicImage from '../components/DynamicImage';
import { calculateOptimalRoute } from '../scripts/optimalRoute.js';
import { Dimensions } from "react-native";
import { useState, useEffect, useRef } from "react";
import { storeData, getData } from '../scripts/localStore.js';

const { height } = Dimensions.get('window');

const GenerateItineraryScreen = () => {
    const router = useRouter();

    // Routes
    const [polylinesData, setPolylinesData] = useState<any[]>([]);
    const handlePolylinesReady = (polylines: any[]) => {
        setPolylinesData(polylines);
        console.log('Polylines Data:', polylines);

        // TODO: Store this data
      };

    type Place = {
        alias: string;
        address: string;
        priority: number;
        mode: string;
        transportToNext: string;
        transportDuration: number;
        startDateTime: string;
        duration: number;
        notes: string;
        dayOrigin: boolean;
        cost: number;
        picture: string;
    };


    const [origin, setOrigin] = useState<{ name: string; address: string }>();

    // Initial empties
    const [destinations, setDestinations] = useState<Record<string, Place>>({});
    const [optimalRoute, setOptimalRoute] = useState<any[][]>([]);
    const [transportationModes, setTransportationModes] = useState<string[]>([]);

    // Extract transportation mode
    useEffect(() => {
        if (Object.keys(destinations).length > 1) {
            // Get transportation modes for all but the last destination
            const modes = Object.values(destinations)
                .map(destination => destination.mode || 'DRIVING'); // Default to 'DRIVING' if mode is missing

            setTransportationModes(modes);
            console.log("Transport Modes", transportationModes);
        }
    }, [destinations]);

    // Fetch destinations on mount
    useEffect(() => {
        console.log("On GenerateItineraryScreen");
        const fetchDestinations = async () => {
            const loadedDestinations = await loadDestinations();
            console.log("Loaded Destinations:", loadedDestinations);
            setDestinations(loadedDestinations); // Update state with loaded destinations
        };

        fetchDestinations();
    }, []);

    // Function to fetch destinations
    const loadDestinations = async () => {
        const formattedDestinations: Record<string, Place> = {};
        try {
            const trip = await getData("8");

            if (trip) {
                console.log("Trip Data:", trip);

                // Find the origin (first destination with dayOrigin = true)
                const originDestination = trip.destinations.find((destination: { dayOrigin: boolean; }) => destination.dayOrigin === true);

                if (originDestination) {
                    const parsedPicture = JSON.parse(originDestination.picture);
                    setOrigin({
                        name: originDestination.alias,
                        address: originDestination.address,
                    });

                    console.log("Set origin:", originDestination.alias);
                }

                // Iterate over destinations and format them into the new structure
                trip.destinations.forEach((destination: { picture: string; alias: any; address: any; priority: any; mode: any; transportToNext: any; transportDuration: any; startDateTime: any; duration: string; notes: any; dayOrigin: any; cost: any; }, index: { toString: () => string | number; }) => {
                    const parsedPicture = JSON.parse(destination.picture);

                    const formattedDestination = {
                        alias: destination.alias,
                        address: destination.address,
                        priority: destination.priority,
                        mode: destination.mode || 'DRIVING', // default mode is DRIVING
                        transportToNext: destination.transportToNext ? JSON.stringify(destination.transportToNext) : "", // serialized route
                        transportDuration: destination.transportDuration,
                        startDateTime: destination.startDateTime,
                        duration: parseFloat(destination.duration),
                        notes: destination.notes,
                        dayOrigin: destination.dayOrigin || false,
                        cost: destination.cost,
                        picture: destination.picture,
                    };

                    formattedDestinations[index.toString()] = formattedDestination;
                });

                console.log("Formatted Destinations:", formattedDestinations);
                setDestinations(formattedDestinations); // Update state with the new structure
            } else {
                console.log("No data found for this trip ID.");
            }
        } catch (error) {
            console.error("Error fetching trip data:", error);
        }

        return formattedDestinations;
    };


    // Function to save multiple destinations
    const saveDestinations = async (newDestinations: Record<string, Place>) => {
        for (const key in newDestinations) {
            await storeData(key, newDestinations[key]);
        }
    };

    const prevOptimalRouteRef = useRef<any[][]>([]);

    useEffect(() => {
        if (Object.keys(destinations).length > 0 && origin) {
            const fetchOptimalRoute = async () => {
                try {
                    const destinationArray = Object.values(destinations);
                    const simplifiedDestinations = destinationArray.map(destination => ({
                        name: destination.alias,
                        address: destination.address
                    }));
                    console.log("Simplified Destinations Array:", simplifiedDestinations);

                    const mode = 'DRIVING';
                    const result = await calculateOptimalRoute(simplifiedDestinations, origin, mode);

                    // Check if the result is different from the previous optimal route
                    if (JSON.stringify(result) !== JSON.stringify(prevOptimalRouteRef.current)) {
                        setOptimalRoute(result);
                        // Update ref to current optimal route
                        prevOptimalRouteRef.current = result;
                    }
                } catch (error) {
                    console.error("Failed to get optimal route:", error);
                }
            };

            fetchOptimalRoute();
        }
    }, [destinations, origin]);

    const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
    const [transportationText, setTransportationText] = useState("driving");

    const handlePress = (destination: string) => {
        setSelectedDestination(prev => prev === destination ? null : destination);
    };

    const handleModeChange = (text: string) => {
        setTransportationText(text);
    };

    const getRouteText = () => {
        if (!selectedDestination) return "";
        const routeDestination = destinations[selectedDestination];
        return `${transportationText} instructions to ${routeDestination?.alias}.`;
    };

    const reviewItinerary = () => {
        router.push("/ReviewItineraryScreen");
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={{ flex: 1 }}>
            {optimalRoute.length > 0 && (
                <MultiRoutesMap locations={optimalRoute} transportationModes={transportationModes} onPolylinesReady={handlePolylinesReady} />
            )}
            </SafeAreaView>

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
                                <DynamicImage placeName={destinations[destinationKey].alias} containerStyle={styles.destinationImage} imageStyle={styles.destinationImage} />
                                <View style={styles.destinationLabel}>
                                    <Text style={styles.destinationName}>{destinations[destinationKey].alias}</Text>
                                    <Text style={styles.destinationDetails}>
                                        Duration: {destinations[destinationKey].duration} hrs | Priority: {destinations[destinationKey].priority}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                        {selectedDestination === destinationKey ? (
                            <View style={styles.additionalInfo}>
                                <Text style={styles.additionalText}>{getRouteText()}</Text>
                            </View>
                        ) : null}
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
        flex: 1,
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
