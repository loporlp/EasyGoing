import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Image } from "react-native";

/**
 *  City Header (picture of city, overlay with text -> City, Country; Dates Visiting; # travelers)
 *  Display Destinations selected in square photos ([][][][][]...ScrollView?) -> press a [] and info about that place (via Wiki API call)
 *  Display Restaraunts chosen ([][][][][][]...ScrollView with # review?) -> 
 *  Display Itinerary below
 *  Buttons to 1) Export 2) Share 3) Save + Confirm -> return to Home page 4) Cancel -> send back to Home
 */
const ReviewItineraryScreen = () => {
    return (
        <View>
            <ScrollView style={styles.container}>

                { /* City Header */}
                <View style={styles.headerContainer}>
                    <Image style={styles.backgroundImage} source={require("../assets/images/landscape.jpg")} />
                    <View style={styles.darkOverlay} />
                    <View style={styles.screenContainer}>
                        <Text style={styles.greetingText}>Tokyo, Japan</Text>
                        <Text style={styles.greetingText}>Sat. Jul 13 - Sun. Jul 14</Text>
                    </View>
                </View>

                { /* Bottom window */}
                <View style={styles.bottomScreen}>
                    <Text style={styles.textLabel}>Destinations:</Text>

                    { /* List of destinations scroll view */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.scrollViewContainerContent}
                        style={styles.scrollViewContainer}>

                        {/* Example destination items */}
                        <TouchableOpacity style={styles.destinationInfo}>
                            <Image style={styles.destinationImage} source={require("../assets/images/AkihabaraElectricTown.jpg")} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.destinationInfo}>
                            <Image style={styles.destinationImage} source={require("../assets/images/ImperialPalace.jpg")} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.destinationInfo}>
                            <Image style={styles.destinationImage} source={require("../assets/images/MeijiJingu.jpg")} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.destinationInfo}>
                            <Image style={styles.destinationImage} source={require("../assets/images/PokemonCenterShibuya.png")} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.destinationInfo}>
                            <Image style={styles.destinationImage} source={require("../assets/images/tokyoskytree.jpg")} />
                        </TouchableOpacity>

                    </ScrollView>

                    <Text style={styles.textLabel}>Restaurants:</Text>
                    { /* List of restaurants */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.scrollViewContainerContent}
                        style={styles.scrollViewContainer}>

                        {/* Example restaurant items */}
                        <TouchableOpacity style={styles.destinationInfo}>
                            <Image style={styles.destinationImage} source={require("../assets/images/unagi_sumiyaki.jpg")} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.destinationInfo}>
                            <Image style={styles.destinationImage} source={require("../assets/images/cafe_bar_lusso.jpg")} />
                        </TouchableOpacity>
                    </ScrollView>

                    { /* Itinerary */}
                    <Text style={styles.textLabel}>Itinerary:</Text>
                    <View style={styles.dateHeader}>
                        <Text style={styles.dateText}>Sat, Jul. 12 | $202.35 | v</Text>
                    </View>

                    {/* Akihabara Electric Town */}
                    <TouchableOpacity style={styles.destinationElement}>

                        {/* Background with opacity */}
                        <View style={styles.backgroundContainer}>
                            <View style={styles.backgroundOverlay}></View>
                        </View>

                        <View style={styles.destinationContainer}>
                            <Image style={styles.destinationImage} source={require("../assets/images/AkihabaraElectricTown.jpg")} />
                            <View style={styles.destinationLabel}>
                                <Text style={styles.destinationName}>Akihabara Electric Town</Text>
                                <Text style={styles.destinationDetails}>Duration: 6 hrs | 9:30 AM</Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* Restaurant */}
                    <TouchableOpacity style={styles.destinationElement}>
                        {/* Background with opacity */}
                        <View style={styles.backgroundContainer}>
                            <View style={styles.backgroundOverlay}></View>
                        </View>

                        <View style={styles.destinationContainer}>
                            <Image style={styles.destinationImage} source={require("../assets/images/unagi_sumiyaki.jpg")} />
                            <View style={styles.destinationLabel}>
                                <Text style={styles.destinationName}>Unagi Sumiyaki</Text>
                                <Text style={styles.destinationDetails}>Unagi restaurant | 4.6 (261)</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    
                    { /* Transportation */ }
                    <TouchableOpacity style={styles.destinationElement}>
                        <View style={styles.backgroundContainer}>
                            <View style={styles.backgroundOverlay}></View>
                        </View>

                        <Text style={styles.destinationDetails}>v   [Transit]   20 mins</Text>
                    </TouchableOpacity>

                    {/* Tokyo Skytree */}
                    <TouchableOpacity style={styles.destinationElement} >
                        {/* Background with opacity */}
                        <View style={styles.backgroundContainer}>
                            <View style={styles.backgroundOverlay}></View>
                        </View>

                        <View style={styles.destinationContainer}>
                            <Image style={styles.destinationImage} source={require("../assets/images/tokyoskytree.jpg")} />
                            <View style={styles.destinationLabel}>
                                <Text style={styles.destinationName}>Tokyo Skytree</Text>
                                <Text style={styles.destinationDetails}>Duration: 2 hrs | 3:50 PM</Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    { /* Transportation */ }
                    <TouchableOpacity style={styles.destinationElement}>
                        <View style={styles.backgroundContainer}>
                            <View style={styles.backgroundOverlay}></View>
                        </View>

                        <Text style={styles.destinationDetails}>v   [Transit]   41 mins</Text>
                    </TouchableOpacity>

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
                                <Text style={styles.destinationDetails}>Duration: 1.5 hrs | 6:31 PM</Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* Restaurant */}
                    <TouchableOpacity style={styles.destinationElement}>
                        {/* Background with opacity */}
                        <View style={styles.backgroundContainer}>
                            <View style={styles.backgroundOverlay}></View>
                        </View>

                        <View style={styles.destinationContainer}>
                            <Image style={styles.destinationImage} source={require("../assets/images/cafe_bar_lusso.jpg")} />
                            <View style={styles.destinationLabel}>
                                <Text style={styles.destinationName}>Cafe & Bar Lusso</Text>
                                <Text style={styles.destinationDetails}>Bar | 4.2 (9)</Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.dateHeader}>
                        <Text style={styles.dateText}>Sun, Jul. 13   v</Text>
                    </View>

                    {/* Meiji Jingu */}
                    <TouchableOpacity style={styles.destinationElement} >

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
                </View>
            </ScrollView >

            {/* Buttons */}
            < View style={styles.buttonContainer} >
                <TouchableOpacity style={styles.button}><Text>Export</Text></TouchableOpacity>
                <TouchableOpacity style={styles.button}><Text>Share</Text></TouchableOpacity>
                <TouchableOpacity style={styles.button}><Text>Save + Confirm</Text></TouchableOpacity>
                <TouchableOpacity style={styles.button}><Text>Cancel</Text></TouchableOpacity>
            </View >
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1, // Allows ScrollView to grow and be scrollable
        backgroundColor: '#fff',
        height: "90%",
    },

    textLabel: {
        fontSize: 15,
    },

    // ==== CITY HEADER ==== //
    headerContainer: {
        position: "relative",
    },

    backgroundImage: {
        width: "100%",
        height: 200,
        resizeMode: "cover",
    },

    darkOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: 200,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
    },

    screenContainer: {
        position: "absolute",
        top: 70, // Positioning text below the image
        left: 20,
        right: 20,
        zIndex: 1, // Ensures text is above the overlay
    },

    greetingText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 25,
        marginTop: 20,
    },

    // ==== BOTTOM WINDOW ==== //
    bottomScreen: {
        top: -18,
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
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

    destinationImage: {
        height: 70,
        width: 70,
        borderRadius: 10,
    },

    buttonContainer: {
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "space-between",
    },

    button: {
        backgroundColor: "#007BFF",
        padding: 10,
        borderRadius: 5,
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
});

export default ReviewItineraryScreen;
