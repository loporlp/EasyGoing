import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image, ScrollView, FlatList } from 'react-native'
import React, { useRef, useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useHeaderHeight } from '@react-navigation/elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { Link } from 'expo-router'
import { getAuth } from 'firebase/auth';

const HomeScreen = () => {

    // Sets up navigations
    const router = useRouter();

    const headerHeight = useHeaderHeight();
    const [activeIndex, setActiveIndex] = useState(0);
    const handleSelectCategory = (index: number) => {
        setActiveIndex(index);
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

    const accountScreen = () => {
        router.replace("/Account")
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

    const destinationList = [
        {
            destination: "Disneyland Tokyo",
            image: "disneyland",
            time: "12h",
            amount: "$124",
        },
        {
            destination: "Tokyo Skytree",
            image: "skytree",
            time: "3h",
            amount: "$14",
        },
        {
            destination: "Mt. Fuji Tour",
            image: "fuji",
            time: "10h",
            amount: "$33",
        },
        {
            destination: "Senso-ji",
            image: "sensoji",
            time: "2h",
            amount: "$0",
        },
        {
            destination: "Tokyo National Museum",
            image: "museum",
            time: "4h",
            amount: "$6.35",
        },
    ];

    const imageMap = {
        disneyland: require("../assets/images/tokyodisneyland.jpg"),
        skytree: require("../assets/images/skytree.jpg"),
        fuji: require("../assets/images/fuji.jpg"),
        sensoji: require("../assets/images/sensoji.jpg"),
        museum: require("../assets/images/museum.jpg"),
    };

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

    return (
        <>
            <View style={{flex: 1, flexDirection: "column"}}>
                <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: headerHeight, flexGrow: 1 }}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>Hello, <Text style={{ color: "#24a6ad" }}>{username}<Text style={{ color: "white" }}>!</Text></Text></Text>
                        <TouchableOpacity onPress={() => { }} style={styles.notificationButton}>
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

                            <TouchableOpacity style={styles.tripButton}>
                                <View style={styles.tripButtons}>
                                    <Ionicons name="pencil" size={18} color={"white"} />
                                    <Text style={{ color: "white", fontSize: 16, marginLeft: 10 }}>Edit Trip</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.homeSection}>
                        <View style={styles.searchSection}>
                            <TouchableOpacity style={styles.searchBar}>
                                <Ionicons name="search" size={18} style={{ marginRight: 10 }} color={"black"} />
                                <Text style={{ fontSize: 18, color: "#d6d6d6" }}>Search...</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ paddingHorizontal: 20 }}>
                            <View>
                                <Image style={styles.backgroundImage} source={require("../assets/images/tokyojpn.jpg")} />
                                <View style={styles.backgroundImageOverlay}></View>
                                <View style={styles.currentLocationText}>
                                    <Text style={{ color: "white", marginLeft: 10 }}>Currently in...</Text>
                                    <Text style={{ color: "white", fontWeight: "bold", marginLeft: 10, fontSize: 18 }}>Tokyo, Japan</Text>
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
                                {recommendedList.map((item, index) => (
                                    <TouchableOpacity onPress={() => handleSelectCategory(index)} style={activeIndex == index ? styles.activeRecommendBtn : styles.recommendBtn} key={index}>
                                        <MaterialCommunityIcons name={item.iconName as any} size={20} color={activeIndex == index ? "white" : "black"} />
                                        <Text style={activeIndex == index ? styles.recommendBtnTextActive : styles.recommendBtnText}>{item.title}</Text>
                                    </TouchableOpacity>
                                ))}
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
                                                <Image style={styles.destImage} source={imageMap[item.image]} />
                                                <TouchableOpacity style={styles.saveIconWrapper}>
                                                    <Ionicons name="bookmark" size={22} color={"white"} />
                                                </TouchableOpacity>
                                            </View>

                                            <View style={styles.destTextWrapper}>
                                                <View style={{ flex: 1, flexDirection: "row", marginTop: 5, alignItems: "center" }}>
                                                    <Ionicons name="location" size={22} color={"#24a6ad"} />
                                                    <Text style={{ marginLeft: 5, fontSize: 20, fontWeight: "bold", flexWrap: "wrap" }} numberOfLines={2} ellipsizeMode="tail">{item.destination}</Text>
                                                </View>
                                                <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", top: 8 }}>
                                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: -10 }}>
                                                        <Ionicons name="time" size={18} color={"#24a6ad"} />
                                                        <Text style={{ marginLeft: 5, fontSize: 16 }}>{item.time}</Text>
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
                                data={destinationList}
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
                                                    <Ionicons name="bookmark" size={22} color={"white"} />
                                                </TouchableOpacity>
                                            </View>

                                            <View style={styles.destTextWrapper}>
                                                <View style={{ flex: 1, flexDirection: "row", marginTop: 5, alignItems: "center" }}>
                                                    <Ionicons name="location" size={22} color={"#24a6ad"} />
                                                    <Text style={{ marginLeft: 5, fontSize: 20, fontWeight: "bold", flexWrap: "wrap" }} numberOfLines={2} ellipsizeMode="tail">{item.destination}</Text>
                                                </View>
                                                <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", top: 8 }}>
                                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: -10 }}>
                                                        <Ionicons name="time" size={18} color={"#24a6ad"} />
                                                        <Text style={{ marginLeft: 5, fontSize: 16 }}>{item.time}</Text>
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
                    <TouchableOpacity style={{padding: 10, marginLeft: 20}}>
                        <Ionicons name="home" size={30} color={"#24a6ad"} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{padding: 10}}>
                        <Ionicons name="search" size={30} color={"lightgray"} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{padding: 10}} onPress={viewTrips}>
                        <Ionicons name="calendar" size={30} color={"lightgray"} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{padding: 10, marginRight: 20}} onPress={accountScreen}>
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
    const response = await fetch('http://ezgoing.app/api/serverstatus');
    const data = await response.json();
    console.log(data.message); // This should log "Hello from the server!"
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// TODO: This was just an example. Eventually delete (since we probalby don't need on this page)
const callProtectedApi = async () => {
  try {
    // Retrieve the ID token
    const idToken = await getIdToken(auth);

    const searchTerm = "McDona"
    // Define the API endpoint
    const apiUrl = `http://ezgoing.app/api/autocomplete?input=${searchTerm}`; // Search term is the user inputted that we are auto completeing

    // Make the API call
    const response = await fetch(apiUrl, {
      method: "GET", // Or "POST", "PUT", etc.
      headers: {
        Authorization: `Bearer ${idToken}`, // Include the ID token in the header
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("API Response:", data); // Handle the response
  } catch (error) {
    console.error("Error calling API:", error);
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