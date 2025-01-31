import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CommonActions } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useEffect, useRef } from "react";
import { useRouter } from "expo-router";

/**
 *  City Header (picture of city, overlay with text -> City, Country; Dates Visiting; # travelers)
 *  Display Destinations selected in square photos ([][][][][]...ScrollView?) -> press a [] and info about that place (via Wiki API call)
 *  Display Restaraunts chosen ([][][][][][]...ScrollView with # review?) -> 
 *  Display Itinerary below
 *  Buttons to 1) Export 2) Share 3) Save + Confirm -> return to Home page 4) Cancel -> send back to Home
 */
const ReviewItineraryScreen = () => {
    const router = useRouter();
    const goToHome = () => {
        router.replace("/HomeScreen")
    }

    const goBack = () => {
        console.log(router.canGoBack())
        router.back()
    }

    const [date1, setDate1] = useState(false);
    const [date2, setDate2] = useState(false);

    return (
        <View style={styles.container}>
            <ScrollView style={{ flex: 1, height: "100%" }} contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
                <View style={{ marginTop: 50, marginHorizontal: 20, position: "absolute", zIndex: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                    {/* Left Arrow */}
                    <TouchableOpacity onPress={goBack}>
                        <Ionicons name="arrow-back" size={30} color={"white"} />
                    </TouchableOpacity>

                    {/* Right Icons (Share and Checkmark) */}
                    <View style={{ flexDirection: "row", marginRight: 40 }}>
                        <TouchableOpacity style={{ marginRight: 10 }}>
                            <Ionicons name="share" size={30} color={"white"} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={goToHome}>
                            <Ionicons name="checkmark" size={30} color={"white"} />
                        </TouchableOpacity>
                    </View>
                </View>



                { /* City Header */}
                <Image style={styles.backgroundImage} source={require("../assets/images/newyorkcity.jpg")} />
                <View style={styles.darkOverlay} />
                <View style={styles.headerContainer}>
                    <View style={styles.screenContainer}>
                        <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                            <Ionicons name="location" size={30} color={"#24a6ad"} style={{ marginRight: 10 }} />
                            <View style={{ flexDirection: "column", alignItems: "flex-start" }}>
                                <Text style={{ fontWeight: "bold", color: "white", fontSize: 25 }}>New York City, USA</Text>
                                <Text style={{ color: "white", fontSize: 16 }}>Sat, Jul. 13 - Sun. Jul 14</Text>
                            </View>
                        </View>
                    </View>
                </View>

                { /* Bottom window */}
                <View style={styles.bottomScreen}>

                    { /* Itinerary Day 1 */}
                    <Text style={styles.textLabel}>Itinerary:</Text>
                    <TouchableOpacity style={styles.dateHeader} onPress={() => setDate1(!date1)} >
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Ionicons name="calendar" size={25} color={"#24a6ad"} />
                            <Text style={styles.dateText}>Sat, Jul. 13</Text>
                        </View>
                        {(date1) ? (
                            <Ionicons name={"caret-up"} size={25} color={"#24a6ad"} />
                        ) : (
                            <Ionicons name={"caret-down"} size={25} color={"#24a6ad"} />
                        )}
                    </TouchableOpacity>

                    {(date1) ? (
                        <View style={{ backgroundColor: "white", height: 100 }}>
                            <TouchableOpacity style={{ height: 50, backgroundColor: "white", borderTopWidth: 1, borderColor: "lightgray" }}>
                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 15 }}>
                                    <Ionicons name={"location"} size={22} color={"#24a6ad"} />
                                    <Text style={{ fontSize: 16 }}>Origin (Leave at: 9:30 AM)</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ height: 50, backgroundColor: "white", borderTopWidth: 1, borderColor: "lightgray" }}>
                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 15 }}>
                                    <Ionicons name={"bus"} size={22} color={"#24a6ad"} />
                                    <Text style={{ fontSize: 16 }}>Transit (20mins)</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity>
                                <View style={styles.destination}>
                                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                        <Image style={styles.destinationImage} source={require("../assets/images/statueofliberty.jpg")} />
                                        <View style={{ flex: 1, flexDirection: "column", paddingVertical: 10, marginVertical: 10 }}>
                                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                                <Ionicons name="location" size={20} color={"#24a6ad"} />
                                                <Text style={{ flex: 1, fontSize: 20, fontWeight: "700", marginLeft: 5 }}>Statue of Liberty</Text>
                                            </View>

                                            <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginRight: 5 }}>
                                                <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                                    <Ionicons name="time" size={18} color={"#24a6ad"} />
                                                    <Text style={{ marginLeft: 5 }}>3hr</Text>
                                                </View>

                                                <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginRight: 5 }}>
                                                    <MaterialCommunityIcons name="priority-high" size={18} color={"#24a6ad"} />
                                                    <Text style={{ marginLeft: 5 }}>1</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ height: 50, backgroundColor: "white", borderTopWidth: 1, borderColor: "lightgray" }}>
                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 15 }}>
                                    <Ionicons name={"bus"} size={22} color={"#24a6ad"} />
                                    <Text style={{ fontSize: 16 }}>Transit (57 mins)</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity>
                                <View style={styles.destination}>
                                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                        <Image style={styles.destinationImage} source={require("../assets/images/CentralPark.jpg")} />
                                        <View style={{ flex: 1, flexDirection: "column", paddingVertical: 10, marginVertical: 10 }}>
                                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                                <Ionicons name="location" size={20} color={"#24a6ad"} />
                                                <Text style={{ flex: 1, fontSize: 20, fontWeight: "700", marginLeft: 5 }}>Central Park</Text>
                                            </View>

                                            <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginRight: 5 }}>
                                                <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                                    <Ionicons name="time" size={18} color={"#24a6ad"} />
                                                    <Text style={{ marginLeft: 5 }}>2hr</Text>
                                                </View>

                                                <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginRight: 5 }}>
                                                    <MaterialCommunityIcons name="priority-high" size={18} color={"#24a6ad"} />
                                                    <Text style={{ marginLeft: 5 }}>2</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ height: 50, backgroundColor: "white", borderTopWidth: 1, borderColor: "lightgray" }}>
                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 15 }}>
                                    <Ionicons name={"walk"} size={22} color={"#24a6ad"} />
                                    <Text style={{ fontSize: 16 }}>Walk (10 mins)</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity>
                                <View style={styles.destination}>
                                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                        <Image style={styles.destinationImage} source={require("../assets/images/moma.jpg")} />
                                        <View style={{ flex: 1, flexDirection: "column", paddingVertical: 10, marginVertical: 10 }}>
                                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                                <Ionicons name="location" size={20} color={"#24a6ad"} />
                                                <Text style={{ flex: 1, fontSize: 20, fontWeight: "700", marginLeft: 5 }}>Museum of Modern Art</Text>
                                            </View>

                                            <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginRight: 5 }}>
                                                <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                                    <Ionicons name="time" size={18} color={"#24a6ad"} />
                                                    <Text style={{ marginLeft: 5 }}>2hr</Text>
                                                </View>

                                                <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginRight: 5 }}>
                                                    <MaterialCommunityIcons name="priority-high" size={18} color={"#24a6ad"} />
                                                    <Text style={{ marginLeft: 5 }}>2</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ height: 50, backgroundColor: "white", borderTopWidth: 1, borderColor: "lightgray" }}>
                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 15 }}>
                                    <Ionicons name={"car"} size={22} color={"#24a6ad"} />
                                    <Text style={{ fontSize: 16 }}>Driving (14mins)</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity>
                                <View style={styles.destination}>
                                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                        <Image style={styles.destinationImage} source={require("../assets/images/grandCentralMarket.jpg")} />
                                        <View style={{ flex: 1, flexDirection: "column", paddingVertical: 10, marginVertical: 10 }}>
                                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                                <Ionicons name="location" size={20} color={"#24a6ad"} />
                                                <Text style={{ flex: 1, fontSize: 20, fontWeight: "700", marginLeft: 5 }}>Grand Central Market</Text>
                                            </View>

                                            <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginRight: 5 }}>
                                                <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                                    <Ionicons name="time" size={18} color={"#24a6ad"} />
                                                    <Text style={{ marginLeft: 5 }}>3hr</Text>
                                                </View>

                                                <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginRight: 5 }}>
                                                    <MaterialCommunityIcons name="priority-high" size={18} color={"#24a6ad"} />
                                                    <Text style={{ marginLeft: 5 }}>3</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity style={styles.dateHeader} onPress={() => setDate2(!date2)} >
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Ionicons name="calendar" size={25} color={"#24a6ad"} />
                            <Text style={styles.dateText}>Sun, Jul. 14</Text>
                        </View>
                        {(date2) ? (
                            <Ionicons name={"caret-up"} size={25} color={"#24a6ad"} />
                        ) : (
                            <Ionicons name={"caret-down"} size={25} color={"#24a6ad"} />
                        )}
                    </TouchableOpacity>
                    )}

                </View>
            </ScrollView >
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
        marginBottom: 10,
    },

    textLabel: {
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 10
    },

    // ==== CITY HEADER ==== //
    headerContainer: {
        position: "absolute",
        zIndex: 1,
        flexDirection: "column",
        alignItems: "flex-start"
    },

    backgroundImage: {
        width: "100%",
        height: 250,
        resizeMode: "cover",
    },

    darkOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: 250,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },

    screenContainer: {
        marginTop: "50%",
        marginLeft: 15,
    },

    // ==== BOTTOM WINDOW ==== //
    bottomScreen: {
        top: -18,
        backgroundColor: "#F4F4F4",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: 20,
    },

    destinationItem: {
        marginRight: 10,
        backgroundColor: "#e0e0e0",
        padding: 20,
        borderRadius: 10,
    },

    itineraryItem: {
        marginVertical: 10,
    },

    // Destination scroll view
    scrollViewContainer: {
        borderWidth: 2,
        borderRadius: 10,
        borderColor: "#24a6ad", // Ensure the border color is visible
        marginVertical: 10, // Adds some vertical space between sections if needed
    },

    // This will apply to the content inside the scroll view
    scrollViewContainerContent: {
        alignItems: "center",
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5,
    },

    destinationInfo: {
        marginLeft: 5,
        marginRight: 5,
    },

    destination: {
        backgroundColor: "white",
        width: "100%",
        height: 100,
        borderTopWidth: 1,
        borderColor: "lightgray"
    },

    destinationImage: {
        width: 70,
        height: 70,
        resizeMode: "cover",
        overflow: "hidden",
        borderRadius: 10,
        marginLeft: 5
    },

    buttonContainer: {
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,
        flexDirection: "row",
        justifyContent: "space-between",
    },

    button: {
        backgroundColor: "#007BFF",
        padding: 10,
        borderRadius: 5,
    },

    dateText: {
        color: "black",
        fontSize: 18,
        fontWeight: "700",
        marginLeft: 5
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

    destinationElement: {
        width: "100%",
        height: 75,
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center",
        padding: 5,
        position: "relative",
    },

    dateHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        backgroundColor: "white",
        color: "white",
        width: "100%",
        shadowColor: "#333333",
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },

});

export default ReviewItineraryScreen;
