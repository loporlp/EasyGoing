// AddEditDestinations.tsx
import { View, Image, StyleSheet, TextInput, Text, TouchableOpacity, ScrollView, Dimensions } from "react-native";

const { height } = Dimensions.get('window');

const AddEditDestinations = () => {
    return (
        <View style={styles.screenContainer}>
            {/* Image of Tokyo */}
            <Image style={styles.backgroundImage} source={require("../assets/images/tokyo.jpg")} />
            {/* Adds a dark overlay on the screen */}
            <View style={styles.darkOverlay} />

            <View style={styles.inputContainer}>
                <TextInput placeholder="Dates" placeholderTextColor="lightgray" style={styles.input} />

                {/* Group of text fields for travelers and budget */}
                <View style={styles.travelersAndBudgetTextField}>
                    <TextInput placeholder="Travelers" placeholderTextColor="lightgray" keyboardType="numeric" style={styles.travelerInput} />
                    <TextInput placeholder="Budget" placeholderTextColor="lightgray" keyboardType="numeric" style={styles.budgetInput} />
                </View>

                {/* Divider Line Below the Inputs */}
                <View style={styles.divider} />

                <View style={styles.destinationsContainer}>
                    <View style={styles.addDestinationRow}>
                        <Text style={styles.text}>Destinations</Text>
                        <TouchableOpacity style={styles.addButton} onPress={() => { }}>
                            <Text style={styles.buttonText}>+ Add</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView contentContainerStyle={styles.scrollViewContainer} style={styles.scrollView}>
                        <View style={styles.destinationElement}></View>
                    </ScrollView>
                    <TouchableOpacity style={styles.generatePlanButton} onPress={() => { }}>
                        <Text style={styles.buttonText}>Generate Plans</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'stretch',
    },

    backgroundImage: {
        width: "100%",
        height: "100%",
        position: "absolute",
        resizeMode: "cover",
        top: 0,
        left: 0,
    },

    darkOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.75)",
    },

    inputContainer: {
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        paddingTop: 40,
        paddingHorizontal: 20,
    },

    input: {
        height: 40,
        width: "100%",
        borderColor: '#999',
        borderBottomWidth: 1,
        marginBottom: 20,
        fontSize: 16,
        backgroundColor: "white",
        borderRadius: 10,
        paddingLeft: 20,
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
    },

    travelersAndBudgetTextField: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 20,
    },

    divider: {
        height: 2,
        backgroundColor: 'white',
        width: "100%",
        marginTop: 20,
    },

    text: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 20,
    },

    destinationsContainer: {
        flexDirection: "column",
    },

    addDestinationRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
    },

    addButton: {
        backgroundColor: "#24a6ad",
        paddingHorizontal: 10,
        borderRadius: 10,
        marginTop: 20,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },

    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 20,
        marginRight: 20,
    },

    // ==== SCROLL WINDOW FOR DESTINATIONS ==== //
    scrollViewContainer: {
        flexGrow: 1,
        alignItems: "center",
        paddingLeft: 10,
        paddingRight: 10,
    },

    scrollView: {
        maxHeight: height * 0.5,
        borderWidth: 2,
        borderColor: "white",
        borderRadius: 10,
        overflow: "hidden",
        marginTop: 20,
        marginBottom: 10,
    },

    // ==== DESTINATION ELEMENT ==== //
    destinationElement: {
        width: "100%",
        height: 75,
        backgroundColor: "#24a6ad",
        marginTop: 10,
        borderRadius: 10,
        opacity: 0.7,
    },

    // ==== GENERATE PLAN BUTTON ==== //
    generatePlanButton: {
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
    }
});

export default AddEditDestinations;