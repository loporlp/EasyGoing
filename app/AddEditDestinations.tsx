// AddEditDestinations.tsx
import { useState, useLayoutEffect } from 'react';
import { View, Image, StyleSheet, TextInput, Text, TouchableOpacity, ScrollView, Dimensions, Modal, ImageBackground, Button } from "react-native";
import { useRouter } from "expo-router";
import AutocompleteTextBox from '../components/AutoCompleteTextBox';
import { storeData, getData } from '../scripts/localStore.js';
import DynamicImage from '../components/DynamicImage';
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SwipeListView } from 'react-native-swipe-list-view';
import CalendarPicker from 'react-native-calendar-picker';
import moment from "moment";
import GenerateItineraryScreen from './GenerateItineraryScreen';
import {Trip} from "../models/TripModel";

//TODO: remove this later, this is SAMPLE data used for testing dynamic storage.
const test_trip: Trip = {
    tripName: "Japan Trip",
    tripStartDate: "2023-06-01",
    tripEndDate: "2023-06-15",
    budget: 3000,
    origin: "123 Main St, New York, NY",
    destinations: [
      {
        destinationID: 0,
        alias: "Eiffel Tower",
        address: "Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France",
        priority: 1,
        mode: "Flight",
        transportToNext: "Mont Saint-Michel",
        transportDuration: "2h",
        startDateTime: "2023-06-02T10:00:00Z",
        duration: "3h",
        notes: "Buy tickets in advance",
        dayOrigin: true,
        cost: 50,
        picture: JSON.stringify({ url: "Central Park" })
      },
      {
        destinationID: 1,
        alias: "Mont Saint-Michel",
        address: "50170 Mont Saint-Michel, France",
        priority: 2,
        mode: "Train",
        transportToNext: "Sky Tree",
        transportDuration: "1h",
        startDateTime: "2023-06-03T09:00:00Z",
        duration: "5h",
        notes: "Check tide schedule for best experience",
        dayOrigin: false,
        cost: 25,
        picture: JSON.stringify({ url: "Central Park" })
      }
      
    ]
};

//TODO: rewrite these to simply retrieve/store current trip so that test_trip isn't needed.
/*
//stores destination object in local storage with key 'destination'
async function storeDestination(key: string, destination: any) {
    await storeData(key, destination);
    console.log(`New Destination stored as ${key} with values: 
        Name - ${destination.name}, 
        Address - ${destination.address}, 
        Image - ${destination.image}, 
        Duration - ${destination.duration}, 
        Priority - ${destination.priority}, 
        Route - ${destination.route}, 
        Notes - ${destination.notes}`);
}

//retrieves destination object in local storage with key provided
async function retrieveDestination(key: string) {
    try {
        const destination = await getData(key);
        console.log(`Retrieved ${key} with values: 
            Name - ${destination.name}, 
            Address - ${destination.address}, 
            Image - ${destination.image}, 
            Duration - ${destination.duration}, 
            Priority - ${destination.priority}, 
            Route - ${destination.route}, 
            Notes - ${destination.notes}`);
        return destination; // Return the destination object as it was stored originally
    } catch (e) {
        console.error(`Error retrieving ${key}:`, e);
        return null;
    }
}
*/

const { height } = Dimensions.get('window');

