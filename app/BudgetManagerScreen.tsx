// BudgetManager.tsx
import { useRouter } from "expo-router";
import { View, StyleSheet, TextInput, Text, TouchableOpacity, Modal, TouchableWithoutFeedback, Image, ScrollView } from "react-native";
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const BudgetManagerScreen = () => {
    const navigation = useNavigation();

    return (
        <ScrollView style={styles.container}>
            <View style={styles.containerContent}>

                {/* The header (includes back arrow + title of the screen) */}
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }}>
                        <Ionicons name="arrow-back-outline" size={22} color={"black"} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 22, fontWeight: "700" }}>Budget Manager</Text>
                </View>

                {/* Replace this with DynamicImage from placeName = trip.origin */}
                <Image style={styles.backgroundImage} source={require("../assets/images/newyorkcity.jpg")}/>

                <Text>Total Spent: $$$</Text>

                {/* Bar showing how much someone spent */}
                <View style={styles.bar}>
                    <View style={{height: 25, backgroundColor: "red", width: "43%"}}></View>
                    <View style={{height: 25, backgroundColor: "lightblue", width: "23%"}}></View>
                    <View style={{height: 25, backgroundColor: "purple", width: "10%"}}></View>
                    <View style={{height: 25, backgroundColor: "orange", width: "3%"}}></View>
                    <View style={{height: 25, backgroundColor: "green", width: "1.4%"}}></View>
                </View>

                {/* Container showing how much someone spent in each category */}
                <View style={styles.totalSpentContainer}>
                    <Text>Hotels</Text>
                    <Text>Flights</Text>
                    <Text>Food</Text>
                    <Text>Things To Do</Text>
                    <Text>Other</Text>
                </View>

                {/* Add a payment history here */}
                <Text>History               [+]</Text>
                <ScrollView style={styles.historyContainer}>
                    {/* Will load this part through the database */}
                    <Text>Food</Text>
                    <Text>Food</Text>
                    <Text>Food</Text>
                    <Text>Food</Text>
                    <Text>Food</Text>
                    <Text>Food</Text>
                    <Text>Food</Text>
                    <Text>Food</Text>
                    <Text>Food</Text>
                    <Text>Food</Text>
                    <Text>Food</Text>
                    <Text>Food</Text>
                    <Text>Food</Text>
                    <Text>Food</Text>
                </ScrollView>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F4F4F4",
    },

    containerContent: {
        marginHorizontal: 20,
        marginTop: 50,
        marginBottom: 10,
        gap: 15
    },

    backgroundImage: {
        resizeMode: "cover",
        marginTop: 15,
        height: 200,
        width: "100%",
        borderRadius: 10,
    },

    totalSpentContainer: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: "white",
        borderRadius: 10,
        shadowColor: "#333333",
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },

    historyContainer: {
        flex: 1,
        backgroundColor: "white",
        height: 400,
        borderRadius: 10,
        shadowColor: "#333333",
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },

    bar: {
        flexDirection: "row",
        justifyContent: "flex-start",
        backgroundColor: "white",
        height: 25,
    }
});

export default BudgetManagerScreen;