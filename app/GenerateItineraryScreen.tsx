// GenerateItineraryScreen.tsx
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Image, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import MapMarker from '../components/MapMarker';
import RouteMap from '../components/RouteMap';
import MultiRoutesMap from '../components/MultiRoutesMap';
import { fetchPolylinesAndDurations } from '../scripts/routeHelpers';
import { calculateOptimalRoute } from '../scripts/optimalRoute.js';
import { Dimensions } from "react-native";
import { useState, useEffect, useRef } from "react";
import { storeData, getData } from '../scripts/localStore.js';
import { divideLocationsIntoGroups } from '../scripts/dateDividers.js';
import { updateDestinationsWithTransport, updateDayOrigin } from '../scripts/updateTransportDests.js';
import groupDestinationsByDay from '../scripts/groupDestinationsByDay';
import processGroupedDestinations from '../scripts/processGroupedDestinations';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';

const { height } = Dimensions.get('window');

const GenerateItineraryScreen = () => {
    const router = useRouter();

    // Tracks if map is loading
    const [isLoading, setIsLoading] = useState(true);  

    // Routes
    const [polylinesData, setPolylinesData] = useState<any[]>([]);
    const [transportDurations, setTransportDurations] = useState<any[]>([]);
    const [markers, setMarkers] = useState<any[]>([]);
    const [bounds, setBounds] = useState<any>({});
    const [allRoutesData, setAllRoutesData] = useState<any[]>([]);
    const [toSaveData, setToSaveData] = useState<any[]>([]);

    const [isDateSelected, setIsDateSelected] = useState(false);

    type Place = {
        alias: string;
        address: string;
        priority: number;
        mode: string;
        transportToNext: string;
        transportDuration: number;
        startDateTime: Date;
        duration: number;
        notes: string;
        dayOrigin: boolean;
        cost: number;
        picture: string;
    };


    const [origin, setOrigin] = useState<{ name: string; address: string; duration: number; priority: number}>();
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();

    // Initial empties
    const [destinations, setDestinations] = useState<Record<string, Place>>({});
    const [groupedDestinations, setGroupedDestinations] = useState<Place[][]>([]);
    const [grouped2DDestinations, setGrouped2DDestinations] = useState<Place[][]>([]);
    const [optimalRoute, setOptimalRoute] = useState<any[][]>([]);
    const [transportationModes, setTransportationModes] = useState<string[]>([]);

    const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);

    // Extract transportation mode
    useEffect(() => {
        if (Object.keys(destinations).length > 1) {
            // Get transportation modes for all but the last destination
            const modes = Object.values(destinations)
                .map(destination => destination.mode || 'DRIVING'); // Default to 'DRIVING' if mode is missing

            setTransportationModes(modes);
            console.log("Transport Modes", transportationModes);
        }
    }, [destinations]);

    // Fetch destinations on mount
    useEffect(() => {
        console.log("On GenerateItineraryScreen");
        const fetchDestinations = async () => {
            const loadedDestinations = await loadDestinations();
            console.log("Loaded Destinations:", loadedDestinations);
            setDestinations(loadedDestinations); // Update state with loaded destinations
        };

        fetchDestinations();
    }, []);

    // Function to fetch destinations
    const loadDestinations = async () => {
        const formattedDestinations: Record<string, Place> = {};
        const groupedDestinationsTemp: Place[][] = [];
        let currentGroup: Place[] = [];
        let originSet = false;

        try {
            const tripID = await getData("currentTrip");
            if(!tripID) {
                throw new Error("No trip ID");
            }
            const trip = await getData(tripID.toString());
    
            if (trip) {
                console.log("Trip Data:", trip);

                setStartDate(trip.tripStartDate);
                setEndDate(trip.tripEndDate);
    
                // Iterate over destinations and format them
                trip.destinations.forEach((destination: { picture: string; alias: any; address: any; priority: any; mode: any; transportToNext: any; transportDuration: any; startDateTime: any; duration: string; notes: any; dayOrigin: any; cost: any; }, index: { toString: () => string | number; }) => {
                    const formattedDestination = {
                        alias: destination.alias,
                        address: destination.address,
                        priority: destination.priority,
                        mode: destination.mode || 'DRIVING', // default mode is DRIVING
                        transportToNext: destination.transportToNext ? JSON.stringify(destination.transportToNext) : "", // serialized route
                        transportDuration: destination.transportDuration,
                        startDateTime: destination.startDateTime,
                        duration: parseFloat(destination.duration),
                        notes: destination.notes,
                        dayOrigin: destination.dayOrigin || false,
                        cost: destination.cost,
                        picture: destination.picture,
                    };
    
                    formattedDestinations[index.toString()] = formattedDestination;
    
                    // If dayOrigin is true, it means a new group starts
                    if (destination.dayOrigin) {
                        // Set the FIRST origin
                        if (!originSet) {
                            setOrigin({
                                name: formattedDestination.alias,
                                address: formattedDestination.address,
                                duration: formattedDestination.duration,
                                priority: formattedDestination.priority
                            });
                            originSet = true;
                        }
    
                        // Push the current group into the temporary array if it's not empty
                        if (currentGroup.length > 0) {
                            groupedDestinationsTemp.push(currentGroup);
                        }
    
                        // Start a new group with the current destination
                        currentGroup = [formattedDestination];
                    } else {
                        // Otherwise, add this destination to the current group
                        currentGroup.push(formattedDestination);
                    }
                    console.log("Current Group: ", currentGroup);
                });
    
                // Push the last group if there are any destinations left
                if (currentGroup.length > 0) {
                    groupedDestinationsTemp.push(currentGroup);
                }
    
                setDestinations(formattedDestinations);
            } else {
                console.log("No data found for this trip ID.");
            }
        } catch (error) {
            console.error("Error fetching trip data:", error);
        }
    
        return formattedDestinations;
    };

    // Helper function to reorder destinations based on orderedLocations
    const reorderDestinations = (orderedLocations: any[]) => {
        //console.log("DestDest:", destinations);

        const orderedDestinations = orderedLocations.map(location => {
            // location is an alias
            // Find the destination object where the alias matches
            const destination = Object.values(destinations).find(dest => dest.alias === location);

            //console.log("DestLoc:", destination); 
            return destination; 
        });

        //console.log("OrDest:", orderedDestinations);
        return orderedDestinations;
    };

    const saveOrderedDestinations = async (orderedDestinations: any) => {
        try {
            // Assuming you want to store the entire ordered destinations under the trip ID
            const tripID = "currentTrip";
            await storeData(tripID, orderedDestinations);
            console.log("Ordered destinations saved.");
        } catch (error) {
            console.error("Error saving ordered destinations:", error);
        }
    };

    const prevOptimalRouteRef = useRef<any[][]>([]);

    useEffect(() => {
        if (Object.keys(destinations).length > 0 && origin) {
            /*
            TODO:
            
            Before fetching the official optimal route, calculate total time and budget.
            If there is not enough time and/or budget, this is where the Priority system comes in.
            
            In order to do this, first use the calculateTotalTime in dateDividers.js using what we already have (optimalRoute + locationDurations)

            If there is not enough time, use a new script to get a new list of locations based on priority

            This new list needs to be saved (We need to warn the user if they are fine with removal of those extras first)
            Then we run that new list through optimized list
            Save this new optimized list
            */
            const fetchOptimalRoute = async () => {
                try {
                    const destinationArray = Object.values(destinations);
                    console.log("Pre DestArray:", origin);
                    const simplifiedDestinations = destinationArray
                        .filter(destination => destination.alias !== origin.name)  // Exclude origin
                        .map(destination => ({
                            name: destination.alias,
                            address: destination.address,
                            duration: destination.duration,
                            priority: destination.priority
                        }));
                    // TODO: Remove Origin from simplifiedDestinations (multi days will divide so different format)
                    console.log("Simplified Destinations Array:", simplifiedDestinations);

                    console.log("Current Origin (GI):", origin);

                    const mode = 'DRIVING';
                    const result = await calculateOptimalRoute(simplifiedDestinations, origin, mode);

                    // Check if the result is different from the previous optimal route
                    if (JSON.stringify(result) !== JSON.stringify(prevOptimalRouteRef.current)) {
                        setOptimalRoute(result);
                        // Update ref to current optimal route
                        prevOptimalRouteRef.current = result;
                    }
                } catch (error) {
                    console.error("Failed to get optimal route:", error);
                }
            };

            fetchOptimalRoute();
        }
    }, [destinations, origin]);

    /*
    1. Generate optimal route (which triggers this useEffect)
    2. Use routePolyline to get and store the routes in order
    3. Use dateDividers to then divide it into groups
    4. Each group needs to be correlated to each day (probably index for the date header)
    5. When clicking on a date header, pass that group into MultiRouteMap
    5.1.MultiRouteMap now takes this route data and plots it rather than calling routePolyline itself
    */
    useEffect(() => {
        // (2) Route Polylines
        const getDurationAndPolylines = async () => {
            const { polylines: fetchedPolylines, transportDurations: fetchedDurations, markers: fetchedMarkers, bounds } = await fetchPolylinesAndDurations(optimalRoute, transportationModes);
            setAllRoutesData(fetchedPolylines);

            setPolylinesData(fetchedPolylines);
            setTransportDurations(fetchedDurations);
            setMarkers(fetchedMarkers);
            setBounds(bounds);

            // Get the ordered list of locations
            const originLocations = optimalRoute.map(route => route[0][0]);
            const lastDestination = optimalRoute[optimalRoute.length - 1][1][0];
            const orderedLocations = [...originLocations, lastDestination];
            console.log("Ordered Origins with Last Destination:", orderedLocations);

            // TODO: We need a new script that takes in Group Indices and Ordered Locations
            // This script will be specifically for the ScrollView

            // Create a map of ordered locations for quick lookup
            const updatedDurations = processGroupedDestinations(orderedLocations, groupedDestinations, destinations, fetchedDurations, setGroupedDestinations);

            // (3) Date Dividers
            // Uses fetchedDurations for this (as well as the loaded durations per location)
            let numberOfDays;
            console.log("Start Date:", startDate);
            console.log("End Date:", endDate);
            if (startDate && endDate) {
                numberOfDays = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
            } else {
                numberOfDays = 7; // Default 7 days
            }
            // This returns a dictionary with indices as the ID for range of locations (i.e. "0:2" means from location 0 to location 2)
            console.log("Updated Durations:", updatedDurations);
            let groupedDays = await divideLocationsIntoGroups(updatedDurations, numberOfDays);
            groupedDays = (groupedDays || {}) as { [key: number]: number };
            console.log("Grouped Days Indices Dict:", groupedDays);

            // (4) Set the groups
            const resultingGroupedDestinations = groupDestinationsByDay(groupedDays as { [key: number]: number }, orderedLocations);
            setGroupedDestinations(resultingGroupedDestinations);
            setGrouped2DDestinations(resultingGroupedDestinations);
            console.log("Resulting Grouped Destinations Result:", resultingGroupedDestinations);

            //console.log("Fetched Polylines:", fetchedPolylines);

            // START: STORES THE ROUTES TO THE GROUPED ORDERS

            // Helper function to find the object corresponding to the destination
            const getPolylineObject = (destination) => {
                //console.log("Dest Destination:", destination);

                const polyline = fetchedPolylines.find(polyline => {
                    // Get the substring before the first comma which has the alias
                    const firstPartOfId = polyline.id.split(',')[0];
                    return firstPartOfId === destination;
                });

                // Since there's no polyline, we check the updatedDurations for the last destination
                if (!polyline) {
                    // Find the last destination's data in updatedDurations
                    const lastDestination = updatedDurations[updatedDurations.length - 1];

                    if (lastDestination && lastDestination.destination === null) {
                        return {
                            id: destination,
                            duration: lastDestination.duration || "No travel duration",
                            locationDuration: lastDestination.locationDuration || 0,
                        };
                    }

                    // Default fallback if no polyline and no last destination
                    return {
                        id: destination,
                        duration: "Unknown",
                        locationDuration: 0,
                    };
                }

                return polyline || null;
            };

            // Mapping destinations to polyline objects
            const updatedGroupedDestinations = resultingGroupedDestinations.map((group, groupIndex) => {
                return group.map((destination, subIndex) => {
                    // Get the corresponding polyline object for the destination
                    const polyline = getPolylineObject(destination);

                    // console.log
                    if (subIndex === group.length - 1) {
                        // If it's the last destination in the group
                        console.log(`Group ${groupIndex + 1}: Last destination "${destination.alias}", no polyline (or null):`, polyline ? polyline.id : "null");
                    } else {
                        // If it's not the last destination
                        console.log(`Group ${groupIndex + 1}: Mapped destination "${destination.alias}" to polyline:`, polyline.id);
                    }

                    return polyline;
                });
            });

            // END: STORES THE ROUTES TO THE GROUPED ORDERS

            console.log("Grouped Objects in Order:", updatedGroupedDestinations);
            setGroupedDestinations(updatedGroupedDestinations);

            // Store the updated Routes and TransportTime in local storage
            //console.log("orderedLocations:", orderedLocations);
            const newDests = reorderDestinations(orderedLocations);
            const updatedDests = updateDestinationsWithTransport(newDests, updatedGroupedDestinations);
            console.log("Updated Dests (final):", updatedDests);
            setToSaveData(updatedDests);
        }
        getDurationAndPolylines();
    }, [optimalRoute]);

    const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
    const [transportationText, setTransportationText] = useState("driving");

    useEffect(() => {
        console.log("Updated grouped2DDestinations:", grouped2DDestinations);

        // SAVING
        const updatedDests = updateDayOrigin(toSaveData, grouped2DDestinations);
        //console.log("newDests:", newDests);
        //console.log("upDests:", updatedDests);
        saveOrderedDestinations(updatedDests);

        // Reload list
        setDestinations(updatedDests);

    }, [grouped2DDestinations, toSaveData]);    

    const handlePress = (destination: string) => {
        setSelectedDestination(prev => prev === destination ? null : destination);
    };

    const handleModeChange = (text: string) => {
        setTransportationText(text);
    };

    const getRouteText = () => {
        if (!selectedDestination) return "";
        const routeDestination = destinations[selectedDestination];
        return `${transportationText} instructions to ${routeDestination?.alias}.`;
    };

    const reviewItinerary = () => {
        router.push("/ReviewItineraryScreen");
    };


    const formatDate = (date: Date) => {
        if (isNaN(date.getTime())) {
            console.error("Invalid Date passed to formatDate:", date);
            return "Invalid Date"; // Return a fallback value for invalid dates
        }
        const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    const getNextDay = (currentDate: Date) => {
        // Check if the currentDate is a valid Date
        if (isNaN(currentDate.getTime())) {
            //console.error("Invalid Date passed to getNextDay:", currentDate);
            return new Date(); // Return null or a default date if invalid
        }

        const nextDate = new Date(currentDate);
        nextDate.setDate(nextDate.getDate() + 1);
        return nextDate;
    };

    const handlePressDate = (index: number) => {
        // Toggle selection state
        setIsDateSelected(prevState => !prevState);

        // Check if the same day index is selected again
        const isSameDateSelected = index === selectedDayIndex;

        if (isSameDateSelected) {
            // If the same date is selected again, revert to showing all routes
            console.log("Same day selected. Reverting to show all routes.");
            setPolylinesData(allRoutesData);

            // Reset transportation modes for all routes (or set defaults)
            const allModes = allRoutesData.map(route => route.mode || 'DRIVING');
            setTransportationModes(allModes);

            // Reset the selected day index to null
            setSelectedDayIndex(null);
            return;
        }

        setSelectedDayIndex(index);
        console.log("Selected day index", index);
    
        // Get the destinations for this specific day
        const selectedDestinations = groupedDestinations[index];
        console.log("Selected Dests Date:", selectedDestinations);
    
        // Guard against undefined or empty array
        if (!selectedDestinations || selectedDestinations.length === 0) {
            console.warn("No destinations available for this day!");
            return;
        }
    
        // Convert the selectedDestinations into an object with numeric keys
        const formattedDestinations = selectedDestinations.reduce<{ [key: string]: Place }>((acc, curr, index) => {
            acc[index.toString()] = curr;
            return acc;
        }, {});
    
        console.log("Formatted Destinations (Date):", formattedDestinations);
    
        // TODO: setOptimalRoute(formattedDestinations);
    
        // Array to store the polyline data
        const matchedPolylinesData: any[] = [];
    
        // Loop through each destination in grouped2DDestinations[index]
        grouped2DDestinations[index].forEach(destinationName => {
            let matched = false;
    
            // Loop through the formattedDestinations
            for (const key in formattedDestinations) {
                if (formattedDestinations.hasOwnProperty(key)) {
                    const destination = formattedDestinations[key];
    
                    // Check if the substring before ',' in the 'id' matches the destination name
                    const routeNames = destination.id.split('$').map(route => route.split(',')[0].trim());
                    if (routeNames.includes(destinationName)) {
                        matched = true;
                        console.log(`Matched destination: ${destinationName} with id: ${destination.id}`);
    
                        // Store the matched polyline data (coordinates, duration, etc.)
                        matchedPolylinesData.push({
                            coordinates: destination.coordinates,
                            duration: destination.duration,
                            strokeColor: destination.strokeColor,
                            strokeWidth: destination.strokeWidth
                        });
                        break; // Break once we find the match
                    }
                }
            }
    
            if (!matched) {
                console.log(`No match found for: ${destinationName}`);
            }
        });
    
        // After processing all destinations, update the polyline data
        if (matchedPolylinesData.length > 0) {
            console.log("Updating global polylines data:", matchedPolylinesData);
            setPolylinesData(matchedPolylinesData);  // Update the global polyline data
        } else {
            console.warn("No polyline data to update.");
        }
    
        // Update the transportation modes for this day
        const modesForThisDay = selectedDestinations.map(destination => destination.mode || 'DRIVING');
        console.log("Modes for this day:", modesForThisDay);
    
        // Update transportation modes state
        setTransportationModes(modesForThisDay);
    };
    

    return (
        <View style={styles.container}>
            <SafeAreaView style={{ flex: 1 }}>
                {optimalRoute.length > 0 && (
                    <MultiRoutesMap
                        locations={optimalRoute}
                        transportationModes={transportationModes}
                        polylines={polylinesData}
                        transportDurations={transportDurations}
                        markers={markers}
                        bounds={bounds}
                        onPolylinesReady={() => setIsLoading(false)}
                    />
                )}
            </SafeAreaView>

            <ScrollView contentContainerStyle={styles.scrollViewContainer} style={styles.scrollView}>
                {optimalRoute.map((routeGroup, routeGroupIndex) => {
                    const destinationGroupKey = `group-${routeGroupIndex}`;
                    let dateForThisGroup;
                    if (routeGroupIndex === 0) {
                        dateForThisGroup = new Date(destinations[routeGroupIndex].startDateTime);
                    } else {
                        const previousGroupDate = new Date(destinations[routeGroupIndex - 1].startDateTime);
                        dateForThisGroup = getNextDay(previousGroupDate);
                    }
                    console.log('Date for this group:', dateForThisGroup);
                    const isSelected = selectedDayIndex === routeGroupIndex;

                    return (
                        <View key={destinationGroupKey}>
                            {/* Date Header - Clickable */}
                            <TouchableOpacity
                                onPress={() => handlePressDate(routeGroupIndex)}
                                style={[styles.dateHeader, isSelected && styles.selectedDateHeader]}
                            >
                                <Text style={[styles.dateText, isSelected && styles.selectedDateText]}>
                                    {formatDate(dateForThisGroup)}
                                </Text>
                                <Ionicons
                                    name={isSelected ? "chevron-up" : "chevron-down"}
                                    size={18}
                                    color="#000"
                                />
                            </TouchableOpacity>

                            {/* Loop through each destination in the current routeGroup */}
                            {routeGroup.map((destinationArray, destinationIndex) => {
                                const destinationKey = `${destinationGroupKey}-${destinationIndex}`;
                                const destinationName = destinationArray[0]; // Name of the destination (first item in the array)
                                console.log("DestArray:", destinationArray);

                                return (
                                    <TouchableOpacity key={destinationKey} style={styles.destinationElement} onPress={() => handlePress(destinationKey)}>
                                        {/* Background with opacity */}
                                        <View style={styles.backgroundContainer}>
                                            <View style={styles.backgroundOverlay}></View>
                                        </View>

                                        <View style={styles.destinationContainer}>
                                            <Image source={{ uri: destinationArray[1] }} style={styles.destinationImage} /> {/* destinationArray[1] is the address */}
                                            <View style={styles.destinationLabel}>
                                                <Text style={styles.destinationName}>{destinationName}</Text> {/* Display destination name */}
                                                <Text style={styles.destinationDetails}>
                                                    Duration: {Math.floor(destinationArray[2] / 60)} hrs {destinationArray[2] % 60} mins | Priority: {destinationArray[3]}
                                                </Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}

                            {/* Conditional rendering of additional info */}
                            {selectedDestination === destinationGroupKey && (
                                <View style={styles.additionalInfo}>
                                    <Text style={styles.additionalText}>{getRouteText()}</Text>
                                </View>
                            )}
                        </View>
                    );
                })}
            </ScrollView>

            {/* "Review Itinerary" button */}
            <TouchableOpacity
                style={[styles.reviewItineraryButton, isLoading && styles.disabledButton]}  // Apply styles to disable button
                onPress={reviewItinerary}
                disabled={isLoading}  // Disable the button when map is loading
            >
                <Text style={styles.buttonText}>Review Itinerary</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: '#fff',
    },

    map: {
        flex: 1,
        width: "100%",
        height: 350,
        marginBottom: 0,
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

    // ==== SCROLL WINDOW FOR DESTINATIONS ==== //
    scrollViewContainer: {
        flexGrow: 1,
        alignItems: "center",
        paddingLeft: 10,
        paddingRight: 10,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: "white",
    },

    scrollView: {
        maxHeight: height * 0.4,
        borderRadius: 10,
        overflow: "hidden",
        marginBottom: 10,
    },

    // ==== GENERATE PLAN BUTTON ==== //
    reviewItineraryButton: {
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
        marginBottom: 10,
    },

    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 20,
        marginRight: 20,
    },


    dateHeader: {
        flexDirection: "row",
        marginTop: 10,
        backgroundColor: "gray",
        color: "white",
        width: "100%",
    },

    dateText: {
        color: "white",
        marginLeft: 20,
        marginTop: 10,
        marginBottom: 10,
        fontSize: 18,
    },
    selectedDateHeader: {
        backgroundColor: '#dcdcdc',
    },
    selectedDateText: {
        color: '#007aff',
    },

    additionalInfo: {
        marginTop: 10,
        backgroundColor: "#f0f0f0",
        padding: 10,
        borderRadius: 5,
    },

    additionalText: {
        fontSize: 16,
        color: "#333",
    },
    disabledButton: {
        backgroundColor: '#cccccc',
    },
});

export default GenerateItineraryScreen;