const AddEditDestinations = () => {
    const router = useRouter();
    const navigation = useNavigation();
    // Modal (Pop-up)
    const [visible, setVisible] = useState(false);
    const show = () => setVisible(true);
    const hide = () => setVisible(false);
    // Track if user is currently editing a destionation (and if so, what index)
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState<number>(-1); // To store the index of the item being edited, -1 is default as it shouldn't ever be called if isEditing is false

    const addLocation = () => {
        // If missing a required field
        let errorMessage = "";
        if (!alias) {
            errorMessage += "Location Alias (shorthand) is required.\n"
        }
        if (!location) {
            errorMessage += "Address is required.\n";
        }
        if (!duration) {
            errorMessage += "Duration is required.\n";
        }
        if (!priority) {
            errorMessage += "Priority is required.\n";
        }
        if (errorMessage) {
            alert(errorMessage.trim());
            return;
        }

        // Set default priority to -1 (as an integer) if it's empty or invalid
        const priorityValue = priority.trim() === "" || isNaN(Number(priority)) ? -1 : parseInt(priority);

        const newDestination = {
            destinationID: test_trip.destinations.length, //the ID will be the length (amount of destionation in trip) as the previous ID should be length -1
            alias: alias,
            address: location,
            priority: priorityValue,
            mode: "", //TODO: implement this in app
            transportToNext: "", //TODO: implement this in app
            transportDuration: "", //TODO: implement this in app
            startDateTime: "", //TODO: implement this in app
            duration: duration,
            notes: typedNotes,
            dayOrigin: true, //TODO: figure out how to check if this is the day's origin (will require existing data to compare to)
            cost: 40, // TODO: implement this in app
            picture: JSON.stringify({ url: alias })
        };
        if(isEditing) {
            const oldDestination = test_trip.destinations[editIndex];
            newDestination.destinationID = oldDestination.destinationID;
            newDestination.mode = oldDestination.mode;
            newDestination.transportToNext = oldDestination.transportToNext ?? ""; //defaults to empty if there was no value
            newDestination.transportDuration = oldDestination.transportDuration;
            newDestination.startDateTime = oldDestination.startDateTime;
            newDestination.dayOrigin = oldDestination.dayOrigin;
            newDestination.cost = oldDestination.cost;
            //replaces existing destination with the newly edited one
            test_trip.destinations[editIndex] = newDestination; //updates local storage
            setDestinations(prevDestinations => 
                prevDestinations.map((destination, index) => 
                    index === editIndex ? { ...destination, ...newDestination } : destination
                )
            );            
            //disable editing mode now that editing is done
            setIsEditing(false), setEditIndex(-1);
        } else {
            setDestinations(prevDestinations => [...prevDestinations, newDestination]);
            // Store the new destination as part of a trip in AsyncStorage
            //TODO: see methods above, must remake
            /*
            storeDestination("destination", newDestination);
            retrieveDestination("destination");
            */ 
            test_trip.destinations.push(newDestination)
        }
        console.log(newDestination);

        // Clear the input fields after adding
        setAlias("");
        setLocation("");
        setDuration("");
        setPriority("");
        setNotes("");

        // Re-hides input screen
        hide();
    };

    //sets to editing mode before opening the edit screen, setting relevant values
    const editLocation = (index: number) => {
        setIsEditing(true), setEditIndex(index);
        const oldDestination = test_trip.destinations[index];
        setAlias(oldDestination.alias);
        setLocation(oldDestination.address);
        setDuration(oldDestination.duration);
        setPriority(oldDestination.priority.toString());
        setNotes(oldDestination.notes || ""); //defaults notes to empty if it is
        show()
    }

    //deletes location from both local storage and the destinations UI element
    const deleteLocation = (index: number) => {
        test_trip.destinations = test_trip.destinations.filter((_, i) => i !== index);
        setDestinations(prevDestinations => prevDestinations.filter((_, i) => i !== index));
    };

    //dynamically displays the destinations stored in this trip (if there are any)
    const [destinations, setDestinations] = useState(
        test_trip.destinations.map(destination => ({
            destinationID: destination.destinationID,
            alias: destination.alias,
            address: destination.address,
            priority: destination.priority,
            mode: destination.mode,
            transportToNext: destination.transportToNext,
            transportDuration: destination.transportDuration,
            startDateTime: destination.startDateTime,
            duration: destination.duration,
            notes: destination.notes,
            dayOrigin: destination.dayOrigin,
            cost: destination.cost,
            picture: destination.picture ? JSON.parse(destination.picture).url : "" //sets blank if no picture URL parsed, might be worth setting a default image here
        }))
    );

    const [alias, setAlias] = useState("");
    const [location, setLocation] = useState("");
    const [duration, setDuration] = useState("");
    const [priority, setPriority] = useState("");
    const [typedNotes, setNotes] = useState("");

    // Calendar Modal
    const [isModalVisible, setModalVisible] = useState(false); // To control modal visibility
    const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null); // Explicitly define state type
    const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null); // Explicitly define state type
    const [datesText, setDatesText] = useState("");

    const handleDateChange = (date: Date, type: 'START_DATE' | 'END_DATE') => {
        if (type === "END_DATE") {
            setSelectedEndDate(date);
        } else {
            setSelectedStartDate(date);
            setSelectedEndDate(null); // Reset the end date when start date is changed
        }
    };

    const handleDone = () => {
        if (selectedStartDate && selectedEndDate) {
            const startFormatted = moment(selectedStartDate).format("ddd, MMM D");
            const endFormatted = moment(selectedEndDate).format("ddd, MMM D");
            setDatesText(`${startFormatted} - ${endFormatted}`);
        }
        setModalVisible(false);
    };

    // Swipable List components
    const [swipeStatus, setSwipeStatus] = useState<{ [key: string]: boolean }>({});

    // Function to handle swipe state
    const handleSwipeChange = (swipeData: any) => {
        const { key, value } = swipeData;
        if (value !== 0) {
            // If swiping, remove border radius
            setSwipeStatus((prevState) => ({ ...prevState, [key]: true }));
        } else {
            // If swipe is reset, restore border radius
            setSwipeStatus((prevState) => ({ ...prevState, [key]: false }));
        }
    };

    const renderHiddenItem = ({ item, index }: { item: any; index: number }) => (
        <View style={[styles.hiddenItem, { height: 100 }]}>
            <TouchableOpacity onPress={() => { }} style={[styles.editButton, { width: Math.abs(rightOpenValue / 2) }]} onPressIn={() => editLocation(index)}>
                <Ionicons name="pencil-sharp" size={25} color={"white"} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { }} style={[styles.deleteButton, { width: Math.abs(rightOpenValue / 2) }]} onPressIn={() => deleteLocation(index)}>
                <Ionicons name="trash-bin" size={25} color={"white"} />
            </TouchableOpacity>
        </View>
    );

    const renderItem = ({ item }: any) => {
        const isSwiped = swipeStatus[item.key];
        return (
            <View
                style={[
                    styles.destination,
                    { borderRadius: isSwiped ? 0 : 10 },
                ]}
            >
                <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                    <DynamicImage placeName={item.alias} containerStyle={styles.destinationImage} imageStyle={styles.destinationImage} />
                    <View style={{ flex: 1, flexDirection: "column", paddingVertical: 10, marginVertical: 10 }}>
                        <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginLeft: -50 }}>
                            <Ionicons name="location" size={20} color={"#24a6ad"} />
                            <Text style={{ flex: 1, fontSize: 20, fontWeight: "700", marginLeft: 5 }}>{item.alias}</Text>
                        </View>

                        <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginRight: 5, marginLeft: -50 }}>
                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                <Ionicons name="time" size={18} color={"#24a6ad"} />
                                <Text style={{ marginLeft: 5 }}>{item.duration}</Text>
                            </View>

                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginRight: 5 }}>
                                <MaterialCommunityIcons name="priority-high" size={18} color={"#24a6ad"} />
                                <Text style={{ marginLeft: 5 }}>{item.priority}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    const rightOpenValue = -150;

    return (
        <View style={styles.container}>
            {/* Background image */}
            <DynamicImage placeName="New York City" containerStyle={styles.backgroundImage} imageStyle={styles.backgroundImage} />
            <View style={styles.darkOverlay}></View>

            <View style={{ flex: 1, flexDirection: "column", marginHorizontal: 20, position: "absolute", marginTop: 50 }}>
                <TouchableOpacity onPress={() => { navigation.goBack() }}>
                    <Ionicons name="arrow-back-outline" size={30} color={"white"} />
                </TouchableOpacity>

                {/* Group of text fields */}
                <View style={{ marginTop: 15 }}>
                    <TouchableOpacity style={[styles.input, { flex: 1, flexDirection: "row", alignItems: 'center' }]}>
                        <Ionicons name="location" size={22} color={"#24a6ad"} />
                        {/* TODO: switch TextInput with AutocompleteTextBox */}
                        <AutocompleteTextBox placeholder="Origin" placeholderTextColor="gray" />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.input, { flex: 1, flexDirection: "row", alignItems: 'center' }]} onPress={() => setModalVisible(true)}>
                        <Ionicons name="calendar-sharp" size={22} color={"#24a6ad"} />
                        <Text style={{ fontSize: 18, marginLeft: 5, width: "100%", color: 'black' }}>{datesText || "Sat. Jul 13 - Sun. Jul 14"}</Text>
                    </TouchableOpacity>

                    <View style={styles.travelersAndBudgetTextField}>
                        <TouchableOpacity style={[styles.travelerInput, { flex: 1, flexDirection: "row", alignItems: 'center' }]}>
                            <Ionicons name="time" size={22} color={"#24a6ad"} />
                            <TextInput placeholder="Leave at..." placeholderTextColor="gray" keyboardType="numeric" style={{ fontSize: 18, marginLeft: 5 }} />
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.budgetInput, { flex: 1, flexDirection: "row", alignItems: 'center' }]}>
                            <Ionicons name="wallet" size={22} color={"#24a6ad"} />
                            <TextInput placeholder="$1,700" placeholderTextColor="black" keyboardType="numeric" style={{ fontSize: 18, marginLeft: 5 }} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Scrollable window that displays all the destinations added */}
            <View style={styles.destinationScreen}>
                <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 10, marginHorizontal: 20, marginTop: 10 }}>Destinations Selected <Text style={{ color: "#24a6ad" }}>({destinations.length})</Text>:</Text>
                <SwipeListView
                    data={destinations.map((item, index) => ({ ...item, key: `${index}` }))}
                    renderItem={renderItem}
                    renderHiddenItem={(data, rowMap) => renderHiddenItem({ ...data, index: parseInt(data.item.key) })}
                    leftOpenValue={rightOpenValue}
                    rightOpenValue={rightOpenValue}
                    friction={60}
                    tension={30}
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                    onSwipeValueChange={handleSwipeChange}>
                </SwipeListView>
            </View>

            <View style={styles.navBar}>
                <TouchableOpacity style={{ padding: 10, marginLeft: 20 }} onPress={show}>
                    <Ionicons name="add" size={30} color={"#24a6ad"} />
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 10 }}>
                    <MaterialCommunityIcons name="application-import" size={30} color={"#24a6ad"} />
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 10, marginRight: 20 }} onPress={() => { router.push("/GenerateItineraryScreen") }}>
                    <Ionicons name="arrow-forward-circle-sharp" size={30} color={"#24a6ad"} />
                </TouchableOpacity>
            </View>

            {/* Add destination pop-up */}
            <Modal animationType="fade" visible={visible} transparent={true} onRequestClose={hide}>
                <View style={styles.popup}>
                    <ImageBackground source={require("../assets/images/blue.png")} style={styles.backgroundImage}>
                        <View style={styles.inputContainer}>
                            {/* Text Input For Location, Duration, Priority, and Notes */}
                            <View style={styles.textContainer}>
                                <Text style={styles.text}>Alias (Shorthand Name):</Text> 
                                <TextInput
                                    style={styles.textBox} //TODO: figure out how we want to make asking for alias more smooth
                                    placeholder="Grabbing Food" 
                                    placeholderTextColor="gray"
                                    value={alias}
                                    onChangeText={setAlias}
                                />
                                <Text style={styles.text}>Address:</Text>
                                <AutocompleteTextBox
                                    value = {location}
                                    onPlaceSelect={(place) => {
                                        setLocation(place.description);
                                        return place.description; // Explicitly return the string
                                    }}
                                    placeholder="Address"
                                    placeholderTextColor="gray"
                                    style={styles.textBox}
                                />
                                <Text style={styles.text}>Duration (Minutes):</Text>
                                <TextInput
                                    style={styles.textBox}
                                    placeholder="30m"
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
                            {/* Add + Cancel Buttons*/}
                            <View style={styles.buttonContainer}>
                                <View style={styles.button}>
                                    <Button title="Cancel" onPress={hide} />
                                </View>
                                <View style={styles.button}>
                                    <Button title={isEditing ? "Edit" : "Add"} onPress={addLocation} />
                                </View>
                            </View>
                        </View>
                    </ImageBackground>
                </View>
            </Modal>

            {/* Pop-up for Date Interval picker */}
            {/* Modal with CalendarPicker */}
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>

                        <CalendarPicker
                            startFromMonday={true}
                            allowRangeSelection={true}
                            minDate={new Date()}
                            onDateChange={handleDateChange}
                            selectedDayColor="#24a6ad"
                            dayShape="circle"
                        />

                        <TouchableOpacity style={styles.calendarDoneButton} onPress={handleDone}>
                            <Text style={styles.startPlanningButtonText}>Done</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: "#F4F4F4"
    },

    backgroundImage: {
        width: "100%",
        borderRadius: 0,
        position: "absolute",
        resizeMode: "cover",
        left: 0,
        top: 0
    },

    darkOverlay: {
        position: "relative",
        top: 0,
        left: 0,
        width: "100%",
        height: 300,
        resizeMode: "cover",
        backgroundColor: "rgba(0, 0, 0, 0.4)"
    },

    travelerInput: {
        height: 40,
        flex: 1,
        borderColor: '#999',
        borderBottomWidth: 1,
        marginRight: 10,
        backgroundColor: "white",
        paddingLeft: 10,
        borderRadius: 10,
        paddingTop: 5,
        paddingBottom: 5,
        shadowColor: "#333333",
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },

    budgetInput: {
        height: 40,
        width: "50%",
        borderColor: '#999',
        borderBottomWidth: 1,
        fontSize: 18,
        backgroundColor: "white",
        paddingLeft: 10,
        borderRadius: 10,
        paddingTop: 5,
        paddingBottom: 5,
        shadowColor: "#333333",
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3
    },

    travelersAndBudgetTextField: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 10,
    },

    input: {
        height: 40,
        maxWidth: "100%",
        overflow: "hidden",
        borderColor: '#999',
        borderBottomWidth: 1,
        marginBottom: 10,
        backgroundColor: "white",
        borderRadius: 10,
        paddingLeft: 10,
        paddingTop: 5,
        paddingBottom: 5,
        paddingRight: 25,
        shadowColor: "#333333",
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3
    },

    // ==== BOTTOM SCREEN ==== //
    destinationScreen: {
        backgroundColor: "#F4F4F4",
        flex: 1,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        marginTop: -40,
    },

    navBar: {
        flexDirection: "row",
        backgroundColor: "white",
        justifyContent: "space-between",
        alignItems: "center",
        height: "8%",
        shadowColor: "#333333",
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },

    destination: {
        backgroundColor: "white",
        width: "100%",
        height: 100,
        marginBottom: 10,
        borderRadius: 10,
        shadowColor: "#333333",
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },

    destinationImage: {
        width: 100,
        height: 100,
        resizeMode: "cover",
        overflow: "hidden",
        borderRadius: 10,
        marginLeft: -30
    },

    hiddenItem: {
        backgroundColor: "white",
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: 'center',
        borderRadius: 10,
        width: "100%",
        marginBottom: 10,
    },

    deleteButton: {
        backgroundColor: "red",
        height: "100%",
        paddingHorizontal: 15,
        justifyContent: "center",
        alignItems: "center",
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10
    },

    editButton: {
        backgroundColor: "#24a6ad",
        height: "100%",
        paddingHorizontal: 15,
        justifyContent: "center",
        alignItems: "center",
    },

    // ==== MODAL ==== //
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

    text: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 20,
    },

    inputContainer: {
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        paddingTop: 40,
        paddingHorizontal: 20,
    },

    // ==== Calendar Modal === //
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },

    modalContent: {
        width: '100%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },

    calendarDoneButton: {
        backgroundColor: "#24a6ad",
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 15,
        marginTop: 10,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },

    startPlanningButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 40,
        marginRight: 40,
    },
});

export default AddEditDestinations;