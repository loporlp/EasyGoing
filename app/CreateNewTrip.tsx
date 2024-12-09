// CreateNewTrip.tsx
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, TextInput, Modal, Button } from 'react-native';
import { useRouter } from "expo-router";
import AutocompleteTextBox from '../components/AutoCompleteTextBox';
import CalendarPicker from 'react-native-calendar-picker';
import moment from "moment";

export const head = () => ({
    title: "Create New Trip"
});

const CreateNewTrip = () => {

    // Sets up navigations
    const router = useRouter();

    // calendar
    const [isModalVisible, setModalVisible] = useState(false); // To control modal visibility
    const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null); // Explicitly define state type
    const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null); // Explicitly define state type
    const [datesText, setDatesText] = useState("");
    const [selectedPlace, setSelectedPlace] = useState<string>(''); // for place name

    const startPlanning = () => {
        console.log('Selected place before navigation:', selectedPlace);
        router.push({
            pathname: "/AddEditDestinations",
            // Pass information to the next screen
            query: { placeName: selectedPlace },
        });
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

    const handlePlaceSelect = (place) => {
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

            {/* Other UI elements on the screen */}
            <View style={styles.createTripContainer}>

                <Text style={styles.createTripLabel}>Where are we{" "}
                    <Text style={styles.highlightText}>going</Text>, Traveler?</Text>

                <AutocompleteTextBox
                    onPlaceSelect={handlePlaceSelect}
                    placeholder="Destination"
                    placeholderTextColor="lightgray"
                    style={styles.destinationInput}
                />

                <TouchableOpacity style={styles.dateInput} onPress={() => setModalVisible(true)}>
                    <TextInput
                        placeholder="Dates"
                        placeholderTextColor="lightgray"
                        style={{ color: 'black', fontSize: 16 }}
                        value={datesText}
                        editable={false} // Make the TextInput non-editable, so the user can't manually edit
                    />
                </TouchableOpacity>

                <View style={styles.travelersAndBudgetTextField}>
                    <TextInput placeholder="Travelers" placeholderTextColor="lightgray" keyboardType="numeric" style={styles.travelerInput} />
                    <TextInput placeholder="Budget" placeholderTextColor="lightgray" keyboardType="numeric" style={styles.budgetInput} />
                </View>

                <TouchableOpacity style={styles.createPlanButton} onPress={startPlanning}>
                    <Text style={styles.startPlanningButtonText}>Start Planning!</Text>
                </TouchableOpacity>

            </View>

            {/* Modal with CalendarPicker */}
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="slide"
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

    destinationInput: {
        height: 40,
        width: "80%",
        borderColor: '#999',
        marginBottom: 20,
        fontSize: 16,
        borderRadius: 10,
        paddingVertical: 5,
        alignSelf: 'center',
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
    }
});

export default CreateNewTrip;