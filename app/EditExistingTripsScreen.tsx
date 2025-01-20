// EditExistingTripsScreen.tsx
import { ScrollView, Image, StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { useRouter } from "expo-router";

const EditExistingTripsScreen = () => {
    const router = useRouter();

    const editTrip = () => {
        console.log("ERERER")
        router.push("/AddEditDestinations");
    }

    return (
        <ScrollView style={styles.container}>
            { /* Tokyo, Japan trip */}
            <TouchableOpacity style={styles.tripButtonTokyo} onPress={ editTrip }>
                <Image style={styles.backgroundImage} source={require("../assets/images/tokyoskyline.jpg")} />
                <View style={styles.darkOverlay} />
                <View style={styles.screenContainer}>
                    <Text style={styles.upcoming}>UPCOMING</Text>
                    <Text style={styles.destinationName}>Tokyo, Japan</Text>
                    <Text style={styles.dates}>Sat. Jul 13 - Sun. Jul 14</Text>
                </View>
            </TouchableOpacity>

        </ScrollView>
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

    tripButtonTokyo: {
        width: "100%",
        height: 250,
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
    }
});

export default EditExistingTripsScreen;