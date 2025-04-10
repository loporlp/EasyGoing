import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Image, Alert, Platform, Share } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CommonActions } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import { storeData, getData } from '../scripts/localStore.js';
import moment from 'moment';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

/**
 *  City Header (picture of city, overlay with text -> City, Country; Dates Visiting; # travelers)
 *  Display Destinations selected in square photos ([][][][][]...ScrollView?) -> press a [] and info about that place (via Wiki API call)
 *  Display Restaraunts chosen ([][][][][][]...ScrollView with # review?) -> 
 *  Display Itinerary below
 *  Buttons to 1) Export 2) Share 3) Save + Confirm -> return to Home page 4) Cancel -> send back to Home
 */
const ReviewItineraryScreen = () => {
    const router = useRouter();

    // Sets trip data
    const [trip, setTrip] = useState<any>(null);
    const [tripId, setTripId] = useState<string | null>(null);
    const [destinations, setDestinations] = useState<any[]>([]); // Store destinations for rendering
    const [groupedDestinations, setGroupedDestinations] = useState<Record<string, any[]>>({}); // Groups destinations by date
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({}); // Controls visibility of date sections

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
                        setDestinations(tripDetails.destinations); // Immediately update the destinations so they load on screen
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

    //group trips by their start date (day) for display
    useEffect(() => {
        if (destinations.length > 0) {
            const grouped = destinations.reduce((formatted, dest) => {
                const formattedDate = moment(dest.startDateTime).format('ddd, MMM D'); //format date
                if (!formatted[formattedDate]) {
                    formatted[formattedDate] = [];
                }
                formatted[formattedDate].push(dest);
                return formatted;
            }, {});
            setGroupedDestinations(grouped);
        }
    }, [destinations]);

    //toggles the visibility of a section (day)
    const toggleSection = (date: string) => {
        setExpandedSections(prev => ({ ...prev, [date]: !prev[date] }));
    };

    //export trip data in json as a text message
    const exportTripDataOld = async () => {
        if (!trip) {
            alert("No trip data available to export.");
            return;
        }

        try {
            const tripDataString = JSON.stringify(trip, null, 2); //json data as string for text msg
            //message for the 'share' function to display
            await Share.share({
                message: tripDataString,
                title: "Exported Trip Data",
            });

        } catch (error) {
            console.error("Error exporting trip data:", error);
        }
    };

    // exports the trip's destinations as an ICal file (to be used with things like google calendar)
    const exportTripData = async () => {
        //ensure there is a trip to export
        if (!trip || !trip.destinations || trip.destinations.length === 0) {
            Alert.alert('No destinations available in the trip');
            return;
        }
    
        //start iCal file
        let icalContent = "BEGIN:VCALENDAR\r\n";
        icalContent += "VERSION:2.0\r\n";
        icalContent += "PRODID:-//EasyGoing//Easygoing//EN\r\n";
        icalContent += "CALSCALE:GREGORIAN\r\n";
    
        //loop through destinations to add each as an event
        trip.destinations.forEach((dest: any, index: number) => {
            const startTime = new Date(dest.startDateTime);
            const durationMinutes = parseFloat(dest.duration) || 1;
            //compute end time using duration
            const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000);
        
            //format times to iCal date-time format (UTC).
            const formattedStart = moment(startTime).utc().format("YYYYMMDD[T]HHmmss[Z]");
            const formattedEnd = moment(endTime).utc().format("YYYYMMDD[T]HHmmss[Z]");
            const dtStamp = moment().utc().format("YYYYMMDD[T]HHmmss[Z]");
            //generate a unique identifier for the event.
            const uid = `${trip.tripName}-${index}@ezgoing.app`;
            
            //add event for destination
            icalContent += "BEGIN:VEVENT\r\n";
            icalContent += `UID:${uid}\r\n`;
            icalContent += `DTSTAMP:${dtStamp}\r\n`;
            icalContent += `DTSTART:${formattedStart}\r\n`;
            icalContent += `DTEND:${formattedEnd}\r\n`;
            icalContent += `SUMMARY:${dest.alias}\r\n`;
        
            //add optional content if included
            if (dest.address) {
                icalContent += `LOCATION:${dest.address}\r\n`;
            }
            if (dest.notes) {
                //replace newlines to ensure the description is on one line.
                const description = dest.notes.replace(/\n/g, " ");
                icalContent += `DESCRIPTION:${description}\r\n`;
            }
            icalContent += "END:VEVENT\r\n";
        });
        //end iCal file
        icalContent += "END:VCALENDAR\r\n";
    
        //set file path
        const fileUri = FileSystem.documentDirectory + 'trip.ics';
        console.log("File will be saved to:", fileUri);
    
        try {
            //write iCal content to file
            await FileSystem.writeAsStringAsync(fileUri, icalContent, { encoding: FileSystem.EncodingType.UTF8 });

            if (!(await Sharing.isAvailableAsync())) {
            Alert.alert('Sharing not available on this device');
            return;
            }
            
            await Sharing.shareAsync(fileUri, {
            mimeType: 'text/calendar',
            dialogTitle: 'Share your Trip Itinerary (ICS File)',
            });  
        } catch (error) {
            console.error('Error exporting iCal file:', error);
            Alert.alert('Error exporting iCal file');
        }
    }

    const goToHome = () => {
        router.replace("/HomeScreen")
    }

    const goBack = () => {
        console.log(router.canGoBack())
        router.back()
    }

    const [date1, setDate1] = useState(false);
    const [date2, setDate2] = useState(false);

    return (
        <View style={styles.container}>
            {/* Top Bar */}
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={30} color={"white"} />
                </TouchableOpacity>
                <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity style={{ marginRight: 10 }} onPress={exportTripData}>
                        <Ionicons name="share" size={30} color={"white"} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.replace("/HomeScreen")}>
                        <Ionicons name="checkmark" size={30} color={"white"} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* City Header */}
            <Image style={styles.backgroundImage} source={require("../assets/images/newyorkcity.jpg")} />
            <View style={styles.darkOverlay} />
            <View style={styles.headerContainer}>
                <View style={styles.screenContainer}>
                    <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                        <Ionicons name="location" size={30} color={"#24a6ad"} style={{ marginRight: 10 }} />
                        <View style={{ flexDirection: "column", alignItems: "flex-start" }}>
                        <Text style={styles.cityTitle}>{trip?.origin || 'Unknown City'}</Text>
                        <Text style={styles.dateRange}>{trip?.tripStartDate ? moment(trip.tripStartDate).format('ddd, MMM D') : 'Start Date'} - {trip?.tripEndDate ? moment(trip.tripEndDate).format('ddd, MMM D') : 'End Date'}</Text>
                        </View>
                    </View>
                </View>
            </View>
            
            {/* Itinerary Section */}
            <ScrollView style={{ flex: 1 }}>
                <View style={styles.bottomScreen}>
                    <Text style={styles.textLabel}>Itinerary:</Text>
                    {/* Loop through grouped destinations and create a section for each date */}
                    {Object.keys(groupedDestinations).map((date, index) => (
                        <View key={index}>
                            {/* Date Header - Expands/Collapses destinations for the date */}
                            <TouchableOpacity style={styles.dateHeader} onPress={() => toggleSection(date)}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Ionicons name="calendar" size={25} color="#24a6ad" />
                                    <Text style={styles.dateText}>{date}</Text>
                                </View>
                                <Ionicons name={expandedSections[date] ? 'caret-up' : 'caret-down'} size={25} color="#24a6ad" />
                            </TouchableOpacity>
                            {/* Expand section when clicked */}
                            {expandedSections[date] && (
                                <View>
                                    {/* Iterate through the destinations for the date */}
                                    {groupedDestinations[date].map((dest, idx) => (
                                        <View key={idx}>
                                            {/* Display the destination */}
                                            <TouchableOpacity>
                                                <View style={styles.destination}>
                                                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                                    <Image source={dest.picture?.url ? { uri: dest.picture.url } : require("../assets/images/newyorkcity.jpg")} style={styles.destinationImage} />
                                                        <View style={{ flex: 1, flexDirection: "column", paddingVertical: 10, marginVertical: 10 }}>
                                                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                                                <Ionicons name="location" size={20} color={"#24a6ad"} />
                                                                <Text style={{ flex: 1, fontSize: 20, fontWeight: "700", marginLeft: 5 }}>{dest.alias}</Text>
                                                            </View>
                                                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginLeft: 5 }}>
                                                                <MaterialCommunityIcons name={"label"} color={"#24a6ad"} />
                                                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ marginLeft: 5, color: "gray", marginTop: -5 }}>{dest.address}</Text>
                                                            </View>
                                                            <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginRight: 5 }}>
                                                                <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                                                    <Ionicons name="time" size={18} color={"#24a6ad"} />
                                                                    <Text style={{ marginLeft: 5 }}>{dest.duration} hr</Text>
                                                                </View>
                                                                <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginRight: 5 }}>
                                                                    <MaterialCommunityIcons name="priority-high" size={18} color={"#24a6ad"} />
                                                                    <Text style={{ marginLeft: 5 }}>{dest.priority}</Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                            {/* Display transit info only if not last item of the day */}
                                            {idx < groupedDestinations[date].length - 1 && (
                                            <View style={{ height: 50, backgroundColor: "white", borderTopWidth: 1, borderColor: "lightgray" }}>
                                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 15 }}>
                                                <Ionicons name={dest.mode === 'walking' ? "walk" : "bus"} size={22} color="#24a6ad" />
                                                <Text style={{ fontSize: 16 }}>{dest.transportDuration || "Transit"}</Text>
                                                </View>
                                            </View>
                                            )}
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
        marginBottom: 10,
    },

    textLabel: {
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 10
    },

    topBar: {
        position: "absolute",
        top: 50,
        left: 0,
        right: 0,
        zIndex: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        width: "100%",
    },

    // ==== CITY HEADER ==== //
    headerContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: 250,
        justifyContent: "flex-end",
        paddingBottom: 20,
        paddingHorizontal: 15,
        zIndex: 1,
    },

    backgroundImage: {
        width: "100%",
        height: 250,
        resizeMode: "cover",
    },

    cityTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "white",
        flexWrap: "wrap",
        maxWidth: "90%",
    },

    dateRange: {
        fontSize: 16,
        color: "white",
        marginTop: 2,
    },

    darkOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: 250,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },

    screenContainer: {
        marginTop: "50%",
        marginLeft: 15,
    },

    // ==== BOTTOM WINDOW ==== //
    bottomScreen: {
        top: -18,
        backgroundColor: "#F4F4F4",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: 20,
    },

    destinationItem: {
        marginRight: 10,
        backgroundColor: "#e0e0e0",
        padding: 20,
        borderRadius: 10,
    },

    itineraryItem: {
        marginVertical: 10,
    },

    // Destination scroll view
    scrollViewContainer: {
        borderWidth: 2,
        borderRadius: 10,
        borderColor: "#24a6ad", // Ensure the border color is visible
        marginVertical: 10, // Adds some vertical space between sections if needed
    },

    // This will apply to the content inside the scroll view
    scrollViewContainerContent: {
        alignItems: "center",
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5,
    },

    destinationInfo: {
        marginLeft: 5,
        marginRight: 5,
    },

    destination: {
        backgroundColor: "white",
        width: "100%",
        height: 100,
        borderTopWidth: 1,
        borderColor: "lightgray"
    },

    destinationImage: {
        width: 70,
        height: 70,
        resizeMode: "cover",
        overflow: "hidden",
        borderRadius: 10,
        marginLeft: 5
    },

    buttonContainer: {
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,
        flexDirection: "row",
        justifyContent: "space-between",
    },

    button: {
        backgroundColor: "#007BFF",
        padding: 10,
        borderRadius: 5,
    },

    dateText: {
        color: "black",
        fontSize: 18,
        fontWeight: "700",
        marginLeft: 5
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

    destinationElement: {
        width: "100%",
        height: 75,
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center",
        padding: 5,
        position: "relative",
    },

    dateHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        backgroundColor: "white",
        color: "white",
        width: "100%",
        shadowColor: "#333333",
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },

});

export default ReviewItineraryScreen;
