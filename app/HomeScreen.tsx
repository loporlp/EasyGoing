import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image, ScrollView, FlatList, ActivityIndicator } from 'react-native'
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useHeaderHeight } from '@react-navigation/elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from "expo-router";
import { Link } from 'expo-router'
import { getAuth } from 'firebase/auth';
import {storeData, getData, fillLocal} from "../scripts/localStore";
import storage from '@react-native-async-storage/async-storage';
import { auth } from '@/firebaseConfig';
import { updateTrip } from '@/scripts/databaseInteraction';
import { recommended_places } from '../scripts/recommendedPlacesAi';
import { getImageUrl } from '../scripts/ImageUtils'

const HomeScreen = () => {

    // Fill the local storage with trips if it is empty
    // Trip ids in local storage can be accessed through getData("tripIDs")
    useEffect(() => {
        fillLocal();
      }, []);

    // Sets up navigations
    const router = useRouter();

    // Used for recommended locations
    const [isLoading, setIsLoading] = useState(true);

    const headerHeight = useHeaderHeight();
    const [activeIndex, setActiveIndex] = useState(0);
    const [locationType, setLocationType] = useState<string>("world travel locations");
    const handleSelectCategory = (index: number) => {
        setActiveIndex(index);
    };

    const handleTypeOfLocationPress = (locationType: string) => {
        console.log("Type of place clicked:", locationType);
        setIsLoading(true);
        setLocationType(locationType);
    };

    /**
   * Navigates to the "Create New Trip" page
   */
    const createNewTrip = () => {
        console.log("Going to 'Create New Trip'...")
        router.push("/CreateNewTrip")
    }

    const viewTrips = () => {
        router.replace("/EditExistingTripsScreen")
    }

    const settingsScreen = () => {
        router.replace("/Settings")
    }

    const searchScreen = () => {
        router.replace("/SearchScreen")
    }

    const editTripsScreen = () => {
        router.replace("/EditExistingTripsScreen")
    }

    const savedDestinations = () => {
        router.replace("/SavedDestinationsScreen")
    }

    const notificationsScreen = () => {
        router.push("/NotificationsScreen")
    }

    const scrollRef = useRef<ScrollView>(null);
    const recommendedList = [
        {
            title: "All",
            iconName: "hiking"
        },
        {
            title: "Things to Do",
            iconName: "map-marker",
        },
        {
            title: "Dining",
            iconName: "silverware"
        },
        {
            title: "Shopping",
            iconName: "shopping",
        },
    ];

    type Destination = {
        destination: string;
        image: string;
        time: string;
        amount: string;
        review: string;
        reviewAmt: string;
        saved: boolean;
    };

    // Backup array
    const backupArray = [
        {
            destination: "Statue of Liberty",
            image: "statue",
            time: "3h",
            amount: "$25",
            review: "4.7",
            reviewAmt: "105k",
            saved: false
        },
        {
            destination: "The Metropolitan Museum of Art",
            image: "moma",
            time: "4h",
            amount: "$30",
            review: "4.8",
            reviewAmt: "84k",
            saved: false
        },
        {
            destination: "Grand Central Market",
            image: "market",
            time: "1h",
            amount: "$$$",
            review: "4.5",
            reviewAmt: "1468",
            saved: false
        },
        {
            destination: "Joe's Shanghai",
            image: "food",
            time: "N/A",
            amount: "$$",
            review: "4.2",
            reviewAmt: "5705",
            saved: false
        },
        {
            destination: "Central Park",
            image: "park",
            time: "2h",
            amount: "$0",
            review: "4.8",
            reviewAmt: "278k",
            saved: false
        },
    ];

    const [destinationList, setDestinationList] = useState<Destination[]>(backupArray);

    useEffect(() => {
        const fetchData = async () => {
            const accountInfo = await getData("savedDestinations");
            const savedList = accountInfo?.[0]?.destinations ?? [];

            try {
                
                const dataString = await recommended_places(3, locationType); // Get 3 recommendations with location type
                
                // Extract AI message content
                const recommendations = dataString?.choices?.[0]?.message?.content;
                
                if (!recommendations) {
                    console.error("Error: No recommendations received");

                    const updatedBackup = backupArray.map((item) => {
                        const isSaved = savedList.some(
                            (savedItem: Destination) => savedItem.destination === item.destination
                        );
                        return {
                            ...item,
                            saved: isSaved,
                        };
                    });
                      
                    setDestinationList(updatedBackup);
                    setIsLoading(false);

                    return;
                }
    
                console.log("Recommendations from AI:", recommendations);
    
                let parsedData;
    
                // Check if it's a clean JSON array
                if (recommendations.trim().startsWith("[") && recommendations.trim().endsWith("]")) {
                    parsedData = JSON.parse(recommendations.trim());
                } else {
                    // Otherwise, clean the JSON string (remove ```json and ``` if present)
                    const cleanData = recommendations.trim().replace(/```json|```/g, "");
                    parsedData = JSON.parse(cleanData);
                }

                // Get an actual image using APIs
                const updatedData = await Promise.all(
                    parsedData.map(async (item: Destination) => {
                        const updatedImage = await getImageUrl(item.image);

                        // Check if this destination is in the saved list
                        const isSaved = savedList.some(
                            (savedItem: Destination) => savedItem.destination === item.destination
                        );
                        return {
                            ...item,
                            image: updatedImage,
                            saved: isSaved
                        };
                    })
                );

                console.log("Updated Data: ", updatedData);
        
                setDestinationList(updatedData);
            } catch (error) {
                console.error("Error parsing JSON:", error);
    
                // Set backup array if parsing fails
                const updatedBackup = backupArray.map((item) => {
                const isSaved = savedList.some(
                    (savedItem: Destination) => savedItem.destination === item.destination
                );
                return {
                    ...item,
                    saved: isSaved,
                };
                });

                setDestinationList(updatedBackup);
            }
            setIsLoading(false);
        };
    
        fetchData();
    }, [locationType]);

    useFocusEffect(
        useCallback(() => {
          const refreshSavedBookmarks = async () => {
            const accountInfo = await getData("savedDestinations");
            const savedList = accountInfo?.[0]?.destinations ?? [];
      
            const updatedList = destinationList.map((item) => {
              const isSaved = savedList.some(
                (savedItem: Destination) => savedItem.destination === item.destination
              );
              return {
                ...item,
                saved: isSaved
              };
            });
      
            setDestinationList(updatedList);
          };
      
          refreshSavedBookmarks();
        }, [])
      );      
    
      

    const imageMap = {
        statue: require("../assets/images/statueofliberty.jpg"),
        moma: require("../assets/images/moma.jpg"),
        market: require("../assets/images/grandCentralMarket.jpg"),
        food: require("../assets/images/joesshanghai.jpg"),
        park: require("../assets/images/CentralPark.jpg"),
        tower: require("../assets/images/skytree.jpg")
    };

    const recentSearches = [
        {
            destination: "Statue of Liberty",
            image: "statue",
            time: "3h",
            amount: "$25",
            review: "4.7",
            reviewAmt: "105k",
            saved: false
        },
        {
            destination: "The Metropolitan Meuseum of Art",
            image: "moma",
            time: "4h",
            amount: "$30",
            review: "4.8",
            reviewAmt: "84k",
            saved: false
        },
        {
            destination: "Tokyo Skytree",
            image: "tower",
            time: "3h",
            amount: "$13.49",
            review: "4.4",
            reviewAmt: "94k",
            saved: true
        }
    ];
    // Gets the username
    const [username, setUsername] = useState<string>('');

    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user && user.email) {
            const email = user.email;
            const extractedUsername = email.split('@')[0];
            setUsername(extractedUsername);
        }
    }, []);

    // When a recommended place is bookmarked
    const handleBookmarkClick = async (destination: Destination) => {
        console.log("Bookmarked:", destination);

        let accountInfo = await getData("savedDestinations");
        console.log("Account Info from getData():", accountInfo);
        let savedDestinations = accountInfo[0].destinations;

        try {
            // See if it was already bookmarked
            console.log("Loaded savedDestinations:", savedDestinations);
            const isBookmarked = savedDestinations.find((item: Destination) => item.destination === destination.destination) !== undefined;

            if (isBookmarked) {
                // If already bookmarked, remove it
                savedDestinations = savedDestinations.filter((item: Destination) => item.destination !== destination.destination);
                destination.saved = false;
                console.log("New savedDestinations:", savedDestinations);
                updateBookmarkStyle(destination, false);
                console.log("Removed bookmark");
            } else {
                // If not bookmarked, add it to the saved list
                destination.saved = true;
                savedDestinations.push(destination);
                console.log("New savedDestinations:", savedDestinations);
                updateBookmarkStyle(destination, true);
                console.log("Bookmarked");
            }
    
            // Update the database
            accountInfo[0].destinations = savedDestinations;
            console.log("AccountInfo:", accountInfo);
            updateTrip(accountInfo[1], accountInfo[0]);
        } catch (error) {
            console.log(error);
        }
    };

    // Function to update the bookmark icon style based on the saved state
    const updateBookmarkStyle = (destination: { destination: any; image?: string; time?: string; amount?: string; review?: string; reviewAmt?: string; saved?: boolean; }, isBookmarked: boolean) => {
        // The bookmark icon color is gold when bookmarked, white when not bookmarked
        const updatedDestinations = destinationList.map(item => {
            if (item.destination === destination.destination) {
                return {
                    ...item,
                    saved: isBookmarked,
                };
            }
            return item;
        });

        // Force re-render
        setDestinationList(updatedDestinations); 
    };

    return (
        <>
            <View style={{ flex: 1, flexDirection: "column" }}>
                <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: headerHeight, flexGrow: 1 }}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>Hello, <Text style={{ color: "#24a6ad" }}>{username}<Text style={{ color: "white" }}>!</Text></Text></Text>
                        <TouchableOpacity onPress={() => { getData("tripIDs")}} style={styles.notificationButton} onPress={notificationsScreen}>
                            <Ionicons name="notifications" size={20} color="black" />
                        </TouchableOpacity>
                    </View>

                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                        <Image style={{ width: "100%", height: 230, position: "relative" }} source={require("../assets/images/mountains.jpg")} />
                        <View style={{ width: "100%", height: 230, position: "absolute", backgroundColor: "rgba(0, 0, 0, 0.5)" }}></View>
                        <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-evenly", position: "absolute", top: 125, width: "100%" }}>
                            <TouchableOpacity style={styles.tripButton} onPress={createNewTrip}>
                                <View style={styles.tripButtons}>
                                    <Ionicons name="add" size={18} color={"white"} />
                                    <Text style={{ color: "white", fontSize: 16, marginLeft: 10 }}>New Trip</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.tripButton} onPress={editTripsScreen}>
                                <View style={styles.tripButtons}>
                                    <Ionicons name="pencil" size={18} color={"white"} />
                                    <Text style={{ color: "white", fontSize: 16, marginLeft: 10 }}>Edit Trip</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.homeSection}>
                        <View style={styles.searchSection}>
                            <TouchableOpacity style={styles.searchBar} onPress={searchScreen}>
                                <Ionicons name="search" size={18} style={{ marginRight: 10 }} color={"black"} />
                                <Text style={{ fontSize: 18, color: "#d6d6d6" }}>Search...</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ paddingHorizontal: 20 }}>
                            <View>
                                <Image style={styles.backgroundImage} source={require("../assets/images/newyorkcity.jpg")} />
                                <View style={styles.backgroundImageOverlay}></View>
                                <View style={styles.currentLocationText}>
                                    <Text style={{ color: "white", marginLeft: 10 }}>Currently in...</Text>
                                    <Text style={{ color: "white", fontWeight: "bold", marginLeft: 10, fontSize: 18 }}>New York City, USA</Text>
                                </View>
                            </View>
                        </View>

                        <View style={{ paddingHorizontal: 20, marginTop: 15 }}>
                            <Text style={{ fontSize: 22, fontWeight: "700", }}>Recommended</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} ref={scrollRef} contentContainerStyle={{
                                gap: 10,
                                paddingVertical: 10,
                                marginBottom: 10
                            }}>
                                {isLoading ? (
                                    <ActivityIndicator size="large" color="#0000ff" />
                                ) : (
                                    recommendedList.map((item, index) => (
                                        <TouchableOpacity
                                            onPress={() => {
                                                handleSelectCategory(index);
                                                handleTypeOfLocationPress(item.title);
                                            }}
                                            style={activeIndex === index ? styles.activeRecommendBtn : styles.recommendBtn}
                                            key={index}>
                                            <MaterialCommunityIcons name={item.iconName as any} size={20} color={activeIndex === index ? "white" : "black"} />
                                            <Text style={activeIndex === index ? styles.recommendBtnTextActive : styles.recommendBtnText}>{item.title}</Text>
                                        </TouchableOpacity>
                                    ))
                                )}
                            </ScrollView>

                            <FlatList
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                data={destinationList}
                                keyExtractor={(item) => item.destination}
                                contentContainerStyle={{
                                    gap: 10,
                                    marginBottom: 10
                                }}
                                renderItem={({ item }) => (
                                    <View>
                                        <TouchableOpacity style={styles.recommendDest}>
                                            <View style={styles.destImageWrapper}>
                                                <Image style={styles.destImage} source={{ uri: item.image }} />
                                                <TouchableOpacity style={styles.saveIconWrapper} onPress={() => handleBookmarkClick(item)}>
                                                    <Ionicons name="bookmark" size={22} color={item.saved ? "#FFD700" : "white"} />
                                                </TouchableOpacity>
                                            </View>

                                            <View style={styles.destTextWrapper}>
                                                <View style={{ flex: 1, flexDirection: "row", marginTop: 5, alignItems: "center" }}>
                                                    <Ionicons name="location" size={22} color={"#24a6ad"} />
                                                    <Text style={{ marginLeft: 5, fontSize: 20, fontWeight: "bold", flexWrap: "wrap" }} numberOfLines={2} ellipsizeMode="tail">{item.destination}</Text>
                                                </View>
                                                <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", top: 8 }}>
                                                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-start" }}>
                                                        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: -10 }}>
                                                            <Ionicons name="time" size={18} color={"#24a6ad"} />
                                                            <Text style={{ marginLeft: 5, fontSize: 16 }}>{item.time}</Text>
                                                        </View>
                                                        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: -10, marginLeft: -140 }}>
                                                            <Ionicons name="star" size={18} color={"gold"} />
                                                            <Text style={{ fontSize: 16 }}>{item.review}</Text>
                                                            <Text style={{ fontSize: 16 }}>({item.reviewAmt})</Text>
                                                        </View>
                                                    </View>
                                                    <Text style={{ fontSize: 16 }}>{item.amount}</Text>
                                                </View>
                                            </View>

                                        </TouchableOpacity>
                                    </View>
                                )}
                            >
                            </FlatList>
                        </View>

                        <View style={{ paddingHorizontal: 20, marginTop: 15 }}>
                            <Text style={{ fontSize: 22, fontWeight: "700", }}>Recent Searches</Text>
                            <FlatList
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                data={recentSearches}
                                keyExtractor={(item) => item.destination}
                                contentContainerStyle={{
                                    gap: 10,
                                    marginVertical: 10
                                }}
                                renderItem={({ item }) => (
                                    <View>
                                        <TouchableOpacity style={styles.recommendDest}>
                                            <View style={styles.destImageWrapper}>
                                                <Image style={styles.destImage} source={imageMap[item.image]} />
                                                <TouchableOpacity style={styles.saveIconWrapper}>

                                                    <Ionicons name="bookmark" size={22} color={item.saved ? "#FFD700" : "white"} />
                                                </TouchableOpacity>
                                            </View>

                                            <View style={styles.destTextWrapper}>
                                                <View style={{ flex: 1, flexDirection: "row", marginTop: 5, alignItems: "center" }}>
                                                    <Ionicons name="location" size={22} color={"#24a6ad"} />
                                                    <Text style={{ marginLeft: 5, fontSize: 20, fontWeight: "bold", flexWrap: "wrap" }} numberOfLines={2} ellipsizeMode="tail">{item.destination}</Text>
                                                </View>
                                                <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", top: 8 }}>
                                                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-start" }}>
                                                        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: -10 }}>
                                                            <Ionicons name="time" size={18} color={"#24a6ad"} />
                                                            <Text style={{ marginLeft: 5, fontSize: 16 }}>{item.time}</Text>
                                                        </View>
                                                        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: -10, marginLeft: -140 }}>
                                                            <Ionicons name="star" size={18} color={"gold"} />
                                                            <Text style={{ fontSize: 16 }}>{item.review}</Text>
                                                            <Text style={{ fontSize: 16 }}>({item.reviewAmt})</Text>
                                                        </View>
                                                    </View>
                                                    <Text style={{ fontSize: 16 }}>{item.amount}</Text>
                                                </View>
                                            </View>

                                        </TouchableOpacity>
                                    </View>
                                )}
                            >
                            </FlatList>
                        </View>
                    </View>
                </ScrollView>

                <View style={styles.navBar}>
                    <TouchableOpacity style={{ padding: 10, marginLeft: 20 }}>
                        <Ionicons name="home" size={30} color={"#24a6ad"} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ padding: 10 }} onPress={savedDestinations}>
                        <Ionicons name="bookmark" size={30} color={"lightgray"} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ padding: 10 }} onPress={searchScreen}>
                        <Ionicons name="search" size={30} color={"lightgray"} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ padding: 10 }} onPress={viewTrips}>
                        <Ionicons name="calendar" size={30} color={"lightgray"} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ padding: 10, marginRight: 20 }} onPress={settingsScreen}>
                        <Ionicons name="person" size={30} color={"lightgray"} />
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
}


