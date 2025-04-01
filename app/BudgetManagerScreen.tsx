// BudgetManager.tsx
import { useRouter } from "expo-router";
import { View, StyleSheet, TextInput, Text, TouchableOpacity, Modal, TouchableWithoutFeedback, Image, ScrollView, FlatList } from "react-native";
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

    const [categories, setCategories] = useState([
        {
            label: "Hotel",
            totalPrice: 0,
            percentage: "",
            symbol: "",
            color: "",
        },

        {
            label: "Transportation",
            totalPrice: 0,
            percentage: "",
            symbol: "",
            color: "",
        },

        {
            label: "Food",
            totalPrice: 0,
            percentage: "",
            symbol: "",
            color: "",
        },

        {
            label: "Things To Do",
            totalPrice: 0,
            percentage: "",
            symbol: "",
            color: "",
        },

        {
            label: "Other",
            totalPrice: 0,
            percentage: "",
            symbol: "",
            color: "",
        }
    ]);

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

    useEffect(() => {
        let totalSpent = hotelBudget + transportationBudget + foodBudget + thingsToDoBudget + otherBudget;

        for (let category in categories) {
            if (categories[category].label == "Hotel") {
                categories[category].totalPrice = hotelBudget;
                categories[category].percentage = (Math.round((hotelBudget / totalSpent) * 100)).toString() + "%";
                categories[category].symbol = tags[0].symbol;
                categories[category].color = tags[0].color;
            }

            else if (categories[category].label == "Transportation") {
                categories[category].totalPrice = transportationBudget;
                categories[category].percentage = (Math.round((transportationBudget / totalSpent) * 100)).toString() + "%"
                categories[category].symbol = tags[1].symbol;
                categories[category].color = tags[1].color;
            }

            else if (categories[category].label == "Food") {
                categories[category].totalPrice = foodBudget;
                categories[category].percentage = (Math.round((foodBudget / totalSpent) * 100)).toString() + "%"
                categories[category].symbol = tags[2].symbol;
                categories[category].color = tags[2].color;
            }

            else if (categories[category].label == "Things To Do") {
                categories[category].totalPrice = thingsToDoBudget;
                categories[category].percentage = (Math.round((thingsToDoBudget / totalSpent) * 100)).toString() + "%"
                categories[category].symbol = tags[3].symbol;
                categories[category].color = tags[3].color;
            }

            else if (categories[category].label == "Other") {
                categories[category].totalPrice = otherBudget;
                categories[category].percentage = (Math.round((otherBudget / totalSpent) * 100)).toString() + "%"
                categories[category].symbol = tags[4].symbol;
                categories[category].color = tags[4].color;
            }
        }

        const sortedData = categories.sort((a, b) => b.totalPrice - a.totalPrice);

        setTotalBudget(totalSpent);
        setCategories(sortedData);
    }, [hotelBudget, transportationBudget, foodBudget, thingsToDoBudget, otherBudget])

    // add to history
    const addHistory = async () => {

        if (expenseLabel != "" && expensePrice != "" && expensePrice != "" && expenseTag != "") {
            // date
            const currentDate = new Date();
            //const formattedDate = moment(currentDate).format('MMMM DD, YYYY');
            let formatNumber = parseFloat(expensePrice).toFixed(2);
            console.log("Format number: " + formatNumber)
            const createExpense = await createHistory(expenseTag, formatNumber, expenseLabel, null);

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
        getHistoriesByTag();

        return updatedHistory.reverse();
    }

    const deleteExpense = async (id: string) => {
        const del = await deleteHistory(id);

        if (del) {
            const newHistory = await updateHistory();

            let totalExpense = hotelBudget + transportationBudget + foodBudget + thingsToDoBudget + otherBudget;
            setTotalBudget(totalExpense)

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

    const getCategoryTotal = () => {

        for (const category of categories) {
            if (category.label === selectedCategory) {
                return category.totalPrice.toFixed(2);
            }
        }
        return null;
    }

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
        <View style={[styles.hiddenItem, { height: 130 }]}>
            <TouchableOpacity style={[styles.deleteButton, { width: Math.abs(rightOpenValue) }]} onPressIn={() => { deleteExpense(item.id) }}>
                <Ionicons name="trash-bin" size={25} color={"white"} />
            </TouchableOpacity>
        </View>
    );

    const renderItem = ({ item }: any) => {
        const isSwiped = swipeStatus[item.key];
        return (
            <View style={[styles.hotelSection, { borderColor: '#F4F4F4', borderBottomWidth: 1, borderTopWidth: 1, backgroundColor: "white", width: "100%" }]}>
                <View style={styles.hotelLabel}>
                    {(() => {
                        switch (item.tag) {
                            case 'Hotel':
                                return <MaterialIcons name="hotel" color={"#FF6347"} size={22} />;
                            case 'Transportation':
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
                    <View style={{ flexDirection: "column"}}>
                        <Text style={{ color: "gray" }}>{moment(item.date).format('MMMM DD, YYYY')}</Text>
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

                {/* Bar showing how much someone spent */}
                <View style={styles.bar}>
                    {categories.map((category) => (
                        <View style={{ height: 30, backgroundColor: category.color, width: category.percentage }}></View>
                    ))}
                </View>

                {/* Container showing how much someone spent in each category */}
                <View style={styles.totalSpentContainer}>
                    {categories.map((category, index) => (
                        category.label === "Transportation" || category.label === "Things To Do" ? (
                            <>
                                <TouchableOpacity style={[styles.hotelSection, { borderWidth: 1, borderColor: "#F4F4F4" }]} onPress={() => { setSelectedCategory(category.label); setCategoryVisible(true); }}>
                                    <View style={styles.hotelLabel}>
                                        <Ionicons name={category.symbol} color={category.color} size={20} />
                                        <Text style={{ fontSize: 18 }}>{category.label}</Text>
                                    </View>
                                    <Text style={{ fontSize: 18, color: "gray" }}>${category.totalPrice.toFixed(2)} ({category.percentage})</Text>
                                </TouchableOpacity>
                            </>

                        ) : (
                                <>
                                    <TouchableOpacity style={[styles.hotelSection, { borderWidth: 1, borderColor: "#F4F4F4" }]} onPress={() => { setSelectedCategory(category.label); setCategoryVisible(true); }}>
                                        <View style={styles.hotelLabel}>
                                            <MaterialIcons name={category.symbol} color={category.color} size={20} />
                                            <Text style={{ fontSize: 18 }}>{category.label}</Text>
                                        </View>
                                        <Text style={{ fontSize: 18, color: "gray" }}>${category.totalPrice.toFixed(2)} ({category.percentage})</Text>
                                    </TouchableOpacity>
                                </>
                            )
                    )
                    )}
                    <View style={styles.hotelSection}>
                        <Text style={{fontSize: 18, fontWeight: "700"}}>Total:</Text>
                        <Text style={{fontSize: 18, fontWeight: "700"}}>${totalBudget.toFixed(2)}</Text>
                    </View>
                </View>

                {/* Add a payment history here */}
                <View style={styles.historyView}>
                    <Text style={styles.textLabel}>History</Text>
                    <TouchableOpacity onPress={() => { setAddHistoryVisible(true) }}>
                        <Ionicons style={{ marginTop: 5 }} name="add-circle" size={25} color="#24a6ad" />
                    </TouchableOpacity>
                </View>

                <View style={[styles.divider, { marginTop: 0 }]}></View>

                <SwipeListView
                    data={budgetHistory.map((item, index) => ({ ...item, key: `${index}` }))}
                    renderItem={renderItem}
                    renderHiddenItem={(data, rowMap) => renderHiddenItem({ ...data, index: parseInt(data.item.key) })}
                    leftOpenValue={rightOpenValue}
                    rightOpenValue={rightOpenValue}
                    friction={60}
                    tension={30}
                    onSwipeValueChange={handleSwipeChange}
                    ListEmptyComponent={<Text style={{fontSize: 18, textAlign: "center"}}>No expenses found!</Text>}
                    style={styles.historyContainer}>
                </SwipeListView>
            </View>

            <Modal
                visible={isCategoryVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setCategoryVisible(false)}
            >
                <View style={[styles.modalOverlay, { justifyContent: "center" }]}>
                    <View style={{ width: "95%", height: 425, backgroundColor: "#F4F4F4", padding: 20, borderRadius: 10, gap: 10 }}>
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

                            <ScrollView style={{ width: "100%", height: 300, backgroundColor: "white", borderTopLeftRadius: 10, borderTopRightRadius: 10, padding: 10, marginTop: 10 }} contentContainerStyle={{ alignItems: "center" }}>
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
                                        <Text>No expenses found!</Text>
                                    )}
                            </ScrollView>
                            <View style={{flexDirection: "row", justifyContent: "space-between", padding: 10, backgroundColor: "white", borderTopWidth: 1, borderTopColor: "lightgray", borderBottomLeftRadius: 10, borderBottomRightRadius: 10}}>
                                <Text style={{fontSize: 18, fontWeight: "700"}}>Total:</Text>
                                <Text style={{fontSize: 18, fontWeight: "700"}}>${getCategoryTotal()}</Text>
                            </View>
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
    },

    hotelSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
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
        height: 30,
        marginBottom: 10
    },

    textLabel: {
        fontWeight: "700",
        fontSize: 18,
        marginTop: 10
    },

    divider: {
        height: 1,
        backgroundColor: '#F4F4F4',
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
    },
});

export default BudgetManagerScreen;