// BudgetManager.tsx
import { useRouter } from "expo-router";
import { View, StyleSheet, TextInput, Text, TouchableOpacity, Modal, TouchableWithoutFeedback, Image, ScrollView } from "react-native";
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { getHistories, createHistory, deleteHistory } from '../scripts/databaseInteraction.js';
import { getData, storeData, fillLocal } from '../scripts/localStore';
import { Dropdown } from 'react-native-element-dropdown';
import moment from 'moment';
import { SwipeListView } from 'react-native-swipe-list-view';

const BudgetManagerScreen = () => {
    const navigation = useNavigation();

    const [budgetHistory, setBudgetHistory] = useState<any[]>([]);
    const [hotelBudget, setHotelBudget] = useState(0);
    const [transportationBudget, setTransportationBudget] = useState(0);
    const [foodBudget, setFoodBudget] = useState(0);
    const [thingsToDoBudget, setThingsToDoBudget] = useState(0);
    const [otherBudget, setOtherBudget] = useState(0);
    const [totalBudget, setTotalBudget] = useState(0);

    // Add to history params
    const [expenseTag, setExpenseTag] = useState("");
    const [expensePrice, setExpensePrice] = useState("");
    const [expenseLabel, setExpenseLabel] = useState("");

    const [isAddHistoryVisible, setAddHistoryVisible] = useState(false);
    const [isCategoryVisible, setCategoryVisible] = useState(false)

    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedCategoryList, setSelectedCategoryList] = useState<any[]>([]);
    const [selectedTag, setSelectedTag] = useState({
        label: "",
        symbol: "",
        color: "",
        value: "",
    });

    // Remane "flight" to "Transportation"
    const [value, setValue] = useState(null);
    const tags = [
        { label: 'Hotel', symbol: 'hotel', color: '#FF6347', value: '1' },
        { label: 'Transportation', symbol: 'airplane', color: 'skyblue', value: '2' },
        { label: 'Food', symbol: 'local-dining', color: '#FFD700', value: '3' },
        { label: 'Things To Do', symbol: 'location', color: 'green', value: '4' },
        { label: 'Other', symbol: 'more-horiz', color: '#800080', value: '5' },
    ];

    // Load history when the component mounts
    useEffect(() => {
        let hotelExpense = 0;
        let transportExpense = 0;
        let foodExpense = 0;
        let thingsToDoExpense = 0;
        let otherExpense = 0;

        const loadHistory = async () => {
            // Get the list of trip IDs from local storage
            const historyIds = await getData("history");
            if (historyIds && historyIds.length > 0) {
                const loadedHistory = [];

                // Loop through each history ID and fetch the history details from local storage
                for (const historyId of historyIds) {
                    loadedHistory.unshift({
                        id: historyId.id,
                        tag: historyId.tag,
                        value: historyId.value,
                        description: historyId.description,
                        date: historyId.date
                    });

                    switch (historyId.tag) {
                        case 'Hotel':
                            hotelExpense += parseFloat(historyId.value);
                            setHotelBudget(hotelExpense);
                            break;
                        case 'Transportation':
                            transportExpense += parseFloat(historyId.value);
                            setTransportationBudget(transportExpense);
                            break;
                        case 'Food':
                            foodExpense += parseFloat(historyId.value);
                            setFoodBudget(foodExpense);
                            break;
                        case 'Things To Do':
                            thingsToDoExpense += parseFloat(historyId.value);
                            setThingsToDoBudget(thingsToDoExpense);
                            break;
                        case 'Other':
                            otherExpense += parseFloat(historyId.value);
                            setOtherBudget(otherExpense);
                            break;
                        default:
                            break;
                    }
                }

                let totalExpense = hotelBudget + transportationBudget + foodBudget + thingsToDoBudget + otherBudget;
                setTotalBudget(totalExpense)
                setBudgetHistory(loadedHistory);
            } else {
                console.log("No history available in local storage.");
            }
        };
        loadHistory();
    }, []);

    useEffect(() => {
        getHistoriesByTag();
    }, [selectedCategory]);

    // add to history
    const addHistory = async () => {

        if (expenseLabel != "" && expensePrice != "" && expensePrice != "" && expenseTag != "") {
            // date
            const currentDate = new Date();
            //const formattedDate = moment(currentDate).format('MMMM DD, YYYY');
            let formatNumber = parseFloat(expensePrice).toFixed(2);
            console.log("Format number: " + formatNumber)
            const createExpense = await createHistory(expenseTag, formatNumber, expenseLabel);

            if (!createExpense) {
                console.error("Failed to create expense!");
            } else {
                const historyReverse = await updateHistory();
                setBudgetHistory(historyReverse);
                resetHistory();
            }
        } else {
            console.error("Expense report failed");
        }
    }

    // cancels the creation of a history
    const resetHistory = () => {
        setAddHistoryVisible(false);
        setValue(null);

        setExpenseTag("");
        setExpenseLabel("");
        setExpensePrice("");
    }

    const updateHistory = async () => {
        const updatedHistory = await getData("history");

        // Recalculate the totals after adding the new expense
        let newHotelBudget = 0;
        let newTransportationBudget = 0;
        let newFoodBudget = 0;
        let newThingsToDoBudget = 0;
        let newOtherBudget = 0;

        updatedHistory.forEach((history: { tag: any; value: string; }) => {
            switch (history.tag) {
                case 'Hotel':
                    newHotelBudget += parseFloat(history.value);
                    break;
                case 'Transportation':
                    newTransportationBudget += parseFloat(history.value);
                    break;
                case 'Food':
                    newFoodBudget += parseFloat(history.value);
                    break;
                case 'Things To Do':
                    newThingsToDoBudget += parseFloat(history.value);
                    break;
                case 'Other':
                    newOtherBudget += parseFloat(history.value);
                    break;
                default:
                    break;
            }
        });

        // Update the states for each category
        setHotelBudget(newHotelBudget);
        setTransportationBudget(newTransportationBudget);
        setFoodBudget(newFoodBudget);
        setThingsToDoBudget(newThingsToDoBudget);
        setOtherBudget(newOtherBudget);

        return updatedHistory.reverse();
    }

    const deleteExpense = async (id: string) => {
        const del = await deleteHistory(id);

        if (del) {
            const newHistory = await updateHistory()
            setBudgetHistory(newHistory);
        }
    }

    // gets history given tag
    const getHistoriesByTag = () => {
        const categoryHistory = [];

        // rename flight to Transportation
        for (const expense of budgetHistory) {
            console.log("Expense tag: " + expense.tag + "; selectedTag: " + selectedCategory)
            if (expense.tag == selectedCategory) {
                categoryHistory.push(expense);
            }
        }



        setSelectedCategoryList(categoryHistory);

        for (const tag of tags) {
            if (tag.label === selectedCategory) {
                setSelectedTag(tag);
                break;
            }
        }
    };

    // Swipable List components
    const [swipeStatus, setSwipeStatus] = useState<{ [key: string]: boolean }>({});

    // Function to handle swipe state
    const handleSwipeChange = (swipeData: any) => {
        const { key, value } = swipeData;
        if (value !== 0) {
            // If swiping, remove border radius
            setSwipeStatus((prevState) => ({ ...prevState, [key]: true }));
        } else {
            // If swipe is reset, restore border radius
            setSwipeStatus((prevState) => ({ ...prevState, [key]: false }));
        }
    };

    const renderHiddenItem = ({ item, index }: { item: any; index: number }) => (
        <View style={[styles.hiddenItem, { height: 140 }]}>
            <TouchableOpacity style={[styles.deleteButton, { width: Math.abs(rightOpenValue) }]} onPressIn={() => { deleteExpense(item.id) }}>
                <Ionicons name="trash-bin" size={25} color={"white"} />
            </TouchableOpacity>
        </View>
    );

    const renderItem = ({ item }: any) => {
        const isSwiped = swipeStatus[item.key];
        return (
            <View style={[styles.hotelSection, { borderColor: '#ccc', borderBottomWidth: 1, backgroundColor: "white", width: "100%", padding: 5 }]}>
                <View style={styles.hotelLabel}>
                    {(() => {
                        switch (item.tag) {
                            case 'Hotel':
                                return <MaterialIcons name="hotel" color={"#FF6347"} size={22} />;
                            case 'flight':
                                return <Ionicons name="airplane" color={"skyblue"} size={22} />;
                            case 'Food':
                                return <MaterialIcons name="local-dining" color={"#FFD700"} size={22} />;
                            case 'Things To Do':
                                return <Ionicons name="location" color={"green"} size={22} />;
                            case 'Other':
                                return <MaterialIcons name="more-horiz" color={"#800080"} size={22} />;
                            default:
                                return <MaterialIcons name="help" color={"gray"} size={22} />;
                        }
                    })()}
                    <View style={{ flexDirection: "column", marginBottom: 10 }}>
                        <Text style={{ color: "gray", marginTop: 5 }}>{moment(item.date).format('MMMM DD, YYYY')}</Text>
                        <Text style={{ fontSize: 18 }}>{item.description}</Text>
                    </View>
                </View>
                <Text style={{ fontSize: 18, color: "#24a6ad", fontWeight: "700" }}>${item.value}</Text>
            </View>
        );
    }

    const rightOpenValue = -150 / 2;

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
                    <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>#trip.origin/destination#</Text>
                    <Text style={{ color: "white", fontSize: 16 }}>Initial Budget: $#budget#</Text>
                    <Text style={{ color: "white", fontSize: 16 }}>Remaining: $#remainingBudget#</Text>
                </View>

                {/* Calculate this */}
                <Text style={{ fontWeight: "700", fontSize: 18, marginTop: 10 }}>Summary</Text>
                <View style={[styles.divider, { marginTop: 0 }]}></View>
                <Text>Total Spent: ${totalBudget}</Text>

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
                    <TouchableOpacity style={styles.hotelSection} onPress={() => { setSelectedCategory("Hotel"); setCategoryVisible(true); }}>
                        <View style={styles.hotelLabel}>
                            <MaterialIcons name={"hotel"} color={"#FF6347"} size={20} />
                            <Text style={{ fontSize: 18 }}>Hotels</Text>
                        </View>
                        <Text style={{ fontSize: 18, color: "gray" }}>${hotelBudget}</Text>
                    </TouchableOpacity>

                    <View style={styles.divider}></View>

                    <TouchableOpacity style={styles.hotelSection} onPress={() => { setSelectedCategory("Transportation"); setCategoryVisible(true); }}>
                        <View style={styles.hotelLabel}>
                            <Ionicons name={"airplane"} color={"skyblue"} size={20} />
                            <Text style={{ fontSize: 18 }}>Transportation</Text>
                        </View>
                        <Text style={{ fontSize: 18, color: "gray" }}>${transportationBudget}</Text>
                    </TouchableOpacity>

                    <View style={styles.divider}></View>

                    <TouchableOpacity style={styles.hotelSection} onPress={() => { setSelectedCategory("Food"); setCategoryVisible(true); }}>
                        <View style={styles.hotelLabel}>
                            <MaterialIcons name={"local-dining"} color={"#FFD700"} size={20} />
                            <Text style={{ fontSize: 18 }}>Food</Text>
                        </View>
                        <Text style={{ fontSize: 18, color: "gray" }}>${foodBudget}</Text>
                    </TouchableOpacity>

                    <View style={styles.divider}></View>

                    <TouchableOpacity style={styles.hotelSection} onPress={() => { setSelectedCategory("Things To Do"); setCategoryVisible(true); }}>
                        <View style={styles.hotelLabel}>
                            <Ionicons name={"location"} color={"green"} size={20} />
                            <Text style={{ fontSize: 18 }}>Things To Do</Text>
                        </View>
                        <Text style={{ fontSize: 18, color: "gray" }}>${thingsToDoBudget}</Text>
                    </TouchableOpacity>

                    <View style={styles.divider}></View>

                    <TouchableOpacity style={styles.hotelSection} onPress={() => { setSelectedCategory("Other"); setCategoryVisible(true); }}>
                        <View style={styles.hotelLabel}>
                            <MaterialIcons name={"more-horiz"} color={"#800080"} size={20} />
                            <Text style={{ fontSize: 18 }}>Other</Text>
                        </View>
                        <Text style={{ fontSize: 18, color: "gray" }}>${otherBudget}</Text>
                    </TouchableOpacity>
                </View>

                {/* Add a payment history here */}
                <View style={styles.historyView}>
                    <Text style={styles.textLabel}>History</Text>
                    <TouchableOpacity onPress={() => { setAddHistoryVisible(true) }}>
                        <Ionicons style={{ marginTop: 5 }} name="add-circle" size={25} color="#24a6ad" />
                    </TouchableOpacity>
                </View>

                <View style={[styles.divider, { marginTop: 0 }]}></View>

                <ScrollView style={styles.historyContainer} contentContainerStyle={{ alignItems: "center" }}>
                    {/* Will load this part through the database */}
                    {budgetHistory.length > 0 ? (
                        <SwipeListView
                            data={budgetHistory.map((item, index) => ({ ...item, key: `${index}` }))}
                            renderItem={renderItem}
                            renderHiddenItem={(data, rowMap) => renderHiddenItem({ ...data, index: parseInt(data.item.key) })}
                            leftOpenValue={rightOpenValue}
                            rightOpenValue={rightOpenValue}
                            friction={60}
                            tension={30}
                            onSwipeValueChange={handleSwipeChange}>
                        </SwipeListView>
                    ) : (
                            <Text>No expenses found!</Text>
                        )}

                </ScrollView>
            </View>

            <Modal
                visible={isCategoryVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setCategoryVisible(false)}
            >
                <View style={[styles.modalOverlay, { justifyContent: "center" }]}>
                    <View style={{ width: "95%", height: 400, backgroundColor: "#F4F4F4", padding: 20, borderRadius: 10, gap: 10 }}>
                        <View style={{ flexDirection: "column" }}>
                            <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: 10 }}>
                                    {(() => {
                                        switch (selectedTag.label) {
                                            case 'Hotel':
                                                return <MaterialIcons name="hotel" color={"#FF6347"} size={28} />;
                                            case 'Transportation':
                                                return <Ionicons name="airplane" color={"skyblue"} size={28} />;
                                            case 'Food':
                                                return <MaterialIcons name="local-dining" color={"#FFD700"} size={28} />;
                                            case 'Things To Do':
                                                return <Ionicons name="location" color={"green"} size={28} />;
                                            case 'Other':
                                                return <MaterialIcons name="more-horiz" color={"#800080"} size={28} />;
                                            default:
                                                return <MaterialIcons name="help" color={"gray"} size={28} />;
                                        }
                                    })()}
                                    <Text style={{ fontSize: 20, fontWeight: "700" }}>{selectedTag.label}</Text>
                                </View>
                                <TouchableOpacity onPress={() => setCategoryVisible(false)}>
                                    <MaterialCommunityIcons name={"close-box"} size={22} color={"red"} />
                                </TouchableOpacity>
                            </View>

                            <ScrollView style={{ width: "100%", height: 300, backgroundColor: "white", borderRadius: 10, padding: 10, marginTop: 10 }} contentContainerStyle={{ alignItems: "center" }}>
                                {selectedCategoryList.length > 0 ? (
                                    selectedCategoryList.map((expense) => (
                                        <View style={{ flexDirection: "column", alignItems: "center", width: "100%" }}>
                                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                                                <View style={{ flexDirection: "column" }}>
                                                    <Text style={{ color: "gray", fontSize: 14 }}>{moment(expense.date).format('MMMM DD, YYYY')}</Text>
                                                    <Text style={{ fontSize: 16 }}>{expense.description}</Text>
                                                </View>
                                                <Text style={{ fontSize: 16, color: "#24a6ad", fontWeight: "700" }}>${expense.value}</Text>
                                            </View>

                                            <View style={styles.divider}></View>
                                        </View>
                                    ))
                                ) : (
                                        <Text>No available expenses for this category!</Text>
                                    )}
                            </ScrollView>
                        </View>
                    </View>
                </View>

            </Modal>

            <Modal
                visible={isAddHistoryVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setAddHistoryVisible(false)}
            >
                <View style={[styles.modalOverlay, { justifyContent: "center" }]}>
                    <View style={{ width: "95%", height: 220, backgroundColor: "#F4F4F4", padding: 20, borderRadius: 10, gap: 10 }}>
                        <Text style={[styles.textLabel, { marginTop: 0 }]}>Add History</Text>

                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            data={tags}
                            maxHeight={200}
                            labelField="label"
                            valueField="value"
                            placeholder="Select tag..."
                            value={value}
                            onChange={item => {
                                setExpenseTag(item.label)
                                setValue(item.value);
                            }}
                            renderLeftIcon={() => {
                                // Dynamically render the icon based on the 'symbol' value
                                const tag = tags[(value as unknown as number) - 1];
                                if (tag) {
                                    // Use the correct icon component based on the symbol
                                    if (tag.symbol === 'hotel') {
                                        return <MaterialIcons name="hotel" size={20} color={tag.color} style={{ marginRight: 5 }} />;
                                    } else if (tag.symbol === 'airplane') {
                                        return <Ionicons name="airplane" size={20} color={tag.color} style={{ marginRight: 5 }} />;
                                    } else if (tag.symbol === 'local-dining') {
                                        return <MaterialIcons name="local-dining" size={20} color={tag.color} style={{ marginRight: 5 }} />;
                                    } else if (tag.symbol === 'location') {
                                        return <Ionicons name="location" size={20} color={tag.color} style={{ marginRight: 5 }} />;
                                    } else if (tag.symbol === 'more-horiz') {
                                        return <MaterialIcons name="more-horiz" size={20} color={tag.color} style={{ marginRight: 5 }} />;
                                    }
                                }

                                return null; // Default case if no match is found
                            }}
                        />

                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            gap: 5
                        }}>
                            <TextInput value={expenseLabel} onChangeText={text => setExpenseLabel(text)} placeholder="Name" placeholderTextColor="lightgray" style={{
                                height: 40,
                                fontSize: 16,
                                width: "65%",
                                backgroundColor: "white",
                                borderRadius: 10,
                                padding: 10,
                                shadowColor: "lightgray",
                                shadowOffset: { width: 1, height: 2 },
                                shadowOpacity: 0.3,
                                shadowRadius: 3,
                            }}></TextInput>

                            <TextInput value={expensePrice} onChangeText={text => setExpensePrice(text)} keyboardType="numeric" style={{
                                height: 40,
                                fontSize: 16,
                                width: "30%",
                                backgroundColor: "white",
                                borderRadius: 10,
                                padding: 10,
                                shadowColor: "lightgray",
                                shadowOffset: { width: 1, height: 2 },
                                shadowOpacity: 0.3,
                                shadowRadius: 3,
                            }}></TextInput>
                        </View>

                        <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 15, gap: 30 }}>
                            <TouchableOpacity onPress={resetHistory} style={{
                                backgroundColor: "red",
                                height: 35,
                                width: 70,
                                alignItems: "center",
                                justifyContent: "center",
                                shadowColor: "#333333",
                                shadowOffset: { width: 1, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 3,
                                borderRadius: 10
                            }}>
                                <Text style={{ fontSize: 12, color: "white", fontWeight: "700" }}>CANCEL</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => { addHistory() }} style={{
                                backgroundColor: "green",
                                height: 35,
                                width: 70,
                                alignItems: "center",
                                justifyContent: "center",
                                shadowColor: "#333333",
                                shadowOffset: { width: 1, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 3,
                                borderRadius: 10
                            }}>
                                <Text style={{ fontSize: 12, color: "white", fontWeight: "700" }}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

            </Modal>
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
        gap: 10,
    },

    historyView: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    historyContainer: {
        flex: 1,
        backgroundColor: "white",
        height: 500,
        borderRadius: 10,
        shadowColor: "#333333",
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        padding: 10,
        marginBottom: 10,
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

    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },

    dropdown: {
        height: 40,
        backgroundColor: "white",
        borderBottomColor: 'lightgray',
        borderBottomWidth: 0.5,
        borderRadius: 10,
        padding: 10
    },

    placeholderStyle: {
        fontSize: 16,
    },

    hiddenItem: {
        backgroundColor: "#F4F4F4",
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-end",
        borderRadius: 10,
        width: "100%",
    },

    deleteButton: {
        backgroundColor: "red",
        height: "100%",
        paddingHorizontal: 15,
        justifyContent: "center",
        alignItems: "center",
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    },
});

export default BudgetManagerScreen;