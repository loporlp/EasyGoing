// SearchScreen.tsx
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'
import AutocompleteTextBox from '@/components/AutoCompleteTextBox';
import GoBotAI from '@/components/GoBotAI';

const SearchScreen = () => {
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
    const settingsScreen = () => {
        router.replace("/Settings")
    }

    const savedDestinations = () => {
        router.replace("/SavedDestinationsScreen")
    }

    return (
        <View style={{ flex: 1, flexDirection: "column" }}>

            <View style={styles.searchSection}>
                <GoBotAI />
            </View>

            <View style={styles.navBar}>
                <TouchableOpacity style={{ padding: 10, marginLeft: 20 }} onPress={homeScreen}>
                    <Ionicons name="home" size={30} color={"lightgray"} />
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 10 }} onPress={savedDestinations}>
                    <Ionicons name="bookmark" size={30} color={"lightgray"} />
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 10 }}>
                    <Ionicons name="search" size={30} color={"#24a6ad"} />
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 10 }} onPress={viewTrips}>
                    <Ionicons name="calendar" size={30} color={"lightgray"} />
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 10, marginRight: 20 }} onPress={settingsScreen}>
                    <Ionicons name="person" size={30} color={"lightgray"} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
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
        zIndex: 100
    },
});

export default SearchScreen;