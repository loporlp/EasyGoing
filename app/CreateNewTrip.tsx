// CreateNewTrip.tsx
import { View, StyleSheet, TouchableOpacity, Text, Image, TextInput } from 'react-native';
import { useRouter } from "expo-router";

export const head = () => ({
    title: "Create New Trip"
});

const CreateNewTrip = () => {

    // Sets up navigations
    const router = useRouter();

    const startPlanning = () => {
        router.push("/AddEditDestinations")
    }
    return (
        <View style={styles.container}>

            {/* Background Image */}
            <Image style={styles.backgroundImage} source={require("../assets/images/createTripImage.jpg")} />

            {/* Adds a dark overlay on the screen */}
            <View style={styles.darkOverlay} />

            {/* Other UI elements on the screen */}
            <View style={styles.createTripContainer}>
                <Text style={styles.createTripLabel}>Where are we{" "}
                    <Text style={styles.highlightText}>going</Text>, Traveler?</Text>
                <TextInput placeholder="Destination" placeholderTextColor="lightgray" style={styles.input} />
                <TextInput placeholder="Dates" placeholderTextColor="lightgray" style={styles.input} />
                <View style={styles.travelersAndBudgetTextField}>
                    <TextInput placeholder="Travelers" placeholderTextColor="lightgray" keyboardType="numeric" style={styles.travelerInput} />
                    <TextInput placeholder="Budget" placeholderTextColor="lightgray" keyboardType="numeric" style={styles.budgetInput} />
                </View>
                <TouchableOpacity style={styles.createPlanButton} onPress={startPlanning}>
                    <Text style={styles.startPlanningButtonText}>Start Planning!</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    backgroundImage: {
        width: "100%",
        height: undefined,
        position: "absolute",
        resizeMode: "cover",
        aspectRatio: 9 / 18,
    },

    darkOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: undefined,
        aspectRatio: 9 / 18,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
    },

    createTripLabel: {
        fontWeight: "bold",
        color: "white",
        fontSize: 25,
        marginTop: 60,
        marginBottom: 40,
    },

    highlightText: {
        color: "#24a6ad",
        fontSize: 25,
    },

    createTripContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 80,
        marginLeft: 10,
        marginRight: 10,
    },

    textFields: {
        flex: 1,
        flexDirection: "column",
        alignContent: "center",
    },

    input: {
        height: 40,
        width: "80%",
        borderColor: '#999',
        borderBottomWidth: 1,
        marginBottom: 20,
        fontSize: 16,
        backgroundColor: "white",
        paddingLeft: 20,
        borderRadius: 10,
        paddingTop: 5,
        paddingBottom: 5,
    },

    travelerInput: {
        height: 40,
        flex: 1,                   
        borderColor: '#999',
        borderBottomWidth: 1,
        marginRight: 10,               
        fontSize: 16,
        backgroundColor: "white",
        paddingLeft: 20,
        borderRadius: 10,
        paddingTop: 5,
        paddingBottom: 5,
    },

    budgetInput: {
        height: 40,
        width: "50%",                       
        borderColor: '#999',
        borderBottomWidth: 1,
        fontSize: 16,
        backgroundColor: "white",
        paddingLeft: 20,
        borderRadius: 10,
        paddingTop: 5,
        paddingBottom: 5,
    },

    travelersAndBudgetTextField: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        width: "80%",
        marginLeft: 10,
        marginRight: 10,
    },

    createPlanButton: {
        backgroundColor: "#24a6ad",
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 25,
        marginTop: 20,
        justifyContent: "center",
        alignItems: "center",       
        elevation: 5,               
        shadowColor: "#000",      
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,           
        shadowRadius: 5,
        marginBottom: 60,
    },

    startPlanningButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 40,
        marginRight: 40,
    },
});

export default CreateNewTrip;