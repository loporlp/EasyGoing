// BudgetManager.tsx
import { router, useFocusEffect, useRouter } from "expo-router";
import { View, StyleSheet, TextInput, Text, TouchableOpacity, Modal, TouchableWithoutFeedback, Image, ScrollView, FlatList } from "react-native";
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { getHistories, createHistory, deleteHistory } from '../scripts/databaseInteraction.js';
import { getData, storeData, fillLocal } from '../scripts/localStore';
import { Dropdown } from 'react-native-element-dropdown';
import moment from 'moment';
import { SwipeListView } from 'react-native-swipe-list-view';
import { navigate } from "expo-router/build/global-state/routing";
import { useCallback } from 'react';

const BudgetManagerScreen = () => {
    interface Trip {
        budget: string;
        origin: string;
        tripName: string;
        tripEndDate: string;
        destinations: any[];
        tripStartDate: string;
    }

    const navigation = useNavigation();
    const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
    const [budgetHistory, setBudgetHistory] = useState<any[]>([]);
    const [hotelBudget, setHotelBudget] = useState(0);
    const [transportationBudget, setTransportationBudget] = useState(0);
    const [foodBudget, setFoodBudget] = useState(0);
    const [thingsToDoBudget, setThingsToDoBudget] = useState(0);
    const [otherBudget, setOtherBudget] = useState(0);
    const [totalBudget, setTotalBudget] = useState(0);
    const [currentTripID, setCurrentTripID] = useState(0);
    const [updatedExpenses, setUpdatedExpenses] = useState(0);

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

    const loadHistory = async () => {

        let hotelExpense = 0;
        let transportExpense = 0;
        let foodExpense = 0;
        let thingsToDoExpense = 0;
        let otherExpense = 0;

        var current = await getData("currentTrip");
        setCurrentTripID(parseInt(current));
        console.log("CURRENT ID IS: ", current);

        // Get the list of trip IDs from local storage
        const [tripDetails, historyIds] = await Promise.all([
            getData(current.toString()),
            getData(`history ${current}`)
        ]);

        if (tripDetails) {
            setCurrentTrip(tripDetails);
        }

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

    // Load history when the component mounts
    useEffect(() => {
        loadHistory();
        console.log(JSON.stringify(currentTrip));
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadHistory(); // or updateHistory()
        }, [])
    );

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
        resetHistory();
        setAddHistoryVisible(false);

        if (expenseLabel !== "" && expensePrice !== "" && expenseTag !== "") {
            // date
            const currentDate = new Date();
            let formatNumber = parseFloat(expensePrice).toFixed(2);
            console.log("Format number: " + formatNumber);

            const createExpense = await createHistory(expenseTag, formatNumber, expenseLabel, null, currentTripID);

            if (!createExpense) {
                console.error("Failed to create expense!");
            } else {
                // Complete refresh of data after adding expense
                await loadAndSetHistory();

                // Force update of category information
                updateCategoryTotals();
            }
        } else {
            console.error("Expense report failed");
        }
    };

    const updateCategoryTotals = () => {
        let totalSpent = hotelBudget + transportationBudget + foodBudget + thingsToDoBudget + otherBudget;

        // Create a copy of categories to modify
        const updatedCategories = [...categories];

        for (let i = 0; i < updatedCategories.length; i++) {
            const category = updatedCategories[i];

            if (category.label === "Hotel") {
                category.totalPrice = hotelBudget;
                category.percentage = totalSpent > 0 ?
                    (Math.round((hotelBudget / totalSpent) * 100)).toString() + "%" : "0%";
                category.symbol = tags[0].symbol;
                category.color = tags[0].color;
            }
            else if (category.label === "Transportation") {
                category.totalPrice = transportationBudget;
                category.percentage = totalSpent > 0 ?
                    (Math.round((transportationBudget / totalSpent) * 100)).toString() + "%" : "0%";
                category.symbol = tags[1].symbol;
                category.color = tags[1].color;
            }
            else if (category.label === "Food") {
                category.totalPrice = foodBudget;
                category.percentage = totalSpent > 0 ?
                    (Math.round((foodBudget / totalSpent) * 100)).toString() + "%" : "0%";
                category.symbol = tags[2].symbol;
                category.color = tags[2].color;
            }
            else if (category.label === "Things To Do") {
                category.totalPrice = thingsToDoBudget;
                category.percentage = totalSpent > 0 ?
                    (Math.round((thingsToDoBudget / totalSpent) * 100)).toString() + "%" : "0%";
                category.symbol = tags[3].symbol;
                category.color = tags[3].color;
            }
            else if (category.label === "Other") {
                category.totalPrice = otherBudget;
                category.percentage = totalSpent > 0 ?
                    (Math.round((otherBudget / totalSpent) * 100)).toString() + "%" : "0%";
                category.symbol = tags[4].symbol;
                category.color = tags[4].color;
            }
        }

        // Sort by total price and update the state
        const sortedData = updatedCategories.sort((a, b) => b.totalPrice - a.totalPrice);
        setTotalBudget(totalSpent);
        setCategories(sortedData);

        // Also update the selected category view if open
        if (selectedCategory) {
            getHistoriesByTag();
        }
    };

    // cancels the creation of a history
    const resetHistory = () => {
        setAddHistoryVisible(false);
        setValue(null);

        setExpenseTag("");
        setExpenseLabel("");
        setExpensePrice("");
    }

    const loadAndSetHistory = async () => {
        let hotelExpense = 0;
        let transportExpense = 0;
        let foodExpense = 0;
        let thingsToDoExpense = 0;
        let otherExpense = 0;

        const current = await getData("currentTrip");
        setCurrentTripID(parseInt(current));

        const [tripDetails, historyIds] = await Promise.all([
            getData(current.toString()),
            getData(`history ${current}`)
        ]);

        if (tripDetails) {
            setCurrentTrip(tripDetails);
        }

        if (historyIds && historyIds.length > 0) {
            const loadedHistory = [];

            for (const historyId of historyIds) {
                loadedHistory.unshift({
                    id: historyId.id,
                    tag: historyId.tag,
                    value: historyId.value,
                    description: historyId.description,
                    date: historyId.date
                });

                const value = parseFloat(historyId.value);

                switch (historyId.tag) {
                    case 'Hotel':
                        hotelExpense += value;
                        break;
                    case 'Transportation':
                        transportExpense += value;
                        break;
                    case 'Food':
                        foodExpense += value;
                        break;
                    case 'Things To Do':
                        thingsToDoExpense += value;
                        break;
                    case 'Other':
                        otherExpense += value;
                        break;
                    default:
                        break;
                }
            }

            // First update the budget history
            setBudgetHistory(loadedHistory);

            // Then update all category budgets
            setHotelBudget(hotelExpense);
            setTransportationBudget(transportExpense);
            setFoodBudget(foodExpense);
            setThingsToDoBudget(thingsToDoExpense);
            setOtherBudget(otherExpense);

            // After state updates, use setTimeout to ensure they're applied
            // before recalculating category totals
            setTimeout(() => {
                updateCategoryTotals();
            }, 0);
        } else {
            setBudgetHistory([]);
            setHotelBudget(0);
            setTransportationBudget(0);
            setFoodBudget(0);
            setThingsToDoBudget(0);
            setOtherBudget(0);
            setTotalBudget(0);
            setSelectedCategoryList([]);
            setCategories(categories.map(cat => ({ ...cat, totalPrice: 0, percentage: "0%" })));
            console.log("No history available.");
        }
    };


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

    const deleteExpense = async (id) => {
        const del = await deleteHistory(id);
    
        if (del) {
            // Complete refresh after deleting an expense
            await loadAndSetHistory();
        }
    };

    // gets history given tag
    const getHistoriesByTag = () => {
        if (!selectedCategory || !budgetHistory || budgetHistory.length === 0) {
            setSelectedCategoryList([]);
            return;
        }

        const categoryHistory = budgetHistory.filter(expense =>
            expense.tag === selectedCategory
        );

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
                    <View style={{ flexDirection: "column" }}>
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
        <View style={styles.container}>
            <SwipeListView
                data={budgetHistory.map((item, index) => ({ ...item, key: `${index}` }))}
                renderItem={renderItem}
                renderHiddenItem={(data, rowMap) => renderHiddenItem({ ...data, index: parseInt(data.item.key) })}
                leftOpenValue={rightOpenValue}
                rightOpenValue={rightOpenValue}
                friction={60}
                tension={30}
                onSwipeValueChange={handleSwipeChange}
                ListEmptyComponent={<Text style={{ fontSize: 18, textAlign: "center" }}>No expenses found!</Text>}
                ListHeaderComponent={
                    <View style={styles.containerContent}>
                        {/* Header */}
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                            <TouchableOpacity onPress={() => { navigation.goBack() }}>
                                <Ionicons name="arrow-back-outline" size={22} color={"black"} />
                            </TouchableOpacity>
                            <Text style={{ fontSize: 22, fontWeight: "700" }}>Budget Manager</Text>
                        </View>

                        {/* Banner */}
                        <Image style={styles.backgroundImage} source={require("../assets/images/newyorkcity.jpg")} />
                        <View style={styles.darkOverlay}>
                            <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>{currentTrip?.tripName || "Unamed Trip"}</Text>
                            <Text style={{ color: "white", fontSize: 16 }}>Initial Budget: ${currentTrip?.budget}</Text>
                            <Text style={{ color: "white", fontSize: 16 }}>Remaining: ${currentTrip?.budget - totalBudget}</Text>
                        </View>

                        {/* Summary */}
                        <Text style={{ fontWeight: "700", fontSize: 18, marginTop: 10 }}>Summary</Text>
                        <View style={[styles.divider, { marginTop: 0 }]}></View>

                        {/* Expense Bar */}
                        <View style={styles.bar}>
                            {categories.map((category, index) => (
                                <View key={index} style={{ height: 30, backgroundColor: category.color, width: category.percentage }} />
                            ))}
                        </View>

                        {/* Category Summary */}
                        <View style={styles.totalSpentContainer}>
                            {categories.map((category, index) => {
                                const isIonicon = category.label === "Transportation" || category.label === "Things To Do";
                                const IconComponent = isIonicon ? Ionicons : MaterialIcons;

                                return (
                                    <TouchableOpacity
                                        key={index}
                                        style={[styles.hotelSection, { borderWidth: 1, borderColor: "#F4F4F4" }]}
                                        onPress={() => { setSelectedCategory(category.label); setCategoryVisible(true); }}
                                    >
                                        <View style={styles.hotelLabel}>
                                            <IconComponent name={category.symbol} color={category.color} size={20} />
                                            <Text style={{ fontSize: 18 }}>{category.label}</Text>
                                        </View>
                                        <Text style={{ fontSize: 18, color: "gray" }}>
                                            ${category.totalPrice.toFixed(2)} ({category.percentage})
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                            <View style={styles.hotelSection}>
                                <Text style={{ fontSize: 18, fontWeight: "700" }}>Total:</Text>
                                <Text style={{ fontSize: 18, fontWeight: "700" }}>${totalBudget.toFixed(2)}</Text>
                            </View>
                        </View>

                        {/* History Header */}
                        <View style={styles.historyView}>
                            <Text style={styles.textLabel}>History</Text>
                            <TouchableOpacity onPress={() => { setAddHistoryVisible(true) }}>
                                <Ionicons style={{ marginTop: 5 }} name="add-circle" size={25} color="#24a6ad" />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.divider, { marginTop: 0 }]}></View>
                    </View>
                }
                contentContainerStyle={{ paddingBottom: 100 }}
                style={styles.historyContainer}
            />

            {/* Category Modal */}
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
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
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
                                    selectedCategoryList.map((expense, index) => (
                                        <View key={index} style={{ flexDirection: "column", alignItems: "center", width: "100%" }}>
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
                            <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 10, backgroundColor: "white", borderTopWidth: 1, borderTopColor: "lightgray", borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                                <Text style={{ fontSize: 18, fontWeight: "700" }}>Total:</Text>
                                <Text style={{ fontSize: 18, fontWeight: "700" }}>${getCategoryTotal()}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Add History Modal */}
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
                                const tag = tags[(value as unknown as number) - 1];
                                if (!tag) return null;
                                const iconProps = { size: 20, color: tag.color, style: { marginRight: 5 } };

                                switch (tag.symbol) {
                                    case 'hotel': return <MaterialIcons name="hotel" {...iconProps} />;
                                    case 'airplane': return <Ionicons name="airplane" {...iconProps} />;
                                    case 'local-dining': return <MaterialIcons name="local-dining" {...iconProps} />;
                                    case 'location': return <Ionicons name="location" {...iconProps} />;
                                    case 'more-horiz': return <MaterialIcons name="more-horiz" {...iconProps} />;
                                    default: return null;
                                }
                            }}
                        />

                        <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 5 }}>
                            <TextInput value={expenseLabel} onChangeText={setExpenseLabel} placeholder="Name" placeholderTextColor="lightgray" style={{
                                height: 40, fontSize: 16, width: "65%", backgroundColor: "white",
                                borderRadius: 10, padding: 10, shadowColor: "lightgray", shadowOffset: { width: 1, height: 2 },
                                shadowOpacity: 0.3, shadowRadius: 3
                            }} />
                            <TextInput value={expensePrice} onChangeText={setExpensePrice} keyboardType="numeric" style={{
                                height: 40, fontSize: 16, width: "30%", backgroundColor: "white",
                                borderRadius: 10, padding: 10, shadowColor: "lightgray", shadowOffset: { width: 1, height: 2 },
                                shadowOpacity: 0.3, shadowRadius: 3
                            }} />
                        </View>

                        <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 15, gap: 30 }}>
                            <TouchableOpacity onPress={resetHistory} style={{
                                backgroundColor: "red", height: 35, width: 70, alignItems: "center",
                                justifyContent: "center", borderRadius: 10
                            }}>
                                <Text style={{ fontSize: 12, color: "white", fontWeight: "700" }}>CANCEL</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={addHistory} style={{
                                backgroundColor: "green", height: 35, width: 70, alignItems: "center",
                                justifyContent: "center", borderRadius: 10
                            }}>
                                <Text style={{ fontSize: 12, color: "white", fontWeight: "700" }}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
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