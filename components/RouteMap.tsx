import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Button } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import axios from 'axios';
import polyline from 'polyline';

const apiKey = 'AIzaSyANe_6bk7NDht5ECPAtRQ1VZARSHBMlUTI';

const RouteMap = ({ origin, destination, style, onModeChange }) => {
    const [coordinates, setCoordinates] = useState([]);
    const [mode, setMode] = useState('driving'); // Can use 'walking', 'driving', 'bicycling', and 'transit'

    useEffect(() => {
        setCoordinates([]);
        getRoute(origin, destination, mode);
    }, [origin, destination, mode]);

const getRoute = async (origin, destination, mode) => {
    try {
        // The API Call
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&mode=${mode}&alternatives=true&key=${apiKey}`;

        // Make the request
        const response = await axios.get(url);

            // Is it a valid route?
            if (response.data.routes.length > 0) {
                const points = decodePolyline(response.data.routes[0].overview_polyline.points);
                setCoordinates(points);
            } else {
                // TODO: Need a way to show no route
                Alert.alert('Error', 'No route found');
            }
        } catch (error) {
            // TODO: Need something to handle errors
            console.error(error);
            Alert.alert('Error', 'Failed to fetch route');
        }
    };

    const decodePolyline = (encoded) => {
        // Figure out location
        return polyline.decode(encoded).map(point => ({
            latitude: point[0],
            longitude: point[1]
        }));
    };

    // To have different modes of transport
    const handleModeChange = (newMode) => {
        setMode(newMode);
        onModeChange(newMode);
    };

    return (
        <View style={styles.container}>
            {/* Display the map */}
            <MapView
                provider={PROVIDER_GOOGLE}
                style={[styles.map, style]}
                initialRegion={{
                    latitude: (origin.latitude + destination.latitude) / 2,
                    longitude: (origin.longitude + destination.longitude) / 2,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}>

                {/* Markers for Origin and Destination */}
                <Marker coordinate={origin} title="Origin" />
                <Marker coordinate={destination} title="Destination" />

                {/* Route Line */}
                {coordinates.length > 0 && (
                    <Polyline
                        coordinates={coordinates}
                        strokeColor="#FF5733"
                        strokeWidth={6}
                    />
                )}
            </MapView>

    {/* Transportation Mode Buttons */}
    <View style={styles.buttonContainer}>
        <Button title="Driving" onPress={() => handleModeChange('driving')} />
        <Button title="Walking" onPress={() => handleModeChange('walking')} />
        <Button title="Transit" onPress={() => handleModeChange('transit')} />
        <Button title="Bicycling" onPress={() => handleModeChange('bicycling')} />
        // TODO: transit_mode: 'bus|subway|train'
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: '#fff',
    },

    map: {
        flex: 1,
    },

    buttonContainer: {
        position: 'absolute',
        left: 10,
        right: 10,
        top: 300,
        bottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default RouteMap;
