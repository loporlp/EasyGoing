// CreateNewTrip.tsx
import React, { useState } from 'react';
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

    // calendar
    const [isModalVisible, setModalVisible] = useState(false); // To control modal visibility
    const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null); // Explicitly define state type
    const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null); // Explicitly define state type
    const [datesText, setDatesText] = useState("");
    const [selectedPlace, setSelectedPlace] = useState<string>(''); // for place name
    const [travelers, setTravelers] = useState('');
    const [budget, setBudget] = useState('');

    // function to check if all required fields have values
    const isFormValid = 
        selectedPlace !== '' &&
        datesText !== '';

    const [isAutocompleteModalVisible, setAutocompleteModalVisible] = useState(false); // To control modal visibility
    const [selectedAutocompletePlace, setSelectedAutocompletePlace] = useState<string>('');

    const startPlanning = () => {
        console.log('Selected place before navigation:', selectedPlace);
        createTrip(selectedStartDate, selectedEndDate, budget, selectedPlace);
        router.push("/AddEditDestinations");
    }

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

    const handleAutocompletePlaceSelect = (place: { description: string }) => {
        setSelectedAutocompletePlace(place.description);
        setAutocompleteModalVisible(false);
    };


    const handlePlaceSelect = (place: { geometry: { location: { lat: any; lng: any; }; }; description: React.SetStateAction<string>; }) => {
        // Extract latitude and longitude from the selected place details
        if (place && place.geometry && place.geometry.location) {
            setSelectedCoordinates({
                latitude: place.geometry.location.lat,
                longitude: place.geometry.location.lng,
            });
        }
        setSelectedPlace(place.description);
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

                <TouchableOpacity style={styles.destinationInput} onPress={() => setAutocompleteModalVisible(true)}>
                    <Ionicons name="location" size={22} color={"#24a6ad"} />
                    <View style={{ flex: 1, marginLeft: 5 }}>
                        {(selectedAutocompletePlace) ? (
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

                <TouchableOpacity style={styles.destinationInput}>
                    <Ionicons name="wallet" size={22} color={"#24a6ad"} />
                    <TextInput placeholder="Budget" placeholderTextColor="lightgray" keyboardType="numeric" style={{ fontSize: 18, paddingLeft: 5, width: "100%" }} returnKeyType="done" onChangeText={setBudget}/>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.createPlanButton, !isFormValid && {backgroundColor: "gray"}]} onPress={startPlanning} disabled={isFormValid}>
                    <Text style={styles.startPlanningButtonText}>Start Planning!</Text>
                </TouchableOpacity>

            </View>

            {/* Modal with CalendarPicker */}
            <Modal
                visible={isModalVisible}
                transparent={true}
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

            {/* Modal with Autocomplete search */}
            <Modal
                visible={isAutocompleteModalVisible}
                transparent={true}
                onRequestClose={() => setAutocompleteModalVisible(false)}
            >
                <View style={styles.modalAutocompleteOverlay}>
                    <View style={styles.modalAutocompleteContent}>
                        <AutocompleteTextBox
                            onPlaceSelect={handleAutocompletePlaceSelect}
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

    destinationInput: {
        flexDirection: "row",
        backgroundColor: "white",
        height: 40,
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
        height: 40,
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
