// AddEditDestinations.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TextInput, Text, TouchableOpacity, Dimensions, Modal, TouchableWithoutFeedback, KeyboardAvoidingView, Image, Platform, BackHandler, Alert } from "react-native";
import { useRouter } from "expo-router";
import AutocompleteTextBox from '../components/AutoCompleteTextBox';
import { storeData, getData } from '../scripts/localStore.js';
import { updateTrip } from '../scripts/databaseInteraction.js';
import DynamicImage from '../components/DynamicImage';
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SwipeListView } from 'react-native-swipe-list-view';
import CalendarPicker from 'react-native-calendar-picker';
import moment from "moment";
import { TimerPicker } from "react-native-timer-picker";
import Checkbox from 'expo-checkbox';
import SavedDestinations from '../components/SavedDestinations';

const { height } = Dimensions.get('window');

const AddEditDestinations = () => {
    const router = useRouter();
    const navigation = useNavigation();
    // Modal (Pop-up)
    const [visible, setVisible] = useState(false);
    const show = () => setVisible(true);
    const hide = () => {
        setTempAlias("")
        setTempDuration("")
        setTempLocation("")
        setTempPriority("")
        setTimeDuration(null);
        setVisible(false);
        setIsEditing(false);
        setEditIndex(-1);
        setIsOriginEdit(false);
    }

    // Setting add values
    const [alias, setAlias] = useState("");
    const [location, setLocation] = useState("");
    const [duration, setDuration] = useState("");
    const [priority, setPriority] = useState("");
    const [typedNotes, setNotes] = useState("");

    // temporary storage
    const [tempAlias, setTempAlias] = useState("");
    const [tempLocation, setTempLocation] = useState("");
    const [tempDuration, setTempDuration] = useState("");
    const [tempPriority, setTempPriority] = useState("");
    const [tempTimeDuration, setTempTimeDuration] = useState<{ hours: number; minutes: number } | null>(null);

    // Track if user is currently editing a destionation (and if so, what index)
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState<number>(-1); // To store the index of the item being edited, -1 is default as it shouldn't ever be called if isEditing is false
    const [isOriginEdit, setIsOriginEdit] = useState(false);
    // Sets trip data
    const [trip, setTrip] = useState<any>(null);
    const [tripId, setTripId] = useState<string | null>(null);
    const [tripName, setTripName] = useState<string | null>(null);
    const [destinations, setDestinations] = useState<any[]>([]); // Store destinations for rendering
    const [hasOrigin, setHasOrigin] = useState(false); // used for checking if an origin exists
    const [originText, setOriginText] = useState("");

    const [showPicker, setShowPicker] = useState(false);
    // For GI to see whether to optimize or not
    const [optimizeCheck, setOptimizeCheck] = useState(false);

    // For loading bookmarked locations
    const [importingLocation, setImportingLocation] = useState(false);
    const [savedDestinations, setSavedDestinations] = useState([]);

    const [isAutocompleteModalVisible, setAutocompleteModalVisible] = useState(false);
    const [selectedAutocompletePlace, setSelectedAutocompletePlace] = useState<string>('');
    const [locationAddress, setLocationAddress] = useState<string>('');

    // Set the check to whatever the stored value is
    useEffect(() => {
        if (trip && typeof trip.optimize !== 'undefined') {
            setOptimizeCheck(trip.optimize);
        }
    }, [trip]);


    //load existing trip data and set it as 'trip'
    useEffect(() => {
        const loadTrip = async () => {
            try {
                const currentTripID = await getData("currentTrip"); // Fetch the current trip ID from storage
                if (currentTripID) {
                    const tripDetails = await getData(currentTripID.toString());
                    console.log("Loaded trip data:", tripDetails); // Log the full trip details
                    console.log("Destinations: ", tripDetails.destinations);
                    // Check if the trip details include 'id' correctly
                    if (tripDetails) {
                        setTripId(currentTripID);  // Store only the trip id
                        setTrip(tripDetails);  // Store the full trip data
                        setTripName(tripDetails.tripName);
                        setDestinations(tripDetails.destinations); // Immediately update the destinations so they load on screen
                        // Set start and end date of trip text
                        const start = tripDetails?.startDate ? new Date(tripDetails.startDate) : null;
                        const end = tripDetails?.endDate ? new Date(tripDetails.endDate) : null;
                        if (start && end) {
                            setSelectedStartDate(start);
                            setSelectedEndDate(end);
                            const startFormatted = moment(start).format("ddd, MMM D");
                            const endFormatted = moment(end).format("ddd, MMM D");
                            setDatesText(`${startFormatted} - ${endFormatted}`);
                        } else {
                            setDatesText("Select new dates for trip");
                        }
                        // Set origin text
                        if (destinations.length > 0 && destinations[0].dayOrigin) {
                            setHasOrigin(true);
                            setOriginText(tripDetails.destinations[0].address)
                        }
                        console.log("Trip ID Set:", currentTripID);
                    } else {
                        console.error("Trip data is invalid, missing trip details");
                    }
                }
            } catch (error) {
                console.error("Error loading trip data:", error);
            }
        };

        loadTrip(); // Load trip data when the component mounts
    }, []); // Empty dependency array ensures this runs only once    

    useEffect(() => {
        try {
            if (trip?.destinations?.length > 0 && trip.destinations[0].dayOrigin) {
                setHasOrigin(true);
                setOriginText(trip.destinations[0].address);
            } else {
                setHasOrigin(false);
                setOriginText("");
            }
        } catch (error) {
            console.log("Trip has no destinations! Need to delete or handle otherwise.");
        }
    }, [trip]); // Runs every time `trip` updates


    const addLocation = () => {
        // Ensure that trip data and tripId are available
        if (!trip || !tripId) {
            console.error("Trip or trip.id is not available.");
            return;
        }

        // If missing a required field
        let errorMessage = "";
        if (!tempAlias) {
            errorMessage += "Location Alias (shorthand) is required.\n"
        }
        if (!tempLocation) {
            errorMessage += "Address is required.\n";
        }
        if (!timeDuration) {
            errorMessage += "Duration is required.\n";
        }
        // Special check: Alias can't be "Origin" unless editing an existing "Origin"
        if (!isEditing && tempAlias.trim().toLowerCase() === "origin") {
            errorMessage += "You cannot use 'Origin' as an alias for a destination.\n";
        }
        if (errorMessage) {
            alert(errorMessage.trim());
            return;
        }

        // Check for duplicate alias or location (address)
        // Normalize inputs
        const normalizedAlias = tempAlias.toLowerCase().trim();
        const normalizedLocation = tempLocation.toLowerCase().trim();

        let aliasConflict = false;
        let locationConflict = false;

        trip.destinations.forEach((dest: any, index: number) => {
            if (isEditing && index === editIndex) return; // Skip the item being edited

            const existingAlias = dest.alias.toLowerCase().trim();
            const existingLocation = dest.address.toLowerCase().trim();

            if (existingAlias === normalizedAlias) aliasConflict = true;
            if (existingLocation === normalizedLocation) locationConflict = true;
        });

        if (aliasConflict || locationConflict) {
            let conflictMessage = "Duplicate detected:\n";
            if (aliasConflict) conflictMessage += "- This alias already exists.\n";
            if (locationConflict) conflictMessage += "- This location already exists.";
            alert(conflictMessage.trim());
            return;
        }



        // Set default priority to 1 (as an integer) if it's empty or invalid
        const priorityValue = tempPriority.trim() === "" || isNaN(Number(tempPriority)) ? 1 : parseInt(tempPriority);

        let timeInMinutes;
        if (timeDuration) {
            timeInMinutes = timeDuration.hours * 60 + timeDuration.minutes;
        }

        const newDestination = {
            alias: tempAlias,
            address: tempLocation,
            priority: priorityValue,
            mode: "driving", //TODO: implement this in app
            transportToNext: "", //TODO: implement this in app
            transportDuration: "", //TODO: implement this in app
            startDateTime: new Date().toISOString(), //TODO: implement this in app
            duration: timeInMinutes,
            notes: typedNotes,
            dayOrigin: false, //TODO: figure out how to check if this is the day's origin (will require existing data to compare to)
            cost: 40, // TODO: implement this in app
            picture: JSON.stringify({ url: alias })
        };

        if (isEditing) {
            const oldDestination = trip.destinations[editIndex];
            newDestination.mode = oldDestination.mode;
            newDestination.transportToNext = oldDestination.transportToNext ?? ""; //defaults to empty if there was no value
            newDestination.transportDuration = oldDestination.transportDuration;
            newDestination.startDateTime = oldDestination.startDateTime;
            newDestination.dayOrigin = oldDestination.dayOrigin;
            newDestination.cost = oldDestination.cost;
            // Replaces existing destination with the newly edited one
            trip.destinations[editIndex] = newDestination;
            setDestinations([...trip.destinations]);
            updateTrip(tripId, trip); // Ensure tripId is used here
            setIsEditing(false), setEditIndex(-1);
        } else {
            // Add the new destination to the trip's destinations
            trip.destinations.push(newDestination);
            setDestinations([...trip.destinations]);
            console.log("storing the trip as: ", trip);
            updateTrip(tripId, trip); // Ensure tripId is used here
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
        const oldDestination = trip.destinations[index];
        //check if origin is being edited
        setIsOriginEdit(oldDestination.alias.trim().toLowerCase() === "origin");
        //set the values
        setAlias(oldDestination.alias);
        setLocation(oldDestination.address);
        setDuration(oldDestination.duration);
        setPriority(oldDestination.priority.toString());
        setNotes(oldDestination.notes || ""); //defaults notes to empty if it is
        //set the textboxes
        setTempAlias(oldDestination.alias);
        setTempLocation(oldDestination.address);
        setTempDuration(oldDestination.duration);
        setTempPriority(oldDestination.priority.toString());
        //set timepicker
        const minutes = oldDestination.duration || 0;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        setTimeDuration({ hours, minutes: mins });
        //shows the edit screen
        show()
    }

    //deletes location from both local storage and the destinations UI element
    const deleteLocation = (index: number) => {
        // Check if tripId is valid before proceeding
        if (!tripId) {
            console.error("tripId is null, cannot delete location.");
            return;
        }

        if (trip.destinations[index].dayOrigin) {
            setHasOrigin(false);
            setOriginText("");
        }
        trip.destinations = trip.destinations.filter((_: any, i: number) => i !== index);
        setDestinations([...trip.destinations]);
        updateTrip(tripId, trip);
    };


    const handleOriginSelect = (address: { description: string; place_id: string }) => {
        if (!trip || !tripId) {
            console.error("Trip data is not loaded yet.");
            return;
        }

        const newOriginDestination = {
            alias: "Origin",
            address: address.description,
            priority: 0,
            mode: "driving",
            transportToNext: "",
            transportDuration: "",
            startDateTime: new Date().toISOString(),
            duration: "0",
            notes: "",
            dayOrigin: true,
            cost: 0,
            picture: ""
        };

        const updatedDestinations =
            trip.destinations.length > 0 && trip.destinations[0].dayOrigin
                ? trip.destinations.map((dest: any, index: number) => (index === 0 ? newOriginDestination : dest))
                : [newOriginDestination, ...trip.destinations];

        // Update state with the new trip object using the function version of setTrip
        setTrip((prevTrip: any) => {
            const newTrip = { ...prevTrip, destinations: updatedDestinations };

            // Update trip in the database using the new state
            updateTrip(tripId, newTrip);

            // Persist updated trip data to local storage
            storeData(tripId.toString(), newTrip);

            console.log("Updated Trip State:", newTrip);
            return newTrip; // Ensures React updates state correctly
        });

        // Update local component states
        setDestinations(updatedDestinations);
        setHasOrigin(true);
        setOriginText(address.description);
    };

    // Calendar Modal
    const [isModalVisible, setModalVisible] = useState(false); // To control modal visibility
    const [isAddTripVisible, setAddTripVisible] = useState(false);
    const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null); // Explicitly define state type
    const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null); // Explicitly define state type
    const [datesText, setDatesText] = useState("");
    const infoInputRef = useRef<TextInput>(null);  //set to textinput to allow null value
    const [timeDuration, setTimeDuration] = useState<{ hours: number; minutes: number } | null>(null);

    const handleDurationChange = (value: { hours: any; minutes: any; }) => {
        setTempTimeDuration({ hours: value.hours, minutes: value.minutes });
    };


    // Handle changed date
    const handleDateChange = (date: Date, type: 'START_DATE' | 'END_DATE') => {
        if (type === "END_DATE") {
            setSelectedEndDate(date);
        } else {
            setSelectedStartDate(date);
            setSelectedEndDate(null); // Reset the end date when start date is changed
        }
    };

    // Handle finishing changing the trip date
    const handleDone = () => {
        if (selectedStartDate && selectedEndDate) {
            // Update Trip locally
            const updatedTrip = {
                ...trip,
                startDate: selectedStartDate.toISOString(),
                endDate: selectedEndDate.toISOString()
            };
            setTrip(updatedTrip);

            // Update Trip Textbox
            const startFormatted = moment(selectedStartDate).format("ddd, MMM D");
            const endFormatted = moment(selectedEndDate).format("ddd, MMM D");
            setDatesText(`${startFormatted} - ${endFormatted}`);

            // Save changes to DB
            (async () => {
                try {
                    await updateTrip(tripId, updatedTrip);
                    console.log("Trip dates updated successfully");
                } catch (error) {
                    console.error("Failed to update trip dates:", error);
                }
            })();
        }
        setModalVisible(false);
    };

    // Handles Selection from Autocomplete
    const handleAutocompletePlaceSelect = (place: { description: string }) => {
        setSelectedAutocompletePlace(place.description);
        setLocationAddress(place.description); // Updates location address
        setAutocompleteModalVisible(false);
    };


    const updateBudget = (text: string) => {
        const updatedTrip = { ...trip, budget: text };
        setTrip(updatedTrip);
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
                    <View style={{ flex: 1, flexDirection: "column", paddingVertical: 10, marginVertical: 10, marginHorizontal: 5 }}>
                        <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                            <Ionicons name="location" size={20} color={"#24a6ad"} />
                            <Text style={{ flex: 1, fontSize: 20, fontWeight: "700", marginLeft: 5, marginRight: 15 }}>{item.alias}</Text>
                        </View>

                        <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginLeft: 5 }}>
                            <MaterialCommunityIcons name={"label"} color={"#24a6ad"} />
                            <Text numberOfLines={1} ellipsizeMode="tail" style={{ marginLeft: 5, color: "gray" }}>{item.address}</Text>
                        </View>

                        <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginRight: 5 }}>
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

    const timePicker = () => {
        return (
            <View style={{ backgroundColor: "#F1F1F1", alignItems: "center", justifyContent: "center" }}>
                <TimerPicker
                    padWithNItems={2}
                    hourLabel="hr"
                    minuteLabel="min"
                    hideSeconds
                    onDurationChange={handleDurationChange}
                    initialValue={tempTimeDuration || { hours: 0, minutes: 0 }}
                    styles={{
                        pickerItem: {
                            fontSize: 32,
                        },
                        pickerLabel: {
                            fontSize: 26,
                            right: -20,
                        },
                        pickerLabelContainer: {
                            width: 60,
                        },
                        pickerItemContainer: {
                            width: 150,
                        },
                    }}
                />
            </View>
        )
    }

    const selectDuration = () => {
        if (tempTimeDuration) {
            setTimeDuration(tempTimeDuration);
            const totalMinutes = tempTimeDuration.hours * 60 + tempTimeDuration.minutes;
            setTempDuration(totalMinutes.toString());
        }
        setShowPicker(false);
    }

    const openTimePicker = () => {
        setTempTimeDuration(timeDuration || { hours: 0, minutes: 0 });
        setShowPicker(true);
    };


    const rightOpenValue = -150;

    // Tell GI to not optimize by storing this check in local storage
    useEffect(() => {
        if (trip && tripId) {
            const updatedTrip = {
                ...trip,
                optimize: optimizeCheck
            };

            setTrip(updatedTrip);

            storeData(tripId.toString(), updatedTrip);
        }

    }, [optimizeCheck]);


    // Get the saved destinations
    useEffect(() => {
        const fetchData = async () => {
            console.log("RAHAHHA");
            let accountInfo = await getData("savedDestinations");
            console.log("SAVED DESTS: ", accountInfo)
            let savedDestinations = accountInfo[0].destinations;
            if (savedDestinations.length) {
                setSavedDestinations(savedDestinations);  // Set the destinations in the state
            }
        };

        fetchData();
    }, []);


    function handleImport() {
        console.log("handleImport clicked");
        if (savedDestinations.length) {
            // Setting this true shows the modal
            setImportingLocation(true)
        } else {
            // Show an alert if there are no saved destinations
            Alert.alert(
                'No Saved Destinations',
                'You have no saved destinations to import.',
                [{ text: 'OK' }]
            );
        }
    }

    // Load the data into the Add Location modal
    const handleBookmarkImport = (destination: any) => {
        // Hide the modal
        setImportingLocation(false);

        console.log("Bookmarked Location to Import:", destination);

        // Populate the fields with data from the destination
        setTempAlias(destination.destination || "Unknown");  // It's called 'destination' and not 'name'
        setTempDuration((parseInt(destination.time) * 60).toString() || "60"); // 'time' and not 'duration'

        // Show the Add Destination modal
        setVisible(true);
    };

    const handleCancel = () => {
        setImportingLocation(false);
    };

    return (
        <View style={styles.container}>
            {/* Background image */}
            <DynamicImage placeName="New York City" containerStyle={styles.backgroundImage} imageStyle={styles.backgroundImage} />
            <View style={styles.darkOverlay}></View>

            <View style={{ flex: 1, flexDirection: "column", marginHorizontal: 20, position: "absolute", marginTop: 10 }}>
                <TouchableOpacity onPress={() => { navigation.goBack() }}>
                    <Ionicons name="arrow-back-outline" size={30} color={"white"} />
                </TouchableOpacity>

                {/* Group of text fields */}
                <View style={{ marginTop: 15 }}>

                    <TouchableOpacity style={[styles.input, { flex: 1, flexDirection: "row", alignItems: 'center' }]} onPress={() => setAutocompleteModalVisible(true)}>
                        <Ionicons name="location" size={22} color={"#24a6ad"} />
                        <Text numberOfLines={1} style={{ fontSize: 18, marginLeft: 5, width: "100%", color: 'black' }}>{selectedAutocompletePlace}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.input, { flex: 1, flexDirection: "row", alignItems: 'center' }]} onPress={() => setModalVisible(true)}>
                        <Ionicons name="calendar-sharp" size={22} color={"#24a6ad"} />
                        <Text style={{ fontSize: 18, marginLeft: 5, width: "100%", color: 'black' }}>{datesText}</Text>
                    </TouchableOpacity>

                    <View style={styles.travelersAndBudgetTextField}>
                        <TouchableOpacity style={[styles.budgetInput, { flex: 1, flexDirection: "row", alignItems: 'center' }]}>
                            <Ionicons name="wallet" size={22} color={"#24a6ad"} />
                            <TextInput value={trip?.budget ? trip.budget.toString() : "Enter budget"} placeholderTextColor="black" keyboardType="numeric" onChangeText={updateBudget} style={{ fontSize: 18, padding: 5 }} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 10, padding: 10, }}>
                        <Checkbox value={optimizeCheck} onValueChange={setOptimizeCheck} />
                        <Text style={{ fontSize: 18, marginLeft: 5, color: 'black' }}>Optimize Trip</Text>
                    </View>
                </View>
            </View>

            {/* Scrollable window that displays all the destinations added */}
            <View style={styles.destinationScreen}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 10, marginHorizontal: 20 }}>
                    <Text style={{ fontSize: 22, fontWeight: "700" }}>Destinations Selected <Text style={{ color: "#24a6ad" }}>({destinations.length})</Text>:</Text>
                    <TouchableOpacity style={{ padding: 5 }} onPress={() => setAddTripVisible(true)}>
                        <Ionicons name="add-circle" size={28} color="#24a6ad" />
                    </TouchableOpacity>
                </View>

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
                <TouchableOpacity style={{ backgroundColor: "#24a6ad", width: "80%", alignItems: "center", paddingVertical: 15, paddingHorizontal: 5, marginBottom: 10, borderRadius: 10 }} onPress={() => {
                    if (destinations.length > 1 && destinations.length <= 25 && hasOrigin) {
                        updateTrip(tripId, trip)
                        router.push("/GenerateItineraryScreen")
                    } else if (destinations.length > 25) {
                        alert("You can only have a max of 25 destinations (including origin).")
                    }
                    else {
                        alert(hasOrigin ? "You must add at least 1 destination (excluding origin)." : "You must have an origin")
                    }
                }}>
                    <Text style={{ fontSize: 18, color: "white", fontWeight: "700" }}>Generate Itinerary</Text>
                </TouchableOpacity>
            </View>

            {/* For importing saved locations */}
            {importingLocation && (
                <View style={styles.overlay}>
                    <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>

                    <SavedDestinations
                        SavedDestinations={savedDestinations}
                        handlePress={handleBookmarkImport}
                        deleteLocation={function (index: number): void { }}
                    />
                </View>
            )}

            {/* Modal with Autocomplete search */}
            <Modal visible={isAutocompleteModalVisible} transparent={true} onRequestClose={() => setAutocompleteModalVisible(false)}>
                <View style={styles.modalAutocompleteOverlay}>
                    <View style={styles.modalAutocompleteContent}>
                        <AutocompleteTextBox
                            onPlaceSelect={(place,) => {
                                handleAutocompletePlaceSelect(place);
                                handleOriginSelect(place);
                                return place.description; // Explicitly return a string
                            }}
                            placeholder="Destination"
                            placeholderTextColor="lightgray"
                            value={originText}
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

            <Modal
                visible={isAddTripVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setAddTripVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity style={{ height: "80%", width: "100%" }} onPress={() => setAddTripVisible(false)}></TouchableOpacity>
                    <View style={{ flexDirection: "column", width: "100%", height: "20%", backgroundColor: "white", borderTopRightRadius: 10, borderTopLeftRadius: 10, padding: 5 }}>

                        <TouchableOpacity style={styles.menuItem} onPress={() => { setAddTripVisible(false); show() }}>
                            <Ionicons name={"pencil"} color={"#24a6ad"} size={20} />
                            <Text style={{ fontSize: 18 }}>Add Destination</Text>
                        </TouchableOpacity>

                        <View style={styles.divider}></View>

                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => {
                                setAddTripVisible(false);
                                handleImport();
                            }}>
                            <Ionicons name="bookmark" size={20} color={"#24a6ad"} />
                            <Text style={{ fontSize: 18 }}>Import from Saved</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Add destination pop-up */}
            <Modal animationType="fade" visible={visible} transparent={true} onRequestClose={hide} statusBarTranslucent={true}>

                <View style={styles.modalOverlay}>
                    <View style={{
                        width: '100%',
                        backgroundColor: '#F4F4F4',
                        padding: 20,
                        borderRadius: 10,
                        height: 460,
                    }}
                    >
                        <Text style={{ color: "black", fontWeight: "700", fontSize: 22 }}>Add Destination</Text>
                        <View style={[styles.destination, { marginTop: 10, flexDirection: "row", alignItems: "center" }]}>
                            {(tempAlias == "") ? (
                                <DynamicImage placeName={tempAlias} containerStyle={styles.destinationImage} imageStyle={styles.destinationImage} />
                            ) : (
                                    <Image source={require("../assets/images/blue.png")} style={[styles.destinationImage, { marginLeft: 0 }]} />
                                )}
                            <View style={{ flexDirection: "column", justifyContent: "flex-start", gap: 5, marginLeft: 10, paddingRight: 140 }}>
                                <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                    <Ionicons name="location" size={20} color={"#24a6ad"} />
                                    {(tempAlias == "") ? (
                                        <Text style={{ fontSize: 20, fontWeight: "700", marginLeft: 5 }}>Destination</Text>
                                    ) : (
                                            <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 20, fontWeight: "700", marginLeft: 5 }}>{tempAlias}</Text>
                                        )}
                                </View>


                                <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginLeft: 5 }}>
                                    <MaterialCommunityIcons name={"label"} color={"#24a6ad"} />
                                    {(tempLocation == "") ? (
                                        <Text style={{ marginLeft: 5, color: "gray", marginTop: -5 }}>Address</Text>
                                    ) : (
                                            <Text numberOfLines={1} ellipsizeMode="tail" style={{ marginLeft: 5, color: "gray", marginTop: -5 }}>{tempLocation}</Text>
                                        )}
                                </View>

                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginRight: 5, gap: 15 }}>
                                    <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                        <Ionicons name="time" size={18} color={"#24a6ad"} />
                                        {(tempDuration == "") ? (
                                            <Text style={{ marginLeft: 5 }}>Duration</Text>
                                        ) : (
                                                <Text style={{ marginLeft: 5 }}>{tempDuration} mins</Text>
                                            )}
                                    </View>

                                    <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginRight: 5 }}>
                                        <MaterialCommunityIcons name="priority-high" size={18} color={"#24a6ad"} />
                                        {(tempPriority == "") ? (
                                            <Text style={{ marginLeft: 5 }}>Priority</Text>
                                        ) : (
                                                <Text style={{ marginLeft: 5 }}>Priority: {tempPriority}</Text>
                                            )}
                                    </View>
                                </View>
                            </View>
                        </View>

                        <TouchableWithoutFeedback onPress={() => infoInputRef.current?.focus()}>
                            <View style={{ flexDirection: "column", marginTop: 15 }}>
                                <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
                                    <Ionicons name={"location"} color={"#24a6ad"} />
                                    <Text>Destination:</Text>
                                </View>
                                <TextInput style={[styles.addDestinationTextInputs, { paddingHorizontal: 5, justifyContent: "center", textAlignVertical: "center" }]} value={tempAlias} onChangeText={setTempAlias} editable={!isOriginEdit} ref={infoInputRef}></TextInput>
                            </View>
                        </TouchableWithoutFeedback>

                        <View style={{ flexDirection: "column", marginTop: 10 }}>
                            <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
                                <MaterialCommunityIcons name={"label"} color={"#24a6ad"} />
                                <Text>Address:</Text>
                            </View>
                            <AutocompleteTextBox value={tempLocation} onPlaceSelect={(place) => {
                                setTempLocation(place.description);
                                return place.description;
                            }} />
                        </View>

                        {/* INSERT TIME PICKER HERE */}
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <TouchableWithoutFeedback onPress={() => infoInputRef.current?.focus()}>
                                <View style={{ flexDirection: "column", marginTop: 15, width: "45%" }}>
                                    <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
                                        <Ionicons name={"time"} color={"#24a6ad"} />
                                        <Text>Duration:</Text>
                                    </View>
                                    <TouchableOpacity style={[styles.addDestinationTextInputs, { paddingHorizontal: 5, justifyContent: 'center', alignItems: 'flex-start' }]} onPress={openTimePicker}>
                                        <Text style={{ fontSize: 18 }}>{timeDuration ? `${timeDuration.hours}hr ${timeDuration.minutes}min` : ''}</Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableWithoutFeedback>

                            <TouchableWithoutFeedback onPress={() => infoInputRef.current?.focus()}>
                                <View style={{ flexDirection: "column", marginTop: 15, width: "45%" }}>
                                    <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
                                        <MaterialCommunityIcons name={"priority-high"} color={"#24a6ad"} />
                                        <Text>Priority:</Text>
                                    </View>
                                    <TextInput style={[styles.addDestinationTextInputs, { paddingHorizontal: 5 }]} value={tempPriority} keyboardType="numeric" onChangeText={setTempPriority} editable={!isOriginEdit} ref={infoInputRef} returnKeyType="done"></TextInput>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>

                        <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 30, marginTop: 30 }}>
                            <TouchableOpacity onPress={hide} style={[styles.modalButton, { backgroundColor: "red" }]}>
                                <Text style={{ color: "white", fontWeight: "700", fontSize: 12 }}>CANCEL</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={addLocation} style={[styles.modalButton, { backgroundColor: "#24a6ad" }]}>
                                <Text style={{ color: "white", fontWeight: "700", fontSize: 12 }}>{isEditing ? "EDIT" : "ADD"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={showPicker}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowPicker(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={{ width: '95%', backgroundColor: '#F4F4F4', padding: 20, borderRadius: 10, height: 350 }}>
                        {timePicker()}
                        <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 20, gap: 30 }}>
                            <TouchableOpacity onPress={() => { setShowPicker(false); }} style={{
                                backgroundColor: "red",
                                height: 35,
                                width: 70,
                                alignItems: "center",
                                justifyContent: "center",
                                shadowColor: "#333333",
                                shadowOffset: { width: 1, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 3,
                                borderRadius: 10
                            }}>
                                <Text style={{ fontSize: 12, color: "white", fontWeight: "700" }}>CANCEL</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => { selectDuration(); }} style={{
                                backgroundColor: "green",
                                height: 35,
                                width: 70,
                                alignItems: "center",
                                justifyContent: "center",
                                shadowColor: "#333333",
                                shadowOffset: { width: 1, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 3,
                                borderRadius: 10
                            }}>
                                <Text style={{ fontSize: 12, color: "white", fontWeight: "700" }}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
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
        </View >

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
        justifyContent: "center",
        alignItems: "center",
        height: "10%",
        width: "100%",
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

    addDestinationTextInputs: {
        height: 40,
        backgroundColor: "white",
        borderRadius: 10,
        fontSize: 18
    },

    modalButton: {
        height: 35,
        width: 70,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        shadowColor: "#333333",
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },

    menuItem: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 10,
        marginLeft: 5,
        padding: 10
    },

    divider: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 10,
        width: "100%"
    },
    // ==== IMPORTING ==== //
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
        paddingTop: 100,
    },

    cancelButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        zIndex: 2000,
    },

    cancelButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18
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

export default AddEditDestinations;