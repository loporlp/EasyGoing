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

    const tokyoSkytree = { latitude: 35.7023, longitude: 139.7745 };
    const akihabaraElectricTown = { latitude: 35.7100, longitude: 139.8107 };
    const pokemonCenter = { latitude: 35.6620, longitude: 139.6984 };
    const meijiJingu = { latitude: 35.6764, longitude: 139.6993 };
    const imperialPalace = { latitude: 35.6852, longitude: 139.7528 };

    const [showMapForAkihabara, setShowMapForAkihabara] = useState(false);
    const [showMapForSkytree, setShowMapForSkytree] = useState(false);
    const [showMapForMeiji, setShowMapForMeiji] = useState(false);

    const [transportationText, setTransportationText] = useState("driving");
    const selectedCoordinates = {
        latitude: 35.652832,
        longitude: 139.839478,
    };

    const handlePress = (destination : String) => {
        if (destination === "akihabara") {
            setShowMapForAkihabara((prev) => !prev);
        } else if (destination === "skytree") {
            setShowMapForSkytree((prev) => !prev);
        } else if (destination === "meiji") {
            setShowMapForMeiji((prev) => !prev);
        }
    };

    const handleModeChange = (text : any) => {
        setTransportationText(text); // Update the transportation text when a mode button is pressed
    };

    return (
        <View style={styles.container}>
            {showMapForAkihabara ? (
                <RouteMap origin={tokyoSkytree} destination={akihabaraElectricTown} style={styles.map} onModeChange={handleModeChange} />
            ) : showMapForSkytree ? (
                <RouteMap origin={tokyoSkytree} destination={pokemonCenter} style={styles.map} onModeChange={handleModeChange} />
            ) : showMapForMeiji ? (
                <RouteMap origin={meijiJingu} destination={imperialPalace} style={styles.map} onModeChange={handleModeChange} />
            ): (
                <MapMarker coordinates={selectedCoordinates} style={styles.map} />
            )}

            <ScrollView contentContainerStyle={styles.scrollViewContainer} style={styles.scrollView}>
                <View style={styles.dateHeader}>
                    <Text style={styles.dateText}>Sat, Jul. 12   v</Text>
                </View>

                {/* Akihabara Electric Town */}
                <TouchableOpacity style={styles.destinationElement} onPress={() => handlePress("akihabara")}>

                    {/* Background with opacity */}
                    <View style={styles.backgroundContainer}>
                        <View style={styles.backgroundOverlay}></View>
                    </View>

                    <View style={styles.destinationContainer}>
                        <Image style={styles.destinationImage} source={require("../assets/images/AkihabaraElectricTown.jpg")} />
                        <View style={styles.destinationLabel}>
                            <Text style={styles.destinationName}>Akihabara Electric Town</Text>
                            <Text style={styles.destinationDetails}>Duration: 6 hrs | Priority: 1</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {showMapForAkihabara && (
                    <View style={styles.additionalInfo}>
                        <Text style={styles.additionalText}>{transportationText} instructions to Tokyo Skytree.</Text>
                    </View>
                )}

                {/* Tokyo Skytree */}
                <TouchableOpacity style={styles.destinationElement} onPress={() => handlePress("skytree")}>
                    {/* Background with opacity */}
                    <View style={styles.backgroundContainer}>
                        <View style={styles.backgroundOverlay}></View>
                    </View>

                    <View style={styles.destinationContainer}>
                        <Image style={styles.destinationImage} source={require("../assets/images/tokyoskytree.jpg")} />
                        <View style={styles.destinationLabel}>
                            <Text style={styles.destinationName}>Tokyo Skytree</Text>
                            <Text style={styles.destinationDetails}>Duration: 2 hrs | Priority: 2</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {showMapForSkytree && (
                    <View style={styles.additionalInfo}>
                        <Text style={styles.additionalText}>{transportationText} instructions to Pokemon Center Shibuya.</Text>
                    </View>
                )}

                {/* Pokemon Center Shibuya */}
                <TouchableOpacity style={styles.destinationElement} onPress={() => { }}>

                    {/* Background with opacity */}
                    <View style={styles.backgroundContainer}>
                        <View style={styles.backgroundOverlay}></View>
                    </View>

                    <View style={styles.destinationContainer}>
                        <Image style={styles.destinationImage} source={require("../assets/images/PokemonCenterShibuya.png")} />
                        <View style={styles.destinationLabel}>
                            <Text style={styles.destinationName}>Pokemon Center</Text>
                            <Text style={styles.destinationDetails}>Duration: 1.5 hrs | Priority: 3</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                <View style={styles.dateHeader}>
                    <Text style={styles.dateText}>Sun, Jul. 13   v</Text>
                </View>

                {/* Meiji Jingu */}
                <TouchableOpacity style={styles.destinationElement} onPress={() => {handlePress("meiji")}}>

                    {/* Background with opacity */}
                    <View style={styles.backgroundContainer}>
                        <View style={styles.backgroundOverlay}></View>
                    </View>

                    <View style={styles.destinationContainer}>
                        <Image style={styles.destinationImage} source={require("../assets/images/MeijiJingu.jpg")} />
                        <View style={styles.destinationLabel}>
                            <Text style={styles.destinationName}>Meiji Jingu</Text>
                            <Text style={styles.destinationDetails}>Duration: 2 hrs | Priority: 3</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {showMapForMeiji && (
                    <View style={styles.additionalInfo}>
                        <Text style={styles.additionalText}>{transportationText} instructions to Imperial Palace.</Text>
                    </View>
                )}

                {/* Imperial Palace */}
                <TouchableOpacity style={styles.destinationElement} onPress={() => { }}>

                    {/* Background with opacity */}
                    <View style={styles.backgroundContainer}>
                        <View style={styles.backgroundOverlay}></View>
                    </View>

                    <View style={styles.destinationContainer}>
                        <Image style={styles.destinationImage} source={require("../assets/images/ImperialPalace.jpg")} />
                        <View style={styles.destinationLabel}>
                            <Text style={styles.destinationName}>Imperial Palace</Text>
                            <Text style={styles.destinationDetails}>Duration: 2 hrs | Priority: 4</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </ScrollView>

            {/* "Review Itinerary" button */}
            <TouchableOpacity style={styles.reviewItineraryButton} onPress={() => { }}>
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
        //marginTop: 20,
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