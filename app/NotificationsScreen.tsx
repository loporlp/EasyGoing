// NotificationsScreen.tsx
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, Image } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';

const NotificationsScreen = () => {

    const navigation = useNavigation()

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
        <View style={styles.container}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <TouchableOpacity onPress={() => { navigation.goBack() }}>
                    <Ionicons name="arrow-back-outline" size={22} color={"black"} />
                </TouchableOpacity>
                <Text style={{ fontSize: 22, fontWeight: "700" }}>Notifications</Text>
            </View>

            <ScrollView style={styles.scrollContainer} contentContainerStyle={{ gap: 15 }}>
                <View style={styles.notificationContainer}>
                    <View style={styles.notificationBanner}>
                        <View style={styles.notificationAuthor}>
                            <Image source={require("../assets/images/blue.png")} style={styles.authorImage} />
                            <Text style={styles.authorText}>EASY GOING</Text>
                        </View>
                        <Text style={{ color: "white", fontSize: 14 }}>1h ago</Text>
                    </View>

                    <View style={styles.notificationContent}>
                        <Text style={{ color: "black", fontSize: 14, fontWeight: "700" }}>Easy Going</Text>
                        <Text style={styles.notificationMessage} numberOfLines={2}>Hi {username}, you started creating a new trip. Continue editing?</Text>
                    </View>
                </View>

                <View style={styles.notificationContainer}>
                    <View style={styles.notificationBanner}>
                        <View style={styles.notificationAuthor}>
                            <Image source={require("../assets/images/blue.png")} style={styles.authorImage} />
                            <Text style={styles.authorText}>EASY GOING</Text>
                        </View>
                        <Text style={{ color: "white", fontSize: 14 }}>Yesterday, 4:32 PM</Text>
                    </View>

                    <View style={styles.notificationContent}>
                        <Text style={{ color: "black", fontSize: 14, fontWeight: "700" }}>Easy Going</Text>
                        <Text style={styles.notificationMessage} numberOfLines={2}>Welcome to Easy Going, your travel planning partner!</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        marginHorizontal: 20,
        marginTop: 50,
        backgroundColor: "#f4f4f4",
        gap: 15
    },

    scrollContainer: {
        flexGrow: 1
    },

    notificationContainer: {
        height: 100,
        width: "100%",
        backgroundColor: "white",
        borderRadius: 10,
    },

    notificationBanner: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#24a6ad",
        height: "40%",
        width: "100%",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        paddingHorizontal: 5
    },

    notificationAuthor: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 10
    },

    authorImage: {
        height: 18,
        width: 18,
        borderRadius: 5
    },

    authorText: {
        color: "white",
        fontWeight: "700",
        fontSize: 14
    },

    notificationContent: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        height: "60%",
        width: "100%",
        padding: 10
    },

    notificationMessage: {
        fontSize: 14
    }
});

export default NotificationsScreen;