const fetchData = async () => {
    try {
        // We should put this ip into a global constant
        const response = await fetch('https://ezgoing.app/api/serverstatus');
        const data = await response.json();
        console.log(data.message); // This should log "Hello from the server!"
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: "70%"
    },

    headerContainer: {
        position: "absolute",
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10,
        width: "100%",
    },

    headerText: {
        color: 'white',
        fontSize: 25,
        fontWeight: 'bold',
    },

    notificationButton: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
    },

    searchSection: {
        flexDirection: "row",
        marginVertical: 20,
        marginTop: 15,
        paddingHorizontal: 20,
        shadowColor: "#333333",
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },

    searchBar: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "white",
        padding: 10,
        borderRadius: 10
    },

    backgroundImage: {
        width: "100%",
        height: 150,
        borderRadius: 10,
        resizeMode: "cover",
        position: "relative",
    },

    backgroundImageOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        width: "100%",
        height: "100%",
        borderRadius: 10,
    },

    currentLocationText: {
        position: "absolute",
        bottom: 10,
    },

    homeSection: {
        backgroundColor: "#F4F4F4",
        borderRadius: 10,
        height: "100%",
        top: -10,
    },

    tripButton: {
        padding: 10,
        backgroundColor: "#24a6ad",
        borderRadius: 10,
        shadowColor: "#333333",
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3
    },

    tripButtons: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        padding: 5,
    },

    recommendBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        shadowColor: "#333333",
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },

    recommendBtnText: {
        marginLeft: 5,
        color: "black",

    },

    activeRecommendBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#24a6ad",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        shadowColor: "#333333",
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },

    recommendBtnTextActive: {
        marginLeft: 5,
        color: "white",
    },

    recommendDest: {
        backgroundColor: "white",
        padding: 10,
        height: 250,
        borderRadius: 10,
        width: 300,
        shadowColor: "#333333",
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },

    destImage: {
        borderRadius: 10,
        width: "100%",
        height: "100%",
        resizeMode: "cover",  // Make sure the image covers the container
    },

    saveIconWrapper: {
        position: "absolute", // Position the icon on top of the image
        top: 10,              // Adjust the top distance to position the icon
        right: 10,            // Adjust the right distance to position the icon
        backgroundColor: "rgba(36,166, 173, 0.8)", // Optional background for better visibility
        borderRadius: 20,    // Optional to round the icon background
        padding: 15,

    },

    destImageWrapper: {
        position: "relative",  // Required for positioning the icon over the image
        borderRadius: 10,
        width: "100%",
        height: "70%",  // Adjust based on your layout preference
    },

    destTextWrapper: {
        flex: 1,
        flexDirection: "column",
        marginTop: 5
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
    }
});

export default HomeScreen;