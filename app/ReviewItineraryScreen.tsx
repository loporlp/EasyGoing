// ReviewItineraryScreen.tsx
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Image } from "react-native";

/**
 *  City Header (picture of city, overlay with text -> City, Country; Dates Visiting; # travelers)
 *  Display Destinations selected in square photos ([][][][][]...ScrollView?) -> press a [] and info about that place (via Wiki API call)
 *  Display Restaraunts chosen ([][][][][][]...ScrollView with # review?) -> 
 *  Display Itinerary below
 *  Buttons to 1) Export 2) Share 3) Save + Confirm -> return to Home page 4) Cancel -> send back to Home
 */
const ReviewItineraryScreen = () => {
    <View style={styles.container}>
        { /* City Header */ }
        <Image style={styles.backgroundImage} source={require("../assets/images/landscape.jpg")} />
        <View style={styles.darkOverlay} />

        <View style={styles.screenContainer}>
            <Text style={styles.greetingText}>Tokyo, Japan</Text>
            <Text style={styles.greetingText}>Sat. Jul 13 - Sun. Jul 14</Text>
        </View>

        { /* Bottom window */ }
        <View style={styles.bottomScreen}>
            { /* List of destinations */ }
            <ScrollView>

            </ScrollView>

            { /* List of restaraunts */ }
            <ScrollView>

            </ScrollView>

            { /* Itinerary */ }
            <ScrollView>

            </ScrollView>

            {/* Button */ }
        </View>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: '#fff',
    },

    // ==== CITY HEADER ==== //
    backgroundImage: {
        width: "100%",
        height: 300,
        position: "absolute",
        resizeMode: "cover",
    },

    darkOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: 300,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
    },

    screenContainer: {
        flex: 1,
        flexDirection: "column",
        marginLeft: 20,
        marginRight: 20,
    },

    greetingText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 25,
        marginTop: 20,
    },

    // ==== BOTTOM WINDOW ==== //
    bottomScreen: {
        position: "absolute",
        backgroundColor: "white",
        top: 270,
        left: 0,
        width: "100%",
        height: "100%",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 20,
      },
});

export default ReviewItineraryScreen;