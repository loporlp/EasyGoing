// SearchScreen.tsx
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'
import AutocompleteTextBox from '@/components/AutoCompleteTextBox';

const SearchScreen = () => {
    const router = useRouter();

    const homeScreen = () => {
        router.replace("/HomeScreen")
    }

    const viewTrips = () => {
        router.replace("/EditExistingTripsScreen")
    }

    const accountScreen = () => {
        router.replace("/Account")
    }

    return (
        <View>
            <View style={styles.searchSection}>
                <TouchableOpacity style={styles.searchBar}>
                    <Ionicons name="search" size={18} style={{ marginRight: 10 }} color={"black"} />
                    <AutocompleteTextBox placeholder="Search..." placeholderTextColor="#d6d6d6" />
                </TouchableOpacity>
            </View>

            <View style={styles.navBar}>
                <TouchableOpacity style={{ padding: 10, marginLeft: 20 }} onPress={homeScreen}>
                    <Ionicons name="home" size={30} color={"lightgray"} />
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 10 }}>
                    <Ionicons name="search" size={30} color={"#24a6ad"} />
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

export default SearchScreen;