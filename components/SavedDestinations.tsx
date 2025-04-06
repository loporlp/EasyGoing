// SavedDestinations.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DynamicImage from '../components/DynamicImage';
import { SwipeListView } from 'react-native-swipe-list-view';

interface SavedDestinationsProps {
  SavedDestinations: any[];
  handlePress: (destination: any) => void;
  deleteLocation: (index: number) => void;
}

const SavedDestinations: React.FC<SavedDestinationsProps> = ({ SavedDestinations, handlePress, deleteLocation }) => {
  const [swipeStatus, setSwipeStatus] = useState<{ [key: string]: boolean }>({});

  // Function to handle swipe state
  const handleSwipeChange = (swipeData: any) => {
    const { key, value } = swipeData;
        if (value !== 0) {
            setSwipeStatus((prevState) => ({ ...prevState, [key]: true }));
        } else {
            setSwipeStatus((prevState) => ({ ...prevState, [key]: false }));
        }
  };

  const renderHiddenItem = ({ item, index }: { item: any; index: number }) => (
    <View style={[styles.hiddenItem, { height: 100 }]}>
        <TouchableOpacity onPressIn={() => deleteLocation(index)} style={[styles.deleteButton]}>
            <Ionicons name="trash-bin" size={25} color={"white"} />
        </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }: any) => {
    const isSwiped = swipeStatus[item.key];
        return (
        <TouchableOpacity
            style={[styles.destination, { flexDirection: "row", alignItems: "center", borderRadius: isSwiped ? 0 : 10 }]}
            onPress={() => handlePress(item)}
        >
            <DynamicImage placeName={item.destination} containerStyle={styles.destinationImage} imageStyle={styles.destinationImage} />
            <View style={{ flexDirection: "column", justifyContent: "flex-start", gap: 5, marginLeft: 10, paddingRight: 140 }}>
                <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                    <Ionicons name="location" size={20} color={"#24a6ad"} />
                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 20, fontWeight: "700", marginLeft: 5 }}>{item.destination}</Text>
                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginRight: 5, gap: 5, width: "100%" }}>
                    <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                        <Ionicons name="time" size={18} color={"#24a6ad"} />
                        <Text style={{ marginLeft: 5 }}>{item.time}</Text>
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Ionicons name="star" size={18} color={"gold"} />
                        <Text>{item.review}</Text>
                    </View>

                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                        <Text>{item.price}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
  };

  const rightOpenValue = -75;

  return (
    <SwipeListView
      data={SavedDestinations.map((item, index) => ({ ...item, key: `${index}` }))}
      renderItem={renderItem}
      renderHiddenItem={renderHiddenItem}
      leftOpenValue={rightOpenValue}
      rightOpenValue={rightOpenValue}
      friction={60}
      tension={30}
      onSwipeValueChange={handleSwipeChange}
    />
  );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1, // Allows ScrollView to grow and be scrollable
        backgroundColor: '#f4f4f4',
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

    destination: {
        backgroundColor: "white",
        width: "100%",
        height: 100,
        marginBottom: 10,
        borderRadius: 10,
        shadowColor: "#333333",
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },

    destinationImage: {
        width: 100,
        height: 100,
        resizeMode: "cover",
        overflow: "hidden",
        borderRadius: 10,
        marginLeft: -30
    },

    hiddenItem: {
        backgroundColor: "white",
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: 'center',
        borderRadius: 10,
        width: "100%",
        marginBottom: 10,
    },

    deleteButton: {
        backgroundColor: "red",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        width: '20%',
    },

    editButton: {
        backgroundColor: "#24a6ad",
        height: "100%",
        paddingHorizontal: 15,
        justifyContent: "center",
        alignItems: "center",
    },

    text: {
        color: "black",
        fontSize: 20,
        marginTop: 14,
    },
});

export default SavedDestinations;
