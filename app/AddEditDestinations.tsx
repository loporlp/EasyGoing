// AddEditDestinations.tsx
import { useState } from 'react';
import { View, Image, StyleSheet, TextInput, Text, TouchableOpacity, ScrollView, Dimensions, Modal, ImageBackground, Button } from "react-native";
import { useRouter } from "expo-router";
import AutocompleteTextBox from '../components/AutoCompleteTextBox';

const { height } = Dimensions.get('window');

const AddEditDestinations = () => {
    const router = useRouter();

    // Modal (Pop-up)
    const [visible, setVisible] = useState(false);
    const show = () => setVisible(true);
    const hide = () => setVisible(false);

    const addLocation = () => {
        if (!location || !locationAddress || !duration || !priority) {
            alert("Please fill out all fields");
            return;
        }

        const newDestination = {
            name: location,
            address: locationAddress,
            image: require("../assets/images/tokyoskytree.jpg"),
            duration: duration,
            priority: priority,
            route: "",
            notes: typedNotes
        };

        setDestinations(prevDestinations => [...prevDestinations, newDestination]);

        console.log(destinations);

        // Clear the input fields after adding
        setLocation("");
        setLocationAddress("");
        setDuration("");
        setPriority("");
        setNotes("");

        hide();
    };

    const deleteLocation = (index: number) => {
        setDestinations(prevDestinations => prevDestinations.filter((_, i) => i !== index));
    };

    const [destinations, setDestinations] = useState([
        {
            name: "Tokyo Skytree",
            address: "",
            image: require("../assets/images/tokyoskytree.jpg"),
            duration: "2 hrs",
            priority: "2",
            route: "/HomeScreen_API_Test",
            notes: ""
        },
        {
            name: "Akihabara Electric Town",
            address: "",
            image: require("../assets/images/AkihabaraElectricTown.jpg"),
            duration: "6 hrs",
            priority: "1",
            route: "",
            notes: ""
        },
        {
            name: "Pokemon Center",
            address: "",
            image: require("../assets/images/PokemonCenterShibuya.png"),
            duration: "1.5 hrs",
            priority: "3",
            route: "",
            notes: ""
        },
        {
            name: "Meiji Jingu",
            address: "",
            image: require("../assets/images/MeijiJingu.jpg"),
            duration: "2 hrs",
            priority: "3",
            route: "",
            notes: ""
        },
        {
            name: "Imperial Palace",
            address: "",
            image: require("../assets/images/ImperialPalace.jpg"),
            duration: "2 hrs",
            priority: "4",
            route: "",
            notes: ""
        }
    ]);

    const [location, setLocation] = useState("");
    const [locationAddress, setLocationAddress] = useState("");
    const [duration, setDuration] = useState("");
    const [priority, setPriority] = useState("");
    const [typedNotes, setNotes] = useState("");

    return (
        <View style={styles.screenContainer}>

            {/* Image of Tokyo */}
            <Image style={styles.backgroundImage} source={require("../assets/images/tokyo.jpg")} />

            {/* Adds a dark overlay on the screen */}
            <View style={styles.darkOverlay} />

            <View style={styles.inputContainer}>
                <TextInput placeholder="Fri, Jul. 11 - Tue, Jul. 15" placeholderTextColor="black" style={styles.input} />

                {/* Group of text fields for travelers and budget */}
                <View style={styles.travelersAndBudgetTextField}>
                    <TextInput placeholder="1 traveler" placeholderTextColor="black" keyboardType="numeric" style={styles.travelerInput} />
                    <TextInput placeholder="$1,700" placeholderTextColor="black" keyboardType="numeric" style={styles.budgetInput} />
                </View>

                {/* Divider line below the inputs */}
                <View style={styles.divider} />

                <View style={styles.destinationsContainer}>
                    <View style={styles.addDestinationRow}>
                        <Text style={styles.text}>Destinations</Text>
                        <TouchableOpacity style={styles.addButton} onPress={show}>
                            <Text style={styles.buttonText}>+ Add</Text>
                        </TouchableOpacity>
                    </View>

                    {/*The window where all of the destinations are shown*/}
                    <ScrollView contentContainerStyle={styles.scrollViewContainer} style={styles.scrollView}>
                        {destinations.map((destination, index) => (
                            <View key={index} style={styles.destinationElement}>
                                <TouchableOpacity
                                    style={styles.destinationContainer}
                                    onPress={() => {
                                        if (destination.route) {
                                            router.push(destination.route);
                                        }
                                    }}
                                >
                                    <View style={styles.backgroundContainer}>
                                        <View style={[styles.backgroundOverlay, { opacity: 0.7 }]}></View>
                                    </View>

                                    <View style={styles.destinationContainer}>
                                        <Image style={styles.destinationImage} source={destination.image} />
                                        <View style={styles.destinationLabel}>
                                            <Text style={styles.destinationName}>{destination.name}</Text>
                                            <Text style={styles.destinationDetails}>
                                                Duration: {destination.duration} | Priority: {destination.priority}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>

                                {/* Delete button */}
                                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteLocation(index)}>
                                    <Text style={styles.buttonText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>

                    {/* "Generate Plan" button */}
                    <TouchableOpacity style={styles.generatePlanButton} onPress={() => {router.push("/GenerateItineraryScreen") }}>
                        <Text style={styles.buttonText}>Generate Plans</Text>
                    </TouchableOpacity>

                    <Modal animationType="fade" visible={visible} transparent={true} onRequestClose={hide}>
                        <View style={styles.popup}>
                            <ImageBackground source={require("../assets/images/blue.png")} style={styles.backgroundImage}>
                                <View style={styles.inputContainer}>
                                    {/* Text Input For Location, Duration, Priority, and Notes */}
                                    <View style={styles.textContainer}>
                                        <Text style={styles.text}>Location:</Text>
                                        <TextInput
                                            style={styles.textBox}
                                            placeholder="Location"
                                            placeholderTextColor="gray"
                                            value={location}
                                            onChangeText={setLocation}
                                        />
                                        <Text style={styles.text}>Location:</Text>
                                        <AutocompleteTextBox
                                            onPlaceSelect={setLocationAddress}
                                            placeholder="Address"
                                            placeholderTextColor="gray"
                                            style={styles.textBox}
                                        />
                                        <Text style={styles.text}>Duration (Minutes):</Text>
                                        <TextInput
                                            style={styles.textBox}
                                            placeholder="1 hr"
                                            placeholderTextColor="gray"
                                            keyboardType="numeric"
                                            value={duration}
                                            onChangeText={setDuration}
                                        />
                                        <Text style={styles.text}>Priority:</Text>
                                        <TextInput
                                            style={styles.textBox}
                                            placeholder="1"
                                            placeholderTextColor="gray"
                                            keyboardType="numeric"
                                            value={priority}
                                            onChangeText={setPriority}
                                        />
                                        <Text style={styles.text}>Notes:</Text>
                                        <TextInput
                                            style={styles.textBox}
                                            placeholder="Notes"
                                            placeholderTextColor="gray"
                                            value={typedNotes}
                                            onChangeText={setNotes}
                                        />
                                    </View>
                                    {/* Add + Cancel Buttons TODO: figure out why these buttons are overlayed on the text box*/}
                                    <View style={styles.buttonContainer}>
                                        <View style={styles.button}>
                                        <Button title="Cancel" onPress={hide} />
                                        </View>
                                        <View style={styles.button}>
                                        <Button title="Add" onPress={addLocation} />
                                        </View>
                                    </View>
                                </View>
                            </ImageBackground>
                        </View>
                    </Modal>
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
         fontSize: 16,
         fontWeight: "bold",
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
        width: "100%",
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
    },
    popup: {
        width: "100%",
        height: "75%",
        position: "absolute",
        top: 60, //padding for status bar
        bottom: "10%",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    },
    textBox: {
        color: "black",
        height: 40,
        borderColor: "purple",
        borderWidth: 1,
        fontSize: 16,
        backgroundColor: "white",
        alignSelf: 'stretch',
        textAlign: 'left',
    },
    textContainer: {
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "50%",
        marginBottom: 20,
    },
    buttonContainer: {
        position: "relative",
        top: 185,
        flexDirection: "row",
        justifyContent: "flex-end",
        width: "100%",
        height: "20%",
    },
    button: {
        height: 50,
    },
    deleteButton: {
        position: "absolute", // Position it absolutely within the parent container
        top: 5,               // Adjust the distance from the top
        right: 5,             // Adjust the distance from the right edge
        backgroundColor: "red",
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
});

export default AddEditDestinations;