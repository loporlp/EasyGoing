import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image, ScrollView, FlatList } from 'react-native'
import React, { useRef, useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useHeaderHeight } from '@react-navigation/elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Tabs, Link } from 'expo-router'
import { getAuth } from 'firebase/auth';

const HomeScreen = () => {

    const headerHeight = useHeaderHeight();
    const [activeIndex, setActiveIndex] = useState(0);
    const handleSelectCategory = (index: number) => {
        setActiveIndex(index);
    };

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
            <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: headerHeight }}>
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
                        <Link href={"../CreateNewTrip"} asChild>
                            <TouchableOpacity style={styles.tripButton}>
                                <View style={styles.tripButtons}>
                                    <Ionicons name="add" size={18} color={"white"} />
                                    <Text style={{ color: "white", fontSize: 16, marginLeft: 10 }}>New Trip</Text>
                                </View>
                            </TouchableOpacity>
                        </Link>

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
                        <View style={styles.searchBar}>
                            <Ionicons name="search" size={18} style={{ marginRight: 10 }} color={"black"} />
                            <TextInput placeholder="Search..." placeholderTextColor="#d6d6d6" style={{ fontSize: 18 }} />
                        </View>
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
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
});

export default HomeScreen;