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
                <Image style={styles.backgroundImage} source={require("../assets/images/newyorkcity.jpg")} />
                <View style={styles.darkOverlay}>
                    <Text style={{color: "white", fontSize: 18, fontWeight: "bold"}}>#trip.origin/destination#</Text>
                    <Text style={{color: "white", fontSize: 16}}>Initial Budget: $#budget#</Text>
                    <Text style={{color: "white", fontSize: 16}}>Remaining: $#remainingBudget#</Text>
                </View>

                {/* Calculate this */}
                <Text style={{fontWeight: "700", fontSize: 18, marginTop: 10}}>Summary</Text>
                <View style={[styles.divider, {marginTop: 0}]}></View>
                <Text>Total Spent: $188.91</Text>

                {/* Bar showing how much someone spent */}
                <View style={styles.bar}>
                    <View style={{ height: 25, backgroundColor: "#FF6347", width: "43%", borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}></View>
                    <View style={{ height: 25, backgroundColor: "skyblue", width: "33%" }}></View>
                    <View style={{ height: 25, backgroundColor: "#FFD700", width: "15%" }}></View>
                    <View style={{ height: 25, backgroundColor: "green", width: "7%" }}></View>
                    <View style={{ height: 25, backgroundColor: "#800080", width: "2%", borderTopRightRadius: 10, borderBottomRightRadius: 10 }}></View>
                </View>

                {/* Container showing how much someone spent in each category */}
                <View style={styles.totalSpentContainer}>
                    <TouchableOpacity style={styles.hotelSection}>
                        <View style={styles.hotelLabel}>
                            <MaterialIcons name={"hotel"} color={"#FF6347"} size={20} />
                            <Text style={{ fontSize: 18 }}>Hotels</Text>
                        </View>
                        <Text style={{ fontSize: 18, color: "gray" }}>N/A</Text>
                    </TouchableOpacity>

                    <View style={styles.divider}></View>

                    <TouchableOpacity style={styles.hotelSection}>
                        <View style={styles.hotelLabel}>
                            <Ionicons name={"airplane"} color={"skyblue"} size={20} />
                            <Text style={{ fontSize: 18 }}>Transportation</Text>
                        </View>
                        <Text style={{ fontSize: 18, color: "gray" }}>N/A</Text>
                    </TouchableOpacity>

                    <View style={styles.divider}></View>

                    <TouchableOpacity style={styles.hotelSection}>
                        <View style={styles.hotelLabel}>
                            <MaterialIcons name={"local-dining"} color={"#FFD700"} size={20} />
                            <Text style={{ fontSize: 18 }}>Food</Text>
                        </View>
                        <Text style={{ fontSize: 18, color: "gray" }}>N/A</Text>
                    </TouchableOpacity>

                    <View style={styles.divider}></View>

                    <TouchableOpacity style={styles.hotelSection}>
                        <View style={styles.hotelLabel}>
                            <Ionicons name={"location"} color={"green"} size={20} />
                            <Text style={{ fontSize: 18 }}>Things To Do</Text>
                        </View>
                        <Text style={{ fontSize: 18, color: "gray" }}>N/A</Text>
                    </TouchableOpacity>

                    <View style={styles.divider}></View>

                    <TouchableOpacity style={styles.hotelSection}>
                        <View style={styles.hotelLabel}>
                            <MaterialIcons name={"more-horiz"} color={"#800080"} size={20} />
                            <Text style={{ fontSize: 18 }}>Other</Text>
                        </View>
                        <Text style={{ fontSize: 18, color: "gray" }}>N/A</Text>
                    </TouchableOpacity>
                </View>

                {/* Add a payment history here */}
                <View style={styles.historyView}>
                    <Text style={styles.textLabel}>History</Text>
                    <TouchableOpacity onPress={() => { }}>
                        <Ionicons style={{marginTop: 5}} name="add-circle" size={25} color="#24a6ad" />
                    </TouchableOpacity>
                </View>

                <View style={[styles.divider, {marginTop: 0}]}></View>

                <ScrollView style={styles.historyContainer}>
                    {/* Will load this part through the database */}
                    <View style={styles.hotelSection}>
                        <View style={styles.hotelLabel}>
                        <MaterialIcons name={"more-horiz"} color={"#800080"} size={22} />
                            <View style={{flexDirection: "column"}}>
                                <Text style={{color: "gray"}}>March 16, 2025</Text>
                                <Text style={{ fontSize: 18 }}>bag</Text>
                            </View>
                        </View>
                        <Text style={{ fontSize: 18, color: "#24a6ad" }}>-$40.21</Text>
                    </View>

                    <View style={styles.divider}></View>

                    <View style={styles.hotelSection}>
                        <View style={styles.hotelLabel}>
                        <MaterialIcons name={"more-horiz"} color={"#800080"} size={22} />
                            <View style={{flexDirection: "column"}}>
                                <Text style={{color: "gray"}}>March 16, 2025</Text>
                                <Text style={{ fontSize: 18 }}>Shoppin'</Text>
                            </View>
                        </View>
                        <Text style={{ fontSize: 18, color: "#24a6ad" }}>-$40.21</Text>
                    </View>

                    <View style={styles.divider}></View>

                    <View style={styles.hotelSection}>
                        <View style={styles.hotelLabel}>
                            <Ionicons name={"location"} color={"green"} size={22} />
                            <View style={{flexDirection: "column"}}>
                                <Text style={{color: "gray"}}>March 16, 2025</Text>
                                <Text style={{ fontSize: 18 }}>MoMA tickets</Text>
                            </View>
                        </View>
                        <Text style={{ fontSize: 18, color: "#24a6ad" }}>-$20.11</Text>
                    </View>

                    <View style={styles.divider}></View>

                    <View style={styles.hotelSection}>
                        <View style={styles.hotelLabel}>
                            <Ionicons name={"location"} color={"green"} size={22} />
                            <View style={{flexDirection: "column"}}>
                                <Text style={{color: "gray"}}>March 15, 2025</Text>
                                <Text style={{ fontSize: 18 }}>Empire State building</Text>
                            </View>
                        </View>
                        <Text style={{ fontSize: 18, color: "#24a6ad" }}>-$34.40</Text>
                    </View>

                    <View style={styles.divider}></View>

                    <View style={styles.hotelSection}>
                        <View style={styles.hotelLabel}>
                            <Ionicons name={"fast-food"} color={"#FFD700"} size={22} />
                            <View style={{flexDirection: "column"}}>
                                <Text style={{color: "gray"}}>March 15, 2025</Text>
                                <Text style={{ fontSize: 18 }}>New York style pizza</Text>
                            </View>
                        </View>
                        <Text style={{ fontSize: 18, color: "#24a6ad" }}>-$53.98</Text>
                    </View>

                    <View style={styles.divider}></View>
                    
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
    },

    backgroundImage: {
        resizeMode: "cover",
        height: 200,
        width: "100%",
        borderRadius: 10,
        marginTop: 10
    },

    darkOverlay: {
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: 10,
        position: "absolute",
        marginTop: 36,
        width: "100%",
        height: 200,
        borderRadius: 10,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
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
        padding: 10,
        marginBottom: 10
    },

    hotelSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 5
    },

    hotelLabel: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 10
    },

    historyView: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    historyContainer: {
        flex: 1,
        overflow: 'visible',
        backgroundColor: "white",
        height: 500,
        borderRadius: 10,
        shadowColor: "#333333",
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        padding: 10,
        marginBottom: 10
    },

    bar: {
        flexDirection: "row",
        justifyContent: "flex-start",
        backgroundColor: "white",
        height: 25,
        borderRadius: 10,
        marginBottom: 10
    },

    textLabel: {
        fontWeight: "700",
        fontSize: 18,
        marginTop: 10
    },

    divider: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 10,
        width: "100%"
    },
});

export default BudgetManagerScreen;