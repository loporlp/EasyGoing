// SearchScreen.tsx
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'
import AutocompleteTextBox from '@/components/AutoCompleteTextBox';

const SavedDestinationsScreen = () => {
    const router = useRouter();

    /**
     * Goes to the Home Screen
     */
    const homeScreen = () => {
        router.replace("/HomeScreen")
    }

    /**
     * Goes to the Edit Existing Trips screen
     */
    const viewTrips = () => {
        router.replace("/EditExistingTripsScreen")
    }

    /**
     * Goes to the Account/Profile screen
     */
    const accountScreen = () => {
        router.replace("/Account")
    }

    const searchScreen = () => {
        router.replace("/SearchScreen")
    }

    return (

        <View style={{ flex: 1, flexDirection: "column" }}>
            <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 50 }}>
                    <Text style={{ fontSize: 22, fontWeight: "700" }}>My Trips</Text>
                </View>

            </ScrollView>

            <View style={styles.navBar}>
                <TouchableOpacity style={{ padding: 10, marginLeft: 20 }} onPress={homeScreen}>
                    <Ionicons name="home" size={30} color={"lightgray"} />
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 10 }}>
                    <Ionicons name="bookmark" size={30} color={"#24a6ad"} />
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 10 }} onPress={searchScreen}>
                    <Ionicons name="search" size={30} color={"lightgray"} />
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 10 }} onPress={viewTrips}>
                    <Ionicons name="calendar" size={30} color={"lightgray"} />
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 10, marginRight: 20 }} onPress={accountScreen}>
                    <Ionicons name="person" size={30} color={"lightgray"} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1, // Allows ScrollView to grow and be scrollable
        backgroundColor: '#fff',
        height: "100%",
        paddingHorizontal: 20
    },

    searchSection: {
        flexDirection: "row",
        marginVertical: 20,
        marginTop: 60,
        paddingHorizontal: 20,
        shadowColor: "#333333",
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },

    searchBar: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 10,
        paddingHorizontal: 5
    },

    navBar: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        flexDirection: "row",
        backgroundColor: "white",
        justifyContent: "space-between",
        alignItems: "center",
        height: "8%",
        shadowColor: "#333333",
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },

    destinationInput: {
        height: 30,
        width: "80%",
        borderColor: '#999',
        marginBottom: 20,
        fontSize: 16,
        borderRadius: 10,
        paddingVertical: 5,
        alignSelf: 'center',
    },
});

export default SavedDestinationsScreen;