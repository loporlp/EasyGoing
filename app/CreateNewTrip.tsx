// CreateNewTrip.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, TextInput, Modal, Button } from 'react-native';
import { useRouter } from "expo-router";
import AutocompleteTextBox from '../components/AutoCompleteTextBox';
import CalendarPicker from 'react-native-calendar-picker';
import moment from "moment";
import AddEditDestinations from './AddEditDestinations';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { createTrip } from '@/scripts/databaseInteraction';

export const head = () => ({
    title: "Create New Trip TEST"
});

const CreateNewTrip = () => {

    // Sets up navigations
    const router = useRouter();
    const navigation = useNavigation();

    // Calendar State
    const [isModalVisible, setModalVisible] = useState(false); // Controls date modal visibility
    const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null); // Explicitly define state type
    const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
    const [datesText, setDatesText] = useState("");

    // Budget Input State
    const [budget, setBudget] = useState('');

    // Trip Name
    const [tripName, setTripName] = useState("");
    const [tripModal, showTripModal] = useState(true);

    // Autocomplete Modal State
    const [isAutocompleteModalVisible, setAutocompleteModalVisible] = useState(false);
    const [selectedAutocompletePlace, setSelectedAutocompletePlace] = useState<string>('');
    const [locationAddress, setLocationAddress] = useState<string>(''); // Added state for location address

    // Function to check if all required fields have values
    const isFormValid = selectedAutocompletePlace !== '' && datesText !== '' && budget !== '';

    // Handles Navigation to Next Screen
    const startPlanning = async () => {
        console.log('Selected place before navigation:', selectedAutocompletePlace);
        //makes sure that trip is finished being made (so currentID is properly being set)
        const isTripCreated = await createTrip(tripName, selectedStartDate, selectedEndDate, budget, selectedAutocompletePlace);
        //only proceed if the trip was successfully created
        if (isTripCreated) {
            router.replace("/AddEditDestinations");
        } else {
            console.error("Trip creation failed");
        }
    };

    // Handles Date Selection in Calendar
    const handleDateChange = (date: Date, type: 'START_DATE' | 'END_DATE') => {
        if (type === "END_DATE") {
            setSelectedEndDate(date);
        } else {
            setSelectedStartDate(date);
            setSelectedEndDate(null); // Reset the end date when start date is changed
        }
    };

    // Updates the Date Text When Done
    const handleDone = () => {
        if (selectedStartDate && selectedEndDate) {
            const startFormatted = moment(selectedStartDate).format("ddd, MMM D");
            const endFormatted = moment(selectedEndDate).format("ddd, MMM D");
            setDatesText(`${startFormatted} - ${endFormatted}`);
        }
        setModalVisible(false);
    };

    // Handles Selection from Autocomplete
    const handleAutocompletePlaceSelect = (place: { description: string }) => {
        setSelectedAutocompletePlace(place.description);
        setLocationAddress(place.description); // Updates location address
        setAutocompleteModalVisible(false);
    };

    return (
        <View style={styles.container}>

            {/* Background Image */}
            <Image style={styles.backgroundImage} source={require("../assets/images/createTripImage.jpg")} />

            {/* Adds a dark overlay on the screen */}
            <View style={styles.darkOverlay} />
            <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ marginHorizontal: 20, position: "absolute", marginTop: 50 }}>
                <Ionicons name="arrow-back-outline" size={30} color={"white"} />
            </TouchableOpacity>

            {/* Other UI elements on the screen */}
            <View style={styles.createTripContainer}>

                <Text style={styles.createTripLabel}>Where are we{" "}
                    <Text style={styles.highlightText}>going</Text>, Traveler?</Text>

                {/* Autocomplete Input */}
                <TouchableOpacity style={styles.destinationInput} onPress={() => setAutocompleteModalVisible(true)}>
                    <Ionicons name="location" size={22} color={"#24a6ad"} />
                    <View style={{ flex: 1, marginLeft: 5 }}>
                        {selectedAutocompletePlace ? (
                            <Text style={{ fontSize: 18 }} numberOfLines={1} ellipsizeMode="tail">
                                {selectedAutocompletePlace}
                            </Text>
                        ) : (
                                <Text style={{ fontSize: 18, color: "lightgray" }} numberOfLines={1} ellipsizeMode="tail">
                                    Destination
                                </Text>
                            )}
                    </View>
                </TouchableOpacity>

                {/* Date Selection Input */}
                <TouchableOpacity style={styles.destinationInput} onPress={() => setModalVisible(true)}>
                    <Ionicons name="calendar" size={22} color={"#24a6ad"} />
                    <TextInput
                        placeholder="Dates"
                        placeholderTextColor="lightgray"
                        style={{ color: 'black', fontSize: 18, marginLeft: 5 }}
                        value={datesText}
                        editable={false} // Make the TextInput non-editable, so the user can't manually edit
                    />
                </TouchableOpacity>

                {/* Budget Input */}
                <TouchableOpacity style={styles.destinationInput}>
                    <Ionicons name="wallet" size={22} color={"#24a6ad"} />
                    <TextInput placeholder="Budget" placeholderTextColor="lightgray" keyboardType="numeric" style={{ fontSize: 18, paddingLeft: 5, width: "100%" }} returnKeyType="done" onChangeText={setBudget} />
                </TouchableOpacity>

                {/* Start Planning Button */}
                <TouchableOpacity style={[styles.createPlanButton, !isFormValid && { backgroundColor: "gray" }]} onPress={startPlanning} disabled={!isFormValid}>
                    <Text style={styles.startPlanningButtonText}>Start Planning!</Text>
                </TouchableOpacity>

            </View>

            {/* Modal for naming a trip */}
            <Modal visible={tripModal} transparent={true} onRequestClose={() => showTripModal(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TextInput placeholder="Trip name" placeholderTextColor="gray" style={{ fontSize: 18, paddingLeft: 5, width: "100%", backgroundColor: "white", borderRadius: 10, borderWidth: 1, borderColor: "gray" }} returnKeyType="done" onChangeText={setTripName} />
                        <View style={{flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: 15, width: "100%"}}>
                            <TouchableOpacity style={{backgroundColor: "red", width: "30%", height: 40, alignItems: "center", justifyContent: "center", borderRadius: 10}} onPress={() => showTripModal(false)}>
                                <Text style={{fontWeight: "700", color: "white"}}>LATER</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{backgroundColor: "#24a6ad", width: "30%", height: 40, alignItems: "center", justifyContent: "center", borderRadius: 10}} onPress={() => showTripModal(false)}>
                                <Text style={{fontWeight: "700", color: "white"}}>CONFIRM</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal with CalendarPicker */}
            <Modal visible={isModalVisible} transparent={true} onRequestClose={() => setModalVisible(false)}>
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

            {/* Modal with Autocomplete search */}
            <Modal visible={isAutocompleteModalVisible} transparent={true} onRequestClose={() => setAutocompleteModalVisible(false)}>
                <View style={styles.modalAutocompleteOverlay}>
                    <View style={styles.modalAutocompleteContent}>
                        <AutocompleteTextBox
                            onPlaceSelect={(place) => {
                                handleAutocompletePlaceSelect(place);
                                return place.description; // Explicitly return a string
                            }}
                            placeholder="Destination"
                            placeholderTextColor="lightgray"
                            style={{ width: "100%", paddingRight: 25, borderColor: "black", borderWidth: 1, borderRadius: 10 }}
                        />
                        <View style={{ position: "absolute", top: 18, right: 25 }}>
                            <TouchableOpacity onPress={() => setAutocompleteModalVisible(false)}>
                                <Ionicons name="close-circle" size={24} color={"#24a6ad"} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    backgroundImage: {
        width: "100%",
        height: "100%",
        position: "absolute",
        resizeMode: "cover",
    },

    darkOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
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
        marginHorizontal: 20
    },

    textFields: {
        flex: 1,
        flexDirection: "column",
        alignContent: "center",
    },

    input: {
        height: 50,
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

    destinationInput: {
        flexDirection: "row",
        backgroundColor: "white",
        height: 50,
        width: "100%",
        overflow: "hidden",
        borderColor: '#999',
        marginBottom: 15,
        paddingLeft: 10,
        borderRadius: 10,
        paddingVertical: 5,
        justifyContent: "flex-start",
        alignItems: "center",
        shadowColor: "#333333",
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3
    },

    dateInput: {
        height: 50,
        width: "80%",
        borderColor: '#999',
        borderBottomWidth: 1,
        marginBottom: 20,
        fontSize: 16,
        backgroundColor: "white",
        paddingLeft: 20,
        borderRadius: 10,
    },

    travelerInput: {
        height: 50,
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
        height: 50,
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
        borderRadius: 10,
        marginTop: 20,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
        shadowColor: "#333333",
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        marginBottom: 60,
    },

    startPlanningButtonText: {
        color: "white",
        fontSize: 14,
        fontWeight: "bold",
        marginLeft: 40,
        marginRight: 40,
    },

    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '95%',
        backgroundColor: '#F4F4F4',
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

    modalAutocompleteOverlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },

    modalAutocompleteContent: {
        width: '100%',
        height: "40%",
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "flex-start",
        paddingTop: 10,
    },
});

export default CreateNewTrip;

function setSelectedCoordinates(arg0: { latitude: any; longitude: any; }) {

}