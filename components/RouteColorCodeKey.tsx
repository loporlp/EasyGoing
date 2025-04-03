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

    return (
        <View>
            <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                <Text style={styles.buttonText}>Show Route Colors</Text>
            </TouchableOpacity>
            
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.headerText}>Route Colors</Text>
                        {Object.entries(routeColors).map(([mode, color], index) => (
                            <View key={index} style={styles.routeItem}>
                                <View style={{ ...styles.colorBlock, backgroundColor: color }} />
                                <Text style={styles.routeText}>{mode}</Text>
                            </View>
                        ))}
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
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#24a6ad',
        borderRadius: 10,
        shadowColor: '#333333',
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        alignItems: 'center',
        alignSelf: 'center',
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
        backgroundColor: 'white',
        padding: 20,
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
        width: 20,
        height: 20,
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