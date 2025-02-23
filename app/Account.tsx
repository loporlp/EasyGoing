// Account.tsx
// Settings for the user, includes:
// - Change profile photo
// - Change username
// - Change email
// - Change password
// - Delete Account

import { View, StyleSheet, TouchableOpacity, Text, Image, TextInput } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getAuth } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { auth } from '../firebaseConfig';

const Account = () => {

    const navigation = useNavigation();
    // email address
    const [userEmail, setUserEmail] = useState<string | null>(null);

    /**
       * Will get the current user's email address.
       */
    useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            setUserEmail(currentUser.email);
        }
    }, []);

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
        < View style={styles.container} >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <TouchableOpacity onPress={() => { navigation.goBack() }}>
                    <Ionicons name="arrow-back-outline" size={22} color={"black"} />
                </TouchableOpacity>
                <Text style={{ fontSize: 22, fontWeight: "700" }}>Account Settings</Text>
            </View>

            <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <TouchableOpacity>
                    <Image source={require("../assets/images/blue.png")} style={styles.profileImage} />
                </TouchableOpacity>
                <Text style={{marginTop: 5}}>Change Profile Photo</Text>
            </View>

            <View style={styles.divider}></View>

            {/* Username field */}
            <View style={styles.textInputContainer}>
                <View style={styles.textLabel}>
                    <Ionicons name={"person"} size={18} color={"#24a6ad"} />
                    <Text style={{ fontSize: 18 }}>Username:</Text>
                </View>
                <TextInput style={styles.textInput} onChangeText={setUsername} value={username ?? " "}></TextInput>
            </View>

            {/* Email field */}
            <View style={styles.textInputContainer}>
                <View style={styles.textLabel}>
                    <MaterialCommunityIcons name="email" size={18} color={"#24a6ad"} />
                    <Text style={{ fontSize: 18 }}>Email:</Text>
                </View>
                <TextInput style={styles.textInput} onChangeText={setUserEmail} value={userEmail ?? " "} />
            </View>

            {/* Password field */}
            <View style={styles.textInputContainer}>
                <View style={styles.textLabel}>
                    <Ionicons name={"key"} size={18} color={"#24a6ad"} />
                    <Text style={{ fontSize: 18 }}>Password:</Text>
                </View>
                <TouchableOpacity style={[styles.textInput, { justifyContent: "center", borderWidth: 0 }]}>
                    <Text style={{ fontSize: 18 }}>Change password...</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.divider}></View>

            {/* Sign-out button */}
            <TouchableOpacity style={{ alignItems: "center" }}>
                <Text style={styles.signOut}>Delete Account</Text>
            </TouchableOpacity>

        </View >
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

    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },

    textInputContainer: {
        flexDirection: "column",
        gap: 5
    },

    textLabel: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 10
    },

    textInput: {
        height: 40,
        backgroundColor: "white",
        borderRadius: 10,
        fontSize: 18,
        padding: 5,
        color: "gray",
        borderColor: "lightgray",
        borderWidth: 1
    },

    divider: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 10,
        width: "100%"
    },

    signOut: {
        color: "red",
        fontSize: 18
    },
});

export default Account;