import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

const RouteColorCodeKey = () => {
    const [modalVisible, setModalVisible] = useState(false);

    const routeColors = {
        Driving: '#FF0000', // Red
        Walking: '#0000FF', // Blue
        Biking: '#00FF00', // Green
        Transit: '#800080', // Purple
        Bus: '#006400', // Dark Green
        Train: '#800000', // Maroon
        Subway: '#000080', // Navy
        Tram: '#808080', // Gray
        Ferry: '#40E0D0', // Turquoise
    };

    const renderTransportIcon = (mode: string) => {
        switch (mode) {
            case "Driving":
                return <Ionicons name="car" size={24} color={"white"} />;
            case "Walking":
                return <MaterialIcons name="directions-walk" size={24} color={"white"} />;
            case "Biking":
                return <Ionicons name="bicycle" size={24} color={"white"} />;
            case "Transit":
                return <MaterialCommunityIcons name="dots-horizontal" size={24} color={"white"} />;
            case "Bus":
                return <MaterialCommunityIcons name="bus" size={24} color={"white"} />;
            case "Train":
                return <MaterialCommunityIcons name="train" size={24} color={"white"} />;
            case "Subway":
                return <MaterialCommunityIcons name="subway" size={24} color={"white"} />;
            case "Tram":
                return <MaterialCommunityIcons name="tram" size={24} color={"white"} />;
            case "Ferry":
                return <MaterialCommunityIcons name="ferry" size={24} color={"white"} />;
            default:
                return null;
        }
    }

    return (
        <View>
            <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                <Ionicons name={"list"} size={20} color={"white"} />
            </TouchableOpacity>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.headerText}>Route Colors</Text>
                        <View style={{flexDirection: "column", alignItems: "flex-start"}}>
                            {Object.entries(routeColors).map(([mode, color], index) => (
                                <View key={index} style={styles.routeItem}>
                                    <View style={{ ...styles.colorBlock, backgroundColor: color, justifyContent: "center", alignItems: "center" }}>
                                        {renderTransportIcon(mode)}
                                    </View>
                                    <Text style={styles.routeText}>{mode}</Text>
                                </View>
                            ))}
                        </View>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.buttonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    button: {
        position: "absolute",
        zIndex: 1,
        backgroundColor: "#24a6ad",
        height: 24,
        width: 24,
        right: 20,
        bottom: 15,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5
    },

    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        flexDirection: "column",
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    routeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    routeText: {
        fontSize: 16,
    },
    colorBlock: {
        width: 28,
        height: 28,
        marginRight: 12,
        borderRadius: 50,
    },
    closeButton: {
        marginTop: 15,
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#24a6ad',
        borderRadius: 10,
        alignItems: 'center',
        alignSelf: 'center',
    }
});

export default RouteColorCodeKey;