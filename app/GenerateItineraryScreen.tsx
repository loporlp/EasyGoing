// GenerateItineraryScreen.tsx
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import MapMarker from '../components/MapMarker';
import { useState } from 'react';
import RouteMap from '../components/RouteMap';
import { Header } from 'react-native-elements';  // Example, make sure to install the library if necessary
import { Dimensions } from "react-native";

const { height } = Dimensions.get('window');

const GenerateItineraryScreen = () => {
    const router = useRouter();

    const tokyoSkytree = { latitude: 35.7023, longitude: 139.7745 };
    const akihabaraElectricTown = { latitude: 35.7100, longitude: 139.8107 };

    return (
        <View style={styles.container}>
            <RouteMap origin={tokyoSkytree} destination={akihabaraElectricTown} style={styles.map} />
            <ScrollView contentContainerStyle={styles.scrollViewContainer} style={styles.scrollView}>
                {/* Tokyo Skytree */}
                <TouchableOpacity style={styles.destinationElement} onPress={() => {}}>
                    {/* Background with opacity */}
                    <View style={styles.backgroundContainer}>
                        <View style={[styles.backgroundOverlay, { opacity: 0.7 }]}></View>
                    </View>

                    <View style={styles.destinationContainer}>
                        <Image style={styles.destinationImage} source={require("../assets/images/tokyoskytree.jpg")} />
                        <View style={styles.destinationLabel}>
                            <Text style={styles.destinationName}>Tokyo Skytree</Text>
                            <Text style={styles.destinationDetails}>Duration: 2 hrs | Priority: 2</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Akihabara Electric Town */}
                <TouchableOpacity style={styles.destinationElement} onPress={() => { }}>

                    {/* Background with opacity */}
                    <View style={styles.backgroundContainer}>
                        <View style={[styles.backgroundOverlay, { opacity: 0.7 }]}></View>
                    </View>

                    <View style={styles.destinationContainer}>
                        <Image style={styles.destinationImage} source={require("../assets/images/AkihabaraElectricTown.jpg")} />
                        <View style={styles.destinationLabel}>
                            <Text style={styles.destinationName}>Akihabara Electric Town</Text>
                            <Text style={styles.destinationDetails}>Duration: 6 hrs | Priority: 1</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Pokemon Center Shibuya */}
                <TouchableOpacity style={styles.destinationElement} onPress={() => { }}>

                    {/* Background with opacity */}
                    <View style={styles.backgroundContainer}>
                        <View style={[styles.backgroundOverlay, { opacity: 0.7 }]}></View>
                    </View>

                    <View style={styles.destinationContainer}>
                        <Image style={styles.destinationImage} source={require("../assets/images/PokemonCenterShibuya.png")} />
                        <View style={styles.destinationLabel}>
                            <Text style={styles.destinationName}>Pokemon Center</Text>
                            <Text style={styles.destinationDetails}>Duration: 1.5 hrs | Priority: 3</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Meiji Jingu */}
                <TouchableOpacity style={styles.destinationElement} onPress={() => { }}>

                    {/* Background with opacity */}
                    <View style={styles.backgroundContainer}>
                        <View style={[styles.backgroundOverlay, { opacity: 0.7 }]}></View>
                    </View>

                    <View style={styles.destinationContainer}>
                        <Image style={styles.destinationImage} source={require("../assets/images/MeijiJingu.jpg")} />
                        <View style={styles.destinationLabel}>
                            <Text style={styles.destinationName}>Meiji Jingu</Text>
                            <Text style={styles.destinationDetails}>Duration: 2 hrs | Priority: 3</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Imperial Palace */}
                <TouchableOpacity style={styles.destinationElement} onPress={() => { }}>

                    {/* Background with opacity */}
                    <View style={styles.backgroundContainer}>
                        <View style={[styles.backgroundOverlay, { opacity: 0.7 }]}></View>
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
        paddingBottom: 10,
    },

    scrollView: {
        maxHeight: height * 0.5,
        borderRadius: 10,
        overflow: "hidden",
        marginTop: 20,
        marginBottom: 10,
    },
});

export default GenerateItineraryScreen;